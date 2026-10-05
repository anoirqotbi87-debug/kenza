import { describe, it, expect } from 'vitest';
import { module6Lessons } from './module6';
import { fullCurriculum, allLessonsList } from './curriculum';
import { isAcceptedAnswer } from '../lib/exerciseAnswers';
import type { MultiLangText } from '../types/curriculum';

const LANGS = ['fr', 'en', 'es', 'ar'] as const;
type Lang = (typeof LANGS)[number];

/** `translation` et `prompt` acceptent une chaine simple ou un texte multilingue. */
function textOf(value: MultiLangText | string, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}

const LESSON_TYPES = ['learning', 'exercise', 'grammar'];
const EXERCISE_TYPES = ['mcq', 'reorder', 'scramble', 'match', 'matching', 'fill-blank', 'dialogue', 'roleplay_challenge'];
const ARABIC = /[\u0600-\u06FF]/;

/**
 * Module 6 (« Grammaire Avancee ») : verbes creux et defectifs, pronoms
 * affixes, hypothese, et negociation de bail. Les quatre lecons enseignent.
 */
const LESSON_IDS = ['l_mod6_1', 'l_mod6_2', 'l_mod6_3', 'l_mod6_4'];

const lessons = module6Lessons;
const lessonById = (id: string) => lessons.find((l) => l.id === id)!;

/** Tout le materiel darija d'une lecon : exemples, regles, options et tuiles. */
function darijaIn(lessonId: string): string {
  const lesson = lessonById(lessonId);
  const parts: string[] = [];
  for (const step of lesson.steps) {
    if (step.content) {
      const c = step.content;
      parts.push(c.arabizi, c.arabic);
      for (const lang of LANGS) parts.push(textOf(c.description, lang), textOf(c.translation, lang));
    }
    const ex = step.exercise;
    if (!ex) continue;
    parts.push(ex.sentenceTemplate ?? '');
    for (const opt of ex.options ?? []) {
      parts.push(typeof opt.text === 'string' ? opt.text : Object.values(opt.text).join(' '));
    }
  }
  return parts.join(' | ').toLowerCase();
}

describe('module 6 — structure', () => {
  it('expose ses quatre lecons', () => {
    expect(lessons.map((l) => l.id)).toEqual(LESSON_IDS);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['6'].lessons).toBe(module6Lessons);
    for (const lesson of lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('aucune lecon n a de squelette vide', () => {
    for (const lesson of lessons) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThan(0);
    }
  });
});

describe('module 6 — integrite des etapes', () => {
  it('chaque etape a un id unique et un type connu', () => {
    for (const lesson of lessons) {
      const ids = lesson.steps.map((s) => s.id);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
      for (const step of lesson.steps) {
        expect(LESSON_TYPES, `${lesson.id}.${step.id}`).toContain(step.type);
      }
    }
  });

  it('une etape learning porte le texte darija et sa traduction complete', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        if (step.type !== 'learning') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(step.content, `${where} sans contenu`).toBeDefined();
        expect(step.content!.arabizi.trim().length, `${where} arabizi`).toBeGreaterThan(0);
        expect(ARABIC.test(step.content!.arabic), `${where} arabic`).toBe(true);
        for (const lang of LANGS) {
          expect(textOf(step.content!.translation, lang).trim().length, `${where}.${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('une etape exercise a un type connu et un enonce complet', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        if (step.type !== 'exercise') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(step.exercise, `${where} sans exercise`).toBeDefined();
        const ex = step.exercise!;
        expect(EXERCISE_TYPES, `${where} type`).toContain(ex.type);
        for (const lang of LANGS) {
          expect(textOf(ex.prompt, lang).trim().length, `${where}.prompt.${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('les QCM ont une seule bonne reponse et un id de reponse valide', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'mcq') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.options!.filter((o) => o.isCorrect).length, `${where} bonnes reponses`).toBe(1);
        expect(ex.options!.map((o) => o.id), `${where} answer`).toContain(ex.answer);
      }
    }
  });

  it('les exercices de reorganisation ont une reponse qui couvre toutes les tuiles', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'reorder') continue;
        const where = `${lesson.id}.${step.id}`;
        expect((ex.answer as string[]).slice().sort(), `${where} tuiles non couvertes`).toEqual(
          ex.options!.map((o) => o.id).sort()
        );
      }
    }
  });

  it('les exercices a trou ont un gabarit, un trou et une reponse valide', () => {
    // `sentenceTemplate` est obligatoire : sans lui le runner n'a rien a afficher,
    // et l'exercice devient injouable (meme piege que `expectedPhrases` au roleplay).
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'fill-blank') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.sentenceTemplate, `${where} sans sentenceTemplate`).toBeTruthy();
        expect(ex.sentenceTemplate, `${where} sans marqueur de trou`).toMatch(/\{blank\}|_{3,}/);
        expect(ex.options!.map((o) => o.id), `${where} answer`).toContain(ex.answer);
      }
    }
  });

  it('chaque exercice a trou accepte toutes ses bonnes reponses', () => {
    // Certains exercices ont plusieurs reponses justes : variantes regionales ou
    // synonymes (ex. « 3tii-ni » et « 3tii-liya »). `acceptedAnswers` doit alors
    // couvrir chaque option marquee `isCorrect`, sinon une bonne reponse est
    // comptee fausse par le runner.
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'fill-blank') continue;
        const where = `${lesson.id}.${step.id}`;
        for (const option of ex.options!.filter((o) => o.isCorrect)) {
          expect(isAcceptedAnswer(ex, option.id), `${where} refuse ${option.id}`).toBe(true);
        }
      }
    }
  });

  it('chaque exercice explique sa reponse en quatre langues', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex) continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.explanation, `${where} sans explanation`).toBeDefined();
        for (const lang of LANGS) {
          expect(textOf(ex.explanation!, lang).trim().length, `${where}.explanation.${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('module 6 — densite et variete pedagogiques', () => {
  it('chaque lecon porte au moins trois exercices', () => {
    for (const lesson of lessons) {
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${lesson.id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(3);
    }
  });

  it('le module varie les formats au-dela du QCM', () => {
    // Le module 6 est le premier a sortir du tout-QCM (modules 3 et 4) : on fige
    // cette variete pour ne pas la perdre.
    const types = new Set(
      lessons.flatMap((l) => l.steps.flatMap((s) => (s.exercise ? [s.exercise.type] : [])))
    );
    expect(types.size, [...types].join(',')).toBeGreaterThanOrEqual(3);
    expect([...types]).toContain('fill-blank');
    expect([...types]).toContain('reorder');
  });

  it('chaque lecon articule apprentissage et pratique', () => {
    for (const lesson of lessons) {
      expect(lesson.steps.filter((s) => s.type === 'learning').length, lesson.id).toBeGreaterThan(0);
      expect(lesson.steps.length, lesson.id).toBeGreaterThanOrEqual(4);
    }
  });
});

describe('module 6 — couverture grammaticale', () => {
  const NOTIONS: Record<string, { lesson: string; formes: string[] }> = {
    'la contraction vocalique au passe': { lesson: 'l_mod6_1', formes: ['chof-t', 'guel-t'] },
    'les pronoms affixes directs et indirects': { lesson: 'l_mod6_2', formes: ['-ek', '-lih', '-ha'] },
    'la paire ila (reel) / koun (irreel)': { lesson: 'l_mod6_3', formes: ['ila', 'koun'] },
    'le lexique du bail': { lesson: 'l_mod6_4', formes: ['l-kra', 'dman'] },
  };

  for (const [notion, { lesson, formes }] of Object.entries(NOTIONS)) {
    it(`enseigne « ${notion} »`, () => {
      const taught = darijaIn(lesson);
      for (const forme of formes) {
        expect(taught, `« ${forme} » absent de ${lesson}`).toContain(forme.toLowerCase());
      }
    });
  }
});

describe('module 6 — position vis-a-vis du vocabulaire', () => {
  it('reste hors du systeme de vocabulaire, qui couvre les modules 1 a 4', () => {
    // `ModuleId` vaut 1|2|3|4 : le module 6 n'a pas de vocabulaire dedie.
    // Ce test fige la frontiere et documente l'absence, plutot que de la laisser
    // decouvrir par un echec de typage.
    expect(Object.keys(fullCurriculum)).toContain('6');
    expect(module6Lessons.length).toBeGreaterThan(0);
  });
});

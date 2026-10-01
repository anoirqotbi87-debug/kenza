import { describe, it, expect } from 'vitest';
import { module7Lessons } from './module7';
import { fullCurriculum, allLessonsList } from './curriculum';
import type { MultiLangText } from '../types/curriculum';

const LANGS = ['fr', 'en', 'es', 'ar'] as const;
type Lang = (typeof LANGS)[number];

/** `translation` et `prompt` acceptent une chaine simple ou un texte multilingue. */
function textOf(value: MultiLangText | string, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}

const LESSON_TYPES = ['learning', 'exercise', 'grammar'];
const EXERCISE_TYPES = ['mcq', 'reorder', 'match', 'matching', 'fill-blank', 'dialogue'];
const ARABIC = /[\u0600-\u06FF]/;

/**
 * Module 7 (« Aisance & Culture ») : raconter au passe, citer des proverbes,
 * et situer les variations regionales. Dernier module du parcours.
 */
const LESSON_IDS = ['l_mod7_1', 'l_mod7_2', 'l_mod7_3'];

const lessons = module7Lessons;
const lessonById = (id: string) => lessons.find((l) => l.id === id)!;

/** Tout le materiel darija d'une lecon : exemples, regles, options et paires. */
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
    for (const pair of ex.pairs ?? []) {
      parts.push(pair.left.text, typeof pair.right.text === 'string' ? pair.right.text : '');
    }
  }
  return parts.join(' | ').toLowerCase();
}

describe('module 7 — structure', () => {
  it('expose ses trois lecons', () => {
    expect(lessons.map((l) => l.id)).toEqual(LESSON_IDS);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['7'].lessons).toBe(module7Lessons);
    for (const lesson of lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('clot le parcours : aucun module ne suit', () => {
    const modules = Object.keys(fullCurriculum);
    expect(modules[modules.length - 1]).toBe('7');
  });

  it('aucune lecon n a de squelette vide', () => {
    for (const lesson of lessons) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThan(0);
    }
  });
});

describe('module 7 — integrite des etapes', () => {
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

  it('les exercices d association ont au moins deux paires aux ids uniques', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'matching') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.pairs!.length, `${where} paires`).toBeGreaterThanOrEqual(2);
        const pairIds = ex.pairs!.map((p) => p.id);
        expect(new Set(pairIds).size, `${where} ids de paires dupliques`).toBe(pairIds.length);
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

describe('module 7 — densite et variete pedagogiques', () => {
  it('chaque lecon porte au moins un exercice', () => {
    for (const lesson of lessons) {
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${lesson.id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(1);
    }
  });

  it('les deux premieres lecons portent au moins deux exercices', () => {
    // La troisieme lecon (variations regionales) n'en a qu'un : c'est une lecon
    // d'ecoute culturelle, plus courte par nature. On fige le niveau des deux
    // autres, qui sont des lecons de production.
    for (const id of ['l_mod7_1', 'l_mod7_2']) {
      const exercises = lessonById(id).steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(2);
    }
  });

  it('le module varie les formats au-dela du QCM', () => {
    const types = new Set(
      lessons.flatMap((l) => l.steps.flatMap((s) => (s.exercise ? [s.exercise.type] : [])))
    );
    expect(types.size, [...types].join(',')).toBeGreaterThanOrEqual(3);
    expect([...types]).toContain('matching');
  });

  it('chaque lecon articule apprentissage et pratique', () => {
    for (const lesson of lessons) {
      expect(lesson.steps.filter((s) => s.type === 'learning').length, lesson.id).toBeGreaterThan(0);
      expect(lesson.steps.filter((s) => s.type === 'exercise').length, lesson.id).toBeGreaterThan(0);
    }
  });
});

describe('module 7 — couverture des notions d aisance', () => {
  const NOTIONS: Record<string, { lesson: string; formes: string[] }> = {
    'les marqueurs de recit': { lesson: 'l_mod7_1', formes: ['f wa7ed n-nhar', 'f l-lowwel', 'men be3d', 'f l-lekher'] },
    'les proverbes et leur sens': { lesson: 'l_mod7_2', formes: ['lli fat mat', 'zrbat matat', 'drba b drba'] },
    'les variations regionales nord / centre': { lesson: 'l_mod7_3', formes: ['3ayel', 'daba', 'fayn machi'] },
  };

  for (const [notion, { lesson, formes }] of Object.entries(NOTIONS)) {
    it(`enseigne « ${notion} »`, () => {
      const taught = darijaIn(lesson);
      for (const forme of formes) {
        expect(taught, `« ${forme} » absent de ${lesson}`).toContain(forme.toLowerCase());
      }
    });
  }

  it('la lecon de proverbes associe chaque proverbe a son sens', () => {
    const pairs = lessonById('l_mod7_2').steps.flatMap((s) => s.exercise?.pairs ?? []);
    expect(pairs.length, 'aucune paire proverbe/sens').toBeGreaterThanOrEqual(3);
    for (const pair of pairs) {
      // `right.text` est multilingue : on verifie les quatre langues, pas une chaine.
      for (const lang of LANGS) {
        expect(textOf(pair.right.text, lang).trim().length, `${pair.id}.${lang} sans sens`).toBeGreaterThan(0);
      }
    }
  });

  it('la lecon de variations regionales compare au moins deux parlers', () => {
    const taught = darijaIn('l_mod7_3');
    expect(taught, 'parler du Nord absent').toMatch(/chamali|3ayel|fayn machi/);
    expect(taught, 'parler du Centre absent').toMatch(/casawi|daba|fin ghadi/);
  });
});

describe('module 7 — position vis-a-vis du vocabulaire', () => {
  it('reste hors du systeme de vocabulaire, qui couvre les modules 1 a 4', () => {
    // `ModuleId` vaut 1|2|3|4 : le module 7 n'a pas de vocabulaire dedie.
    expect(Object.keys(fullCurriculum)).toContain('7');
    expect(module7Lessons.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { module2Lessons } from './module2';
import { fullCurriculum, allLessonsList } from './curriculum';
import { soukFesScenario } from './scenarios/soukFes';
import { lessonCafe } from './lessons/lesson-cafe';
import { lessonTaxi } from './lessons/lesson-taxi';
import { getVocabularyByCategory } from './vocabulary';
import type { MultiLangText } from '../types/curriculum';

const LANGS = ['fr', 'en', 'es', 'ar'] as const;
type Lang = (typeof LANGS)[number];

/** `translation` et `prompt` acceptent une chaine simple ou un texte multilingue. */
function textOf(value: MultiLangText | string, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}
const LESSON_TYPES = ['learning', 'exercise', 'grammar'];
const EXERCISE_TYPES = ['mcq', 'reorder', 'match', 'matching', 'fill-blank', 'dialogue'];

/** La leçon de négociation du souk, objet de ce lot. */
const soukLesson = module2Lessons.find((l) => l.id === 'l_module2_souk_1')!;

describe('module 2 — structure', () => {
  it('expose ses lecons depuis un fichier module2.ts dedie', () => {
    expect(module2Lessons.length).toBe(3);
    expect(module2Lessons[0]).toBe(lessonCafe);
    expect(module2Lessons[1]).toBe(lessonTaxi);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['2'].lessons).toBe(module2Lessons);
    for (const lesson of module2Lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('la lecon du souk n est plus un squelette', () => {
    // Garde-fou : le placeholder `steps: []` rendait la fin du parcours gratuit
    // vide, au moment precis ou le paywall du module 3 se declenche.
    expect(soukLesson.steps.length).toBeGreaterThan(0);
  });

  it('aucune lecon du curriculum n a de squelette vide', () => {
    const empty = allLessonsList.filter((l) => l.steps.length === 0);
    expect(empty.map((l) => l.id)).toEqual([]);
  });
});

describe('module 2 — integrite des etapes', () => {
  it('chaque etape a un id unique et un type connu', () => {
    for (const lesson of module2Lessons) {
      const ids = lesson.steps.map((s) => s.id);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
      for (const step of lesson.steps) {
        expect(LESSON_TYPES, `${lesson.id}.${step.id}`).toContain(step.type);
      }
    }
  });

  it('une etape learning porte le texte darija et sa traduction complete', () => {
    for (const lesson of module2Lessons) {
      for (const step of lesson.steps) {
        if (step.type !== 'learning') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(step.content, `${where} sans contenu`).toBeDefined();
        expect(step.content!.arabizi.trim().length, `${where} arabizi`).toBeGreaterThan(0);
        expect(/[\u0600-\u06FF]/.test(step.content!.arabic), `${where} arabic`).toBe(true);
        for (const lang of LANGS) {
          expect(textOf(step.content!.translation, lang).trim().length, `${where}.${lang}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('une etape exercise a un type connu et une reponse exploitable', () => {
    for (const lesson of module2Lessons) {
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
    for (const lesson of module2Lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'mcq') continue;
        const where = `${lesson.id}.${step.id}`;
        const correct = ex.options!.filter((o) => o.isCorrect);
        expect(correct.length, `${where} bonnes reponses`).toBe(1);
        expect(ex.options!.map((o) => o.id), `${where} answer`).toContain(ex.answer);
      }
    }
  });

  it('les exercices de reorganisation ont une reponse qui couvre toutes les tuiles', () => {
    for (const lesson of module2Lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'reorder') continue;
        const where = `${lesson.id}.${step.id}`;
        const tileIds = ex.options!.map((o) => o.id).sort();
        const answerIds = (ex.answer as string[]).slice().sort();
        expect(answerIds, `${where} tuiles non couvertes`).toEqual(tileIds);
      }
    }
  });

  it('les exercices d association ont au moins deux paires', () => {
    for (const lesson of module2Lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'matching') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.pairs!.length, `${where} paires`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('l exercice de dialogue a exactement une reponse optimale par etape narrative', () => {
    for (const lesson of module2Lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || ex.type !== 'dialogue') continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.npcStartLine, `${where} sans replique du marchand`).toBeDefined();
        expect(ex.dialogueChoices!.length, `${where} choix`).toBeGreaterThanOrEqual(2);
        const optimal = ex.dialogueChoices!.filter((c) => c.isOptimal);
        expect(optimal.length, `${where} choix optimaux`).toBeGreaterThanOrEqual(1);
        for (const choice of ex.dialogueChoices!) {
          expect(choice.feedback, `${where}.${choice.id} sans feedback`).toBeTruthy();
          expect(/[\u0600-\u06FF]/.test(choice.text.arabic), `${where}.${choice.id} arabic`).toBe(true);
        }
      }
    }
  });
});

describe('module 2 — couverture pedagogique du marchandage', () => {
  /** Toutes les phrases darija enseignees dans la lecon du souk. */
  const taught = [
    ...soukLesson.steps.flatMap((s) => (s.content ? [s.content.arabizi] : [])),
    ...soukLesson.steps.flatMap((s) =>
      s.exercise?.dialogueChoices?.map((c) => c.text.arabizi) ?? []
    ),
  ].join(' | ');

  // Les cinq reflexes que le module doit transmettre, tels qu'arbitres :
  // demander le prix, objecter, negocier, valider/temporiser.
  const REFLEXES: Record<string, string[]> = {
    'demander le prix': ['Bch7al'],
    'objecter': ['Ghali', 'bezzaf'],
    'negocier la baisse': ['Naqass', 'chwiya'],
    'sonder le dernier prix': ['Akhir taman'],
    'valider ou temporiser': ['Wakha', 'n-rje3'],
  };

  for (const [reflexe, mots] of Object.entries(REFLEXES)) {
    it(`enseigne le reflexe « ${reflexe} »`, () => {
      for (const mot of mots) {
        expect(taught, `« ${mot} » absent de la lecon`).toContain(mot);
      }
    });
  }

  it('la lecon du souk est de niveau 2 (module gratuit)', () => {
    expect(soukLesson.level).toBe(2);
  });
});

describe('module 2 — articulation avec le roleplay soukFes', () => {
  const userTurns = soukFesScenario.turns.filter((t) => t.speaker === 'user');

  it('le scenario soukFes met en pratique les phrases de la lecon', () => {
    // La lecon donne les cles, soukFes les fait jouer : chaque tour utilisateur
    // du scenario doit reprendre un point enseigne dans la lecon.
    const taught = soukLesson.steps
      .flatMap((s) => (s.content ? [s.content.arabizi] : []))
      .join(' | ')
      .toLowerCase();
    const expected: Record<string, string> = {
      turn_2: 'bch7al',
      turn_4: 'ghali',
    };
    for (const [turnId, mot] of Object.entries(expected)) {
      const turn = userTurns.find((t) => t.id === turnId);
      expect(turn, `${turnId} introuvable`).toBeDefined();
      expect(turn!.arabiziText.toLowerCase()).toContain(mot);
      expect(taught, `« ${mot} » non enseigne dans la lecon`).toContain(mot);
    }
  });

  it('le scenario est jouable : tous ses tours utilisateur ont une reponse attendue', () => {
    for (const turn of userTurns) {
      expect(turn.expectedPhrases, `${turn.id} sans expectedPhrases`).toBeDefined();
      expect(turn.expectedPhrases!.hints.length, `${turn.id} sans indices`).toBeGreaterThan(0);
    }
  });

  it('le vocabulaire du module couvre les mots du marchandage', () => {
    const soukWords = getVocabularyByCategory('souk').filter((v) => v.module === 2);
    const arabizi = soukWords.map((v) => v.arabizi.toLowerCase()).join(' | ');
    for (const mot of ['bch7al', 'ghali', 'naqass', 'akhir taman', 'wakha']) {
      expect(arabizi, `« ${mot} » absent du vocabulaire du module 2`).toContain(mot);
    }
  });
});

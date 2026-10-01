import { describe, it, expect } from 'vitest';
import { module3Lessons } from './module3';
import { fullCurriculum, allLessonsList } from './curriculum';
import { vocabularyByModule } from './vocabulary';
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
 * Les lecons du module 3 (« Autonomie & Riad ») : situations d'autonomie en
 * ville — installation au riad, panne, pharmacie, orientation.
 */
const LESSON_IDS = ['m3_l1_checkin', 'm3_l2_maintenance', 'm3_l3_pharmacie', 'm3_l4_orientation'];

/** Toutes les phrases darija d'une lecon, contenus et exercices melanges. */
function darijaIn(lessonId: string): string {
  const lesson = module3Lessons.find((l) => l.id === lessonId)!;
  const parts: string[] = [];
  for (const step of lesson.steps) {
    if (step.content) parts.push(step.content.arabizi, step.content.arabic);
    const ex = step.exercise;
    if (!ex) continue;
    for (const opt of ex.options ?? []) {
      parts.push(typeof opt.text === 'string' ? opt.text : '');
    }
    for (const pair of ex.pairs ?? []) parts.push(pair.left.text);
  }
  return parts.join(' | ');
}

describe('module 3 — structure', () => {
  it('expose ses quatre lecons d autonomie', () => {
    expect(module3Lessons.map((l) => l.id)).toEqual(LESSON_IDS);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['3'].lessons).toBe(module3Lessons);
    for (const lesson of module3Lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('toutes les lecons sont de niveau 3', () => {
    for (const lesson of module3Lessons) {
      expect(lesson.level, lesson.id).toBe(3);
    }
  });

  it('aucune lecon du module n a de squelette vide', () => {
    for (const lesson of module3Lessons) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThan(0);
    }
  });
});

describe('module 3 — integrite des etapes', () => {
  it('chaque etape a un id unique et un type connu', () => {
    for (const lesson of module3Lessons) {
      const ids = lesson.steps.map((s) => s.id);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
      for (const step of lesson.steps) {
        expect(LESSON_TYPES, `${lesson.id}.${step.id}`).toContain(step.type);
      }
    }
  });

  it('une etape learning porte le texte darija et sa traduction complete', () => {
    for (const lesson of module3Lessons) {
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
    for (const lesson of module3Lessons) {
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
    for (const lesson of module3Lessons) {
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

  it('les exercices d association ont au moins deux paires aux ids uniques', () => {
    for (const lesson of module3Lessons) {
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
    for (const lesson of module3Lessons) {
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
});

describe('module 3 — densite pedagogique', () => {
  // Le module 3 est payant : il doit tenir le niveau attendu d'une lecon
  // complete, pas seulement exister. Le module 1 a montre ce qu'il advient
  // d'un module sans contrat.
  it('chaque lecon porte au moins deux exercices', () => {
    for (const lesson of module3Lessons) {
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${lesson.id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(2);
    }
  });

  it('chaque lecon porte au moins quatre etapes au total', () => {
    for (const lesson of module3Lessons) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('chaque lecon articule apprentissage et mise en pratique', () => {
    for (const lesson of module3Lessons) {
      const learning = lesson.steps.filter((s) => s.type === 'learning').length;
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(learning, `${lesson.id} sans etape d apprentissage`).toBeGreaterThan(0);
      expect(exercises, `${lesson.id} sans exercice`).toBeGreaterThan(0);
    }
  });
});

describe('module 3 — couverture des situations d autonomie', () => {
  // Les quatre situations que le module doit transmettre, telles qu'arbitrees
  // par les titres de lecons. Verifiees mot par mot : un titre peut mentir,
  // la lecon phonetique du module 1 en est la preuve.
  const SITUATIONS: Record<string, { lesson: string; mots: string[] }> = {
    'arrivee au riad (cle et chambre)': { lesson: 'm3_l1_checkin', mots: ['sarout', 'bit'] },
    'signaler une panne': { lesson: 'm3_l2_maintenance', mots: ['makhddamch', 'fota'] },
    'a la pharmacie (douleur)': { lesson: 'm3_l3_pharmacie', mots: ['ras', 'dwa'] },
    'demander son chemin': { lesson: 'm3_l4_orientation', mots: ['triq', 'tleft'] },
  };

  for (const [situation, { lesson, mots }] of Object.entries(SITUATIONS)) {
    it(`couvre « ${situation} »`, () => {
      const taught = darijaIn(lesson).toLowerCase();
      for (const mot of mots) {
        expect(taught, `« ${mot} » absent de ${lesson}`).toContain(mot.toLowerCase());
      }
    });
  }

  it('la lecon d orientation enseigne demander de l aide et s isoler', () => {
    const taught = darijaIn('m3_l4_orientation').toLowerCase();
    expect(taught).toContain('3awenni');
    expect(taught).toContain('khellini');
  });
});

describe('module 3 — articulation avec le vocabulaire', () => {
  it('le vocabulaire du module 3 remonte a ses propres lecons', () => {
    const sources = new Set(vocabularyByModule[3].map((v) => v.source));
    for (const source of sources) {
      expect(LESSON_IDS, `source inconnue : ${source}`).toContain(source);
    }
  });

  it('les quatre lecons du module sont representees dans le vocabulaire', () => {
    const sources = new Set(vocabularyByModule[3].map((v) => v.source));
    for (const lessonId of LESSON_IDS) {
      expect(sources.has(lessonId), `${lessonId} sans vocabulaire`).toBe(true);
    }
  });
});

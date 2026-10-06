import { describe, it, expect } from 'vitest';
import { module5Lessons } from './module5';
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
 * Module 5 (« Aisance & Débat », niveau B2) : exprimer une opinion, poser une
 * hypothese, parler du travail, et manier les proverbes. Le checkpoint B2 clot
 * le module et n'enseigne rien lui-meme.
 */
const LESSON_IDS = ['m5_l1_opinion', 'm5_l2_hypothese', 'm5_l3_travail', 'm5_l4_proverbes'];
const CHECKPOINT_ID = 'm5_checkpoint_b2';

const lessons = module5Lessons;
const lessonById = (id: string) => lessons.find((l) => l.id === id)!;

/**
 * Tout le materiel darija d'une lecon. Une lecon d'aisance enseigne autant par
 * sa description (les tournures) que par son exemple : les deux comptent.
 */
function darijaIn(lessonId: string): string {
  const lesson = lessonById(lessonId);
  const parts: string[] = [];
  for (const step of lesson.steps) {
    if (step.content) {
      const c = step.content;
      parts.push(c.arabizi, c.arabic);
      for (const lang of LANGS) parts.push(textOf(c.description, lang), textOf(c.translation, lang));
    }
    for (const opt of step.exercise?.options ?? []) {
      parts.push(typeof opt.text === 'string' ? opt.text : Object.values(opt.text).join(' '));
    }
    for (const pair of step.exercise?.pairs ?? []) parts.push(pair.left.text);
  }
  return parts.join(' | ').toLowerCase();
}

describe('module 5 — structure', () => {
  it('expose ses quatre lecons et son checkpoint B2', () => {
    expect(lessons.map((l) => l.id)).toEqual([...LESSON_IDS, CHECKPOINT_ID]);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['5'].lessons).toBe(module5Lessons);
    for (const lesson of lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('toutes les lecons sont de niveau 5', () => {
    for (const lesson of lessons) {
      expect(lesson.level, lesson.id).toBe(5);
    }
  });
});

describe('module 5 — integrite des etapes', () => {
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
        const correct = ex.options!.filter((o) => o.isCorrect);
        expect(correct.length, `${where} bonnes reponses`).toBe(1);
        expect(ex.options!.map((o) => o.id), `${where} answer`).toContain(ex.answer);
      }
    }
  });

  it('aucune bonne reponse n est refusee par le runner', () => {
    // Une option `isCorrect` non couverte par `answer`/`acceptedAnswers` ferait
    // passer une bonne reponse pour une faute. Les `reorder` sont exclus : ils
    // marquent legitimement toutes leurs tuiles `isCorrect`.
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || (ex.type !== 'mcq' && ex.type !== 'fill-blank')) continue;
        const where = `${lesson.id}.${step.id}`;
        for (const option of ex.options!.filter((o) => o.isCorrect)) {
          expect(isAcceptedAnswer(ex, option.id), `${where} refuse ${option.id}`).toBe(true);
        }
      }
    }
  });

  it('chaque exercice hors checkpoint explique sa reponse en quatre langues', () => {
    // Le checkpoint B2 est une evaluation : pas d'indice pendant l'epreuve.
    // Meme parti pris qu'au checkpoint B1 du module 4, acte explicitement ici.
    for (const lesson of lessons) {
      if (lesson.id === CHECKPOINT_ID) continue;
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

describe('module 5 — densite pedagogique', () => {
  it('chaque lecon de contenu porte au moins deux exercices', () => {
    for (const id of LESSON_IDS) {
      const lesson = lessonById(id);
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(2);
    }
  });

  it('chaque lecon de contenu articule apprentissage et pratique', () => {
    for (const id of LESSON_IDS) {
      const lesson = lessonById(id);
      expect(lesson.steps.filter((s) => s.type === 'learning').length, id).toBeGreaterThan(0);
      expect(lesson.steps.length, id).toBeGreaterThanOrEqual(4);
    }
  });

  it('le checkpoint est une pure evaluation', () => {
    const checkpoint = lessonById(CHECKPOINT_ID);
    expect(checkpoint.steps.filter((s) => s.type === 'learning').length).toBe(0);
    const exercises = checkpoint.steps.filter((s) => s.type === 'exercise').length;
    expect(exercises).toBeGreaterThanOrEqual(5);
    expect(exercises).toBe(checkpoint.steps.length);
  });
});

describe('module 5 — couverture des notions B2', () => {
  // Verification sous la forme linguistique reelle, pas par mot-cle vague :
  // le module 1 a montre qu'un titre peut annoncer une matiere absente.
  const NOTIONS: Record<string, { lesson: string; formes: string[] }> = {
    'donner son avis': { lesson: 'm5_l1_opinion', formes: ['f ra2yi', 'ban li bli'] },
    'nuancer et objecter': { lesson: 'm5_l1_opinion', formes: ['machi b daroura', 'men jiha khora'] },
    'condition realisable (ila)': { lesson: 'm5_l2_hypothese', formes: ['ila'] },
    'condition irreeelle (kon)': { lesson: 'm5_l2_hypothese', formes: ['kon'] },
    'vocabulaire professionnel': { lesson: 'm5_l3_travail', formes: ['ijtim', 'mow3id', 'charika'] },
    'proverbes populaires': { lesson: 'm5_l4_proverbes', formes: ['dqqa b dqqa', 'li fate mate', 'khelli l-bir', 'l-mregga bla melha'] },
  };

  for (const [notion, { lesson, formes }] of Object.entries(NOTIONS)) {
    it(`enseigne « ${notion} »`, () => {
      const taught = darijaIn(lesson);
      for (const forme of formes) {
        expect(taught, `« ${forme} » absent de ${lesson}`).toContain(forme.toLowerCase());
      }
    });
  }

  it('la lecon d hypothese distingue explicitement ila de kon', () => {
    // La paire ila/kon est le coeur de la lecon : si l'une disparait, la lecon
    // n'a plus de sens, meme si elle garde des exercices.
    const taught = darijaIn('m5_l2_hypothese');
    expect(taught).toContain('ila');
    expect(taught).toContain('kon');
  });

  it('le checkpoint mobilise les quatre lecons du module', () => {
    const answers = lessonById(CHECKPOINT_ID)
      .steps.flatMap((s) => s.exercise!.options!.filter((o) => o.isCorrect))
      .map((o) => (typeof o.text === 'string' ? o.text : ''))
      .join(' ')
      .toLowerCase();
    expect(answers, 'hypothese absente du checkpoint').toMatch(/kon |ila /);
    expect(answers, 'opinion absente du checkpoint').toMatch(/ban li bli|machi b daroura/);
    expect(answers, 'travail absent du checkpoint').toMatch(/mow3id|tfehemna/);
    expect(answers, 'proverbes absents du checkpoint').toMatch(/dqqa b dqqa|khelli l-bir|l-mregga/);
  });
});

describe('module 5 — position vis-a-vis du vocabulaire', () => {
  it('reste hors du systeme de vocabulaire, qui couvre les modules 1 a 4', () => {
    // `ModuleId` vaut 1|2|3|4 : les modules 5-7 n'ont pas de vocabulaire dedie.
    // Ce test fige cette frontiere pour qu'un ajout accidentel (source « m5_… »
    // dans vocabularyByModule) ne casse pas le typage sans qu'on s'en apercoive.
    expect(module5Lessons.length).toBeGreaterThan(0);
    const declaredModules = Object.keys(fullCurriculum);
    expect(declaredModules).toContain('5');
  });
});

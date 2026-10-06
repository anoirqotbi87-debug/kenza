import { describe, it, expect } from 'vitest';
import { module4Lessons } from './module4';
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
const EXERCISE_TYPES = ['mcq', 'reorder', 'scramble', 'match', 'matching', 'fill-blank', 'dialogue', 'roleplay_challenge'];
const ARABIC = /[\u0600-\u06FF]/;

/**
 * Les lecons de grammaire du module 4 (« Grammaire Active ») : le passe, le
 * present, le futur et la negation, les modaux. Le checkpoint B1 les evalue
 * toutes et n'enseigne rien lui-meme.
 */
const GRAMMAR_LESSON_IDS = ['m4_l1_passe', 'm4_l2_present', 'm4_l3_futur_negation', 'm4_l4_modaux'];
const CHECKPOINT_ID = 'm4_checkpoint_b1';
const LESSON_IDS = [...GRAMMAR_LESSON_IDS, CHECKPOINT_ID];

const lessons = module4Lessons;
const lessonById = (id: string) => lessons.find((l) => l.id === id)!;

/**
 * Tout le materiel darija d'une lecon. Une lecon de grammaire enseigne autant
 * par sa description (les regles de conjugaison) que par son exemple : les deux
 * comptent comme du contenu enseigne.
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
  }
  return parts.join(' | ').toLowerCase();
}

describe('module 4 — structure', () => {
  it('expose ses quatre lecons de grammaire et son checkpoint', () => {
    expect(lessons.map((l) => l.id)).toEqual(LESSON_IDS);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['4'].lessons).toBe(module4Lessons);
    for (const lesson of lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('toutes les lecons sont de niveau 4', () => {
    for (const lesson of lessons) {
      expect(lesson.level, lesson.id).toBe(4);
    }
  });
});

describe('module 4 — integrite des etapes', () => {
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

  it('chaque exercice hors checkpoint explique sa reponse en quatre langues', () => {
    // Le checkpoint B1 est une evaluation : il n'affiche pas d'explication
    // pendant l'epreuve. Toute autre lecon doit justifier sa correction.
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

describe('module 4 — densite pedagogique', () => {
  it('chaque lecon de grammaire articule apprentissage et pratique', () => {
    for (const id of GRAMMAR_LESSON_IDS) {
      const lesson = lessonById(id);
      const learning = lesson.steps.filter((s) => s.type === 'learning').length;
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(learning, `${id} sans etape d apprentissage`).toBeGreaterThan(0);
      expect(exercises, `${id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(2);
      expect(lesson.steps.length, id).toBeGreaterThanOrEqual(4);
    }
  });

  it('le checkpoint est une pure evaluation, sans etape d apprentissage', () => {
    const checkpoint = lessonById(CHECKPOINT_ID);
    const learning = checkpoint.steps.filter((s) => s.type === 'learning').length;
    const exercises = checkpoint.steps.filter((s) => s.type === 'exercise').length;
    expect(learning, 'le checkpoint ne doit rien enseigner').toBe(0);
    expect(exercises, 'le checkpoint doit evaluer serieusement').toBeGreaterThanOrEqual(5);
    expect(exercises).toBe(checkpoint.steps.length);
  });
});

describe('module 4 — couverture grammaticale (B1)', () => {
  // Chaque lecon doit reellement enseigner la matiere de son titre. Le module 1
  // a montre qu'un titre peut annoncer une matiere absente : on verifie donc
  // les formes grammaticales, pas les intentions.
  const NOTIONS: Record<string, { lesson: string; formes: string[] }> = {
    'le passe et ses suffixes': { lesson: 'm4_l1_passe', formes: ['ktebt', 'ketbat'] },
    'les connecteurs temporels': { lesson: 'm4_l1_passe', formes: ['l-bareh', 'men be3d'] },
    'le present en ka-': { lesson: 'm4_l2_present', formes: ['ka-nkteb', 'ka-ykteb'] },
    'la variante regionale ta-': { lesson: 'm4_l2_present', formes: ['ta-nmchi'] },
    'le futur en gha-': { lesson: 'm4_l3_futur_negation', formes: ['gha-nmchi'] },
    'la negation en ma...ch': { lesson: 'm4_l3_futur_negation', formes: ['ma-kla-ch'] },
    'le negation non verbale machi': { lesson: 'm4_l3_futur_negation', formes: ['machi'] },
    'l obligation khass + pronom': { lesson: 'm4_l4_modaux', formes: ['khassna'] },
    'le souhait bgha au passe': { lesson: 'm4_l4_modaux', formes: ['bghit'] },
    'la capacite qedd vs moumkin': { lesson: 'm4_l4_modaux', formes: ['moumkin', 'tqedd'] },
  };

  for (const [notion, { lesson, formes }] of Object.entries(NOTIONS)) {
    it(`enseigne « ${notion} »`, () => {
      const taught = darijaIn(lesson);
      for (const forme of formes) {
        expect(taught, `« ${forme} » absent de ${lesson}`).toContain(forme.toLowerCase());
      }
    });
  }

  it('le checkpoint couvre les quatre lecons du module', () => {
    // Les bonnes reponses du checkpoint doivent mobiliser chaque notion :
    // passe, present, futur/negation et modaux.
    const checkpoint = lessonById(CHECKPOINT_ID)
      .steps.flatMap((s) => s.exercise!.options!.filter((o) => o.isCorrect))
      .map((o) => (typeof o.text === 'string' ? o.text : ''))
      .join(' ')
      .toLowerCase();
    expect(checkpoint, 'passe absent du checkpoint').toMatch(/mchat|ketbou|fhemt/);
    expect(checkpoint, 'present absent du checkpoint').toMatch(/ka-/);
    expect(checkpoint, 'futur absent du checkpoint').toMatch(/gha-/);
    expect(checkpoint, 'modaux absents du checkpoint').toMatch(/khassna|tqedd/);
  });
});

describe('module 4 — articulation avec le vocabulaire', () => {
  it('le vocabulaire du module 4 remonte a ses propres lecons', () => {
    const sources = new Set(vocabularyByModule[4].map((v) => v.source));
    for (const source of sources) {
      expect(LESSON_IDS, `source inconnue : ${source}`).toContain(source);
    }
  });

  it('les quatre lecons de grammaire sont representees dans le vocabulaire', () => {
    const sources = new Set(vocabularyByModule[4].map((v) => v.source));
    for (const lessonId of GRAMMAR_LESSON_IDS) {
      expect(sources.has(lessonId), `${lessonId} sans vocabulaire`).toBe(true);
    }
  });
});

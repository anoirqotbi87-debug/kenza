import { describe, it, expect } from 'vitest';
import { module1Lessons } from './module1';
import { fullCurriculum, allLessonsList } from './curriculum';
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

/** Les six lecons historiques : leurs ids ne doivent jamais bouger. */
const LESSON_IDS = [
  'l1_phonetics_1',
  'l2_greetings_1',
  'l3_greetings_2',
  'l4_greetings_3',
  'l5_politeness_1',
  'l6_pronouns_1',
];

const lessons = module1Lessons;
const lessonById = (id: string) => lessons.find((l) => l.id === id)!;

/**
 * Tout le darija enseigne dans une lecon : contenus d'apprentissage, prompts,
 * enonces et options des exercices. Sert aux verifications de couverture.
 */
function taughtIn(lessonId: string): string {
  const lesson = lessonById(lessonId);
  const parts: string[] = [];
  for (const step of lesson.steps) {
    if (step.content) parts.push(step.content.arabizi, step.content.arabic);
    const ex = step.exercise;
    if (!ex) continue;
    parts.push(typeof ex.prompt === 'string' ? ex.prompt : Object.values(ex.prompt).join(' '));
    for (const opt of ex.options ?? []) {
      parts.push(typeof opt.text === 'string' ? opt.text : Object.values(opt.text).join(' '));
    }
    for (const pair of ex.pairs ?? []) {
      parts.push(pair.left.text, typeof pair.right.text === 'string' ? pair.right.text : '');
    }
    for (const choice of ex.dialogueChoices ?? []) parts.push(choice.text.arabizi);
  }
  return parts.join(' | ');
}

describe('module 1 — structure', () => {
  it('expose ses six lecons depuis module1.ts', () => {
    expect(lessons.length).toBe(6);
    expect(lessons.map((l) => l.id)).toEqual(LESSON_IDS);
  });

  it('est bien rattache au curriculum et a la liste globale', () => {
    expect(fullCurriculum['1'].lessons).toBe(module1Lessons);
    for (const lesson of lessons) {
      expect(allLessonsList).toContain(lesson);
    }
  });

  it('toutes les lecons sont de niveau 1 (module gratuit)', () => {
    for (const lesson of lessons) {
      expect(lesson.level, lesson.id).toBe(1);
    }
  });

  it('aucune lecon n a de squelette vide', () => {
    const empty = allLessonsList.filter((l) => l.steps.length === 0);
    expect(empty.map((l) => l.id)).toEqual([]);
  });
});

describe('module 1 — integrite des etapes', () => {
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

  it('les exercices de reorganisation ont une reponse qui couvre toutes les tuiles', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || (ex.type !== 'reorder' && ex.type !== 'scramble')) continue;
        const where = `${lesson.id}.${step.id}`;
        const tileIds = ex.options!.map((o) => o.id).sort();
        const answerIds = (ex.answer as string[]).slice().sort();
        expect(answerIds, `${where} tuiles non couvertes`).toEqual(tileIds);
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

  it('chaque exercice explique sa reponse et son feedback est complet', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex) continue;
        const where = `${lesson.id}.${step.id}`;
        expect(ex.explanation, `${where} sans explanation`).toBeDefined();
        for (const lang of LANGS) {
          expect(textOf(ex.explanation!, lang).trim().length, `${where}.explanation.${lang}`).toBeGreaterThan(0);
        }
        for (const choice of ex.dialogueChoices ?? []) {
          expect(choice.feedback, `${where}.${choice.id} sans feedback`).toBeTruthy();
          expect(ARABIC.test(choice.text.arabic), `${where}.${choice.id} arabic`).toBe(true);
        }
      }
    }
  });
});

describe('module 1 — densite pedagogique', () => {
  // Le defaut corrige par ce lot : quatre lecons sur six n avaient AUCUN
  // exercice, et la lecon phonetique annoncait 3, 7, 9 sans les enseigner.
  it('chaque lecon porte au moins deux exercices', () => {
    for (const lesson of lessons) {
      const exercises = lesson.steps.filter((s) => s.type === 'exercise').length;
      expect(exercises, `${lesson.id} n a que ${exercises} exercice(s)`).toBeGreaterThanOrEqual(2);
    }
  });

  it('chaque lecon porte au moins quatre etapes au total', () => {
    for (const lesson of lessons) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('le module passe de 2 a au moins 12 exercices', () => {
    const total = lessons.reduce((n, l) => n + l.steps.filter((s) => s.type === 'exercise').length, 0);
    expect(total).toBeGreaterThanOrEqual(12);
  });

  it('varie les formats d exercice (pas uniquement des QCM)', () => {
    const types = new Set(
      lessons.flatMap((l) => l.steps.flatMap((s) => (s.exercise ? [s.exercise.type] : [])))
    );
    expect(types.size, [...types].join(',')).toBeGreaterThanOrEqual(3);
  });
});

describe('module 1 — couverture phonetique (3, 7, 9, kh, gh)', () => {
  // Chaque phoneme doit etre enseigne avec un mot qui le porte REELLEMENT en
  // arabizi : c est le trou du contenu precedent, qui n enseignait que le son 3.
  const PHONEMES: Record<string, { mots: string[]; arabe: string }> = {
    '3': { mots: ['3afak'], arabe: 'ع' },
    '7': { mots: ['sba7'], arabe: 'ح' },
    '9': { mots: ['9hwa'], arabe: 'ق' },
    kh: { mots: ['khobz'], arabe: 'خ' },
    gh: { mots: ['ghadi'], arabe: 'غ' },
  };

  for (const [phoneme, { mots, arabe }] of Object.entries(PHONEMES)) {
    it(`enseigne le phoneme « ${phoneme} » (${arabe})`, () => {
      const taught = taughtIn('l1_phonetics_1');
      for (const mot of mots) {
        expect(taught, `« ${mot} » absent de la lecon phonetique`).toContain(mot);
      }
      // La graphie arabe du phoneme doit apparaitre dans la lecon.
      const arabicTaught = lessonById('l1_phonetics_1')
        .steps.flatMap((s) => (s.content ? [s.content.arabic] : []))
        .join(' ');
      expect(arabicTaught, `caractere ${arabe} absent`).toContain(arabe);
    });
  }

  it('la notation chiffree est utilisee pour 3, 7 et 9', () => {
    const arabizi = lessonById('l1_phonetics_1')
      .steps.flatMap((s) => (s.content ? [s.content.arabizi] : []))
      .join(' ');
    expect(arabizi).toMatch(/3/);
    expect(arabizi).toMatch(/7/);
    expect(arabizi).toMatch(/9/);
  });

  it('distingue kh (خ) de gh (غ) par un exercice dedie', () => {
    const taught = taughtIn('l1_phonetics_1');
    expect(taught).toContain('khobz');
    expect(taught).toContain('ghali');
  });
});

describe('module 1 — couverture des lecons de salutation et politesse', () => {
  it('la lecon de salutation enseigne la reponse rituelle', () => {
    const taught = taughtIn('l2_greetings_1');
    expect(taught).toContain('Salam');
    expect(taught.toLowerCase(), 'reponse rituelle absente').toContain('3alaykum');
  });

  it('la lecon « prendre des nouvelles » distingue le masculin du feminin', () => {
    const taught = taughtIn('l3_greetings_2');
    expect(taught).toContain('Labas');
    expect(taught).toContain('Kidayr');
    expect(taught, 'forme feminine absente').toContain('Kidayra');
  });

  it('la lecon « repondre » enseigne l7amdullah et bikhir', () => {
    const taught = taughtIn('l4_greetings_3');
    expect(taught).toContain('l7amdullah');
    expect(taught).toContain('Bikhir');
  });

  it('la lecon de politesse enseigne merci, de rien et excuse-moi', () => {
    const taught = taughtIn('l5_politeness_1');
    expect(taught).toContain('Shokran');
    expect(taught).toContain('Bla jmil');
    expect(taught).toContain('Smeh li');
  });

  it('la lecon de pronoms couvre les personnes du singulier et du pluriel', () => {
    const taught = taughtIn('l6_pronouns_1');
    for (const pronom of ['Ana', 'Nta', 'Nti', 'Huwa', 'Hiya', 'Hna', 'Ntuma']) {
      expect(taught, `« ${pronom} » absent`).toContain(pronom);
    }
  });
});

describe('module 1 — chaque lecon met en pratique son propre contenu', () => {
  // Garde-fou : un exercice doit porter sur ce que SA lecon enseigne, pas sur
  // un mot venu d ailleurs (c est ce qui rend un exercice decoratif).
  for (const lesson of lessons) {
    it(`${lesson.id} : les exercices reprennent le vocabulaire enseigne`, () => {
      const learned = lesson.steps
        .filter((s) => s.type === 'learning' && s.content)
        .map((s) => s.content!.arabizi)
        .filter((a) => a.trim().length > 0);
      const exerciseText = lesson.steps
        .filter((s) => s.type === 'exercise')
        .flatMap((s) => {
          const ex = s.exercise!;
          return [
            ...(ex.options ?? []).map((o) => (typeof o.text === 'string' ? o.text : Object.values(o.text).join(' '))),
            ...(ex.pairs ?? []).map((p) => p.left.text),
          ];
        })
        .join(' | ')
        .toLowerCase();
      // Au moins un mot enseigne doit reapparaitre dans les exercices.
      const reused = learned.some((mot) => {
        const head = mot.split(/[ ,?]/)[0].toLowerCase();
        return head.length > 2 && exerciseText.includes(head);
      });
      expect(reused, `${lesson.id} : aucun mot enseigne repris dans ses exercices`).toBe(true);
    });
  }
});

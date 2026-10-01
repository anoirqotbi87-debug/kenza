import { describe, it, expect } from 'vitest';
import { getAcceptedAnswers, isAcceptedAnswer, isAcceptedOrder } from './exerciseAnswers';
import { allLessonsList } from '../data/curriculum';
import type { Exercise } from '../types/curriculum';

const exercise = (over: Partial<Exercise>): Exercise => ({
  id: 'ex',
  type: 'fill-blank',
  prompt: 'Consigne',
  ...over,
});

describe('getAcceptedAnswers — liste des reponses valides', () => {
  it('retient la reponse de reference', () => {
    expect(getAcceptedAnswers(exercise({ answer: 'opt1' }))).toEqual(['opt1']);
  });

  it('ajoute les variantes declarees dans acceptedAnswers', () => {
    const ex = exercise({ answer: 'opt1', acceptedAnswers: ['opt2'] });
    expect(getAcceptedAnswers(ex)).toEqual(['opt1', 'opt2']);
  });

  it('ne repete pas une variante identique a la reponse de reference', () => {
    const ex = exercise({ answer: 'opt1', acceptedAnswers: ['opt1', 'opt2'] });
    expect(getAcceptedAnswers(ex)).toEqual(['opt1', 'opt2']);
  });

  it('dedoublonne les variantes entre elles', () => {
    const ex = exercise({ answer: 'opt1', acceptedAnswers: ['opt2', 'opt2'] });
    expect(getAcceptedAnswers(ex)).toEqual(['opt1', 'opt2']);
  });

  it('ignore la casse et les espaces de bord dans le dedoublonnage', () => {
    const ex = exercise({ answer: 'Lliya', acceptedAnswers: [' lliya ', 'LLIYA'] });
    expect(getAcceptedAnswers(ex)).toEqual(['Lliya']);
  });

  it('ne retourne rien quand la reponse est un tableau (reorder)', () => {
    // `answer` est alors une liste d'ids de tuiles : elle n'a pas de variantes
    // textuelles, et l'ordre compte — ce n'est pas une reponse a choix.
    const ex = exercise({ type: 'reorder', answer: ['w1', 'w2'] });
    expect(getAcceptedAnswers(ex)).toEqual([]);
  });

  it('ne retourne rien quand la reponse est un objet (matching)', () => {
    const ex = exercise({ type: 'matching', answer: { a: 'a' } });
    expect(getAcceptedAnswers(ex)).toEqual([]);
  });

  it('tolere un exercice sans reponse declaree', () => {
    expect(getAcceptedAnswers(exercise({}))).toEqual([]);
  });

  it('ecarte les variantes vides', () => {
    const ex = exercise({ answer: 'opt1', acceptedAnswers: ['', '   '] });
    expect(getAcceptedAnswers(ex)).toEqual(['opt1']);
  });
});

describe('isAcceptedAnswer — validation de la reponse de l apprenant', () => {
  const ex = exercise({ answer: 'opt1', acceptedAnswers: ['opt2'] });

  it('accepte la reponse de reference', () => {
    expect(isAcceptedAnswer(ex, 'opt1')).toBe(true);
  });

  it('accepte une variante declaree', () => {
    expect(isAcceptedAnswer(ex, 'opt2')).toBe(true);
  });

  it('refuse une option non declaree', () => {
    expect(isAcceptedAnswer(ex, 'opt3')).toBe(false);
  });

  it('refuse une reponse nulle ou vide', () => {
    expect(isAcceptedAnswer(ex, null)).toBe(false);
    expect(isAcceptedAnswer(ex, undefined)).toBe(false);
    expect(isAcceptedAnswer(ex, '')).toBe(false);
  });

  it('ignore la casse et les espaces de bord', () => {
    const cased = exercise({ answer: 'Ila', acceptedAnswers: ['Koun'] });
    expect(isAcceptedAnswer(cased, 'ila')).toBe(true);
    expect(isAcceptedAnswer(cased, ' KOUN ')).toBe(true);
    expect(isAcceptedAnswer(cased, 'Wakha')).toBe(false);
  });

  it('retablit le cas de l exercice ambigu du module 6', () => {
    // « 3afak, 3tii-___ l-ma » : « 3tii-ni » et « 3tii-liya » sont toutes deux
    // justes, et l explication le dit. Avant ce champ, seule la premiere passait.
    const ambigu = exercise({ answer: 'opt1', acceptedAnswers: ['opt2'] });
    expect(isAcceptedAnswer(ambigu, 'opt1')).toBe(true);
    expect(isAcceptedAnswer(ambigu, 'opt2')).toBe(true);
  });
});

describe('isAcceptedOrder — validation des exercices reorder', () => {
  const ex = exercise({ type: 'reorder', answer: ['w1', 'w2', 'w3'] });

  it('accepte l ordre attendu', () => {
    expect(isAcceptedOrder(ex, ['w1', 'w2', 'w3'])).toBe(true);
  });

  it('refuse un ordre different', () => {
    expect(isAcceptedOrder(ex, ['w2', 'w1', 'w3'])).toBe(false);
  });

  it('refuse une suite incomplete ou trop longue', () => {
    expect(isAcceptedOrder(ex, ['w1', 'w2'])).toBe(false);
    expect(isAcceptedOrder(ex, ['w1', 'w2', 'w3', 'w4'])).toBe(false);
  });

  it('refuse un exercice dont la reponse n est pas une suite', () => {
    expect(isAcceptedOrder(exercise({ answer: 'opt1' }), ['opt1'])).toBe(false);
  });
});

describe('coherence du curriculum — aucune bonne reponse rejetee par le runner', () => {
  it('toute option marquee isCorrect est acceptee par la validation', () => {
    // Garde-fou contre la classe de bug du module 6 : une option `isCorrect` que
    // le runner refuse fait passer une bonne reponse pour une faute. Les
    // `reorder` sont exclus : ils marquent legitimement toutes leurs tuiles.
    const offenders: string[] = [];
    for (const lesson of allLessonsList) {
      for (const step of lesson.steps) {
        const ex = step.exercise;
        if (!ex || !ex.options) continue;
        if (ex.type !== 'mcq' && ex.type !== 'fill-blank') continue;
        for (const option of ex.options) {
          if (option.isCorrect && !isAcceptedAnswer(ex, option.id)) {
            offenders.push(`${lesson.id}.${step.id} -> ${option.id}`);
          }
        }
      }
    }
    expect(offenders, `bonnes reponses refusees par le runner : ${offenders.join(', ')}`).toEqual([]);
  });
});

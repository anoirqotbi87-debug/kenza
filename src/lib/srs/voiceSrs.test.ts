import { describe, it, expect } from 'vitest';
import {
  calculateSm2,
  stripTashkeel,
  normalizeArabicText,
  levenshteinDistance,
  evaluateSpokenSrsAnswer,
  type Sm2CardState,
} from './voiceSrs';

describe('voiceSrs - Algorithme SM-2 (SuperMemo-2)', () => {
  const baseCard: Sm2CardState = {
    repetition: 0,
    interval: 1,
    easeFactor: 2.5,
    dueDate: '2026-11-19T00:00:00.000Z',
  };

  const now = new Date('2026-11-19T12:00:00.000Z');

  it('réinitialise repetition à 0 et interval à 1 en cas d’échec (quality < 3)', () => {
    const learningCard: Sm2CardState = {
      repetition: 4,
      interval: 25,
      easeFactor: 2.3,
      dueDate: '2026-11-19T00:00:00.000Z',
    };

    // Test avec note 0 (blackout)
    const result0 = calculateSm2(learningCard, 0, now);
    expect(result0.repetition).toBe(0);
    expect(result0.interval).toBe(1);

    // Test avec note 2 (difficulté majeure)
    const result2 = calculateSm2(learningCard, 2, now);
    expect(result2.repetition).toBe(0);
    expect(result2.interval).toBe(1);
  });

  it('établit interval à 1 jour pour la première répétition réussie (repetition: 0 -> 1)', () => {
    const result = calculateSm2(baseCard, 4, now);
    expect(result.repetition).toBe(1);
    expect(result.interval).toBe(1);
    expect(new Date(result.dueDate).getTime()).toBeGreaterThan(now.getTime());
  });

  it('établit interval à 6 jours pour la deuxième répétition réussie (repetition: 1 -> 2)', () => {
    const cardStep1: Sm2CardState = {
      ...baseCard,
      repetition: 1,
      interval: 1,
    };

    const result = calculateSm2(cardStep1, 4, now);
    expect(result.repetition).toBe(2);
    expect(result.interval).toBe(6);
  });

  it('multiplie interval par easeFactor pour les répétitions ultérieures (repetition >= 2)', () => {
    const cardStep2: Sm2CardState = {
      repetition: 2,
      interval: 6,
      easeFactor: 2.5,
      dueDate: now.toISOString(),
    };

    const result = calculateSm2(cardStep2, 5, now);
    expect(result.repetition).toBe(3);
    // Intervalle attendu : Math.round(6 * 2.5) = 15
    expect(result.interval).toBe(15);
  });

  it('maintient easeFactor au-dessus du plancher minimum de 1.3 même après échecs répétés', () => {
    let card: Sm2CardState = {
      repetition: 0,
      interval: 1,
      easeFactor: 1.35,
      dueDate: now.toISOString(),
    };

    // Subit plusieurs échecs consécutifs
    for (let i = 0; i < 5; i++) {
      card = calculateSm2(card, 0, now);
    }

    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
    expect(card.easeFactor).toBe(1.3);
  });

  it('augmente le facteur de facilité pour une réponse parfaite (quality = 5)', () => {
    const result = calculateSm2(baseCard, 5, now);
    // EF' = 2.5 + (0.1 - 0) = 2.6
    expect(result.easeFactor).toBe(2.6);
  });

  it('diminue le facteur de facilité pour une réponse passable (quality = 3)', () => {
    const result = calculateSm2(baseCard, 3, now);
    // EF' = 2.5 + (0.1 - 2 * (0.08 + 0.04)) = 2.5 - 0.14 = 2.36
    expect(result.easeFactor).toBe(2.36);
  });
});

describe('voiceSrs - Normalisation Arabe & Levenshtein', () => {
  it('supprime correctement le Tashkeel (voyelles brèves)', () => {
    expect(stripTashkeel('سَلَامْ')).toBe('سلام');
    expect(stripTashkeel('شُكْرَانْ بْزَّافْ')).toBe('شكران بزاف');
  });

  it('normalise les variantes d’Alif, Alif Maqsura et Taa Marbuta', () => {
    expect(normalizeArabicText('أَتَايْ')).toBe('اتاي');
    expect(normalizeArabicText('إِلَى')).toBe('الي');
    expect(normalizeArabicText('قَهْوَة')).toBe('قهوه');
  });

  it('calcule la distance de Levenshtein exacte', () => {
    expect(levenshteinDistance('', '')).toBe(0);
    expect(levenshteinDistance('سلام', 'سلام')).toBe(0);
    expect(levenshteinDistance('سلام', 'كلام')).toBe(1);
    expect(levenshteinDistance('اتاي', 'اتي')).toBe(1);
    expect(levenshteinDistance('بزاف', 'بزااف')).toBe(1);
  });
});

describe('voiceSrs - Évaluation Phonétique Vocale', () => {
  it('accorde quality: 5 et score: 100 pour une prononciation identique (sans harakat)', () => {
    const result = evaluateSpokenSrsAnswer('سَلَامْ', 'سلام');
    expect(result.isCorrect).toBe(true);
    expect(result.quality).toBe(5);
    expect(result.score).toBe(100);
    expect(result.similarity).toBe(1.0);
  });

  it('accorde quality: 5 ou 4 pour une prononciation très proche avec variation minime', () => {
    const result = evaluateSpokenSrsAnswer('شُكْرَانْ بْزَّافْ', 'شكران بزااف');
    expect(result.isCorrect).toBe(true);
    expect(result.quality).toBeGreaterThanOrEqual(4);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it('rejette avec quality: 0 en cas de chaîne vide ou inaudible', () => {
    const result = evaluateSpokenSrsAnswer('سَلَامْ', '');
    expect(result.isCorrect).toBe(false);
    expect(result.quality).toBe(0);
    expect(result.score).toBe(0);
  });

  it('rejette avec quality: 0 pour un mot totalement hors sujet', () => {
    const result = evaluateSpokenSrsAnswer('قَهْوَة', 'طوموبيل');
    expect(result.isCorrect).toBe(false);
    expect(result.quality).toBe(0);
    expect(result.score).toBeLessThan(30);
  });
});

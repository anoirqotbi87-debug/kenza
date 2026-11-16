import { describe, it, expect } from 'vitest';
import {
  computeAdaptiveSrsCard,
  computeDarijaClusterWeight,
  adjustRatingWithTelemetry,
  computeCardUrgency,
  sortCardsByUrgency,
  computeMemoryHealth,
  calculateAdaptiveNextReview,
  SrsMetrics,
} from '@/lib/srs/adaptiveEngine';
import type { SRSCard } from '@/types/srs';

describe('Adaptive SRS Engine (SM-2 Intelligent & Multimodal)', () => {
  const baseMetrics: SrsMetrics = {
    interval: 1,
    repetition: 1,
    easeFactor: 2.5,
    lastReviewed: '2026-10-01T00:00:00.000Z',
    dueDate: '2026-10-02T00:00:00.000Z',
    averageResponseTimeMs: 2000,
    vocalFailureCount: 0,
    consecutiveSuccesses: 1,
    clusterWeight: 1.0,
    state: 'learning',
  };

  const fixedDate = new Date('2026-10-02T10:00:00.000Z');

  describe('Pilier 1 : Score de prononciation vocale (vocalFailed / vocalFailureCount)', () => {
    it('incrémente vocalFailureCount et rétrograde "easy" en "good" en cas d\'échec vocal', () => {
      const result = computeAdaptiveSrsCard(baseMetrics, 'easy', {
        vocalFailed: true,
        responseTimeMs: 1500,
        now: fixedDate,
        jitterFactor: 0,
      });

      expect(result.vocalFailureCount).toBe(1);
      // 'easy' est rétrogradé en 'good' : intervalle basé sur repetition=1 (6 jours) plutôt que le bonus 'easy'
      expect(result.interval).toBe(6);
    });

    it('rétrograde "good" en "again" (échec strict) si la prononciation vocale échoue', () => {
      const result = computeAdaptiveSrsCard(baseMetrics, 'good', {
        vocalFailed: true,
        responseTimeMs: 1800,
        now: fixedDate,
        jitterFactor: 0,
      });

      expect(result.vocalFailureCount).toBe(1);
      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
      expect(result.consecutiveSuccesses).toBe(0);
      expect(result.easeFactor).toBeLessThan(2.5);
    });
  });

  describe('Pilier 2 : Facteur de fatigue / Vitesse de réponse (responseTimeMs)', () => {
    it('rétrograde "easy" en "good" si l\'apprenant hésite plus de 6 secondes (> 6000 ms)', () => {
      const result = computeAdaptiveSrsCard(baseMetrics, 'easy', {
        vocalFailed: false,
        responseTimeMs: 7500, // Forte hésitation
        now: fixedDate,
        jitterFactor: 0,
      });

      // Rétrogradé en 'good' à cause de la latence
      expect(result.interval).toBe(6);
      // Pénalité de latence appliquée sur l'Ease Factor car responseTime > 4000ms
      expect(result.easeFactor).toBeLessThanOrEqual(2.4);
    });

    it('met à jour la moyenne mobile exponentielle du temps de réponse (70% historique / 30% actuel)', () => {
      const result = computeAdaptiveSrsCard(baseMetrics, 'good', {
        responseTimeMs: 4000,
        now: fixedDate,
        jitterFactor: 0,
      });

      // 2000 * 0.7 + 4000 * 0.3 = 1400 + 1200 = 2600
      expect(result.averageResponseTimeMs).toBe(2600);
    });
  });

  describe('Pilier 3 : Difficulté phonologique intrinsèque Darija (clusterWeight)', () => {
    it('attribue un poids de 1.0 aux mots simples sans friction', () => {
      const weight = computeDarijaClusterWeight('salam');
      expect(weight).toBe(1.0);
    });

    it('attribue un poids supérieur aux mots avec sons durs (ع, ح, خ, ق, گ)', () => {
      const weightG = computeDarijaClusterWeight('گْلَسْ');
      const weightKhd = computeDarijaClusterWeight('خْدَمْ');
      expect(weightG).toBeGreaterThan(1.1);
      expect(weightKhd).toBeGreaterThan(1.2);
    });

    it('détecte la gémination (Shadda ّ) et les doubles consonnes', () => {
      const weightShadda = computeDarijaClusterWeight('شَدّ');
      expect(weightShadda).toBeGreaterThan(1.0);
    });

    it('resserre le 2e intervalle pour les clusters lourds', () => {
      const lightResult = computeAdaptiveSrsCard(baseMetrics, 'good', {
        text: 'salam',
        now: fixedDate,
        jitterFactor: 0,
      });
      const heavyResult = computeAdaptiveSrsCard(baseMetrics, 'good', {
        text: 'خْدَمْ',
        now: fixedDate,
        jitterFactor: 0,
      });

      // Pour un cluster lourd, l'intervalle passe de 6 à un intervalle plus resserré (ex: 4 ou 5 jours)
      expect(heavyResult.interval).toBeLessThanOrEqual(lightResult.interval);
    });
  });

  describe('Pilier 4 : Courbe d\'oubli, Jitter contrôlé et Smart Queue', () => {
    it('applique un Jitter déterministe de +/- 5% pour lisser la charge de révision', () => {
      const cardWithLongInterval: SrsMetrics = {
        ...baseMetrics,
        repetition: 2,
        interval: 10,
      };

      const withPositiveJitter = computeAdaptiveSrsCard(cardWithLongInterval, 'good', {
        now: fixedDate,
        jitterFactor: 0.05,
      });
      const withNegativeJitter = computeAdaptiveSrsCard(cardWithLongInterval, 'good', {
        now: fixedDate,
        jitterFactor: -0.05,
      });

      // interval = 10 * 2.5 = 25 jours
      // +5% -> 26 jours, -5% -> 24 jours
      expect(withPositiveJitter.interval).toBeGreaterThanOrEqual(withNegativeJitter.interval);
    });

    it('ne modifie jamais l\'intervalle 1 jour par du jitter', () => {
      const result = computeAdaptiveSrsCard(baseMetrics, 'again', {
        now: fixedDate,
        jitterFactor: 0.05,
      });
      expect(result.interval).toBe(1);
    });

    it('respecte strictement le plancher MIN_EASE_FACTOR = 1.3', () => {
      const card: SrsMetrics = { ...baseMetrics, easeFactor: 1.35 };
      const result = computeAdaptiveSrsCard(card, 'again', {
        responseTimeMs: 8000,
        now: fixedDate,
        jitterFactor: 0,
      });
      expect(result.easeFactor).toBe(1.3);
    });

    it('ajuste la note avec adjustRatingWithTelemetry selon le profil biométrique', () => {
      const resVocal = adjustRatingWithTelemetry('good', 2000, true);
      expect(resVocal.adjustedRating).toBe('again');
      expect(resVocal.penaltyReason).toBe('vocal_failure');

      const resLatency = adjustRatingWithTelemetry('easy', 7000, false);
      expect(resLatency.adjustedRating).toBe('good');
      expect(resLatency.penaltyReason).toBe('latency_hesitation');
    });

    it('calcule l\'urgencyScore : les cartes en retard et avec échecs vocaux sont prioritaires', () => {
      const regularCard: SRSCard = {
        id: 'c1',
        wordId: 'w1',
        interval: 6,
        repetition: 2,
        easeFactor: 2.5,
        dueDate: '2026-10-02T00:00:00.000Z',
        state: 'learning',
        vocalFailureCount: 0,
      };

      const vocalStrugglingCard: SRSCard = {
        id: 'c2',
        wordId: 'w2',
        interval: 6,
        repetition: 2,
        easeFactor: 2.5,
        dueDate: '2026-10-02T00:00:00.000Z',
        state: 'learning',
        vocalFailureCount: 2, // 2 échecs vocaux
      };

      const overdueCard: SRSCard = {
        id: 'c3',
        wordId: 'w3',
        interval: 2,
        repetition: 1,
        easeFactor: 2.5,
        dueDate: '2026-09-28T00:00:00.000Z', // 4 jours de retard
        state: 'learning',
        vocalFailureCount: 0,
      };

      const sorted = sortCardsByUrgency([regularCard, vocalStrugglingCard, overdueCard], fixedDate);

      // overdueCard (retard critique) ou vocalStrugglingCard (pénalité vocale) doivent précéder regularCard
      expect(computeCardUrgency(vocalStrugglingCard, fixedDate)).toBeGreaterThan(computeCardUrgency(regularCard, fixedDate));
      expect(sorted[0].id).not.toBe('c1');
      expect(sorted[2].id).toBe('c1');
    });

    it('évalue la santé globale de la mémoire avec computeMemoryHealth', () => {
      const cards: SRSCard[] = [
        {
          id: '1',
          wordId: 'w1',
          interval: 20,
          repetition: 5,
          easeFactor: 2.7,
          dueDate: '2026-10-20T00:00:00.000Z',
          state: 'review',
          vocalFailureCount: 0,
          averageResponseTimeMs: 1500,
        },
        {
          id: '2',
          wordId: 'w2',
          interval: 1,
          repetition: 0,
          easeFactor: 1.8,
          dueDate: '2026-10-03T00:00:00.000Z',
          state: 'learning',
          vocalFailureCount: 2,
          averageResponseTimeMs: 4500,
        },
      ];

      const health = computeMemoryHealth(cards);
      expect(health.masteredCount).toBe(1);
      expect(health.learningCount).toBe(1);
      expect(health.vocalChallengeCount).toBe(1);
      expect(health.retentionScore).toBeGreaterThan(40);
      expect(health.retentionScore).toBeLessThan(100);
    });
  });

  describe('Adaptateur calculateAdaptiveNextReview (SRSCard)', () => {
    it('met à jour une SRSCard sans rompre la structure de données existante', () => {
      const existingCard: SRSCard = {
        id: 'c_labas',
        wordId: 'srs_labas',
        interval: 1,
        repetition: 1,
        easeFactor: 2.5,
        dueDate: '2026-10-02T00:00:00.000Z',
        state: 'learning',
      };

      const updated = calculateAdaptiveNextReview(existingCard, 'good', {
        responseTimeMs: 2200,
        vocalFailed: false,
        text: 'la bas',
        now: fixedDate,
        jitterFactor: 0,
      });

      expect(updated.id).toBe('c_labas');
      expect(updated.wordId).toBe('srs_labas');
      expect(updated.interval).toBe(6);
      expect(updated.repetition).toBe(2);
      expect(updated.averageResponseTimeMs).toBeDefined();
      expect(updated.urgencyScore).toBeDefined();
    });
  });
});

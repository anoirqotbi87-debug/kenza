import { SRSCard, ReviewGrade } from '../types/srs';
import { supabase, withSessionRefresh } from '../lib/supabase';

export const GRADE_QUALITY_MAP: Record<ReviewGrade, number> = {
  again: 1, // Échec
  hard: 3,  // Réussite difficile
  good: 4,  // Réussite normale
  easy: 5,  // Réussite facile
};

export const MIN_EASE_FACTOR = 1.3;
export const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Normalise une date à minuit UTC (00:00:00.000Z).
 * Évite les décalages de fuseau horaire et les comparaisons asynchrones erronées.
 */
export function normalizeDateToUtcMidnight(date: Date = new Date()): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Calcule le nouveau facteur de facilité (ease factor) selon la formule standard SM-2 :
 * EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), avec un minimum garanti de 1.3.
 */
export function calculateEaseFactor(currentEf: number, quality: number): number {
  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const newEf = currentEf + delta;
  return Math.max(MIN_EASE_FACTOR, Math.round(newEf * 100) / 100);
}

export const srsService = {
  /**
   * Calcule le prochain intervalle et la date de révision selon l'algorithme standard SM-2.
   * - Échec ('again') : intervalle réinitialisé à 1 jour, répétitions remises à 0.
   * - Première validation : intervalle de 1 jour.
   * - Deuxième validation consécutive : intervalle de 6 jours.
   * - Validations suivantes : intervalle = round(intervalle_précédent * EF).
   */
  calculateNextReview(card: SRSCard, grade: ReviewGrade, now: Date = new Date()): SRSCard {
    const quality = GRADE_QUALITY_MAP[grade] ?? 4;
    const currentEf = card.easeFactor || DEFAULT_EASE_FACTOR;
    const newEf = calculateEaseFactor(currentEf, quality);
    const todayMidnight = normalizeDateToUtcMidnight(now);

    let newRepetition: number;
    let newInterval: number;
    let newState: SRSCard['state'];

    if (quality < 3) {
      // Échec (Again) : l'intervalle se réinitialise à 1 jour et ne reste pas bloqué
      newRepetition = 0;
      newInterval = 1;
      newState = 'learning';
    } else {
      // Réussite (Hard, Good, Easy)
      if (card.repetition === 0) {
        newRepetition = 1;
        newInterval = 1;
        newState = 'learning';
      } else if (card.repetition === 1) {
        newRepetition = 2;
        newInterval = 6;
        newState = 'learning';
      } else {
        newRepetition = card.repetition + 1;
        if (grade === 'hard') {
          // Modération pour 'hard' (progression plus lente)
          newInterval = Math.max(card.interval + 1, Math.round(card.interval * 1.2));
        } else {
          newInterval = Math.round(card.interval * newEf);
        }
        newState = newRepetition >= 4 ? 'review' : 'learning';
      }
    }

    const nextDueDate = new Date(todayMidnight);
    nextDueDate.setUTCDate(nextDueDate.getUTCDate() + newInterval);
    nextDueDate.setUTCHours(0, 0, 0, 0);

    return {
      ...card,
      repetition: newRepetition,
      interval: newInterval,
      easeFactor: newEf,
      dueDate: nextDueDate.toISOString(),
      state: newState,
      updatedAt: now.toISOString(),
    };
  },

  /**
   * Filtre strictement les cartes dues :
   * - Exclut les cartes non commencées (state === 'new')
   * - Exclut les cartes déjà validées aujourd'hui (car dueDate >= tomorrow)
   * - Utilise la normalisation UTC pour garantir que isDue = reviewDate <= today
   */
  getDueCards(deck: Record<string, SRSCard>, now: Date = new Date()): SRSCard[] {
    const todayMidnight = normalizeDateToUtcMidnight(now);

    return Object.values(deck).filter((card) => {
      // Exclure strictement les cartes non commencées
      if (card.state === 'new') return false;

      const cardDueDate = normalizeDateToUtcMidnight(new Date(card.dueDate));
      return cardDueDate.getTime() <= todayMidnight.getTime();
    });
  },

  /**
   * Synchronisation asynchrone non-bloquante avec la table Supabase srs_items
   */
  async syncCardToCloud(userId: string, card: SRSCard): Promise<void> {
    try {
      await withSessionRefresh(async () => {
        const { error } = await supabase
          .from('srs_items')
          .upsert({
            user_id: userId,
            word_id: card.wordId,
            interval: card.interval,
            repetition: card.repetition,
            ease_factor: card.easeFactor,
            due_date: card.dueDate,
            state: card.state,
          }, { onConflict: 'user_id,word_id' });

        if (error) {
          console.warn('[SRS Cloud Sync Error]:', error.message);
        }
      });
    } catch (e) {
      console.warn('[SRS Cloud Sync Network Error]:', e);
    }
  },
};

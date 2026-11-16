import { SRSCard, ReviewGrade } from '../../types/srs';
import { MIN_EASE_FACTOR, DEFAULT_EASE_FACTOR, normalizeDateToUtcMidnight } from '../../services/srsService';

/**
 * Métriques télémétriques et phonétiques pour le calcul adaptatif SM-2
 */
export interface SrsMetrics {
  interval: number;               // Intervalle en jours
  repetition: number;             // Nombre de répétitions réussies consécutives
  easeFactor: number;             // Facteur de facilité SM-2 (défaut 2.5, min 1.3)
  lastReviewed: string;           // Date ISO de la dernière révision
  dueDate: string;                // Date ISO de la prochaine échéance
  averageResponseTimeMs: number;  // Moyenne mobile exponentielle du temps de réponse (ms)
  vocalFailureCount: number;      // Nombre d'échecs phonétiques détectés dans /parler ou reconnaissance vocale
  consecutiveSuccesses: number;   // Succès consécutifs
  clusterWeight?: number;         // Poids de difficulté phonologique Darija (1.0 à 1.8)
  state?: 'new' | 'learning' | 'review';
}

export interface AdaptiveSrsOptions {
  /** Texte en arabe ou arabizi pour calculer le poids phonologique intrinsèque */
  text?: string;
  /** Temps de réponse en millisecondes mesuré côté UI */
  responseTimeMs?: number;
  /** Échec phonétique détecté par le module vocal ou l'atelier /parler */
  vocalFailed?: boolean;
  /** Facteur de dispersion (jitter) optionnel pour les tests déterministes (entre -0.05 et +0.05) */
  jitterFactor?: number;
  /** Date de référence (défaut: now) */
  now?: Date;
  /** Facteur de fatigue globale de l'apprenant (0 à 1) */
  learnerFatigueFactor?: number;
}

export interface MemoryHealthSummary {
  retentionScore: number;       // Score global de rétention 0-100%
  averageEaseFactor: number;    // Facteur d'aisance moyen
  masteredCount: number;        // Cartes consolidées (state = 'review')
  learningCount: number;        // Cartes en apprentissage actif
  vocalChallengeCount: number;  // Cartes ayant subi des difficultés vocales
  averageLatencyMs: number;     // Temps moyen de réaction
}

/**
 * Analyse la complexité phonologique d'un mot en Darija.
 * Attribue un coefficient multiplicateur (1.0 à 1.8) selon :
 * - Les consonnes gutturales et occlusives caractéristiques (ع, ح, خ, ق, گ / 3, 7, 5, 9, g)
 * - Les clusters consonantiques initiaux (ex: 2 consonnes avec Sukūn consécutifs comme خْدَمْ)
 * - La gémination (Shadda ّ ou double consonne)
 */
export function computeDarijaClusterWeight(text: string): number {
  if (!text || typeof text !== 'string') return 1.0;

  let weight = 1.0;
  const clean = text.trim();

  // 1. Détection des consonnes à forte charge articulatoire en Darija
  // ع (3), ح (7), خ (5), ق (9), گ (g / g-sound)
  const heavyConsonants = /[عحخقگ3759]|kh|gh/gi;
  const heavyMatches = clean.match(heavyConsonants);
  if (heavyMatches) {
    weight += Math.min(0.45, heavyMatches.length * 0.12);
  }

  // 2. Détection de la gémination (Shadda ّ en arabe ou lettres doublées en arabizi)
  if (clean.includes('\u0651') || /([a-z])\1/i.test(clean)) {
    weight += 0.1;
  }

  // 3. Détection des clusters consonantiques initiaux ou denses (ex: Sukūn consécutifs ou mots courts très denses)
  const sukunCount = (clean.match(/\u0652/g) || []).length;
  if (sukunCount >= 2) {
    weight += 0.15;
  }

  // Clusters arabizi initiaux sans voyelle (ex: "kht", "bgh", "khd", "st")
  if (/^[bcdfghjklmnpqrstvwxyz]{3,}/i.test(clean)) {
    weight += 0.2;
  }

  // Plafonnement entre 1.0 et 1.8
  return Math.min(1.8, Math.max(1.0, Math.round(weight * 100) / 100));
}

/**
 * Calcule la note effective après injection des métriques biométriques et phonétiques :
 * - Si échec vocal : rétrogradation immédiate ('easy' -> 'good', autre -> 'again')
 * - Si hésitation cognitive (> 6s) : 'easy' -> 'good'
 */
export function adjustRatingWithTelemetry(
  rating: ReviewGrade,
  responseTimeMs: number,
  vocalFailed: boolean
): { adjustedRating: ReviewGrade; penaltyReason?: 'vocal_failure' | 'latency_hesitation' } {
  if (vocalFailed) {
    const adjustedRating: ReviewGrade = rating === 'easy' ? 'good' : 'again';
    return { adjustedRating, penaltyReason: 'vocal_failure' };
  }

  if (responseTimeMs > 6000 && rating === 'easy') {
    return { adjustedRating: 'good', penaltyReason: 'latency_hesitation' };
  }

  return { adjustedRating: rating };
}

/**
 * Moteur SM-2 Adaptatif basé sur les 4 Piliers :
 * 1. Score phonétique (vocalFailureCount)
 * 2. Vitesse de réponse / charge cognitive (responseTimeMs)
 * 3. Difficulté intrinsèque du mot en Darija (clusterWeight)
 * 4. Ajustement dynamique de l'Ease Factor & Smart Jitter
 */
export function computeAdaptiveSrsCard(
  card: SrsMetrics,
  rating: ReviewGrade,
  options: AdaptiveSrsOptions = {}
): SrsMetrics {
  const responseTimeMs = options.responseTimeMs ?? 2500;
  const vocalFailed = options.vocalFailed ?? false;
  const now = options.now ?? new Date();
  const todayMidnight = normalizeDateToUtcMidnight(now);

  let {
    interval,
    repetition,
    easeFactor = DEFAULT_EASE_FACTOR,
    consecutiveSuccesses = 0,
    vocalFailureCount = 0,
  } = card;
  const averageResponseTimeMs = card.averageResponseTimeMs ?? 2500;

  // Calcul du poids phonologique intrinsèque (si fourni dans options ou déjà sur la carte)
  const clusterWeight = options.text
    ? computeDarijaClusterWeight(options.text)
    : card.clusterWeight ?? 1.0;

  // 1. Ajustement dynamique de la note perçue selon la télémétrie
  const { adjustedRating } = adjustRatingWithTelemetry(rating, responseTimeMs, vocalFailed);

  if (vocalFailed) {
    vocalFailureCount += 1;
  }

  // Pénalité d'hésitation cognitive sur l'Ease Factor
  const latencyPenalty = responseTimeMs > 4000 ? 0.1 : 0;
  const clusterPenalty = clusterWeight > 1.3 ? 0.05 : 0;

  let newState: 'new' | 'learning' | 'review' = 'learning';

  // 2. Formule SM-2 modifiée avec amortisseurs adaptatifs
  if (adjustedRating === 'again') {
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2 - latencyPenalty);
    consecutiveSuccesses = 0;
    newState = 'learning';
  } else {
    if (adjustedRating === 'hard') {
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15 - latencyPenalty - clusterPenalty);
      interval = Math.max(1, Math.round(interval * 1.2));
    } else if (adjustedRating === 'good') {
      easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - latencyPenalty - clusterPenalty);
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = Math.max(3, Math.round(6 / clusterWeight));
      } else {
        interval = Math.max(1, Math.round(interval * easeFactor));
      }
    } else if (adjustedRating === 'easy') {
      easeFactor = Math.min(3.5, easeFactor + 0.15);
      if (repetition === 0) {
        interval = 2;
      } else {
        // Bonus d'espacement pour les cartes faciles
        interval = Math.max(2, Math.round(interval * easeFactor * 1.3));
      }
    }

    repetition += 1;
    consecutiveSuccesses += 1;
    newState = repetition >= 4 ? 'review' : 'learning';
  }

  // 3. Application d'un Jitter contrôlé (+/- 5%) pour éviter les pics de charge de révision
  // Si options.jitterFactor est passé (utilisé dans les tests unitaires), on l'applique directement.
  const jitterDelta = typeof options.jitterFactor === 'number'
    ? Math.max(-0.05, Math.min(0.05, options.jitterFactor))
    : (Math.random() * 0.1 - 0.05);

  const jitter = 1 + jitterDelta;
  // Ne pas appliquer de jitter sur interval = 1 jour (reste toujours demain)
  const finalInterval = interval <= 1 ? 1 : Math.max(1, Math.round(interval * jitter));

  // 4. Calcul de la prochaine échéance UTC
  const nextDueDate = new Date(todayMidnight);
  nextDueDate.setUTCDate(nextDueDate.getUTCDate() + finalInterval);
  nextDueDate.setUTCHours(0, 0, 0, 0);

  // 5. Moyenne mobile exponentielle du temps de réponse (pondération 70% historique / 30% nouveau)
  const newAverageResponseTimeMs = Math.round(
    (averageResponseTimeMs * 0.7) + (responseTimeMs * 0.3)
  );

  return {
    interval: finalInterval,
    repetition,
    easeFactor: Math.round(easeFactor * 100) / 100,
    lastReviewed: now.toISOString(),
    dueDate: nextDueDate.toISOString(),
    averageResponseTimeMs: newAverageResponseTimeMs,
    vocalFailureCount,
    consecutiveSuccesses,
    clusterWeight,
    state: newState,
  };
}

/**
 * Calcule le score d'urgence d'une carte pour la Smart Queue :
 * Urgence = (Jours écoulés depuis dernière révision / Intervalle) + (vocalFailureCount * 0.5)
 */
export function computeCardUrgency(
  card: SRSCard,
  now: Date = new Date()
): number {
  if (card.state === 'new') return 0;

  const todayMidnight = normalizeDateToUtcMidnight(now);
  const cardDueDate = normalizeDateToUtcMidnight(new Date(card.dueDate));
  const daysOverdue = Math.max(
    0,
    Math.round((todayMidnight.getTime() - cardDueDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const targetInterval = Math.max(1, card.interval);
  const overdueRatio = daysOverdue / targetInterval;
  const vocalPenalty = (card.vocalFailureCount ?? 0) * 0.5;
  const hesitationPenalty = (card.averageResponseTimeMs && card.averageResponseTimeMs > 5000) ? 0.3 : 0;

  return Math.round((overdueRatio + vocalPenalty + hesitationPenalty) * 100) / 100;
}

/**
 * Trie une collection de cartes dues selon leur score d'urgence décroissant (Smart Queue).
 * Les cartes avec des difficultés vocales ou en retard critique passent en tête.
 */
export function sortCardsByUrgency(cards: SRSCard[], now: Date = new Date()): SRSCard[] {
  return [...cards].sort((a, b) => {
    const urgencyA = computeCardUrgency(a, now);
    const urgencyB = computeCardUrgency(b, now);
    return urgencyB - urgencyA;
  });
}

/**
 * Évalue la santé globale de la mémoire de l'apprenant (0-100%).
 * Synthétise le facteur d'aisance moyen, le taux de cartes maîtrisées et l'historique phonétique.
 */
export function computeMemoryHealth(cards: SRSCard[]): MemoryHealthSummary {
  const activeCards = cards.filter(c => c.state !== 'new');
  if (activeCards.length === 0) {
    return {
      retentionScore: 100,
      averageEaseFactor: DEFAULT_EASE_FACTOR,
      masteredCount: 0,
      learningCount: 0,
      vocalChallengeCount: 0,
      averageLatencyMs: 0,
    };
  }

  let totalEf = 0;
  let totalLatency = 0;
  let vocalChallengeCount = 0;
  let masteredCount = 0;
  let learningCount = 0;

  for (const card of activeCards) {
    totalEf += card.easeFactor || DEFAULT_EASE_FACTOR;
    totalLatency += card.averageResponseTimeMs || 2500;
    if ((card.vocalFailureCount ?? 0) > 0) vocalChallengeCount += 1;
    if (card.state === 'review') masteredCount += 1;
    if (card.state === 'learning') learningCount += 1;
  }

  const averageEaseFactor = Math.round((totalEf / activeCards.length) * 100) / 100;
  const averageLatencyMs = Math.round(totalLatency / activeCards.length);

  // Score de rétention (0 à 100) :
  // Facteur d'aisance normalisé (1.3 = 0, 2.5 = 75, 3.0+ = 100)
  const efScore = Math.min(100, Math.max(0, ((averageEaseFactor - 1.3) / (2.8 - 1.3)) * 80));
  // Bonus de maîtrise
  const masteryBonus = (masteredCount / activeCards.length) * 20;
  // Malus vocal
  const vocalMalus = (vocalChallengeCount / activeCards.length) * 15;

  const retentionScore = Math.min(100, Math.max(10, Math.round(efScore + masteryBonus - vocalMalus)));

  return {
    retentionScore,
    averageEaseFactor,
    masteredCount,
    learningCount,
    vocalChallengeCount,
    averageLatencyMs,
  };
}

/**
 * Adaptateur transparent pour intégrer directement computeAdaptiveSrsCard dans SRSCard
 */
export function calculateAdaptiveNextReview(
  card: SRSCard,
  grade: ReviewGrade,
  options: AdaptiveSrsOptions = {}
): SRSCard {
  const metrics: SrsMetrics = {
    interval: card.interval,
    repetition: card.repetition,
    easeFactor: card.easeFactor ?? DEFAULT_EASE_FACTOR,
    lastReviewed: card.updatedAt || card.dueDate,
    dueDate: card.dueDate,
    averageResponseTimeMs: card.averageResponseTimeMs ?? 2500,
    vocalFailureCount: card.vocalFailureCount ?? 0,
    consecutiveSuccesses: card.consecutiveSuccesses ?? card.repetition,
    clusterWeight: card.clusterWeight,
    state: card.state,
  };

  const updatedMetrics = computeAdaptiveSrsCard(metrics, grade, options);

  return {
    ...card,
    interval: updatedMetrics.interval,
    repetition: updatedMetrics.repetition,
    easeFactor: updatedMetrics.easeFactor,
    dueDate: updatedMetrics.dueDate,
    state: updatedMetrics.state || card.state,
    updatedAt: updatedMetrics.lastReviewed,
    averageResponseTimeMs: updatedMetrics.averageResponseTimeMs,
    vocalFailureCount: updatedMetrics.vocalFailureCount,
    consecutiveSuccesses: updatedMetrics.consecutiveSuccesses,
    clusterWeight: updatedMetrics.clusterWeight,
    lastResponseTimeMs: options.responseTimeMs,
    urgencyScore: computeCardUrgency({ ...card, ...updatedMetrics }, options.now),
  };
}

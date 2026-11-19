/**
 * Module SRS Vocal (SM-2 + Évaluation Phonétique)
 *
 * Implémente l'algorithme SuperMemo-2 (SM-2) adapté à l'expression orale
 * en Darija marocain avec évaluation phonétique par reconnaissance vocale (Web Speech API).
 */

export interface Sm2CardState {
  repetition: number;
  interval: number;
  easeFactor: number;
  dueDate: string; // Timestamp ISO 8601
}

export interface VoiceEvaluationResult {
  quality: number; // 0 à 5
  score: number; // 0 à 100 (%)
  similarity: number; // 0.0 à 1.0
  recognizedText: string;
  targetNormalized: string;
  isCorrect: boolean;
  feedback?: string;
}

/**
 * Calcule le nouvel état SM-2 d'une carte après une révision.
 *
 * Algorithme SuperMemo-2 standard :
 * - Note de qualité Q comprise entre 0 et 5.
 * - Si Q < 3 (échec de remémoration / mauvaise prononciation) :
 *     repetition = 0, interval = 1
 * - Si Q >= 3 :
 *     repetition 0 -> interval = 1
 *     repetition 1 -> interval = 6
 *     repetition n -> interval = Math.round(interval * easeFactor)
 *     repetition = repetition + 1
 * - Mise à jour du facteur de facilité (Ease Factor EF) :
 *     EF' = EF + (0.1 - (5 - Q) * (0.08 + (5 - Q) * 0.02))
 *     Plancher minimum de EF : 1.3
 *
 * @param card État actuel de la carte
 * @param quality Note de qualité (0 à 5)
 * @param now Date de référence (défaut: new Date())
 * @returns Nouvel état de la carte
 */
export function calculateSm2(
  card: Sm2CardState,
  quality: number,
  now: Date = new Date()
): Sm2CardState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let newRepetition = card.repetition;
  let newInterval = card.interval;

  if (q < 3) {
    // Échec : réinitialisation de la chaîne de mémorisation
    newRepetition = 0;
    newInterval = 1;
  } else {
    // Succès : progression de l'intervalle selon SM-2
    if (card.repetition === 0) {
      newInterval = 1;
    } else if (card.repetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.max(1, Math.round(card.interval * card.easeFactor));
    }
    newRepetition = card.repetition + 1;
  }

  // Formule SM-2 standard pour l'évolution de l'Ease Factor
  const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const calculatedEf = card.easeFactor + efDelta;
  // Plancher absolu SM-2 fixé à 1.3
  const newEaseFactor = Math.max(1.3, Number(calculatedEf.toFixed(2)));

  // Prochaine date d'échéance calculée
  const nextDueDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    repetition: newRepetition,
    interval: newInterval,
    easeFactor: newEaseFactor,
    dueDate: nextDueDate.toISOString(),
  };
}

/**
 * Supprime les voyelles brèves et diacritiques (Tashkīl / Chakl) de la graphie arabe.
 */
export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '');
}

/**
 * Normalise une chaîne en arabe pour la comparaison phonétique :
 * - Suppression du Tashkeel (harakat)
 * - Harmonisation des Alifs (إ, أ, آ, ٱ -> ا)
 * - Harmonisation Alif Maqsura (ى -> ي)
 * - Harmonisation Taa Marbuta (ة -> ه)
 * - Suppression du Tatweel (ـ)
 * - Suppression de la ponctuation et des espaces multiples
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return stripTashkeel(text)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ـ/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»،؟]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes de caractères.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // suppression
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Évalue la réponse prononcée par l'apprenant face au modèle attendu.
 * Compare la version normalisée (sans Tashkeel) avec la distance de Levenshtein
 * et attribue une note de qualité SM-2 de 0 à 5.
 *
 * @param targetArabic Texte cible en arabe (avec ou sans voyelles)
 * @param spokenText Texte retranscrit par la reconnaissance vocale
 * @returns VoiceEvaluationResult avec score, proximité (0..1) et note SM-2 (0..5)
 */
export function evaluateSpokenSrsAnswer(
  targetArabic: string,
  spokenText: string
): VoiceEvaluationResult {
  const targetNorm = normalizeArabicText(targetArabic);
  const spokenNorm = normalizeArabicText(spokenText);

  if (!spokenNorm || spokenNorm.length === 0) {
    return {
      quality: 0,
      score: 0,
      similarity: 0,
      recognizedText: spokenText,
      targetNormalized: targetNorm,
      isCorrect: false,
      feedback: 'Aucun son capté ou prononciation inaudible.',
    };
  }

  if (targetNorm === spokenNorm) {
    return {
      quality: 5,
      score: 100,
      similarity: 1.0,
      recognizedText: spokenText,
      targetNormalized: targetNorm,
      isCorrect: true,
      feedback: 'Prononciation parfaite ! Excellent.',
    };
  }

  const distance = levenshteinDistance(targetNorm, spokenNorm);
  const maxLen = Math.max(targetNorm.length, spokenNorm.length, 1);
  const rawSimilarity = Math.max(0, 1 - distance / maxLen);
  const similarity = Number(rawSimilarity.toFixed(2));
  const score = Math.round(similarity * 100);

  let quality = 0;
  let feedback = '';

  if (similarity >= 0.85) {
    quality = 5;
    feedback = 'Prononciation excellente !';
  } else if (similarity >= 0.70) {
    quality = 4;
    feedback = 'Très bonne prononciation, bien articulé.';
  } else if (similarity >= 0.55) {
    quality = 3;
    feedback = 'Bien compris, prononciation convenable.';
  } else if (similarity >= 0.35) {
    quality = 2;
    feedback = 'Approximatif, accent ou articulation à retravailler.';
  } else if (similarity >= 0.20) {
    quality = 1;
    feedback = 'Écart important par rapport au mot cible.';
  } else {
    quality = 0;
    feedback = 'Non reconnu ou mot incorrect.';
  }

  return {
    quality,
    score,
    similarity,
    recognizedText: spokenText,
    targetNormalized: targetNorm,
    isCorrect: quality >= 3,
    feedback,
  };
}

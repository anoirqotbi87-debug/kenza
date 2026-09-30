/**
 * Advanced phoneme matching and pronunciation evaluation for Moroccan Darija.
 * Specializes in difficult pharyngeal and guttural sounds:
 * - 3 (ع - ʿayn)
 * - 7 (ح - ḥāʾ)
 * - 9 (ق - qāf)
 * - kh (خ - khāʾ)
 * - gh (غ - ghayn)
 */

export interface PhonemeFeedback {
  char: string;
  name: string;
  arabicChar: string;
  detected: boolean;
  tip: string;
}

export type FeedbackTier = 'excellent' | 'good' | 'needs_work';

export interface PronunciationEvaluation {
  score: number; // 0 to 100
  tier: FeedbackTier;
  badge: {
    icon: string;
    text: string;
    color: string;
  };
  targetPhonemes: PhonemeFeedback[];
  detectedPhonemes: string[];
  missingPhonemes: string[];
  transcript: string;
  targetNormalized: string;
}

// Bidirectional mappings between Arabic and Arabizi numerals
export const ARABIC_TO_ARABIZI: Record<string, string> = {
  'ع': '3',
  'ح': '7',
  'ق': '9',
  'خ': 'kh',
  'غ': 'gh',
  'ط': 't',
  'ص': 's',
  'ض': 'd',
};

export const ARABIZI_TO_ARABIC: Record<string, string> = {
  '3': 'ع',
  '7': 'ح',
  '9': 'ق',
  'kh': 'خ',
  '5': 'خ',
  'gh': 'غ',
};

export const PHONEME_TIPS: Record<string, string> = {
  '3': "Son '3' (ع) : Vient du fond de la gorge, comme un resserrement laryngé.",
  '7': "Son '7' (ح) : Un souffle chaud très expiré depuis la gorge (comme pour embuer une vitre).",
  '9': "Son '9' (ق) : Un 'k' profond, articulé au niveau de la luette.",
  'kh': "Son 'kh' (خ) : Frottement rauque similaire à la 'jota' espagnole ou au 'ch' allemand (Bach).",
  'gh': "Son 'gh' (غ) : Comme un 'r' français très gras et roulé au fond du palais.",
};

export const CRITICAL_PHONEMES = ['3', '7', '9', 'kh', 'gh'];

/**
 * Normalizes Arabic or Arabizi text by stripping diacritics and punctuation.
 */
export function normalizeDarijaText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize forms of alif
    .replace(/[أإآ]/g, 'ا')
    // Remove common punctuation and symbols
    .replace(/[.,!?؟;:'"()\-–—_]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Transliterates Arabic text into standard Arabizi for phonetic comparison.
 */
export function arabicToPhoneticArabizi(text: string): string {
  let result = normalizeDarijaText(text);
  for (const [ar, latin] of Object.entries(ARABIC_TO_ARABIZI)) {
    result = result.replace(new RegExp(ar, 'g'), latin);
  }
  return result;
}

/**
 * Levenshtein Distance for textual similarity calculation.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates spoken Darija pronunciation against target phrases.
 * Returns an accuracy score from 0 to 100% with tailored feedback badges.
 */
export function evaluatePronunciation(
  spoken: string,
  targetArabizi: string,
  targetArabic?: string
): PronunciationEvaluation {
  const normSpoken = normalizeDarijaText(spoken);
  const normTargetAz = normalizeDarijaText(targetArabizi);
  const normTargetAr = targetArabic ? normalizeDarijaText(targetArabic) : '';

  // Cross-script phonetic mapping
  const phoneticSpoken = arabicToPhoneticArabizi(normSpoken);
  const phoneticTargetAr = normTargetAr ? arabicToPhoneticArabizi(normTargetAr) : normTargetAz;

  // Compute textual similarity across representations
  const distAz = levenshteinDistance(phoneticSpoken, normTargetAz);
  const maxLenAz = Math.max(phoneticSpoken.length, normTargetAz.length);
  const scoreAz = maxLenAz === 0 ? 100 : Math.max(0, 100 * (1 - distAz / maxLenAz));

  let scoreAr = 0;
  if (normTargetAr) {
    const distAr = levenshteinDistance(normSpoken, normTargetAr);
    const maxLenAr = Math.max(normSpoken.length, normTargetAr.length);
    scoreAr = maxLenAr === 0 ? 100 : Math.max(0, 100 * (1 - distAr / maxLenAr));
  }

  const baseScore = Math.max(scoreAz, scoreAr);

  // Analyze critical Darija phonemes
  const targetPhonemes: PhonemeFeedback[] = [];
  const detectedPhonemes: string[] = [];
  const missingPhonemes: string[] = [];

  for (const ph of CRITICAL_PHONEMES) {
    const arChar = ARABIZI_TO_ARABIC[ph];
    const isRequired =
      normTargetAz.includes(ph) ||
      phoneticTargetAr.includes(ph) ||
      Boolean(normTargetAr && normTargetAr.includes(arChar));

    if (isRequired) {
      const isDetected =
        normSpoken.includes(ph) ||
        phoneticSpoken.includes(ph) ||
        Boolean(normSpoken && normSpoken.includes(arChar));

      if (isDetected) {
        detectedPhonemes.push(ph);
      } else {
        missingPhonemes.push(ph);
      }

      targetPhonemes.push({
        char: ph,
        name: arChar,
        arabicChar: arChar,
        detected: isDetected,
        tip: PHONEME_TIPS[ph] || "Son à bien articuler.",
      });
    }
  }

  // Adjust score based on critical phoneme accuracy
  let finalScore = Math.round(baseScore);
  if (targetPhonemes.length > 0) {
    const phonemeRatio = detectedPhonemes.length / targetPhonemes.length;
    // Blend: 60% text distance, 40% phoneme fidelity
    finalScore = Math.round(baseScore * 0.6 + phonemeRatio * 100 * 0.4);
  }

  // Clamp 0-100
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine feedback tier and badge
  let tier: FeedbackTier;
  let badge: { icon: string; text: string; color: string };

  if (finalScore >= 80) {
    tier = 'excellent';
    badge = {
      icon: '🟢',
      text: 'Excellent ! Prononciation fluide et naturelle.',
      color: '#22c55e',
    };
  } else if (finalScore >= 50) {
    tier = 'good';
    const firstMissing = missingPhonemes[0];
    const missingHint = firstMissing
      ? ` Insistez sur le son guttural '${firstMissing}' (${ARABIZI_TO_ARABIC[firstMissing] || ''}).`
      : '';
    badge = {
      icon: '🟡',
      text: `Presque !${missingHint}`,
      color: '#eab308',
    };
  } else {
    tier = 'needs_work';
    badge = {
      icon: '🔴',
      text: 'À réécouter. Utilisez le mode ralenti 🐢 pour bien décomposer.',
      color: '#ef4444',
    };
  }

  return {
    score: finalScore,
    tier,
    badge,
    targetPhonemes,
    detectedPhonemes,
    missingPhonemes,
    transcript: normSpoken,
    targetNormalized: normTargetAz,
  };
}

// Backward-compatible alias matching existing utils/phonemeMatcher signatures
export const calculateSimilarity = evaluatePronunciation;

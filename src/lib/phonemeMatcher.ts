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

// Bidirectional mappings between Arabic and Arabizi numerals (historical / critical)
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

/**
 * Full Moroccan Darija phonetic transliteration table from Arabic script to Arabizi.
 * Allows seamless comparison when Web Speech API outputs Arabic script (ar-MA).
 */
export const FULL_ARABIC_TO_ARABIZI: Record<string, string> = {
  // Guttural & Pharyngeal sounds
  'ع': '3',
  'ح': '7',
  'ق': '9',
  'خ': 'kh',
  'غ': 'gh',

  // Emphatic consonants
  'ط': 't',
  'ص': 's',
  'ض': 'd',
  'ظ': 'd',

  // Standard consonants
  'ب': 'b',
  'ت': 't',
  'ث': 't',
  'ج': 'j',
  'د': 'd',
  'ذ': 'd',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'ch',
  'ف': 'f',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'ة': 'a',

  // Semi-vowels & Vowels
  'ء': '',
  'أ': 'a',
  'إ': 'i',
  'آ': 'a',
  'ا': 'a',
  'ى': 'a',
  'و': 'w',
  'ؤ': 'w',
  'ي': 'y',
  'ئ': 'y',
  'ـ': '', // tatweel
};

export const MULTI_PHONEME_TIPS: Record<string, Record<string, string>> = {
  '3': {
    fr: "Son '3' (ع) : Vient du fond de la gorge, comme un resserrement laryngé.",
    ar: "صوت '3' (ع) : يخرج من أقصى الحلق مع انقباض خفيف في الحنجرة.",
    en: "Sound '3' (ع): Deep pharyngeal sound from the back of the throat.",
    es: "Sonido '3' (ع): Sonido faríngeo profundo producido al tensar la garganta.",
  },
  '7': {
    fr: "Son '7' (ح) : Un souffle chaud très expiré depuis la gorge (comme pour embuer une vitre).",
    ar: "صوت '7' (ح) : همس دافئ ونَفَس قوي يخرج من وسط الحلق (كنفخ الهواء على زجاج).",
    en: "Sound '7' (ح): Warm, raspy exhale from mid-throat (like fogging a window).",
    es: "Sonido '7' (ح): Fricativa sorda con aire caliente desde la garganta (como empañar un cristal).",
  },
  '9': {
    fr: "Son '9' (ق) : Un 'k' profond, articulé au niveau de la luette.",
    ar: "صوت '9' (ق) : نطق عميق من أقصى اللسان مع اللهاة.",
    en: "Sound '9' (ق): Deep uvular stop, like a deep 'k' articulated at the uvula.",
    es: "Sonido '9' (ق): 'k' profunda articulada en la úvula.",
  },
  'kh': {
    fr: "Son 'kh' (خ) : Frottement rauque similaire à la 'jota' espagnole ou au 'ch' allemand (Bach).",
    ar: "صوت 'kh' (خ) : صوت احتكاكي عميق يشبه حرف الخاء أو 'j' بالإسبانية.",
    en: "Sound 'kh' (خ): Rough guttural friction, similar to Spanish 'j' or German 'ch' (Bach).",
    es: "Sonido 'kh' (خ): Como la 'j' española fuerte producida en el velo del paladar.",
  },
  'gh': {
    fr: "Son 'gh' (غ) : Comme un 'r' français très gras et roulé au fond du palais.",
    ar: "صوت 'gh' (غ) : يشبه الراء الفرنسية في الحلق أو الغين العربية.",
    en: "Sound 'gh' (غ): Gargled fricative, similar to the Parisian French 'r'.",
    es: "Sonido 'gh' (غ): Como la 'r' francesa parisina o fricativa velar sonora.",
  },
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
    // Remove Arabic diacritics (tashkeel & tatweel)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    // Normalize forms of alif
    .replace(/[أإآ]/g, 'ا')
    // Normalize 5 to kh in Arabizi
    .replace(/5/g, 'kh')
    // Remove common punctuation and symbols
    .replace(/[.,!?؟;:'"()\-–—_]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Transliterates Arabic text into standard Arabizi for phonetic comparison.
 * Maps all 28 Arabic letters so spoken Arabic from Speech Recognition matches Arabizi.
 */
export function arabicToPhoneticArabizi(text: string): string {
  if (!text) return '';
  const normalized = normalizeDarijaText(text);

  let result = '';
  // Check if string contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(normalized);

  if (!hasArabic) {
    // Already Arabizi / Latin : normalize common Arabizi spellings
    return normalized
      .replace(/sh/g, 'ch')
      .replace(/q/g, '9')
      .replace(/5/g, 'kh')
      .replace(/é|è|ê/g, 'e')
      .replace(/ou/g, 'u');
  }

  // Convert Arabic words
  const words = normalized.split(' ');
  const transliteratedWords = words.map((word) => {
    let w = word;
    // Normalize definite article: ال -> l-
    if (w.startsWith('ال') && w.length > 2) {
      w = 'l' + w.slice(2);
    }
    let out = '';
    for (let i = 0; i < w.length; i++) {
      const char = w[i];
      if (FULL_ARABIC_TO_ARABIZI[char] !== undefined) {
        out += FULL_ARABIC_TO_ARABIZI[char];
      } else {
        out += char;
      }
    }
    return out;
  });

  result = transliteratedWords.join(' ');
  return result
    .replace(/sh/g, 'ch')
    .replace(/5/g, 'kh')
    .replace(/ou/g, 'u');
}

/**
 * Phonetic reduction for tolerance of Darija vowel / consonant variations
 * (e.g., 'bzzaf' vs 'bzaf', 'chokran' vs 'choukran', 'sba7' vs 'sbah').
 */
export function reducePhonetics(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\-_]/g, '')
    .replace(/sh/g, 'ch')
    .replace(/ou/g, 'u')
    .replace(/o/g, 'u')
    .replace(/e/g, 'i')
    .replace(/q/g, '9')
    .replace(/5/g, 'kh')
    // Reduce duplicate consecutive letters: bb -> b, zz -> z
    .replace(/(.)\1+/g, '$1');
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
 * Returns an accuracy score from 0 to 100% with tailored multilingual feedback badges.
 */
export function evaluatePronunciation(
  spoken: string,
  targetArabizi: string,
  targetArabic?: string,
  lang: string = 'fr'
): PronunciationEvaluation {
  const normSpoken = normalizeDarijaText(spoken);
  const normTargetAz = normalizeDarijaText(targetArabizi);
  const normTargetAr = targetArabic ? normalizeDarijaText(targetArabic) : '';

  // Cross-script phonetic mapping
  const phoneticSpoken = arabicToPhoneticArabizi(normSpoken);
  const phoneticTargetAz = arabicToPhoneticArabizi(normTargetAz);
  const phoneticTargetAr = normTargetAr ? arabicToPhoneticArabizi(normTargetAr) : phoneticTargetAz;

  // 1. Direct Arabizi string similarity
  const distAz = levenshteinDistance(phoneticSpoken, phoneticTargetAz);
  const maxLenAz = Math.max(phoneticSpoken.length, phoneticTargetAz.length);
  const scoreAz = maxLenAz === 0 ? 100 : Math.max(0, 100 * (1 - distAz / maxLenAz));

  // 2. Reduced phonetics similarity (tolerant to double letters and vowel shifts)
  const redSpoken = reducePhonetics(phoneticSpoken);
  const redTarget = reducePhonetics(phoneticTargetAz);
  const distRed = levenshteinDistance(redSpoken, redTarget);
  const maxLenRed = Math.max(redSpoken.length, redTarget.length);
  const scoreRed = maxLenRed === 0 ? 100 : Math.max(0, 100 * (1 - distRed / maxLenRed));

  // 3. Direct Arabic-to-Arabic similarity if Arabic script exists
  let scoreAr = 0;
  if (normTargetAr) {
    const distAr = levenshteinDistance(normSpoken, normTargetAr);
    const maxLenAr = Math.max(normSpoken.length, normTargetAr.length);
    scoreAr = maxLenAr === 0 ? 100 : Math.max(0, 100 * (1 - distAr / maxLenAr));
  }

  // 4. Word-level token match (useful for multi-word phrases)
  const spokenWords = phoneticSpoken.split(' ').filter(Boolean);
  const targetWords = phoneticTargetAz.split(' ').filter(Boolean);
  let matchedWords = 0;
  if (targetWords.length > 0) {
    for (const tw of targetWords) {
      const redTw = reducePhonetics(tw);
      const found = spokenWords.some((sw) => {
        const redSw = reducePhonetics(sw);
        return redSw === redTw || levenshteinDistance(redSw, redTw) <= 1;
      });
      if (found) matchedWords++;
    }
  }
  const scoreWordTokens = targetWords.length > 0 ? (matchedWords / targetWords.length) * 100 : 100;

  // Combine textual similarities taking the strongest match
  const baseScore = Math.max(scoreAz, scoreRed, scoreAr, scoreWordTokens * 0.9);

  // Analyze critical Darija phonemes
  const targetPhonemes: PhonemeFeedback[] = [];
  const detectedPhonemes: string[] = [];
  const missingPhonemes: string[] = [];

  const tipsMap = (MULTI_PHONEME_TIPS as Record<string, Record<string, string>>);

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
        redSpoken.includes(ph) ||
        Boolean(normSpoken && normSpoken.includes(arChar));

      if (isDetected) {
        detectedPhonemes.push(ph);
      } else {
        missingPhonemes.push(ph);
      }

      const tipObj = tipsMap[ph] || {};
      const localizedTip = tipObj[lang] || tipObj.fr || PHONEME_TIPS[ph] || "Son à bien articuler.";

      targetPhonemes.push({
        char: ph,
        name: arChar,
        arabicChar: arChar,
        detected: isDetected,
        tip: localizedTip,
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

  const isAr = lang === 'ar';
  const isEs = lang === 'es';
  const isEn = lang === 'en';

  if (finalScore >= 80) {
    tier = 'excellent';
    let text = 'Excellent ! Prononciation fluide et naturelle.';
    if (isAr) text = 'ممتاز ! نطق سلس وطبيعي ودقيق.';
    else if (isEs) text = '¡Excelente! Pronunciación fluida y natural.';
    else if (isEn) text = 'Excellent! Smooth and natural pronunciation.';

    badge = {
      icon: '🟢',
      text,
      color: '#22c55e',
    };
  } else if (finalScore >= 50) {
    tier = 'good';
    const firstMissing = missingPhonemes[0];
    let missingHint = '';
    if (firstMissing) {
      if (isAr) {
        missingHint = ` ركّز أكثر على صوت '${firstMissing}' (${ARABIZI_TO_ARABIC[firstMissing] || ''}).`;
      } else if (isEs) {
        missingHint = ` Insiste en el sonido '${firstMissing}' (${ARABIZI_TO_ARABIC[firstMissing] || ''}).`;
      } else if (isEn) {
        missingHint = ` Focus on the '${firstMissing}' sound (${ARABIZI_TO_ARABIC[firstMissing] || ''}).`;
      } else {
        missingHint = ` Insiste sur le son '${firstMissing}' (${ARABIZI_TO_ARABIC[firstMissing] || ''}).`;
      }
    }

    let text = `Presque !${missingHint}`;
    if (isAr) text = `قريب جداً !${missingHint}`;
    else if (isEs) text = `¡Casi!${missingHint}`;
    else if (isEn) text = `Almost there!${missingHint}`;

    badge = {
      icon: '🟡',
      text,
      color: '#eab308',
    };
  } else {
    tier = 'needs_work';
    let text = 'À réécouter. Utilise le mode ralenti 🐢 pour bien décomposer.';
    if (isAr) text = 'أعد الاستماع. استخدم وضع السلحفاة 🐢 لتفكيك الأصوات بدقة.';
    else if (isEs) text = 'Para escuchar de nuevo. Usa el modo tortuga 🐢 para descomponer.';
    else if (isEn) text = 'Listen again. Use Turtle mode 🐢 to break down the sounds.';

    badge = {
      icon: '🔴',
      text,
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

/**
 * Utilities for Darija phonetic matching and voice evaluation
 */

export interface PhonemeFeedback {
  char: string;
  name: string;
  detected: boolean;
  tip: string;
}

export interface VoiceEvaluationResult {
  score: number;
  targetPhonemes: PhonemeFeedback[];
  transcript: string;
}

// Bidirectional mappings
const ARABIC_TO_ARABIZI: Record<string, string> = {
  'ع': '3',
  'ح': '7',
  'ق': '9',
  'خ': 'kh',
  'غ': 'gh',
  'ط': 't',
  'ص': 's',
  'ض': 'd'
};

const ARABIZI_TO_ARABIC: Record<string, string> = {
  '3': 'ع',
  '7': 'ح',
  '9': 'ق',
  'kh': 'خ',
  '5': 'خ',
  'gh': 'غ',
};

const PHONEME_TIPS: Record<string, string> = {
  '3': "Son 3 (ع) : Vient du fond de la gorge, comme un étouffement léger.",
  '7': "Son 7 (ح) : Un 'h' très expiré, comme lorsqu'on embue des lunettes.",
  '9': "Son 9 (ق) : Un 'k' profond, articulé au fond du palais.",
  'kh': "Son kh (خ) : Comme la jota espagnole ou un raclement de gorge léger.",
  'gh': "Son gh (غ) : Comme un 'r' français très gras."
};

/**
 * Normalizes text (arabic or arabizi) for comparison
 */
export function normalizeDarijaText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u065F]/g, '')
    // Replace various forms of alef with simple alef
    .replace(/[أإآ]/g, 'ا')
    // Remove punctuation
    .replace(/[.,!?؟;:'"()\-]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Basic Levenshtein distance implementation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates similarity score and checks specific phonemes
 */
export function calculateSimilarity(spoken: string, targetArabizi: string, targetArabic: string): VoiceEvaluationResult {
  const normSpoken = normalizeDarijaText(spoken);
  const normTargetArabizi = normalizeDarijaText(targetArabizi);
  const normTargetArabic = normalizeDarijaText(targetArabic);
  
  // Create an aggressive normalized version of spoken text mapping arabic phonemes to arabizi 
  // to ensure cross-script matching if speech-to-text returned Arabic
  let arabiziSpoken = normSpoken;
  for (const [ar, latin] of Object.entries(ARABIC_TO_ARABIZI)) {
    arabiziSpoken = arabiziSpoken.replace(new RegExp(ar, 'g'), latin);
  }

  // Calculate scores against both Arabic (native SR output) and Arabizi
  const distAr = levenshteinDistance(normSpoken, normTargetArabic);
  const distAz = levenshteinDistance(arabiziSpoken, normTargetArabizi);
  
  const maxLengthAr = Math.max(normSpoken.length, normTargetArabic.length);
  const maxLengthAz = Math.max(arabiziSpoken.length, normTargetArabizi.length);
  
  const scoreAr = maxLengthAr === 0 ? 100 : Math.max(0, 100 * (1 - distAr / maxLengthAr));
  const scoreAz = maxLengthAz === 0 ? 100 : Math.max(0, 100 * (1 - distAz / maxLengthAz));
  
  // Take the best score
  const finalScore = Math.round(Math.max(scoreAr, scoreAz));

  // Detect critical phonemes in target
  const targetPhonemes: PhonemeFeedback[] = [];
  const criticalArabizi = ['3', '7', '9', 'kh', 'gh'];
  
  criticalArabizi.forEach(ph => {
    // Check if target requires this phoneme
    const arChar = ARABIZI_TO_ARABIC[ph];
    const requiresPhoneme = normTargetArabizi.includes(ph) || normTargetArabic.includes(arChar);
    
    if (requiresPhoneme) {
      // Check if user produced it (either in raw transcript or normalized)
      const detected = normSpoken.includes(ph) || normSpoken.includes(arChar) || arabiziSpoken.includes(ph);
      
      targetPhonemes.push({
        char: ph,
        name: arChar,
        detected,
        tip: PHONEME_TIPS[ph] || "Son à travailler."
      });
    }
  });

  return {
    score: finalScore,
    targetPhonemes,
    transcript: normSpoken
  };
}

/**
 * Normalisation phonétique Darija pour Edge TTS (ar-MA-JamalNeural / ar-MA-MounaNeural).
 * Le lexique Arabizi→Arabe vocalisé vit dans ./lexicon.
 */

import { DARIJA_PHONETIC_MAP } from './lexicon';

export { DARIJA_PHONETIC_MAP };

// Lettres solaires en arabe pour l'assimilation phonétique de l'article 'الـ'
const SOLAR_LETTERS = new Set(['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن']);

/**
 * Nettoie et vocalise le texte arabe pour forcer une prononciation marocaine authentique dans Edge TTS :
 * - Retire les désinences de l'arabe classique (Tanween, voyelles finales inutiles qui créent un ton livresque)
 * - Assimile phonétiquement l'article 'الـ' devant les lettres solaires (ex: 'الشمس' -> 'اشّمس')
 * - Évite les diphtongues étirées de l'arabe littéraire en plaçant les bons Sukūn et Chadda
 */
export function sanitizeArabicForDarijaTts(arabic: string): string {
  if (!arabic) return '';

  const res = arabic
    // 1. Suppression des Tanween (arabe classique absent en Darija)
    .replace(/[\u064B\u064C\u064D]/g, '')
    // 2. Remplacement des ponctuations ou artefacts
    .replace(/[«»""'']/g, '')
    .trim();

  // 3. Assimilation solaire phonétique pour le TTS marocain :
  // En Darija, 'الـ' devant une lettre solaire ne se prononce JAMAIS avec un 'L'.
  // Ex: 'الرّاس' se prononce 'أرّاس' ou 'رّاس', 'السّلام' se prononce 'أسّلام'.
  // Pour forcer Edge TTS à ne pas lire la consonne 'ل', on transforme 'ال' + lettre solaire en 'ا' + lettre + chadda si absente.
  const words = res.split(/\s+/);
  const transformedWords = words.map((w) => {
    // Mot commençant par 'ال' (avec ou sans voyelle sur l'alif)
    const match = w.match(/^([إأاٱ]ل)([\u0621-\u064A])(.*)$/);
    if (match) {
      const secondLetter = match[2];
      if (SOLAR_LETTERS.has(secondLetter)) {
        const rest = match[3];
        const hasShadda = rest.startsWith('\u0651'); // Chadda déjà présente
        return `ا${secondLetter}${hasShadda ? '' : 'ّ'}${rest}`;
      }
    }
    return w;
  });

  return transformedWords.join(' ');
}

/**
 * Normalise une chaîne (Arabizi ou Arabe) en Arabe Darija optimisé phonétiquement pour la synthèse vocale.
 */
export function normalizeDarija(text: string, arabicText?: string): string {
  // 1. Priorité au texte arabe fourni s'il est présent
  if (arabicText && arabicText.trim()) {
    return sanitizeArabicForDarijaTts(arabicText);
  }

  const cleanKey = text.toLowerCase().trim().replace(/['"-]/g, '');
  if (DARIJA_PHONETIC_MAP[cleanKey]) {
    return sanitizeArabicForDarijaTts(DARIJA_PHONETIC_MAP[cleanKey]);
  }

  // Si le texte est déjà principalement en alphabet arabe, le nettoyer phonétiquement
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (hasArabic) {
    return sanitizeArabicForDarijaTts(text);
  }

  // 2. Conversion Arabizi mot-à-mot puis caractère par caractère
  const words = text.toLowerCase().trim().split(/\s+/);
  const mappedWords = words.map((word) => {
    const cleanWord = word.replace(/['"-]/g, '');
    if (DARIJA_PHONETIC_MAP[cleanWord]) {
      return DARIJA_PHONETIC_MAP[cleanWord];
    }
    return word
      .replace(/3/g, 'ع')
      .replace(/7/g, 'ح')
      .replace(/9/g, 'ق')
      .replace(/5/g, 'خ')
      .replace(/kh/gi, 'خ')
      .replace(/gh/gi, 'غ');
  });

  return sanitizeArabicForDarijaTts(mappedWords.join(' '));
}

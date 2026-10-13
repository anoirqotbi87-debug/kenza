/**
 * Normaliseur Phonétique Darija pour synthèse vocale neuronale (ar-MA-JamalNeural / ar-MA-MounaNeural).
 * 
 * Règle d'or :
 * Le modèle neuronal Edge TTS marocain bascule en prononciation Fusha livresque ou dégradée
 * et étouffe la dernière lettre des mots lorsqu'on lui fournit du tashkīl manuel classique
 * ou des sukūns (\u0652).
 * 
 * Ce module transforme la chaîne envoyée au moteur TTS tout en préservant
 * le texte original complet (avec chakl) pour l'affichage visuel utilisateur.
 */

/** Dictionnaire de réécriture phonétique marocaine (Phonetic Respelling) */
export const DARIJA_RESPEL_MAP: Record<string, string> = {
  'عفاك': 'عافاك',
  'لباس': 'لاباس',
  'هذا': 'هادا',
  'هدا': 'هادا',
  'أخويا': 'آ خويا',
  'اخويا': 'آ خويا',
  'أختي': 'آ ختي',
  'اختي': 'آ ختي',
  'بشحال': 'بشحال',
  'لكونتور': 'لكونتور',
  'صباح': 'صباح',
  'واحد': 'واحد',
  'شنو': 'شنو',
  'فين': 'فين',
  'دابا': 'دابا',
  'واخا': 'واخا',
  'مرحبًا': 'مرحبا',
  'مرحبا': 'مرحبا',
};

/** Lettres solaires pour assimilation phonétique de l'article ال */
const SOLAR_LETTERS = new Set([
  'ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'
]);

/**
 * Prépare une chaîne arabe / arabizi pour la synthèse vocale Edge TTS en Darija :
 * 1. Convertit les chiffres Arabizi résiduels (3->ع, 7->ح, 9->ق, 5->خ).
 * 2. Supprime systématiquement tous les sukūns (\u0652) et les tanwīns (\u064B, \u064C, \u064D).
 * 3. Supprime les voyelles brèves classiques (\u064E fat-ha, \u064F damma, \u0650 kasra)
 *    tout en préservant la shadda (\u0651) sur les consonnes géminées.
 * 4. Applique le dictionnaire de réécriture phonétique marocaine.
 * 5. Applique l'assimilation solaire de l'article 'ال'.
 * 6. Ajoute un coussin acoustique en fin de phrase (' . ') pour que le décodeur neuronal
 *    relâche et articule complètement la dernière consonne sans la tronquer.
 */
export function prepareDarijaForTts(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.trim();
  if (cleaned.length === 0) return '';

  // 1. Supprimer les balises éventuelles et délimiteurs
  cleaned = cleaned
    .replace(/\[\/?(AR|ARZ|FR|TR|SUGG)\]/gi, '')
    .replace(/[()«»""'']/g, '')
    .trim();

  // 2. Convertir les chiffres Arabizi résiduels (3->ع, 7->ح, 9->ق, 5->خ)
  cleaned = cleaned
    .replace(/3/g, 'ع')
    .replace(/7/g, 'ح')
    .replace(/9/g, 'ق')
    .replace(/5/g, 'خ');

  // 3. Supprimer tout caractère latin, chiffre restant (ex: 123) et caractères spéciaux non arabes
  cleaned = cleaned
    .replace(/[a-zA-Z0-9_\-#]/g, '')
    .trim();

  // 3. Supprimer systématiquement les sukūns et tanwīns
  // Sukūn: \u0652 | Tanwīns: \u064B, \u064C, \u064D
  cleaned = cleaned.replace(/[\u064B\u064C\u064D\u0652]/g, '');

  // 4. Supprimer les voyelles brèves classiques (fat-ha \u064E, damma \u064F, kasra \u0650)
  // Conserver la shadda (\u0651)
  cleaned = cleaned.replace(/[\u064E\u064F\u0650]/g, '');

  // 5. Normalisation des espaces et ponctuation
  const words = cleaned.split(/\s+/).filter(Boolean);

  // 6. Application du dictionnaire de réécriture phonétique + assimilation solaire
  const processedWords = words.map((w) => {
    // Retirer ponctuation attachée temporairement pour le matching
    const match = w.match(/^([،!؟?.]*)(.*?)([،!؟?.]*)$/);
    if (!match) return w;
    const prefix = match[1];
    let core = match[2];
    const suffix = match[3];

    // Vérifier dans le dictionnaire phonétique (sans shadda résiduelle si applicable)
    const coreWithoutShadda = core.replace(/\u0651/g, '');
    if (DARIJA_RESPEL_MAP[core]) {
      core = DARIJA_RESPEL_MAP[core];
    } else if (DARIJA_RESPEL_MAP[coreWithoutShadda]) {
      core = DARIJA_RESPEL_MAP[coreWithoutShadda];
    }

    // Assimilation solaire de l'article 'ال'
    const articleMatch = core.match(/^([إأاٱ]ل)([\u0621-\u064A])(.*)$/);
    if (articleMatch) {
      const secondLetter = articleMatch[2];
      if (SOLAR_LETTERS.has(secondLetter)) {
        const rest = articleMatch[3];
        const hasShadda = rest.startsWith('\u0651');
        core = `ا${secondLetter}${hasShadda ? '' : 'ّ'}${rest}`;
      }
    }

    return `${prefix}${core}${suffix}`;
  });

  let result = processedWords.join(' ').trim();
  if (result.length === 0) return '';

  // 7. Coussin acoustique en fin de phrase :
  // Retirer les points finaux éventuels et ajouter " . " pour obliger le décodeur neuronal
  // à relâcher complètement la dernière consonne sans l'avaler.
  result = result.replace(/[.\s]+$/, '');
  return `${result} . `;
}

/**
 * Normaliseur Phonétique Darija pour synthèse vocale neuronale (ar-MA-JamalNeural / ar-MA-MounaNeural).
 * 
 * Principes linguistiques et audio :
 * 1. Le modèle neuronal Edge TTS DOIT respecter la vocalisation complète (chakl : fat-ha, damma, kasra),
 *    la shadda et les sukūns internes et initiaux fournis par les leçons et le Roleplay.
 * 2. Problème de coupure de la dernière consonne :
 *    Si un mot en fin de proposition ou de phrase porte un sukūn explicite (\u0652) sur sa toute dernière lettre
 *    (ex: بْغِيتْ, عَافَاكْ, لَابَاسْ, خَدَّامْ), Edge TTS traite le sukūn + la pause finale comme un arrêt
 *    abrupt, coupant la consonne finale.
 *    En revanche, sans sukūn sur cette ultime consonne finale, la règle naturelle de Waqf arabe
 *    l'articule nettement, tout en conservant 100% des sukūns et voyelles sur toutes les autres lettres !
 * 3. Coussin acoustique :
 *    Une virgule arabe espacée (' ، ') est ajoutée en fin de chaîne pour empêcher le flux WebSocket
 *    de tronquer les 150 dernières millisecondes de l'audio.
 */

import { translateArabiziText } from './arabizi';

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
 * Retire le sukūn (\u0652) UNIQUEMENT s'il se trouve sur la toute dernière consonne du mot.
 * Tous les sukūns internes et initiaux (ex: بْـ dans بْغِيت) ainsi que toutes les voyelles sont 100% préservés.
 */
export function removeTrailingSukun(word: string): string {
  if (!word) return '';
  // Si le mot se termine par un sukūn (\u0652), on le retire
  return word.replace(/\u0652+$/, '');
}

/**
 * Prépare une chaîne arabe / arabizi pour la synthèse vocale Edge TTS en Darija :
 * - Préserve 100% des voyelles (fat-ha \u064E, damma \u064F, kasra \u0650), shadda (\u0651) et sukūns (\u0652) internes et initiaux.
 * - Convertit les chiffres Arabizi résiduels (3->ع, 7->ح, 9->ق, 5->خ).
 * - Nettoie les balises [AR], [ARZ], [FR], [SUGG] et délimiteurs parasites.
 * - Supprime uniquement le sukūn de la DERNIÈRE lettre des mots pour éviter l'amputation de fin de mot.
 * - Ajoute en fin de chaîne un coussin acoustique (' ، ') pour empêcher la troncature WebSocket.
 */
export function prepareDarijaForTts(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.trim();
  if (cleaned.length === 0) return '';

  // 1. Supprimer les balises éventuelles et délimiteurs (avant tout test de
  //    script : les balises [ARZ] ne doivent pas polluer la translittération).
  cleaned = cleaned
    .replace(/\[\/?(AR|ARZ|FR|TR|SUGG)\]/gi, '')
    .replace(/[()«»""'']/g, '')
    .trim();
  if (cleaned.length === 0) return '';

  // 0. Translittération Arabizi quand l'entrée est majoritairement latine :
  //    Edge TTS ne lit que l'arabe ; sans cela, « bghit 9hwa nss-nss » aurait
  //    produit une chaîne vide (tout le latin était supprimé). La darija en
  //    arabizi est convertie via le lexique vocalisé puis la translittération.
  const hasLatin = /[a-zA-Z0-9]/.test(cleaned);
  const hasArabic = /[\u0600-\u06FF]/.test(cleaned);
  if (hasLatin && !hasArabic) {
    return prepareDarijaForTts(translateArabiziText(cleaned));
  }

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

  // 4. Découper en mots en préservant le chakl complet
  const words = cleaned.split(/\s+/).filter(Boolean);

  const processedWords = words.map((w) => {
    // Isoler ponctuation attachée (début / fin)
    const match = w.match(/^([،!؟?.]*)(.*?)([،!؟?.]*)$/);
    if (!match) return w;
    const prefix = match[1];
    let core = match[2];
    const suffix = match[3];

    // Vérifier respelling sur version dé-diacritisée si pas de chakl, ou forme exacte
    const bareCore = core.replace(/[\u064B-\u0652]/g, '');
    if (DARIJA_RESPEL_MAP[core]) {
      core = DARIJA_RESPEL_MAP[core];
    } else if (DARIJA_RESPEL_MAP[bareCore] && core === bareCore) {
      core = DARIJA_RESPEL_MAP[bareCore];
    }

    // Assimilation solaire de l'article 'ال' si non déjà assimilé
    const articleMatch = core.match(/^([إأاٱ]ل)([\u0621-\u064A])(.*)$/);
    if (articleMatch) {
      const secondLetter = articleMatch[2];
      if (SOLAR_LETTERS.has(secondLetter)) {
        const rest = articleMatch[3];
        // Ne pas ajouter de shadda si la lettre ou la suite contient déjà une shadda
        const hasShadda = rest.includes('\u0651');
        core = `ا${secondLetter}${hasShadda ? '' : 'ّ'}${rest}`;
      }
    }

    // Règle d'or consonne finale : retirer le sukūn UNIQUEMENT sur la dernière lettre du mot
    core = removeTrailingSukun(core);

    return `${prefix}${core}${suffix}`;
  });

  let result = processedWords.join(' ').trim();
  if (result.length === 0) return '';

  // 5. Retirer la ponctuation finale résiduelle éventuelle et ajouter le coussin acoustique ' ، '
  result = result.replace(/[،!؟?.\s]+$/, '');
  return `${result} ، `;
}

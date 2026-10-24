/**
 * Translittération Arabizi → arabe darija pour la synthèse vocale.
 *
 * L'arabizi marocain code la darija en lettres latines et chiffres
 * (3=ع, 7=ح, 9=ق, 5=خ, 2=ء). Edge TTS ne lit pas le latin : un texte arabizi
 * envoyé tel quel aboutissait à une chaîne vide (tout le latin était retiré,
 * seuls restaient les chiffres → « 9hwa » devenait « ق ، »).
 *
 * Règles :
 *  1. Priorité au lexique vocalisé courant (une prononciation marocaine
 *     authentique est meilleure qu'une translittération).
 *  2. Sinon translittération caractère par caractère (digraphes kh/gh/sh/ch,
 *     chiffres, consonnes latines), voyelles élidées (la darija les encode
 *     rarement et l'arabe nu reste lisible par le modèle neuronal).
 *  3. Les mots déjà écrits en arabe sont laissés intacts.
 */

import { DARIJA_PHONETIC_MAP } from './lexicon';

const DIGRAPHS: Array<[RegExp, string]> = [
  [/kh/g, 'خ'],
  [/gh/g, 'غ'],
  [/sh/g, 'ش'],
  [/ch/g, 'ش'],
  [/th/g, 'ث'],
  [/dh/g, 'ذ'],
];

const CONSONANT_MAP: Record<string, string> = {
  '3': 'ع',
  '7': 'ح',
  '9': 'ق',
  '5': 'خ',
  '2': 'ء',
  '6': 'ط',
  b: 'ب',
  t: 'ت',
  j: 'ج',
  d: 'د',
  r: 'ر',
  z: 'ز',
  s: 'س',
  f: 'ف',
  k: 'ك',
  l: 'ل',
  m: 'م',
  n: 'ن',
  h: 'ه',
  w: 'و',
  y: 'ي',
  g: 'گ',
  q: 'ق',
  x: 'خ',
};

/** Voyelles arabizi : non orthographiées en darija, on les élide. */
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

/**
 * Vrai si `text` est surtout de l'arabizi (latin) plutôt que de l'arabe.
 * Un texte mixte (« wash ghadi 3la ») est converti uniquement si le latin
 * domine ; sinon le latin parasite est considéré comme du bruit à nettoyer.
 */
export function isMostlyArabizi(text: string): boolean {
  if (!text) return false;
  let latin = 0;
  let arabic = 0;
  for (const ch of text) {
    if (/[a-zA-Z0-9]/.test(ch)) {
      latin += 1;
    } else if (ARABIC_SCRIPT.test(ch)) {
      arabic += 1;
    }
  }
  if (arabic === 0) return latin > 0;
  return latin > arabic;
}

/** Convertit un mot arabizi (sans ponctuation) en arabe prononçable. */
export function arabiziToArabicWord(word: string): string {
  const clean = word.toLowerCase().replace(/['"\-_]/g, '');
  if (DARIJA_PHONETIC_MAP[clean]) return DARIJA_PHONETIC_MAP[clean];
  // Forme « ch » (variante francophone) → « sh » pour le lexique
  const withSh = clean.replace(/ch/g, 'sh');
  if (withSh !== clean && DARIJA_PHONETIC_MAP[withSh]) return DARIJA_PHONETIC_MAP[withSh];
  let withoutDigraphs = clean;
  for (const [re, ar] of DIGRAPHS) {
    withoutDigraphs = withoutDigraphs.replace(re, ar);
  }

  let result = '';
  for (const ch of withoutDigraphs) {
    if (CONSONANT_MAP[ch]) {
      result += CONSONANT_MAP[ch];
    } else if (VOWELS.has(ch)) {
      // voyelle élidée : la consonne précédente porte déjà le son
    } else if (ARABIC_SCRIPT.test(ch)) {
      result += ch; // déjà en arabe (ex: module mixte)
    }
    // tout autre caractère (ponctuation résiduelle) est ignoré
  }
  return result;
}

/** Clés du lexique triées par longueur décroissante (matching multi-mots gourmand). */
const SORTED_KEYS = Object.keys(DARIJA_PHONETIC_MAP).sort((a, b) => b.length - a.length);

/**
 * Convertit un texte arabizi complet en forme arabe prononçable.
 *
 * Stratégie :
 *  - les phrases pré-vocalisées du lexique sont matchées en premier, avec la
 *    clé la plus longue possible (ex: « 9hwa nss-nss » plutôt que « 9hwa »), ce
 *    qui évite « nss » → « نسس » au lieu de « نص » ;
 *  - la ponctuation latine est neutralisée en séparateur pour ne pas coller aux
 *    mots ( « Salam, » ne doit pas casser la recherche de « salam » ) ;
 *  - les mots restés inconnus sont translittérés caractère par caractère.
 */
export function translateArabiziText(text: string): string {
  if (!text) return '';

  const normalized = text
    .toLowerCase()
    .replace(/['"’‘]/g, '')
    .replace(/[,\u060C.!?;:\u2026]+/g, ' ');

  const words = normalized.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let i = 0;

  while (i < words.length) {
    let matched = false;

    for (const key of SORTED_KEYS) {
      const keyWords = key.split(' ');
      const len = keyWords.length;
      if (i + len > words.length) continue;
      const candidate = words.slice(i, i + len).join(' ');
      if (candidate === key) {
        out.push(DARIJA_PHONETIC_MAP[key]);
        i += len;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    const word = words[i];
    // Un mot déjà en arabe (texte mixte) reste intact ; le pipeline amont
    // appliquera l'assimilation solaire et les sukūns.
    out.push(ARABIC_SCRIPT.test(word) ? word : arabiziToArabicWord(word));
    i += 1;
  }

  return out.join(' ');
}
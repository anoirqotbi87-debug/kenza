export interface ParsedMessage {
  ar: string;
  arz: string;
  fr: string;
  suggestions?: string[];
}

// Tableau global de caractères jamais légitimes en tête d'un champ :
// BOM, zero-width space, marques de direction RTL/LTR, CR/LF, etc.
const LEADING_GARBAGE =
  /^[\u0000-\u0020\u007F-\u00A0\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]+/;

// Harakat / tashkīl et marque de lettre arabe (invisibles) qui ne doivent jamais
// précéder la première consonne d'une phrase arabe : si le modèle émet une
// diacritique isolée en tête (ex: « ِينْ» au lieu de « فِينْ »), on la retire
// pour que l'affichage ne « perde » jamais la première lettre.
const LEADING_ARABIC_DIACRITICS = /^\u061C|^[\u064B-\u065F\u0670]+/;

const clean = (s: string): string =>
  s
    .replace(/\[\/(AR|ARZ|FR|TR|SUGG)\]/gi, '')
    .replace(LEADING_GARBAGE, '')
    .replace(LEADING_ARABIC_DIACRITICS, '')
    .trim();

/**
 * Parse la réponse du roleplay, qui doit suivre le format :
 *   [AR] <arabe> [ARZ] <arabizi> [FR] <français> [SUGG] <sugg1 | sugg2>
 *
 * Garantit que le premier caractère de chaque champ n'est jamais altéré :
 * les caractères invisibles de tête (BOM, ZWSP, marques de direction …) sont
 * retirés, jamais un glyphe visible.
 */
export function parseAiMessage(content: string): ParsedMessage {
  let ar = '';
  let arz = '';
  let fr = '';
  let suggestions: string[] | undefined = undefined;

  const arIndex = content.indexOf('[AR]');
  const arzIndex = content.indexOf('[ARZ]');
  const frIndex = content.indexOf('[FR]');
  const trIndex = content.indexOf('[TR]');
  const suggIndex = content.indexOf('[SUGG]');

  // Fin d'un champ = marqueur reconnu le plus proche strictement après son
  // début. Les marqueurs de tous les types sont des bornes valides, même dans
  // le désordre : un champ ne "mange" jamais le suivant.
  const markers = [arIndex, arzIndex, frIndex, trIndex, suggIndex].filter((m) => m !== -1);
  const nextMarkerAfter = (start: number): number => {
    let end = content.length;
    for (const m of markers) {
      if (m > start && m < end) end = m;
    }
    return end;
  };

  if (arIndex !== -1) {
    ar = clean(content.substring(arIndex + 4, nextMarkerAfter(arIndex + 4)));
  }

  if (arzIndex !== -1) {
    arz = clean(content.substring(arzIndex + 5, nextMarkerAfter(arzIndex + 5)));
  }

  if (frIndex !== -1) {
    fr = clean(content.substring(frIndex + 4, nextMarkerAfter(frIndex + 4)));
  } else if (trIndex !== -1) {
    fr = clean(content.substring(trIndex + 4, nextMarkerAfter(trIndex + 4)));
  }

  if (suggIndex !== -1) {
    const rawSugg = clean(content.substring(suggIndex + 6, nextMarkerAfter(suggIndex + 6)));
    if (rawSugg) {
      suggestions = rawSugg
        .split('|')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  }

  // Repli robuste : si aucune balise reconnue ou si parsing incomplet.
  if (!ar && !arz && !fr) {
    const hasArabicChars = /[\u0600-\u06FF]/.test(content);
    const raw = clean(content);
    if (hasArabicChars) {
      ar = raw;
    } else {
      fr = raw;
    }
  }

  return { ar, arz, fr, ...(suggestions && suggestions.length > 0 ? { suggestions } : {}) };
}

import { prepareDarijaForTts } from '@/lib/tts/darijaPhonetic';

/**
 * Nettoyage strict et conversion phonétique du texte envoyé au TTS :
 * 1. Extrait le bloc [AR] s'il existe.
 * 2. Prépare la phonétique Darija via prepareDarijaForTts (suppression sukūns, voyelles brèves Fusha,
 *    conversion chiffres Arabizi, respelling marocain et coussin acoustique).
 */
export function sanitizeTtsArabic(raw: string): string {
  if (!raw) return '';
  const match = raw.match(/\[AR\]([\s\S]*?)\[\/AR\]/i);
  let text = match ? match[1] : raw;

  // Si on est dans un bloc [AR] contenant des bouts de phrases parasites en latin (ex: "bghit nemchi 123")
  if (match) {
    // Supprimer le latin et les chiffres ordinaires pour ne garder que l'arabe du bloc [AR]
    text = text.replace(/[a-zA-Z0-9_\-#]/g, '');
  }

  return prepareDarijaForTts(text);
}

export const extractCleanArabicForTts = sanitizeTtsArabic;
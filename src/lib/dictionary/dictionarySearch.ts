/**
 * Moteur de recherche phonétique du Dictionnaire de Survie Kenza.
 *
 * La Darija translittérée en « Arabizi » n'a AUCUNE orthographe standard :
 * « combien » s'écrit indifféremment `chhal`, `ch7al`, `shhal`, `bchhal`…
 * La recherche retourne donc le meilleur mot du corpus pour une saisie
 * approchée, en combinant :
 *  1. une normalisation Arabizi (chiffres → lettres, casse, accents) ;
 *  2. un score de distance phonétique basé sur la distance de Levenshtein
 *     appliquée au (mot + ses variantes `aliases`) ;
 *  3. un fallback en distance sur l'arabe (sans diacritiques).
 * Tout le corpus est embarqué dans le bundle : aucune requête réseau →
 * recherche utilisable 100 % hors-ligne (compatible SW de l'Étape 6).
 */

import { ESSENTIAL_SRS_WORDS, srsVocabulary, type EssentialSRSWord } from '../../data/srs-deck';
import type { VocabularySRSData } from '../../types/srs';

/** Traduction des chiffres Arabizi vers leurs lettres (digraphes d'abord). */
const ARABIZI_DIGITS: Record<string, string> = {
  '7': 'h',
  '9': 'q',
  '3': 'e',
  '5': 'kh',
  '2': 'e2', // taa marbouta approximée
  '8': 'gh',
  '0': 'a',
};

/** Groupes sonores proches rendus canoniques pour tolérer les variantes. */
const SOUND_GROUPS: Record<string, string> = {
  sh: 'ch',
  th: 't',
  dh: 'd',
  kh: 'kh',
  gh: 'gh',
};

/** Translittère l'Arabizi (saisie clavier) et les variantes chiffrées en une
 *  forme canonique « phonétique » minuscule et sans signes parasites. */
export function normalizeArabizi(input: string): string {
  if (!input) return '';
  let s = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Chiffres Arabizi → lettres
  for (const [num, repl] of Object.entries(ARABIZI_DIGITS)) {
    s = s.split(num).join(repl);
  }
  // Groupes sonores → forme canonique
  for (const [group, canonical] of Object.entries(SOUND_GROUPS)) {
    s = s.split(group).join(canonical);
  }
  // Espacements et apostrophes variantes
  return s.replace(/[\s_'’‘`-]+/g, '').replace(/[(),.!?]/g, '');
}

/** Retire les diacritiques arabes (chakl / tachkil). */
export function stripArabicDiacritics(ar: string): string {
  return ar.replace(/[\u064B-\u065F\u0670]/g, '');
}

/** Distance de Levenshtein (insertion/suppression/substitution = 1). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const m = a.length;
  const n = b.length;
  // 1D par ligne : mémoire O(n)
  let prev = new Array(n + 1).fill(0).map((_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = new Array(n + 1).fill(0);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[n];
}

export interface DictionaryEntry extends VocabularySRSData {
  aliases: string[];
}

/** Compléments de survie (pain, thé…) présents dans le vocabulaire complet
 *  mais pas dans la liste « essentielle » : enrichit le corpus embarqué. */
const SURVIVAL_EXTRA_IDS = new Set(['srs_khobz', 'srs_atay']);

/** Indexation du corpus une seule fois (module scope constant). */
const CORPUS: DictionaryEntry[] = [
  ...ESSENTIAL_SRS_WORDS,
  ...srsVocabulary.filter((w) => SURVIVAL_EXTRA_IDS.has(w.id)),
].map((w) => ({
  ...w,
  aliases: (w as EssentialSRSWord).aliases ?? [],
}));

/** Score de similarité entre une saisie et un mot : 0 = parfait. Les préfixes
 *  et correspondances exactes sont fortement favorisés. */
function scoreWord(queryNorm: string, wordNorm: string): number {
  if (wordNorm === queryNorm) return 0;
  if (wordNorm.startsWith(queryNorm)) return 0.4;
  if (queryNorm.startsWith(wordNorm)) return 1.2;
  return levenshtein(queryNorm, wordNorm) / Math.max(queryNorm.length, 1);
}

/** Cherche les meilleures entrées du dictionnaire pour une saisie Arabizi (ou
 *  arabe). Le seuil limite le bruit ; les résultats retournent par pertinence.
 *  `limit` ≥ 1. */
export function searchDictionary(input: string, limit = 8): DictionaryEntry[] {
  const q = normalizeArabizi(input).trim();
  if (!q) return [];

  const results: { entry: DictionaryEntry; score: number }[] = [];

  for (const entry of CORPUS) {
    let best = Number.POSITIVE_INFINITY;

    // Candidats : arabizi canonique + chaque variante alias (+ arabe épuré)
    const candidates = [
      entry.arabizi,
      ...entry.aliases,
      stripArabicDiacritics(entry.arabic || ''),
    ].filter(Boolean);

    for (const candidate of candidates) {
      const score = scoreWord(q, normalizeArabizi(candidate));
      if (score < best) best = score;
    }

    // Traduction (fr/en/es/ar) comme candidat auxiliaire : match exact
    // prioritaire, sinon légèrement pénalisé pour l'ordonnancement.
    const rawTranslationScore = (() => {
      let s = Number.POSITIVE_INFINITY;
      for (const lang of ['fr', 'en', 'es', 'ar'] as const) {
        const tr = entry.translation;
        const t = typeof tr === 'string' ? tr : tr[lang];
        if (!t) continue;
        const score = scoreWord(q, normalizeArabizi(t));
        if (score < s) s = score;
      }
      return s;
    })();

    if (rawTranslationScore === 0) {
      // Match exact d'une traduction (ex. « pain ») : priorité maximale
      results.push({ entry, score: -1 });
    } else if (best <= 0.9) {
      results.push({ entry, score: best });
    } else if (rawTranslationScore <= 1.4) {
      // Fuzzy raisonnable sur la traduction, classé derrière les natifs
      results.push({ entry, score: Math.min(2, rawTranslationScore + 1.5) });
    }
  }

  results.sort((a, b) => a.score - b.score);
  return results.slice(0, Math.max(1, limit)).map((r) => r.entry);
}
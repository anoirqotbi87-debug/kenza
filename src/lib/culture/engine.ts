import type { MultiLangText } from '../../types/curriculum';
import type { CustomVocabularyItem } from '../../types/srs';
import type { CulturalGem, GemCategory, GemPhrase } from '../../data/culturalGems';

const LANGS: readonly string[] = ['fr', 'en', 'es', 'ar'];
const MS_PER_DAY = 86_400_000;

/** Saisit un texte localisé (MultiLangText ou chaîne simple) avec repli fr. */
export function localize(value: MultiLangText | string, lang: string): string {
  if (typeof value === 'string') return value;
  const key = LANGS.includes(lang) ? lang : 'fr';
  return value[key as keyof MultiLangText] ?? value.fr ?? '';
}

/** Filtre le corpus par onglet. */
export function filterGems<T extends { category: GemCategory }>(
  gems: T[],
  category: GemCategory
): T[] {
  return gems.filter((gem) => gem.category === category);
}

/**
 * Perle du jour : rotation déterministe indexée sur le jour UTC.
 * Deux appels le même jour renvoient la même perle, sans stockage.
 */
export function getGemIndexForDate(date: Date, count: number): number {
  if (count <= 0) return 0;
  const epochDay = Math.floor(date.getTime() / MS_PER_DAY);
  return ((epochDay % count) + count) % count;
}

export function getGemOfTheDay<T>(gems: T[], date: Date = new Date()): T {
  if (gems.length === 0) throw new Error('getGemOfTheDay requires a non-empty corpus');
  return gems[getGemIndexForDate(date, gems.length)];
}

/** Phrase mise en avant : la réponse à mémoriser (ping-pong) ou le proverbe. */
export function getHeadlinePhrase(gem: CulturalGem): GemPhrase {
  return gem.category === 'pingpong' ? gem.response : gem.expression;
}

/** Phrase complémentaire : la formule entendue, ou null pour un proverbe. */
export function getSecondaryPhrase(gem: CulturalGem): GemPhrase | null {
  return gem.category === 'pingpong' ? gem.prompt : null;
}

/** Explication localisée : contexte d'usage (ping-pong) ou sens réel (proverbe). */
export function getGemExplanation(gem: CulturalGem, lang: string): string {
  return gem.category === 'pingpong'
    ? localize(gem.context, lang)
    : localize(gem.meaning, lang);
}

/** Exemple de rue (proverbe) — null pour une formule de politesse. */
export function getGemStreetExample(gem: CulturalGem): GemPhrase | null {
  return gem.category === 'proverb' ? gem.streetExample : null;
}

/**
 * Convertit une perle culturelle en carte SRS personnalisée.
 * On mémorise la phrase à répliquer ; l'exemple sert de contexte.
 */
export function toSrsCard(gem: CulturalGem, lang: string): CustomVocabularyItem {
  const headline = getHeadlinePhrase(gem);
  const example = gem.category === 'pingpong' ? gem.prompt : gem.streetExample;

  return {
    id: `srs_culture_${gem.id}`,
    arabizi: headline.arabizi,
    arabic: headline.arabic,
    translation: headline.translation,
    category: `culture_${gem.category}`,
    example: {
      arabizi: example.arabizi,
      arabic: example.arabic,
      translation: example.translation,
    },
    culturalNote: getGemExplanation(gem, lang),
    source: 'manual',
  };
}

/** Lit la liste de favoris stockée en localStorage, en tolérant un JSON corrompu. */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

/** Ajoute ou retire un identifiant, sans muter la liste d'origine. */
export function toggleFavorite(favorites: string[], id: string): string[] {
  return favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];
}

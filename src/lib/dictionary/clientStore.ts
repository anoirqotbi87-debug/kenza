'use client';

import { createFavoritesStore, useFavorites } from '@/lib/favorites/store';

/** Clé de stockage : ne jamais la renommer sans migration, les favoris des
 *  utilisateurs y sont déjà écrits. */
export const DICTIONARY_FAVORITES_KEY = 'kenza_dictionary_favorites';

export const dictionaryFavorites = createFavoritesStore(DICTIONARY_FAVORITES_KEY);

export function toggleDictionaryFavorite(id: string): string[] {
  return dictionaryFavorites.toggle(id);
}

export function useDictionaryFavorites(): string[] {
  return useFavorites(dictionaryFavorites);
}

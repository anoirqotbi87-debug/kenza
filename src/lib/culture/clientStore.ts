'use client';

import { useSyncExternalStore } from 'react';
import { createFavoritesStore, useFavorites } from '@/lib/favorites/store';
import { parseFavorites, toggleFavorite } from './engine';

/** Clé de stockage : ne jamais la renommer sans migration. */
export const CULTURE_FAVORITES_KEY = 'kenza_culture_favorites';

/**
 * Favoris de la page /culture. Le store générique garantit un snapshot
 * référentiellement stable (exigé par `useSyncExternalStore`) et une écriture
 * tolérante aux pannes de `localStorage`.
 */
export const cultureFavorites = createFavoritesStore(CULTURE_FAVORITES_KEY, {
  parse: parseFavorites,
  toggle: toggleFavorite,
});

export function getFavoritesSnapshot(): string[] {
  return cultureFavorites.getSnapshot();
}

export function getFavoritesServerSnapshot(): string[] {
  return cultureFavorites.getServerSnapshot();
}

export function subscribeFavorites(listener: () => void): () => void {
  return cultureFavorites.subscribe(listener);
}

export function toggleCultureFavorite(id: string): void {
  cultureFavorites.toggle(id);
}

export function useCultureFavorites(): string[] {
  return useFavorites(cultureFavorites);
}

const subscribeNever = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * Vrai seulement après l'hydratation. Permet de calculer des valeurs liées à
 * la date ou au navigateur sans provoquer de divergence serveur/client.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, getTrue, getFalse);
}

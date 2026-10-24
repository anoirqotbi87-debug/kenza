'use client';

import { useSyncExternalStore } from 'react';
import { parseFavorites, toggleFavorite } from './engine';

const FAVORITES_KEY = 'kenza_culture_favorites';
const EMPTY: string[] = [];

/**
 * Source de vérité des favoris en mémoire. La première lecture vient du
 * localStorage, les suivantes du cache : le snapshot doit rester
 * référentiellement stable pour `useSyncExternalStore`.
 */
let initialized = false;
let favorites: string[] = EMPTY;
const listeners = new Set<() => void>();

function readStoredFavorites(): string[] {
  if (typeof window === 'undefined') return EMPTY;
  try {
    return parseFavorites(window.localStorage.getItem(FAVORITES_KEY));
  } catch {
    return EMPTY;
  }
}

export function getFavoritesSnapshot(): string[] {
  if (!initialized) {
    favorites = readStoredFavorites();
    initialized = true;
  }
  return favorites;
}

export function getFavoritesServerSnapshot(): string[] {
  return EMPTY;
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleCultureFavorite(id: string): void {
  favorites = toggleFavorite(getFavoritesSnapshot(), id);
  initialized = true;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Stockage indisponible (navigation privée) : les favoris restent en mémoire.
  }
  listeners.forEach((listener) => listener());
}

export function useCultureFavorites(): string[] {
  return useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot
  );
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

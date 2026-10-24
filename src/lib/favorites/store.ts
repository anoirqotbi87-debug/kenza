/**
 * Collection de favoris persistée localement.
 *
 * Le même contrat sert au dictionnaire et au module culturel : une liste
 * d'identifiants, un cache mémoire référentiellement stable (exigé par
 * `useSyncExternalStore`) et une écriture tolérante aux pannes de stockage.
 * Aucun `setState` dans un effet : la source de vérité est ce store externe.
 */

import { useSyncExternalStore } from 'react';
import { getBrowserStorage, isStringArray, writeJSON, type StorageLike } from '../offline/storage';

/** Référence partagée des snapshots vides : elle doit rester stable entre rendus. */
const EMPTY: string[] = [];

export type FavoritesParser = (raw: string | null) => string[];
export type FavoritesToggler = (favorites: string[], id: string) => string[];

export function parseFavoritesList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isStringArray(parsed)) return [...parsed];
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item): item is string => typeof item === 'string'))];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(favorites: string[], id: string): string[] {
  return favorites.includes(id)
    ? favorites.filter((item) => item !== id)
    : [...favorites, id];
}

export interface FavoritesStoreOptions {
  parse?: FavoritesParser;
  toggle?: FavoritesToggler;
  /** Injection de stockage (tests). Par défaut : `window.localStorage`. */
  storage?: () => StorageLike | null;
}

export interface FavoritesStore {
  key: string;
  getSnapshot: () => string[];
  getServerSnapshot: () => string[];
  subscribe: (listener: () => void) => () => void;
  toggle: (id: string) => string[];
  has: (id: string) => boolean;
  /** Vide la liste persistée. */
  clear: () => void;
  /** Réinitialise le cache mémoire (tests, changement d'utilisateur). */
  reset: () => void;
}

export function createFavoritesStore(
  key: string,
  options: FavoritesStoreOptions = {}
): FavoritesStore {
  const parse = options.parse ?? parseFavoritesList;
  const toggle = options.toggle ?? toggleFavoriteId;
  const getStorage = options.storage ?? getBrowserStorage;

  let initialized = false;
  let favorites: string[] = EMPTY;
  const listeners = new Set<() => void>();

  function readStored(): string[] {
    const storage = getStorage();
    if (!storage) return EMPTY;
    try {
      return parse(storage.getItem(key));
    } catch {
      return EMPTY;
    }
  }

  function getSnapshot(): string[] {
    if (!initialized) {
      favorites = readStored();
      initialized = true;
    }
    return favorites;
  }

  function getServerSnapshot(): string[] {
    return EMPTY;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function notify(): void {
    listeners.forEach((listener) => listener());
  }

  function persist(): void {
    const storage = getStorage();
    if (!storage) return;
    writeJSON(key, favorites, storage);
  }

  function toggleId(id: string): string[] {
    favorites = toggle(getSnapshot(), id);
    initialized = true;
    persist();
    notify();
    return favorites;
  }

  function has(id: string): boolean {
    return getSnapshot().includes(id);
  }

  function clear(): void {
    favorites = EMPTY;
    initialized = true;
    persist();
    notify();
  }

  function reset(): void {
    favorites = EMPTY;
    initialized = false;
    notify();
  }

  return { key, getSnapshot, getServerSnapshot, subscribe, toggle: toggleId, has, clear, reset };
}

/** Hook de lecture pour un store de favoris. */
export function useFavorites(store: FavoritesStore): string[] {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/**
 * Accès au stockage local tolérant aux pannes.
 *
 * `localStorage` peut être indisponible (navigation privée, quota plein, iframe
 * verrouillée) ou contenir une valeur corrompue. Ces cas ne doivent jamais
 * casser une page : on retombe sur une valeur par défaut et on purge l'entrée
 * illisible pour qu'un rechargement reparte proprement.
 * Les fonctions acceptent un `storage` injecté pour rester testables hors
 * navigateur.
 */

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export interface ReadOptions<T> {
  storage?: StorageLike | null;
  /** Garde de forme : une valeur persistée plus ancienne ou bricolée est ignorée. */
  validate?: (value: unknown) => value is T;
}

export function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Lit et décode une entrée JSON. Toute anomalie renvoie `fallback` ; seule
 *  une valeur réellement corrompue (JSON invalide) est supprimée — une valeur
 *  bien formée qui ne satisfait pas la garde de forme est conservée, un autre
 *  lecteur (version antérieure) pourrait la comprendre. */
export function readJSON<T>(key: string, fallback: T, options: ReadOptions<T> = {}): T {
  const storage = options.storage === undefined ? getBrowserStorage() : options.storage;
  if (!storage) return fallback;

  let raw: string | null = null;
  try {
    raw = storage.getItem(key);
  } catch {
    return fallback;
  }
  if (raw === null) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    removeStored(key, storage);
    return fallback;
  }
  if (options.validate && !options.validate(parsed)) return fallback;
  return parsed as T;
}

/** Écrit une entrée JSON. Renvoie `false` si le stockage refuse (quota,
 *  navigation privée) — l'appelant garde alors sa valeur en mémoire. */
export function writeJSON(key: string, value: unknown, storage?: StorageLike | null): boolean {
  const target = storage === undefined ? getBrowserStorage() : storage;
  if (!target) return false;
  try {
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStored(key: string, storage?: StorageLike | null): void {
  const target = storage === undefined ? getBrowserStorage() : storage;
  if (!target) return;
  try {
    target.removeItem(key);
  } catch {
    // Rien de plus à faire : l'entrée restera simplement ignorée.
  }
}

/** Garde de forme pour un tableau de chaînes non vides et uniques. */
export function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string' && item.length > 0) &&
    new Set(value).size === value.length
  );
}

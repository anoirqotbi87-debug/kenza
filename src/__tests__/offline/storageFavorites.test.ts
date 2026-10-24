/**
 * Étape 6 — Stockage tolérant aux pannes et favoris partagés.
 *
 * `localStorage` peut être indisponible ou corrompu : lecture et écriture
 * doivent retomber proprement, et le store de favoris doit exposer des
 * snapshots référentiellement stables (contrat `useSyncExternalStore`).
 */

import { describe, it, expect, vi } from 'vitest';
import {
  isStringArray,
  readJSON,
  removeStored,
  writeJSON,
  type StorageLike,
} from '@/lib/offline/storage';
import { parseFavoritesList, createFavoritesStore } from '@/lib/favorites/store';

function memoryStorage(initial: Record<string, string> = {}): StorageLike & {
  data: Record<string, string>;
} {
  const data: Record<string, string> = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

describe('stockage tolérant aux pannes', () => {
  it('retourne le fallback si le stockage est absent (SSR)', () => {
    expect(readJSON('k', ['fallback'], { storage: null })).toEqual(['fallback']);
    expect(writeJSON('k', { a: 1 }, null)).toBe(false);
  });

  it('lit/écrit un objet JSON', () => {
    const storage = memoryStorage();
    writeJSON('k', { a: 1 }, storage);
    expect(readJSON('k', null, { storage })).toEqual({ a: 1 });
  });

  it('purge une valeur corrompue et retourne le fallback', () => {
    const storage = memoryStorage({ k: '{not json' });
    expect(readJSON('k', 'fallback', { storage })).toBe('fallback');
    expect(storage.data['k']).toBeUndefined();
  });

  it('applique la garde de forme, sans supprimer la valeur illisible', () => {
    const storage = memoryStorage({ k: '{"a":1}' });
    const result = readJSON('k', 'fallback', {
      storage,
      validate: (value: unknown): value is string => typeof value === 'string',
    });
    expect(result).toBe('fallback');
    // Valide syntaxiquement : on ne la purge pas, un autre lecteur pourrait
    // comprendre cette valeur.
    expect(storage.data['k']).toBe('{"a":1}');
  });

  it('tolère les exceptions du stockage (navigation privée, quota)', () => {
    const broken: StorageLike = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(readJSON('k', 0, { storage: broken })).toBe(0);
    expect(writeJSON('k', 1, broken)).toBe(false);
    expect(() => removeStored('k', broken)).not.toThrow();
  });

  it('valide les tableaux de chaînes', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray(['a', 'a'])).toBe(false);
    expect(isStringArray(['a', 1])).toBe(false);
    expect(isStringArray([])).toBe(true);
  });
});

describe('store de favoris partagé', () => {
  it('lit les favoris existants et expose un snapshot stable', () => {
    const storage = memoryStorage({ kenza_fav: '["a","b"]' });
    const store = createFavoritesStore('kenza_fav', { storage: () => storage });

    const first = store.getSnapshot();
    expect(first).toEqual(['a', 'b']);
    // Le snapshot ne change pas de référence sans changement d'état.
    expect(store.getSnapshot()).toBe(first);
  });

  it('bascules un favori et persiste dans le bon format', () => {
    const storage = memoryStorage({});
    const store = createFavoritesStore('kenza_fav', { storage: () => storage });

    store.toggle('salam');
    expect(store.getSnapshot()).toEqual(['salam']);
    expect(JSON.parse(storage.data['kenza_fav'] as string)).toEqual(['salam']);

    store.toggle('salam');
    expect(store.getSnapshot()).toEqual([]);
  });

  it('notifie les abonnés et ignore les identifiants vides du stockage', () => {
    const storage = memoryStorage({ k: '["x","","x"]' });
    const store = createFavoritesStore('k', { storage: () => storage });

    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.toggle('y');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.has('y')).toBe(true);
    // La désinscription arrête bien les notifications.
    unsubscribe();
    store.toggle('z');
    expect(listener).toHaveBeenCalledTimes(1);

    const clean = createFavoritesStore('k2', {
      storage: () => memoryStorage({ k2: '["x","x"]' }),
    });
    expect(clean.getSnapshot()).toEqual(['x']);
  });

  it('retombe sur le fournisseur de parse fourni (mode strict)', () => {
    const storage = memoryStorage({ k: '["a","b"]' });
    const strict = createFavoritesStore('k', {
      storage: () => storage,
      parse: (raw) => JSON.parse(raw as string),
      toggle: (favorites, id) => [...favorites, id],
    });
    expect(strict.getSnapshot()).toEqual(['a', 'b']);
  });

  it('parse la liste tel quel : chaque entrée pré-existante survit', () => {
    expect(parseFavoritesList('["a","b"]')).toEqual(['a', 'b']);
    expect(parseFavoritesList('{bad')).toEqual([]);
    expect(parseFavoritesList(null)).toEqual([]);
  });
});

describe('contrat de snapshot (useSyncExternalStore)', () => {
  it('sert EMPTY au serveur et hydrâte la première lecture client', () => {
    const storage = memoryStorage({ k: '["a"]' });
    const store = createFavoritesStore('k', { storage: () => storage });

    expect(store.getServerSnapshot()).toEqual([]);
    expect(store.getSnapshot()).toEqual(['a']);
  });

  it('garde la référence du snapshot tant que l’état n’a pas changé', () => {
    const storage = memoryStorage({ k: '[]' });
    const store = createFavoritesStore('k', { storage: () => storage });
    const empty = store.getSnapshot();
    expect(empty).toBe(store.getSnapshot());
    store.toggle('a');
    expect(store.getSnapshot()).not.toBe(empty);
  });

  it('réinitialise le cache mémoire (relit ensuite le stockage)', () => {
    const storage = memoryStorage({ k: '["a"]' });
    const store = createFavoritesStore('k', { storage: () => storage });
    expect(store.getSnapshot()).toEqual(['a']);
    store.reset();
    // Après reset, stockage non vide → la première lecture le relit.
    expect(store.getSnapshot()).toEqual(['a']);

    // Avec un stockage vidé entre-temps, reset repart de zéro.
    delete storage.data['k'];
    store.reset();
    expect(store.getSnapshot()).toEqual([]);
  });
});
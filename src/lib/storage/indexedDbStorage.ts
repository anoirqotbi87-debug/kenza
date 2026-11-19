import { get, set, del, type UseStore } from 'idb-keyval';
import type { StateStorage } from 'zustand/middleware';

/**
 * Détermine si IndexedDB est supporté et disponible dans l'environnement courant.
 * Retourne false côté serveur (SSR) ou si IndexedDB est bloqué (ex: navigation privée restrictive).
 */
export const isIndexedDbSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  } catch {
    return false;
  }
};

/**
 * Fabrique un adaptateur Zustand StateStorage basé sur IndexedDB avec gestion d'erreurs
 * et repli de secours sur localStorage en cas d'indisponibilité ou d'erreur.
 */
export const createIndexedDbStorage = (customStore?: UseStore): StateStorage => ({
  getItem: async (name: string): Promise<string | null> => {
    // 1. Tenter la lecture dans IndexedDB si supporté
    if (isIndexedDbSupported()) {
      try {
        const val = await (customStore ? get(name, customStore) : get(name));
        if (val !== undefined && val !== null) {
          return typeof val === 'string' ? val : JSON.stringify(val);
        }

        // Si la clé n'existe pas encore dans IndexedDB, vérifier s'il existe une valeur dans localStorage
        // pour assurer une migration transparente dès le premier chargement.
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          const localVal = window.localStorage.getItem(name);
          if (localVal) {
            try {
              await (customStore ? set(name, localVal, customStore) : set(name, localVal));
            } catch {}
            return localVal;
          }
        }

        return null;
      } catch (error) {
        console.warn(`[indexedDbStorage] Erreur de lecture IDB pour '${name}', repli sur localStorage:`, error);
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          try {
            return window.localStorage.getItem(name);
          } catch {}
        }
        return null;
      }
    }

    // 2. Repli direct sur localStorage si IndexedDB n'est pas supporté (ex: tests Vitest sans IDB mock)
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        return window.localStorage.getItem(name);
      } catch {
        return null;
      }
    }

    return null;
  },

  setItem: async (name: string, value: string): Promise<void> => {
    if (isIndexedDbSupported()) {
      try {
        await (customStore ? set(name, value, customStore) : set(name, value));
        return;
      } catch (error) {
        console.warn(`[indexedDbStorage] Erreur d'écriture IDB pour '${name}', repli sur localStorage:`, error);
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          try {
            window.localStorage.setItem(name, value);
          } catch {}
        }
        return;
      }
    }

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.setItem(name, value);
      } catch {}
    }
  },

  removeItem: async (name: string): Promise<void> => {
    if (isIndexedDbSupported()) {
      try {
        await (customStore ? del(name, customStore) : del(name));
        // Nettoyage miroir dans localStorage si présent pour éviter la résurgence d'anciennes données
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          try {
            window.localStorage.removeItem(name);
          } catch {}
        }
        return;
      } catch (error) {
        console.warn(`[indexedDbStorage] Erreur de suppression IDB pour '${name}':`, error);
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          try {
            window.localStorage.removeItem(name);
          } catch {}
        }
        return;
      }
    }

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        window.localStorage.removeItem(name);
      } catch {}
    }
  },
});

/**
 * Instance par défaut de l'adaptateur IndexedDB pour Zustand.
 */
export const indexedDbStorage: StateStorage = createIndexedDbStorage();

/**
 * Alias pour correspondre aux différentes conventions d'importation.
 */
export const indexedDBStorage = indexedDbStorage;

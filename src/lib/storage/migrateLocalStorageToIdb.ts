import { get, set, type UseStore } from 'idb-keyval';
import { isIndexedDbSupported } from './indexedDbStorage';

export interface MigrationResult {
  migrated: boolean;
  key: string;
  source: 'localStorage';
  destination: 'indexedDB';
  valueLength?: number;
  error?: unknown;
}

/**
 * Clé de stockage principale utilisée par le store Zustand de Kenza.
 */
export const DEFAULT_KENZA_STORAGE_KEY = 'darija-quest-storage';

/**
 * Migre une entrée persistée de localStorage vers IndexedDB si elle n'est pas encore
 * présente dans IndexedDB.
 *
 * S'exécute côté client uniquement, entièrement sécurisé contre le SSR et les
 * environnements où IndexedDB ou localStorage sont bloqués.
 *
 * @param key La clé à migrer (défaut: 'darija-quest-storage')
 * @param customStore Optionnel, magasin idb-keyval personnalisé
 * @returns MigrationResult détaillant si la migration a eu lieu
 */
export async function migrateLocalStorageToIdb(
  key: string = DEFAULT_KENZA_STORAGE_KEY,
  customStore?: UseStore
): Promise<MigrationResult> {
  const result: MigrationResult = {
    migrated: false,
    key,
    source: 'localStorage',
    destination: 'indexedDB',
  };

  // Ne s'exécute que côté client dans un navigateur supportant IndexedDB et localStorage
  if (
    typeof window === 'undefined' ||
    typeof window.localStorage === 'undefined' ||
    !isIndexedDbSupported()
  ) {
    return result;
  }

  try {
    // 1. Vérifier si IndexedDB contient déjà une entrée pour cette clé
    const existingIdbValue = await (customStore ? get(key, customStore) : get(key));
    if (existingIdbValue !== undefined && existingIdbValue !== null) {
      // Déjà présent dans IndexedDB, aucune migration nécessaire
      return result;
    }

    // 2. Vérifier si localStorage contient une entrée à migrer
    const localValue = window.localStorage.getItem(key);
    if (!localValue) {
      // Rien à migrer
      return result;
    }

    // 3. Copier dans IndexedDB
    await (customStore ? set(key, localValue, customStore) : set(key, localValue));

    result.migrated = true;
    result.valueLength = localValue.length;
    return result;
  } catch (error) {
    result.error = error;
    console.warn(`[migrateLocalStorageToIdb] Échec de la migration pour '${key}':`, error);
    return result;
  }
}

/**
 * Migre une liste de clés depuis localStorage vers IndexedDB.
 */
export async function migrateMultipleKeysToIdb(
  keys: string[],
  customStore?: UseStore
): Promise<Record<string, MigrationResult>> {
  const results: Record<string, MigrationResult> = {};
  for (const k of keys) {
    results[k] = await migrateLocalStorageToIdb(k, customStore);
  }
  return results;
}

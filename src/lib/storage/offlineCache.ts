import { get, set, del, keys, createStore, type UseStore } from 'idb-keyval';
import { isIndexedDbSupported } from './indexedDbStorage';
import type { Lesson } from '@/types/curriculum';
import type { SRSCard } from '@/types/srs';

export type OfflinePackType = 'lessons' | 'phrases' | 'srs' | 'dictionary' | 'vocal_srs' | 'custom';

export interface OfflinePackMetadata {
  id: string;
  type: OfflinePackType;
  version: number;
  itemCount: number;
  savedAt: string; // ISO string
  title?: string;
  description?: string;
  checksum?: string;
}

export interface OfflinePack<T = unknown> {
  metadata: OfflinePackMetadata;
  data: T;
}

/**
 * Magasin IndexedDB dédié aux packs hors-ligne pour isoler le cache lourd
 * du state de session / progression de l'utilisateur.
 */
let _offlineCustomStore: UseStore | null = null;
const getOfflineStore = (): UseStore | undefined => {
  if (typeof window === 'undefined' || !isIndexedDbSupported()) return undefined;
  if (!_offlineCustomStore) {
    try {
      _offlineCustomStore = createStore('kenza-offline-db', 'offline-packs');
    } catch {
      return undefined;
    }
  }
  return _offlineCustomStore;
};

const OFFLINE_KEY_PREFIX = 'offline_pack:';

const formatPackKey = (packId: string): string => {
  return packId.startsWith(OFFLINE_KEY_PREFIX) ? packId : `${OFFLINE_KEY_PREFIX}${packId}`;
};

/**
 * Enregistre un pack hors-ligne typé dans IndexedDB.
 */
export async function saveOfflinePack<T>(
  packId: string,
  type: OfflinePackType,
  data: T,
  meta?: Partial<OfflinePackMetadata>
): Promise<OfflinePack<T>> {
  const count = Array.isArray(data)
    ? data.length
    : typeof data === 'object' && data !== null
    ? Object.keys(data).length
    : 1;

  const metadata: OfflinePackMetadata = {
    id: packId,
    type,
    version: meta?.version ?? 1,
    itemCount: meta?.itemCount ?? count,
    savedAt: new Date().toISOString(),
    title: meta?.title,
    description: meta?.description,
    checksum: meta?.checksum,
  };

  const pack: OfflinePack<T> = {
    metadata,
    data,
  };

  const storeKey = formatPackKey(packId);

  if (isIndexedDbSupported()) {
    try {
      const store = getOfflineStore();
      await (store ? set(storeKey, pack, store) : set(storeKey, pack));
      return pack;
    } catch (error) {
      console.warn(`[offlineCache] Erreur d'écriture IDB pour '${packId}':`, error);
    }
  }

  // Repli sur localStorage si disponible et taille raisonnable
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.setItem(storeKey, JSON.stringify(pack));
    } catch (localError) {
      console.warn(`[offlineCache] Échec du repli localStorage pour '${packId}':`, localError);
    }
  }

  return pack;
}

/**
 * Charge un pack hors-ligne depuis IndexedDB ou le repli localStorage.
 */
export async function loadOfflinePack<T>(packId: string): Promise<OfflinePack<T> | null> {
  const storeKey = formatPackKey(packId);

  if (isIndexedDbSupported()) {
    try {
      const store = getOfflineStore();
      const val = await (store ? get(storeKey, store) : get(storeKey));
      if (val) {
        return val as OfflinePack<T>;
      }
    } catch (error) {
      console.warn(`[offlineCache] Erreur de lecture IDB pour '${packId}':`, error);
    }
  }

  // Repli de lecture localStorage
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      const localVal = window.localStorage.getItem(storeKey);
      if (localVal) {
        return JSON.parse(localVal) as OfflinePack<T>;
      }
    } catch {}
  }

  return null;
}

/**
 * Supprime un pack hors-ligne du stockage local.
 */
export async function clearOfflinePack(packId: string): Promise<boolean> {
  const storeKey = formatPackKey(packId);
  let cleared = false;

  if (isIndexedDbSupported()) {
    try {
      const store = getOfflineStore();
      await (store ? del(storeKey, store) : del(storeKey));
      cleared = true;
    } catch (error) {
      console.warn(`[offlineCache] Erreur de suppression IDB pour '${packId}':`, error);
    }
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.removeItem(storeKey);
      cleared = true;
    } catch {}
  }

  return cleared;
}

/**
 * Vérifie si un pack spécifique est déjà en cache localement.
 */
export async function hasOfflinePack(packId: string): Promise<boolean> {
  const pack = await loadOfflinePack(packId);
  return pack !== null;
}

/**
 * Liste les métadonnées de tous les packs hors-ligne stockés.
 */
export async function listOfflinePacks(): Promise<OfflinePackMetadata[]> {
  const packMetas: OfflinePackMetadata[] = [];

  if (isIndexedDbSupported()) {
    try {
      const store = getOfflineStore();
      const allKeys = await (store ? keys(store) : keys());
      for (const k of allKeys) {
        const keyStr = String(k);
        if (keyStr.startsWith(OFFLINE_KEY_PREFIX)) {
          const pack = await (store ? get(keyStr, store) : get(keyStr));
          if (pack && typeof pack === 'object' && 'metadata' in pack) {
            packMetas.push((pack as OfflinePack).metadata);
          }
        }
      }
      return packMetas;
    } catch (error) {
      console.warn('[offlineCache] Erreur de listing des packs IDB:', error);
    }
  }

  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(OFFLINE_KEY_PREFIX)) {
          const item = window.localStorage.getItem(k);
          if (item) {
            try {
              const parsed = JSON.parse(item);
              if (parsed?.metadata) packMetas.push(parsed.metadata);
            } catch {}
          }
        }
      }
    } catch {}
  }

  return packMetas;
}

/**
 * Helpers spécialisés pour les leçons, phrases et SRS
 */
export async function saveLessonsOfflinePack(
  packId: string,
  lessons: Lesson[],
  meta?: Partial<OfflinePackMetadata>
): Promise<OfflinePack<Lesson[]>> {
  return saveOfflinePack<Lesson[]>(packId, 'lessons', lessons, {
    title: meta?.title || `Pack Leçons (${lessons.length})`,
    ...meta,
  });
}

export async function loadLessonsOfflinePack(
  packId: string
): Promise<OfflinePack<Lesson[]> | null> {
  return loadOfflinePack<Lesson[]>(packId);
}

export async function savePhrasesOfflinePack<T = unknown[]>(
  packId: string,
  phrases: T,
  meta?: Partial<OfflinePackMetadata>
): Promise<OfflinePack<T>> {
  return saveOfflinePack<T>(packId, 'phrases', phrases, {
    title: meta?.title || 'Pack Phrases du Quotidien',
    ...meta,
  });
}

export async function loadPhrasesOfflinePack<T = unknown[]>(
  packId: string
): Promise<OfflinePack<T> | null> {
  return loadOfflinePack<T>(packId);
}

export async function saveSrsOfflinePack(
  packId: string,
  cards: Record<string, SRSCard>,
  meta?: Partial<OfflinePackMetadata>
): Promise<OfflinePack<Record<string, SRSCard>>> {
  return saveOfflinePack<Record<string, SRSCard>>(packId, 'srs', cards, {
    title: meta?.title || 'Pack Deck SRS',
    ...meta,
  });
}

export async function loadSrsOfflinePack(
  packId: string
): Promise<OfflinePack<Record<string, SRSCard>> | null> {
  return loadOfflinePack<Record<string, SRSCard>>(packId);
}

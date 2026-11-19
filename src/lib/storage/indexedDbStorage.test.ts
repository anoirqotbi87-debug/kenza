import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get, set, del } from 'idb-keyval';
import {
  createIndexedDbStorage,
  indexedDbStorage,
  isIndexedDbSupported,
} from './indexedDbStorage';
import {
  migrateLocalStorageToIdb,
  migrateMultipleKeysToIdb,
} from './migrateLocalStorageToIdb';
import {
  saveOfflinePack,
  loadOfflinePack,
  clearOfflinePack,
  hasOfflinePack,
  listOfflinePacks,
  saveLessonsOfflinePack,
  loadLessonsOfflinePack,
  savePhrasesOfflinePack,
  loadPhrasesOfflinePack,
  saveSrsOfflinePack,
  loadSrsOfflinePack,
} from './offlineCache';
import type { Lesson } from '@/types/curriculum';
import type { SRSCard } from '@/types/srs';

const mockIdbData = new Map<string, unknown>();

vi.mock('idb-keyval', () => ({
  get: vi.fn(async (key: unknown) => mockIdbData.get(String(key))),
  set: vi.fn(async (key: unknown, val: unknown) => {
    mockIdbData.set(String(key), val);
  }),
  del: vi.fn(async (key: unknown) => {
    mockIdbData.delete(String(key));
  }),
  keys: vi.fn(async () => Array.from(mockIdbData.keys())),
  createStore: vi.fn(() => ({})),
}));

describe('indexedDbStorage - Adaptateur Zustand StateStorage', () => {
  let mockLocalData: Map<string, string>;

  beforeEach(() => {
    mockIdbData.clear();
    mockLocalData = new Map();

    // Réinitialise les implémentations par défaut
    vi.mocked(get).mockImplementation(async (key) => mockIdbData.get(String(key)));
    vi.mocked(set).mockImplementation(async (key, val) => {
      mockIdbData.set(String(key), val);
    });
    vi.mocked(del).mockImplementation(async (key) => {
      mockIdbData.delete(String(key));
    });

    // Mock de localStorage
    const storage = {
      getItem: (key: string) => mockLocalData.get(key) ?? null,
      setItem: (key: string, val: string) => void mockLocalData.set(key, val),
      removeItem: (key: string) => void mockLocalData.delete(key),
      clear: () => mockLocalData.clear(),
      key: (i: number) => Array.from(mockLocalData.keys())[i] ?? null,
      get length() {
        return mockLocalData.size;
      },
    };

    vi.stubGlobal('window', {
      indexedDB: {},
      localStorage: storage,
    });
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('détecte le support de IndexedDB dans le navigateur', () => {
    expect(isIndexedDbSupported()).toBe(true);
  });

  it('fonctionne avec l\'instance par défaut exportée indexedDbStorage', async () => {
    await indexedDbStorage.setItem('singleton_test', '123');
    expect(await indexedDbStorage.getItem('singleton_test')).toBe('123');
  });

  it('écrit et lit une chaîne dans IndexedDB', async () => {
    const storage = createIndexedDbStorage();
    await storage.setItem('test_key', '{"xp":100}');

    const value = await storage.getItem('test_key');
    expect(value).toBe('{"xp":100}');
    expect(mockIdbData.get('test_key')).toBe('{"xp":100}');
  });

  it('renvoie null si la clé est absente dans IndexedDB et localStorage', async () => {
    const storage = createIndexedDbStorage();
    const value = await storage.getItem('unknown_key');
    expect(value).toBeNull();
  });

  it('supprime une clé dans IndexedDB et dans localStorage', async () => {
    const storage = createIndexedDbStorage();
    await storage.setItem('key_to_delete', 'value123');
    mockLocalData.set('key_to_delete', 'value123');

    await storage.removeItem('key_to_delete');
    expect(await storage.getItem('key_to_delete')).toBeNull();
    expect(mockLocalData.has('key_to_delete')).toBe(false);
  });

  it('migre automatiquement depuis localStorage lors du premier getItem si IDB est vide', async () => {
    mockLocalData.set('darija-quest-storage', '{"state":{"xp":250}}');
    expect(mockIdbData.has('darija-quest-storage')).toBe(false);

    const storage = createIndexedDbStorage();
    const value = await storage.getItem('darija-quest-storage');

    expect(value).toBe('{"state":{"xp":250}}');
    expect(mockIdbData.get('darija-quest-storage')).toBe('{"state":{"xp":250}}');
  });

  it('bascule sur localStorage si la lecture IDB lève une exception', async () => {
    vi.mocked(get).mockRejectedValueOnce(new Error('QuotaExceeded'));
    mockLocalData.set('fallback_key', 'local_backup_data');

    const storage = createIndexedDbStorage();
    const value = await storage.getItem('fallback_key');
    expect(value).toBe('local_backup_data');
  });

  it('ne plante pas et replie sur localStorage si l’écriture IDB lève une exception', async () => {
    vi.mocked(set).mockRejectedValueOnce(new Error('WriteFailure'));

    const storage = createIndexedDbStorage();
    await expect(storage.setItem('error_key', 'error_val')).resolves.not.toThrow();
    expect(mockLocalData.get('error_key')).toBe('error_val');
  });
});

describe('migrateLocalStorageToIdb - Migration explicite', () => {
  let mockLocalData: Map<string, string>;

  beforeEach(() => {
    mockIdbData.clear();
    mockLocalData = new Map();

    vi.mocked(get).mockImplementation(async (key) => mockIdbData.get(String(key)));
    vi.mocked(set).mockImplementation(async (key, val) => {
      mockIdbData.set(String(key), val);
    });

    const storage = {
      getItem: (key: string) => mockLocalData.get(key) ?? null,
      setItem: (key: string, val: string) => void mockLocalData.set(key, val),
      removeItem: (key: string) => void mockLocalData.delete(key),
      clear: () => mockLocalData.clear(),
      key: (i: number) => Array.from(mockLocalData.keys())[i] ?? null,
      get length() {
        return mockLocalData.size;
      },
    };

    vi.stubGlobal('window', {
      indexedDB: {},
      localStorage: storage,
    });
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('copie les données de localStorage vers IndexedDB si absentes', async () => {
    mockLocalData.set('darija-quest-storage', '{"state":{"streak":5}}');

    const result = await migrateLocalStorageToIdb('darija-quest-storage');
    expect(result.migrated).toBe(true);
    expect(mockIdbData.get('darija-quest-storage')).toBe('{"state":{"streak":5}}');
  });

  it('ne migre pas si la clé est déjà présente dans IndexedDB', async () => {
    mockIdbData.set('darija-quest-storage', '{"state":{"streak":10}}');
    mockLocalData.set('darija-quest-storage', '{"state":{"streak":5}}');

    const result = await migrateLocalStorageToIdb('darija-quest-storage');
    expect(result.migrated).toBe(false);
    expect(mockIdbData.get('darija-quest-storage')).toBe('{"state":{"streak":10}}');
  });

  it('ne migre rien si localStorage est vide pour cette clé', async () => {
    const result = await migrateLocalStorageToIdb('absent_key');
    expect(result.migrated).toBe(false);
  });

  it('migre plusieurs clés avec migrateMultipleKeysToIdb', async () => {
    mockLocalData.set('key1', 'val1');
    mockLocalData.set('key2', 'val2');

    const results = await migrateMultipleKeysToIdb(['key1', 'key2', 'key3']);
    expect(results.key1.migrated).toBe(true);
    expect(results.key2.migrated).toBe(true);
    expect(results.key3.migrated).toBe(false);
    expect(mockIdbData.get('key1')).toBe('val1');
    expect(mockIdbData.get('key2')).toBe('val2');
  });
});

describe('offlineCache - Gestion des packs hors-ligne', () => {
  beforeEach(() => {
    mockIdbData.clear();

    vi.mocked(get).mockImplementation(async (key) => mockIdbData.get(String(key)));
    vi.mocked(set).mockImplementation(async (key, val) => {
      mockIdbData.set(String(key), val);
    });
    vi.mocked(del).mockImplementation(async (key) => {
      mockIdbData.delete(String(key));
    });

    vi.stubGlobal('window', {
      indexedDB: {},
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        length: 0,
        key: () => null,
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('enregistre et recharge un pack de leçons', async () => {
    const dummyLessons: Lesson[] = [
      {
        id: 'lesson_1_1',
        title: 'Salutations',
        level: 1,
        description: 'Apprendre à saluer',
        steps: [],
      },
    ];

    await saveLessonsOfflinePack('m1_pack', dummyLessons, { title: 'Module 1 Offline' });
    expect(await hasOfflinePack('m1_pack')).toBe(true);

    const loaded = await loadLessonsOfflinePack('m1_pack');
    expect(loaded).not.toBeNull();
    expect(loaded?.metadata.id).toBe('m1_pack');
    expect(loaded?.metadata.type).toBe('lessons');
    expect(loaded?.metadata.itemCount).toBe(1);
    expect(loaded?.data[0].id).toBe('lesson_1_1');
  });

  it('enregistre et recharge un pack de phrases', async () => {
    const dummyPhrases = [
      { id: 'p1', darija: 'Salam', arabic: 'سلام', meaning: 'Bonjour' },
      { id: 'p2', darija: 'Labas', arabic: 'لاباس', meaning: 'Ça va' },
    ];

    await savePhrasesOfflinePack('phrases_daily', dummyPhrases);
    const loaded = await loadPhrasesOfflinePack<typeof dummyPhrases>('phrases_daily');

    expect(loaded).not.toBeNull();
    expect(loaded?.metadata.type).toBe('phrases');
    expect(loaded?.metadata.itemCount).toBe(2);
    expect(loaded?.data[0].darija).toBe('Salam');
  });

  it('enregistre et recharge un pack de cartes SRS', async () => {
    const dummyCards: Record<string, SRSCard> = {
      card_1: {
        id: 'card_1',
        wordId: 'salam',
        interval: 1,
        repetition: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        state: 'review',
      },
    };

    await saveSrsOfflinePack('srs_deck_backup', dummyCards);
    const loaded = await loadSrsOfflinePack('srs_deck_backup');

    expect(loaded).not.toBeNull();
    expect(loaded?.metadata.type).toBe('srs');
    expect(loaded?.data.card_1.wordId).toBe('salam');
  });

  it('charge directement un pack générique avec loadOfflinePack', async () => {
    await saveOfflinePack('generic_pack', 'custom', { foo: 'bar' });
    const loaded = await loadOfflinePack<{ foo: string }>('generic_pack');
    expect(loaded?.data.foo).toBe('bar');
  });

  it('supprime un pack hors-ligne avec clearOfflinePack', async () => {
    await saveOfflinePack('temp_pack', 'custom', { foo: 'bar' });
    expect(await hasOfflinePack('temp_pack')).toBe(true);

    const cleared = await clearOfflinePack('temp_pack');
    expect(cleared).toBe(true);
    expect(await hasOfflinePack('temp_pack')).toBe(false);
  });

  it('liste les métadonnées de plusieurs packs avec listOfflinePacks', async () => {
    await saveOfflinePack('pack_a', 'lessons', [{ id: '1' }]);
    await saveOfflinePack('pack_b', 'phrases', [{ id: '2' }, { id: '3' }]);

    const list = await listOfflinePacks();
    expect(list.length).toBe(2);
    const ids = list.map((m) => m.id);
    expect(ids).toContain('pack_a');
    expect(ids).toContain('pack_b');
  });
});

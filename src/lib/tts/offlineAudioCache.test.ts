import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  TTS_CACHE_NAME,
  buildTtsCacheKey,
  getOrFetchTtsAudioBlob,
  precacheEssentialCorpus,
  getAudioCacheStats,
  clearAudioCache,
  getEssentialCorpus,
  isCacheStorageAvailable,
} from './offlineAudioCache';

// Mock in-memory Cache implementation for tests
class MockCache {
  private store = new Map<string, Response>();

  private normalizeKey(request: string | Request): string {
    const raw = typeof request === 'string' ? request : request.url;
    try {
      const url = new URL(raw, 'http://localhost');
      return url.pathname + url.search;
    } catch {
      return raw;
    }
  }

  async match(request: string | Request): Promise<Response | undefined> {
    const key = this.normalizeKey(request);
    const res = this.store.get(key);
    return res ? res.clone() : undefined;
  }

  async put(request: string | Request, response: Response): Promise<void> {
    const key = this.normalizeKey(request);
    this.store.set(key, response.clone());
  }

  async keys(): Promise<Request[]> {
    return Array.from(this.store.keys()).map((k) => new Request(`http://localhost${k}`));
  }

  delete(key: string): boolean {
    return this.store.delete(this.normalizeKey(key));
  }
}

class MockCacheStorage {
  private caches = new Map<string, MockCache>();

  async open(cacheName: string): Promise<MockCache> {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new MockCache());
    }
    return this.caches.get(cacheName)!;
  }

  async delete(cacheName: string): Promise<boolean> {
    return this.caches.delete(cacheName);
  }

  async has(cacheName: string): Promise<boolean> {
    return this.caches.has(cacheName);
  }
}

describe('offlineAudioCache — Moteur de Précache Audio PWA', () => {
  let mockCaches: MockCacheStorage;

  beforeEach(() => {
    mockCaches = new MockCacheStorage();
    vi.stubGlobal('caches', mockCaches);
    vi.stubGlobal('window', { caches: mockCaches });
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isCacheStorageAvailable', () => {
    it('détecte la présence de caches dans window', () => {
      expect(isCacheStorageAvailable()).toBe(true);
    });
  });

  describe('buildTtsCacheKey — Normalisation phonétique unifiée', () => {
    it('génère la même clé canonique pour l’arabe et l’arabizi', () => {
      const keyArabizi = buildTtsCacheKey('bch7al');
      const keyArabic = buildTtsCacheKey('بشحال');
      expect(keyArabizi).toBe(keyArabic);
      expect(keyArabizi).toContain('/_offline_cache/tts?text=');
    });

    it('reflète la voix et la vitesse demandée', () => {
      const keyNormal = buildTtsCacheKey('3afak', { voice: 'female', speed: 'normal' });
      const keyMaleSlow = buildTtsCacheKey('3afak', { voice: 'male', speed: 'slow' });

      expect(keyNormal).toContain('voice=female&speed=normal');
      expect(keyMaleSlow).toContain('voice=male&speed=slow');
    });

    it('traite JamalNeural comme male et MounaNeural comme female', () => {
      const keyJamal = buildTtsCacheKey('chokran', { voice: 'ar-MA-JamalNeural' });
      const keyMouna = buildTtsCacheKey('chokran', { voice: 'ar-MA-MounaNeural' });

      expect(keyJamal).toContain('voice=male');
      expect(keyMouna).toContain('voice=female');
    });
  });

  describe('getOrFetchTtsAudioBlob — Stratégie Cache-First', () => {
    it('renvoie directement le Blob en cache sans appeler fetch (Cache HIT)', async () => {
      const cache = await mockCaches.open(TTS_CACHE_NAME);
      const text = 'salam';
      const key = buildTtsCacheKey(text);

      const fakeAudioBuffer = new Uint8Array(1024).fill(42);
      const initialResponse = new Response(fakeAudioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': '1024',
        },
      });
      await cache.put(key, initialResponse);

      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);

      const blob = await getOrFetchTtsAudioBlob(text);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBe(1024);
    });

    it('appelle fetch et enregistre dans le cache si absent (Cache MISS)', async () => {
      const text = 'labas';
      const fakeAudioBuffer = new Uint8Array(2048).fill(99);

      const fetchMock = vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(fakeAudioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': '2048',
            },
          })
        )
      );
      vi.stubGlobal('fetch', fetchMock);

      const blob = await getOrFetchTtsAudioBlob(text);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(blob.size).toBe(2048);

      // Vérifie que le fichier est à présent stocké dans le cache
      const cache = await mockCaches.open(TTS_CACHE_NAME);
      const key = buildTtsCacheKey(text);
      const cached = await cache.match(key);
      expect(cached).toBeDefined();
      const cachedBlob = await cached!.blob();
      expect(cachedBlob.size).toBe(2048);
    });

    it('refuse de fetcher et lève une erreur si hors-ligne et absent du cache', async () => {
      vi.stubGlobal('navigator', { onLine: false });
      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);

      await expect(getOrFetchTtsAudioBlob('inconnu')).rejects.toThrow(
        'OFFLINE_AUDIO_UNAVAILABLE'
      );
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('rejette les réponses de taille anormale (< 500 octets)', async () => {
      const tinyBuffer = new Uint8Array(100).fill(1);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(() =>
          Promise.resolve(
            new Response(tinyBuffer, {
              status: 200,
              headers: { 'Content-Type': 'audio/mpeg' },
            })
          )
        )
      );

      await expect(getOrFetchTtsAudioBlob('trop_court')).rejects.toThrow(
        'too small'
      );
    });
  });

  describe('getEssentialCorpus & precacheEssentialCorpus', () => {
    it('génère un corpus dédupliqué sans entrées redondantes', () => {
      const corpus = getEssentialCorpus();
      expect(corpus.length).toBeGreaterThan(15);

      const keys = corpus.map((c) => buildTtsCacheKey(c.text, c));
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });

    it('respecte la progression et stocke les éléments dans le cache', async () => {
      const fakeAudioBuffer = new Uint8Array(1000).fill(7);
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(() =>
          Promise.resolve(
            new Response(fakeAudioBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': '1000',
              },
            })
          )
        )
      );

      const progressSteps: number[] = [];
      const result = await precacheEssentialCorpus((p) => {
        progressSteps.push(p.percent);
      });

      expect(result.status).toBe('ready');
      expect(result.completed).toBe(result.total);
      expect(progressSteps.length).toBeGreaterThan(0);
      expect(progressSteps[progressSteps.length - 1]).toBe(100);
    });
  });

  describe('getAudioCacheStats & clearAudioCache', () => {
    it('calcule correctement les statistiques du cache', async () => {
      const cache = await mockCaches.open(TTS_CACHE_NAME);
      const fakeBuffer = new Uint8Array(1024 * 1024); // 1 Mo
      await cache.put(
        '/_offline_cache/tts?text=test&voice=female&speed=normal',
        new Response(fakeBuffer, {
          headers: { 'Content-Length': String(1024 * 1024), 'Content-Type': 'audio/mpeg' },
        })
      );

      const stats = await getAudioCacheStats();
      expect(stats.count).toBe(1);
      expect(stats.sizeMb).toBe(1);
    });

    it('purge le cache avec succès', async () => {
      await mockCaches.open(TTS_CACHE_NAME);
      const deleted = await clearAudioCache();
      expect(deleted).toBe(true);

      const has = await mockCaches.has(TTS_CACHE_NAME);
      expect(has).toBe(false);
    });
  });
});

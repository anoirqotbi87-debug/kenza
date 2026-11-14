/**
 * Moteur de Précache Audio Hors-Ligne (PWA Cache Storage & Lecture 0ms)
 * 
 * Stocke les fichiers de synthèse vocale (audio/mpeg) de manière persistante
 * dans le cache 'kenza-tts-audio-v1' du navigateur.
 * 
 * Fonctionnalités :
 * 1. Clé canonique déterministe unifiant l'arabe et l'arabizi via prepareDarijaForTts
 * 2. Stratégie Cache-First pour une latence de 0 ms et un fonctionnement 100% hors-ligne (mode avion)
 * 3. Pré-téléchargement par lots avec concurrence maîtrisée (CONCURRENCY = 3) et AbortSignal
 * 4. Métriques en temps réel et purge du cache
 */

import { prepareDarijaForTts } from './darijaPhonetic';
import { srsVocabulary } from '../../data/srs-deck';
import { ARABIZI_GUIDE } from '../../data/arabiziGuide';
import { module1Lessons } from '../../data/module1';

export const TTS_CACHE_NAME = 'kenza-tts-audio-v1';
export const TTS_PRECACHE_CONCURRENCY = 3;

export interface TtsAudioOptions {
  voice?: 'female' | 'male' | 'ar-MA-JamalNeural' | 'ar-MA-MounaNeural';
  speed?: 'normal' | 'slow' | number;
  arabicText?: string;
}

export interface PrecacheItem {
  text: string;
  arabicText?: string;
  voice?: 'female' | 'male';
  speed?: 'normal' | 'slow';
}

export interface PrecacheProgress {
  completed: number;
  total: number;
  cachedBytes: number;
  percent: number;
  status: 'idle' | 'downloading' | 'ready' | 'error';
  errorMessage?: string;
}

export interface AudioCacheStats {
  count: number;
  totalBytes: number;
  sizeMb: number;
  isReady: boolean;
  totalCorpusCount: number;
}

/**
 * Vérifie si l'API CacheStorage est disponible dans l'environnement courant (SSR-safe).
 */
export function isCacheStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.caches !== 'undefined';
}

/**
 * Génère une clé de cache canonique synthétique et déterministe.
 * Normalise l'arabe et l'arabizi via prepareDarijaForTts pour que "bch7al" et "بشحال"
 * partagent rigoureusement la même entrée dans Cache Storage.
 */
export function buildTtsCacheKey(
  text: string,
  options?: TtsAudioOptions
): string {
  const cleanText = (text || '').trim();
  const cleanArabic = options?.arabicText ? options.arabicText.trim() : undefined;
  const rawToProcess = cleanArabic || cleanText;

  let normalized = '';
  try {
    normalized = prepareDarijaForTts(rawToProcess).trim();
  } catch {
    normalized = rawToProcess;
  }
  if (!normalized) {
    normalized = rawToProcess;
  }

  const isMale =
    options?.voice === 'male' || options?.voice === 'ar-MA-JamalNeural';
  const voice = isMale ? 'male' : 'female';
  const isSlow =
    options?.speed === 'slow' ||
    (typeof options?.speed === 'number' && options.speed < 1.0);
  const speed = isSlow ? 'slow' : 'normal';

  return `/_offline_cache/tts?text=${encodeURIComponent(normalized)}&voice=${voice}&speed=${speed}`;
}

/**
 * Lecture Cache-First d'un flux audio TTS avec persistance automatique.
 * 
 * 1. Vérifie si le fichier existe dans Cache Storage (0 ms).
 * 2. Si MISS : effectue l'appel réseau vers /api/tts, valide le statut (200 OK),
 *    le Content-Type (audio/mpeg) et la taille (> 500 octets).
 * 3. Enregistre une copie dans 'kenza-tts-audio-v1' et retourne le Blob.
 */
export async function getOrFetchTtsAudioBlob(
  text: string,
  options?: TtsAudioOptions,
  signal?: AbortSignal
): Promise<Blob> {
  const cacheKey = buildTtsCacheKey(text, options);

  // 1. Essai Cache Storage
  if (isCacheStorageAvailable()) {
    try {
      const cache = await caches.open(TTS_CACHE_NAME);
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        if (blob.size >= 500) {
          return blob;
        }
      }
    } catch (e) {
      console.warn('[offlineAudioCache] Error reading cache:', e);
    }
  }

  // 2. Si hors-ligne strict et absent du cache
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('OFFLINE_AUDIO_UNAVAILABLE');
  }

  // 3. Appel réseau
  const isMale =
    options?.voice === 'male' || options?.voice === 'ar-MA-JamalNeural';
  const isSlow =
    options?.speed === 'slow' ||
    (typeof options?.speed === 'number' && options.speed < 1.0);

  const requestBody = {
    text: text.trim(),
    arabicText: options?.arabicText?.trim() || undefined,
    voice: isMale ? 'male' : 'female',
    speed: isSlow ? 'slow' : 'normal',
  };

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal,
  });

  if (!response.ok) {
    throw new Error(`TTS API failed with HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('audio')) {
    throw new Error(`Invalid TTS Content-Type: ${contentType}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength < 500) {
    throw new Error(`TTS audio buffer too small (${arrayBuffer.byteLength} bytes)`);
  }

  const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

  // 4. Stockage dans Cache Storage
  if (isCacheStorageAvailable()) {
    try {
      const cache = await caches.open(TTS_CACHE_NAME);
      const responseToCache = new Response(audioBlob, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': String(audioBlob.size),
          'X-Kenza-Cached-At': String(Date.now()),
        },
      });
      await cache.put(cacheKey, responseToCache);
    } catch (err) {
      console.warn('[offlineAudioCache] Failed to put in cache:', err);
    }
  }

  return audioBlob;
}

/**
 * Construit la liste dédupliquée du corpus essentiel pour le préchargement hors-ligne :
 * - Expressions clés du Carnet de Phrases (/phrases)
 * - Phonèmes et phrases cibles de l'Atelier /parler
 * - Exemples sonores du Guide des Chiffres Arabizi
 * - Vocabulaire d'ancrage du Module 1
 * - Mots clés du deck SRS
 */
export function getEssentialCorpus(): PrecacheItem[] {
  const items: PrecacheItem[] = [];

  // Phrases incontournables du Carnet
  const basePhrases: PrecacheItem[] = [
    { text: 'Salam, labas?', arabicText: 'سَلَامْ، لَابَاسْ ؟' },
    { text: 'Labas, hamdullah.', arabicText: 'لَابَاسْ، الْحَمْدُ لِلَّهْ.' },
    { text: 'Wahed atay, afak.', arabicText: 'وَاحِدْ أَتَايْ، عَافَاكْ.' },
    { text: 'Bghit lma, afak.', arabicText: 'بْغِيتْ الْمَا، عَافَاكْ.' },
    { text: 'Fin kayn souk?', arabicText: 'فِينْ كَايْنْ السُّوقْ ؟' },
    { text: 'Shukran bzaf!', arabicText: 'شُكْرَانْ بْزَّافْ !' },
    { text: 'Smah liya.', arabicText: 'سْمَحْ لِيَّا.' },
    { text: 'Bslama, nshawfek.', arabicText: 'بْسْلَامَةْ، نْشُوفْكْ.' },
  ];
  items.push(...basePhrases);

  // Cas critiques & sons de l'atelier de prononciation
  const speechPhrases: PrecacheItem[] = [
    { text: '3afak, bch7al hada ?', arabicText: 'عَافَاكْ، بْشْحَالْ هَادَا ؟' },
    { text: 'Sba7 l-khir a khoya', arabicText: 'صْبَاحْ الْخِيرْ أ خُويَا' },
    { text: 'Bghit 9hwa nss-nss', arabicText: 'بْغِيتْ قَهْوَة نْصّْ نْصّْ' },
    { text: 'khdem l-kuntur', arabicText: 'خْدَمْ لْكُونْتُورْ' },
    { text: 'ga3 mzyan bzzaf', arabicText: 'گَاعْ مْزْيَانْ بْزَّافْ' },
    { text: 'kidayr labas ?', arabicText: 'كِيدَايْرْ لَابَاسْ ؟' },
    { text: 'chokran', arabicText: 'شُكْرَانْ' },
  ];
  items.push(...speechPhrases);

  // Guide Arabizi
  try {
    for (const sound of ARABIZI_GUIDE) {
      if (Array.isArray(sound.examples)) {
        for (const ex of sound.examples) {
          if (ex.arabizi) {
            items.push({
              text: ex.arabizi,
              arabicText: ex.arabicWithTashkeel,
            });
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // Module 1 : étapes d'apprentissage
  try {
    for (const lesson of module1Lessons) {
      if (Array.isArray(lesson.steps)) {
        for (const step of lesson.steps) {
          if (step && typeof step === 'object' && 'content' in step) {
            const c = (step as { content?: { arabizi?: string; arabic?: string } }).content;
            if (c?.arabizi) {
              items.push({
                text: c.arabizi,
                arabicText: c.arabic,
              });
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }

  // Deck SRS (mots clés de base)
  try {
    if (Array.isArray(srsVocabulary)) {
      for (const word of srsVocabulary) {
        if (word.arabizi) {
          items.push({
            text: word.arabizi,
            arabicText: word.arabic,
          });
        }
      }
    }
  } catch {
    // ignore
  }

  // Déduplication absolue par clé canonique
  const seen = new Set<string>();
  const deduplicated: PrecacheItem[] = [];
  for (const item of items) {
    const key = buildTtsCacheKey(item.text, item);
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}

/**
 * Pré-télécharge par lots le corpus essentiel avec concurrence contrôlée (CONCURRENCY = 3)
 * et gestion de progression fluide.
 */
export async function precacheEssentialCorpus(
  onProgress?: (progress: PrecacheProgress) => void,
  signal?: AbortSignal
): Promise<PrecacheProgress> {
  const corpus = getEssentialCorpus();
  const total = corpus.length;

  if (total === 0) {
    const result: PrecacheProgress = {
      completed: 0,
      total: 0,
      cachedBytes: 0,
      percent: 100,
      status: 'ready',
    };
    onProgress?.(result);
    return result;
  }

  if (!isCacheStorageAvailable()) {
    const errorResult: PrecacheProgress = {
      completed: 0,
      total,
      cachedBytes: 0,
      percent: 0,
      status: 'error',
      errorMessage: 'CacheStorage not available in this browser',
    };
    onProgress?.(errorResult);
    return errorResult;
  }

  const cache = await caches.open(TTS_CACHE_NAME);
  const pendingItems: PrecacheItem[] = [];
  let alreadyCachedCount = 0;
  let alreadyCachedBytes = 0;

  for (const item of corpus) {
    const key = buildTtsCacheKey(item.text, item);
    const match = await cache.match(key);
    if (match) {
      alreadyCachedCount++;
      const cl = match.headers.get('Content-Length');
      if (cl) {
        alreadyCachedBytes += parseInt(cl, 10) || 0;
      }
    } else {
      pendingItems.push(item);
    }
  }

  let completed = alreadyCachedCount;
  let cachedBytes = alreadyCachedBytes;

  const emitProgress = (status: 'downloading' | 'ready' | 'error', errorMessage?: string) => {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
    onProgress?.({
      completed,
      total,
      cachedBytes,
      percent,
      status,
      errorMessage,
    });
  };

  if (pendingItems.length === 0) {
    emitProgress('ready');
    return {
      completed,
      total,
      cachedBytes,
      percent: 100,
      status: 'ready',
    };
  }

  emitProgress('downloading');

  let currentIndex = 0;
  let activeWorkers = 0;

  await new Promise<void>((resolve, reject) => {
    const runNext = () => {
      if (signal?.aborted) {
        emitProgress('error', 'Download aborted by user');
        return reject(new DOMException('Aborted', 'AbortError'));
      }

      if (currentIndex >= pendingItems.length && activeWorkers === 0) {
        return resolve();
      }

      while (activeWorkers < TTS_PRECACHE_CONCURRENCY && currentIndex < pendingItems.length) {
        if (signal?.aborted) {
          emitProgress('error', 'Download aborted by user');
          return reject(new DOMException('Aborted', 'AbortError'));
        }

        const item = pendingItems[currentIndex++];
        activeWorkers++;

        getOrFetchTtsAudioBlob(item.text, item, signal)
          .then((blob) => {
            completed++;
            cachedBytes += blob.size;
            emitProgress('downloading');
          })
          .catch((err) => {
            console.warn('[precacheEssentialCorpus] Item fetch error:', item.text, err);
            completed++;
            emitProgress('downloading');
          })
          .finally(() => {
            activeWorkers--;
            runNext();
          });
      }
    };

    runNext();
  });

  emitProgress('ready');
  return {
    completed,
    total,
    cachedBytes,
    percent: 100,
    status: 'ready',
  };
}

/**
 * Calcule les statistiques d'utilisation du cache audio.
 */
export async function getAudioCacheStats(): Promise<AudioCacheStats> {
  const corpus = getEssentialCorpus();
  const totalCorpusCount = corpus.length;

  if (!isCacheStorageAvailable()) {
    return {
      count: 0,
      totalBytes: 0,
      sizeMb: 0,
      isReady: false,
      totalCorpusCount,
    };
  }

  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const requests = await cache.keys();
    let totalBytes = 0;

    for (const req of requests) {
      const res = await cache.match(req);
      if (res) {
        const cl = res.headers.get('Content-Length');
        if (cl) {
          totalBytes += parseInt(cl, 10) || 0;
        } else {
          try {
            const b = await res.blob();
            totalBytes += b.size;
          } catch {
            // ignore
          }
        }
      }
    }

    const count = requests.length;
    const sizeMb = Number((totalBytes / (1024 * 1024)).toFixed(2));
    const isReady = count > 0 && count >= Math.min(totalCorpusCount * 0.7, 20);

    return {
      count,
      totalBytes,
      sizeMb,
      isReady,
      totalCorpusCount,
    };
  } catch (err) {
    console.warn('[getAudioCacheStats] Error:', err);
    return {
      count: 0,
      totalBytes: 0,
      sizeMb: 0,
      isReady: false,
      totalCorpusCount,
    };
  }
}

/**
 * Purge intégralement le cache audio 'kenza-tts-audio-v1'.
 */
export async function clearAudioCache(): Promise<boolean> {
  if (!isCacheStorageAvailable()) return false;
  try {
    return await caches.delete(TTS_CACHE_NAME);
  } catch (err) {
    console.warn('[clearAudioCache] Error:', err);
    return false;
  }
}

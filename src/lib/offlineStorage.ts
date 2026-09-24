import { srsVocabulary } from '../data/srs-deck';

const DB_NAME = 'kenza_offline_db';
const STORE_NAME = 'audio_cache';
const DB_VERSION = 1;

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('IndexedDB not available on server'));
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function saveAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('saveAudio failed:', e);
  }
}

export async function getOfflineAudio(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    return null;
  }
}

export async function hasOfflineAudio(key: string): Promise<boolean> {
  const blob = await getOfflineAudio(key);
  return !!blob;
}

export async function checkOfflineStatus(): Promise<number> {
  let count = 0;
  for (const word of srsVocabulary) {
    const exists = await hasOfflineAudio(word.arabizi);
    if (exists) count++;
  }
  return Math.round((count / srsVocabulary.length) * 100);
}

export async function downloadFullOfflinePack(onProgress: (percent: number) => void) {
  let completed = 0;
  const total = srsVocabulary.length;
  
  onProgress(0);

  const batchSize = 5;
  for (let i = 0; i < total; i += batchSize) {
    const batch = srsVocabulary.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (word) => {
        try {
          const exists = await hasOfflineAudio(word.arabizi);
          if (!exists) {
            const res = await fetch('/api/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: word.arabizi, arabicText: word.arabic }),
            });
            if (res.ok) {
              const blob = await res.blob();
              await saveAudio(word.arabizi, blob);
            }
          }
        } catch (e) {
          console.error('Failed to download audio for', word.arabizi, e);
        } finally {
          completed++;
          onProgress(Math.round((completed / total) * 100));
        }
      })
    );
  }
}

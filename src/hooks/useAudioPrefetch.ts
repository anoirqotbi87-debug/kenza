'use client';

import { useEffect, useCallback } from 'react';
import { preloadAudio, preloadTtsAudio } from '@/lib/audio';

export interface PrefetchItem {
  text: string;
  arabicText?: string;
  audioUrl?: string;
  voice?: 'female' | 'male';
  speed?: 'normal' | 'slow';
}

/**
 * Hook to prefetch audio items into the Web Audio API buffer and browser cache.
 * Ensures 0ms latency on user tap.
 */
export function useAudioPrefetch(items: PrefetchItem[] = []) {
  const prefetchSingle = useCallback(async (item: PrefetchItem) => {
    if (item.audioUrl && (item.audioUrl.includes('/') || item.audioUrl.endsWith('.mp3'))) {
      await preloadAudio(item.audioUrl);
    } else if (item.text) {
      await preloadTtsAudio(
        item.text,
        item.arabicText,
        item.voice || 'female',
        item.speed || 'normal'
      );
    }
  }, []);

  const prefetchAll = useCallback(async (list: PrefetchItem[]) => {
    // Précharger les 3 à 5 prochains audios (0 ms de latence, préserve les quotas)
    const queue = list.slice(0, 5);
    for (const item of queue) {
      try {
        await prefetchSingle(item);
      } catch {
        // Continue silently for next items
      }
    }
  }, [prefetchSingle]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    let isCancelled = false;

    const timeout = setTimeout(() => {
      if (!isCancelled) {
        prefetchAll(items);
      }
    }, 150); // slight debounce to allow initial view render

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [items, prefetchAll]);

  return {
    prefetch: prefetchSingle,
    prefetchAll,
  };
}

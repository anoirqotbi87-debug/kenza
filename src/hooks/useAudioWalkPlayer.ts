'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { playAudio } from '../lib/audio'; // Uses indexedDB underneath for darija

export interface AudioWalkItem {
  id: string;
  phraseSource: string; // French/English translation
  phraseDarijaArabizi: string;
  phraseDarijaArabe: string;
  audioKey?: string; // Used if we pre-generate audio for TTS
}

export function useAudioWalkPlayer(items: AudioWalkItem[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [thinkTime, setThinkTime] = useState(2500); // 2.5 seconds pause
  const [isLooping, setIsLooping] = useState(true);
  const [repeatDarija, setRepeatDarija] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Keep a ref to the active abort controller to cancel ongoing chains
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(isPlaying);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const stopSequence = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Also cancel any ongoing SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const wait = (ms: number, signal: AbortSignal) => {
    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        resolve();
      }, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Aborted'));
      });
    });
  };

  const playTTS = (text: string, lang: string, signal: AbortSignal) => {
    return new Promise<void>((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = playbackSpeed;
      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error', e);
        resolve(); // Continue even on error
      };
      
      signal.addEventListener('abort', () => {
        window.speechSynthesis.cancel();
        reject(new Error('Aborted'));
      });
      
      window.speechSynthesis.speak(utterance);
    });
  };

  const playSequence = useCallback(async (index: number) => {
    if (items.length === 0) return;
    
    stopSequence();
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const signal = abortController.signal;

    try {
      const item = items[index];
      
      // 1. Play source (FR/EN)
      await playTTS(item.phraseSource, 'fr-FR', signal);
      
      // 2. Think Time
      await wait(thinkTime, signal);

      // 3. Play Darija (Using our robust playAudio that falls back to TTS and network)
      await playAudio(item.phraseDarijaArabizi, item.phraseDarijaArabe, true, playbackSpeed);
      
      if (repeatDarija) {
        await wait(500, signal);
        await playAudio(item.phraseDarijaArabizi, item.phraseDarijaArabe, true, playbackSpeed);
      }

      // 4. Consolidation Time
      await wait(1500, signal);

      // Sequence finished successfully without abortion, go next
      if (isPlayingRef.current) {
        nextTrack();
      }

    } catch (e: any) {
      if (e.message !== 'Aborted') {
        console.error("Sequence error:", e);
      }
    }
  }, [items, thinkTime, playbackSpeed, repeatDarija]);

  useEffect(() => {
    if (isPlaying) {
      playSequence(currentIndex);
    } else {
      stopSequence();
    }
  }, [isPlaying, currentIndex, playSequence, stopSequence]);

  const togglePlay = () => setIsPlaying(prev => !prev);
  const pause = () => setIsPlaying(false);
  const play = () => setIsPlaying(true);

  const nextTrack = useCallback(() => {
    setCurrentIndex((prev) => {
      let next = prev + 1;
      if (isShuffle) {
        next = Math.floor(Math.random() * items.length);
      } else if (next >= items.length) {
        next = isLooping ? 0 : prev;
        if (!isLooping && next >= items.length - 1) {
          setIsPlaying(false);
        }
      }
      return next;
    });
  }, [items.length, isLooping, isShuffle]);

  const previousTrack = useCallback(() => {
    setCurrentIndex((prev) => {
      if (isShuffle) return Math.floor(Math.random() * items.length);
      return prev > 0 ? prev - 1 : (isLooping ? items.length - 1 : 0);
    });
  }, [items.length, isLooping, isShuffle]);

  return {
    isPlaying,
    currentIndex,
    playbackSpeed,
    thinkTime,
    isLooping,
    repeatDarija,
    isShuffle,
    currentItem: items[currentIndex],
    togglePlay,
    play,
    pause,
    nextTrack,
    previousTrack,
    setPlaybackSpeed,
    setThinkTime,
    setIsLooping,
    setRepeatDarija,
    setIsShuffle
  };
}

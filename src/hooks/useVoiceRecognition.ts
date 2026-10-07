'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Minimal typings for the Web Speech API (not part of lib.dom.d.ts).
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  [index: number]: SpeechRecognitionAlternativeLike;
  length: number;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function useVoiceRecognition(lang = 'ar-MA', timeoutMs = 5000) {
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref mirrors isListening so stopListening can stay referentially stable
  // while still reading the current value.
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("API de reconnaissance vocale non supportée par ce navigateur.");
      return;
    }

    setError(null);
    setTranscript('');
    setIsListening(true);

    try {
      recognitionRef.current.lang = lang || 'ar-MA';
    } catch {
      recognitionRef.current.lang = 'ar-MA';
    }

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      // Safety timeout if user forgets to stop
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, timeoutMs);
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEventLike) => {
      // Reset timeout on speech detection
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, timeoutMs);

      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (event.error === 'not-allowed') {
        setError("Permission micro refusée. Veuillez autoriser l'accès au microphone.");
      } else if (event.error === 'no-speech') {
        setError("Aucun son détecté.");
      } else if (event.error === 'language-not-supported') {
        // Fallback transparent si ar-MA n'est pas supporté par le moteur natif
        try {
          if (recognitionRef.current) {
            recognitionRef.current.lang = 'fr-FR';
          }
        } catch {}
        setError("Langue vocale ar-MA indisponible sur cet appareil. Mode texte recommandé.");
      } else {
        setError(`Erreur vocale : ${event.error}`);
      }
      stopListening();
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'InvalidStateError') {
        // Already started, safely ignore
      } else {
        setError(err instanceof Error ? err.message : String(err));
        setIsListening(false);
      }
    }
  }, [lang, timeoutMs, stopListening]);

  // Initialize the recognition API once, and stop on unmount.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after a pause
        recognitionRef.current.interimResults = true; // Real-time feedback
      }
    }

    return () => {
      stopListening();
    };
  }, [stopListening]);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
}

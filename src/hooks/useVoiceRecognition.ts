'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

// `useSyncExternalStore` exige une fonction d'abonnement stable : le support du micro
// ne change pas en cours de session, donc aucun événement à écouter.
const subscribeToNothing = () => () => {};

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

export type VoiceErrorCode =
  | 'not-allowed'
  | 'no-speech'
  | 'language-not-supported'
  | 'not-supported'
  | 'generic'
  | null;

function getLocalizedVoiceError(code: string, uiLang: string): string {
  if (code === 'not-allowed') {
    if (uiLang === 'ar') return "تم رفض إذن الميكروفون. يُرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح.";
    if (uiLang === 'es') return "Permiso de micrófono denegado. Permita el acceso al micrófono en el navegador.";
    if (uiLang === 'en') return "Microphone access denied. Please allow microphone access in your browser settings.";
    return "Permission micro refusée. Veuillez autoriser l'accès au microphone.";
  }
  if (code === 'no-speech') {
    if (uiLang === 'ar') return "لم يتم التقاط أي صوت. يُرجى التحدث بصوت أوضح وأقرب إلى الميكروفون.";
    if (uiLang === 'es') return "No se detectó ningún sonido. Hable más claro y cerca del micrófono.";
    if (uiLang === 'en') return "No speech detected. Please speak clearly into the microphone.";
    return "Aucun son détecté. Parlez plus fort et distinctement.";
  }
  if (code === 'language-not-supported') {
    if (uiLang === 'ar') return "التعرف الصوتي على اللهجة المغربية (ar-MA) غير متوفر على جهازك. يمكنك المتابعة في وضع الاستماع.";
    if (uiLang === 'es') return "El reconocimiento de voz en árabe marroquí no está disponible en este dispositivo.";
    if (uiLang === 'en') return "Moroccan Arabic voice recognition is unavailable on this device.";
    return "Langue vocale ar-MA indisponible sur cet appareil. Mode texte recommandé.";
  }
  if (code === 'not-supported') {
    if (uiLang === 'ar') return "ميزة التعرف الصوتي غير مدعومة في هذا المتصفح.";
    if (uiLang === 'es') return "Reconocimiento de voz no compatible con este navegador.";
    if (uiLang === 'en') return "Speech recognition is not supported in this browser.";
    return "API de reconnaissance vocale non supportée par ce navigateur.";
  }
  return uiLang === 'ar' ? `خطأ صوتي : ${code}` : `Erreur vocale : ${code}`;
}

export function useVoiceRecognition(lang = 'ar-MA', timeoutMs = 5000, uiLang = 'fr') {
  // `getServerSnapshot` renvoie `null` : pendant l'hydratation React réutilise cette
  // valeur, donc le premier rendu client est identique au HTML SSR. Lire
  // `window.SpeechRecognition` pendant le rendu provoquait l'erreur React #418.
  const isSupported = useSyncExternalStore(
    subscribeToNothing,
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    () => null
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<VoiceErrorCode>(null);

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
      setErrorCode('not-supported');
      setError(getLocalizedVoiceError('not-supported', uiLang));
      return;
    }

    setError(null);
    setErrorCode(null);
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
        setErrorCode('not-allowed');
        setError(getLocalizedVoiceError('not-allowed', uiLang));
      } else if (event.error === 'no-speech') {
        setErrorCode('no-speech');
        setError(getLocalizedVoiceError('no-speech', uiLang));
      } else if (event.error === 'language-not-supported') {
        setErrorCode('language-not-supported');
        // Fallback transparent si ar-MA n'est pas supporté par le moteur natif
        try {
          if (recognitionRef.current) {
            recognitionRef.current.lang = 'fr-FR';
          }
        } catch {}
        setError(getLocalizedVoiceError('language-not-supported', uiLang));
      } else {
        setErrorCode('generic');
        setError(getLocalizedVoiceError(event.error, uiLang));
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
        setErrorCode('generic');
        setError(err instanceof Error ? err.message : String(err));
        setIsListening(false);
      }
    }
  }, [lang, timeoutMs, uiLang, stopListening]);

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

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    setErrorCode(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    errorCode,
    startListening,
    stopListening,
    resetTranscript,
  };
}

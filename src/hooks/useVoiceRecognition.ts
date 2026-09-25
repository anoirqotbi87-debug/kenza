'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Window augmentation for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceRecognition(lang = 'ar-MA', timeoutMs = 5000) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after a pause
        recognitionRef.current.interimResults = true; // Real-time feedback
      }
    }

    return () => {
      stopListening();
    };
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch(e) {}
    }
    setIsListening(false);
  }, [isListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("API de reconnaissance vocale non supportée par ce navigateur.");
      return;
    }

    setError(null);
    setTranscript('');
    setIsListening(true);
    
    recognitionRef.current.lang = lang;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      // Safety timeout if user forgets to stop
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, timeoutMs);
    };

    recognitionRef.current.onresult = (event: any) => {
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

    recognitionRef.current.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError("Permission micro refusée. Veuillez autoriser l'accès au microphone.");
      } else if (event.error === 'no-speech') {
        setError("Aucun son détecté.");
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
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // Already started, safely ignore
      } else {
        setError(err.message);
        setIsListening(false);
      }
    }
  }, [lang, timeoutMs, stopListening]);

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

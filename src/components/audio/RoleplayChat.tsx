'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { PersonaId, personas } from '@/lib/ai/prompts';
import { parseAiMessage, extractCleanArabicForTts, sanitizeTtsArabic } from '@/lib/ai/parseAiMessage';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { playAudio } from '@/lib/audio';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Turtle,
  Loader2,
  Globe,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export interface RoleplayChatProps {
  personaId: PersonaId;
  onQuotaExceeded?: () => void;
  className?: string;
  authToken?: string;
}

export { parseAiMessage, extractCleanArabicForTts, sanitizeTtsArabic };

export default function RoleplayChat({
  personaId,
  onQuotaExceeded,
  className = '',
  authToken,
}: RoleplayChatProps) {
  const persona = personas[personaId] || personas.taxi;
  const { soundEnabled } = useAppStore();
  const [showTranslations, setShowTranslations] = useState<Record<number, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    reload,
  } = useChat({
    api: '/api/roleplay/chat',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    body: { personaId },
    initialMessages: [],
    onError: (err) => {
      console.error('[Roleplay Chat Error]:', err);
      if (
        err.message?.includes('QUOTA') ||
        err.message?.includes('403') ||
        err.message?.includes('quota')
      ) {
        if (onQuotaExceeded) onQuotaExceeded();
      }
    },
  });

  const [recognitionLang, setRecognitionLang] = useState<'ar-MA' | 'fr-FR'>('ar-MA');

  // Zero-cost native browser speech recognition (ar-MA / fr-FR)
  const {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useVoiceRecognition(recognitionLang, 8000);

  // Sync vocal transcript directly to input field
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timeout de 10s : si le serveur tarde à streamer, désactiver le spinner et proposer de réessayer
  const [streamTimeoutHit, setStreamTimeoutHit] = useState(false);
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = setTimeout(() => {
        setStreamTimeoutHit(true);
      }, 10000);
    } else {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
        streamTimeoutRef.current = null;
      }
    }
    return () => {
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
        streamTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [audioFeedback, setAudioFeedback] = useState<{ id: string; error: string } | null>(null);

  const handlePlayVoice = (messageId: string, rawText: string, speed: 'normal' | 'slow' = 'normal') => {
    if (!rawText) return;

    const cleanArabic = extractCleanArabicForTts(rawText);
    if (!cleanArabic || cleanArabic.trim().length === 0) return;

    const key = `${messageId}-${speed}`;

    // Si l'utilisateur re-clique sur le même audio en cours, on le met en pause
    if (playingKey === key && activeAudioRef.current && !activeAudioRef.current.paused) {
      activeAudioRef.current.pause();
      setPlayingKey(null);
      return;
    }

    // 1. Arrêter et purger l'audio précédent proprement
    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.onerror = null;
      activeAudioRef.current.pause();
      activeAudioRef.current.removeAttribute('src');
      activeAudioRef.current = null;
    }

    setAudioFeedback(null);
    setPlayingKey(key);

    // 2. URL directe de streaming 'self' (100% conforme CSP)
    const gender = personaId === 'cafe' || personaId === 'taxi' || personaId === 'souk' || personaId === 'medecin' ? 'male' : 'female';
    const url = `/api/tts?text=${encodeURIComponent(cleanArabic)}&speed=${speed}&gender=${gender}`;
    const audio = new Audio(url);
    activeAudioRef.current = audio;

    audio.onended = () => {
      if (activeAudioRef.current === audio) {
        setPlayingKey(null);
      }
    };

    audio.onerror = (e) => {
      console.error('Erreur audio élément direct :', e, audio.error);
      if (activeAudioRef.current === audio) {
        setPlayingKey(null);
        setAudioFeedback({ id: messageId, error: 'Erreur audio' });
        setTimeout(() => setAudioFeedback(null), 3500);
      }
    };

    // 3. Déclenchement de la lecture
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play() error :', err.name, err.message);
        if (activeAudioRef.current === audio) {
          setPlayingKey(null);
          if (err.name !== 'AbortError') {
            setAudioFeedback({ id: messageId, error: `${err.name}` });
            setTimeout(() => setAudioFeedback(null), 3500);
          }
        }
      });
    }
  };

  const toggleTranslation = (idx: number) => {
    setShowTranslations((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className={`flex flex-col h-full bg-[#FDFCF8] rounded-3xl border border-[#E8E2D5] shadow-xs overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 bg-[#F7F3EA] border-b border-[#E8E2D5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center font-bold text-sm">
            {persona.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#1B2A4A]">{persona.name}</h3>
            <p className="text-[11px] text-[#7A7670]">{persona.context}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => reload()}
          className="p-2 text-[#7A7670] hover:text-[#1B2A4A] rounded-full hover:bg-[#E8E2D5]/50 transition-colors"
          title="Relancer le dialogue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="p-6 text-center space-y-2 bg-[#F7F3EA]/60 rounded-2xl border border-[#E8E2D5] max-w-sm mx-auto my-8">
            <Sparkles className="w-6 h-6 text-[#C9A05C] mx-auto" />
            <p className="font-display font-bold text-sm text-[#1B2A4A]">
              Commencez votre échange en Darija
            </p>
            <p className="text-xs text-[#7A7670]">
              Écrivez ou appuyez sur le micro pour parler à {persona.name}.
            </p>
          </div>
        )}

        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          const parsed = !isUser ? parseAiMessage(m.content) : null;

          return (
            <div
              key={m.id || idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                  isUser
                    ? 'bg-[#1B2A4A] text-[#FDFCF8] rounded-br-none'
                    : 'bg-[#F7F3EA] text-[#1B2A4A] border border-[#E8E2D5] rounded-bl-none'
                }`}
              >
                {isUser ? (
                  <p className="text-sm font-medium">{m.content}</p>
                ) : (
                  <div className="space-y-2">
                    {/* Audio playback controls */}
                    <div className="flex items-center gap-1.5 pb-1 border-b border-[#E8E2D5]/60">
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(m.id || `msg-${idx}`, parsed?.ar || m.content, 'normal')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          playingKey === `${m.id || `msg-${idx}`}-normal`
                            ? 'bg-[#C9A05C] text-[#1B2A4A] shadow-sm'
                            : 'bg-amber-100/50 hover:bg-amber-100 text-[#1B2A4A]'
                        }`}
                        title="Écouter à vitesse normale"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>1.0x</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(m.id || `msg-${idx}`, parsed?.ar || m.content, 'slow')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          playingKey === `${m.id || `msg-${idx}`}-slow`
                            ? 'bg-[#C9A05C] text-[#1B2A4A] shadow-sm'
                            : 'bg-amber-100/50 hover:bg-amber-100 text-[#1B2A4A]'
                        }`}
                        title="Écouter au ralenti (mode tortue)"
                      >
                        <Turtle className="w-3.5 h-3.5" />
                        <span>0.75x</span>
                      </button>

                      {audioFeedback?.id === (m.id || `msg-${idx}`) && (
                        <span className="text-[10px] text-rose-500 font-medium ml-2 animate-in fade-in">
                          {audioFeedback.error}
                        </span>
                      )}
                    </div>

                    {/* Arabic text */}
                    {parsed?.ar && (
                      <p className="font-arabic text-xl leading-relaxed text-[#1B2A4A]">
                        {parsed.ar}
                      </p>
                    )}

                    {/* Arabizi phonetics */}
                    {parsed?.arz && (
                      <p className="font-display font-bold text-sm text-[#1B2A4A]">
                        {parsed.arz}
                      </p>
                    )}

                    {/* French translation toggle */}
                    {parsed?.fr && (
                      <div className="pt-1">
                        {showTranslations[idx] ? (
                          <p className="text-xs text-[#7A7670] italic border-t border-[#E8E2D5] pt-1 mt-1">
                            {parsed.fr}
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleTranslation(idx)}
                            className="text-[10px] text-[#7A7670] hover:text-[#1B2A4A] flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Voir la traduction</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && !streamTimeoutHit && (
          <div className="flex justify-start">
            <div className="bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#C9A05C] animate-spin" />
              <span className="text-xs text-[#7A7670]">En train de répondre...</span>
            </div>
          </div>
        )}

        {streamTimeoutHit && (
          <div className="flex justify-start">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-3">
              <span className="text-xs">La réponse prend du temps.</span>
              <button
                type="button"
                onClick={() => {
                  setStreamTimeoutHit(false);
                  reload();
                }}
                className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>🔄 Réessayer</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar with integrated microphone */}
      <div className="p-3 bg-[#F7F3EA] border-t border-[#E8E2D5]">
        {/* Suggestion pills if available from last assistant message */}
        {(() => {
          const lastMsg = messages[messages.length - 1];
          if (!lastMsg || lastMsg.role !== 'assistant') return null;
          const parsed = parseAiMessage(lastMsg.content);
          if (!parsed.suggestions || parsed.suggestions.length === 0) return null;
          return (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5 px-1">
              <span className="text-[11px] font-semibold text-[#7A7670] mr-1">Suggestions :</span>
              {parsed.suggestions.map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(sugg)}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#FDFCF8] hover:bg-[#E8E2D5] text-[#1B2A4A] border border-[#E8E2D5] transition-all hover:scale-[1.02] active:scale-95 text-left shadow-2xs"
                >
                  💡 {sugg}
                </button>
              ))}
            </div>
          );
        })()}

        <form
          onSubmit={(e) => {
            setStreamTimeoutHit(false);
            if (isListening) stopListening();
            handleSubmit(e);
          }}
          className="flex items-center gap-2"
        >
          {/* Micro button & language toggle */}
          {isSupported && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMicToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                    : 'bg-[#FDFCF8] border border-[#E8E2D5] text-[#1B2A4A] hover:bg-[#E8E2D5]/50'
                }`}
                title={isListening ? 'Arrêter la dictée vocale' : 'Parler au micro'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4 text-[#C9A05C]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setRecognitionLang((prev) => (prev === 'ar-MA' ? 'fr-FR' : 'ar-MA'))}
                className="px-1.5 py-1 text-[10px] font-bold text-[#7A7670] hover:text-[#1B2A4A] rounded-md bg-[#FDFCF8] border border-[#E8E2D5]"
                title="Basculer la langue du micro (ar-MA / fr-FR)"
              >
                {recognitionLang === 'ar-MA' ? 'AR' : 'FR'}
              </button>
            </div>
          )}

          {/* Text Input */}
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={
              isListening
                ? 'Parlez maintenant en Darija...'
                : 'Écrivez votre réponse en Darija ou Arabizi...'
            }
            className="flex-1 bg-[#FDFCF8] border border-[#E8E2D5] rounded-full px-4 py-2 text-sm text-[#1B2A4A] placeholder-[#7A7670]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A05C]"
            disabled={isLoading && !isListening}
          />

          {/* Send CTA */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-[#FDFCF8] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            title="Envoyer"
          >
            <Send className="w-4 h-4 text-[#C9A05C]" />
          </button>
        </form>
      </div>

    </div>
  );
}

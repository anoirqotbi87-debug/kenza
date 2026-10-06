'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { PersonaId, personas } from '@/lib/ai/prompts';
import { parseAiMessage } from '@/lib/ai/parseAiMessage';
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

export { parseAiMessage };

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

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handlePlayVoice = (text: string, arabic?: string, speed: 'normal' | 'slow' = 'normal') => {
    playAudio(text, arabic, soundEnabled, speed === 'slow' ? 0.75 : 1.0, {
      speed,
      voice: personaId === 'cafe' || personaId === 'taxi' || personaId === 'souk' || personaId === 'medecin' ? 'male' : 'female',
    });
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
                        onClick={() => handlePlayVoice(parsed?.arz || m.content, parsed?.ar, 'normal')}
                        className="p-1.5 text-[#1B2A4A] hover:text-[#C9A05C] rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Écouter à vitesse normale"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C9A05C]" />
                        <span>1.0x</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(parsed?.arz || m.content, parsed?.ar, 'slow')}
                        className="p-1.5 text-[#7A7670] hover:text-[#1B2A4A] rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Écouter au ralenti (mode tortue)"
                      >
                        <Turtle className="w-3.5 h-3.5 text-[#C9A05C]" />
                        <span>0.75x</span>
                      </button>
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

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#C9A05C] animate-spin" />
              <span className="text-xs text-[#7A7670]">En train de répondre...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar with integrated microphone */}
      <div className="p-3 bg-[#F7F3EA] border-t border-[#E8E2D5]">
        <form
          onSubmit={(e) => {
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

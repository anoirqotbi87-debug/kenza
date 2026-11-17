'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { playAudio } from '@/lib/audio';
import { parseAiMessage, extractTextFromAiStream, type ParsedMessage } from '@/lib/ai/parseAiMessage';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  rawContent: string;
  parsed?: ParsedMessage;
  timestamp: Date;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  rawContent:
    '[AR] السَّلَامُ عَلَيْكُمْ ! أَنَا كَنْزْبُوتْ، الْمُسَاعِدْ دْيَالْكْ لِتَعَلُّمِ الدَّارِجَة. فِينْ نْبْدَاوْ الْيُومْ ؟ [/AR]\n[ARZ] Salamu 3alaykum ! Ana KenzBot, l-mosa3id dyalek l-ta3allom d-darija. Fin nebdaou lyoum ? [/ARZ]\n[FR] Bonjour ! Je suis KenzBot, ton tuteur pour apprendre le Darija marocain. Par quoi commençons-nous aujourd\'hui ? [/FR]\n[TIP] Tu peux me parler en français, en Darija arabe ou en Arabizi (chiffres 3, 7, 9) ! [/TIP]\n[SUGG] Salam KenzBot ! | Bghit n-t3ellem kalimat jdad | Kifach n-gol "merci" ? [/SUGG]',
  parsed: {
    ar: 'السَّلَامُ عَلَيْكُمْ ! أَنَا كَنْزْبُوتْ، الْمُسَاعِدْ دْيَالْكْ لِتَعَلُّمِ الدَّارِجَة. فِينْ نْبْدَاوْ الْيُومْ ؟',
    arz: 'Salamu 3alaykum ! Ana KenzBot, l-mosa3id dyalek l-ta3allom d-darija. Fin nebdaou lyoum ?',
    fr: 'Bonjour ! Je suis KenzBot, ton tuteur pour apprendre le Darija marocain. Par quoi commençons-nous aujourd\'hui ?',
    tip: 'Tu peux me parler en français, en Darija arabe ou en Arabizi (chiffres 3, 7, 9) !',
    suggestions: ['Salam KenzBot !', 'Bghit n-t3ellem kalimat jdad', 'Kifach n-gol "merci" ?'],
  },
  timestamp: new Date(),
};

export default function KenzChatInterface() {
  const { soundEnabled, toggleSound, addXp } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceRecognition('ar-MA', 6000);

  // Auto-scroll vers le bas lors de l'ajout d'un message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, isLoading]);

  // Écoute audio de la réplique
  const handlePlayAudio = (parsed?: ParsedMessage, fallbackText = '') => {
    if (!parsed) {
      playAudio(fallbackText, undefined, soundEnabled);
      return;
    }
    const textToSpeak = parsed.ar || parsed.arz || fallbackText;
    playAudio(textToSpeak, undefined, soundEnabled, 1.0, { voice: 'ar-MA-JamalNeural' });
  };

  // Bascule de la traduction française
  const toggleTranslation = (id: string) => {
    setShowTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Envoi d'un message à l'API de chat
  const sendMessage = useCallback(
    async (textToSend: string) => {
      const cleanText = textToSend.trim();
      if (!cleanText || isLoading) return;

      setErrorMessage(null);
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        rawContent: cleanText,
        timestamp: new Date(),
      };

      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      setInput('');
      setIsLoading(true);

      // Attribution d'XP pour l'interaction
      addXp(5);

      try {
        // Préparation du payload vers /api/roleplay/chat avec persona kenzbot
        const apiMessages = updatedHistory.slice(-10).map((m) => ({
          role: m.role,
          content: m.rawContent,
        }));

        const res = await fetch('/api/roleplay/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
            personaId: 'kenzbot',
            userLanguage: 'fr',
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur serveur (${res.status})`);
        }

        // Lecture du flux de réponse (Streaming)
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        const botMessageId = `bot-${Date.now()}`;

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulatedText += decoder.decode(value, { stream: true });

            const cleanText = extractTextFromAiStream(accumulatedText);
            const liveParsed = parseAiMessage(cleanText);
            setMessages((prev) => {
              const existing = prev.find((m) => m.id === botMessageId);
              if (existing) {
                return prev.map((m) =>
                  m.id === botMessageId
                    ? { ...m, rawContent: cleanText, parsed: liveParsed }
                    : m
                );
              }
              return [
                ...prev,
                {
                  id: botMessageId,
                  role: 'assistant',
                  rawContent: cleanText,
                  parsed: liveParsed,
                  timestamp: new Date(),
                },
              ];
            });
          }
        } else {
          accumulatedText = await res.text();
          const cleanText = extractTextFromAiStream(accumulatedText);
          const parsed = parseAiMessage(cleanText);
          setMessages((prev) => [
            ...prev,
            {
              id: botMessageId,
              role: 'assistant',
              rawContent: cleanText,
              parsed,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Impossible de contacter KenzBot.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, addXp]
  );

  // Synchronisation vocale automatique lorsque l'utilisateur s'arrête de parler
  useEffect(() => {
    if (!isListening && transcript && !isLoading) {
      const timer = setTimeout(() => {
        void sendMessage(transcript);
        if (typeof resetTranscript === 'function') resetTranscript();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, isLoading, sendMessage, resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMessage(null);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] max-w-4xl mx-auto w-full bg-white dark:bg-[#26211E] rounded-3xl border border-amber-100 dark:border-amber-900/30 shadow-md overflow-hidden font-sans">
      {/* 1. SOUS-EN-TÊTE DE LA CONVERSATION */}
      <div className="px-4 py-3 bg-[#FAF7F2] dark:bg-[#201B18] border-b border-amber-100/80 dark:border-amber-900/30 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center shadow-xs border border-amber-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-100">
                KenzBot
              </h2>
              <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                En ligne
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tuteur & Coach Darija · Intelligence Artificielle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetChat}
            aria-label="Réinitialiser la conversation"
            title="Réinitialiser la conversation"
            className="p-2 rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
            className="p-2 rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>
        </div>
      </div>

      {/* 2. ZONE DE DÉFILEMENT DES MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isBot = m.role === 'assistant';
          const parsed = m.parsed;
          const isTranslated = showTranslations[m.id];

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2.5 sm:gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-amber-200/50 dark:border-amber-900/40">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs transition-all ${
                  isBot
                    ? 'bg-[#FAF7F2] dark:bg-[#201B18] border border-amber-100 dark:border-amber-900/30 rounded-bl-xs text-stone-800 dark:text-stone-100'
                    : 'bg-amber-600 text-white dark:bg-amber-700 rounded-br-xs'
                }`}
              >
                {/* En-tête de bulle */}
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      isBot ? 'text-amber-700 dark:text-amber-400' : 'text-amber-100'
                    }`}
                  >
                    {isBot ? 'KenzBot' : 'Vous'}
                  </span>

                  {isBot && (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(parsed, m.rawContent)}
                      aria-label="Écouter la prononciation"
                      className="p-1 rounded-full text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </button>
                  )}
                </div>

                {/* Si message bot structuré (Arabe + Arabizi + Français) */}
                {isBot && parsed && (parsed.ar || parsed.arz) ? (
                  <div className="space-y-1.5">
                    {parsed.ar && (
                      <p
                        dir="rtl"
                        className="text-xl sm:text-2xl font-bold font-arabic leading-relaxed text-stone-800 dark:text-stone-100"
                      >
                        {parsed.ar}
                      </p>
                    )}
                    {parsed.arz && (
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        {parsed.arz}
                      </p>
                    )}

                    {/* Accordéon Traduction */}
                    {parsed.fr && (
                      <div className="pt-2 border-t border-amber-200/40 dark:border-amber-900/30">
                        <button
                          type="button"
                          onClick={() => toggleTranslation(m.id)}
                          className="text-xs flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                        >
                          <span>{isTranslated ? 'Masquer la traduction' : 'Voir la traduction'}</span>
                          {isTranslated ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {isTranslated && (
                          <p className="text-xs mt-1.5 italic text-stone-600 dark:text-stone-300">
                            « {parsed.fr} »
                          </p>
                        )}
                      </div>
                    )}

                    {/* Conseil pédagogique du coach [TIP] */}
                    {parsed.tip && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Conseil du Coach
                          </span>
                          <span className="font-medium">{parsed.tip}</span>
                        </div>
                      </div>
                    )}

                    {/* Suggestions de réponses rapides */}
                    {parsed.suggestions && parsed.suggestions.length > 0 && (
                      <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                        {parsed.suggestions.map((sugg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => sendMessage(sugg)}
                            className="text-xs bg-amber-100/70 hover:bg-amber-600 hover:text-white dark:bg-[#201B18] dark:hover:bg-amber-600 dark:text-amber-200 text-amber-900 border border-amber-200/60 dark:border-amber-900/40 px-3 py-1 rounded-full transition-colors font-medium text-left"
                          >
                            {sugg}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-stone-800 dark:text-stone-100">{m.rawContent}</p>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-800 text-amber-200 dark:bg-stone-700 font-bold flex items-center justify-center shrink-0 shadow-xs border border-white dark:border-zinc-800">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Indicateur d'écriture */}
        {isLoading && (
          <div className="flex items-end gap-2.5 sm:gap-3 justify-start animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#FAF7F2] dark:bg-[#201B18] border border-amber-100 dark:border-amber-900/30 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                KenzBot formule sa réponse...
              </span>
              <div className="flex gap-1 items-center ml-1">
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur éventuel */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 3. BARRE D'INTERACTION VOCALE & SAISIE TEXTUELLE */}
      <div className="p-3 sm:p-4 bg-[#FAF7F2] dark:bg-[#201B18] border-t border-amber-100/80 dark:border-amber-900/30 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
          {/* Bouton Microphone */}
          <div className="relative">
            {isListening && (
              <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping" />
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              aria-label={isListening ? "Arrêter l'écoute vocale" : 'Parler au micro'}
              title={isListening ? "Arrêter l'écoute" : 'Parler en Darija'}
              className={`relative z-10 p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* Champ de saisie texte */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={
              isListening
                ? 'Écoute active en Darija...'
                : isSupported
                ? 'Écrivez en Darija, Arabizi ou Français...'
                : 'Tapez votre message ici...'
            }
            className="flex-1 bg-white dark:bg-[#26211E] border border-amber-100 dark:border-amber-900/40 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-amber-500"
          />

          {/* Bouton d'envoi */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Envoyer le message"
            className="p-2.5 sm:p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mt-2 max-w-3xl mx-auto px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Chaque échange vous rapporte +5 XP
          </span>
          <span>IA optimisée pour le Darija marocain</span>
        </div>
      </div>
    </div>
  );
}

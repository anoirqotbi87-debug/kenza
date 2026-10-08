'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { PersonaId, personas } from '@/lib/ai/prompts';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Send, Mic, MicOff, Save, Loader2, RefreshCw, Volume2, Turtle, AlertCircle } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { playAudio } from '@/lib/audio';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import PaywallModal from '@/components/monetization/PaywallModal';
import { useDialog } from '@/hooks/useDialog';
import { parseAiMessage } from '@/lib/ai/parseAiMessage';
import AuthModal from '@/components/auth/AuthModal';

interface AiRoleplayViewProps {
  personaId: PersonaId;
  onClose: () => void;
}

export default function AiRoleplayView({ personaId, onClose }: AiRoleplayViewProps) {
  const { dialogRef } = useDialog(true, onClose);

  const [token, setToken] = useState<string>('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
      }
    });
  }, []);

  // Compte à rebours de cooldown 10s sur 429
  useEffect(() => {
    if (rateLimitCooldown === null || rateLimitCooldown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCooldown((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCooldown]);

  const persona = personas[personaId];
  const { addCustomWordToSRS, soundEnabled } = useAppStore();
  const { t } = useTranslation();
  const rp = t.modules.roleplay;
  const [showImmersion, setShowImmersion] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handlePlayVoice = (text: string, arabic?: string, speed: 'normal' | 'slow' = 'normal') => {
    playAudio(text, arabic, soundEnabled, speed === 'slow' ? 0.75 : 1.0, {
      speed,
      voice: personaId === 'cafe' || personaId === 'taxi' || personaId === 'souk' || personaId === 'medecin' ? 'male' : 'female',
    });
  };

  const STREAM_TIMEOUT_MS = 30000;

  const getErrorInfo = (err: Error | null | undefined) => {
    if (!err) return null;
    let parsed: { error?: string; message?: string; guest?: boolean } | null = null;
    try {
      parsed = JSON.parse(err.message);
    } catch {
      // Not JSON
    }
    const raw = err.message || '';
    const isRateLimit = raw.includes('429') || raw.includes('RATE_LIMIT') || parsed?.error === 'RATE_LIMIT_EXCEEDED';
    const isGuestQuota = parsed?.guest === true || raw.includes('session d\'essai') || raw.includes('3 messages');
    const isQuota = raw.includes('403') || raw.includes('QUOTA') || parsed?.error === 'QUOTA_EXCEEDED' || isGuestQuota;

    if (isRateLimit) {
      return {
        type: 'ratelimit' as const,
        title: "L'agent reprend son souffle",
        message: rateLimitCooldown !== null && rateLimitCooldown > 0
          ? `L'agent reprend son souffle ! Veuillez patienter ${rateLimitCooldown} secondes...`
          : "L'agent reprend son souffle ! Vous pouvez maintenant renvoyer votre message.",
      };
    }

    if (isGuestQuota) {
      return {
        type: 'guest_quota' as const,
        title: 'Session de découverte terminée',
        message: 'Votre session de découverte de 3 messages est terminée. Connectez-vous pour continuer gratuitement !',
      };
    }

    if (isQuota) {
      return {
        type: 'quota' as const,
        title: "Limite d'utilisation atteinte",
        message: parsed?.message || 'Quota quotidien de 8 messages atteint. Passez à Kenza Pro pour des conversations illimitées !',
      };
    }

    if (raw.includes('503') || raw.includes('AI_SERVICE_UNAVAILABLE') || raw.includes('Configuration API')) {
      return {
        type: 'server' as const,
        title: 'Configuration API requise',
        message: parsed?.message || 'Configuration API en cours sur le serveur.',
      };
    }

    return {
      type: 'general' as const,
      title: 'Information sur le service IA',
      message: parsed?.message || (raw && raw !== 'An error occurred.' ? raw : 'Service IA temporairement indisponible. Veuillez réessayer dans un instant.'),
    };
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload, error, stop } = useChat({
    api: '/api/roleplay/chat',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: { personaId },
    initialMessages: [],
    onError: (err) => {
      console.error('[AI Chat Error]:', err);
      let errMsg = err.message || '';
      let isGuest = false;
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) errMsg = `${parsed.error} ${parsed.message || ''}`;
        if (parsed?.guest === true) isGuest = true;
      } catch {
        // Not JSON
      }
      if (errMsg.includes('RATE_LIMIT_EXCEEDED') || errMsg.includes('429')) {
        setRateLimitCooldown(10);
      } else if (isGuest || errMsg.includes('session d\'essai') || errMsg.includes('3 messages')) {
        // Afficher l'invitation à se connecter
      } else if (
        errMsg.includes('QUOTA') || 
        errMsg.includes('403') || 
        errMsg.includes('quota') ||
        errMsg.includes('UNAUTHORIZED')
      ) {
        setShowPaywall(true);
      }
    }
  });

  // Sécurise le stream : si la réponse tarde plus que STREAM_TIMEOUT_MS,
  // on arrête le spinner, on réactive l'envoi et on prévient l'utilisateur.
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [streamTimeoutHit, setStreamTimeoutHit] = useState(false);

  useEffect(() => {
    if (isLoading) {
      streamTimeoutRef.current = setTimeout(() => {
        setStreamTimeoutHit(true);
        stop();
        setToastMessage('La réponse prend du temps. Réessayez.');
        setTimeout(() => setToastMessage(null), 4000);
      }, STREAM_TIMEOUT_MS);
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
  }, [isLoading, stop]);

  const { isSupported, isListening, transcript, startListening, stopListening } = useVoiceRecognition('ar-MA', 10000);

  // Sync voice transcript to chat input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript, setInput]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleSaveToSRS = (ar: string, arz: string, fr: string) => {
    if (!ar && !arz && !fr) return;
    const wordId = `srs_ai_${uuidv4().substring(0, 8)}`;
    
    addCustomWordToSRS({
      id: wordId,
      arabic: ar || '',
      arabizi: arz || '',
      translation: { fr: fr || '', en: fr || '', es: fr || '', ar: ar || '' },
      category: `roleplay_${personaId}`,
      illustration: { iconName: personaId === 'taxi' ? 'Car' : personaId === 'cafe' ? 'Coffee' : personaId === 'medecin' ? 'Stethoscope' : 'ShoppingBag' }
    });
    
    setToastMessage(rp.addedToSrs);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (isListening) stopListening();
    setStreamTimeoutHit(false);
    handleSubmit(e);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-roleplay-title"
      tabIndex={-1}
      className="flex flex-col h-full bg-[#F7F3EA] relative animate-in fade-in zoom-in-95 duration-200"
    >
      
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B2A4A] text-[#FDFCF8] border border-[#C9A05C]/40 px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-4"
        >
          <Save className="w-4 h-4 text-[#C9A05C]" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#FDFCF8] px-4 py-3.5 flex items-center justify-between shadow-xs border-b border-[#E8E2D5] z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button aria-label={t.common.back} onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-[#E8E2D5]/50 text-[#7A7670] hover:text-[#1B2A4A] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 id="ai-roleplay-title" className="font-display font-bold text-[#1B2A4A] flex items-center gap-2 text-base sm:text-lg">
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : personaId === 'medecin' ? '🩺' : '🏺'} {persona.name}
            </h2>
            <p className="text-xs text-[#7A7670] line-clamp-1">{persona.context}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowImmersion(!showImmersion)}
          className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors border ${showImmersion ? 'bg-[#C9A05C]/20 border-[#C9A05C]/40 text-[#1B2A4A]' : 'bg-[#F7F3EA] border-[#E8E2D5] text-[#7A7670]'}`}
        >
          {showImmersion ? 'Immersion: ON' : 'Immersion: OFF'}
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-75">
            <div className="w-16 h-16 rounded-full bg-[#C9A05C]/15 border border-[#C9A05C]/30 flex items-center justify-center mb-4 text-3xl">
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : personaId === 'medecin' ? '🩺' : '🏺'}
            </div>
            <p className="text-[#1B2A4A] font-medium text-sm">L'agent est prêt. Envoyez "Salam" pour commencer !</p>
          </div>
        )}

        {error && !streamTimeoutHit && (() => {
          const info = getErrorInfo(error);
          if (!info) return null;
          const isRateLimit = info.type === 'ratelimit';
          const isGuestQuota = info.type === 'guest_quota';
          const isCooldownActive = isRateLimit && rateLimitCooldown !== null && rateLimitCooldown > 0;

          return (
            <div className={`p-3.5 rounded-2xl text-sm shadow-xs space-y-2.5 ${
              isRateLimit
                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isRateLimit ? 'text-amber-600' : 'text-red-600'}`} />
                  <div>
                    <p className={`font-semibold ${isRateLimit ? 'text-amber-950' : 'text-red-900'}`}>
                      {info.title}
                    </p>
                    <p className={`text-xs mt-0.5 leading-relaxed ${isRateLimit ? 'text-amber-800' : 'text-red-700'}`}>
                      {info.message}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isCooldownActive}
                  onClick={() => { setStreamTimeoutHit(false); reload(); }}
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs ${
                    isRateLimit
                      ? isCooldownActive
                        ? 'bg-amber-100 text-amber-500 border border-amber-300 cursor-not-allowed opacity-60'
                        : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                      : 'bg-white text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCooldownActive ? 'animate-spin' : ''}`} />
                  {isCooldownActive ? `${rateLimitCooldown}s` : 'Réessayer'}
                </button>
              </div>
              <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                isRateLimit ? 'border-amber-200/60' : 'border-red-200/60'
              }`}>
                <span className={isRateLimit ? 'text-amber-800/80' : 'text-red-700/80'}>
                  {isGuestQuota
                    ? 'Débloquez plus de messages gratuits :'
                    : info.type === 'quota'
                      ? 'Débloquez des conversations illimitées :'
                      : 'Besoin de vous entraîner sans IA ?'}
                </span>
                {isGuestQuota ? (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="font-bold underline text-[#1B2A4A] hover:text-[#C9A05C] ml-2"
                  >
                    Se connecter
                  </button>
                ) : info.type === 'quota' ? (
                  <button
                    type="button"
                    onClick={() => setShowPaywall(true)}
                    className="font-bold underline hover:text-red-900 ml-2"
                  >
                    Passer Pro
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-bold underline hover:opacity-80 ml-2"
                  >
                    Dialogues guidés
                  </button>
                )}
              </div>
            </div>
          );
        })()}

      {streamTimeoutHit && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-sm flex items-center justify-between shadow-xs">
            <span>La réponse prend du temps. Réessayer.</span>
            <button onClick={() => { setStreamTimeoutHit(false); reload(); }} className="flex items-center gap-1 font-bold hover:underline"><RefreshCw className="w-4 h-4"/> Réessayer</button>
          </div>
        )}

        {messages.map((m: Message) => {
          const isUser = m.role === 'user';
          const { ar, arz, fr } = isUser ? { ar: '', arz: '', fr: m.content } : parseAiMessage(m.content);

          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-xs relative group ${
                isUser 
                  ? 'bg-[#1B2A4A] text-[#FDFCF8] rounded-br-none' 
                  : 'bg-[#FDFCF8] border border-[#E8E2D5] rounded-bl-none text-[#1B2A4A]'
              }`}>
                
                {isUser ? (
                  <p className="text-sm font-medium">{m.content}</p>
                ) : (
                  <div className="space-y-2">
                    {/* Audio playback controls */}
                    <div className="flex items-center gap-1.5 pb-1 border-b border-[#E8E2D5]/60">
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(arz || m.content, ar, 'normal')}
                        className="p-1 text-[#1B2A4A] hover:text-[#C9A05C] rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Écouter à vitesse normale"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#C9A05C]" />
                        <span>1.0x</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(arz || m.content, ar, 'slow')}
                        className="p-1 text-[#7A7670] hover:text-[#1B2A4A] rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                        title="Écouter au ralenti (mode tortue)"
                      >
                        <Turtle className="w-3.5 h-3.5 text-[#C9A05C]" />
                        <span>0.75x</span>
                      </button>
                    </div>

                    {ar && (
                      <p className="text-xl font-bold font-arabic text-right leading-relaxed text-[#1B2A4A]" dir="rtl">
                        {ar}
                      </p>
                    )}
                    
                    {(!showImmersion || !ar) && (
                      <div className="pt-2 border-t border-[#E8E2D5] space-y-1 mt-2">
                        {arz && <p className="text-sm font-bold text-[#1B2A4A]">{arz}</p>}
                        {fr && <p className="text-xs sm:text-sm text-[#7A7670]">{fr}</p>}
                      </div>
                    )}
                    
                    {/* Action Rapide : Sauvegarder dans SRS */}
                    <button 
                      onClick={() => handleSaveToSRS(ar, arz, fr)}
                      className="absolute -right-3 -top-3 bg-[#FDFCF8] border border-[#E8E2D5] text-[#C9A05C] rounded-full p-1.5 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-[#C9A05C]/15 hover:scale-110"
                      title={rp.saveToSrs}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-[#FDFCF8] border border-[#E8E2D5] rounded-2xl rounded-bl-none p-4 shadow-xs">
              <Loader2 className="w-5 h-5 text-[#C9A05C] animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA OR COMPLETION */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#FDFCF8] border-t border-[#E8E2D5] p-4 pb-safe z-20">
        
        {messages.length >= 8 ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-bold text-[#7A9174]">{rp.missionComplete}</p>
            <button
              onClick={() => {
                useAppStore.getState().addXp(25);
                onClose();
              }}
              className="w-full max-w-sm py-3.5 bg-[#7A9174] hover:bg-[#687f63] text-white rounded-full font-bold transition-colors shadow-xs"
            >
              {rp.claimXp}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitForm} className="flex items-center gap-2 max-w-4xl mx-auto relative">
            
            {isSupported && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-50 text-red-500 animate-pulse ring-4 ring-red-100' 
                    : 'bg-[#F7F3EA] border border-[#E8E2D5] text-[#7A7670] hover:text-[#1B2A4A]'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <input
              className="flex-1 bg-[#F7F3EA] border border-[#E8E2D5] rounded-full px-5 py-3 text-sm text-[#1B2A4A] placeholder-[#7A7670]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A05C] transition-colors"
              value={input}
              onChange={handleInputChange}
              placeholder={isListening ? rp.listeningSpeak : rp.inputPlaceholder}
              disabled={isLoading && !isListening}
            />
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </form>
        )}
      </div>
      

      {showPaywall && <PaywallModal source="ai_quota_exceeded" onClose={() => setShowPaywall(false)} />}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          supabase.auth.getSession().then(({ data }) => {
            if (data.session) setToken(data.session.access_token);
          });
        }}
      />
    </div>
  );
}


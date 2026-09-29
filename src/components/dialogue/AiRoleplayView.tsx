'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { PersonaId, personas } from '@/lib/ai/prompts';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Send, Mic, MicOff, Save, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import PaywallModal from '@/components/monetization/PaywallModal';

interface AiRoleplayViewProps {
  personaId: PersonaId;
  onClose: () => void;
}

const parseAiMessage = (content: string) => {
  let ar = '';
  let arz = '';
  let fr = '';
  
  const arIndex = content.indexOf('[AR]');
  const arzIndex = content.indexOf('[ARZ]');
  const frIndex = content.indexOf('[FR]');
  
  if (arIndex !== -1) {
    const endAr = arzIndex !== -1 ? arzIndex : (frIndex !== -1 ? frIndex : content.length);
    ar = content.substring(arIndex + 4, endAr).trim();
  }
  
  if (arzIndex !== -1) {
    const endArz = frIndex !== -1 ? frIndex : content.length;
    arz = content.substring(arzIndex + 5, endArz).trim();
  }
  
  if (frIndex !== -1) {
    fr = content.substring(frIndex + 4).trim();
  }

  // Repli robuste : si aucune balise reconnue ou si parsing incomplet
  if (!ar && !arz && !fr) {
    const hasArabicChars = /[\u0600-\u06FF]/.test(content);
    if (hasArabicChars) {
      ar = content.trim();
    } else {
      fr = content.trim();
    }
  }
  
  return { ar, arz, fr };
};

export default function AiRoleplayView({ personaId, onClose }: AiRoleplayViewProps) {

  const [token, setToken] = useState<string>('');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
      }
    });
  }, []);
  const persona = personas[personaId];
  const { addCustomWordToSRS } = useAppStore();
  const { t } = useTranslation();
  const rp = t.modules.roleplay;
  const [showImmersion, setShowImmersion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload, error } = useChat({
    api: '/api/roleplay/chat',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: { personaId },
    initialMessages: [],
    onError: (err) => {
      console.error('[AI Chat Error]:', err);
      if (
        err.message?.includes('QUOTA') || 
        err.message?.includes('403') || 
        err.message?.includes('quota') ||
        err.message?.includes('UNAUTHORIZED')
      ) {
        setShowPaywall(true);
      }
    }
  });

  const { isSupported, isListening, transcript, startListening, stopListening } = useVoiceRecognition('ar-MA', 10000);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      translation: { fr: fr || '', en: fr || '', ar: ar || '' },
      category: `roleplay_${personaId}`,
      illustration: { iconName: personaId === 'taxi' ? 'Car' : personaId === 'cafe' ? 'Coffee' : 'ShoppingBag' }
    });
    
    setToastMessage(rp.addedToSrs);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (isListening) stopListening();
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3EA] relative animate-in fade-in zoom-in-95 duration-200">
      
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1B2A4A] text-[#FDFCF8] border border-[#C9A05C]/40 px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-4">
          <Save className="w-4 h-4 text-[#C9A05C]" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-[#FDFCF8] px-4 py-3.5 flex items-center justify-between shadow-xs border-b border-[#E8E2D5] z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-[#E8E2D5]/50 text-[#7A7670] hover:text-[#1B2A4A] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="font-serif font-bold text-[#1B2A4A] flex items-center gap-2 text-base sm:text-lg">
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : '🏺'} {persona.name}
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
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : '🏺'}
            </div>
            <p className="text-[#1B2A4A] font-medium text-sm">L'agent est prêt. Envoyez "Salam" pour commencer !</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-sm flex items-center justify-between shadow-xs">
            <span>Erreur de communication avec l'agent.</span>
            <button onClick={() => reload()} className="flex items-center gap-1 font-bold hover:underline"><RefreshCw className="w-4 h-4"/> Réessayer</button>
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
    </div>
  );
}


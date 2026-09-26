'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { PersonaId, personas } from '@/lib/ai/prompts';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { Send, Mic, MicOff, Save, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { v4 as uuidv4 } from 'uuid';

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

  // Fallback (if tags missing)
  if (arIndex === -1 && arzIndex === -1 && frIndex === -1) {
    fr = content.trim();
  }
  
  return { ar, arz, fr };
};

export default function AiRoleplayView({ personaId, onClose }: AiRoleplayViewProps) {
  const persona = personas[personaId];
  const { addCustomWordToSRS } = useAppStore();
  const [showImmersion, setShowImmersion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload, error } = useChat({
    api: '/api/roleplay/chat',
    body: { personaId },
    initialMessages: [],
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
    
    setToastMessage("Expression ajoutée au carnet SRS !");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    if (isListening) stopListening();
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-in fade-in zoom-in-95 duration-200">
      
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-4">
          <Save className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : '🏺'} {persona.name}
            </h2>
            <p className="text-xs text-slate-500 line-clamp-1">{persona.context}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowImmersion(!showImmersion)}
          className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${showImmersion ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}
        >
          {showImmersion ? 'Immersion: ON' : 'Immersion: OFF'}
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-3xl">
              {personaId === 'taxi' ? '🚕' : personaId === 'cafe' ? '☕' : '🏺'}
            </div>
            <p className="text-slate-600 font-medium">L'agent est prêt. Envoyez "Salam" pour commencer !</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center justify-between">
            <span>Erreur de connexion avec l'agent.</span>
            <button onClick={() => reload()} className="flex items-center gap-1 hover:underline"><RefreshCw className="w-4 h-4"/> Réessayer</button>
          </div>
        )}

        {messages.map((m: Message) => {
          const isUser = m.role === 'user';
          const { ar, arz, fr } = isUser ? { ar: '', arz: '', fr: m.content } : parseAiMessage(m.content);

          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative group ${
                isUser 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 rounded-bl-none text-slate-800'
              }`}>
                
                {isUser ? (
                  <p className="text-sm font-medium">{m.content}</p>
                ) : (
                  <div className="space-y-2">
                    {ar && (
                      <p className="text-xl font-bold font-arabic text-right leading-relaxed" dir="rtl">
                        {ar}
                      </p>
                    )}
                    
                    {(!showImmersion || !ar) && (
                      <div className="pt-2 border-t border-slate-100 space-y-1 mt-2">
                        {arz && <p className="text-sm font-bold text-slate-700">{arz}</p>}
                        {fr && <p className="text-sm text-slate-500">{fr}</p>}
                      </div>
                    )}
                    
                    {/* Action Rapide : Sauvegarder dans SRS */}
                    <button 
                      onClick={() => handleSaveToSRS(ar, arz, fr)}
                      className="absolute -right-3 -top-3 bg-white border border-slate-200 text-indigo-500 rounded-full p-1.5 shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-indigo-50 hover:scale-110"
                      title="Sauvegarder dans mon carnet (SRS)"
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
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA OR COMPLETION */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-20">
        
        {messages.length >= 8 ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-bold text-emerald-600">Mission accomplie ! Vous avez tenu la conversation.</p>
            <button
              onClick={() => {
                useAppStore.getState().addXp(25);
                onClose();
              }}
              className="w-full max-w-sm py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Récupérer mes +25 XP et Quitter
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
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <input
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              value={input}
              onChange={handleInputChange}
              placeholder={isListening ? "Écoute en cours (parlez)..." : "Votre message en Darija ou Français..."}
              disabled={isLoading && !isListening}
            />
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-md"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </form>
        )}
      </div>
      
    </div>
  );
}

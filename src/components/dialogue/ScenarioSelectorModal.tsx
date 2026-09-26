import React, { useState } from 'react';
import { PersonaId, personas } from '../../lib/ai/prompts';
import { X, Play, MapPin, Lock, Sparkles, WifiOff, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNetwork } from '../../hooks/useNetwork';

interface ScenarioSelectorModalProps {
  onClose: () => void;
  onSelectAi?: (personaId: PersonaId) => void;
  onRequirePremium: () => void;
  onStartSrs?: () => void; // Optional prop to trigger SRS
}

export default function ScenarioSelectorModal({ onClose, onSelectAi, onRequirePremium, onStartSrs }: ScenarioSelectorModalProps) {
  const { subscriptionTier } = useAppStore();
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const isOnline = useNetwork();
  
  const [offlineAlertPersona, setOfflineAlertPersona] = useState<PersonaId | null>(null);

  const getCategoryIcon = (id: PersonaId) => {
    switch(id) {
      case 'taxi': return '🚕';
      case 'cafe': return '☕';
      case 'souk': return '🛒';
      default: return '👋';
    }
  };

  const getCategoryColor = (id: PersonaId) => {
    switch(id) {
      case 'taxi': return 'bg-amber-100 text-amber-700';
      case 'cafe': return 'bg-orange-100 text-orange-700';
      case 'souk': return 'bg-rose-100 text-rose-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const modalTitle = isAr ? 'المواقف والمحادثات مع الذكاء الاصطناعي' : lang === 'en' ? 'AI Roleplay Situations' : 'Mises en situation IA';
  const modalDesc = isAr ? 'تدرّب مع شخصيات تفاعلية' : lang === 'en' ? 'Practice with interactive AI characters' : 'Pratiquez avec des personnages IA interactifs';

  const aiPersonasList = Object.values(personas);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative">
          {!isOnline && (
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
          )}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              {modalTitle}
            </h2>
            <p className="text-indigo-100 text-sm mt-1 flex items-center gap-2">
              {modalDesc}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 relative">
          
          {offlineAlertPersona && !isOnline && (
            <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <WifiOff className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {isAr ? 'يلزم الاتصال بالإنترنت' : lang === 'en' ? 'Internet Connection Required' : 'Connexion Internet Requise'}
              </h3>
              <p className="text-slate-600 mb-6 max-w-md">
                {isAr 
                  ? 'المحادثات الحرة مع الذكاء الاصطناعي تتطلب شبكة. في غضون ذلك، تعمل وحداتك الأربعة وبطاقات المراجعة بنسبة 100٪ بدون اتصال!'
                  : lang === 'en'
                    ? 'Interactive AI roleplay requires an internet connection. Meanwhile, your 4 modules and spaced repetition cards work 100% offline!'
                    : 'Les conversations libres avec l\'IA nécessitent une connexion réseau. En attendant, vos 4 modules de cours et vos cartes de révision espacée sont 100 % opérationnels hors-ligne !'}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOfflineAlertPersona(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {isAr ? 'رجوع' : lang === 'en' ? 'Back' : 'Retour'}
                </button>
                {onStartSrs && (
                  <button 
                    onClick={() => {
                      setOfflineAlertPersona(null);
                      onStartSrs();
                    }}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    {isAr ? 'بدء المراجعة' : lang === 'en' ? 'Start SRS Review' : 'Lancer une révision SRS'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPersonasList.map((persona, index) => {
              const isLocked = subscriptionTier === 'free' && index > 0; // Only first one is free
              
              const handleCardClick = () => {
                if (!isOnline) {
                  setOfflineAlertPersona(persona.id);
                  return;
                }
                if (isLocked) {
                  onRequirePremium();
                } else if (onSelectAi) {
                  onSelectAi(persona.id);
                }
              };

              return (
              <div 
                key={persona.id} 
                onClick={handleCardClick}
                className={`bg-white rounded-2xl border border-slate-200 p-5 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden 
                  ${isLocked ? 'opacity-80' : ''} 
                  ${!isOnline ? 'opacity-60 grayscale-[30%] hover:border-slate-300' : 'hover:border-purple-300 hover:shadow-md'}
                `}
              >
                <div className={`absolute top-0 ${isAr ? 'left-0 rounded-tl-2xl' : 'right-0 rounded-tr-2xl'} w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent opacity-50 pointer-events-none`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(persona.id)}`}>
                    {getCategoryIcon(persona.id)}
                  </div>
                  
                  {!isOnline ? (
                    <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide flex items-center gap-1 border border-slate-200">
                      <WifiOff className="w-3 h-3" /> {isAr ? 'يتطلب إنترنت' : lang === 'en' ? 'Requires Internet' : 'Requiert Internet'}
                    </div>
                  ) : (
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide flex items-center gap-1 border border-purple-200">
                      <Sparkles className="w-3 h-3" /> {isAr ? 'تفاعلي' : lang === 'en' ? 'Interactive AI' : 'IA Interactif'}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {persona.name}
                </h3>
                
                <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                  {persona.context}
                </p>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 mt-auto">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{persona.id === 'taxi' ? 'Fès' : persona.id === 'souk' ? 'Médina' : 'Café'}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${!isOnline 
                      ? 'bg-slate-100 text-slate-400' 
                      : isLocked 
                        ? 'bg-amber-100 text-amber-600' 
                        : 'bg-slate-100 group-hover:bg-purple-600 group-hover:text-white text-slate-400'
                    }`}
                  >
                    {!isOnline ? <WifiOff className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : <Play className={`w-4 h-4 ${isAr ? 'mr-0.5 transform rotate-180' : 'ml-0.5'}`} />}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

      </div>
    </div>
  );
}

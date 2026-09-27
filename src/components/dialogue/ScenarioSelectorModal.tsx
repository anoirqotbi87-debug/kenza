import React, { useState } from 'react';
import { PersonaId, personas } from '../../lib/ai/prompts';
import { X, Play, MapPin, Lock, Sparkles, WifiOff, BookOpen, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNetwork } from '../../hooks/useNetwork';

interface ScenarioSelectorModalProps {
  onClose: () => void;
  onSelectAi?: (personaId: PersonaId) => void;
  onRequirePremium: () => void;
  onStartSrs?: () => void;
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

  const modalTitle = isAr ? 'المواقف والمحادثات مع الذكاء الاصطناعي' : lang === 'en' ? 'AI Roleplay Situations' : 'Mises en situation IA';
  const modalDesc = isAr ? 'تدرّب مع شخصيات تفاعلية' : lang === 'en' ? 'Practice with interactive AI characters' : 'Pratiquez avec des personnages marocains immersifs';

  const aiPersonasList = Object.values(personas);

  return (
    <div className="fixed inset-0 z-50 bg-[#1B2A4A]/60 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#FDFCF8] rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#E8E2D5] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-[#1B2A4A] bg-[#1B2A4A] text-[#FDFCF8] relative">
          <div>
            <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase mb-1">
              <span>—</span>
              <span>Immersion Active</span>
            </div>
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A05C]" />
              {modalTitle}
            </h2>
            <p className="text-[#E8E2D5]/80 text-xs mt-0.5">
              {modalDesc}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-[#E8E2D5] hover:text-[#FDFCF8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F7F3EA] relative">
          
          {offlineAlertPersona && !isOnline && (
            <div className="absolute inset-0 z-20 bg-[#FDFCF8]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-[#C9A05C]/15 text-[#C9A05C] rounded-full flex items-center justify-center mb-4">
                <WifiOff className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1B2A4A] mb-2">
                {isAr ? 'يلزم الاتصال بالإنترنت' : lang === 'en' ? 'Internet Connection Required' : 'Connexion Internet Requise'}
              </h3>
              <p className="text-xs text-[#7A7670] mb-6 max-w-md leading-relaxed">
                {isAr 
                  ? 'المحادثات الحرة مع الذكاء الاصطناعي تتطلب شبكة. في غضون ذلك، تعمل وحداتك الأربعة وبطاقات المراجعة بنسبة 100٪ بدون اتصال!'
                  : lang === 'en'
                    ? 'Interactive AI roleplay requires an internet connection. Meanwhile, your curriculum modules and review cards work 100% offline!'
                    : 'Les conversations libres avec l\'IA nécessitent une connexion réseau. En attendant, vos modules de cours et vos cartes de révision espacée sont 100 % opérationnels hors-ligne !'}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOfflineAlertPersona(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#7A7670] bg-[#FDFCF8] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50 transition-colors"
                >
                  {isAr ? 'رجوع' : lang === 'en' ? 'Back' : 'Retour'}
                </button>
                {onStartSrs && (
                  <button 
                    onClick={() => {
                      setOfflineAlertPersona(null);
                      onStartSrs();
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1B2A4A] bg-[#C9A05C] hover:bg-[#b88f4b] transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isAr ? 'بدء المراجعة' : lang === 'en' ? 'Start SRS Review' : 'Lancer une révision SRS'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPersonasList.map((persona, index) => {
              const isLocked = subscriptionTier === 'free' && index > 0;
              
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
                  className={`bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-5 transition-all cursor-pointer group flex flex-col justify-between relative shadow-xs hover:border-[#C9A05C] hover:shadow-md ${
                    isLocked ? 'opacity-80' : ''
                  } ${!isOnline ? 'opacity-60' : ''}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-3xl w-12 h-12 rounded-2xl bg-[#F7F3EA] border border-[#E8E2D5] flex items-center justify-center">
                        {getCategoryIcon(persona.id)}
                      </div>
                      
                      {!isOnline ? (
                        <div className="bg-[#E8E2D5]/60 text-[#7A7670] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <WifiOff className="w-3 h-3" /> Hors-ligne
                        </div>
                      ) : isLocked ? (
                        <div className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Premium
                        </div>
                      ) : (
                        <div className="bg-[#7A9174]/15 text-[#7A9174] border border-[#7A9174]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Actif
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1B2A4A] mb-1 leading-snug">
                      {persona.name}
                    </h3>
                    
                    <p className="text-xs text-[#7A7670] line-clamp-2 leading-relaxed">
                      {persona.context}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#E8E2D5]/60 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-[#7A7670]">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A05C]" />
                      <span className="font-medium">{persona.id === 'taxi' ? 'Fès Médina' : persona.id === 'souk' ? 'Grand Souk' : 'Café Populaire'}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors shadow-xs">
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { PersonaId, personas } from '../../lib/ai/prompts';
import { X, Play, MapPin, Tag, Lock, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

interface ScenarioSelectorModalProps {
  onClose: () => void;
  onSelectAi?: (personaId: PersonaId) => void;
  onRequirePremium: () => void;
}

export default function ScenarioSelectorModal({ onClose, onSelectAi, onRequirePremium }: ScenarioSelectorModalProps) {
  const { subscriptionTier } = useAppStore();
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');
  
  const getCategoryIcon = (id: PersonaId) => {
    switch(id) {
      case 'taxi': return '🚕';
      case 'cafe': return '☕';
      case 'souk': return '🏺';
      default: return '💬';
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

  const modalTitle = isAr ? 'المواقف والمحادثات الذكية' : lang === 'en' ? 'AI Roleplay Situations' : 'Mises en situation IA';
  const modalDesc = isAr ? 'تدرّب مع شخصيات ذكية تفاعلية' : lang === 'en' ? 'Practice with interactive AI characters' : 'Pratiquez avec des personnages IA interactifs';

  const aiPersonasList = Object.values(personas);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              {modalTitle}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">{modalDesc}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPersonasList.map((persona, index) => {
              const isLocked = subscriptionTier === 'free' && index > 0; // Only first one is free
              return (
              <div 
                key={persona.id} 
                onClick={() => {
                  if (isLocked) {
                    onRequirePremium();
                  } else if (onSelectAi) {
                    onSelectAi(persona.id);
                  }
                }}
                className={`bg-white rounded-2xl border border-slate-200 p-5 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden ${isLocked ? 'opacity-80' : ''}`}
              >
                <div className={`absolute top-0 ${isAr ? 'left-0 rounded-tl-2xl' : 'right-0 rounded-tr-2xl'} w-32 h-32 bg-gradient-to-bl from-purple-50 to-transparent opacity-50 pointer-events-none`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(persona.id)}`}>
                    {getCategoryIcon(persona.id)}
                  </div>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> IA
                  </div>
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

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    Interactif
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${isLocked 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-slate-100 group-hover:bg-purple-600 group-hover:text-white text-slate-400'
                    }`}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Play className={`w-4 h-4 ${isAr ? 'mr-0.5 transform rotate-180' : 'ml-0.5'}`} />}
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

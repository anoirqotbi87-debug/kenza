import React from 'react';
import { ALL_SCENARIOS } from '../../data/scenarios';
import { DialogueScenario } from '../../types/dialogue';
import { X, Play, MapPin, Tag, Lock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ScenarioSelectorModalProps {
  onClose: () => void;
  onSelect: (scenario: DialogueScenario) => void;
  onRequirePremium: () => void;
}

export default function ScenarioSelectorModal({ onClose, onSelect, onRequirePremium }: ScenarioSelectorModalProps) {
  const { subscriptionTier } = useAppStore();
  
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'transport': return '🚕';
      case 'restaurant': return '☕';
      case 'souk': return '🏺';
      default: return '💬';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'transport': return 'bg-amber-100 text-amber-700';
      case 'restaurant': return 'bg-orange-100 text-orange-700';
      case 'souk': return 'bg-rose-100 text-rose-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mises en situation (Roleplay)</h2>
            <p className="text-slate-500 text-sm mt-1">Pratiquez la Darija avec des scénarios interactifs</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_SCENARIOS.map((scenario, index) => {
              const isLocked = subscriptionTier === 'free' && (scenario.tier === 'premium' || index > 0);
              return (
              <div 
                key={scenario.id} 
                onClick={() => isLocked ? onRequirePremium() : onSelect(scenario)}
                className={`bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden ${isLocked ? 'opacity-80' : ''}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent opacity-50 pointer-events-none rounded-tr-2xl" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`text-3xl w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(scenario.category || 'daily')}`}>
                    {getCategoryIcon(scenario.category || 'daily')}
                  </div>
                  <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {scenario.level}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                  {scenario.title}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{scenario.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                    <Tag className="w-3 h-3" />
                    +25 XP
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${isLocked 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-400'
                    }`}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
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

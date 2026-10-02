import React, { useState } from 'react';
import { PersonaId, personas } from '../../lib/ai/prompts';
import { X, Play, MapPin, Lock, Sparkles, WifiOff, BookOpen, ArrowRight, GraduationCap, Table2, Mic, Layers } from 'lucide-react';
import { ALL_SCENARIOS } from '../../data/scenarios';
import type { DialogueScenario } from '../../types/dialogue';
import DialogueView from './DialogueView';
import Link from 'next/link';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { useNetwork } from '../../hooks/useNetwork';

interface ScenarioSelectorModalProps {
  onClose: () => void;
  onSelectAi?: (personaId: PersonaId) => void;
  onRequirePremium: () => void;
  onStartSrs?: () => void;
}

export default function ScenarioSelectorModal({ onClose, onSelectAi, onRequirePremium, onStartSrs }: ScenarioSelectorModalProps) {
  const { isPremium } = useAppStore();
  const { t } = useTranslation();
  const sc = t.modules.scenario;
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const isOnline = useNetwork();
  
  const [offlineAlertPersona, setOfflineAlertPersona] = useState<PersonaId | null>(null);
  const [activeScenario, setActiveScenario] = useState<DialogueScenario | null>(null);

  const getCategoryIcon = (id: PersonaId) => {
    switch(id) {
      case 'taxi': return '🚕';
      case 'cafe': return '☕';
      case 'souk': return '🛒';
      default: return '👋';
    }
  };

  const modalTitle = sc.modalTitle;
  const modalDesc = sc.subtitle;

  const aiPersonasList = Object.values(personas);

  const dialoguesTitle = sc.dialoguesTitle;
  const dialoguesDesc = sc.dialoguesDesc;
  const exploreTitle = sc.exploreMore;

  const scenarioCategoryIcon = (category?: string) => {
    switch (category) {
      case 'transport': return '🚕';
      case 'food': case 'cafe': return '☕';
      case 'shopping': case 'souk': return '🛒';
      case 'health': return '🩺';
      case 'housing': return '🏠';
      default: return '🗣️';
    }
  };

  const handleScenarioClick = (scenario: DialogueScenario) => {
    if (scenario.tier === 'premium' && !isPremium) {
      onRequirePremium();
      return;
    }
    setActiveScenario(scenario as DialogueScenario);
  };

  const explorerLinks = [
    { href: '/etudier', icon: GraduationCap, label: sc.fullPath },
    { href: '/grammaire', icon: Table2, label: sc.grammar },
    { href: '/parler', icon: Mic, label: sc.pronunciation },
    { href: '/revisions', icon: Layers, label: sc.revisions },
  ];

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
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A05C]" />
              {modalTitle}
            </h2>
            <p className="text-[#E8E2D5]/80 text-xs mt-0.5">
              {modalDesc}
            </p>
          </div>
          <button 
          aria-label={t.common.close}
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
              <h3 className="font-display text-xl font-bold text-[#1B2A4A] mb-2">
                {sc.internetRequired}
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
                  {sc.back}
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
                    <span>{sc.launchSrs}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPersonasList.map((persona, index) => {
              const isLocked = !isPremium && index > 0;
              
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

                    <h3 className="font-display text-lg font-bold text-[#1B2A4A] mb-1 leading-snug">
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

          {/* Section 2 : Dialogues scénarisés — situations réelles */}
          <div className="mt-8">
            <div className="mb-3">
              <h3 className="font-display text-lg font-bold text-[#1B2A4A]">{dialoguesTitle}</h3>
              <p className="text-xs text-[#7A7670] mt-0.5">{dialoguesDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_SCENARIOS.map((scenario) => {
                const s = scenario;
                const isLocked = s.tier === 'premium' && !isPremium;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleScenarioClick(s)}
                    className={`bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-5 transition-all cursor-pointer group flex flex-col justify-between relative shadow-xs hover:border-[#C9A05C] hover:shadow-md ${isLocked ? 'opacity-80' : ''}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-3xl w-12 h-12 rounded-2xl bg-[#F7F3EA] border border-[#E8E2D5] flex items-center justify-center">
                          {scenarioCategoryIcon(s.category)}
                        </div>
                        {isLocked ? (
                          <div className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Kenza Pro
                          </div>
                        ) : (
                          <div className="bg-[#7A9174]/15 text-[#7A9174] border border-[#7A9174]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {s.level || 'A1'}
                          </div>
                        )}
                      </div>
                      <h4 className="font-display text-base font-bold text-[#1B2A4A] mb-1 leading-snug">{s.title}</h4>
                      <p className="text-xs text-[#7A7670] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A05C]" />
                        <span>{s.location} · {s.turns?.length || 0} tours</span>
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#E8E2D5]/60 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors shadow-xs">
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3 : Explorer plus */}
          <div className="mt-8">
            <h3 className="font-display text-lg font-bold text-[#1B2A4A] mb-3">{exploreTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {explorerLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 bg-[#1B2A4A] text-[#FDFCF8] rounded-2xl px-5 py-4 text-sm font-bold hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1">{label}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Vue plein écran du dialogue scénarisé */}
      {activeScenario && (
        <DialogueView scenario={activeScenario} onExit={() => setActiveScenario(null)} />
      )}
    </div>
  );
}

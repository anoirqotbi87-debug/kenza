'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import PronunciationTrainer from '@/components/audio/PronunciationTrainer';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowRight, Lock, MapPin, MessageSquare, Play, Sparkles } from 'lucide-react';
import { ALL_SCENARIOS } from '@/data/scenarios';
import type { DialogueScenario } from '@/types/dialogue';
import DialogueView from '@/components/dialogue/DialogueView';
import PaywallModal from '@/components/monetization/PaywallModal';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function ParlerPage() {
  const { uiLanguage, isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'trainer' | 'dialogue'>('trainer');
  const [activeScenario, setActiveScenario] = useState<DialogueScenario | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const tp = t.pages.parler;

  const getCategoryLabel = (category?: DialogueScenario['category']) => {
    switch (category) {
      case 'transport': return 'Transport';
      case 'restaurant': return 'Café & restauration';
      case 'souk': return 'Au souk';
      case 'daily': return 'Vie quotidienne';
      default: return 'Conversation';
    }
  };

  const startScenario = (scenario: DialogueScenario) => {
    if (scenario.tier === 'premium' && !isPremiumReady) return;
    if (scenario.tier === 'premium' && !isPremium) {
      setShowPaywall(true);
      return;
    }
    setActiveScenario(scenario);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA] pb-16">
      <PageHeader
        badge={tp.badge || 'Pratique Orale'}
        title={tp.title || 'Entraînement de prononciation'}
      />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Mode Selector */}
        <div className="flex bg-[#FDFCF8] rounded-full p-1.5 shadow-xs border border-[#E8E2D5] max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setActiveMode('trainer')}
            className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeMode === 'trainer'
                ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
                : 'text-[#7A7670] hover:text-[#1B2A4A]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A05C]" />
            <span>Atelier Phonèmes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('dialogue')}
            className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              activeMode === 'dialogue'
                ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
                : 'text-[#7A7670] hover:text-[#1B2A4A]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#C9A05C]" />
            <span>Dialogues & Mises en situation</span>
          </button>
        </div>

        {activeMode === 'trainer' ? (
          <PronunciationTrainer />
        ) : (
          <section className="bg-[#FDFCF8] rounded-3xl p-5 sm:p-7 shadow-xs border border-[#E8E2D5] space-y-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
                {t.modules.scenario.dialoguesTitle || 'Dialogues scénarisés'}
              </h2>
              <p className="text-sm text-[#7A7670] mt-1">
                {t.modules.scenario.dialoguesDesc || 'Entraînez-vous dans des situations marocaines réelles.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_SCENARIOS.map((scenario) => {
                const locked = scenario.tier === 'premium' && (!isPremiumReady || !isPremium);
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => startScenario(scenario)}
                    disabled={scenario.tier === 'premium' && !isPremiumReady}
                    className="text-left bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl p-4 hover:border-[#C9A05C] disabled:cursor-wait transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#1B2A4A]">{scenario.titleFr || scenario.title}</p>
                        <p className="text-xs text-[#7A7670] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C9A05C]" />
                          {scenario.location} · {scenario.turns.length} {scenario.turns.length === 1 ? 'tour' : 'tours'}
                        </p>
                        <p className="text-[10px] text-[#7A7670] mt-2">{scenario.level || 'A1'} · {scenario.npcRole || 'Dialogue guidé'}</p>
                      </div>
                      {locked ? (
                        <span className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3" /> Kenza Pro
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center shrink-0 group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors">
                          <Play className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#E8E2D5] text-xs font-semibold text-[#7A7670] flex items-center justify-between">
                      <span>{getCategoryLabel(scenario.category)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A05C]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>
      {activeScenario && (
        <DialogueView scenario={activeScenario} onExit={() => setActiveScenario(null)} />
      )}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} source="module_locked" />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ArrowRight, Lock, MapPin, MessageSquare, Play, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import PronunciationTrainer from '@/components/audio/PronunciationTrainer';
import { ALL_SCENARIOS } from '@/data/scenarios';
import type { DialogueScenario } from '@/types/dialogue';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface PathSpeakingSectionProps {
  onStartScenario: (scenario: DialogueScenario) => void;
  onOpenPaywall: () => void;
  onOpenArabiziModal?: () => void;
}

export default function PathSpeakingSection({
  onStartScenario,
  onOpenPaywall,
  onOpenArabiziModal,
}: PathSpeakingSectionProps) {
  const { isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'trainer' | 'dialogue'>('trainer');

  const getCategoryLabel = (category?: DialogueScenario['category']) => {
    switch (category) {
      case 'transport':
        return 'Transport';
      case 'restaurant':
        return 'Café & restauration';
      case 'souk':
        return 'Au souk';
      case 'daily':
        return 'Vie quotidienne';
      default:
        return 'Conversation';
    }
  };

  const handleScenarioClick = (scenario: DialogueScenario) => {
    if (scenario.tier === 'premium' && !isPremiumReady) return;
    if (scenario.tier === 'premium' && !isPremium) {
      onOpenPaywall();
      return;
    }
    onStartScenario(scenario);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Mode Selector */}
      <div className="flex bg-[#FDFCF8] rounded-full p-1.5 shadow-xs border border-[#E8E2D5] max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setActiveMode('trainer')}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeMode === 'trainer'
              ? 'bg-[#142943] text-white shadow-xs'
              : 'text-[#6B7174] hover:text-[#142943]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D69B47]" />
          <span>Atelier Phonèmes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('dialogue')}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeMode === 'dialogue'
              ? 'bg-[#142943] text-white shadow-xs'
              : 'text-[#6B7174] hover:text-[#142943]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#D69B47]" />
          <span>Dialogues</span>
        </button>
      </div>

      {activeMode === 'trainer' ? (
        <div className="space-y-4">
          {onOpenArabiziModal && (
            <button
              type="button"
              onClick={onOpenArabiziModal}
              className="w-full text-left bg-white/80 border border-dashed border-[#D69B47]/60 hover:border-[#D69B47] hover:bg-[#F5E7C8]/20 rounded-2xl px-5 py-3.5 flex items-center gap-3 transition-colors group shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F5E7C8] text-[#8C6D23] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <Sparkles className="w-4 h-4 text-[#D69B47]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#142943]">💡 La Clé des Chiffres Arabizi</p>
                <p className="text-xs text-[#6B7174] mt-0.5">
                  2 · 3 · 5 · 7 · 9 — le décodeur audio interactif des sons gutturaux marocains.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#D69B47] shrink-0" />
            </button>
          )}
          <PronunciationTrainer />
        </div>
      ) : (
        <section className="bg-[#FDFCF8] rounded-3xl p-5 sm:p-7 shadow-xs border border-[#E8E2D5] space-y-5">
          <div>
            <h3 className="font-display text-xl font-bold text-[#142943]">
              {t.modules.scenario.dialoguesTitle || 'Dialogues scénarisés'}
            </h3>
            <p className="text-sm text-[#6B7174] mt-1">
              {t.modules.scenario.dialoguesDesc ||
                'Entraînez-vous dans des situations marocaines réelles.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_SCENARIOS.map((scenario) => {
              const locked =
                scenario.tier === 'premium' && (!isPremiumReady || !isPremium);
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleScenarioClick(scenario)}
                  disabled={scenario.tier === 'premium' && !isPremiumReady}
                  className="text-left bg-[#F7F5EF] border border-[#E8E2D5] rounded-2xl p-4 hover:border-[#D69B47] disabled:cursor-wait transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#142943]">
                        {scenario.titleFr || scenario.title}
                      </p>
                      <p className="text-xs text-[#6B7174] mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D69B47]" />
                        {scenario.location} · {scenario.turns.length}{' '}
                        {scenario.turns.length === 1 ? 'tour' : 'tours'}
                      </p>
                      <p className="text-[10px] text-[#6B7174] mt-2">
                        {scenario.level || 'A1'} · {scenario.npcRole || 'Dialogue guidé'}
                      </p>
                    </div>
                    {locked ? (
                      <span className="bg-[#F5E7C8] text-[#8C6D23] border border-[#D69B47]/40 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Lock className="w-3 h-3 text-[#D69B47]" /> Kenza Pro
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#142943] text-[#FFFEFA] flex items-center justify-center shrink-0 group-hover:bg-[#D69B47] group-hover:text-[#142943] transition-colors">
                        <Play className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#E8E2D5] text-xs font-semibold text-[#6B7174] flex items-center justify-between">
                    <span>{getCategoryLabel(scenario.category)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D69B47]" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

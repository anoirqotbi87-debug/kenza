'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import SpeechTrainer from '@/components/audio/SpeechTrainer';
import PronunciationTrainer from '@/components/audio/PronunciationTrainer';
import PageHeader from '@/components/ui/PageHeader';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function ParlerPage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'trainer' | 'dialogue'>('trainer');

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const tp = t.pages.parler;

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
          <SpeechTrainer />
        )}
      </main>
    </div>
  );
}

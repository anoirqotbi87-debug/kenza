'use client';

import React from 'react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import SpeechTrainer from '@/components/audio/SpeechTrainer';
import PageHeader from '@/components/ui/PageHeader';

export default function ParlerPage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const tp = t.pages.parler;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Pratique Orale'}
        title={tp.title || 'Entraînement de prononciation'}
      />
      <main className="max-w-4xl mx-auto p-6">
        <SpeechTrainer />
      </main>
    </div>
  );
}

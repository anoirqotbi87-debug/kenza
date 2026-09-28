'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import SpeechTrainer from '@/components/audio/SpeechTrainer';

export default function ParlerPage() {
  const { uiLanguage } = useAppStore();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <header className="bg-[#1B2A4A] text-[#FDFCF8] px-6 py-5 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Retour">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">Pratique Orale</p>
          <h1 className="font-serif text-2xl font-bold">
            {isAr ? 'تدريب النطق' : lang === 'en' ? 'Pronunciation Trainer' : 'Entraînement de prononciation'}
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <SpeechTrainer />
      </main>
    </div>
  );
}

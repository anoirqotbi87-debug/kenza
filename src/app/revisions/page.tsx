'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Flame, Award, Trophy } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import SRSDashboard from '@/components/srs/SRSDashboard';
import DeckManagerView from '@/components/srs/DeckManagerView';
import Leaderboard from '@/components/gamification/Leaderboard';
import StreakHeatmap from '@/components/gamification/StreakHeatmap';
import BadgesList from '@/components/gamification/BadgesList';

type Tab = 'srs' | 'decks' | 'gamification';

export default function RevisionsPage() {
  const { uiLanguage } = useAppStore();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const [tab, setTab] = useState<Tab>('srs');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'srs', label: isAr ? 'المراجعة الذكية' : lang === 'en' ? 'Smart Review' : 'Révision intelligente', icon: Layers },
    { id: 'decks', label: isAr ? 'بطاقاتي' : lang === 'en' ? 'My Card Decks' : 'Mes paquets de cartes', icon: Flame },
    { id: 'gamification', label: isAr ? 'التقدم والأوسمة' : lang === 'en' ? 'Progress & Badges' : 'Progression & Badges', icon: Trophy },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <header className="bg-[#1B2A4A] text-[#FDFCF8] px-6 py-5 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Retour">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">Révisions & Progression</p>
          <h1 className="font-serif text-2xl font-bold">
            {isAr ? 'المراجعات والبطاقات' : lang === 'en' ? 'Reviews & Card Decks' : 'Révisions & Paquets de cartes'}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-6 flex gap-2 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              tab === id ? 'bg-[#1B2A4A] text-[#FDFCF8]' : 'bg-[#FDFCF8] text-[#1B2A4A] border border-[#E8E2D5] hover:border-[#C9A05C]'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {tab === 'srs' && <SRSDashboard />}
        {tab === 'decks' && <DeckManagerView />}
        {tab === 'gamification' && (
          <div className="space-y-6">
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C9A05C]" /> {isAr ? 'خريطة النشاط' : lang === 'en' ? 'Activity Map' : 'Carte d’activité'}
              </h2>
              <StreakHeatmap />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C9A05C]" /> {isAr ? 'أوسمتي' : lang === 'en' ? 'My Badges' : 'Mes badges'}
              </h2>
              <BadgesList />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#C9A05C]" /> {isAr ? 'الترتيب الأسبوعي' : lang === 'en' ? 'Weekly League' : 'Ligues hebdomadaires'}
              </h2>
              <Leaderboard />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

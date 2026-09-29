'use client';

import React, { useState } from 'react';
import { Layers, Flame, Award, Trophy } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import SRSDashboard from '@/components/srs/SRSDashboard';
import DeckManagerView from '@/components/srs/DeckManagerView';
import Leaderboard from '@/components/gamification/Leaderboard';
import StreakHeatmap from '@/components/gamification/StreakHeatmap';
import BadgesList from '@/components/gamification/BadgesList';
import PageHeader from '@/components/ui/PageHeader';

type Tab = 'srs' | 'decks' | 'gamification';

export default function RevisionsPage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const [tab, setTab] = useState<Tab>('srs');

  const tp = (t as any).pages?.revisions || {};

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'srs', label: tp.tabSrs || 'Révision intelligente', icon: Layers },
    { id: 'decks', label: tp.tabDecks || 'Mes paquets de cartes', icon: Flame },
    { id: 'gamification', label: tp.tabGamification || 'Progression & Badges', icon: Trophy },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Révisions & Progression'}
        title={tp.title || 'Révisions & Paquets de cartes'}
      />

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
                <Flame className="w-5 h-5 text-[#C9A05C]" /> {tp.activityMap || "Carte d'activité"}
              </h2>
              <StreakHeatmap />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C9A05C]" /> {tp.myBadges || 'Mes badges'}
              </h2>
              <BadgesList />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-serif text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#C9A05C]" /> {tp.weeklyLeague || 'Ligues hebdomadaires'}
              </h2>
              <Leaderboard />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

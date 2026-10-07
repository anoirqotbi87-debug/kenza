'use client';

import React, { useState } from 'react';
import { Layers, Flame, Award, Trophy } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import type { LucideIcon } from 'lucide-react';
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

  const tp = t.pages.revisions;

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        <div
          role="tablist"
          aria-label={tp.badge || 'Sections de révision'}
          className="grid grid-cols-3 gap-1.5 p-1 bg-[#FDFCF8] border border-[#E8E2D5] rounded-2xl shadow-xs"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex items-center justify-center gap-1.5 px-1 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all min-w-0 ${
                tab === id
                  ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-sm'
                  : 'text-[#7A7670] hover:text-[#1B2A4A] hover:bg-[#F7F3EA]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${tab === id ? 'text-[#C9A05C]' : ''}`} />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {tab === 'srs' && <SRSDashboard />}
        {tab === 'decks' && <DeckManagerView />}
        {tab === 'gamification' && (
          <div className="space-y-6">
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C9A05C]" /> {tp.activityMap || "Carte d'activité"}
              </h2>
              <StreakHeatmap />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C9A05C]" /> {tp.myBadges || 'Mes badges'}
              </h2>
              <BadgesList />
            </section>
            <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
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

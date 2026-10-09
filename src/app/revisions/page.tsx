'use client';

import React, { useState } from 'react';
import { Flame, Award, Trophy } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import SRSDashboard from '@/components/srs/SRSDashboard';
import DeckManagerView from '@/components/srs/DeckManagerView';
import Leaderboard from '@/components/gamification/Leaderboard';
import StreakHeatmap from '@/components/gamification/StreakHeatmap';
import BadgesList from '@/components/gamification/BadgesList';
import PageHeader from '@/components/ui/PageHeader';
import BottomNav from '@/components/navigation/BottomNav';

type Tab = 'smart' | 'decks' | 'badges';

export default function RevisionsPage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const [tab, setTab] = useState<Tab>('smart');

  const tp = t.pages.revisions;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Révisions & Progression'}
        title={tp.title || 'Révisions & Paquets de cartes'}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('smart')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'smart' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Révision
          </button>
          <button
            type="button"
            onClick={() => setTab('decks')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'decks' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mes paquets
          </button>
          <button
            type="button"
            onClick={() => setTab('badges')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'badges' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Badges
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        {tab === 'smart' && <SRSDashboard />}
        {tab === 'decks' && <DeckManagerView />}
        {tab === 'badges' && (
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

      <BottomNav />
    </div>
  );
}

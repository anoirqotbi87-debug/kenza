'use client';

import React, { useState } from 'react';
import { Flame, Award, Trophy, Mic, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import SRSDashboard from '@/components/srs/SRSDashboard';
import { MemoryHealthWidget } from '@/components/srs/MemoryHealthWidget';
import { DailyQuestsWidget } from '@/components/quests/DailyQuestsWidget';
import DeckManagerView from '@/components/srs/DeckManagerView';
import Leaderboard from '@/components/gamification/Leaderboard';
import StreakHeatmap from '@/components/gamification/StreakHeatmap';
import BadgesList from '@/components/gamification/BadgesList';
import PageHeader from '@/components/ui/PageHeader';
import BottomNav from '@/components/navigation/BottomNav';
import VoiceSrsSession from '@/components/srs/VoiceSrsSession';

type Tab = 'smart' | 'decks' | 'badges';

export default function RevisionsPage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const [tab, setTab] = useState<Tab>('smart');
  const [showVoiceSrs, setShowVoiceSrs] = useState(false);

  const tp = t.pages.revisions;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Révisions & Progression'}
        title={tp.title || 'Révisions & Paquets de cartes'}
        backHref="/?view=path&tab=revision"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FDFCF8] border border-[#E8E2D5] rounded-xl mb-4 text-xs font-medium shadow-xs">
          <button
            type="button"
            onClick={() => setTab('smart')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'smart' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-[#7A7670] hover:text-[#142943]'}`}
          >
            {tp?.tabSrs || (isAr ? 'مراجعة' : lang === 'es' ? 'Repaso' : lang === 'en' ? 'Review' : 'Révision')}
          </button>
          <button
            type="button"
            onClick={() => setTab('decks')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'decks' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-[#7A7670] hover:text-[#142943]'}`}
          >
            {tp?.tabDecks || (isAr ? 'حزمي' : lang === 'es' ? 'Mis mazos' : lang === 'en' ? 'My decks' : 'Mes paquets')}
          </button>
          <button
            type="button"
            onClick={() => setTab('badges')}
            className={`py-2 px-1 text-center rounded-lg transition-all truncate ${tab === 'badges' ? 'bg-[#142943] text-white shadow-sm font-semibold' : 'text-[#7A7670] hover:text-[#142943]'}`}
          >
            {tp?.tabGamification || (isAr ? 'أوسمتي' : lang === 'es' ? 'Insignias' : lang === 'en' ? 'Badges' : 'Badges')}
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        {tab === 'smart' && (
          <div className="space-y-6">
            {/* Atelier Vocal SM-2 */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-800/40 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Atelier Vocal SM-2</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base">Révision Espacée Vocale</h3>
                <p className="text-xs text-amber-100">Prononcez vos cartes au micro pour recalibrer vos intervalles de mémorisation.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVoiceSrs(true)}
                className="shrink-0 px-4 py-2.5 bg-white text-amber-800 hover:bg-amber-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 active:scale-95"
              >
                <Mic className="w-4 h-4 text-amber-600" />
                <span>Pratiquer au micro</span>
              </button>
            </div>

            <DailyQuestsWidget />
            <MemoryHealthWidget />
            <SRSDashboard />
          </div>
        )}
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

      {showVoiceSrs && <VoiceSrsSession onClose={() => setShowVoiceSrs(false)} />}

      {!showVoiceSrs && <BottomNav />}
    </div>
  );
}

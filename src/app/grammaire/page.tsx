'use client';

import React, { useState } from 'react';
import { BookOpen, Lock, Play } from 'lucide-react';
import { module4Lessons } from '@/data/module4';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import type { UILanguage } from '@/lib/i18n/translations';
import { getLocalizedText } from '@/lib/i18n/utils';
import ExerciseRunner from '@/components/ExerciseRunner';
import ConjugationTable from '@/components/grammar/ConjugationTable';
import PageHeader from '@/components/ui/PageHeader';
import PaywallModal from '@/components/monetization/PaywallModal';
import BottomNav from '@/components/navigation/BottomNav';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { isModuleLocked } from '@/lib/premiumModules';
import { syncService } from '@/lib/syncService';

export default function GrammairePage() {
  const { uiLanguage, completeLesson, isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const [runnerLesson, setRunnerLesson] = useState<Lesson | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const tp = t.pages.grammaire;
  const localized = (text: MultiLangText | string | undefined) => getLocalizedText(text, lang as UILanguage);
  const moduleLocked = isModuleLocked('4', isPremium);

  const handleStart = (lesson: Lesson) => {
    if (!isPremiumReady) return;
    if (moduleLocked) {
      setShowPaywall(true);
      return;
    }
    setRunnerLesson(lesson);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Grammaire Active'}
        title={tp.title || 'Grammaire & Conjugaison'}
        backHref="/?view=path&tab=grammaire"
      />

      <main className="max-w-4xl mx-auto p-6 pb-24 space-y-8">
        <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
          <h2 className="font-display text-xl font-bold text-[#1B2A4A] mb-4">
            {tp.conjugationTable || 'Tableau de conjugaison'}
          </h2>
          {moduleLocked ? (
            <button
              onClick={() => isPremiumReady && setShowPaywall(true)}
              disabled={!isPremiumReady}
              className="w-full rounded-xl border border-[#C9A05C]/30 bg-[#C9A05C]/10 px-5 py-8 text-sm font-bold text-[#1B2A4A] disabled:cursor-wait"
            >
              <span className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-[#C9A05C]" />
                {t.pages.etudier.premium || 'Kenza Pro'}
              </span>
            </button>
          ) : (
            <ConjugationTable />
          )}
        </section>

        <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
          <h2 className="font-display text-xl font-bold text-[#1B2A4A] mb-4">
            {tp.grammarLessons || 'Leçons de grammaire (Module 4)'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {module4Lessons.filter((l) => l.steps && l.steps.length > 0).map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleStart(lesson)}
                disabled={!isPremiumReady}
                className="text-left bg-[#F7F3EA] border border-[#E8E2D5] rounded-xl p-4 hover:border-[#C9A05C] disabled:cursor-wait transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1B2A4A] truncate">{localized(lesson.title)}</p>
                    <p className="text-xs text-[#7A7670] line-clamp-2 mt-1">{localized(lesson.description)}</p>
                    <p className="text-[10px] text-[#7A7670] mt-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {lesson.steps.length} {tp.steps || 'étapes'}
                    </p>
                  </div>
                  {(!isPremiumReady || moduleLocked) ? (
                    <span className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3" /> {t.pages.etudier.premium || 'Kenza Pro'}
                    </span>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center shrink-0 group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors">
                      <Play className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {runnerLesson && (
        <ExerciseRunner
          lesson={runnerLesson}
          onComplete={() => {
            completeLesson(runnerLesson.id);
            void syncService.persistLessonCompletion(runnerLesson.id);
            setRunnerLesson(null);
          }}
          onClose={() => setRunnerLesson(null)}
        />
      )}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} source="module_locked" />
      )}
      <BottomNav />
    </div>
  );
}

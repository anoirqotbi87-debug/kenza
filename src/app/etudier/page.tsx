'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2, Lock, Play } from 'lucide-react';
import { fullCurriculum } from '@/data/curriculum';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedText } from '@/lib/i18n/utils';
import ExerciseRunner from '@/components/ExerciseRunner';
import PaywallModal from '@/components/monetization/PaywallModal';

export default function EtudierPage() {
  const { uiLanguage, completedLessons, completeLesson, isPremium } = useAppStore();
  const [runnerLesson, setRunnerLesson] = useState<Lesson | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const PREMIUM_MODULES = ['5', '6', '7'];

  const localized = (text: MultiLangText | string | undefined) => getLocalizedText(text, lang as any);

  const handleStart = (moduleKey: string, lesson: Lesson) => {
    if (PREMIUM_MODULES.includes(moduleKey) && !isPremium) {
      setShowPaywall(true);
      return;
    }
    setRunnerLesson(lesson);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <header className="bg-[#1B2A4A] text-[#FDFCF8] px-6 py-5 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Retour">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">Parcours complet</p>
          <h1 className="font-serif text-2xl font-bold">
            {isAr ? 'المسار الكامل — 7 وحدات' : lang === 'en' ? 'Full Curriculum — 7 Modules' : 'Ton parcours complet — 7 modules'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {Object.entries(fullCurriculum).map(([key, mod]) => {
          const isPremiumModule = PREMIUM_MODULES.includes(key);
          return (
            <section key={key} className={`bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs ${isPremiumModule && !isPremium ? 'opacity-90' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-[#1B2A4A]">
                  {isAr ? 'الوحدة' : lang === 'en' ? 'Module' : 'Module'} {key} — {localized(mod.title)}
                </h2>
                {isPremiumModule && (
                  <span className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Kenza Pro
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mod.lessons.filter((l) => l.steps && l.steps.length > 0).map((lesson) => {
                  const done = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleStart(key, lesson)}
                      className="text-left bg-[#F7F3EA] border border-[#E8E2D5] rounded-xl p-4 hover:border-[#C9A05C] transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#1B2A4A] truncate">{localized(lesson.title)}</p>
                          <p className="text-xs text-[#7A7670] line-clamp-2 mt-1">{localized(lesson.description)}</p>
                          <p className="text-[10px] text-[#7A7670] mt-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {lesson.steps.length} étapes · Niveau {lesson.level}
                          </p>
                        </div>
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-[#7A9174] shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center shrink-0 group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors">
                            <Play className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {runnerLesson && (
        <ExerciseRunner
          lesson={runnerLesson}
          onComplete={() => {
            completeLesson(runnerLesson.id);
            setRunnerLesson(null);
          }}
          onClose={() => setRunnerLesson(null)}
        />
      )}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} source="module_locked" />}
    </div>
  );
}

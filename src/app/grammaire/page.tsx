'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import { module4Lessons } from '@/data/module4';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { useAppStore } from '@/store/useAppStore';
import { getLocalizedText } from '@/lib/i18n/utils';
import ExerciseRunner from '@/components/ExerciseRunner';
import ConjugationTable from '@/components/grammar/ConjugationTable';

export default function GrammairePage() {
  const { uiLanguage, completeLesson } = useAppStore();
  const [runnerLesson, setRunnerLesson] = useState<Lesson | null>(null);
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const localized = (text: MultiLangText | string | undefined) => getLocalizedText(text, lang as any);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <header className="bg-[#1B2A4A] text-[#FDFCF8] px-6 py-5 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Retour">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">Grammaire Active</p>
          <h1 className="font-serif text-2xl font-bold">
            {isAr ? 'القواعد والتصريف' : lang === 'en' ? 'Grammar & Conjugation' : 'Grammaire & Conjugaison'}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#1B2A4A] mb-4">
            {isAr ? 'جدول التصريف' : lang === 'en' ? 'Conjugation Table' : 'Tableau de conjugaison'}
          </h2>
          <ConjugationTable />
        </section>

        <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#1B2A4A] mb-4">
            {isAr ? 'دروس القواعد (الوحدة 4)' : lang === 'en' ? 'Grammar Lessons (Module 4)' : 'Leçons de grammaire (Module 4)'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {module4Lessons.filter((l) => l.steps && l.steps.length > 0).map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setRunnerLesson(lesson)}
                className="text-left bg-[#F7F3EA] border border-[#E8E2D5] rounded-xl p-4 hover:border-[#C9A05C] transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1B2A4A] truncate">{localized(lesson.title)}</p>
                    <p className="text-xs text-[#7A7670] line-clamp-2 mt-1">{localized(lesson.description)}</p>
                    <p className="text-[10px] text-[#7A7670] mt-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {lesson.steps.length} étapes
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center shrink-0 group-hover:bg-[#C9A05C] group-hover:text-[#1B2A4A] transition-colors">
                    <Play className="w-3 h-3" />
                  </div>
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
            setRunnerLesson(null);
          }}
          onClose={() => setRunnerLesson(null)}
        />
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { BookOpen, Lock, Play } from 'lucide-react';
import { module4Lessons } from '@/data/module4';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import type { UILanguage } from '@/lib/i18n/translations';
import { getLocalizedText } from '@/lib/i18n/utils';
import ConjugationTable from '@/components/grammar/ConjugationTable';
import { isModuleLocked } from '@/lib/premiumModules';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface PathGrammarSectionProps {
  onStartLesson: (lesson: Lesson) => void;
  onOpenPaywall: () => void;
}

export default function PathGrammarSection({
  onStartLesson,
  onOpenPaywall,
}: PathGrammarSectionProps) {
  const { uiLanguage, isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const tp = t.pages.grammaire;
  const localized = (text: MultiLangText | string | undefined) =>
    getLocalizedText(text, lang as UILanguage);
  const moduleLocked = isModuleLocked('4', isPremium);

  const handleStart = (lesson: Lesson) => {
    if (!isPremiumReady) return;
    if (moduleLocked) {
      onOpenPaywall();
      return;
    }
    onStartLesson(lesson);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Conjugation Table Card */}
      <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs">
        <h3 className="font-display text-xl font-bold text-[#142943] mb-4">
          {tp.conjugationTable || 'Tableau de conjugaison'}
        </h3>
        {moduleLocked ? (
          <button
            onClick={() => isPremiumReady && onOpenPaywall()}
            disabled={!isPremiumReady}
            className="w-full rounded-xl border border-[#D69B47]/30 bg-[#F5E7C8]/40 px-5 py-8 text-sm font-bold text-[#142943] disabled:cursor-wait hover:bg-[#F5E7C8]/70 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-[#D69B47]" />
              {t.pages.etudier.premium || 'Kenza Pro'}
            </span>
          </button>
        ) : (
          <ConjugationTable />
        )}
      </section>

      {/* Grammar Lessons Card */}
      <section className="bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs">
        <h3 className="font-display text-xl font-bold text-[#142943] mb-4">
          {tp.grammarLessons || 'Leçons de grammaire (Module 4)'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {module4Lessons
            .filter((l) => l.steps && l.steps.length > 0)
            .map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleStart(lesson)}
                disabled={!isPremiumReady}
                className="text-left bg-[#F7F5EF] border border-[#E8E2D5] rounded-xl p-4 hover:border-[#D69B47] disabled:cursor-wait transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#142943] truncate">
                      {localized(lesson.title)}
                    </p>
                    <p className="text-xs text-[#6B7174] line-clamp-2 mt-1">
                      {localized(lesson.description)}
                    </p>
                    <p className="text-[10px] text-[#6B7174] mt-2 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#315A7D]" />
                      {lesson.steps.length} {tp.steps || 'étapes'}
                    </p>
                  </div>
                  {!isPremiumReady || moduleLocked ? (
                    <span className="bg-[#F5E7C8] text-[#8C6D23] border border-[#D69B47]/40 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-[#D69B47]" />
                      {t.pages.etudier.premium || 'Kenza Pro'}
                    </span>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#142943] text-[#FFFEFA] flex items-center justify-center shrink-0 group-hover:bg-[#D69B47] group-hover:text-[#142943] transition-colors">
                      <Play className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </button>
            ))}
        </div>
      </section>
    </div>
  );
}

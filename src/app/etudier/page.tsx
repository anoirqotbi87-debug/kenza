'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Lock, Play, Sparkles } from 'lucide-react';
import { fullCurriculum } from '@/data/curriculum';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import type { UILanguage } from '@/lib/i18n/translations';
import { getLocalizedText } from '@/lib/i18n/utils';
import { isModuleLocked } from '@/lib/premiumModules';
import ExerciseRunner from '@/components/ExerciseRunner';
import ArabiziGuideModal from '@/components/curriculum/ArabiziGuideModal';
import PaywallModal from '@/components/monetization/PaywallModal';
import PageHeader from '@/components/ui/PageHeader';
import BottomNav from '@/components/navigation/BottomNav';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { syncService } from '@/lib/syncService';

export default function EtudierPage() {
  const { uiLanguage, completedLessons, completeLesson, isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const [runnerLesson, setRunnerLesson] = useState<Lesson | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showArabiziGuide, setShowArabiziGuide] = useState(false);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const tp = t.pages.etudier;
  const tc = t.common;

  const localized = (text: MultiLangText | string | undefined) => getLocalizedText(text, lang as UILanguage);

  const handleStart = (moduleKey: string, lesson: Lesson) => {
    if (!isPremiumReady && isModuleLocked(moduleKey, false)) return;
    if (isModuleLocked(moduleKey, isPremium)) {
      setShowPaywall(true);
      return;
    }
    setRunnerLesson(lesson);
  };

  // Le query param se lit après hydratation : pendant le rendu serveur, `window`
  // n’existe pas et un initialiseur useState ne serait jamais relancé côté client.
  const [deepLink, setDeepLink] = useState<{ moduleKey: string; lesson: Lesson } | null>(null);
  const [deepLinkClosed, setDeepLinkClosed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');
    let foundLesson: { moduleKey: string; lesson: Lesson } | null = null;
    if (lessonId) {
      for (const [key, mod] of Object.entries(fullCurriculum)) {
        const lesson = mod.lessons.find((item) => item.id === lessonId);
        if (lesson) {
          foundLesson = { moduleKey: key, lesson };
          break;
        }
      }
    }
    if (params.has('lesson')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    // Décaler l’écriture d’état à la file d’événements évite de rendre le HTML
    // serveur différent du premier rendu client, tout en gardant le deep-link.
    const timer = window.setTimeout(() => setDeepLink(foundLesson), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Le verrou premium reste applique au deep-link : on ne contourne pas le paywall.
  const deepLinkRequiresPremium = Boolean(deepLink && isModuleLocked(deepLink.moduleKey, false));
  const deepLinkAccessReady = !deepLinkRequiresPremium || isPremiumReady;
  const deepLinkBlocked = Boolean(
    deepLink && !deepLinkClosed && deepLinkAccessReady && isModuleLocked(deepLink.moduleKey, isPremium)
  );
  const openLesson =
    runnerLesson ??
    (!deepLinkClosed && deepLink && deepLinkAccessReady && !deepLinkBlocked ? deepLink.lesson : null);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={tp.badge || 'Parcours complet'}
        title={tp.title || 'Ton parcours complet — 7 modules'}
        backHref="/?view=path&tab=parcours"
      />

      <main className="max-w-4xl mx-auto p-6 pb-24 space-y-8">
        <button
          onClick={() => setShowArabiziGuide(true)}
          className="w-full text-left bg-white/70 border border-dashed border-[#C9A05C]/50 hover:border-[#C9A05C] hover:bg-[#C9A05C]/5 rounded-2xl px-5 py-4 flex items-center gap-3 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#C9A05C]/15 text-[#B8860B] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1B2A4A]">💡 La Clé des Chiffres Arabizi</p>
            <p className="text-xs text-[#7A7670] mt-0.5">
              2 · 3 · 5 · 7 · 9 — le décodeur des sons gutturaux, avant ou pendant ton parcours.
            </p>
          </div>
          <span className="text-xs font-bold text-[#B8860B] bg-[#C9A05C]/10 border border-[#C9A05C]/20 px-3 py-1 rounded-full shrink-0">
            Mini-guide
          </span>
        </button>
        {Object.entries(fullCurriculum).map(([key, mod]) => {
          const isPremiumModule = isModuleLocked(key, false) && (!isPremiumReady || !isPremium);
          return (
            <section key={key} className={`bg-[#FDFCF8] rounded-2xl border border-[#E8E2D5] p-6 shadow-xs ${isPremiumModule ? 'opacity-90' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-[#1B2A4A]">
                  {tp.module || 'Module'} {key} — {localized(mod.title)}
                </h2>
                {isPremiumModule && (
                  <span className="bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {tp.premium || 'Kenza Pro'}
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
                      disabled={!isPremiumReady && isModuleLocked(key, false)}
                      className="text-left bg-[#F7F3EA] border border-[#E8E2D5] rounded-xl p-4 hover:border-[#C9A05C] disabled:cursor-wait transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#1B2A4A] truncate">{localized(lesson.title)}</p>
                          <p className="text-xs text-[#7A7670] line-clamp-2 mt-1">{localized(lesson.description)}</p>
                          <p className="text-[10px] text-[#7A7670] mt-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {lesson.steps.length} {tp.steps || 'étapes'} · {tc.level || 'Niveau'} {lesson.level}
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

      {openLesson && (
        <ExerciseRunner
          lesson={openLesson}
          onComplete={() => {
            completeLesson(openLesson.id);
            void syncService.persistLessonCompletion(openLesson.id);
            setRunnerLesson(null);
            setDeepLinkClosed(true);
          }}
          onClose={() => {
            setRunnerLesson(null);
            setDeepLinkClosed(true);
          }}
        />
      )}
      {(showPaywall || deepLinkBlocked) && (
        <PaywallModal
          onClose={() => {
            setShowPaywall(false);
            setDeepLinkClosed(true);
          }}
          source="module_locked"
        />
      )}
      {showArabiziGuide && (
        <ArabiziGuideModal onClose={() => setShowArabiziGuide(false)} />
      )}
      <BottomNav />
    </div>
  );
}

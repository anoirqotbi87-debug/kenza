'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { DailyQuest, QuestCategory, QuestType } from '@/types/quests';
import {
  Brain,
  Mic,
  BookOpen,
  Zap,
  CheckCircle2,
  Gift,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const I18N = {
  fr: {
    kicker: 'DÉFIS DU JOUR',
    title: 'Quêtes Quotidiennes',
    desc: 'Accomplissez vos 3 quêtes du jour pour consolider vos acquis et débloquer le coffre bonus.',
    chestTitle: 'Coffre Bonus Quotidien',
    chestUnlocked: 'Coffre débloqué ! (+50 XP crédités)',
    chestProgress: 'Complétez les 3 quêtes pour débloquer (+50 XP)',
    completed: 'Terminé',
    actionMemory: 'Réviser',
    actionVocal: 'S’entraîner',
    actionExploration: 'Explorer',
    quests: {
      srs_review_due: {
        title: 'Entraînement de la Mémoire',
        desc: (t: number) => `Révisez ${t} cartes de vocabulaire prêtes`,
      },
      srs_fast_recall: {
        title: 'Rappel Éclair',
        desc: (t: number) => `Répondez à ${t} cartes en moins de 3.5s`,
      },
      vocal_rehab: {
        title: 'Réhabilitation Vocale',
        desc: (t: number) => `Répétez avec succès ${t} mots à perfectionner`,
      },
      vocal_practice: {
        title: 'Atelier Phonétique',
        desc: (t: number) => `Réussissez ${t} prononciations (> 75%)`,
      },
      complete_lesson: {
        title: 'Exploration Lexicale',
        desc: (t: number) => `Terminez ${t} leçon du parcours`,
      },
      earn_xp: {
        title: 'Chasseur d’XP',
        desc: (t: number) => `Gagnez ${t} XP aujourd’hui`,
      },
    },
  },
  en: {
    kicker: 'DAILY CHALLENGES',
    title: 'Daily Quests',
    desc: 'Complete your 3 daily quests to consolidate your skills and unlock the bonus chest.',
    chestTitle: 'Daily Bonus Chest',
    chestUnlocked: 'Chest unlocked! (+50 XP awarded)',
    chestProgress: 'Complete all 3 quests to unlock (+50 XP)',
    completed: 'Completed',
    actionMemory: 'Review',
    actionVocal: 'Practice',
    actionExploration: 'Explore',
    quests: {
      srs_review_due: {
        title: 'Memory Training',
        desc: (t: number) => `Review ${t} due vocabulary cards`,
      },
      srs_fast_recall: {
        title: 'Fast Recall',
        desc: (t: number) => `Answer ${t} cards in under 3.5s`,
      },
      vocal_rehab: {
        title: 'Vocal Rehabilitation',
        desc: (t: number) => `Successfully pronounce ${t} words needing review`,
      },
      vocal_practice: {
        title: 'Phonetic Workshop',
        desc: (t: number) => `Achieve ${t} successful pronunciations (> 75%)`,
      },
      complete_lesson: {
        title: 'Course Exploration',
        desc: (t: number) => `Complete ${t} curriculum lesson`,
      },
      earn_xp: {
        title: 'XP Hunter',
        desc: (t: number) => `Earn ${t} XP today`,
      },
    },
  },
  es: {
    kicker: 'DESAFÍOS DEL DÍA',
    title: 'Misiones Diarias',
    desc: 'Completa tus 3 misiones de hoy para consolidar conocimientos y abrir el cofre extra.',
    chestTitle: 'Cofre Extra Diario',
    chestUnlocked: '¡Cofre abierto! (+50 XP ganados)',
    chestProgress: 'Completa las 3 misiones para abrir (+50 XP)',
    completed: 'Completado',
    actionMemory: 'Repasar',
    actionVocal: 'Practicar',
    actionExploration: 'Explorar',
    quests: {
      srs_review_due: {
        title: 'Entrenamiento de Memoria',
        desc: (t: number) => `Repasa ${t} tarjetas de vocabulario pendientes`,
      },
      srs_fast_recall: {
        title: 'Recuerdo Rápido',
        desc: (t: number) => `Responde ${t} tarjetas en menos de 3.5s`,
      },
      vocal_rehab: {
        title: 'Rehabilitación Vocal',
        desc: (t: number) => `Pronuncia con éxito ${t} palabras por perfeccionar`,
      },
      vocal_practice: {
        title: 'Taller Fonético',
        desc: (t: number) => `Logra ${t} pronunciaciones exitosas (> 75%)`,
      },
      complete_lesson: {
        title: 'Exploración de Lección',
        desc: (t: number) => `Completa ${t} lección del curso`,
      },
      earn_xp: {
        title: 'Cazador de XP',
        desc: (t: number) => `Gana ${t} XP hoy`,
      },
    },
  },
  ar: {
    kicker: 'تحديات اليوم',
    title: 'المهام اليومية',
    desc: 'أكمل مهامك الـ 3 اليومية لترسيخ مكتسباتك وفتح صندوق المكافأة.',
    chestTitle: 'صندوق المكافأة اليومي',
    chestUnlocked: 'تم فتح الصندوق! (+50 نقطة XP مضافة)',
    chestProgress: 'أكمل جميع المهام الـ 3 لفتح الصندوق (+50 XP)',
    completed: 'مكتملة',
    actionMemory: 'مراجعة',
    actionVocal: 'تدريب',
    actionExploration: 'استكشاف',
    quests: {
      srs_review_due: {
        title: 'تدريب الذاكرة',
        desc: (t: number) => `راجع ${t} بطاقات مفردات مستحقة`,
      },
      srs_fast_recall: {
        title: 'تذكر سريع',
        desc: (t: number) => `أجب عن ${t} بطاقات في أقل من 3.5 ثانية`,
      },
      vocal_rehab: {
        title: 'إعادة التأهيل الصوتي',
        desc: (t: number) => `كرر بنجاح ${t} كلمات تحتاج إلى إتقان`,
      },
      vocal_practice: {
        title: 'ورشة النطق',
        desc: (t: number) => `حقق ${t} عمليات نطق ناجحة (> 75%)`,
      },
      complete_lesson: {
        title: 'استكشاف الدروس',
        desc: (t: number) => `أكمل ${t} درس من المسار`,
      },
      earn_xp: {
        title: 'صياد نقاط XP',
        desc: (t: number) => `اكسب ${t} نقطة XP اليوم`,
      },
    },
  },
};

function getCategoryIcon(cat: QuestCategory, type: QuestType) {
  switch (cat) {
    case 'memory':
      return <Brain className="w-5 h-5 text-indigo-500" />;
    case 'vocal':
      return <Mic className="w-5 h-5 text-amber-500" />;
    case 'exploration':
      return type === 'earn_xp' ? (
        <Zap className="w-5 h-5 text-emerald-500" />
      ) : (
        <BookOpen className="w-5 h-5 text-teal-500" />
      );
  }
}

function getQuestActionLink(cat: QuestCategory): string {
  switch (cat) {
    case 'memory':
      return '/revisions';
    case 'vocal':
      return '/parler';
    case 'exploration':
      return '/etudier';
  }
}

function getQuestActionLabel(cat: QuestCategory, texts: typeof I18N.fr): string {
  switch (cat) {
    case 'memory':
      return texts.actionMemory;
    case 'vocal':
      return texts.actionVocal;
    case 'exploration':
      return texts.actionExploration;
  }
}

export function DailyQuestsWidget() {
  const dailyQuests = useAppStore((s) => s.dailyQuests);
  const ensureDailyQuests = useAppStore((s) => s.ensureDailyQuests);
  const uiLanguage = useAppStore((s) => s.uiLanguage || 'fr');

  const lang = (uiLanguage in I18N ? uiLanguage : 'fr') as keyof typeof I18N;
  const isAr = lang === 'ar';
  const texts = I18N[lang];

  useEffect(() => {
    ensureDailyQuests();
  }, [ensureDailyQuests]);

  const quests: DailyQuest[] = dailyQuests?.quests || [];
  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length || 3;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const chestClaimed = Boolean(dailyQuests?.dailyBonusClaimed);

  return (
    <section
      dir={isAr ? 'rtl' : 'ltr'}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
      aria-label={texts.title}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 rounded-full border border-amber-200/50 dark:border-amber-800/40">
              {texts.kicker}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              {dailyQuests?.dateKey}
            </span>
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{texts.title}</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {texts.desc}
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 rounded-full border border-zinc-200/70 dark:border-zinc-700/60">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            {completedCount}/{totalCount}
          </span>
          <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / Math.max(1, totalCount)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bonus Chest Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
          chestClaimed || allCompleted
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              chestClaimed || allCompleted
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>{texts.chestTitle}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                +50 XP
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {chestClaimed || allCompleted
                ? texts.chestUnlocked
                : texts.chestProgress}
            </div>
          </div>
        </div>

        {allCompleted && (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        )}
      </div>

      {/* Quests List */}
      <div className="grid gap-3">
        {quests.map((quest) => {
          const questI18n = texts.quests[quest.type] || {
            title: quest.type,
            desc: () => '',
          };
          const progressPercent = Math.min(
            100,
            Math.round((quest.progress / Math.max(1, quest.target)) * 100)
          );
          const actionLink = getQuestActionLink(quest.category);
          const actionLabel = getQuestActionLabel(quest.category, texts);

          return (
            <div
              key={quest.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
                  {getCategoryIcon(quest.category, quest.type)}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {questI18n.title}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md">
                      +{quest.xpReward} XP
                    </span>
                    {quest.completed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        {texts.completed}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {questI18n.desc(quest.target)}
                  </p>

                  {/* Progress Bar (Mobile) */}
                  <div className="sm:hidden pt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          quest.completed ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-zinc-500">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action & Progress (Desktop) */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                {/* Progress Bar (Desktop) */}
                <div className="hidden sm:flex flex-col items-end gap-1 w-24">
                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        quest.completed ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                    {quest.progress}/{quest.target}
                  </span>
                </div>

                {/* Quick Link Button */}
                {!quest.completed ? (
                  <Link
                    href={actionLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 transition-colors"
                  >
                    <span>{actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DailyQuestsWidget;

'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import PronunciationTrainer from '@/components/audio/PronunciationTrainer';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowRight, Lock, MapPin, MessageSquare, Play, Sparkles, Timer, Zap } from 'lucide-react';
import { ALL_SCENARIOS } from '@/data/scenarios';
import { TAXI_SCENARIO } from '@/data/scenarios/taxiScenario';
import type { DialogueScenario } from '@/types/dialogue';
import ScenarioRunner from '@/components/parler/ScenarioRunner';
import SpeedChallengeRunner from '@/components/parler/SpeedChallengeRunner';
import PaywallModal from '@/components/monetization/PaywallModal';
import BottomNav from '@/components/navigation/BottomNav';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

export default function ParlerPage() {
  const { uiLanguage, isPremium } = useAppStore();
  const { isPremiumReady } = usePremiumStatus();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<'trainer' | 'dialogue' | 'speed'>('trainer');
  const [activeScenario, setActiveScenario] = useState<DialogueScenario | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const tp = t.pages.parler;

  const getScenarioTitle = (scenario: DialogueScenario) => {
    if (scenario.titleI18n) {
      return scenario.titleI18n[lang as keyof typeof scenario.titleI18n] || scenario.titleI18n.fr || scenario.title;
    }
    return scenario.titleFr || scenario.title;
  };

  const getScenarioCategory = (scenario: DialogueScenario) => {
    if (scenario.categoryI18n) {
      return scenario.categoryI18n[lang as keyof typeof scenario.categoryI18n] || scenario.categoryI18n.fr;
    }
    switch (scenario.category) {
      case 'transport':
        return isAr ? 'مواصلات ونقل' : lang === 'es' ? 'Transporte' : lang === 'en' ? 'Transport' : 'Transport';
      case 'restaurant':
        return isAr ? 'مقهى ومطاعم' : lang === 'es' ? 'Cafetería y comida' : lang === 'en' ? 'Café & Dining' : 'Café & restauration';
      case 'souk':
        return isAr ? 'تسوق وسوق' : lang === 'es' ? 'Compras y zoco' : lang === 'en' ? 'Shopping & Market' : 'Achats & Souk';
      case 'daily':
        return isAr ? 'حياة يومية' : lang === 'es' ? 'Vida diaria' : lang === 'en' ? 'Daily Life' : 'Vie quotidienne';
      default:
        return isAr ? 'محادثة' : lang === 'es' ? 'Conversación' : lang === 'en' ? 'Conversation' : 'Conversation';
    }
  };

  const getScenarioLocation = (scenario: DialogueScenario) => {
    if (scenario.locationI18n) {
      return scenario.locationI18n[lang as keyof typeof scenario.locationI18n] || scenario.locationI18n.fr || scenario.location;
    }
    return scenario.location;
  };

  const getScenarioRole = (scenario: DialogueScenario) => {
    if (scenario.npcRoleI18n) {
      return scenario.npcRoleI18n[lang as keyof typeof scenario.npcRoleI18n] || scenario.npcRoleI18n.fr;
    }
    if (scenario.npcRole) return scenario.npcRole;
    return isAr ? 'حوار موجّه' : lang === 'es' ? 'Diálogo guiado' : lang === 'en' ? 'Guided dialogue' : 'Dialogue guidé';
  };

  const getTurnsLabel = (count: number) => {
    if (isAr) return `${count} جولات`;
    if (lang === 'es') return `${count} ${count === 1 ? 'turno' : 'turnos'}`;
    if (lang === 'en') return `${count} ${count === 1 ? 'turn' : 'turns'}`;
    return `${count} ${count === 1 ? 'tour' : 'tours'}`;
  };

  const startScenario = (scenario: DialogueScenario) => {
    if (scenario.tier === 'premium' && !isPremiumReady) return;
    if (scenario.tier === 'premium' && !isPremium) {
      setShowPaywall(true);
      return;
    }
    setActiveScenario(scenario);
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FAF7F2] pb-24 md:pb-8 pb-safe">
      <PageHeader
        badge={tp?.badge || (isAr ? 'التدريب الشفهي' : lang === 'es' ? 'Práctica Oral' : lang === 'en' ? 'Speaking Practice' : 'Pratique Orale')}
        title={tp?.title || (isAr ? 'تدريب النطق' : lang === 'es' ? 'Entrenador de pronunciación' : lang === 'en' ? 'Pronunciation trainer' : 'Entraînement de prononciation')}
        backHref="/?view=path&tab=parler"
      />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
        {/* Mode Selector */}
        <div className="flex bg-white rounded-full p-1.5 shadow-xs border border-amber-200/80 max-w-lg mx-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveMode('trainer')}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'trainer'
                ? 'bg-amber-600 !text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className={activeMode === 'trainer' ? '!text-white' : ''}>
              {isAr ? 'ورشة الأصوات' : lang === 'es' ? 'Modo Libre' : lang === 'en' ? 'Phonetics' : 'Phonétique'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('dialogue')}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'dialogue'
                ? 'bg-amber-600 !text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span className={activeMode === 'dialogue' ? '!text-white' : ''}>
              {isAr ? 'سيناريوهات' : lang === 'es' ? 'Escenarios' : lang === 'en' ? 'Scenarios' : 'Scénarios'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('speed')}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeMode === 'speed'
                ? 'bg-amber-600 !text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-500" />
            <span className={activeMode === 'speed' ? '!text-white' : ''}>
              {isAr ? 'تحدّي السرعة' : lang === 'es' ? 'Speed Challenge' : lang === 'en' ? 'Speed Challenge' : 'Speed Challenge'}
            </span>
          </button>
        </div>

        {activeMode === 'trainer' ? (
          <PronunciationTrainer />
        ) : activeMode === 'speed' ? (
          <SpeedChallengeRunner onExit={() => setActiveMode('trainer')} />
        ) : (
          <section className="space-y-6">
            {/* HERO FEATURE : TAXI_SCENARIO (Scénario Vedette) */}
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-amber-400/40 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-amber-500/30 text-amber-100 border border-amber-300/40 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                    <span>🚕</span>
                    <span>Scénario Vedette · Immersion Immédiate</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <span>{getScenarioTitle(TAXI_SCENARIO)}</span>
                    <span className="text-xs bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full font-mono">
                      {TAXI_SCENARIO.level || 'A2'}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl">
                    Montez à bord du Grand Taxi à Ouled Ziane : négociez la destination, demandez le tarif de la place et organisez vos bagages en Darija vivant avec Si Mohammed.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-amber-200 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {TAXI_SCENARIO.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      +55 XP à gagner
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => startScenario(TAXI_SCENARIO)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-800 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                  <Play className="w-4 h-4 fill-current rtl:rotate-180" />
                  <span>Lancer le Scénario</span>
                </button>
              </div>
            </div>

            {/* CATALOGUE COMPLET DES SCÉNARIOS */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-amber-200/80 space-y-5">
              <div>
                <h3 className="font-display text-lg font-bold text-stone-800">
                  {t.modules.scenario.dialoguesTitle || (isAr ? 'حوارات وسيناريوهات' : lang === 'es' ? 'Diálogos guionizados' : lang === 'en' ? 'Scripted dialogues' : 'Tous les Scénarios de Rue')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  {t.modules.scenario.dialoguesDesc || (isAr ? 'تدرّب في مواقف مغربية واقعية.' : lang === 'es' ? 'Practica en situaciones marroquíes reales.' : lang === 'en' ? 'Practice real-life situations.' : 'Mises en situation réelles pour perfectionner votre aisance orale.')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_SCENARIOS.map((scenario) => {
                  const locked = scenario.tier === 'premium' && (!isPremiumReady || !isPremium);
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => startScenario(scenario)}
                      disabled={scenario.tier === 'premium' && !isPremiumReady}
                      className="text-left rtl:text-right bg-[#FAF7F2] border border-amber-200/80 rounded-2xl p-4 hover:border-amber-500 disabled:cursor-wait transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-stone-800">{getScenarioTitle(scenario)}</p>
                          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{getScenarioLocation(scenario)} · {getTurnsLabel(scenario.turns.length)}</span>
                          </p>
                          <p className="text-[10px] text-stone-500 mt-2">{scenario.level || 'A1'} · {getScenarioRole(scenario)}</p>
                        </div>
                        {locked ? (
                          <span className="bg-amber-500/15 text-amber-700 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3" /> Kenza Pro
                          </span>
                        ) : (
                          <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 group-hover:bg-amber-700 transition-colors">
                            <Play className="w-3.5 h-3.5 rtl:rotate-180" />
                          </span>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs font-semibold text-stone-500 flex items-center justify-between">
                        <span>{getScenarioCategory(scenario)}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-600 rtl:rotate-180" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      {activeScenario && (
        <ScenarioRunner
          scenario={activeScenario}
          onExit={() => setActiveScenario(null)}
        />
      )}
      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} source="module_locked" />
      )}
      {!activeScenario && <BottomNav />}
    </div>
  );
}

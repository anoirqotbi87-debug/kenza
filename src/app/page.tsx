'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import ExerciseRunner from '@/components/ExerciseRunner';
import SRSDashboard from '@/components/srs/SRSDashboard';
import { allLessonsList, fullCurriculum } from '@/data/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Check, CheckCircle2, Play, Lock, ArrowRight, Sparkles, BookOpen, Compass, RotateCcw, Crown } from 'lucide-react';
import { getLocalizedText } from '@/lib/i18n/utils';
import { Navigation } from '@/components/Navigation';
import Header from '@/components/Header';
import HeroBanner from '@/components/dashboard/HeroBanner';
import DailyReviewCard from '@/components/dashboard/DailyReviewCard';
import SmartReviewSession from '@/components/srs/SmartReviewSession';
import PhrasebookView from '@/components/tools/PhrasebookView';
import SpeechTrainer from '@/components/audio/SpeechTrainer';
import ProfileView from '@/components/profile/ProfileView';
import CheckpointModal from '@/components/checkpoint/CheckpointModal';
import { useCheckpointProgress } from '@/hooks/useCheckpointProgress';

import { supabase } from '@/lib/supabase';
import { syncService } from '@/lib/syncService';

import ScenarioSelectorModal from '@/components/dialogue/ScenarioSelectorModal';
import AiRoleplayView from '@/components/dialogue/AiRoleplayView';
import { PersonaId } from '@/lib/ai/prompts';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import InstallPwaBanner from '@/components/pwa/InstallPwaBanner';
import PaywallModal from '@/components/monetization/PaywallModal';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'home' | 'parcours' | 'phrasebook' | 'review' | 'learn' | 'speech' | 'profile'>('home');
  const [activeTrack, setActiveTrack] = useState<'grammar' | 'conversation'>('grammar');
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);
  
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase() as 'fr' | 'en' | 'es' | 'ar';
  const isArabic = lang === 'ar' || lang.startsWith('ar');
  const { t } = useTranslation();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const { completeLesson, completedLessons, devUnlockAll, setUser, resetData, hasCompletedOnboarding, isPremium, setIsPremium } = useAppStore();
  const [checkpointOpen, setCheckpointOpen] = useState<{ id: string, name: string } | null>(null);
  const { hasPassedLevel } = useCheckpointProgress();

  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(null);
  const [pricingSource, setPricingSource] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthSync = async (user: any) => {
      setUser(user);
      
      // Check if the user has existing cloud data
      const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single();
      const { count: lessonsCount } = await supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      
      if ((profile && profile.xp > 0) || (lessonsCount && lessonsCount > 0)) {
        // Existing user: pull their cloud data down, overwriting any local guest data
        console.log("[Auth] Existing user detected. Restoring cloud data.");
        await syncService.syncCloudToLocal(user.id);
      } else {
        // New user: push their local guest data up to the cloud
        console.log("[Auth] New user detected. Migrating local guest data to cloud.");
        await syncService.migrateGuestDataToCloud(user.id);
      }
    };

    // 1. Récupérer immédiatement la session active au chargement de la page
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log("[Auth] Session active détectée :", session.user.email);
        handleAuthSync(session.user);
      }
    });

    // 2. Écouter les changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth Event]:", event, session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user) {
        handleAuthSync(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        resetData();
        localStorage.removeItem('kenza_checkpoints');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, resetData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Analyser les paramètres de requête et le hash de l'URL
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    
    const error = searchParams.get('error') || hashParams.get('error');
    const errorDesc = searchParams.get('error_description') || hashParams.get('error_description');

    if (error || errorDesc) {
      console.error("[OAuth Callback Error]:", { error, errorDesc });

      if (errorDesc?.includes("Unable to exchange external code")) {
        alert("Échec de connexion Google :\nLe Secret Client (Client Secret) configuré dans votre dashboard Supabase ne correspond pas à celui de votre console Google Cloud.\n\nVeuillez vérifier et recoller le Client Secret dans Supabase > Auth > Providers > Google.");
      } else {
        alert(`Erreur d'authentification : ${errorDesc || error}`);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const upgradeStatus = searchParams.get('upgrade');
    if (upgradeStatus === 'success') {
      setIsPremium(true);
      alert('🎉 Félicitations ! Votre abonnement Kenza Pro est activé. Bienvenue dans l’expérience complète !');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (upgradeStatus === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setIsPremium]);

  const handleStartLesson = (lessonId: string) => {
    // Vérification du gating Premium sur les modules 3, 4 et 5
    const isGated = ['3', '4', '5'].some((modId) => {
      const mod = (fullCurriculum as any)[modId];
      return mod?.lessons?.some((l: any) => l.id === lessonId);
    });

    if (isGated && !isPremium && !devUnlockAll) {
      setPricingSource('module_locked');
      return;
    }

    setActiveLessonId(lessonId);
  };

  const handleCloseLesson = () => {
    setActiveLessonId(null);
  };

  const handleCompleteLesson = () => {
    if (activeLessonId) {
      completeLesson(activeLessonId);
    }
    setActiveLessonId(null);
  };

  // Find next uncompleted lesson
  const nextLesson = allLessonsList.find((l) => !completedLessons.includes(l.id)) || allLessonsList[0];

  const renderModule = (moduleId: string, moduleData: any, track: 'grammar' | 'conversation') => {
    const isGrammar = track === 'grammar';
    const isModulePremium = ['3', '4', '5'].includes(String(moduleId));
    const isRestrictedByPremium = isModulePremium && !isPremium && !devUnlockAll;
    
    return (
      <div key={moduleId} className="space-y-6">
        
        {/* Module Header Card */}
        <div className={`p-6 sm:p-7 rounded-[26px] shadow-sm border transition-all ${
          isGrammar 
            ? 'bg-[#1B2A4A] text-[#FDFCF8] border-[#1B2A4A]' 
            : 'bg-[#FDFCF8] text-[#1B2A4A] border-[#E8E2D5]'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
              <span>—</span>
              <span>Module {moduleId}</span>
            </div>
            {isModulePremium && !isPremium && (
              <button
                onClick={() => setPricingSource('module_locked')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A05C]/20 hover:bg-[#C9A05C]/30 border border-[#C9A05C]/40 text-[#C9A05C] text-[11px] font-bold tracking-wider uppercase transition-colors"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Kenza Pro</span>
              </button>
            )}
          </div>
          <h2 className={`font-serif text-2xl sm:text-3xl font-normal ${isGrammar ? 'text-[#FDFCF8]' : 'text-[#1B2A4A]'}`}>
            {getLocalizedText(moduleData.title, lang)}
          </h2>
          <p className={`text-xs mt-1 ${isGrammar ? 'text-[#E8E2D5]/80' : 'text-[#7A7670]'}`}>
            {moduleData.lessons.length} étapes structurées
          </p>
        </div>

        {/* Timeline of step circles */}
        <div className="relative pt-4 pb-10 flex flex-col items-center gap-8">
          
          {/* Ligne verticale en pointillés reliant les cercles */}
          <div className="absolute top-6 bottom-16 left-1/2 w-0 border-l-2 border-dashed border-[#E8E2D5] -translate-x-1/2 z-0" />

          {moduleData.lessons.map((lesson: any, idx: number) => {
            const globalIndex = allLessonsList.findIndex((l) => l.id === lesson.id);
            const isCompleted = completedLessons.includes(lesson.id);
            let isNext = !isCompleted && (globalIndex === 0 || completedLessons.includes(allLessonsList[globalIndex - 1]?.id));
            let isLocked = !isCompleted && !isNext;

            // Enforce Checkpoint prerequisites
            if (moduleId === '3' && !hasPassedLevel('2')) {
              isLocked = true;
              isNext = false;
            }
            if (moduleId === '4' && !hasPassedLevel('3')) {
              isLocked = true;
              isNext = false;
            }

            if (devUnlockAll) {
              isLocked = false;
              isNext = !isCompleted;
            }

            const isLessonGated = isRestrictedByPremium && !isCompleted;

            return (
              <div key={lesson.id} className="relative z-10 w-full max-w-md">
                
                {/* Center Circle Node */}
                <div className="flex flex-col items-center mb-3">
                  {isCompleted ? (
                    /* Validé : Cercle vert sauge (#7A9174) avec coche blanche */
                    <div className="w-11 h-11 rounded-full bg-[#7A9174] text-white flex items-center justify-center shadow-xs border-2 border-[#FDFCF8] ring-4 ring-[#7A9174]/20 transition-transform">
                      <Check className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                  ) : isLessonGated ? (
                    /* Verrouillé Pro : Cercle contour doré avec cadenas or */
                    <div 
                      onClick={() => setPricingSource('module_locked')}
                      className="w-11 h-11 rounded-full border-2 border-[#C9A05C] bg-[#FDFCF8] text-[#C9A05C] flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      title="Niveau réservé aux membres Kenza Pro"
                    >
                      <Lock className="w-4 h-4 text-[#C9A05C]" />
                    </div>
                  ) : isNext ? (
                    /* En cours / À suivre : Cercle contour doré avec badge pill "À SUIVRE" plein */
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-full border-2 border-[#C9A05C] bg-[#FDFCF8] text-[#C9A05C] flex items-center justify-center shadow-md ring-4 ring-[#C9A05C]/25 animate-pulse">
                        <Play className="w-5 h-5 fill-[#C9A05C] text-[#C9A05C] ml-0.5" />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#C9A05C] text-[#1B2A4A] text-[10px] font-bold tracking-wider uppercase shadow-xs">
                        À SUIVRE
                      </span>
                    </div>
                  ) : (
                    /* Verrouillé : Cercle discret contour #E8E2D5 */
                    <div className="w-10 h-10 rounded-full border border-[#E8E2D5] bg-[#F7F3EA] text-[#7A7670]/50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-[#7A7670]/50" />
                    </div>
                  )}
                </div>

                {/* Lesson Card */}
                <div
                  onClick={() => {
                    if (isLessonGated) {
                      setPricingSource('module_locked');
                    } else if (isNext) {
                      handleStartLesson(lesson.id);
                    }
                  }}
                  className={`relative p-6 sm:p-7 rounded-[26px] border transition-all duration-300 text-left ${
                    isCompleted
                      ? 'bg-[#FDFCF8] border-[#7A9174]/40 shadow-xs hover:border-[#7A9174] cursor-pointer'
                      : isLessonGated
                        ? 'bg-[#FDFCF8] border border-[#C9A05C]/40 hover:border-[#C9A05C] shadow-sm hover:shadow-md cursor-pointer'
                        : isNext
                          ? 'bg-[#FDFCF8] border-2 border-[#C9A05C] shadow-lg scale-[1.02] transform cursor-pointer ring-4 ring-[#C9A05C]/10'
                          : 'bg-[#FDFCF8]/60 border-[#E8E2D5]/70 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A05C] mb-1">
                        — Étape {idx + 1}
                      </div>
                      <h3 className={`font-serif text-xl font-bold leading-snug ${isLocked && !isLessonGated ? 'text-[#7A7670]' : 'text-[#1B2A4A]'}`}>
                        {getLocalizedText(lesson.title, lang)}
                      </h3>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7A9174] bg-[#7A9174]/15 px-2.5 py-0.5 rounded-full shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>Validé</span>
                      </span>
                    ) : isLessonGated ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPricingSource('module_locked');
                        }}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C9A05C] bg-[#C9A05C]/15 border border-[#C9A05C]/40 hover:bg-[#C9A05C]/25 px-2.5 py-1 rounded-full shrink-0 transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>PRO</span>
                      </button>
                    ) : null}
                  </div>

                  <p className={`text-xs sm:text-sm mt-1 mb-4 leading-relaxed ${isLocked && !isLessonGated ? 'text-[#7A7670]/70' : 'text-[#7A7670]'}`}>
                    {getLocalizedText(lesson.description, lang)}
                  </p>

                  {isLessonGated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPricingSource('module_locked');
                      }}
                      className="w-full py-3 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm flex justify-center items-center gap-2 shadow-xs transition-all active:scale-95 group"
                    >
                      <Crown className="w-4 h-4 text-[#1B2A4A]" />
                      <span>Débloquer avec Kenza Pro</span>
                    </button>
                  ) : isNext ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                      className="w-full py-3 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm flex justify-center items-center gap-2 shadow-xs transition-all active:scale-95 group"
                    >
                      <span>Commencer la leçon</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : null}

                  {isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                      className="text-xs font-semibold text-[#7A7670] hover:text-[#1B2A4A] hover:underline transition-colors mt-2"
                    >
                      Revoir cette étape
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* CHECKPOINT NODE */}
          {(() => {
            const lastLessonId = moduleData.lessons[moduleData.lessons.length - 1].id;
            const isCheckpointUnlocked = completedLessons.includes(lastLessonId) || devUnlockAll;
            const passed = hasPassedLevel(moduleId);
            const titleStr = getLocalizedText(moduleData.title, lang);

            const checkpointTitles: Record<string, string> = {
              '1': 'A1.1',
              '2': 'A1.2',
              '3': 'A2',
              '4': 'B1.1',
              '5': 'B1.2',
              '6': 'B2.1',
              '7': 'B2.2',
            };
            const levelLabel = checkpointTitles[moduleId] || moduleId;

            return (
              <div className="relative z-10 w-full max-w-md mt-4">
                <button
                  disabled={!isCheckpointUnlocked}
                  onClick={() => {
                    if (!isPremium) {
                      setPricingSource('checkpoint_locked');
                    } else {
                      setCheckpointOpen({ id: moduleId, name: titleStr });
                    }
                  }}
                  className={`w-full relative p-6 sm:p-7 rounded-[28px] border transition-all duration-300 flex flex-col items-center text-center shadow-md ${
                    passed
                      ? 'bg-[#FDFCF8] border-2 border-[#7A9174] shadow-sm cursor-pointer'
                      : isCheckpointUnlocked
                        ? 'bg-[#1B2A4A] border-2 border-[#C9A05C] text-[#FDFCF8] shadow-xl hover:scale-[1.02] cursor-pointer'
                        : 'bg-[#FDFCF8]/40 border-[#E8E2D5] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 border shadow-xs"
                    style={{
                      backgroundColor: passed ? 'rgba(122,145,116,0.15)' : isCheckpointUnlocked ? 'rgba(201,160,92,0.2)' : '#F7F3EA',
                      borderColor: passed ? '#7A9174' : isCheckpointUnlocked ? '#C9A05C' : '#E8E2D5',
                    }}
                  >
                    {passed ? '🏆' : isCheckpointUnlocked ? '⭐' : '🔒'}
                  </div>

                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A05C] mb-1">
                    — Examen de niveau
                  </div>

                  <h3 className={`font-serif text-2xl font-bold mb-1 ${passed ? 'text-[#7A9174]' : isCheckpointUnlocked ? 'text-[#FDFCF8]' : 'text-[#7A7670]'}`}>
                    Checkpoint {levelLabel}
                  </h3>

                  <p className={`text-xs ${passed ? 'text-[#7A9174]' : isCheckpointUnlocked ? 'text-[#E8E2D5]/80' : 'text-[#7A7670]/70'}`}>
                    {passed ? 'Passeport de niveau validé avec succès' : isCheckpointUnlocked ? 'Évaluez vos compétences pour obtenir le certificat' : 'Complétez les leçons pour déverrouiller'}
                  </p>

                  {isCheckpointUnlocked && !passed && (
                    <div className="mt-4 px-6 py-2.5 rounded-full bg-[#C9A05C] text-[#1B2A4A] text-xs font-bold shadow-xs">
                      Passer le test de niveau →
                    </div>
                  )}
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  const activeLesson = activeLessonId 
    ? allLessonsList.find((l) => l.id === activeLessonId) 
    : null;

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#1B2A4A] font-sans pb-28 selection:bg-[#C9A05C]/20 selection:text-[#1B2A4A]">
      
      {!activeLessonId && (
        <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      )}

      {isReviewSessionOpen && (
        <SmartReviewSession onClose={() => setIsReviewSessionOpen(false)} />
      )}

      {!activeLessonId ? (
        <div className="pt-6 px-4 max-w-6xl mx-auto">
          
          {/* ONGLET 1 : ACCUEIL */}
          {(currentTab === 'home' || currentTab === 'learn') && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Hero Bannière */}
              <HeroBanner
                onPrimaryAction={() => handleStartLesson(nextLesson.id)}
                primaryActionLabel={`Reprendre : ${getLocalizedText(nextLesson.title, lang)}`}
                onSecondaryAction={() => setCurrentTab('parcours')}
                secondaryActionLabel="Voir tout le parcours"
              />

              {/* Rappel Répétition Espacée */}
              <DailyReviewCard onStartReview={() => setIsReviewSessionOpen(true)} />

              {/* Mises en situation au Maroc */}
              <div 
                className="bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs border border-[#E8E2D5] hover:border-[#C9A05C]/60 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setShowScenarioSelector(true)}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
                    <span>—</span>
                    <span>Mises en situation réelles</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1B2A4A]">
                    💬 {isArabic ? 'المواقف والمحادثات' : lang === 'en' ? 'Roleplay Situations' : 'Pratiquez au café, en taxi et au souk'}
                  </h2>
                  <p className="text-sm text-[#7A7670] leading-relaxed">
                    {isArabic ? 'تدرّب على الدارجة في المقهى، الطاكسي أو السوق!' : lang === 'en' ? 'Interactive roleplay with native Darija dialogue scenarios.' : 'Simulateur de conversations authentiques avec assistance phonétique et variantes régionales.'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B2A4A] text-[#FDFCF8] text-xs font-bold shadow-xs group-hover:bg-[#1B2A4A]/90 transition-colors shrink-0">
                  <span>Lancer un dialogue</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A05C]" />
                </div>
              </div>

              {/* Raccourcis éditoriaux vers les sections */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div 
                  onClick={() => setCurrentTab('parcours')}
                  className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] hover:border-[#C9A05C] cursor-pointer transition-all shadow-xs space-y-2"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1B2A4A]/10 text-[#1B2A4A] flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">Parcours complet</h3>
                  <p className="text-xs text-[#7A7670]">7 modules du niveau débutant aux conversations avancées.</p>
                </div>

                <div 
                  onClick={() => setCurrentTab('phrasebook')}
                  className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] hover:border-[#C9A05C] cursor-pointer transition-all shadow-xs space-y-2"
                >
                  <div className="w-9 h-9 rounded-full bg-[#C9A05C]/15 text-[#C9A05C] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">Dictionnaire & Fiches</h3>
                  <p className="text-xs text-[#7A7670]">Lexique thématique, mode mains-libres et règles clés.</p>
                </div>

                <div 
                  onClick={() => setCurrentTab('review')}
                  className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] hover:border-[#C9A05C] cursor-pointer transition-all shadow-xs space-y-2"
                >
                  <div className="w-9 h-9 rounded-full bg-[#7A9174]/15 text-[#7A9174] flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">Révision SRS</h3>
                  <p className="text-xs text-[#7A7670]">Flashcards et mémorisation longue durée avec gain d'XP.</p>
                </div>
              </div>

            </div>
          )}

          {/* ONGLET 2 : PARCOURS */}
          {currentTab === 'parcours' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Parcours Header */}
              <div className="space-y-2 text-center max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase">
                  <span>—</span>
                  <span>Votre Itinéraire</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1B2A4A] font-normal">
                  Le Parcours d'apprentissage
                </h1>
                <p className="text-sm text-[#7A7670]">
                  Validez les étapes successives pour déverrouiller vos checkpoints et obtenir votre passeport Darija.
                </p>
              </div>

              {/* Sélecteur de piste pour Mobile & Desktop */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-[#FDFCF8] p-1.5 rounded-full border border-[#E8E2D5] shadow-xs gap-1">
                  <button 
                    onClick={() => setActiveTrack('grammar')}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
                      activeTrack === 'grammar' 
                        ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' 
                        : 'text-[#7A7670] hover:text-[#1B2A4A]'
                    }`}
                  >
                    📚 {t.dashboard.trackA || "Grammaire & Fondations"}
                  </button>
                  <button 
                    onClick={() => setActiveTrack('conversation')}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
                      activeTrack === 'conversation' 
                        ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' 
                        : 'text-[#7A7670] hover:text-[#1B2A4A]'
                    }`}
                  >
                    💬 {t.dashboard.trackB || "Situations & Immersion"}
                  </button>
                </div>
              </div>

              {/* Modules Columns */}
              <div className="max-w-3xl mx-auto">
                {activeTrack === 'grammar' ? (
                  <div className="space-y-12">
                    {Object.entries(fullCurriculum)
                      .filter(([mId]) => ['1', '3', '4', '6'].includes(mId))
                      .map(([moduleId, moduleData]) => renderModule(moduleId, moduleData, 'grammar'))}
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Object.entries(fullCurriculum)
                      .filter(([mId]) => ['2', '5', '7'].includes(mId))
                      .map(([moduleId, moduleData]) => renderModule(moduleId, moduleData, 'conversation'))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ONGLET 3 : PHRASES / DICTIONNAIRE */}
          {currentTab === 'phrasebook' && (
            <div className="animate-in fade-in duration-300">
              <PhrasebookView />
            </div>
          )}

          {/* ONGLET 4 : RÉVISER (SRS & FLASHCARDS) */}
          {currentTab === 'review' && (
            <div className="animate-in fade-in duration-300 space-y-6">
              <div className="space-y-2 text-center max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase">
                  <span>—</span>
                  <span>Mémorisation Continue</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1B2A4A] font-normal">
                  Session de Révision
                </h1>
                <p className="text-sm text-[#7A7670]">
                  Répétez vos flashcards pour accumuler de l'XP et consolider vos acquis sur le long terme.
                </p>
              </div>

              <SRSDashboard />
            </div>
          )}

          {/* PRATIQUE ORALE */}
          {currentTab === 'speech' && (
            <div className="animate-in fade-in duration-300 max-w-4xl mx-auto space-y-6">
              <SpeechTrainer />
            </div>
          )}

          {/* PROFIL & PASSEPORT */}
          {currentTab === 'profile' && (
            <div className="animate-in fade-in duration-300 space-y-8 max-w-5xl mx-auto">
              <ProfileView />
              <div className="max-w-4xl mx-auto p-4">
                <SRSDashboard />
              </div>
            </div>
          )}

        </div>
      ) : (
        activeLesson && (
          <ErrorBoundary onClose={handleCloseLesson}>
            <ExerciseRunner 
              lesson={activeLesson}
              onComplete={handleCompleteLesson}
              onClose={handleCloseLesson}
            />
          </ErrorBoundary>
        )
      )}

      {/* Navigation Mobile en bas (fixe) */}
      {!activeLessonId && (
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      )}

      {checkpointOpen && (
        <CheckpointModal 
          levelId={checkpointOpen.id} 
          levelName={checkpointOpen.name}
          onClose={() => setCheckpointOpen(null)} 
        />
      )}

      {showScenarioSelector && (
        <ScenarioSelectorModal 
          onClose={() => setShowScenarioSelector(false)}
          onSelectAi={(personaId) => {
            setActivePersonaId(personaId);
            setShowScenarioSelector(false);
          }}
          onRequirePremium={() => setPricingSource('roleplay_locked')}
          onStartSrs={() => {
            setShowScenarioSelector(false);
            setCurrentTab('review');
          }}
        />
      )}

      {activePersonaId && (
        <div className="fixed inset-0 z-50 bg-[#FDFCF8] flex flex-col">
          <AiRoleplayView 
            personaId={activePersonaId}
            onClose={() => setActivePersonaId(null)}
          />
        </div>
      )}

      {!hasCompletedOnboarding && (
        <OnboardingModal />
      )}

      {pricingSource && (
        <PaywallModal 
          onClose={() => setPricingSource(null)} 
          source={pricingSource} 
        />
      )}

      <InstallPwaBanner />
    </main>
  );
}

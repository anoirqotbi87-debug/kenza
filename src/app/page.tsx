'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import ExerciseRunner from '@/components/ExerciseRunner';
import SRSDashboard from '@/components/srs/SRSDashboard';
import { allLessonsList, fullCurriculum } from '@/data/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CheckCircle2, Play } from 'lucide-react';
import { getLocalizedText } from '@/lib/i18n/utils';
import { Navigation } from '@/components/Navigation';
import Header from '@/components/Header';
import PhrasebookView from '@/components/tools/PhrasebookView';
import SpeechTrainer from '@/components/audio/SpeechTrainer';
import ProfileView from '@/components/profile/ProfileView';
import CheckpointModal from '@/components/checkpoint/CheckpointModal';
import { useCheckpointProgress } from '@/hooks/useCheckpointProgress';

import { supabase } from '@/lib/supabase';
import { syncService } from '@/lib/syncService';
import { useEffect } from 'react';

import ScenarioSelectorModal from '@/components/dialogue/ScenarioSelectorModal';
import DialogueView from '@/components/dialogue/DialogueView';
import { DialogueScenario } from '@/types/dialogue';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import InstallPwaBanner from '@/components/pwa/InstallPwaBanner';
import PricingModal from '@/components/monetization/PricingModal';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'learn' | 'phrasebook' | 'speech' | 'profile'>('learn');
  const [activeTab, setActiveTab] = useState<'grammar' | 'conversation'>('grammar');
  const { t, lang } = useTranslation();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const { completeLesson, completedLessons, devUnlockAll, setUser, resetData, hasCompletedOnboarding, subscriptionTier } = useAppStore();
  const [checkpointOpen, setCheckpointOpen] = useState<{ id: string, name: string } | null>(null);
  const { hasPassedLevel } = useCheckpointProgress();

  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [activeScenario, setActiveScenario] = useState<DialogueScenario | null>(null);
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
        // On init, we just ensure the store knows the user. If they were already logged in,
        // their local storage is already their cloud storage. We can do a pull to be safe.
        handleAuthSync(session.user);
      }
    });

    // 2. Écouter les changements d'état (CRUCIAL pour le retour de Google OAuth !)
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

      // Nettoyer l'URL proprement sans recharger la page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStartLesson = (lessonId: string) => {
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

  const renderModule = (moduleId: string, moduleData: any, track: 'grammar' | 'conversation') => {
    const headerBg = track === 'grammar' 
      ? "bg-gradient-to-r from-blue-600 to-indigo-500" 
      : "bg-gradient-to-r from-amber-500 to-orange-500";
    
    const lineColor = track === 'grammar' ? "bg-blue-100" : "bg-amber-100";
    
    return (
      <div key={moduleId} className="space-y-6">
        <div className={`${headerBg} p-6 rounded-3xl text-white shadow-lg flex items-center justify-between`}>
          <h2 className="text-2xl font-bold mb-2">{t.dashboard.module} {moduleId} : {getLocalizedText(moduleData.title, lang)}</h2>
        </div>

        <div className="relative pt-8 pb-12 flex flex-col items-center gap-12">
          <div className={`absolute top-0 bottom-0 left-1/2 w-4 ${lineColor} -translate-x-1/2 z-0 rounded-full`}></div>
          
          {moduleData.lessons.map((lesson: any) => {
            const globalIndex = allLessonsList.findIndex(l => l.id === lesson.id);
            const isCompleted = completedLessons.includes(lesson.id);
            let isNext = !isCompleted && (globalIndex === 0 || completedLessons.includes(allLessonsList[globalIndex - 1].id));
            let isLocked = !isCompleted && !isNext;

            if (devUnlockAll) {
              isLocked = false;
              isNext = !isCompleted;
            }
            
            return (
              <div key={lesson.id} className="relative z-10 w-full max-w-md">
                <div className={`
                  relative p-6 rounded-3xl border-4 transition-all duration-300
                  ${isCompleted ? 'bg-white border-green-400 shadow-md' : ''}
                  ${isNext ? 'bg-blue-50 border-blue-600 shadow-xl scale-105 transform cursor-pointer hover:bg-blue-100' : ''}
                  ${isLocked ? 'bg-slate-50 border-slate-200 opacity-70' : ''}
                `}
                onClick={() => isNext && handleStartLesson(lesson.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                      {getLocalizedText(lesson.title, lang)}
                    </h3>
                    {isCompleted && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                    {isNext && <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">{t.dashboard.current}</div>}
                  </div>
                  <p className={`text-sm mb-4 ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {getLocalizedText(lesson.description, lang)}
                  </p>
                  
                  {isNext && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartLesson(lesson.id);
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-md"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      {t.dashboard.start}
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

            return (
              <div className="relative z-10 w-full max-w-md mt-4">
                <button 
                  disabled={!isCheckpointUnlocked}
                  onClick={() => {
                    if (subscriptionTier === 'free') {
                      setPricingSource('checkpoint_locked');
                    } else {
                      setCheckpointOpen({ id: moduleId, name: titleStr });
                    }
                  }}
                  className={`
                    w-full relative p-6 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center text-center
                    ${passed 
                      ? 'bg-amber-50 border-amber-500 shadow-lg cursor-pointer' 
                      : isCheckpointUnlocked 
                        ? 'bg-blue-600 border-blue-700 text-white shadow-xl hover:scale-105 cursor-pointer' 
                        : 'bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed'}
                  `}
                >
                  <div className="text-4xl mb-3">{passed ? '🏆' : '🔒'}</div>
                  <h3 className={`font-bold text-xl mb-1 ${passed ? 'text-amber-600' : isCheckpointUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    Checkpoint {moduleId}
                  </h3>
                  <p className={`text-sm ${passed ? 'text-amber-700/80' : isCheckpointUnlocked ? 'text-blue-100' : 'text-slate-400'}`}>
                    {passed ? 'Passeport obtenu !' : 'Examen de niveau'}
                  </p>
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  const activeLesson = activeLessonId 
    ? allLessonsList.find(l => l.id === activeLessonId) 
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {!activeLessonId && (
        <Header currentTab={currentTab} onTabChange={setCurrentTab} />
      )}

      {!activeLessonId ? (
        <div className="pt-6">
          {currentTab === 'learn' && (
            <div className="space-y-12">
              <Dashboard onStartLesson={handleStartLesson} />
              
              <div className="max-w-6xl mx-auto p-4 space-y-8">
                {/* Roleplay Banner */}
                <div 
                  className="bg-gradient-to-r from-amber-400 to-rose-400 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform text-white" 
                  onClick={() => setShowScenarioSelector(true)}
                >
                  <div>
                    <h2 className="text-2xl font-black mb-2">💬 Mises en situation</h2>
                    <p className="font-medium text-amber-50">Pratiquez la Darija au café, au taxi ou au souk !</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shrink-0 ml-4">
                    <Play className="w-8 h-8 fill-white" />
                  </div>
                </div>

                {/* Sélecteur d'onglets pour Mobile */}
                <div className="flex lg:hidden justify-center gap-2 mb-6">
                  <button 
                    onClick={() => setActiveTab('grammar')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition ${activeTab === 'grammar' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
                  >
                    📚 {t.dashboard.trackA || "Grammaire & Fondations"}
                  </button>
                  <button 
                    onClick={() => setActiveTab('conversation')}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition ${activeTab === 'conversation' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
                  >
                    💬 {t.dashboard.trackB || "Situations & Immersion"}
                  </button>
                </div>

                {/* Grille Desktop 2 Colonnes & Affichage Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Colonne 1 : Grammaire */}
                  <div className={`${activeTab === 'grammar' ? 'block' : 'hidden'} lg:block`}>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-center">
                      <span className="text-blue-700 font-extrabold text-lg flex items-center justify-center gap-2">
                        📚 {t.dashboard.trackA || "Grammaire & Fondations"}
                      </span>
                    </div>
                    <div className="space-y-6">
                      {Object.entries(fullCurriculum)
                        .filter(([mId]) => ['1', '3', '4', '6'].includes(mId))
                        .map(([moduleId, moduleData]) => renderModule(moduleId, moduleData, 'grammar'))}
                    </div>
                  </div>

                  {/* Colonne 2 : Conversation */}
                  <div className={`${activeTab === 'conversation' ? 'block' : 'hidden'} lg:block`}>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-center">
                      <span className="text-amber-700 font-extrabold text-lg flex items-center justify-center gap-2">
                        💬 {t.dashboard.trackB || "Situations & Immersion"}
                      </span>
                    </div>
                    <div className="space-y-6">
                      {Object.entries(fullCurriculum)
                        .filter(([mId]) => ['2', '5', '7'].includes(mId))
                        .map(([moduleId, moduleData]) => renderModule(moduleId, moduleData, 'conversation'))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'phrasebook' && <PhrasebookView />}
          
          {currentTab === 'speech' && <SpeechTrainer />}

          {currentTab === 'profile' && (
            <div className="space-y-8">
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
          onSelect={(scenario) => {
            setActiveScenario(scenario);
            setShowScenarioSelector(false);
          }}
          onRequirePremium={() => setPricingSource('roleplay_locked')}
        />
      )}

      {activeScenario && (
        <DialogueView 
          scenario={activeScenario}
          onExit={() => setActiveScenario(null)}
        />
      )}

      {!hasCompletedOnboarding && (
        <OnboardingModal />
      )}

      {pricingSource && (
        <PricingModal 
          onClose={() => setPricingSource(null)} 
          source={pricingSource} 
        />
      )}

      <InstallPwaBanner />
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/tracking';
import Dashboard from '@/components/Dashboard';
import ExerciseRunner from '@/components/ExerciseRunner';
import SRSDashboard from '@/components/srs/SRSDashboard';
import { allLessonsList, fullCurriculum } from '@/data/curriculum';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CheckCircle2, Play } from 'lucide-react';
import { getLocalizedText } from '@/lib/i18n/utils';
import { Navigation } from '@/components/Navigation';
import PhrasebookView from '@/components/tools/PhrasebookView';
import SpeechTrainer from '@/components/audio/SpeechTrainer';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<'learn' | 'phrasebook' | 'speech' | 'profile'>('learn');
  const [activeTab, setActiveTab] = useState<'grammar' | 'conversation'>('grammar');
  const { t, lang } = useTranslation();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const { completeLesson, completedLessons, devUnlockAll } = useAppStore();

  // Chaque onglet est suivi comme une « page » virtuelle (/learn, /phrasebook, /speech, /profile)
  useEffect(() => {
    track('page_view', { tab: currentTab }, `/${currentTab}`);
  }, [currentTab]);

  const handleStartLesson = (lessonId: string) => {
    track('lesson_started', {
      lesson_id: lessonId,
      lesson_index: allLessonsList.findIndex(l => l.id === lessonId),
      is_first_lesson: completedLessons.length === 0,
    }, '/lesson');
    setActiveLessonId(lessonId);
  };

  const handleCloseLesson = () => {
    setActiveLessonId(null);
  };

  const handleCompleteLesson = () => {
    if (activeLessonId) {
      track('lesson_completed', {
        lesson_id: activeLessonId,
        lessons_completed_total: completedLessons.length + 1,
      }, '/lesson');
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
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-blue-100 gap-4 max-w-6xl mx-4 md:mx-auto mt-6">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2 w-full md:w-auto">
            <span className="text-3xl">🐪</span> KENZA <span className="text-sm font-medium text-slate-400 font-arabic ml-1">كنزة</span>
          </h1>
          <div className="w-full md:w-auto">
            <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
          </div>
        </header>
      )}

      {!activeLessonId ? (
        <div className="pt-6">
          {currentTab === 'learn' && (
            <div className="space-y-12">
              <Dashboard onStartLesson={handleStartLesson} />
              
              <div className="max-w-6xl mx-auto p-4 space-y-8">
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
            <div className="max-w-4xl mx-auto p-4 space-y-8">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Votre Profil & Révisions</h2>
              <SRSDashboard />
              {/* Le bouton Vider le Cache a été déplacé ou reste dans le footer, on peut le mettre ici */}
              <div className="pt-12 pb-6 flex justify-center">
                <button 
                  onClick={() => {
                    if (confirm("Voulez-vous vraiment vider le cache local ? Vous perdrez votre progression (XP, leçons).")) {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors bg-transparent border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg"
                >
                  Vider le cache local / Réinitialiser
                </button>
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
    </main>
  );
}

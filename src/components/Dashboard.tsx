'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import { Flame, Star, Settings, Play, CheckCircle2, User, LogOut } from 'lucide-react';
import { Notation } from '../types/curriculum';
import AuthModal from './auth/AuthModal';
import LanguageSelector from './ui/LanguageSelector';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { fullCurriculum, allLessonsList } from '../data/curriculum';
import { getLocalizedText } from '../lib/i18n/utils';
import Leaderboard from './gamification/Leaderboard';
import BadgesList from './gamification/BadgesList';
import StreakHeatmap from './gamification/StreakHeatmap';
import SmartReviewSession from './srs/SmartReviewSession';

interface DashboardProps {
  onStartLesson: (lessonId: string) => void;
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const { xp, streakDays, completedLessons, preferredNotation, setNotation, toggleSound, soundEnabled, devUnlockAll } = useAppStore();
  const { t, lang } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNotationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotation(e.target.value as Notation);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />

      {isReviewSessionOpen && (
        <SmartReviewSession onClose={() => setIsReviewSessionOpen(false)} />
      )}

      {/* Top Navigation / Stats */}
      <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-blue-100 gap-4">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2 w-full sm:w-auto">
          <span className="text-3xl">🐪</span> KENZA <span className="text-sm font-medium text-slate-400 font-arabic ml-1">كنزة</span>
        </h1>
        
        <div className="flex flex-wrap gap-4 items-center justify-between w-full sm:w-auto">
          {/* User Badge */}
          {session ? (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold text-sm">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[100px]">{session.user.user_metadata?.full_name || session.user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="ml-2 hover:text-red-500 transition-colors" title={t.header.logout}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full font-bold text-sm transition-colors"
            >
              <User className="w-4 h-4" />
              {t.header.guestMode}
            </button>
          )}

          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span>{streakDays}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-500 font-bold">
            <Star className="w-5 h-5 fill-blue-500" />
            <span>{xp} {t.dashboard.xp}</span>
          </div>
          
          <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
            <select 
              value={preferredNotation} 
              onChange={handleNotationChange}
              className="bg-slate-100 text-slate-700 text-sm rounded-lg p-1 outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-colors"
            >
              <option value="arabizi">{t.header.arabizi}</option>
              <option value="arabic">{t.header.arabic}</option>
              <option value="duo">{t.header.duo}</option>
            </select>
            
            <LanguageSelector />
            
            <button 
              onClick={toggleSound}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title={soundEnabled ? "Mute" : "Sound"}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Gamification Dashboard */}
      <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-1">{t.dashboard.dailyTraining}</h2>
            <p className="text-blue-700">{t.dashboard.reviewPrompt}</p>
          </div>
          <button 
            onClick={() => setIsReviewSessionOpen(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {t.dashboard.dailyPractice}
          </button>
        </div>
        
        <StreakHeatmap />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Leaderboard />
          <BadgesList />
        </div>
      </section>

      {/* Learning Path */}
      <section className="space-y-12">
        {Object.entries(fullCurriculum).map(([moduleId, moduleData]) => (
          <div key={moduleId} className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-2">{t.dashboard.module} {moduleId} : {getLocalizedText(moduleData.title, lang)}</h2>
            </div>

            <div className="relative pt-8 pb-12 flex flex-col items-center gap-12">
              <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-blue-100 -translate-x-1/2 z-0 rounded-full"></div>
              
              {moduleData.lessons.map((lesson) => {
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
                    onClick={() => isNext && onStartLesson(lesson.id)}
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
                            onStartLesson(lesson.id);
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
        ))}
      </section>

      {/* Footer / Dev Utilities */}
      <footer className="pt-12 pb-6 flex justify-center">
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
      </footer>
    </div>
  );
}

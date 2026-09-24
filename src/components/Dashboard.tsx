'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import Leaderboard from './gamification/Leaderboard';
import BadgesList from './gamification/BadgesList';
import StreakHeatmap from './gamification/StreakHeatmap';
import SmartReviewSession from './srs/SmartReviewSession';
import { track } from '../lib/tracking';

interface DashboardProps {
  onStartLesson: (lessonId: string) => void;
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const { xp, streakDays, completedLessons, preferredNotation, setNotation, toggleSound, soundEnabled, devUnlockAll } = useAppStore();
  const { t, lang } = useTranslation();
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {isReviewSessionOpen && (
        <SmartReviewSession onClose={() => setIsReviewSessionOpen(false)} />
      )}



      {/* Gamification Dashboard */}
      <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-1">{t.dashboard.dailyTraining}</h2>
            <p className="text-blue-700">{t.dashboard.reviewPrompt}</p>
          </div>
          <button 
            onClick={() => {
              track('cta_click', { cta: 'daily_practice' }, '/learn');
              setIsReviewSessionOpen(true);
            }}
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

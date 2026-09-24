'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import SmartReviewSession from './srs/SmartReviewSession';

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
            onClick={() => setIsReviewSessionOpen(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {t.dashboard.dailyPractice}
          </button>
        </div>
      </section>
    </div>
  );
}

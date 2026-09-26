'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import SmartReviewSession from './srs/SmartReviewSession';
import DailyReviewCard from './dashboard/DailyReviewCard';

interface DashboardProps {
  onStartLesson: (lessonId: string) => void;
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const [isReviewSessionOpen, setIsReviewSessionOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {isReviewSessionOpen && (
        <SmartReviewSession onClose={() => setIsReviewSessionOpen(false)} />
      )}

      {/* Gamification Dashboard */}
      <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4">
        <DailyReviewCard onStartReview={() => setIsReviewSessionOpen(true)} />
      </section>
    </div>
  );
}

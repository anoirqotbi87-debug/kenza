'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import ExerciseRunner from '@/components/ExerciseRunner';
import SRSDashboard from '@/components/srs/SRSDashboard';
import { module1Lessons } from '@/data/module1';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const { completeLesson } = useAppStore();

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

  const activeLesson = activeLessonId 
    ? module1Lessons.find(l => l.id === activeLessonId) 
    : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {!activeLessonId ? (
        <div className="space-y-12">
          <Dashboard onStartLesson={handleStartLesson} />
          
          {/* Section SRS */}
          <div className="max-w-4xl mx-auto p-4">
            <SRSDashboard />
          </div>
        </div>
      ) : (
        activeLesson && (
          <ExerciseRunner 
            lesson={activeLesson}
            onComplete={handleCompleteLesson}
            onClose={handleCloseLesson}
          />
        )
      )}
    </main>
  );
}

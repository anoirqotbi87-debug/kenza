'use client';

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { module1Lessons } from '../data/module1';
import { Flame, Star, Settings, Play, CheckCircle2 } from 'lucide-react';
import { Notation } from '../types/curriculum';

interface DashboardProps {
  onStartLesson: (lessonId: string) => void;
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const { xp, streakDays, completedLessons, preferredNotation, setNotation, toggleSound, soundEnabled } = useAppStore();

  const handleNotationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotation(e.target.value as Notation);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Top Navigation / Stats */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
        <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          <span className="text-3xl">🐪</span> DarijaQuest
        </h1>
        
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span>{streakDays}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-500 font-bold">
            <Star className="w-5 h-5 fill-blue-500" />
            <span>{xp} XP</span>
          </div>
          
          <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
            <select 
              value={preferredNotation} 
              onChange={handleNotationChange}
              className="bg-slate-100 text-slate-700 text-sm rounded-lg p-2 outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-colors"
            >
              <option value="arabizi">Arabizi (3afak)</option>
              <option value="arabic">Arabe (عفاك)</option>
              <option value="duo">Bilingue (Les deux)</option>
            </select>
            
            <button 
              onClick={toggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title={soundEnabled ? "Désactiver le son" : "Activer le son"}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Learning Path */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-3xl text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Module 1 : Les Fondations</h2>
          <p className="opacity-90">Maîtrisez les sons uniques, les salutations et la politesse de base.</p>
        </div>

        <div className="relative pt-8 pb-12 flex flex-col items-center gap-12">
          {/* Decorative Path Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-orange-100 -translate-x-1/2 z-0 rounded-full"></div>
          
          {module1Lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isNext = !isCompleted && (index === 0 || completedLessons.includes(module1Lessons[index - 1].id));
            const isLocked = !isCompleted && !isNext;
            
            return (
              <div key={lesson.id} className="relative z-10 w-full max-w-md">
                <div className={`
                  relative p-6 rounded-3xl border-4 transition-all duration-300
                  ${isCompleted ? 'bg-white border-green-400 shadow-md' : ''}
                  ${isNext ? 'bg-orange-50 border-orange-500 shadow-xl scale-105 transform cursor-pointer hover:bg-orange-100' : ''}
                  ${isLocked ? 'bg-slate-50 border-slate-200 opacity-70' : ''}
                `}
                onClick={() => isNext && onStartLesson(lesson.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                      {lesson.title}
                    </h3>
                    {isCompleted && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                    {isNext && <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">ACTUEL</div>}
                  </div>
                  <p className={`text-sm mb-4 ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lesson.description}
                  </p>
                  
                  {isNext && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartLesson(lesson.id);
                      }}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-md"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Commencer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

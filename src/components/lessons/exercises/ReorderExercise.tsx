'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, Notation } from '../../../types/curriculum';

interface ReorderExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  onUpdate: (orderedIds: string[]) => void;
  isAnswerChecked: boolean;
}

export default function ReorderExercise({ exercise, preferredNotation, onUpdate, isAnswerChecked }: ReorderExerciseProps) {
  const [orderedWords, setOrderedWords] = useState<{id: string, text: React.ReactNode}[]>([]);
  const [availableWords, setAvailableWords] = useState<{id: string, text: React.ReactNode}[]>([]);

  const getTextForNotation = (item: any, notation: Notation) => {
    if (notation === 'arabizi') return item.arabizi;
    if (notation === 'arabic') return <span className="font-arabic">{item.arabic}</span>;
    if (notation === 'duo') return (
      <div className="flex flex-col items-center leading-tight">
        <span className="text-orange-600 font-bold text-sm">{item.arabizi}</span>
        <span className="text-slate-800 font-arabic text-lg">{item.arabic}</span>
      </div>
    );
    return item.translation;
  };

  useEffect(() => {
    if (exercise.options) {
      const words = exercise.options.map(opt => ({
        id: opt.id,
        text: getTextForNotation(opt, preferredNotation)
      }));
      setAvailableWords(words.sort(() => Math.random() - 0.5));
      setOrderedWords([]);
      onUpdate([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise, preferredNotation]);

  const handleAdd = (word: any) => {
    if (isAnswerChecked) return;
    const newOrdered = [...orderedWords, word];
    setOrderedWords(newOrdered);
    setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    onUpdate(newOrdered.map(w => w.id));
  };

  const handleRemove = (word: any, index: number) => {
    if (isAnswerChecked) return;
    const newOrdered = orderedWords.filter((_, i) => i !== index);
    setOrderedWords(newOrdered);
    setAvailableWords(prev => [...prev, word]);
    onUpdate(newOrdered.map(w => w.id));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Drop zone */}
      <div className={`
        min-h-[100px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center
        ${isAnswerChecked ? (JSON.stringify(orderedWords.map(w => w.id)) === JSON.stringify(exercise.answer) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-slate-300 bg-slate-50'}
      `}>
        {orderedWords.map((word, idx) => (
          <button
            key={`ordered-${word.id}-${idx}`}
            onClick={() => handleRemove(word, idx)}
            disabled={isAnswerChecked}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-transform active:scale-95 flex items-center justify-center"
          >
            {word.text}
          </button>
        ))}
      </div>
      
      {/* Source words */}
      <div className="flex flex-wrap gap-3 justify-center min-h-[100px]">
        {availableWords.map((word) => (
          <button
            key={`avail-${word.id}`}
            onClick={() => handleAdd(word)}
            disabled={isAnswerChecked}
            className={`
              px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm transition-all flex items-center justify-center
              ${isAnswerChecked ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 hover:shadow-md active:scale-95 text-slate-800'}
            `}
          >
            {word.text}
          </button>
        ))}
      </div>
    </div>
  );
}

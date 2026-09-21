'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, Notation } from '../../../types/curriculum';

interface FillBlankExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  onUpdate: (id: string) => void;
  isAnswerChecked: boolean;
}

export default function FillBlankExercise({ exercise, preferredNotation, onUpdate, isAnswerChecked }: FillBlankExerciseProps) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedWordId(null);
  }, [exercise]);

  const handleSelect = (id: string) => {
    if (isAnswerChecked) return;
    setSelectedWordId(id);
    onUpdate(id);
  };

  const getTextForNotation = (item: any, notation: Notation) => {
    if (notation === 'arabizi') return item.arabizi;
    if (notation === 'arabic') return item.arabic;
    if (notation === 'duo') return `${item.arabizi} / ${item.arabic}`;
    return item.translation;
  };

  const selectedWordOption = exercise.options?.find(o => o.id === selectedWordId);
  
  // Render the sentence with the blank
  const renderSentence = () => {
    if (!exercise.sentenceTemplate) return null;
    
    const parts = exercise.sentenceTemplate.split('{blank}');
    
    return (
      <div className="text-3xl font-bold text-slate-700 flex flex-wrap items-center justify-center gap-3">
        <span>{parts[0]}</span>
        
        <div className={`
          min-w-[120px] h-12 border-b-4 flex items-center justify-center px-4 transition-all
          ${selectedWordId ? 'border-blue-500 text-blue-600' : 'border-slate-300 text-transparent'}
          ${isAnswerChecked && selectedWordId === exercise.answer ? 'border-green-500 text-green-600 bg-green-50' : ''}
          ${isAnswerChecked && selectedWordId && selectedWordId !== exercise.answer ? 'border-red-500 text-red-600 bg-red-50' : ''}
        `}>
          {selectedWordOption ? getTextForNotation(selectedWordOption, preferredNotation) : '_____'}
        </div>
        
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center space-y-12">
      {renderSentence()}

      <div className="flex flex-wrap gap-4 justify-center">
        {exercise.options?.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={isAnswerChecked}
            className={`
              px-6 py-3 rounded-2xl border-2 text-lg font-bold transition-all shadow-sm
              ${selectedWordId === opt.id && !isAnswerChecked ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 bg-white hover:border-slate-300'}
              ${isAnswerChecked && opt.id === exercise.answer ? 'border-green-500 bg-green-50 text-green-700' : ''}
              ${isAnswerChecked && selectedWordId === opt.id && opt.id !== exercise.answer ? 'border-red-500 bg-red-50 text-red-700' : ''}
            `}
          >
            {getTextForNotation(opt, preferredNotation)}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Exercise, Notation } from '../../../types/curriculum';

import { getExerciseText } from '../../../lib/i18n/utils';
import { useTranslation } from '../../../store/useAppStore';

interface McqExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  selectedOptionId: string | null;
  onSelect: (id: string) => void;
  isAnswerChecked: boolean;
}

export default function McqExercise({ exercise, preferredNotation, selectedOptionId, onSelect, isAnswerChecked }: McqExerciseProps) {
  const { lang } = useTranslation();

  const getTextForNotation = (item: any, notation: Notation) => {
    if (typeof item === 'string') return item;
    if (notation === 'arabizi' && item.arabizi) return item.arabizi;
    if (notation === 'arabic' && item.arabic) return item.arabic;
    if (notation === 'duo' && item.arabizi && item.arabic) return (
      <div className="flex flex-col items-center">
        <span className="text-orange-600 font-bold">{item.arabizi}</span>
        <span className="text-slate-800 font-arabic text-xl">{item.arabic}</span>
      </div>
    );
    if (item.translation) return item.translation; // fallback
    return getExerciseText(item, lang);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {exercise.options?.map((opt) => {
        const isSelected = selectedOptionId === opt.id;
        const isCorrectOption = isAnswerChecked && opt.id === exercise.answer;
        const isWrongSelection = isAnswerChecked && isSelected && opt.id !== exercise.answer;

        return (
          <button
            key={opt.id}
            onClick={() => !isAnswerChecked && onSelect(opt.id)}
            disabled={isAnswerChecked}
            className={`
              p-6 rounded-2xl border-2 text-center text-lg font-medium transition-all min-h-[100px] flex items-center justify-center
              ${isSelected && !isAnswerChecked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
              ${isCorrectOption ? 'border-green-500 bg-green-50' : ''}
              ${isWrongSelection ? 'border-red-500 bg-red-50' : ''}
              ${isAnswerChecked && !isCorrectOption && !isWrongSelection ? 'opacity-50' : ''}
            `}
          >
            {getTextForNotation(opt, preferredNotation)}
          </button>
        );
      })}
    </div>
  );
}

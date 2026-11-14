'use client';

import React, { useState } from 'react';
import { Exercise } from '../../../types/curriculum';
import { useTranslation } from '../../../store/useAppStore';
import { getExerciseText } from '../../../lib/i18n/utils';
import { shuffle } from '../../../lib/shuffle';

interface MatchingExerciseProps {
  exercise: Exercise;
  onUpdate: (matches: Record<string, string>) => void;
  isAnswerChecked: boolean;
}

export default function MatchingExercise({ exercise, onUpdate, isAnswerChecked }: MatchingExerciseProps) {
  const { lang } = useTranslation();

  // The parent remounts this component via `key` when the exercise changes,
  // so the shuffled columns can be derived once at mount.
  const [leftItems] = useState<{id: string, text: string}[]>(() =>
    exercise.pairs
      ? shuffle(exercise.pairs.map(p => ({ id: p.id, text: getExerciseText(p.left, lang) })))
      : []
  );
  const [rightItems] = useState<{id: string, text: string}[]>(() =>
    exercise.pairs
      ? shuffle(exercise.pairs.map(p => ({ id: p.id, text: getExerciseText(p.right, lang) })))
      : []
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // rightId -> leftId

  const handleLeftClick = (id: string) => {
    if (isAnswerChecked) return;
    // Si c'est déjà matché, on dé-matche
    const rightIdMatched = Object.keys(matches).find(k => matches[k] === id);
    if (rightIdMatched) {
      const newMatches = { ...matches };
      delete newMatches[rightIdMatched];
      setMatches(newMatches);
      onUpdate(newMatches);
      return;
    }
    
    setSelectedLeft(id === selectedLeft ? null : id);
    checkMatch(id === selectedLeft ? null : id, selectedRight);
  };

  const handleRightClick = (id: string) => {
    if (isAnswerChecked) return;
    if (matches[id]) {
      const newMatches = { ...matches };
      delete newMatches[id];
      setMatches(newMatches);
      onUpdate(newMatches);
      return;
    }

    setSelectedRight(id === selectedRight ? null : id);
    checkMatch(selectedLeft, id === selectedRight ? null : id);
  };

  const checkMatch = (leftId: string | null, rightId: string | null) => {
    if (leftId && rightId) {
      setMatches(prev => {
        const newMatches = { ...prev, [rightId]: leftId };
        onUpdate(newMatches);
        return newMatches;
      });
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const isMatchedLeft = (id: string) => Object.values(matches).includes(id);
  const isMatchedRight = (id: string) => !!matches[id];
  const isCorrectMatch = (leftId: string, rightId: string) => leftId === rightId; // because id is same in Pair

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-xl mx-auto">
      {/* Colonne Darija (Left) */}
      <div className="space-y-4">
        {leftItems.map(item => {
          const matchedWith = Object.keys(matches).find(k => matches[k] === item.id);
          const isError = isAnswerChecked && matchedWith && !isCorrectMatch(item.id, matchedWith);
          const isSuccess = isAnswerChecked && matchedWith && isCorrectMatch(item.id, matchedWith);

          return (
            <button
              key={`left-${item.id}`}
              onClick={() => handleLeftClick(item.id)}
              disabled={isAnswerChecked}
              className={`
                w-full p-4 rounded-xl border-2 text-center font-bold transition-all shadow-xs
                ${selectedLeft === item.id ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-500/40 scale-105 shadow-md' : 'border-slate-300 bg-white text-[#1B2A4A] hover:border-slate-400'}
                ${isMatchedLeft(item.id) && !isAnswerChecked ? 'bg-amber-50/90 border-[#C9A05C] text-[#1B2A4A] ring-1 ring-[#C9A05C]/40' : ''}
                ${isSuccess ? 'bg-emerald-100 border-emerald-600 text-emerald-950' : ''}
                ${isError ? 'bg-red-100 border-red-600 text-red-950' : ''}
              `}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {/* Colonne Français (Right) */}
      <div className="space-y-4">
        {rightItems.map(item => {
          const isError = isAnswerChecked && matches[item.id] && !isCorrectMatch(matches[item.id], item.id);
          const isSuccess = isAnswerChecked && matches[item.id] && isCorrectMatch(matches[item.id], item.id);

          return (
            <button
              key={`right-${item.id}`}
              onClick={() => handleRightClick(item.id)}
              disabled={isAnswerChecked}
              className={`
                w-full p-4 rounded-xl border-2 text-center font-bold transition-all shadow-xs
                ${selectedRight === item.id ? 'border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-500/40 scale-105 shadow-md' : 'border-slate-300 bg-white text-[#1B2A4A] hover:border-slate-400'}
                ${isMatchedRight(item.id) && !isAnswerChecked ? 'bg-amber-50/90 border-[#C9A05C] text-[#1B2A4A] ring-1 ring-[#C9A05C]/40' : ''}
                ${isSuccess ? 'bg-emerald-100 border-emerald-600 text-emerald-950' : ''}
                ${isError ? 'bg-red-100 border-red-600 text-red-950' : ''}
              `}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

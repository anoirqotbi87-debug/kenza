'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, Notation } from '../../../types/curriculum';
import { useTranslation } from '../../../store/useAppStore';
import { getLocalizedText } from '../../../lib/i18n/utils';

interface MatchingExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  onUpdate: (matches: Record<string, string>) => void;
  isAnswerChecked: boolean;
}

export default function MatchingExercise({ exercise, preferredNotation, onUpdate, isAnswerChecked }: MatchingExerciseProps) {
  const [leftItems, setLeftItems] = useState<{id: string, text: string}[]>([]);
  const [rightItems, setRightItems] = useState<{id: string, text: string}[]>([]);
  const { lang } = useTranslation();
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // rightId -> leftId

  useEffect(() => {
    if (exercise.pairs) {
      const lefts = exercise.pairs.map(p => ({ id: p.id, text: p.left.text })).sort(() => Math.random() - 0.5);
      const rights = exercise.pairs.map(p => ({ id: p.id, text: getLocalizedText(p.right.text, lang) })).sort(() => Math.random() - 0.5);
      setLeftItems(lefts);
      setRightItems(rights);
      setMatches({});
      setSelectedLeft(null);
      setSelectedRight(null);
      onUpdate({});
    }
  }, [exercise, onUpdate, lang]);

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
      const newMatches = { ...matches, [rightId]: leftId };
      setMatches(newMatches);
      onUpdate(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const isMatchedLeft = (id: string) => Object.values(matches).includes(id);
  const isMatchedRight = (id: string) => !!matches[id];
  const isCorrectMatch = (leftId: string, rightId: string) => leftId === rightId; // because id is same in Pair

  return (
    <div className="grid grid-cols-2 gap-8 w-full max-w-xl mx-auto">
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
                w-full p-4 rounded-xl border-2 text-center font-bold transition-all shadow-sm
                ${selectedLeft === item.id ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 bg-white hover:border-slate-300'}
                ${isMatchedLeft(item.id) && !isAnswerChecked ? 'bg-slate-100 border-slate-300 opacity-70' : ''}
                ${isSuccess ? 'bg-green-100 border-green-500 text-green-800' : ''}
                ${isError ? 'bg-red-100 border-red-500 text-red-800' : ''}
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
                w-full p-4 rounded-xl border-2 text-center font-medium transition-all shadow-sm
                ${selectedRight === item.id ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-200 bg-white hover:border-slate-300'}
                ${isMatchedRight(item.id) && !isAnswerChecked ? 'bg-slate-100 border-slate-300 opacity-70' : ''}
                ${isSuccess ? 'bg-green-100 border-green-500 text-green-800' : ''}
                ${isError ? 'bg-red-100 border-red-500 text-red-800' : ''}
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

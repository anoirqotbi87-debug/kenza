'use client';

import React, { useState, useEffect } from 'react';
import { Exercise, Notation } from '../../../types/curriculum';

const getWordText = (item: any): string => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  
  if (item.arabizi) return item.arabizi;
  if (item.arabic) return item.arabic;
  if (typeof item.text === 'string') return item.text;
  if (item.label) return typeof item.label === 'string' ? item.label : String(item.label);
  if (item.word) return String(item.word);
  if (item.value) return String(item.value);
  if (item.content) return String(item.content);

  const strVal = Object.values(item).find(v => typeof v === 'string' && v.length > 0 && !v.startsWith('http') && v !== item.id);
  if (strVal) return String(strVal);

  return JSON.stringify(item);
};

interface ReorderExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  onUpdate: (orderedIds: string[]) => void;
  isAnswerChecked: boolean;
}

export default function ReorderExercise({ exercise, preferredNotation, onUpdate, isAnswerChecked }: ReorderExerciseProps) {
  const [orderedWords, setOrderedWords] = useState<any[]>([]);
  const [availableWords, setAvailableWords] = useState<any[]>([]);

  const getTextForNotation = (item: any, notation: Notation) => {
    if (typeof item === 'string') return item;
    if (notation === 'arabizi' && item.arabizi) return item.arabizi;
    if (notation === 'arabic' && item.arabic) return <span className="font-arabic">{item.arabic}</span>;
    if (notation === 'duo' && item.arabizi && item.arabic) return (
      <div className="flex flex-col items-center leading-tight">
        <span className="text-orange-600 font-bold text-sm">{item.arabizi}</span>
        <span className="text-slate-800 font-arabic text-lg">{item.arabic}</span>
      </div>
    );
    if (item.translation) return item.translation;
    return getWordText(item);
  };

  useEffect(() => {
    if (exercise.options) {
      const words = exercise.options.map(opt => ({
        ...opt,
        id: opt.id || getWordText(opt),
        displayText: getTextForNotation(opt, preferredNotation)
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
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-transform active:scale-95 flex items-center justify-center min-w-[50px] text-slate-900 font-bold"
          >
            {word.displayText || getWordText(word)}
          </button>
        ))}
      </div>
      
      {/* Zone des blocs de mots disponibles */}
      <div className="flex flex-wrap gap-2.5 justify-center items-center my-6 max-w-md mx-auto min-h-[100px]">
        {availableWords.map((word, index) => (
          <button
            key={`avail-${word.id}-${index}`}
            onClick={() => handleAdd(word)}
            disabled={isAnswerChecked}
            className={`
              w-auto px-4 py-2.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl font-bold text-base shadow-sm transition-all flex items-center justify-center min-w-[50px] text-center
              ${isAnswerChecked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100 hover:shadow-md active:scale-95'}
            `}
          >
            {word.displayText || getWordText(word)}
          </button>
        ))}
      </div>
    </div>
  );
}

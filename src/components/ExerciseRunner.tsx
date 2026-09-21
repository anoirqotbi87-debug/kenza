'use client';

import React, { useState, useEffect } from 'react';
import { Lesson, LessonStep, Notation } from '../types/curriculum';
import { useAppStore } from '../store/useAppStore';
import { X, Check, Volume2, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseRunnerProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

export default function ExerciseRunner({ lesson, onComplete, onClose }: ExerciseRunnerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<{id: string, text: string}[]>([]);
  const [availableWords, setAvailableWords] = useState<{id: string, text: string}[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { preferredNotation, addXp, soundEnabled } = useAppStore();
  const step = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex) / lesson.steps.length) * 100;

  // Init reorder exercise words
  useEffect(() => {
    if (step.type === 'exercise' && step.exercise?.type === 'reorder' && step.exercise.options) {
      const words = step.exercise.options.map(opt => ({
        id: opt.id,
        text: getTextForNotation(opt, preferredNotation)
      }));
      // Shuffle available words
      setAvailableWords(words.sort(() => Math.random() - 0.5));
      setOrderedWords([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, step, preferredNotation]);

  const getTextForNotation = (item: any, notation: Notation) => {
    if (notation === 'arabizi') return item.arabizi;
    if (notation === 'arabic') return item.arabic;
    return item.translation;
  };

  const playAudio = (text: string) => {
    if (!soundEnabled) return;
    // Fallback simple Text-to-Speech (Note: TTS arabe marocain est limité, à remplacer par Howler.js en prod avec vrais audios)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-MA'; 
    window.speechSynthesis.speak(utterance);
  };

  const handleCheckAnswer = () => {
    if (step.type !== 'exercise' || !step.exercise) return;

    let correct = false;
    if (step.exercise.type === 'mcq') {
      correct = selectedOptionId === step.exercise.answer;
    } else if (step.exercise.type === 'reorder') {
      const answerArr = step.exercise.answer as string[];
      correct = orderedWords.length === answerArr.length && 
                orderedWords.every((word, idx) => word.id === answerArr[idx]);
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    
    if (correct) {
      // Play success sound
      addXp(10);
    } else {
      // Play error sound
    }
  };

  const handleNext = () => {
    setIsAnswerChecked(false);
    setSelectedOptionId(null);
    setIsCorrect(false);

    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
    } else {
      onComplete();
    }
  };

  const renderContent = () => {
    if (step.type === 'learning' && step.content) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-in fade-in zoom-in duration-300">
          <h2 className="text-3xl font-bold text-slate-800">{step.content.title}</h2>
          
          <div className="bg-orange-50 p-8 rounded-3xl w-full max-w-md shadow-sm border border-orange-100 relative">
            <button 
              onClick={() => playAudio(step.content!.arabic)}
              className="absolute -top-4 -right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <div className="text-5xl font-extrabold text-orange-600 mb-4 font-arabic">
              {preferredNotation === 'arabic' ? step.content.arabic : step.content.arabizi}
            </div>
            {preferredNotation !== 'translation' && (
              <div className="text-xl text-slate-600 font-medium">{step.content.translation}</div>
            )}
            {preferredNotation === 'translation' && (
              <div className="text-xl text-slate-600 font-medium">{step.content.arabizi}</div>
            )}
          </div>
          
          <p className="text-lg text-slate-600 max-w-lg">{step.content.description}</p>

          {step.content.culturalNote && (
            <div className="bg-amber-50 p-4 rounded-xl flex gap-3 text-left w-full max-w-lg">
              <Info className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-amber-800 text-sm">{step.content.culturalNote}</p>
            </div>
          )}
        </div>
      );
    }

    if (step.type === 'exercise' && step.exercise) {
      return (
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right duration-300">
          <h2 className="text-2xl font-bold text-slate-800">{step.exercise.prompt}</h2>
          
          {step.exercise.type === 'mcq' && step.exercise.options && (
            <div className="grid grid-cols-1 gap-4">
              {step.exercise.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => !isAnswerChecked && setSelectedOptionId(opt.id)}
                  disabled={isAnswerChecked}
                  className={`
                    p-6 rounded-2xl border-2 text-left text-lg font-medium transition-all
                    ${selectedOptionId === opt.id && !isAnswerChecked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
                    ${isAnswerChecked && opt.id === step.exercise!.answer ? 'border-green-500 bg-green-50 text-green-700' : ''}
                    ${isAnswerChecked && selectedOptionId === opt.id && opt.id !== step.exercise!.answer ? 'border-red-500 bg-red-50 text-red-700' : ''}
                  `}
                >
                  {getTextForNotation(opt, preferredNotation)}
                </button>
              ))}
            </div>
          )}

          {step.exercise.type === 'reorder' && (
            <div className="space-y-8">
              {/* Drop zone */}
              <div className="min-h-[80px] p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap gap-2 items-center">
                {orderedWords.map((word, idx) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      if(isAnswerChecked) return;
                      setOrderedWords(prev => prev.filter((_, i) => i !== idx));
                      setAvailableWords(prev => [...prev, word]);
                    }}
                    className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium shadow-sm hover:border-slate-300"
                  >
                    {word.text}
                  </button>
                ))}
              </div>
              
              {/* Source words */}
              <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
                {availableWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      if(isAnswerChecked) return;
                      setAvailableWords(prev => prev.filter(w => w.id !== word.id));
                      setOrderedWords(prev => [...prev, word]);
                    }}
                    className="px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium shadow-sm hover:border-slate-300 text-slate-800"
                  >
                    {word.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header with progress */}
      <header className="p-4 flex items-center gap-4 max-w-4xl mx-auto w-full">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        {renderContent()}
      </main>

      {/* Bottom Action Bar */}
      <div className={`
        border-t-2 p-4 md:p-6 transition-colors duration-300
        ${isAnswerChecked ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white border-slate-100'}
      `}>
        <div className="max-w-4xl mx-auto w-full flex justify-between items-center h-16">
          
          <div className="flex-1">
            {isAnswerChecked && (
              <div className={`flex items-center gap-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                  {isCorrect ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="font-bold text-xl">{isCorrect ? 'Excellent !' : 'Oups...'}</h3>
                  {step.type === 'exercise' && step.exercise?.explanation && (
                    <p className="text-sm opacity-90">{step.exercise.explanation}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            {!isAnswerChecked && step.type === 'exercise' ? (
              <button 
                onClick={handleCheckAnswer}
                disabled={
                  (step.exercise?.type === 'mcq' && !selectedOptionId) ||
                  (step.exercise?.type === 'reorder' && orderedWords.length === 0)
                }
                className="px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg shadow-sm transition-all"
              >
                Vérifier
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-2
                  ${isAnswerChecked && isCorrect ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                  ${isAnswerChecked && !isCorrect ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${!isAnswerChecked && step.type === 'learning' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                `}
              >
                Continuer <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

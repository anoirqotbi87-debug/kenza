'use client';

import React, { useState, useEffect } from 'react';
import { Lesson, Notation } from '../types/curriculum';
import { useAppStore, useTranslation } from '../store/useAppStore';
import { X, Check, Volume2, Info, ArrowRight, Heart, HeartCrack, Trophy } from 'lucide-react';
import McqExercise from './lessons/exercises/McqExercise';
import ReorderExercise from './lessons/exercises/ReorderExercise';
import MatchingExercise from './lessons/exercises/MatchingExercise';
import FillBlankExercise from './lessons/exercises/FillBlankExercise';
import ScenarioDialogue from './dialogue/ScenarioDialogue';
import { playAudio } from '../lib/audio';
import ConjugationTable from './grammar/ConjugationTable';
import { getLocalizedText } from '../lib/i18n/utils';
import { renderArabiziWithBadges } from './ui/PhoneticBadge';

interface ExerciseRunnerProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

export default function ExerciseRunner({ lesson, onComplete, onClose }: ExerciseRunnerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { t, lang } = useTranslation();
  
  // Exercise states
  const [selectedMcqId, setSelectedMcqId] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null);

  // Lesson states
  const [lives, setLives] = useState(3);
  const [xpGained, setXpGained] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const { preferredNotation, addXp, soundEnabled, audioSpeed, setAudioSpeed } = useAppStore();
  const step = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex) / lesson.steps.length) * 100;

  const handleCheckAnswer = () => {
    if (step.type !== 'exercise' || !step.exercise) return;

    let correct = false;
    const { type, answer } = step.exercise;

    if (type === 'mcq') {
      correct = selectedMcqId === answer;
    } else if (type === 'reorder') {
      const answerArr = answer as string[];
      correct = orderedWords.length === answerArr.length && 
                orderedWords.every((id, idx) => id === answerArr[idx]);
    } else if (type === 'fill-blank') {
      correct = selectedBlankId === answer;
    } else if (type === 'matching' || type === 'match') {
      const correctMapping = step.exercise.pairs?.reduce((acc, p) => {
        acc[p.id] = p.id;
        return acc;
      }, {} as Record<string, string>) || {};
      
      const isAllMatched = Object.keys(correctMapping).length === Object.keys(matches).length;
      correct = isAllMatched && Object.keys(correctMapping).every(k => matches[k] === correctMapping[k]);
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    
    if (correct) {
      setXpGained(prev => prev + 10);
      playAudio('correct', undefined, soundEnabled, audioSpeed);
    } else {
      setLives(prev => Math.max(0, prev - 1));
      playAudio('error', undefined, soundEnabled, audioSpeed);
    }
  };

  const handleNext = () => {
    setIsAnswerChecked(false);
    setSelectedMcqId(null);
    setOrderedWords([]);
    setMatches({});
    setSelectedBlankId(null);
    setIsCorrect(false);

    if (lives === 0) {
      return;
    }

    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
    } else {
      setIsLessonFinished(true);
      addXp(xpGained);
    }
  };

  const handlePlayAudio = (text: string, audioUrl?: string) => {
    playAudio(text, audioUrl, soundEnabled, audioSpeed);
  };

  if (lives === 0 && !isLessonFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4 text-center">
        <HeartCrack className="w-24 h-24 text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.lessons.gameOver}</h2>
        <button onClick={onClose} className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-2xl font-bold text-lg">
          {t.lessons.retry}
        </button>
      </div>
    );
  }

  if (isLessonFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-8 shadow-inner border-4 border-amber-50">
          <Trophy className="w-16 h-16 text-amber-500" />
        </div>
        <h2 className="text-4xl font-black text-amber-500 mb-2">{t.lessons.congrats}</h2>

        <div className="flex gap-8 mb-12">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl min-w-[140px]">
            <div className="text-blue-500 text-sm font-bold uppercase mb-1">XP</div>
            <div className="text-3xl font-black text-blue-600">+{xpGained}</div>
          </div>
          <div className="bg-red-50 border border-red-100 p-6 rounded-3xl min-w-[140px]">
            <div className="text-red-500 text-sm font-bold uppercase mb-1">{t.lessons.lives}</div>
            <div className="text-3xl font-black text-red-600 flex justify-center gap-1 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'text-red-200'}`} />
              ))}
            </div>
          </div>
        </div>

        <button onClick={onComplete} className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 w-full max-w-sm">
          {t.lessons.continue}
        </button>
      </div>
    );
  }

  const renderContent = () => {
    // 1. Learning screens
    if (step.type === 'learning' && step.content) {
      const titleText = getLocalizedText(step.content.title, lang, 'fr');
      if (titleText === "Grammaire Active") {
         return <ConjugationTable />;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-in fade-in zoom-in duration-300">
          <h2 className="text-3xl font-bold text-slate-800">{getLocalizedText(step.content.title, lang)}</h2>
          
          <div className="bg-orange-50 p-8 rounded-3xl w-full max-w-md shadow-sm border border-orange-100 relative">
            <button 
              onClick={() => handlePlayAudio(step.content!.arabic, step.content!.audioUrl)}
              className="absolute -top-4 -right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <div className="text-5xl font-extrabold text-orange-600 mb-4 font-arabic flex items-center justify-center flex-wrap">
              {preferredNotation === 'arabic' 
                ? step.content.arabic 
                : renderArabiziWithBadges(step.content.arabizi)}
            </div>
            <div className="text-xl text-slate-600 font-medium">{getLocalizedText(step.content.translation, lang)}</div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-lg">{getLocalizedText(step.content.description, lang)}</p>

          {step.content.culturalNote && (
            <div className="bg-amber-50 p-4 rounded-xl flex gap-3 text-left w-full max-w-lg">
              <Info className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-amber-800 text-sm">{getLocalizedText(step.content.culturalNote, lang)}</p>
            </div>
          )}
        </div>
      );
    }

    // 2. Exercises
    if (step.type === 'exercise' && step.exercise) {
      return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-800">{getLocalizedText(step.exercise.prompt, lang)}</h2>
            {step.exercise.audioUrl && (
              <button onClick={() => handlePlayAudio('', step.exercise?.audioUrl)} className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors">
                <Volume2 className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {step.exercise.type === 'mcq' && (
            <McqExercise 
              exercise={step.exercise} 
              preferredNotation={preferredNotation}
              selectedOptionId={selectedMcqId}
              onSelect={setSelectedMcqId}
              isAnswerChecked={isAnswerChecked}
            />
          )}

          {step.exercise.type === 'reorder' && (
            <ReorderExercise 
              exercise={step.exercise} 
              preferredNotation={preferredNotation}
              onUpdate={setOrderedWords}
              isAnswerChecked={isAnswerChecked}
            />
          )}

          {step.exercise.type === 'fill-blank' && (
            <FillBlankExercise 
              exercise={step.exercise} 
              preferredNotation={preferredNotation}
              onUpdate={setSelectedBlankId}
              isAnswerChecked={isAnswerChecked}
            />
          )}

          {(step.exercise.type === 'matching' || step.exercise.type === 'match') && (
            <MatchingExercise 
              exercise={step.exercise} 
              preferredNotation={preferredNotation}
              onUpdate={setMatches}
              isAnswerChecked={isAnswerChecked}
            />
          )}

          {step.exercise.type === 'dialogue' && (
            <ScenarioDialogue
              exercise={step.exercise}
              preferredNotation={preferredNotation}
              onComplete={(isOptimal) => {
                // Pour le dialogue, on déclenche directement la vérification
                setIsCorrect(isOptimal);
                setIsAnswerChecked(true);
                if (isOptimal) {
                  setXpGained(prev => prev + 15);
                  playAudio('correct', undefined, soundEnabled);
                } else {
                  playAudio('error', undefined, soundEnabled);
                }
              }}
              isAnswerChecked={isAnswerChecked}
            />
          )}
        </div>
      );
    }
  };

  const isCheckDisabled = () => {
    if (!step.exercise) return false;
    if (step.exercise.type === 'mcq') return !selectedMcqId;
    if (step.exercise.type === 'reorder') return orderedWords.length === 0;
    if (step.exercise.type === 'fill-blank') return !selectedBlankId;
    if (step.exercise.type === 'matching' || step.exercise.type === 'match') return Object.keys(matches).length !== (step.exercise.pairs?.length || 0);
    return false;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-6 max-w-5xl mx-auto w-full">
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setAudioSpeed(audioSpeed === 1.0 ? 0.75 : 1.0)}
            className="text-slate-400 hover:text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-sm transition-colors"
            title="Vitesse de lecture"
          >
            {audioSpeed}x
          </button>
          <div className="flex gap-1 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart key={i} className={`w-6 h-6 transition-all ${i < lives ? 'fill-red-500 text-red-500' : 'text-red-200'}`} />
            ))}
          </div>
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
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center min-h-[64px]">
          
          <div className="flex-1">
            {isAnswerChecked && (
              <div className={`flex items-center gap-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                <div className={`p-3 rounded-full ${isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
                  {isCorrect ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{isCorrect ? 'Excellent !' : 'Oups !'}</h3>
                  {step.type === 'exercise' && step.exercise?.explanation && (
                    <p className="text-base font-medium opacity-90 mt-1">{getLocalizedText(step.exercise.explanation, lang)}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            {!isAnswerChecked && step.type === 'exercise' ? (
              <button 
                onClick={handleCheckAnswer}
                disabled={isCheckDisabled()}
                className="px-10 py-4 bg-green-500 hover:bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg shadow-sm transition-all active:scale-95"
              >
                {t.lessons.check}
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-2 active:scale-95
                  ${isAnswerChecked && isCorrect ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                  ${isAnswerChecked && !isCorrect ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                  ${!isAnswerChecked && step.type === 'learning' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                `}
              >
                {t.lessons.continue} <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

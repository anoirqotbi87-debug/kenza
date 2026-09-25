'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, ArrowRight, Volume2 } from 'lucide-react';
import { srsVocabulary } from '../../data/srs-deck';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { playAudio } from '../../lib/audio';
import { getVariantForWord } from '../../data/regionalVariants';
import CheckpointResult from './CheckpointResult';

interface CheckpointModalProps {
  levelId: string;
  levelName: string;
  onClose: () => void;
}

export default function CheckpointModal({ levelId, levelName, onClose }: CheckpointModalProps) {
  const { lang } = useTranslation();
  const { soundEnabled, preferredNotation, regionalVariant } = useAppStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Generate 12 random questions from vocabulary
  const questions = useMemo(() => {
    if (levelId === '3') {
      return require('../../data/checkpoints/checkpointA2').checkpointA2.questions.map((q: any) => ({
        id: q.id,
        prompt: q.prompt,
        answerId: q.answerId,
        arabizi: q.arabizi,
        arabic: q.arabic,
        options: q.options
      })).sort(() => 0.5 - Math.random()).slice(0, 12);
    }

    // Shuffle all words
    const shuffled = [...srsVocabulary].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 12);
    
    return selected.map(word => {
      // Pick 3 random distractors
      const distractors = [...srsVocabulary]
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
      const options = [word, ...distractors]
        .sort(() => 0.5 - Math.random())
        .map(opt => {
          const variant = getVariantForWord(opt.arabizi, regionalVariant);
          const tMap: any = (opt as any).translations || (opt as any).translation || { fr: '' };
          const translated = typeof tMap === 'string' ? tMap : tMap[lang] || tMap.fr;
          return {
            id: opt.id,
            arabizi: variant ? variant.variant : opt.arabizi,
            arabic: variant ? variant.variantArabic : opt.arabic,
            translation: translated
          };
        });

      const variant = getVariantForWord(word.arabizi, regionalVariant);
      const tMap: any = (word as any).translations || (word as any).translation || { fr: '' };
      const translated = typeof tMap === 'string' ? tMap : tMap[lang] || tMap.fr;

      return {
        id: word.id,
        prompt: translated,
        answerId: word.id,
        arabizi: variant ? variant.variant : word.arabizi,
        arabic: variant ? variant.variantArabic : word.arabic,
        options
      };
    });
  }, [lang, regionalVariant, levelId]);

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleCheck = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === currentQ.answerId;
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      playAudio('correct', undefined, soundEnabled);
    } else {
      playAudio('error', undefined, soundEnabled);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <CheckpointResult 
        levelId={levelId}
        levelName={levelName}
        score={score}
        totalQuestions={questions.length}
        onClose={onClose}
        onRetry={() => {
          setCurrentIndex(0);
          setScore(0);
          setSelectedOption(null);
          setIsAnswerChecked(false);
          setShowResult(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col">
      {/* Header Progress */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm relative z-10">
        <button 
          onClick={onClose} 
          className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-8 flex items-center justify-center">
          <div className="font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-sm">
            {currentIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-8 pt-4">
          <div className="inline-block bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
            Examen {levelId.toUpperCase()}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Comment dit-on :
          </h2>
          <div className="text-3xl sm:text-4xl font-bold text-blue-600 mt-4">
            "{currentQ.prompt}"
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto sm:mt-8">
          {currentQ.options.map(opt => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = isAnswerChecked && opt.id === currentQ.answerId;
            const isWrongSelection = isAnswerChecked && isSelected && opt.id !== currentQ.answerId;

            return (
              <button
                key={opt.id}
                onClick={() => !isAnswerChecked && setSelectedOption(opt.id)}
                disabled={isAnswerChecked}
                className={`
                  p-6 rounded-2xl border-2 text-center transition-all min-h-[100px] flex flex-col items-center justify-center gap-2
                  ${isSelected && !isAnswerChecked ? 'border-blue-500 bg-blue-50 shadow-md transform -translate-y-1' : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'}
                  ${isCorrectOption ? 'border-green-500 bg-green-50 text-green-800 shadow-md' : ''}
                  ${isWrongSelection ? 'border-red-500 bg-red-50 text-red-800 shadow-inner' : ''}
                  ${isAnswerChecked && !isCorrectOption && !isWrongSelection ? 'opacity-40 grayscale' : ''}
                `}
              >
                {(preferredNotation === 'arabizi' || preferredNotation === 'duo') && (
                  <span className="font-bold text-lg">{opt.arabizi}</span>
                )}
                {(preferredNotation === 'arabic' || preferredNotation === 'duo') && (
                  <span className="font-arabic text-xl text-slate-500">{opt.arabic}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`p-4 sm:p-6 border-t-2 bg-white transition-colors duration-300 ${
        isAnswerChecked ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-slate-100'
      }`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          
          {isAnswerChecked ? (
            <div className={`flex items-center gap-3 font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              </div>
              <div>
                {isCorrect ? 'Excellent !' : 'Incorrect'}
                {!isCorrect && (
                  <div className="text-sm font-medium mt-1 opacity-80 flex items-center gap-2">
                    Réponse : {currentQ.arabizi}
                    <button 
                      onClick={(e) => { e.stopPropagation(); playAudio(currentQ.arabizi, currentQ.arabic, soundEnabled); }}
                      className="p-1 bg-red-100 hover:bg-red-200 rounded-full"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div /> // Empty placeholder for spacing
          )}

          <button
            onClick={isAnswerChecked ? handleNext : handleCheck}
            disabled={!selectedOption && !isAnswerChecked}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all shadow-md active:scale-95
              ${(!selectedOption && !isAnswerChecked) ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 
                isAnswerChecked ? (isCorrect ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white') : 
                'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1 hover:shadow-lg'}
            `}
          >
            {isAnswerChecked ? 'Continuer' : 'Vérifier'}
            {isAnswerChecked && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

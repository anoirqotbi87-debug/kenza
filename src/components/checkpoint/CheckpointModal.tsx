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

    if (levelId === '4') {
      return require('../../data/checkpoints/checkpointB1').checkpointB1.questions.map((q: any) => ({
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
      
      const options = [
        { id: word.id, arabizi: word.arabizi, arabic: word.arabic },
        ...distractors.map(d => ({ id: d.id, arabizi: d.arabizi, arabic: d.arabic }))
      ].sort(() => 0.5 - Math.random());

      const tMap: any = (word as any).translations || (word as any).translation || { fr: '' };
      const prompt = typeof tMap === 'string' ? tMap : tMap[lang] || tMap.fr;

      return {
        id: word.id,
        prompt,
        answerId: word.id,
        arabizi: word.arabizi,
        arabic: word.arabic,
        options
      };
    });
  }, [levelId, lang]);

  const currentQ = questions[currentIndex];
  const progress = Math.round(((currentIndex) / questions.length) * 100);

  const handleCheck = () => {
    if (!selectedOption) return;
    const correct = selectedOption === currentQ.answerId;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
    setIsAnswerChecked(true);

    if (soundEnabled) {
      playAudio(currentQ.arabizi, currentQ.arabic, true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
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
        total={questions.length}
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
    <div className="fixed inset-0 z-50 bg-[#F7F3EA] flex flex-col">
      {/* Header Progress */}
      <div className="bg-[#FDFCF8] px-4 py-4 flex items-center gap-4 shadow-xs border-b border-[#E8E2D5] relative z-10">
        <button 
          onClick={onClose} 
          className="p-2 text-[#7A7670] hover:text-[#1B2A4A] hover:bg-[#E8E2D5]/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 h-2.5 bg-[#E8E2D5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#7A9174] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="w-auto flex items-center justify-center">
          <div className="font-bold text-[#1B2A4A] bg-[#C9A05C]/20 border border-[#C9A05C]/40 px-3 py-1 rounded-full text-xs">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col max-w-3xl mx-auto w-full">
        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase mb-2">
            <span>—</span>
            <span>Examen {levelId.toUpperCase()}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#7A7670] font-normal">
            Comment dit-on en Darija :
          </h2>
          <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B2A4A] mt-2">
            « {currentQ.prompt} »
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto sm:mt-8">
          {currentQ.options.map((opt: any) => {
            const isSelected = selectedOption === opt.id;
            const isCorrectOption = isAnswerChecked && opt.id === currentQ.answerId;
            const isWrongSelection = isAnswerChecked && isSelected && opt.id !== currentQ.answerId;

            return (
              <button
                key={opt.id}
                onClick={() => !isAnswerChecked && setSelectedOption(opt.id)}
                disabled={isAnswerChecked}
                className={`
                  p-6 rounded-3xl border text-center transition-all min-h-[100px] flex flex-col items-center justify-center gap-1 shadow-xs
                  ${isSelected && !isAnswerChecked ? 'border-2 border-[#C9A05C] bg-[#C9A05C]/10 text-[#1B2A4A] shadow-md -translate-y-0.5' : 'border-[#E8E2D5] bg-[#FDFCF8] hover:border-[#C9A05C]/60'}
                  ${isCorrectOption ? 'border-2 border-[#7A9174] bg-[#7A9174]/15 text-[#1B2A4A] shadow-sm' : ''}
                  ${isWrongSelection ? 'border-2 border-red-400 bg-red-50 text-red-800' : ''}
                  ${isAnswerChecked && !isCorrectOption && !isWrongSelection ? 'opacity-40 grayscale' : ''}
                `}
              >
                {(preferredNotation === 'arabizi' || preferredNotation === 'duo') && (
                  <span className="font-serif font-bold text-lg text-[#1B2A4A]">{opt.arabizi}</span>
                )}
                {(preferredNotation === 'arabic' || preferredNotation === 'duo') && (
                  <span className="font-arabic text-xl text-[#7A7670]">{opt.arabic}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`p-4 sm:p-6 border-t bg-[#FDFCF8] transition-colors duration-300 ${
        isAnswerChecked ? (isCorrect ? 'border-[#7A9174]/40 bg-[#7A9174]/10' : 'border-red-200 bg-red-50') : 'border-[#E8E2D5]'
      }`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          
          {isAnswerChecked ? (
            <div className={`flex items-center gap-3 font-bold text-base ${isCorrect ? 'text-[#7A9174]' : 'text-red-700'}`}>
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-[#7A9174]/20 text-[#7A9174]' : 'bg-red-100 text-red-600'}`}>
                {isCorrect ? <Check className="w-5 h-5 stroke-[2.5]" /> : <X className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-serif text-lg">{isCorrect ? 'Excellente réponse !' : 'Incorrect'}</span>
                {!isCorrect && (
                  <div className="text-xs font-medium mt-0.5 opacity-80 flex items-center gap-2">
                    Réponse correcte : {currentQ.arabizi}
                    <button 
                      onClick={(e) => { e.stopPropagation(); playAudio(currentQ.arabizi, currentQ.arabic, soundEnabled); }}
                      className="p-1 bg-red-100 hover:bg-red-200 rounded-full"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={isAnswerChecked ? handleNext : handleCheck}
            disabled={!selectedOption && !isAnswerChecked}
            className={`
              px-8 py-3.5 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md active:scale-95
              ${(!selectedOption && !isAnswerChecked) ? 'bg-[#E8E2D5] text-[#7A7670] shadow-none cursor-not-allowed' : 
                isAnswerChecked ? (isCorrect ? 'bg-[#7A9174] hover:bg-[#687e63] text-white' : 'bg-red-600 hover:bg-red-700 text-white') : 
                'bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] shadow-lg'}
            `}
          >
            <span>{isAnswerChecked ? 'Continuer' : 'Vérifier'}</span>
            {isAnswerChecked && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

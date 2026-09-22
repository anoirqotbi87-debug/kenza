'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Info } from 'lucide-react';
import { VocabularySRSData, ReviewGrade, SRSCard } from '../../types/srs';
import { playAudio } from '../../lib/audio';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { getLocalizedText } from '../../lib/i18n/utils';
import CardIllustration from './CardIllustration';

interface FlashcardDeckProps {
  cards: SRSCard[];
  vocabulary: VocabularySRSData[];
  onComplete: () => void;
}

export default function FlashcardDeck({ cards, vocabulary, onComplete }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { preferredNotation, soundEnabled, reviewCard } = useAppStore();
  const { lang, t } = useTranslation();

  const currentSRSCard = cards[currentIndex];
  const wordData = currentSRSCard ? vocabulary.find(v => v.id === currentSRSCard.wordId) : null;

  const handleGrade = useCallback((grade: ReviewGrade) => {
    if (!currentSRSCard) return;
    
    reviewCard(currentSRSCard.wordId, grade);
    
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }, 150);
  }, [currentSRSCard, currentIndex, cards.length, onComplete, reviewCard]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!wordData) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(true);
      } else if (isFlipped) {
        if (e.key === '1') { e.preventDefault(); handleGrade('again'); }
        if (e.key === '2') { e.preventDefault(); handleGrade('hard'); }
        if (e.key === '3') { e.preventDefault(); handleGrade('good'); }
        if (e.key === '4') { e.preventDefault(); handleGrade('easy'); }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, wordData, handleGrade]);

  if (!wordData) {
    return <div className="text-center p-8">{t.dashboard?.loading || "Chargement..."}</div>;
  }

  // Highlight specific phonetic numbers in Arabizi
  const formatArabizi = (text: string) => {
    return text.split(/(3|7|9|kh)/i).map((part, i) => {
      if (/^(3|7|9|kh)$/i.test(part)) {
        return <span key={i} className="text-orange-500 font-bold">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(wordData.arabic, wordData.audioUrl, soundEnabled);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-[600px] perspective-1000">
      
      {/* Progress */}
      <div className="w-full mb-8 flex justify-between items-center text-slate-500 font-medium">
        <span>{t.dashboard?.remainingCards || "Cartes restantes :"} {cards.length - currentIndex}</span>
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-2 rounded-full ${i < currentIndex ? 'bg-green-400' : i === currentIndex ? 'bg-blue-500' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>

      {/* 3D Flip Card */}
      <div 
        className="relative w-full h-[350px] cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center justify-center">
            {wordData.category && (
              <div className="absolute top-4 left-4 bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-bold">
                {wordData.category}
              </div>
            )}
            
            <CardIllustration illustration={wordData.illustration} />
            
            <h2 className="text-4xl font-bold text-slate-800 text-center mb-6">
              {getLocalizedText(wordData.translation, lang)}
            </h2>
            
            {!isFlipped && (
              <div className="absolute bottom-6 text-slate-400 text-sm animate-pulse flex flex-col items-center gap-2">
                <span>{t.srs.tapToFlip}</span>
              </div>
            )}
          </div>

          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center justify-center"
            style={{ transform: 'rotateX(180deg)' }}
          >
            <button 
              onClick={handlePlayAudio}
              className="absolute top-6 right-6 p-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
            >
              <Volume2 className="w-6 h-6" />
            </button>

            <div className="text-center space-y-4 w-full">
              <CardIllustration illustration={wordData.illustration} />
              
              {/* Display Logic Based on Notation Preference */}
              {(preferredNotation === 'arabizi' || preferredNotation === 'duo') && (
                <div className="text-5xl font-extrabold text-blue-600">
                  {formatArabizi(wordData.arabizi)}
                </div>
              )}
              
              {(preferredNotation === 'arabic' || preferredNotation === 'duo') && (
                <div className="text-4xl font-bold text-slate-800 font-arabic leading-tight">
                  {wordData.arabic}
                </div>
              )}

              {/* Example Context */}
              {wordData.example && (
                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
                  <div className="text-slate-500 text-xs font-bold mb-1">En contexte</div>
                  <div className="font-medium text-slate-800">
                    {preferredNotation === 'arabic' ? wordData.example.arabic : wordData.example.arabizi}
                  </div>
                  <div className="text-slate-500 italic text-sm">{typeof wordData.example.translation === 'object' ? getLocalizedText(wordData.example.translation, lang) : wordData.example.translation}</div>
                </div>
              )}

              {wordData.culturalNote && (
                <div className="mt-4 flex gap-2 items-start text-amber-700 bg-amber-50 p-3 rounded-lg text-sm text-left">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{wordData.culturalNote}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className={`w-full mt-8 grid grid-cols-4 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={() => handleGrade('again')} className="py-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl font-bold flex flex-col items-center">
          <span>{t.srs.again}</span>
          <span className="text-xs font-normal opacity-70 mt-1">[1]</span>
        </button>
        <button onClick={() => handleGrade('hard')} className="py-4 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-2xl font-bold flex flex-col items-center">
          <span>{t.srs.hard}</span>
          <span className="text-xs font-normal opacity-70 mt-1">[2]</span>
        </button>
        <button onClick={() => handleGrade('good')} className="py-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl font-bold flex flex-col items-center">
          <span>{t.srs.good}</span>
          <span className="text-xs font-normal opacity-70 mt-1">[3]</span>
        </button>
        <button onClick={() => handleGrade('easy')} className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl font-bold flex flex-col items-center">
          <span>{t.srs.easy}</span>
          <span className="text-xs font-normal opacity-70 mt-1">[4]</span>
        </button>
      </div>
    </div>
  );
}

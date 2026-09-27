'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Info, ArrowRight, RotateCw } from 'lucide-react';
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
        setIsFlipped(prev => !prev);
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
    return (
      <div className="text-center p-12 text-[#7A7670] font-serif">
        {t.dashboard?.loading || "Chargement..."}
      </div>
    );
  }

  // Highlight specific phonetic numbers in Arabizi
  const formatArabizi = (text: string) => {
    return text.split(/(3|7|9|kh)/i).map((part, i) => {
      if (/^(3|7|9|kh)$/i.test(part)) {
        return <span key={i} className="text-[#C9A05C] font-bold">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(wordData.arabic, wordData.audioUrl, soundEnabled);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-4 perspective-1000">
      
      {/* Progress header */}
      <div className="w-full mb-6 flex justify-between items-center text-xs font-semibold text-[#7A7670] px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9A05C]" />
          <span>{t.dashboard?.remainingCards || "Cartes restantes :"} <strong className="text-[#1B2A4A]">{cards.length - currentIndex}</strong></span>
        </span>
        <div className="flex gap-1.5">
          {cards.slice(0, 15).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIndex 
                  ? 'w-3 bg-[#7A9174]' 
                  : i === currentIndex 
                    ? 'w-6 bg-[#C9A05C]' 
                    : 'w-1.5 bg-[#E8E2D5]'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        className="relative w-full h-[380px] sm:h-[400px] cursor-pointer"
        onClick={() => setIsFlipped(prev => !prev)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 220, damping: 20 }}
        >
          {/* Front of Flashcard */}
          <div className="absolute inset-0 backface-hidden bg-[#FDFCF8] rounded-[28px] shadow-sm border border-[#E8E2D5] p-8 flex flex-col items-center justify-between text-center select-none overflow-hidden">
            
            {/* Petits astérisques discrets aux angles */}
            <span className="absolute top-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute top-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute bottom-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute bottom-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>

            {/* Kicker supérieur */}
            <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
              <span>—</span>
              <span>{wordData.category || "Vocabulaire"}</span>
            </div>
            
            {/* Illustration & Translation */}
            <div className="space-y-4 my-auto">
              <div className="flex justify-center scale-110">
                <CardIllustration illustration={wordData.illustration} />
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1B2A4A] tracking-tight">
                {getLocalizedText(wordData.translation, lang)}
              </h2>
            </div>
            
            {/* Flip prompt hint */}
            <div className="text-[#7A7670] text-xs flex items-center gap-2 pt-2 border-t border-[#E8E2D5]/50 w-full justify-center">
              <RotateCw className="w-3.5 h-3.5 text-[#C9A05C]" />
              <span>{t.srs?.tapToFlip || "Cliquer ou Espace pour révéler la réponse"}</span>
            </div>
          </div>

          {/* Back of Flashcard */}
          <div 
            className="absolute inset-0 backface-hidden bg-[#FDFCF8] rounded-[28px] shadow-md border border-[#E8E2D5] p-8 flex flex-col items-center justify-between text-center select-none overflow-hidden"
            style={{ transform: 'rotateX(180deg)' }}
          >
            {/* Petits astérisques discrets aux angles */}
            <span className="absolute top-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute top-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute bottom-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
            <span className="absolute bottom-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>

            {/* Bouton audio écouteurs ronds */}
            <button 
              onClick={handlePlayAudio}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#1B2A4A] text-[#FDFCF8] hover:bg-[#1B2A4A]/90 flex items-center justify-center shadow-xs transition-colors z-20"
              title="Réécouter"
            >
              <Volume2 className="w-4 h-4 text-[#C9A05C]" />
            </button>

            {/* Kicker supérieur réponse */}
            <div className="flex items-center gap-2 text-[#7A9174] text-xs font-bold tracking-[0.22em] uppercase">
              <span>—</span>
              <span>Darija marocaine</span>
            </div>

            <div className="space-y-4 my-auto w-full">
              <div className="flex justify-center">
                <CardIllustration illustration={wordData.illustration} />
              </div>
              
              {/* Display Logic Based on Notation Preference */}
              {(preferredNotation === 'arabizi' || preferredNotation === 'duo') && (
                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#1B2A4A] tracking-tight">
                  {formatArabizi(wordData.arabizi)}
                </div>
              )}
              
              {(preferredNotation === 'arabic' || preferredNotation === 'duo') && (
                <div className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] font-arabic leading-tight">
                  {wordData.arabic}
                </div>
              )}

              {/* Example Context */}
              {wordData.example && (
                <div className="mt-4 p-3.5 bg-[#F7F3EA] rounded-2xl border border-[#E8E2D5] text-left text-xs space-y-1">
                  <div className="text-[#C9A05C] font-bold text-[10px] tracking-wider uppercase">En contexte</div>
                  <div className="font-serif font-bold text-sm text-[#1B2A4A]">
                    {preferredNotation === 'arabic' ? wordData.example.arabic : wordData.example.arabizi}
                  </div>
                  <div className="text-[#7A7670] italic">
                    {typeof wordData.example.translation === 'object' ? getLocalizedText(wordData.example.translation, lang) : wordData.example.translation}
                  </div>
                </div>
              )}

              {wordData.culturalNote && (
                <div className="mt-2 flex gap-2 items-start text-xs text-left bg-[#C9A05C]/10 border border-[#C9A05C]/30 text-[#1B2A4A] p-2.5 rounded-xl">
                  <Info className="w-4 h-4 text-[#C9A05C] shrink-0 mt-0.5" />
                  <p>{wordData.culturalNote}</p>
                </div>
              )}
            </div>

            <div className="text-[#7A7670] text-xs">
              Évaluez votre mémorisation ci-dessous
            </div>
          </div>
        </motion.div>
      </div>

      {/* Boutons de notation SRS en bas (Encore, Difficile, Bien, Facile) stylisés avec les gains d'XP en sous-texte */}
      <div className={`w-full mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'}`}>
        
        {/* Encore */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleGrade('again'); }}
          className="py-3.5 px-3 bg-[#FDFCF8] hover:bg-red-50 border border-red-200 text-red-700 rounded-2xl transition-all shadow-xs flex flex-col items-center justify-center active:scale-95 group"
        >
          <span className="font-serif font-bold text-sm sm:text-base group-hover:scale-105 transition-transform">
            {t.srs?.again || "Encore"}
          </span>
          <span className="text-[11px] font-semibold text-red-500/80 mt-0.5">
            +2 XP <span className="opacity-60 text-[10px]">[1]</span>
          </span>
        </button>

        {/* Difficile */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleGrade('hard'); }}
          className="py-3.5 px-3 bg-[#FDFCF8] hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl transition-all shadow-xs flex flex-col items-center justify-center active:scale-95 group"
        >
          <span className="font-serif font-bold text-sm sm:text-base group-hover:scale-105 transition-transform">
            {t.srs?.hard || "Difficile"}
          </span>
          <span className="text-[11px] font-semibold text-amber-600 mt-0.5">
            +5 XP <span className="opacity-60 text-[10px]">[2]</span>
          </span>
        </button>

        {/* Bien */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleGrade('good'); }}
          className="py-3.5 px-3 bg-[#FDFCF8] hover:bg-[#7A9174]/10 border border-[#7A9174]/50 text-[#7A9174] rounded-2xl transition-all shadow-xs flex flex-col items-center justify-center active:scale-95 group"
        >
          <span className="font-serif font-bold text-sm sm:text-base group-hover:scale-105 transition-transform">
            {t.srs?.good || "Bien"}
          </span>
          <span className="text-[11px] font-semibold text-[#7A9174] mt-0.5">
            +10 XP <span className="opacity-60 text-[10px]">[3]</span>
          </span>
        </button>

        {/* Facile */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleGrade('easy'); }}
          className="py-3.5 px-3 bg-[#FDFCF8] hover:bg-[#1B2A4A]/5 border border-[#1B2A4A]/30 text-[#1B2A4A] rounded-2xl transition-all shadow-xs flex flex-col items-center justify-center active:scale-95 group"
        >
          <span className="font-serif font-bold text-sm sm:text-base group-hover:scale-105 transition-transform">
            {t.srs?.easy || "Facile"}
          </span>
          <span className="text-[11px] font-semibold text-[#C9A05C] mt-0.5">
            +15 XP <span className="opacity-60 text-[10px]">[4]</span>
          </span>
        </button>

      </div>
    </div>
  );
}

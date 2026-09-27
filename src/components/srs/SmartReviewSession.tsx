import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { Brain, ArrowRight, Check, X, RotateCw } from 'lucide-react';
import { SRSCard } from '../../types/srs';
import { getLocalizedText } from '../../lib/i18n/utils';
import { getWordFromDictionary } from '../../data/srs-deck';
import CardIllustration from './CardIllustration';

interface SmartReviewSessionProps {
  onClose: () => void;
}

export default function SmartReviewSession({ onClose }: SmartReviewSessionProps) {
  const { getDueCards, reviewCard, preferredNotation, customVocabulary } = useAppStore();
  const { lang, t } = useTranslation();
  
  const [sessionCards, setSessionCards] = useState<SRSCard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  React.useEffect(() => {
    // Diffère le calcul lourd pour ne pas bloquer le thread principal (INP fix)
    const timer = setTimeout(() => {
      const dueCards = getDueCards();
      setSessionCards(dueCards.slice(0, 10)); // Review up to 10 cards
    }, 0);
    
    return () => clearTimeout(timer);
  }, [getDueCards]);

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!sessionCards) {
    return (
      <div className="z-50 fixed inset-0 bg-[#1B2A4A]/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="text-[#FDFCF8] font-serif text-xl font-bold animate-pulse">{t.dashboard.loading || 'Chargement...'}</div>
      </div>
    );
  }

  if (sessionCards.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#F7F3EA] z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#7A9174]/15 border border-[#7A9174]/30 flex items-center justify-center mb-6">
          <Brain className="w-10 h-10 text-[#7A9174]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#1B2A4A] mb-3">{t.srs.allCaughtUp}</h2>
        <p className="text-sm text-[#7A7670] mb-8 max-w-md">
          {t.srs.allCaughtUpDesc}
        </p>
        <button 
          onClick={onClose} 
          className="px-8 py-3.5 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
        >
          {t.srs.backToMenu}
        </button>
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];

  const handleGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    reviewCard(currentCard.wordId, grade);
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(curr => curr + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (sessionComplete) {
    return (
      <div className="fixed inset-0 bg-[#F7F3EA] z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#7A9174]/20 border border-[#7A9174] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-10 h-10 text-[#7A9174]" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-3">{t.srs.sessionComplete}</h2>
        <p className="text-sm text-[#7A7670] mb-8 max-w-md">
          {t.srs.sessionCompleteDesc.replace('{count}', sessionCards.length.toString()).replace('{xp}', (sessionCards.length * 5).toString())}
        </p>
        <button 
          onClick={onClose} 
          className="px-8 py-3.5 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
        >
          {t.lessons.continue}
        </button>
      </div>
    );
  }

  return (
    <div className="z-50 fixed inset-0 bg-[#1B2A4A]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Modal Top Bar */}
        <div className="flex justify-between items-center text-[#FDFCF8]">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="w-6 h-6 text-[#E8E2D5]" />
          </button>
          <div className="font-serif font-bold text-sm tracking-wide bg-[#FDFCF8]/10 px-4 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {sessionCards.length}
          </div>
        </div>

        {/* Central Card */}
        <div 
          className={`relative w-full aspect-[4/3] bg-[#FDFCF8] rounded-[28px] p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl border border-[#E8E2D5] select-none transition-transform duration-500 overflow-hidden ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(true)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Petits astérisques discrets aux angles */}
          <span className="absolute top-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute top-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute bottom-4 left-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>
          <span className="absolute bottom-4 right-4 text-[#C9A05C]/50 text-xs font-serif pointer-events-none select-none">✦</span>

          {(() => {
            const dictWord = getWordFromDictionary(currentCard.wordId) || customVocabulary?.[currentCard.wordId];
            const translationText = dictWord ? getLocalizedText(dictWord.translation, lang) : currentCard.wordId;
            const fallbackDarija = `Darija_${currentCard.wordId}`;
            
            return !isFlipped ? (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-3" style={{ backfaceVisibility: 'hidden' }}>
                <div className="flex justify-center mb-1">
                  <CardIllustration illustration={dictWord?.illustration} />
                </div>
                <div className="text-xs font-bold text-[#C9A05C] tracking-[0.2em] uppercase">
                  {preferredNotation === 'arabizi' ? t.srs.translateArabizi : preferredNotation === 'arabic' ? t.srs.translateArabic : t.srs.translateDuo}
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-normal text-[#1B2A4A]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  {translationText}
                </div>
                <div className="mt-4 text-[#7A7670] text-xs flex items-center gap-1.5 animate-pulse">
                  <RotateCw className="w-3 h-3 text-[#C9A05C]" />
                  <span>{t.srs.tapToFlip}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full space-y-2" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                 <div className="flex justify-center mb-1">
                   <CardIllustration illustration={dictWord?.illustration} />
                 </div>
                 <div className="text-xs font-bold text-[#7A9174] tracking-[0.2em] uppercase">{t.srs.answer}</div>
                 <div className="text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-2 flex flex-col items-center gap-1">
                   {preferredNotation === 'arabic' && (
                     <span className="font-arabic" dir="rtl">{dictWord?.arabic || fallbackDarija}</span>
                   )}
                   {preferredNotation === 'arabizi' && (
                     <span className="font-serif">{dictWord?.arabizi || fallbackDarija}</span>
                   )}
                   {preferredNotation === 'duo' && (
                     <>
                       <span className="font-serif text-2xl text-[#1B2A4A]">{dictWord?.arabizi || fallbackDarija}</span>
                       <span className="font-arabic text-2xl text-[#C9A05C]" dir="rtl">{dictWord?.arabic || fallbackDarija}</span>
                     </>
                   )}
                 </div>
              </div>
            );
          })()}
        </div>

        {/* Boutons de notation SRS en bas (Encore, Difficile, Bien, Facile) stylisés avec les gains d'XP en sous-texte */}
        {isFlipped ? (
          <div className="grid grid-cols-4 gap-2 mt-4 animate-in slide-in-from-bottom-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleGrade('again'); }} 
              className="py-3 px-2 bg-[#FDFCF8] hover:bg-red-50 border border-red-200 text-red-700 rounded-2xl font-serif font-bold text-xs flex flex-col items-center shadow-xs"
            >
              <span>{t.srs.again}</span>
              <span className="text-[10px] text-red-500/80 font-sans font-normal mt-0.5">+2 XP</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleGrade('hard'); }} 
              className="py-3 px-2 bg-[#FDFCF8] hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl font-serif font-bold text-xs flex flex-col items-center shadow-xs"
            >
              <span>{t.srs.hard}</span>
              <span className="text-[10px] text-amber-600 font-sans font-normal mt-0.5">+5 XP</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleGrade('good'); }} 
              className="py-3 px-2 bg-[#FDFCF8] hover:bg-[#7A9174]/15 border border-[#7A9174]/40 text-[#7A9174] rounded-2xl font-serif font-bold text-xs flex flex-col items-center shadow-xs"
            >
              <span>{t.srs.good}</span>
              <span className="text-[10px] text-[#7A9174] font-sans font-normal mt-0.5">+10 XP</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleGrade('easy'); }} 
              className="py-3 px-2 bg-[#FDFCF8] hover:bg-[#1B2A4A]/5 border border-[#1B2A4A]/30 text-[#1B2A4A] rounded-2xl font-serif font-bold text-xs flex flex-col items-center shadow-xs"
            >
              <span>{t.srs.easy}</span>
              <span className="text-[10px] text-[#C9A05C] font-sans font-normal mt-0.5">+15 XP</span>
            </button>
          </div>
        ) : (
          <div className="h-12" />
        )}
      </div>
    </div>
  );
}

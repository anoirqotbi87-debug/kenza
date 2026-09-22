import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { Brain, ArrowRight, Check, X } from 'lucide-react';
import { SRSCard } from '../../types/srs';
import { getLocalizedText } from '../../lib/i18n/utils';
import { getWordFromDictionary } from '../../data/srs-deck';
import CardIllustration from './CardIllustration';

interface SmartReviewSessionProps {
  onClose: () => void;
}

export default function SmartReviewSession({ onClose }: SmartReviewSessionProps) {
  const { getDueCards, reviewCard, preferredNotation } = useAppStore();
  const { lang, t } = useTranslation();
  
  const dueCards = getDueCards();
  const sessionCards = dueCards.slice(0, 10); // Review up to 10 cards

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  if (sessionCards.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <Brain className="w-24 h-24 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.srs.allCaughtUp}</h2>
        <p className="text-slate-600 mb-8 max-w-md text-center">
          {t.srs.allCaughtUpDesc}
        </p>
        <button onClick={onClose} className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-lg">
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
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.srs.sessionComplete}</h2>
        <p className="text-slate-600 mb-8 max-w-md text-center">
          {t.srs.sessionCompleteDesc.replace('{count}', sessionCards.length.toString()).replace('{xp}', (sessionCards.length * 5).toString())}
        </p>
        <button onClick={onClose} className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg">
          {t.lessons.continue}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8 text-white">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <div className="font-bold">
            {currentIndex + 1} / {sessionCards.length}
          </div>
        </div>

        <div 
          className={`w-full aspect-square bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-2xl transition-transform duration-500 transform ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(true)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {!isFlipped ? (
            <div className="flex flex-col items-center justify-center w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
              <div className="flex justify-center mb-3">
                <CardIllustration illustration={getWordFromDictionary(currentCard.wordId)?.illustration} />
              </div>
              <div className="text-sm font-bold text-slate-400 mb-4">{t.srs.translateToArabizi} {preferredNotation}</div>
              <div className="text-3xl font-bold text-slate-800">
                {getLocalizedText(getWordFromDictionary(currentCard.wordId)?.translation, lang) || `Word_${currentCard.wordId}`}
              </div>
              <div className="mt-8 text-slate-400 animate-pulse flex items-center gap-2">
                {t.srs.tapToFlip} <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
               <div className="flex justify-center mb-3">
                 <CardIllustration illustration={getWordFromDictionary(currentCard.wordId)?.illustration} />
               </div>
               <div className="text-sm font-bold text-green-500 mb-4">{t.srs.answer}</div>
               <div className="text-4xl font-extrabold text-slate-800 mb-2">
                 {preferredNotation === 'arabic' 
                   ? getWordFromDictionary(currentCard.wordId)?.arabic 
                   : getWordFromDictionary(currentCard.wordId)?.arabizi || `Translation_${currentCard.wordId}`}
               </div>
            </div>
          )}
        </div>

        {isFlipped && (
          <div className="grid grid-cols-4 gap-2 mt-8 animate-in slide-in-from-bottom-4 text-sm md:text-base">
            <button onClick={(e) => { e.stopPropagation(); handleGrade('again'); }} className="py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600">
              {t.srs.again}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleGrade('hard'); }} className="py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600">
              {t.srs.hard}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleGrade('good'); }} className="py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600">
              {t.srs.good}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleGrade('easy'); }} className="py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600">
              {t.srs.easy}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

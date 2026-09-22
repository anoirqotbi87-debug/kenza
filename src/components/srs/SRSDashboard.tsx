'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { srsVocabulary } from '../../data/srs-deck';
import FlashcardDeck from './FlashcardDeck';
import { BrainCircuit, Play } from 'lucide-react';
import { SRSCard } from '../../types/srs';

export default function SRSDashboard() {
  const { getDueCards, addCardsToSRS, srsDeck } = useAppStore();
  const { t } = useTranslation();
  const [isReviewing, setIsReviewing] = useState(false);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);

  // Init SRS with all words if empty
  useEffect(() => {
    if (Object.keys(srsDeck).length === 0) {
      addCardsToSRS(srsVocabulary.map(v => v.id));
    }
  }, [srsDeck, addCardsToSRS]);

  // Update due cards when returning to dashboard
  useEffect(() => {
    if (!isReviewing) {
      setDueCards(getDueCards());
    }
  }, [isReviewing, getDueCards, srsDeck]); // added srsDeck to dependencies so it updates

  if (isReviewing && dueCards.length > 0) {
    return (
      <div className="w-full">
        <button 
          onClick={() => setIsReviewing(false)}
          className="mb-4 text-slate-500 hover:text-slate-800"
        >
          &larr; Retour au menu
        </button>
        <FlashcardDeck 
          cards={dueCards} 
          vocabulary={srsVocabulary}
          onComplete={() => setIsReviewing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
        <BrainCircuit className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.srs.smartReviewsTitle}</h2>
      
      <p className="text-slate-600 mb-8 max-w-md">
        {t.srs.smartReviewsDesc}
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 w-full max-w-sm mb-8 flex justify-between items-center">
        <div className="text-left">
          <div className="text-3xl font-black text-slate-800">{dueCards.length}</div>
          <div className="text-sm text-slate-500 font-medium">{t.srs.cardsToReview}</div>
        </div>
        
        {dueCards.length > 0 ? (
          <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-green-500" />
        )}
      </div>

      <button
        onClick={() => setIsReviewing(true)}
        disabled={dueCards.length === 0}
        className="w-full max-w-sm py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2"
      >
        <Play className="w-5 h-5 fill-current" />
        {dueCards.length > 0 ? t.srs.startSession : t.srs.allCaughtUp}
      </button>
    </div>
  );
}

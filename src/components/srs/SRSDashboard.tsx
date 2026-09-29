'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { srsVocabulary } from '../../data/srs-deck';
import FlashcardDeck from './FlashcardDeck';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SRSCard } from '../../types/srs';

export default function SRSDashboard() {
  const { getDueCards, addCardsToSRS, srsDeck } = useAppStore();
  const { t } = useTranslation();
  const [isReviewing, setIsReviewing] = useState(false);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);

  // Init SRS with all words if empty
  useEffect(() => {
    if (Object.keys(srsDeck).length === 0) {
      addCardsToSRS(srsVocabulary.map((v) => v.id));
    }
  }, [srsDeck, addCardsToSRS]);

  // Update due cards when returning to dashboard
  useEffect(() => {
    if (!isReviewing) {
      setDueCards(getDueCards());
    }
  }, [isReviewing, getDueCards, srsDeck]);

  if (isReviewing && dueCards.length > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => setIsReviewing(false)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A7670] hover:text-[#1B2A4A] transition-colors py-2 px-3 rounded-full hover:bg-[#E8E2D5]/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'aperçu SRS</span>
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
    <div className="bg-[#FDFCF8] p-8 sm:p-12 rounded-[28px] shadow-sm border border-[#E8E2D5] flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      
      {/* Icon Medallion */}
      <div className="w-16 h-16 rounded-full bg-[#C9A05C]/15 border border-[#C9A05C]/40 text-[#C9A05C] flex items-center justify-center mb-6 shadow-xs">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Kicker */}
      <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase mb-2">
        <span>—</span>
        <span>{t.modules.srs.spacedRepetition}</span>
      </div>

      {/* Title */}
      <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1B2A4A] mb-3">
        {t.srs?.smartReviewsTitle || "Révision Intelligente"}
      </h2>

      <p className="text-sm text-[#7A7670] mb-8 max-w-md leading-relaxed">
        {t.srs?.smartReviewsDesc || "Ancrez durablement le vocabulaire dans votre mémoire grâce au système d'espacement algorithmique."}
      </p>

      {/* Counter card */}
      <div className="bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl p-6 w-full max-w-sm mb-8 flex justify-between items-center">
        <div className="text-left">
          <div className="font-serif text-4xl font-bold text-[#1B2A4A]">{dueCards.length}</div>
          <div className="text-xs text-[#7A7670] font-medium mt-1">
            {t.srs?.cardsToReview || "expressions prêtes pour aujourd'hui"}
          </div>
        </div>

        {dueCards.length > 0 ? (
          <div className="w-4 h-4 rounded-full bg-[#C9A05C] shadow-[0_0_8px_rgba(201,160,92,0.6)] animate-pulse" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-[#7A9174]" />
        )}
      </div>

      {/* Action button */}
      <button
        onClick={() => setIsReviewing(true)}
        disabled={dueCards.length === 0}
        className="w-full max-w-sm py-4 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] disabled:bg-[#E8E2D5] disabled:text-[#7A7670] text-[#1B2A4A] rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 active:scale-95"
      >
        <span>{dueCards.length > 0 ? (t.srs?.startSession || "Lancer la session de révision") : (t.srs?.allCaughtUp || "Tout est à jour !")}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { srsVocabulary } from '../../data/srs-deck';
import FlashcardDeck from './FlashcardDeck';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, RotateCw, Plus } from 'lucide-react';
import { SRSCard } from '../../types/srs';

export default function SRSDashboard() {
  const { getDueCards, addCardsToSRS, activateNewCards, srsDeck } = useAppStore();
  const { t } = useTranslation();
  const [isReviewing, setIsReviewing] = useState(false);
  const [sessionCards, setSessionCards] = useState<SRSCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Init SRS with all words if empty and activate initial batch of 5 words
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const initializeCards = async () => {
      try {
        setLoading(true);
        // Timeout de sécurité : si après 2.5 secondes rien n'est chargé, on force l'état local
        timeoutId = setTimeout(() => {
          if (Object.keys(useAppStore.getState().srsDeck).length === 0) {
            addCardsToSRS(srsVocabulary.map((v) => v.id));
            activateNewCards(5);
          }
          setLoading(false);
        }, 2500);

        if (Object.keys(srsDeck).length === 0) {
          addCardsToSRS(srsVocabulary.map((v) => v.id));
          activateNewCards(5);
        } else {
          const activeCount = Object.values(srsDeck).filter((c) => c.state !== 'new').length;
          if (activeCount === 0) {
            activateNewCards(5);
          }
        }
      } catch (err) {
        console.error('[SRS Init Error]:', err);
        // Fallback local immédiat
        addCardsToSRS(srsVocabulary.map((v) => v.id));
        activateNewCards(5);
      } finally {
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    initializeCards();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [srsDeck, addCardsToSRS, activateNewCards]);

  const currentDueCards = getDueCards();

  const handleStartReview = () => {
    const due = getDueCards();
    if (due.length > 0) {
      setSessionCards(due);
      setIsReviewing(true);
    }
  };

  const handleReviewAhead = () => {
    const activeCards = Object.values(srsDeck).filter((c) => c.state !== 'new');
    if (activeCards.length > 0) {
      const sorted = [...activeCards].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setSessionCards(sorted.slice(0, 10));
      setIsReviewing(true);
    }
  };

  const handleLearnNew = () => {
    activateNewCards(5);
    setTimeout(() => {
      const due = getDueCards();
      if (due.length > 0) {
        setSessionCards(due);
        setIsReviewing(true);
      }
    }, 50);
  };

  if (isReviewing && sessionCards.length > 0) {
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
          cards={sessionCards}
          vocabulary={srsVocabulary}
          onComplete={() => setIsReviewing(false)}
        />
      </div>
    );
  }

  if (loading && Object.keys(srsDeck).length === 0) {
    return (
      <div className="bg-[#FDFCF8] p-12 rounded-[28px] shadow-sm border border-[#E8E2D5] flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8">
        <div className="w-10 h-10 border-3 border-[#C9A05C]/30 border-t-[#C9A05C] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#1B2A4A]">Préparation de vos révisions...</p>
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

      {currentDueCards.length > 0 ? (
        <>
          {/* Title */}
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#1B2A4A] mb-3">
            {t.srs?.smartReviewsTitle || "Révision Intelligente"}
          </h2>

          <p className="text-sm text-[#7A7670] mb-8 max-w-md leading-relaxed">
            {t.srs?.smartReviewsDesc || "Ancrez durablement le vocabulaire dans votre mémoire grâce au système d'espacement algorithmique."}
          </p>

          {/* Counter card */}
          <div className="bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl p-6 w-full max-w-sm mb-8 flex justify-between items-center">
            <div className="text-left">
              <div className="font-display text-4xl font-bold text-[#1B2A4A]">{currentDueCards.length}</div>
              <div className="text-xs text-[#7A7670] font-medium mt-1">
                {t.srs?.cardsToReview || "expressions prêtes pour aujourd'hui"}
              </div>
            </div>

            <div className="w-4 h-4 rounded-full bg-[#C9A05C] shadow-[0_0_8px_rgba(201,160,92,0.6)] animate-pulse" />
          </div>

          {/* Action button */}
          <button
            onClick={handleStartReview}
            className="w-full max-w-sm py-4 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-3 active:scale-95"
          >
            <span>{t.srs?.startSession || "Lancer la session de révision"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          {/* Finished state */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A9174]/15 text-[#7A9174] text-xs font-bold mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>À jour pour aujourd'hui</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#1B2A4A] mb-3">
            Félicitations ! Toutes vos révisions du jour sont terminées.
          </h2>

          <p className="text-sm text-[#7A7670] mb-8 max-w-md leading-relaxed">
            Votre mémoire est bien ancrée ! Revenez demain pour la prochaine répétition espacée, ou continuez votre apprentissage dès maintenant.
          </p>

          <div className="w-full max-w-sm space-y-3">
            {Object.values(srsDeck).some((c) => c.state === 'new') ? (
              <button
                type="button"
                onClick={handleLearnNew}
                className="w-full py-3.5 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Apprendre 5 nouvelles expressions</span>
              </button>
            ) : Object.values(srsDeck).some((c) => c.state !== 'new') ? (
              <button
                type="button"
                onClick={handleReviewAhead}
                className="w-full py-3.5 px-6 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] rounded-full font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <RotateCw className="w-4 h-4" />
                <span>Réviser à l'avance (cartes actives)</span>
              </button>
            ) : null}

            <Link
              href="/etudier"
              className="w-full py-3.5 px-6 bg-[#1B2A4A] hover:bg-[#253961] !text-white rounded-full font-bold text-sm shadow-sm transition-all flex justify-center items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#C9A05C]" />
              <span className="!text-white">Retour au parcours</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

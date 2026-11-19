'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trophy,
  ChevronRight,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { evaluateSpokenSrsAnswer, type VoiceEvaluationResult } from '@/lib/srs/voiceSrs';
import { playAudio } from '@/lib/audio';
import { srsVocabulary } from '@/data/srs-deck';
import { getLocalizedText } from '@/lib/i18n/utils';
import type { UILanguage } from '@/lib/i18n/translations';
import type { VocabularySRSData } from '@/types/srs';

export interface VoiceSrsSessionProps {
  onClose: () => void;
  initialWords?: string[];
  maxCards?: number;
}

interface SrsPracticeItem {
  id: string;
  arabizi: string;
  arabic: string;
  translation: string;
  category?: string;
  audioUrl?: string;
}

export default function VoiceSrsSession({
  onClose,
  initialWords,
  maxCards = 10,
}: VoiceSrsSessionProps) {
  const { srsDeck, reviewVoiceCard, soundEnabled, toggleSound } = useAppStore();
  const { lang } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArabic, setShowArabic] = useState(false);
  const [sessionStartTime] = useState(() => Date.now());
  const [manualMode, setManualMode] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  // Hook Web Speech API natif en dialecte marocain ar-MA
  const {
    isSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition('ar-MA', 8000, lang);

  // Construction de la liste des cartes pour la session
  const practiceCards = useMemo<SrsPracticeItem[]>(() => {
    const vocabMap = new Map<string, VocabularySRSData>();
    for (const item of srsVocabulary) {
      vocabMap.set(item.id, item);
      vocabMap.set(item.id.replace(/^srs_/, ''), item);
    }

    const items: SrsPracticeItem[] = [];

    // 1. Cartes dues dans srsDeck
    const dueKeys = Object.keys(srsDeck).filter((key) => {
      const card = srsDeck[key];
      if (!card?.dueDate) return true;
      return new Date(card.dueDate).getTime() <= sessionStartTime + 24 * 60 * 60 * 1000;
    });

    const targetIds = initialWords && initialWords.length > 0
      ? initialWords
      : dueKeys.length > 0
      ? dueKeys
      : srsVocabulary.slice(0, maxCards).map((w) => w.id);

    for (const id of targetIds) {
      const cleanId = id.replace(/^srs_/, '');
      const vocab = vocabMap.get(id) || vocabMap.get(cleanId);
      if (vocab) {
        const trans = getLocalizedText(vocab.translation, lang as UILanguage);
        items.push({
          id: vocab.id,
          arabizi: vocab.arabizi,
          arabic: vocab.arabic,
          translation: trans,
          category: vocab.category,
          audioUrl: vocab.audioUrl,
        });
      }
      if (items.length >= maxCards) break;
    }

    // Fallback si la liste est vide
    if (items.length === 0) {
      return srsVocabulary.slice(0, 5).map((v) => ({
        id: v.id,
        arabizi: v.arabizi,
        arabic: v.arabic,
        translation: getLocalizedText(v.translation, lang as UILanguage) || 'Mot essentiel',
        category: v.category,
        audioUrl: v.audioUrl,
      }));
    }

    return items;
  }, [srsDeck, initialWords, maxCards, lang, sessionStartTime]);

  const currentCard = practiceCards[currentIndex];

  // Analyse automatique du transcript dès que la parole s'arrête
  const evaluation = useMemo<VoiceEvaluationResult | null>(() => {
    if (!isListening && transcript.trim() && currentCard) {
      return evaluateSpokenSrsAnswer(currentCard.arabic, transcript);
    }
    return null;
  }, [isListening, transcript, currentCard]);

  // Jouer l'audio natif
  const handlePlayAudio = useCallback(() => {
    if (!currentCard) return;
    playAudio(currentCard.arabic || currentCard.arabizi, currentCard.audioUrl, soundEnabled, 'normal', {
      consumeQuota: false,
    });
  }, [currentCard, soundEnabled]);

  // Validation d'une note (soit automatique soit manuelle)
  const handleApplyRating = useCallback(
    (quality: number) => {
      if (!currentCard) return;

      reviewVoiceCard(currentCard.id, quality, transcript || undefined);

      setReviewedCount((prev) => prev + 1);
      setTotalScore((prev) => prev + quality * 20);

      // Passage à la carte suivante ou clôture
      if (currentIndex + 1 < practiceCards.length) {
        setCurrentIndex((prev) => prev + 1);
        setShowArabic(false);
        resetTranscript();
      } else {
        setSessionCompleted(true);
      }
    },
    [currentCard, reviewVoiceCard, transcript, currentIndex, practiceCards.length, resetTranscript]
  );

  // Bascule micro
  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowArabic(false);
    setSessionCompleted(false);
    setReviewedCount(0);
    setTotalScore(0);
    resetTranscript();
  };

  if (sessionCompleted) {
    const avgScore = reviewedCount > 0 ? Math.round(totalScore / reviewedCount) : 0;
    const earnedXp = reviewedCount * 12;

    return (
      <div className="fixed inset-0 z-[100] bg-[#FAF7F2] dark:bg-[#1C1816] flex flex-col justify-center items-center p-4">
        <div className="bg-white dark:bg-[#26211E] border border-amber-200/70 dark:border-amber-900/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Mabrouk ! Session Vocale Validée
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Vos révisions ont été mises à jour dans le moteur SM-2 et sauvegardées dans IndexedDB.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="bg-[#FAF7F2] dark:bg-[#1E1917] p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">
                Cartes révisées
              </span>
              <p className="text-lg font-extrabold text-stone-800 dark:text-stone-100">
                {reviewedCount}
              </p>
            </div>
            <div className="bg-[#FAF7F2] dark:bg-[#1E1917] p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">
                XP Remportés
              </span>
              <p className="text-lg font-extrabold text-amber-600 dark:text-amber-500 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-amber-500" />
                +{earnedXp} XP
              </p>
            </div>
            <div className="bg-[#FAF7F2] dark:bg-[#1E1917] p-3 rounded-2xl border border-amber-100 dark:border-amber-900/30 col-span-2">
              <span className="text-[11px] text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">
                Précision moyenne
              </span>
              <p className="text-lg font-extrabold text-stone-800 dark:text-stone-100">
                {avgScore}%
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réviser à nouveau
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
            >
              Terminer la session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentIndex + 1) / practiceCards.length) * 100);

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF7F2] dark:bg-[#1C1816] flex flex-col justify-between font-sans overflow-hidden">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <header className="px-4 py-3 bg-white dark:bg-[#26211E] border-b border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between gap-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la session"
            className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
              <span>Atelier SRS Vocal</span>
              <span className="text-[10px] px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full font-extrabold uppercase">
                SM-2
              </span>
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Carte {currentIndex + 1} sur {practiceCards.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
            className="p-2 rounded-full text-stone-500 dark:text-stone-400 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </header>

      {/* BARRE DE PROGRESSION */}
      <div className="w-full bg-amber-100 dark:bg-stone-800 h-1.5">
        <div
          className="bg-amber-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 2. CONTENU PRINCIPAL DE LA CARTE */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-center items-center space-y-6 overflow-y-auto">
        {currentCard ? (
          <div className="w-full bg-white dark:bg-[#26211E] rounded-3xl border border-amber-200/70 dark:border-amber-900/40 p-6 sm:p-8 text-center shadow-md space-y-4 transition-all">
            {/* Catégorie */}
            {currentCard.category && (
              <span className="inline-block text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/50 dark:border-amber-900/30">
                {currentCard.category}
              </span>
            )}

            {/* Traduction / Consigne */}
            <div className="space-y-1">
              <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                Prononcez en Darija marocain :
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-800 dark:text-stone-100">
                {currentCard.translation}
              </h2>
            </div>

            {/* Expression en Arabizi */}
            <div className="py-2">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500 tracking-wide">
                « {currentCard.arabizi} »
              </span>
            </div>

            {/* Écoute du modèle audio natif */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-200/60 dark:border-amber-900/30 transition-all active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Écouter le modèle</span>
              </button>

              <button
                type="button"
                onClick={() => setShowArabic(!showArabic)}
                className="inline-flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 px-2 py-1 rounded-full transition-colors underline"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{showArabic ? 'Masquer graphie' : 'Voir graphie arabe'}</span>
              </button>
            </div>

            {/* Affichage optionnel de la graphie arabe vocalisée */}
            {showArabic && (
              <div className="p-3 bg-[#FAF7F2] dark:bg-[#1C1816] rounded-2xl border border-amber-200/60 dark:border-amber-900/30 animate-in fade-in">
                <span className="text-2xl font-serif text-stone-800 dark:text-stone-100" dir="rtl">
                  {currentCard.arabic}
                </span>
              </div>
            )}

            {/* ÉVALUATION DU RETOUR VOCAL */}
            {evaluation && (
              <div
                className={`p-4 rounded-2xl border text-left space-y-2 animate-in fade-in zoom-in-95 ${
                  evaluation.isCorrect
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/40'
                    : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-xs">
                    {evaluation.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span
                      className={
                        evaluation.isCorrect
                          ? 'text-emerald-800 dark:text-emerald-200'
                          : 'text-amber-800 dark:text-amber-200'
                      }
                    >
                      {evaluation.feedback}
                    </span>
                  </span>
                  <span className="text-xs font-black text-stone-700 dark:text-stone-300 bg-white/70 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                    {evaluation.score}% de précision
                  </span>
                </div>

                {evaluation.recognizedText && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                    Entendu : « {evaluation.recognizedText} »
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleApplyRating(evaluation.quality)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>Valider & Continuer</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* 3. BARRE D'INTERACTION VOCALE & REPLI ÉVALUATION MANUELLE */}
      <footer className="p-4 sm:p-5 bg-white dark:bg-[#26211E] border-t border-amber-200/70 dark:border-amber-900/40 shrink-0 pb-safe shadow-lg">
        <div className="max-w-md mx-auto space-y-4">
          {/* Si pas encore d'évaluation et en mode vocal */}
          {!evaluation && !manualMode && isSupported && (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <span className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping" />
                    <span className="absolute w-16 h-16 rounded-full bg-emerald-500/30 animate-pulse" />
                  </>
                )}

                <button
                  type="button"
                  onClick={handleToggleMic}
                  aria-label={isListening ? "Arrêter l'enregistrement" : 'Activer le micro'}
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
                    isListening
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 dark:ring-emerald-800'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>
              </div>

              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                {isListening ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                    Écoute en cours... Parlez en Darija
                  </span>
                ) : (
                  'Appuyez sur le micro et prononcez le mot'
                )}
              </p>

              {isListening && transcript && (
                <p className="text-xs italic text-stone-800 dark:text-stone-200 bg-amber-100/60 dark:bg-amber-950/40 px-3 py-1 rounded-full truncate max-w-xs">
                  « {transcript} »
                </p>
              )}

              {voiceError && (
                <p className="text-[11px] text-red-600 dark:text-red-400 text-center">
                  {voiceError}
                </p>
              )}
            </div>
          )}

          {/* REPLI ÉVALUATION MANUELLE (ou si non supporté ou mode manuel choisi) */}
          {(!isSupported || manualMode || (!isListening && !evaluation)) && (
            <div className="space-y-2 pt-1 text-center">
              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 px-1 font-semibold">
                <span>Évaluation manuelle SM-2 :</span>
                {isSupported && (
                  <button
                    type="button"
                    onClick={() => setManualMode(!manualMode)}
                    className="underline text-amber-700 dark:text-amber-400"
                  >
                    {manualMode ? 'Passer en mode vocal' : 'Auto-évaluation'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyRating(1)}
                  className="py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
                >
                  1 · Oublié
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyRating(2)}
                  className="py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
                >
                  2 · Difficile
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyRating(3)}
                  className="py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  3 · Passable
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyRating(4)}
                  className="py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
                >
                  4 · Bien
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyRating(5)}
                  className="py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors"
                >
                  5 · Parfait
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

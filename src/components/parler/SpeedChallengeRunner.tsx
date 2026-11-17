'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SPEED_CHALLENGE_PHRASES,
  type SpeedChallengePhrase,
} from '@/data/speedChallengePhrases';
import {
  createInitialSpeedChallengeState,
  submitUtterance,
  handleTimeout,
  type SpeedChallengeState,
} from '@/lib/speedChallengeEngine';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { playAudio } from '@/lib/audio';
import { useAppStore } from '@/store/useAppStore';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Zap,
  RotateCcw,
  Trophy,
  Heart,
  Timer,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';

export interface SpeedChallengeRunnerProps {
  onExit: () => void;
}

export default function SpeedChallengeRunner({ onExit }: SpeedChallengeRunnerProps) {
  const { soundEnabled, toggleSound, addXp } = useAppStore();
  const phrases = SPEED_CHALLENGE_PHRASES;

  const [state, setState] = useState<SpeedChallengeState>(createInitialSpeedChallengeState());
  const currentPhrase: SpeedChallengePhrase | undefined = phrases[state.currentIndex];

  const [timeLeft, setTimeLeft] = useState<number>(currentPhrase ? currentPhrase.timeLimit : 5);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'timeout'; message: string } | null>(null);
  const [manualText, setManualText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceRecognition('ar-MA', 6000);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Traitement de l'expiration du temps
  const handleTimeExpiration = useCallback(() => {
    playAudio('error', undefined, soundEnabled);
    if (typeof resetTranscript === 'function') resetTranscript();

    setState((s) => {
      const next = handleTimeout(s, phrases);
      if (next.isFailed) {
        setFeedback({ type: 'timeout', message: 'Temps écoulé ! Plus de vies.' });
      } else {
        setFeedback({ type: 'timeout', message: 'Temps écoulé ! -1 ❤️' });
        const nextIndex = Math.min(s.currentIndex + 1, phrases.length - 1);
        setTimeLeft(phrases[nextIndex]?.timeLimit || 5);
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            currentIndex: nextIndex,
          }));
          setFeedback(null);
        }, 1200);
      }
      return next;
    });
  }, [soundEnabled, phrases, resetTranscript]);

  const handleTimeExpirationRef = useRef(handleTimeExpiration);
  useEffect(() => {
    handleTimeExpirationRef.current = handleTimeExpiration;
  });

  // Boucle du compte à rebours (Timer)
  useEffect(() => {
    if (state.isCompleted || state.isFailed || isEvaluating) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpirationRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.currentIndex, state.isCompleted, state.isFailed, isEvaluating]);

  // Validation d'une réponse (vocale ou textuelle)
  const handleAnswer = useCallback(
    (input: string) => {
      if (!input.trim() || state.isCompleted || state.isFailed || isEvaluating) return;

      setIsEvaluating(true);
      const res = submitUtterance(state, input, phrases, { remainingSeconds: timeLeft });

      if (res.isSuccess) {
        playAudio('correct', undefined, soundEnabled);
        addXp(10);
        setFeedback({ type: 'success', message: 'Excellent débit ! +100 pts' });

        if (typeof resetTranscript === 'function') resetTranscript();
        setTimeLeft(phrases[res.nextState.currentIndex]?.timeLimit || 5);

        setTimeout(() => {
          setState(res.nextState);
          setFeedback(null);
          setIsEvaluating(false);

          if (res.nextState.isCompleted) {
            // Bonus final de réussite
            addXp(25);
          }
        }, 900);
      } else {
        playAudio('error', undefined, soundEnabled);
        if (typeof resetTranscript === 'function') resetTranscript();

        setFeedback({
          type: 'error',
          message: res.nextState.isFailed
            ? 'Défi échoué ! Plus de vies.'
            : 'Mots non reconnus ! -1 ❤️',
        });

        setTimeout(() => {
          setState(res.nextState);
          setFeedback(null);
          setIsEvaluating(false);
        }, 1100);
      }
    },
    [state, phrases, timeLeft, soundEnabled, addXp, resetTranscript, isEvaluating]
  );

  const handleAnswerRef = useRef(handleAnswer);
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
  });

  // Détection vocale automatique
  useEffect(() => {
    if (!isListening && transcript && !isEvaluating && !state.isCompleted && !state.isFailed) {
      const timer = setTimeout(() => {
        handleAnswerRef.current(transcript);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, isEvaluating, state.isCompleted, state.isFailed]);

  // Écouter la phrase modèle
  const playModelPhrase = () => {
    if (!currentPhrase) return;
    playAudio(currentPhrase.arabizi || currentPhrase.arabic, undefined, soundEnabled);
  };

  // Recommencer la partie
  const handleRestart = () => {
    if (typeof resetTranscript === 'function') resetTranscript();
    setState(createInitialSpeedChallengeState());
    setTimeLeft(phrases[0]?.timeLimit || 5);
    setFeedback(null);
    setIsEvaluating(false);
    setManualText('');
  };

  // Envoi de la saisie manuelle
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    handleAnswer(manualText);
    setManualText('');
  };

  const totalTime = currentPhrase ? currentPhrase.timeLimit : 5;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F3EA] dark:bg-zinc-950 flex flex-col overflow-hidden font-sans">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <header className="bg-[#FDFCF8] dark:bg-zinc-900 border-b border-[#E8E2D5] dark:border-zinc-800 px-4 py-3 shrink-0 shadow-xs z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Bouton retour & Titre */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExit}
              aria-label="Quitter le Speed Challenge"
              className="p-2 -ml-1 rounded-full text-[#1B2A4A] dark:text-zinc-200 hover:bg-[#E8E2D5]/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-[#1B2A4A] dark:text-white">
                  Speed Challenge
                </h1>
                <span className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  Débit Natif
                </span>
              </div>
              <p className="text-xs text-[#8B6E3F] dark:text-amber-400 font-arabic truncate" dir="rtl">
                طْلَقْ لْسَانْكْ — تَحَدِّي السُّرْعَة
              </p>
            </div>
          </div>

          {/* Vies & Score & Son */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cœurs de vie */}
            <div className="flex items-center gap-1 bg-[#E8E2D5]/50 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
              {[1, 2, 3].map((heartIndex) => (
                <Heart
                  key={heartIndex}
                  className={`w-4 h-4 transition-all duration-300 ${
                    heartIndex <= state.lives
                      ? 'fill-red-500 text-red-500 scale-100'
                      : 'text-zinc-300 dark:text-zinc-600 scale-90'
                  }`}
                />
              ))}
            </div>

            {/* Score & Combo */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-400 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{state.score} pts</span>
              {state.streak > 1 && (
                <span className="flex items-center gap-0.5 text-orange-600 text-[10px] font-extrabold ml-1">
                  <Flame className="w-3 h-3 fill-orange-500" /> x{state.streak}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              className="p-2 rounded-full text-[#7A7670] hover:text-[#1B2A4A] dark:hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Barre de Compte à Rebours Visuelle */}
        {!state.isCompleted && !state.isFailed && (
          <div className="max-w-3xl mx-auto mt-2">
            <div className="w-full bg-[#E8E2D5] dark:bg-zinc-800 h-2 rounded-full overflow-hidden relative">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${
                  timePercent > 50
                    ? 'bg-emerald-500'
                    : timePercent > 25
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#7A7670] dark:text-zinc-400 mt-1 font-semibold">
              <span>Phrase {state.currentIndex + 1} / {phrases.length}</span>
              <span className={`flex items-center gap-1 ${timeLeft <= 2 ? 'text-red-500 font-bold animate-pulse' : ''}`}>
                <Timer className="w-3.5 h-3.5" />
                {timeLeft}s restantes
              </span>
            </div>
          </div>
        )}
      </header>

      {/* 2. ZONE PRINCIPALE DE JEU */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {state.isCompleted ? (
          /* Écran de Victoire */
          <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-md animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">
                Mabrouk ! Défi Débit Réussi !
              </h2>
              <p className="text-sm text-[#7A7670] dark:text-zinc-400 mt-1">
                Vous avez validé les 5 phrases avec un rythme de locuteur natif.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-2">
              <div className="bg-[#F7F3EA] dark:bg-zinc-800 p-3 rounded-2xl border border-[#E8E2D5] dark:border-zinc-700">
                <span className="text-[11px] font-bold text-[#7A7670] block">SCORE FINAL</span>
                <span className="text-xl font-extrabold text-[#1B2A4A] dark:text-white">{state.score} pts</span>
              </div>
              <div className="bg-amber-500/10 dark:bg-amber-500/20 p-3 rounded-2xl border border-amber-500/30">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">XP REMPORTÉE</span>
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400">+{state.totalXp} XP</span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl border border-[#E8E2D5] dark:border-zinc-700 text-xs font-bold text-[#1B2A4A] dark:text-zinc-200 hover:bg-[#F7F3EA] dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Rejouer
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors shadow-xs"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : state.isFailed ? (
          /* Écran d'Échec */
          <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-md animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1B2A4A] dark:text-white">
                Plus de vies disponibles !
              </h2>
              <p className="text-sm text-[#7A7670] dark:text-zinc-400 mt-1">
                Le débit natif demande de l&apos;entraînement. Respirez et retentez votre chance !
              </p>
            </div>

            <div className="bg-[#F7F3EA] dark:bg-zinc-800 p-3 rounded-2xl max-w-xs mx-auto border border-[#E8E2D5] dark:border-zinc-700">
              <span className="text-[11px] font-bold text-[#7A7670] block">SCORE ATTEINT</span>
              <span className="text-xl font-extrabold text-[#1B2A4A] dark:text-white">{state.score} pts</span>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl border border-[#E8E2D5] dark:border-zinc-700 text-xs font-bold text-[#7A7670] hover:text-[#1B2A4A] transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        ) : (
          /* Carte de la Phrase Cible */
          <div className="space-y-6">
            <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden">
              {/* Bouton pour écouter la prononciation modèle */}
              <button
                type="button"
                onClick={playModelPhrase}
                aria-label="Écouter la phrase modèle"
                className="absolute top-4 right-4 p-2 rounded-full bg-[#E8E2D5]/50 dark:bg-zinc-800 text-[#8B6E3F] dark:text-amber-300 hover:bg-[#C9A05C] hover:text-white transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <span className="inline-block bg-[#E8E2D5]/40 text-[#7A7670] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Phrase {state.currentIndex + 1}
                </span>

                {/* Phrase en Arabe avec Tashkeel chirurgical */}
                <h2
                  dir="rtl"
                  className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1B2A4A] dark:text-white leading-relaxed py-2"
                >
                  {currentPhrase?.arabic}
                </h2>

                {/* Phonétique Arabizi */}
                <p className="text-lg sm:text-xl font-bold text-[#8B6E3F] dark:text-amber-400">
                  {currentPhrase?.arabizi}
                </p>

                {/* Traduction Française */}
                <p className="text-xs sm:text-sm text-[#7A7670] dark:text-zinc-400 italic">
                  « {currentPhrase?.translation} »
                </p>
              </div>

              {/* Message de Feedback Visuel */}
              {feedback && (
                <div
                  className={`mt-4 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in duration-200 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>

            {/* 3. INTERACTION VOCALE & SAISIE MANUELLE */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="relative flex items-center justify-center">
                  {isListening && (
                    <>
                      <span className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                      <span className="absolute w-20 h-20 rounded-full bg-emerald-500/30 animate-pulse" />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isEvaluating}
                    aria-label={isListening ? "Arrêter l'écoute" : 'Parler'}
                    className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 disabled:opacity-50 ${
                      isListening
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105'
                        : 'bg-[#1B2A4A] text-white hover:bg-[#C9A05C] hover:text-[#1B2A4A] active:scale-95'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
                    ) : (
                      <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
                    )}
                  </button>
                </div>

                <p className="text-xs font-semibold text-center text-[#7A7670] dark:text-zinc-400">
                  {isListening ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                      Écoute active... Répétez vite !
                    </span>
                  ) : (
                    'Appuyez sur le micro et parlez avant la fin du chrono'
                  )}
                </p>

                {isListening && transcript && (
                  <p className="text-xs italic text-[#1B2A4A] dark:text-zinc-200 bg-[#E8E2D5]/50 px-3 py-1 rounded-full max-w-sm truncate">
                    « {transcript} »
                  </p>
                )}
              </div>

              {/* Fallback saisie texte */}
              <form onSubmit={handleManualSubmit} className="flex gap-2 items-center max-w-md mx-auto pt-1">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={
                    isSupported
                      ? 'Ou tapez la phrase en Arabizi...'
                      : 'Micro indisponible : tapez ici'
                  }
                  className="flex-1 bg-[#FDFCF8] dark:bg-zinc-800 border border-[#E8E2D5] dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-[#1B2A4A] dark:text-white placeholder-[#7A7670] focus:outline-hidden focus:border-[#C9A05C]"
                />
                <button
                  type="submit"
                  disabled={!manualText.trim() || isEvaluating}
                  aria-label="Valider la réponse"
                  className="px-3.5 py-2 rounded-xl bg-[#1B2A4A] text-white hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

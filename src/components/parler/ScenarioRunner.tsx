'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { DialogueScenario } from '@/types/dialogue';
import { useScenarioSession } from '@/hooks/useScenarioSession';
import { useAppStore } from '@/store/useAppStore';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Lightbulb,
  Trophy,
} from 'lucide-react';

export interface ScenarioRunnerProps {
  scenario: DialogueScenario;
  onExit: () => void;
}

export default function ScenarioRunner({ scenario, onExit }: ScenarioRunnerProps) {
  const { soundEnabled, toggleSound } = useAppStore();
  const [manualInput, setManualInput] = useState('');
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    currentTurn,
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    submitUserResponse,
    skipCurrentTurn,
    replayBotTurn,
    restart,
  } = useScenarioSession(scenario, {
    xpPerTurn: 10,
    xpCompletionBonus: 25,
  });

  const totalTurns = scenario.turns.length;
  const currentStep = Math.min(state.currentTurnIndex + 1, totalTurns);
  const progressPercent = Math.min(100, Math.round((state.currentTurnIndex / totalTurns) * 100));

  // Auto-scroll vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [state.history.length, state.isBotSpeaking, state.userWaiting, isListening]);

  // Bascule d'affichage de la traduction pour une réplique
  const toggleTranslation = (turnId: string) => {
    setShowTranslations((prev) => ({
      ...prev,
      [turnId]: !prev[turnId],
    }));
  };

  // Envoi de la saisie manuelle (fallback desktop)
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    submitUserResponse(manualInput);
    setManualInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F3EA] dark:bg-zinc-950 flex flex-col overflow-hidden font-sans">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <header className="bg-[#FDFCF8] dark:bg-zinc-900 border-b border-[#E8E2D5] dark:border-zinc-800 px-4 py-3 shrink-0 shadow-xs z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Bouton retour & Identité Scénario */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExit}
              aria-label="Quitter le scénario"
              className="p-2 -ml-1 rounded-full text-[#1B2A4A] dark:text-zinc-200 hover:bg-[#E8E2D5]/50 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-[#1B2A4A] dark:text-white truncate">
                  {scenario.title}
                </h1>
                <span className="bg-[#C9A05C]/15 text-[#8B6E3F] dark:text-amber-300 border border-[#C9A05C]/30 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0">
                  {scenario.level || 'A2'}
                </span>
              </div>
              {scenario.titleI18n?.ar && (
                <p className="text-xs text-[#8B6E3F] dark:text-amber-400 font-arabic truncate" dir="rtl">
                  {scenario.titleI18n.ar}
                </p>
              )}
            </div>
          </div>

          {/* Indicateurs : Progression & XP & Son */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#E8E2D5]/40 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-semibold text-[#1B2A4A] dark:text-zinc-300">
              <span>Étape {currentStep}/{totalTurns}</span>
            </div>

            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-400 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>+{state.xpEarned} XP</span>
            </div>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              className="p-2 rounded-full text-[#7A7670] hover:text-[#1B2A4A] dark:hover:text-white hover:bg-[#E8E2D5]/40 dark:hover:bg-zinc-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
            </button>
          </div>
        </div>

        {/* Barre de progression fluide */}
        <div className="w-full bg-[#E8E2D5] dark:bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
          <div
            className="bg-[#C9A05C] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 2. ZONE DE DISCUSSION SOUS FORME DE BULLES DE MESSAGERIE */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl mx-auto w-full">
        {/* Badge d'introduction contextuelle */}
        <div className="text-center my-2">
          <span className="inline-flex items-center gap-1.5 bg-[#E8E2D5]/60 dark:bg-zinc-800 text-[#7A7670] dark:text-zinc-400 text-xs px-3 py-1 rounded-full font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A05C]" />
            {scenario.location} · {scenario.npcRole}
          </span>
        </div>

        {/* Historique des bulles */}
        {state.history.map((turn, index) => {
          const isBot = turn.speaker === 'bot';
          const isTranslated = showTranslations[turn.id];

          return (
            <div
              key={`${turn.id}-${index}`}
              className={`flex items-end gap-2.5 sm:gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {/* Avatar Bot */}
              {isBot && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center shrink-0 shadow-xs text-base sm:text-lg border-2 border-white dark:border-zinc-800">
                  {scenario.npcAvatar || '🚕'}
                </div>
              )}

              {/* Contenu de la bulle */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs transition-all ${
                  isBot
                    ? 'bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-bl-xs text-[#1B2A4A] dark:text-zinc-100'
                    : 'bg-[#1B2A4A] text-white dark:bg-amber-600 rounded-br-xs'
                }`}
              >
                {/* Rôle de l'orateur */}
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className={`text-[11px] font-bold tracking-wide uppercase ${
                      isBot ? 'text-[#8B6E3F] dark:text-amber-400' : 'text-amber-200'
                    }`}
                  >
                    {turn.speakerRole}
                  </span>

                  {/* Bouton de réécoute audio pour les répliques bot */}
                  {isBot && (
                    <button
                      type="button"
                      onClick={() => replayBotTurn(turn)}
                      aria-label="Réécouter la voix"
                      className="p-1 rounded-full hover:bg-[#E8E2D5]/50 dark:hover:bg-zinc-800 text-[#7A7670] hover:text-[#1B2A4A] dark:hover:text-zinc-200 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-[#C9A05C]" />
                    </button>
                  )}

                  {!isBot && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Validé
                    </span>
                  )}
                </div>

                {/* Texte en Arabe avec Tashkeel chirurgical */}
                <p
                  dir="rtl"
                  className={`text-xl sm:text-2xl font-bold font-arabic leading-relaxed mb-1.5 ${
                    isBot ? 'text-[#1B2A4A] dark:text-zinc-100' : 'text-white'
                  }`}
                >
                  {turn.arabicText}
                </p>

                {/* Transcription Phonétique Arabizi */}
                <p
                  className={`text-sm font-semibold tracking-wide ${
                    isBot ? 'text-[#7A7670] dark:text-zinc-300' : 'text-amber-100'
                  }`}
                >
                  {turn.arabiziText}
                </p>

                {/* Accordéon Traduction Française */}
                {turn.translationFr && (
                  <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => toggleTranslation(turn.id)}
                      className={`text-xs flex items-center gap-1 font-semibold transition-colors ${
                        isBot
                          ? 'text-[#8B6E3F] dark:text-amber-400 hover:underline'
                          : 'text-amber-200 hover:text-white'
                      }`}
                    >
                      <span>{isTranslated ? 'Masquer la traduction' : 'Voir la traduction'}</span>
                      {isTranslated ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isTranslated && (
                      <p
                        className={`text-xs mt-1.5 italic ${
                          isBot ? 'text-[#555047] dark:text-zinc-400' : 'text-zinc-200'
                        }`}
                      >
                        « {turn.translationFr} »
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar Utilisateur */}
              {!isBot && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C9A05C] text-[#1B2A4A] font-bold flex items-center justify-center shrink-0 shadow-xs border-2 border-white dark:border-zinc-800">
                  <span className="text-sm font-extrabold">VOUS</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Indicateur de parole IA ("L'interlocuteur parle...") */}
        {state.isBotSpeaking && (
          <div className="flex items-end gap-2.5 sm:gap-3 justify-start animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-sm shadow-xs border-2 border-white dark:border-zinc-800">
              {scenario.npcAvatar || '🚕'}
            </div>
            <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="text-xs text-[#7A7670] dark:text-zinc-400 font-medium">
                {scenario.npcName || 'Chauffeur'} s&apos;exprime...
              </span>
              <div className="flex gap-1 items-center ml-1">
                <span className="w-1.5 h-1.5 bg-[#C9A05C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#C9A05C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#C9A05C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Espace réservé pour éviter le chevauchement avec la barre fixe */}
        <div className="h-6" />
      </main>

      {/* 3. BARRE D'INTERACTION VOCALE & SAISIE TEXTE */}
      <footer className="bg-[#FDFCF8] dark:bg-zinc-900 border-t border-[#E8E2D5] dark:border-zinc-800 p-4 sm:p-5 shrink-0 shadow-lg z-20">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Écran de Fin / Victoire */}
          {state.isCompleted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B2A4A] dark:text-white">
                  Mabrouk ! Scénario complété avec succès !
                </h3>
                <p className="text-xs text-[#7A7670] dark:text-zinc-400 mt-1">
                  Vous avez négocié et validé toutes les répliques en Darija authentique.
                </p>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-sm px-3 py-1 rounded-full mt-2">
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>+{state.xpEarned} XP remportés</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={restart}
                  className="px-4 py-2 rounded-xl border border-[#E8E2D5] dark:border-zinc-700 text-xs font-bold text-[#1B2A4A] dark:text-zinc-200 hover:bg-[#F7F3EA] dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Rejouer
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="px-5 py-2 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors shadow-xs"
                >
                  Terminer
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Encadré d'aide contextuelle & Indice pédagogique */}
              {state.userWaiting && currentTurn?.speaker === 'user' && (
                <div className="bg-[#F7F3EA] dark:bg-zinc-800/80 border border-[#E8E2D5] dark:border-zinc-700 rounded-2xl p-3 text-xs shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[#8B6E3F] dark:text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Indice pour votre réplique
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-[11px] underline opacity-80 hover:opacity-100"
                    >
                      {showHint ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>

                  {showHint && (
                    <div className="text-[#1B2A4A] dark:text-zinc-200 font-medium">
                      <p>{currentTurn.hintFrench || 'Exprimez votre réponse en Darija marocain.'}</p>
                      {currentTurn.expectedPhrases?.primaryArabizi && (
                        <p className="mt-1 font-semibold text-[#8B6E3F] dark:text-amber-300 text-[11px]">
                          Exemple : « {currentTurn.expectedPhrases.primaryArabizi} »
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Message d'erreur phonétique / validation */}
              {state.validationError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{state.validationError}</span>
                </div>
              )}

              {/* Bouton Microphone Central avec Onde d'écoute */}
              <div className="flex flex-col items-center justify-center gap-2 py-1">
                <div className="relative flex items-center justify-center">
                  {/* Anneau pulsant d'écoute */}
                  {isListening && (
                    <>
                      <span className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                      <span className="absolute w-20 h-20 rounded-full bg-emerald-500/30 animate-pulse" />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!state.userWaiting || state.isBotSpeaking}
                    aria-label={isListening ? "Arrêter l'enregistrement" : "Activer le microphone"}
                    className={`relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center shadow-md transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                      isListening
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 scale-105'
                        : state.userWaiting
                        ? 'bg-[#1B2A4A] text-white hover:bg-[#C9A05C] hover:text-[#1B2A4A] active:scale-95'
                        : 'bg-zinc-300 text-zinc-500 dark:bg-zinc-800'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
                    ) : (
                      <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
                    )}
                  </button>
                </div>

                {/* État / Consigne microphone */}
                <p className="text-xs font-semibold text-center text-[#7A7670] dark:text-zinc-400">
                  {isListening ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                      Écoute en cours... Parlez en Darija !
                    </span>
                  ) : state.userWaiting ? (
                    'Appuyez sur le micro pour parler'
                  ) : (
                    'Écoutez la réplique...'
                  )}
                </p>

                {/* Affichage du transcript en cours si disponible */}
                {isListening && transcript && (
                  <p className="text-xs italic text-[#1B2A4A] dark:text-zinc-200 bg-[#E8E2D5]/50 px-3 py-1 rounded-full max-w-sm truncate">
                    « {transcript} »
                  </p>
                )}
              </div>

              {/* Fallback : Champ de saisie manuelle pour Desktop sans microphone */}
              <form onSubmit={handleManualSubmit} className="flex gap-2 items-center pt-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  disabled={!state.userWaiting || state.isBotSpeaking}
                  placeholder={
                    isSupported
                      ? 'Ou écrivez votre réponse en Darija / Arabizi...'
                      : 'Reconnaissance vocale indisponible : saisissez ici'
                  }
                  className="flex-1 bg-[#F7F3EA] dark:bg-zinc-800 border border-[#E8E2D5] dark:border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-[#1B2A4A] dark:text-white placeholder-[#7A7670] focus:outline-hidden focus:border-[#C9A05C] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim() || !state.userWaiting || state.isBotSpeaking}
                  aria-label="Envoyer la réponse textuelle"
                  className="px-3.5 py-2 rounded-xl bg-[#1B2A4A] text-white hover:bg-[#C9A05C] hover:text-[#1B2A4A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </form>

              {/* Raccourci pour passer l'étape si l'utilisateur est bloqué */}
              {state.userWaiting && (
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={skipCurrentTurn}
                    className="text-[11px] font-semibold text-[#7A7670] hover:text-[#1B2A4A] dark:hover:text-zinc-200 underline transition-colors"
                  >
                    Passer cette étape (+5 XP)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

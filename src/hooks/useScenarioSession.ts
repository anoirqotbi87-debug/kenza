'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DialogueScenario, DialogueTurn } from '@/types/dialogue';
import { useVoiceRecognition } from './useVoiceRecognition';
import { calculateSimilarity, type PronunciationEvaluation } from '@/lib/phonemeMatcher';
import { playAudio } from '@/lib/audio';
import { useAppStore } from '@/store/useAppStore';

export interface ScenarioSessionOptions {
  onComplete?: (totalXp: number) => void;
  xpPerTurn?: number;
  xpCompletionBonus?: number;
}

export interface ScenarioSessionState {
  currentTurnIndex: number;
  history: DialogueTurn[];
  isCompleted: boolean;
  score: number;
  userWaiting: boolean;
  isBotSpeaking: boolean;
  validationError: string | null;
  xpEarned: number;
  lastEvaluation: PronunciationEvaluation | null;
}

export function useScenarioSession(
  scenario: DialogueScenario,
  options?: ScenarioSessionOptions
) {
  const xpPerTurn = options?.xpPerTurn ?? 10;
  const xpCompletionBonus = options?.xpCompletionBonus ?? 25;

  const { soundEnabled, addXp } = useAppStore();

  const [state, setState] = useState<ScenarioSessionState>({
    currentTurnIndex: 0,
    history: [],
    isCompleted: false,
    score: 0,
    userWaiting: false,
    isBotSpeaking: false,
    validationError: null,
    xpEarned: 0,
    lastEvaluation: null,
  });

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceRecognition('ar-MA', 6000);

  const currentTurn: DialogueTurn | undefined = scenario.turns[state.currentTurnIndex];
  const scenarioVoice: 'male' | 'female' = scenario.voice || 'male';

  const onCompleteRef = useRef(options?.onComplete);
  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
  }, [options?.onComplete]);

  // Exécution du tour du Bot (IA)
  const runBotTurn = useCallback(
    async (turn: DialogueTurn) => {
      setState((s) => ({
        ...s,
        isBotSpeaking: true,
        userWaiting: false,
        validationError: null,
        history: s.history.some((h) => h.id === turn.id) ? s.history : [...s.history, turn],
      }));

      // Audio Edge TTS / pré-généré
      try {
        await playAudio(
          turn.arabiziText || turn.arabicText,
          turn.audioKey || turn.arabicText,
          soundEnabled,
          1.0,
          { voice: scenarioVoice }
        );
      } catch (err) {
        console.warn('[ScenarioSession] Audio playback warning:', err);
      }

      setState((s) => {
        const nextIndex = s.currentTurnIndex + 1;
        const nextTurn = scenario.turns[nextIndex];
        if (!nextTurn) {
          // Fin du scénario
          const finalXp = s.xpEarned + xpCompletionBonus;
          addXp(xpCompletionBonus);
          onCompleteRef.current?.(finalXp);
          return {
            ...s,
            isBotSpeaking: false,
            isCompleted: true,
            currentTurnIndex: nextIndex,
            xpEarned: finalXp,
          };
        }
        return {
          ...s,
          isBotSpeaking: false,
          currentTurnIndex: nextIndex,
          userWaiting: nextTurn.speaker === 'user',
        };
      });
    },
    [scenario.turns, soundEnabled, scenarioVoice, xpCompletionBonus, addXp]
  );

  // Boucle principale du moteur
  useEffect(() => {
    if (state.isCompleted || !currentTurn) return;

    if (currentTurn.speaker === 'bot' && !state.isBotSpeaking && !state.userWaiting) {
      const timer = setTimeout(() => {
        void runBotTurn(currentTurn);
      }, 0);
      return () => clearTimeout(timer);
    } else if (currentTurn.speaker === 'user' && !state.userWaiting && !state.isBotSpeaking) {
      const timer = setTimeout(() => {
        setState((s) => ({ ...s, userWaiting: true, validationError: null }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, state.isCompleted, state.isBotSpeaking, state.userWaiting, runBotTurn]);

  // Validation de la réponse utilisateur (vocal ou saisie texte)
  const submitUserResponse = useCallback(
    (input: string) => {
      if (!currentTurn || currentTurn.speaker !== 'user' || !state.userWaiting) return;

      const expected = currentTurn.expectedPhrases;
      const normalizedInput = input.trim().toLowerCase();

      if (!normalizedInput) return;

      let isValid = false;
      let evalResult: PronunciationEvaluation | null = null;
      let matchedScore = 50;

      if (expected) {
        evalResult = calculateSimilarity(
          input,
          expected.primaryArabizi,
          expected.primaryArabic
        );
        matchedScore = evalResult.score;

        // 1. Vérification par le score de similarité phonétique
        if (evalResult.score >= 55) {
          isValid = true;
        }

        // 2. Vérification par variantes acceptées
        if (!isValid && expected.acceptedVariants) {
          for (const variant of expected.acceptedVariants) {
            const normVariant = variant.toLowerCase().trim();
            if (
              normalizedInput.includes(normVariant) ||
              normVariant.includes(normalizedInput)
            ) {
              isValid = true;
              matchedScore = Math.max(matchedScore, 80);
              break;
            }
          }
        }

        // 3. Vérification par mots-clés d'aide
        if (!isValid && expected.hints && expected.hints.length > 0) {
          const matchedHints = expected.hints.filter((hint) =>
            normalizedInput.includes(hint.toLowerCase().trim())
          );
          if (matchedHints.length >= Math.ceil(expected.hints.length / 2)) {
            isValid = true;
            matchedScore = Math.max(matchedScore, 70);
          }
        }
      } else {
        // Fallback sans expectedPhrases strict
        isValid = true;
      }

      if (isValid) {
        // Succès !
        playAudio('correct', undefined, soundEnabled);
        addXp(xpPerTurn);

        const userTurnWithSpokenText: DialogueTurn = {
          ...currentTurn,
          arabiziText: currentTurn.arabiziText || expected?.primaryArabizi || input,
          arabicText: currentTurn.arabicText || expected?.primaryArabic || input,
        };

        const nextIndex = state.currentTurnIndex + 1;
        const nextTurn = scenario.turns[nextIndex];
        const newXpEarned = state.xpEarned + xpPerTurn;

        if (typeof resetTranscript === 'function') resetTranscript();

        if (!nextTurn) {
          // Dernier tour complété !
          const finalXp = newXpEarned + xpCompletionBonus;
          addXp(xpCompletionBonus);
          onCompleteRef.current?.(finalXp);

          setState((s) => ({
            ...s,
            history: [...s.history, userTurnWithSpokenText],
            currentTurnIndex: nextIndex,
            isCompleted: true,
            userWaiting: false,
            score: s.score + matchedScore,
            xpEarned: finalXp,
            validationError: null,
            lastEvaluation: evalResult,
          }));
        } else {
          setState((s) => ({
            ...s,
            history: [...s.history, userTurnWithSpokenText],
            currentTurnIndex: nextIndex,
            userWaiting: false,
            score: s.score + matchedScore,
            xpEarned: newXpEarned,
            validationError: null,
            lastEvaluation: evalResult,
          }));
        }
      } else {
        // Échec phonétique
        playAudio('error', undefined, soundEnabled);
        if (typeof resetTranscript === 'function') resetTranscript();

        setState((s) => ({
          ...s,
          validationError:
            currentTurn.hintFrench ||
            "Prononciation non reconnue. Réessayez ou utilisez l'indice !",
          lastEvaluation: evalResult,
        }));
      }
    },
    [
      currentTurn,
      state.userWaiting,
      state.currentTurnIndex,
      state.xpEarned,
      scenario.turns,
      soundEnabled,
      xpPerTurn,
      xpCompletionBonus,
      addXp,
      resetTranscript,
    ]
  );

  const submitUserResponseRef = useRef<(input: string) => void>(() => {});
  useEffect(() => {
    submitUserResponseRef.current = submitUserResponse;
  });

  // Synchronisation du résultat vocal automatique à l'arrêt du micro
  useEffect(() => {
    if (!isListening && transcript && state.userWaiting && currentTurn?.speaker === 'user') {
      const timer = setTimeout(() => {
        submitUserResponseRef.current(transcript);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, state.userWaiting, currentTurn?.speaker]);

  // Passer le tour si l'utilisateur est bloqué
  const skipCurrentTurn = useCallback(() => {
    if (!currentTurn || currentTurn.speaker !== 'user') return;

    const fallbackUserTurn: DialogueTurn = {
      ...currentTurn,
      arabiziText: currentTurn.arabiziText || currentTurn.expectedPhrases?.primaryArabizi || '',
      arabicText: currentTurn.arabicText || currentTurn.expectedPhrases?.primaryArabic || '',
    };

    const nextIndex = state.currentTurnIndex + 1;
    const nextTurn = scenario.turns[nextIndex];
    const skippedXp = 5;
    addXp(skippedXp);

    if (typeof resetTranscript === 'function') resetTranscript();

    if (!nextTurn) {
      const finalXp = state.xpEarned + skippedXp;
      onCompleteRef.current?.(finalXp);
      setState((s) => ({
        ...s,
        history: [...s.history, fallbackUserTurn],
        currentTurnIndex: nextIndex,
        isCompleted: true,
        userWaiting: false,
        xpEarned: finalXp,
        validationError: null,
      }));
    } else {
      setState((s) => ({
        ...s,
        history: [...s.history, fallbackUserTurn],
        currentTurnIndex: nextIndex,
        userWaiting: false,
        xpEarned: s.xpEarned + skippedXp,
        validationError: null,
      }));
    }
  }, [currentTurn, state.currentTurnIndex, state.xpEarned, scenario.turns, addXp, resetTranscript]);

  // Réécouter une réplique bot
  const replayBotTurn = useCallback(
    async (turn?: DialogueTurn) => {
      const targetTurn = turn || state.history.filter((h) => h.speaker === 'bot').slice(-1)[0];
      if (!targetTurn) return;
      try {
        await playAudio(
          targetTurn.arabiziText || targetTurn.arabicText,
          targetTurn.audioKey || targetTurn.arabicText,
          true,
          1.0,
          { voice: scenarioVoice }
        );
      } catch (err) {
        console.warn('[ScenarioSession] Replay warning:', err);
      }
    },
    [state.history, scenarioVoice]
  );

  // Redémarrer le scénario
  const restart = useCallback(() => {
    if (typeof resetTranscript === 'function') resetTranscript();
    setState({
      currentTurnIndex: 0,
      history: [],
      isCompleted: false,
      score: 0,
      userWaiting: false,
      isBotSpeaking: false,
      validationError: null,
      xpEarned: 0,
      lastEvaluation: null,
    });
  }, [resetTranscript]);

  return {
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
  };
}

import { useState, useEffect, useCallback } from 'react';
import { DialogueScenario, DialogueTurn } from '../types/dialogue';
import { useVoiceRecognition } from './useVoiceRecognition';
import { calculateSimilarity } from '../utils/phonemeMatcher';
import { playAudio } from '../lib/audio';

export interface DialogueRunnerState {
  currentTurnIndex: number;
  history: DialogueTurn[];
  isCompleted: boolean;
  score: number;
  userWaiting: boolean; // True when it's user's turn
  isBotSpeaking: boolean;
  validationError: string | null;
}

export function useDialogueRunner(scenario: DialogueScenario, soundEnabled: boolean = true) {
  const [state, setState] = useState<DialogueRunnerState>({
    currentTurnIndex: 0,
    history: [],
    isCompleted: false,
    score: 0,
    userWaiting: false,
    isBotSpeaking: false,
    validationError: null,
  });

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition('ar-MA', 5000);

  const currentTurn = scenario.turns[state.currentTurnIndex];

  // Engine loop
  useEffect(() => {
    if (state.isCompleted) return;
    if (!currentTurn) {
      setState(s => ({ ...s, isCompleted: true }));
      return;
    }

    const runBotTurn = async () => {
      setState(s => ({ ...s, isBotSpeaking: true, userWaiting: false, validationError: null }));
      
      // Add bot turn to history immediately
      setState(s => {
        if (!s.history.find(t => t.id === currentTurn.id)) {
          return { ...s, history: [...s.history, currentTurn] };
        }
        return s;
      });

      // Play audio
      // In a real app we might fetch audioURL from a CDN via audioKey.
      // Here we just use TTS fallback with the text.
      await playAudio(currentTurn.arabiziText, undefined, soundEnabled);
      
      // Proceed to next turn
      setState(s => ({ ...s, isBotSpeaking: false, currentTurnIndex: s.currentTurnIndex + 1 }));
    };

    if (currentTurn.speaker === 'bot' && !state.isBotSpeaking) {
      runBotTurn();
    } else if (currentTurn.speaker === 'user' && !state.userWaiting) {
      // It's user's turn, wait for action
      setState(s => ({ ...s, userWaiting: true, validationError: null }));
      
      // Add to history so it shows up as a pending bubble (or wait until spoken)
      // We will add it to history as an empty bubble waiting for input, or just show the expected text in the input area.
      // Usually, user's turn bubble is only added after they speak.
    }
  }, [state.currentTurnIndex, currentTurn, state.isCompleted, soundEnabled, state.isBotSpeaking, state.userWaiting]);

  // Voice Evaluation
  useEffect(() => {
    if (!isListening && transcript && state.userWaiting && currentTurn?.speaker === 'user') {
      validateUserInput(transcript);
    }
  }, [isListening, transcript, state.userWaiting]);

  const validateUserInput = (input: string) => {
    if (!currentTurn?.expectedPhrases) return;
    
    // Evaluate pronunciation robustly using phonemeMatcher
    // We check against the primary phrase
    const result = calculateSimilarity(input, currentTurn.expectedPhrases.primaryArabizi, currentTurn.expectedPhrases.primaryArabic);
    
    // Check accepted variants (simple includes/Levenstein for fallback)
    const normalizedInput = input.toLowerCase().trim();
    let isVariantMatch = false;
    for (const variant of currentTurn.expectedPhrases.acceptedVariants) {
      if (normalizedInput.includes(variant.toLowerCase())) {
        isVariantMatch = true;
        break;
      }
    }

    if (result.score >= 65 || isVariantMatch) {
      // Success!
      // Add user's phrase to history
      const userTurnWithSpokenText = {
        ...currentTurn,
        arabiziText: currentTurn.expectedPhrases.primaryArabizi, // Or use actual transcript mapping if we had an Arabizi mapper
        arabicText: currentTurn.expectedPhrases.primaryArabic,
      };

      playAudio('correct', undefined, soundEnabled);

      setState(s => ({
        ...s,
        history: [...s.history, userTurnWithSpokenText],
        currentTurnIndex: s.currentTurnIndex + 1,
        userWaiting: false,
        score: s.score + result.score,
        validationError: null
      }));
      resetTranscript();
    } else {
      setState(s => ({
        ...s,
        validationError: "Je n'ai pas bien compris. Essayez encore !"
      }));
      playAudio('error', undefined, soundEnabled);
      resetTranscript();
    }
  };

  const skipUserTurn = () => {
    if (!currentTurn) return;
    const userTurn = {
      ...currentTurn,
      arabiziText: currentTurn.expectedPhrases?.primaryArabizi || '',
      arabicText: currentTurn.expectedPhrases?.primaryArabic || '',
    };
    setState(s => ({
      ...s,
      history: [...s.history, userTurn],
      currentTurnIndex: s.currentTurnIndex + 1,
      userWaiting: false,
      validationError: null
    }));
  };

  return {
    state,
    currentTurn,
    isListening,
    transcript,
    startListening,
    stopListening,
    skipUserTurn
  };
}

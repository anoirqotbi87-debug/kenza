import { SpeedChallengePhrase } from '@/data/speedChallengePhrases';

export interface SpeedChallengeState {
  lives: number;
  score: number;
  currentIndex: number;
  isCompleted: boolean;
  isFailed: boolean;
  streak: number;
  totalXp: number;
}

export const INITIAL_LIVES = 3;

/**
 * Initialise l'état du mini-jeu Speed Challenge
 */
export function createInitialSpeedChallengeState(initialLives = INITIAL_LIVES): SpeedChallengeState {
  return {
    lives: initialLives,
    score: 0,
    currentIndex: 0,
    isCompleted: false,
    isFailed: false,
    streak: 0,
    totalXp: 0,
  };
}

/**
 * Vérifie si la transcription correspond aux mots-clés de la phrase
 */
export function checkPhraseMatch(
  utterance: string,
  phrase: SpeedChallengePhrase
): boolean {
  if (!utterance || !phrase) return false;
  const clean = utterance.toLowerCase().trim();

  // 1. Correspondance directe avec les mots-clés attendus
  for (const kw of phrase.expectedKeywords) {
    const cleanKw = kw.toLowerCase().trim();
    if (clean.includes(cleanKw)) {
      return true;
    }
  }

  // 2. Tolérance pour Arabizi / Arabe sans diacritiques
  const normArabizi = phrase.arabizi.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normUtterance = clean.replace(/[^a-z0-9]/g, '');
  if (normArabizi.length > 3 && normUtterance.includes(normArabizi)) {
    return true;
  }

  return false;
}

/**
 * Traite une réponse vocale ou textuelle de l'apprenant
 */
export function submitUtterance(
  state: SpeedChallengeState,
  utterance: string,
  phrases: SpeedChallengePhrase[],
  options?: { remainingSeconds?: number }
): { nextState: SpeedChallengeState; isSuccess: boolean } {
  if (state.isCompleted || state.isFailed) {
    return { nextState: state, isSuccess: false };
  }

  const currentPhrase = phrases[state.currentIndex];
  if (!currentPhrase) {
    return { nextState: { ...state, isCompleted: true }, isSuccess: false };
  }

  const isMatch = checkPhraseMatch(utterance, currentPhrase);

  if (isMatch) {
    const timeBonus = (options?.remainingSeconds || 0) * 10;
    const pointsGained = 100 + timeBonus;
    const xpGained = currentPhrase.xpReward || 10;
    const nextIndex = state.currentIndex + 1;
    const isCompleted = nextIndex >= phrases.length;

    const nextState: SpeedChallengeState = {
      ...state,
      score: state.score + pointsGained,
      streak: state.streak + 1,
      totalXp: state.totalXp + xpGained + (isCompleted ? 25 : 0),
      currentIndex: nextIndex,
      isCompleted,
    };

    return { nextState, isSuccess: true };
  } else {
    const newLives = state.lives - 1;
    const isFailed = newLives <= 0;

    const nextState: SpeedChallengeState = {
      ...state,
      lives: Math.max(0, newLives),
      streak: 0,
      isFailed,
    };

    return { nextState, isSuccess: false };
  }
}

/**
 * Gère le dépassement du compte à rebours
 */
export function handleTimeout(
  state: SpeedChallengeState,
  _phrases?: SpeedChallengePhrase[]
): SpeedChallengeState {
  if (state.isCompleted || state.isFailed) return state;

  const newLives = state.lives - 1;
  const isFailed = newLives <= 0;

  return {
    ...state,
    lives: Math.max(0, newLives),
    streak: 0,
    isFailed,
  };
}

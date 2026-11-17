import { describe, it, expect, beforeEach } from 'vitest';
import {
  SPEED_CHALLENGE_PHRASES,
  type SpeedChallengePhrase,
} from '@/data/speedChallengePhrases';
import {
  createInitialSpeedChallengeState,
  submitUtterance,
  handleTimeout,
  checkPhraseMatch,
  INITIAL_LIVES,
} from '@/lib/speedChallengeEngine';

describe('Speed Challenge — Moteur de Jeu & Machine à États', () => {
  let phrases: SpeedChallengePhrase[];

  beforeEach(() => {
    phrases = SPEED_CHALLENGE_PHRASES;
  });

  describe('1. Intégrité des Données de Phrases', () => {
    it('comporte exactement 5 phrases clés en Darija', () => {
      expect(phrases).toHaveLength(5);
    });

    it('chaque phrase possède un Tashkeel chirurgical, une phonétique et des mots-clés', () => {
      const arabicTashkeelRegex = /[\u064B-\u0652\u0651]/;
      for (const p of phrases) {
        expect(p.arabic).toMatch(arabicTashkeelRegex);
        expect(p.arabizi.length).toBeGreaterThan(3);
        expect(p.translation.length).toBeGreaterThan(3);
        expect(p.expectedKeywords.length).toBeGreaterThan(1);
        expect(p.timeLimit).toBeGreaterThanOrEqual(5);
      }
    });
  });

  describe('2. Initialisation de la Machine à États', () => {
    it('initialise correctement avec 3 vies, score 0, index 0 et aucun statut de fin', () => {
      const state = createInitialSpeedChallengeState();
      expect(state.lives).toBe(INITIAL_LIVES);
      expect(state.score).toBe(0);
      expect(state.currentIndex).toBe(0);
      expect(state.isCompleted).toBe(false);
      expect(state.isFailed).toBe(false);
      expect(state.streak).toBe(0);
      expect(state.totalXp).toBe(0);
    });
  });

  describe('3. Validation des Réponses & Correspondance des Mots-Clés (submitUtterance)', () => {
    it('incrémente le score et passe à la phrase suivante en cas de mot-clé valide', () => {
      const state = createInitialSpeedChallengeState();
      const firstPhrase = phrases[0];

      // Première phrase : "Ash kat3awed ?" avec mot-clé "kat3awed"
      const { nextState, isSuccess } = submitUtterance(state, 'kat3awed', phrases, {
        remainingSeconds: 3,
      });

      expect(isSuccess).toBe(true);
      expect(nextState.currentIndex).toBe(1);
      expect(nextState.score).toBe(130); // 100 de base + 3*10 bonus
      expect(nextState.streak).toBe(1);
      expect(nextState.lives).toBe(3);
      expect(nextState.totalXp).toBe(firstPhrase.xpReward || 10);
      expect(nextState.isCompleted).toBe(false);
    });

    it('décrémente une vie en cas de mauvaise réponse vocale', () => {
      const state = createInitialSpeedChallengeState();
      const { nextState, isSuccess } = submitUtterance(state, 'nimporte quoi', phrases);

      expect(isSuccess).toBe(false);
      expect(nextState.currentIndex).toBe(0);
      expect(nextState.lives).toBe(2);
      expect(nextState.score).toBe(0);
      expect(nextState.streak).toBe(0);
      expect(nextState.isFailed).toBe(false);
    });
  });

  describe('4. Gestion du Dépassement de Temps (handleTimeout)', () => {
    it('décrémente les vies sans incrémenter le score lors d’un timeout', () => {
      const state = createInitialSpeedChallengeState();
      const nextState = handleTimeout(state, phrases);

      expect(nextState.lives).toBe(2);
      expect(nextState.currentIndex).toBe(0);
      expect(nextState.score).toBe(0);
      expect(nextState.isFailed).toBe(false);
    });
  });

  describe('5. État d’Échec (isFailed)', () => {
    it('déclenche l’état d’échec lorsque les 3 vies sont épuisées', () => {
      let state = createInitialSpeedChallengeState();

      // Perte de 3 vies
      state = submitUtterance(state, 'faux 1', phrases).nextState;
      expect(state.lives).toBe(2);
      expect(state.isFailed).toBe(false);

      state = handleTimeout(state, phrases);
      expect(state.lives).toBe(1);
      expect(state.isFailed).toBe(false);

      state = submitUtterance(state, 'faux 2', phrases).nextState;
      expect(state.lives).toBe(0);
      expect(state.isFailed).toBe(true);

      // Une tentative ultérieure ne modifie plus l'état
      const after = submitUtterance(state, 'daba', phrases);
      expect(after.nextState.isFailed).toBe(true);
    });
  });

  describe('6. Validation du Succès Complet (isCompleted)', () => {
    it('déclenche isCompleted avec bonus d’XP après avoir enchaîné toutes les 5 phrases', () => {
      let state = createInitialSpeedChallengeState();

      for (let i = 0; i < phrases.length; i++) {
        const p = phrases[i];
        const validKeyword = p.expectedKeywords[0];
        const res = submitUtterance(state, validKeyword, phrases, { remainingSeconds: 2 });
        expect(res.isSuccess).toBe(true);
        state = res.nextState;
      }

      expect(state.currentIndex).toBe(phrases.length);
      expect(state.isCompleted).toBe(true);
      expect(state.isFailed).toBe(false);
      expect(state.lives).toBe(3);
      expect(state.score).toBe(5 * 120); // 100 + 20 par phrase
      expect(state.totalXp).toBeGreaterThanOrEqual(75); // somme des xp + 25 bonus fin
    });
  });

  describe('7. Algorithme de Match (checkPhraseMatch)', () => {
    it('reconnaît le mot en arabe comme en arabizi', () => {
      const phrase = phrases[0]; // "أَشْ كَاتْعَاوْدْ ؟"
      expect(checkPhraseMatch('ash kat3awed', phrase)).toBe(true);
      expect(checkPhraseMatch('اش كاتعاود', phrase)).toBe(true);
      expect(checkPhraseMatch('bonjour tout le monde', phrase)).toBe(false);
    });
  });
});

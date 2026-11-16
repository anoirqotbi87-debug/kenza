import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateAdaptiveDailyQuests,
  applyQuestEvent,
  getTodayDateKey,
  DAILY_CHEST_BONUS_XP,
} from '@/lib/quests/questEngine';
import { DailyQuestsState } from '@/types/quests';
import { SRSCard } from '@/types/srs';
import { useAppStore } from '@/store/useAppStore';

describe('Quest Engine — Adaptative Daily Quests (v1.3)', () => {
  beforeEach(() => {
    useAppStore.getState().resetData();
  });

  describe('getTodayDateKey', () => {
    it('formate correctement la date en YYYY-MM-DD', () => {
      const fixedDate = new Date(2026, 10, 16); // 16 Novembre 2026
      expect(getTodayDateKey(fixedDate)).toBe('2026-11-16');

      const singleDigitMonth = new Date(2026, 4, 5); // 5 Mai 2026
      expect(getTodayDateKey(singleDigitMonth)).toBe('2026-05-05');
    });
  });

  describe('generateAdaptiveDailyQuests — Adaptabilité des 3 Slots', () => {
    it('Slot Mémoire : bascule sur srs_review_due avec 30 XP quand dueCount >= 8', () => {
      const deck: Record<string, SRSCard> = {};
      const quests = generateAdaptiveDailyQuests('2026-11-16', deck, 10, 3);

      const mem = quests.find((q) => q.category === 'memory');
      expect(mem).toBeDefined();
      expect(mem?.type).toBe('srs_review_due');
      expect(mem?.target).toBe(10);
      expect(mem?.xpReward).toBe(30);
    });

    it('Slot Mémoire : bascule sur srs_fast_recall (35 XP) si au moins 3 cartes lentes (> 4000ms)', () => {
      const deck: Record<string, SRSCard> = {
        c1: {
          id: 'c1',
          wordId: 'salam',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
          state: 'review',
          averageResponseTimeMs: 4500,
        },
        c2: {
          id: 'c2',
          wordId: 'shukran',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
          state: 'review',
          averageResponseTimeMs: 5200,
        },
        c3: {
          id: 'c3',
          wordId: 'afak',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
          state: 'review',
          averageResponseTimeMs: 4100,
        },
      };

      const quests = generateAdaptiveDailyQuests('2026-11-16', deck, 2, 3);
      const mem = quests.find((q) => q.category === 'memory');

      expect(mem?.type).toBe('srs_fast_recall');
      expect(mem?.target).toBe(5);
      expect(mem?.xpReward).toBe(35);
    });

    it('Slot Mémoire : utilise le palier de base si peu de cartes dues et temps normal', () => {
      const deck: Record<string, SRSCard> = {};
      const quests = generateAdaptiveDailyQuests('2026-11-16', deck, 2, 1);
      const mem = quests.find((q) => q.category === 'memory');

      expect(mem?.type).toBe('srs_review_due');
      expect(mem?.target).toBe(3);
      expect(mem?.xpReward).toBe(20);
    });

    it('Slot Vocal : active vocal_rehab (40 XP) avec focusTarget si dette vocale existante', () => {
      const deck: Record<string, SRSCard> = {
        c_khobz: {
          id: 'srs_khobz',
          wordId: 'khobz',
          interval: 1,
          repetition: 1,
          easeFactor: 2.2,
          dueDate: new Date().toISOString(),
          state: 'learning',
          vocalFailureCount: 2,
        },
      };

      const quests = generateAdaptiveDailyQuests('2026-11-16', deck, 1, 2);
      const voc = quests.find((q) => q.category === 'vocal');

      expect(voc?.type).toBe('vocal_rehab');
      expect(voc?.target).toBe(1);
      expect(voc?.xpReward).toBe(40);
      expect(voc?.focusTarget).toBe('khobz');
    });

    it('Slot Vocal : utilise vocal_practice (30 XP, target 3) en l’absence de dette vocale', () => {
      const deck: Record<string, SRSCard> = {};
      const quests = generateAdaptiveDailyQuests('2026-11-16', deck, 0, 0);
      const voc = quests.find((q) => q.category === 'vocal');

      expect(voc?.type).toBe('vocal_practice');
      expect(voc?.target).toBe(3);
      expect(voc?.xpReward).toBe(30);
    });

    it('Slot Exploration : alterne déterministement entre earn_xp et complete_lesson', () => {
      // 2026-11-16 -> 20261116 (pair) -> earn_xp
      const quests16 = generateAdaptiveDailyQuests('2026-11-16', {}, 0, 8);
      const exp16 = quests16.find((q) => q.category === 'exploration');
      expect(exp16?.type).toBe('earn_xp');
      expect(exp16?.target).toBe(80); // streak >= 7 -> 80 XP

      // 2026-11-17 -> 20261117 (impair) -> complete_lesson
      const quests17 = generateAdaptiveDailyQuests('2026-11-17', {}, 0, 2);
      const exp17 = quests17.find((q) => q.category === 'exploration');
      expect(exp17?.type).toBe('complete_lesson');
      expect(exp17?.target).toBe(1);
    });
  });

  describe('applyQuestEvent — Progression, Validation et Coffre Bonus', () => {
    it('fait progresser et valide une quête mémoire avec crédit d’XP', () => {
      const initialState: DailyQuestsState = {
        dateKey: '2026-11-16',
        quests: [
          {
            id: 'q_mem',
            type: 'srs_review_due',
            category: 'memory',
            target: 2,
            progress: 0,
            xpReward: 20,
            completed: false,
            claimed: false,
          },
        ],
        dailyBonusClaimed: false,
        completedQuestsTotal: 0,
      };

      const step1 = applyQuestEvent(initialState, {
        type: 'SRS_REVIEW',
        grade: 'good',
      });
      expect(step1.nextState.quests[0].progress).toBe(1);
      expect(step1.nextState.quests[0].completed).toBe(false);
      expect(step1.xpGained).toBe(0);

      const step2 = applyQuestEvent(step1.nextState, {
        type: 'SRS_REVIEW',
        grade: 'easy',
      });
      expect(step2.nextState.quests[0].progress).toBe(2);
      expect(step2.nextState.quests[0].completed).toBe(true);
      expect(step2.nextState.quests[0].claimed).toBe(true);
      expect(step2.xpGained).toBe(20 + DAILY_CHEST_BONUS_XP); // 20 XP quête + 50 XP coffre car 100% complété
      expect(step2.chestUnlocked).toBe(true);
      expect(step2.nextState.dailyBonusClaimed).toBe(true);
    });

    it('ne valide srs_fast_recall que pour les réponses rapides (<= 3500ms) et non échouées', () => {
      const initialState: DailyQuestsState = {
        dateKey: '2026-11-16',
        quests: [
          {
            id: 'q_fast',
            type: 'srs_fast_recall',
            category: 'memory',
            target: 2,
            progress: 0,
            xpReward: 35,
            completed: false,
            claimed: false,
          },
        ],
        dailyBonusClaimed: false,
        completedQuestsTotal: 0,
      };

      // Réponse trop lente (> 3500ms) -> pas d'incrément
      const stepSlow = applyQuestEvent(initialState, {
        type: 'SRS_REVIEW',
        grade: 'good',
        responseTimeMs: 4200,
      });
      expect(stepSlow.nextState.quests[0].progress).toBe(0);

      // Réponse rapide mais échouée (again) -> pas d'incrément
      const stepAgain = applyQuestEvent(initialState, {
        type: 'SRS_REVIEW',
        grade: 'again',
        responseTimeMs: 1200,
      });
      expect(stepAgain.nextState.quests[0].progress).toBe(0);

      // Réponse rapide réussie -> incrément
      const stepFast = applyQuestEvent(initialState, {
        type: 'SRS_REVIEW',
        grade: 'good',
        responseTimeMs: 2100,
      });
      expect(stepFast.nextState.quests[0].progress).toBe(1);
    });

    it('débloque le coffre bonus (+50 XP) uniquement à l’achèvement des 3 quêtes', () => {
      const initialState: DailyQuestsState = {
        dateKey: '2026-11-16',
        quests: [
          {
            id: 'q1',
            type: 'srs_review_due',
            category: 'memory',
            target: 1,
            progress: 1,
            xpReward: 20,
            completed: true,
            claimed: true,
          },
          {
            id: 'q2',
            type: 'vocal_practice',
            category: 'vocal',
            target: 1,
            progress: 1,
            xpReward: 30,
            completed: true,
            claimed: true,
          },
          {
            id: 'q3',
            type: 'complete_lesson',
            category: 'exploration',
            target: 1,
            progress: 0,
            xpReward: 25,
            completed: false,
            claimed: false,
          },
        ],
        dailyBonusClaimed: false,
        completedQuestsTotal: 2,
      };

      const result = applyQuestEvent(initialState, {
        type: 'LESSON_COMPLETED',
        lessonId: 'm1_l1',
      });

      expect(result.nextState.quests[2].completed).toBe(true);
      expect(result.chestUnlocked).toBe(true);
      expect(result.xpGained).toBe(25 + 50); // 25 XP quête + 50 XP coffre
      expect(result.nextState.dailyBonusClaimed).toBe(true);
      expect(result.nextState.completedQuestsTotal).toBe(3);

      // Événement suivant : ne ré-attribue pas le coffre
      const followUp = applyQuestEvent(result.nextState, {
        type: 'XP_EARNED',
        amount: 20,
      });
      expect(followUp.chestUnlocked).toBe(false);
      expect(followUp.xpGained).toBe(0);
    });
  });

  describe('Store Integration & Vocal Rehabilitation (`recordVocalSuccess`)', () => {
    it('réhabilite la dette vocale (décrémente vocalFailureCount), recalcule l’urgence et avance la quête', () => {
      const store = useAppStore.getState();

      // Configurer une carte avec dette vocale
      useAppStore.setState({
        srsDeck: {
          srs_qahwa: {
            id: 'srs_qahwa',
            wordId: 'qahwa',
            interval: 1,
            repetition: 0,
            easeFactor: 2.2,
            dueDate: new Date().toISOString(),
            state: 'learning',
            vocalFailureCount: 2,
            averageResponseTimeMs: 2500,
          },
        },
      });

      // Initialiser les quêtes
      store.ensureDailyQuests();
      const currentQuests = useAppStore.getState().dailyQuests;
      const vocalQuest = currentQuests.quests.find((q) => q.type === 'vocal_rehab');
      expect(vocalQuest).toBeDefined();

      // Succès vocal >= 75
      store.recordVocalSuccess('qahwa', 85);

      const updatedCard = useAppStore.getState().srsDeck.srs_qahwa;
      expect(updatedCard.vocalFailureCount).toBe(1); // Décrémenté de 2 à 1
      expect(updatedCard.urgencyScore).toBeDefined();

      // Vérifier la progression de la quête vocal_rehab
      const updatedQuests = useAppStore.getState().dailyQuests;
      const updatedVocalQuest = updatedQuests.quests.find((q) => q.type === 'vocal_rehab');
      expect(updatedVocalQuest?.progress).toBe(1);
    });

    it('gère la résolution résiliente de clés (avec ou sans préfixe srs_) lors du succès vocal', () => {
      const store = useAppStore.getState();

      useAppStore.setState({
        srsDeck: {
          atay: {
            id: 'atay',
            wordId: 'atay',
            interval: 2,
            repetition: 1,
            easeFactor: 2.5,
            dueDate: new Date().toISOString(),
            state: 'review',
            vocalFailureCount: 1,
          },
        },
      });

      store.ensureDailyQuests();

      // Appel avec préfixe srs_atay alors que la clé est atay
      store.recordVocalSuccess('srs_atay', 90);

      const updatedCard = useAppStore.getState().srsDeck.atay;
      expect(updatedCard.vocalFailureCount).toBe(0);
    });
  });
});

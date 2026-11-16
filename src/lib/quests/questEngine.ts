import { DailyQuest, DailyQuestsState, QuestEventPayload } from '../../types/quests';
import { SRSCard } from '../../types/srs';

export const DAILY_CHEST_BONUS_XP = 50;

/**
 * Retourne la clé de date locale au format YYYY-MM-DD.
 */
export function getTodayDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Génère les 3 quêtes quotidiennes adaptatives de manière déterministe en fonction
 * de l'état actuel de l'apprenant (pile SRS due, temps de réaction, dette vocale, streak).
 */
export function generateAdaptiveDailyQuests(
  dateKey: string,
  srsDeck: Record<string, SRSCard>,
  dueCount: number,
  streakDays: number
): DailyQuest[] {
  const cards = Object.values(srsDeck || {});

  // 1. Slot Mémoire (memory)
  let memoryQuest: DailyQuest;
  if (dueCount >= 8) {
    const target = Math.min(12, dueCount);
    memoryQuest = {
      id: `${dateKey}_memory_srs_review_due`,
      type: 'srs_review_due',
      category: 'memory',
      target,
      progress: 0,
      xpReward: 30,
      completed: false,
      claimed: false,
    };
  } else {
    // Analyse des cartes lentes (> 4000 ms)
    const slowCards = cards.filter(
      (c) => (c.averageResponseTimeMs ?? 0) > 4000
    );
    if (slowCards.length >= 3) {
      memoryQuest = {
        id: `${dateKey}_memory_srs_fast_recall`,
        type: 'srs_fast_recall',
        category: 'memory',
        target: 5,
        progress: 0,
        xpReward: 35,
        completed: false,
        claimed: false,
      };
    } else {
      const target = Math.max(3, Math.min(5, dueCount || 5));
      memoryQuest = {
        id: `${dateKey}_memory_srs_review_due`,
        type: 'srs_review_due',
        category: 'memory',
        target,
        progress: 0,
        xpReward: 20,
        completed: false,
        claimed: false,
      };
    }
  }

  // 2. Slot Vocal (vocal)
  let vocalQuest: DailyQuest;
  const vocalDebtCards = cards.filter((c) => (c.vocalFailureCount ?? 0) > 0);

  if (vocalDebtCards.length >= 1) {
    const target = Math.min(3, vocalDebtCards.length);
    vocalQuest = {
      id: `${dateKey}_vocal_vocal_rehab`,
      type: 'vocal_rehab',
      category: 'vocal',
      target,
      progress: 0,
      xpReward: 40,
      completed: false,
      claimed: false,
      focusTarget: vocalDebtCards[0]?.wordId,
    };
  } else {
    vocalQuest = {
      id: `${dateKey}_vocal_vocal_practice`,
      type: 'vocal_practice',
      category: 'vocal',
      target: 3,
      progress: 0,
      xpReward: 30,
      completed: false,
      claimed: false,
    };
  }

  // 3. Slot Exploration (exploration)
  // Alternance déterministe basée sur le jour de la dateKey
  let explorationQuest: DailyQuest;
  const numericDate = parseInt(dateKey.replace(/-/g, ''), 10) || 0;
  const isXpDay = numericDate % 2 === 0;

  if (isXpDay) {
    const target = streakDays >= 7 ? 80 : 50;
    explorationQuest = {
      id: `${dateKey}_exploration_earn_xp`,
      type: 'earn_xp',
      category: 'exploration',
      target,
      progress: 0,
      xpReward: 25,
      completed: false,
      claimed: false,
    };
  } else {
    explorationQuest = {
      id: `${dateKey}_exploration_complete_lesson`,
      type: 'complete_lesson',
      category: 'exploration',
      target: 1,
      progress: 0,
      xpReward: 25,
      completed: false,
      claimed: false,
    };
  }

  return [memoryQuest, vocalQuest, explorationQuest];
}

export interface QuestEventResult {
  nextState: DailyQuestsState;
  xpGained: number;
  newlyCompletedQuestIds: string[];
  chestUnlocked: boolean;
}

/**
 * Applique un événement utilisateur sur l'état des quêtes quotidiennes.
 * Incrémente la progression, valide les quêtes achevées, crédite l'XP correspondante
 * et débloque le coffre bonus (+50 XP) dès que les 3 quêtes du jour sont achevées.
 */
export function applyQuestEvent(
  currentState: DailyQuestsState,
  event: QuestEventPayload
): QuestEventResult {
  if (!currentState || !currentState.quests || currentState.quests.length === 0) {
    return {
      nextState: currentState,
      xpGained: 0,
      newlyCompletedQuestIds: [],
      chestUnlocked: false,
    };
  }

  let xpGained = 0;
  const newlyCompletedQuestIds: string[] = [];

  const updatedQuests = currentState.quests.map((quest) => {
    if (quest.completed) {
      return quest;
    }

    let progressIncrement = 0;

    switch (event.type) {
      case 'SRS_REVIEW': {
        if (quest.type === 'srs_review_due') {
          progressIncrement = 1;
        } else if (quest.type === 'srs_fast_recall') {
          // Rappel rapide : réponse réussie (grade !== 'again') avec latence <= 3500ms
          const isSuccessful = event.grade !== 'again';
          const isFast = event.responseTimeMs != null && event.responseTimeMs <= 3500;
          if (isSuccessful && isFast) {
            progressIncrement = 1;
          }
        }
        break;
      }

      case 'VOCAL_SUCCESS': {
        if (quest.type === 'vocal_rehab') {
          if (event.isRehab) {
            progressIncrement = 1;
          }
        } else if (quest.type === 'vocal_practice') {
          if (event.score >= 75) {
            progressIncrement = 1;
          }
        }
        break;
      }

      case 'LESSON_COMPLETED': {
        if (quest.type === 'complete_lesson') {
          progressIncrement = 1;
        }
        break;
      }

      case 'XP_EARNED': {
        if (quest.type === 'earn_xp') {
          progressIncrement = Math.max(0, event.amount);
        }
        break;
      }
    }

    if (progressIncrement <= 0) {
      return quest;
    }

    const newProgress = Math.min(quest.target, quest.progress + progressIncrement);
    const isCompleted = newProgress >= quest.target;

    if (isCompleted && !quest.completed) {
      xpGained += quest.xpReward;
      newlyCompletedQuestIds.push(quest.id);
      return {
        ...quest,
        progress: newProgress,
        completed: true,
        claimed: true,
      };
    }

    return {
      ...quest,
      progress: newProgress,
    };
  });

  const allQuestsCompleted =
    updatedQuests.length > 0 && updatedQuests.every((q) => q.completed);

  let chestUnlocked = false;
  let nextBonusClaimed = currentState.dailyBonusClaimed;

  if (allQuestsCompleted && !currentState.dailyBonusClaimed) {
    chestUnlocked = true;
    nextBonusClaimed = true;
    xpGained += DAILY_CHEST_BONUS_XP;
  }

  const nextState: DailyQuestsState = {
    ...currentState,
    quests: updatedQuests,
    dailyBonusClaimed: nextBonusClaimed,
    completedQuestsTotal:
      (currentState.completedQuestsTotal || 0) + newlyCompletedQuestIds.length,
  };

  return {
    nextState,
    xpGained,
    newlyCompletedQuestIds,
    chestUnlocked,
  };
}

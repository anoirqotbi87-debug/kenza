import { ReviewGrade } from './srs';

export type QuestCategory = 'memory' | 'vocal' | 'exploration';

export type QuestType =
  | 'srs_review_due'
  | 'srs_fast_recall'
  | 'vocal_rehab'
  | 'vocal_practice'
  | 'complete_lesson'
  | 'earn_xp';

export interface DailyQuest {
  id: string;
  type: QuestType;
  category: QuestCategory;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  focusTarget?: string;
}

export interface DailyQuestsState {
  dateKey: string; // YYYY-MM-DD
  quests: DailyQuest[];
  dailyBonusClaimed: boolean;
  completedQuestsTotal: number;
}

export type QuestEventPayload =
  | {
      type: 'SRS_REVIEW';
      grade: ReviewGrade;
      responseTimeMs?: number;
      wordId?: string;
    }
  | {
      type: 'VOCAL_SUCCESS';
      wordId: string;
      score: number;
      isRehab?: boolean;
    }
  | {
      type: 'LESSON_COMPLETED';
      lessonId: string;
    }
  | {
      type: 'XP_EARNED';
      amount: number;
    };

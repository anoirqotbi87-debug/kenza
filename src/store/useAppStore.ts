import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notation } from '../types/curriculum';
import { SRSCard, ReviewGrade } from '../types/srs';

import { UILanguage, translations } from '../lib/i18n/translations';
import { getLocalTodayDateString, getDaysDifference } from '../utils/dateUtils';

interface AppState {
  // User Progress
  user: any;
  setUser: (user: any) => void;
  xp: number;
  streakDays: number;
  streakFreezes: number;
  activityDates: string[]; // ISO date strings
  unlockedBadges: string[];
  currentLevel: number;
  completedLessons: string[];
  
  // SRS State
  srsDeck: Record<string, SRSCard>; // Map of wordId to SRSCard
  
  // Settings
  preferredNotation: Notation;
  soundEnabled: boolean;
  audioSpeed: number;
  uiLanguage: UILanguage;
  regionalVariant: 'chamal' | 'casablanca' | 'fes';
  
  // Actions
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  unlockBadge: (badgeId: string) => void;
  useStreakFreeze: () => void;
  recordActivity: () => void;
  setNotation: (notation: Notation) => void;
  toggleSound: () => void;
  setAudioSpeed: (speed: number) => void;
  setLanguage: (lang: UILanguage) => void;
  setRegionalVariant: (variant: 'chamal' | 'casablanca' | 'fes') => void;
  
  // SRS Actions
  addCardsToSRS: (wordIds: string[]) => void;
  reviewCard: (wordId: string, grade: ReviewGrade) => void;
  getDueCards: () => SRSCard[];
  
  devUnlockAll: boolean;
  toggleDevUnlockAll: () => void;
  resetData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      xp: 0,
      streakDays: 1,
      streakFreezes: 1,
      activityDates: [],
      unlockedBadges: [],
      currentLevel: 1,
      completedLessons: [],
      srsDeck: {},
      preferredNotation: 'arabizi',
      soundEnabled: true,
      audioSpeed: 1.0,
      uiLanguage: 'fr',
      regionalVariant: 'casablanca',
      devUnlockAll: true, // Activated by default for dev/testing
      
      toggleDevUnlockAll: () => set((state) => ({ devUnlockAll: !state.devUnlockAll })),
      setRegionalVariant: (variant) => set({ regionalVariant: variant }),
      
      resetData: () => set({
        user: null,
        xp: 0,
        streakDays: 1,
        streakFreezes: 1,
        activityDates: [],
        unlockedBadges: [],
        currentLevel: 1,
        completedLessons: [],
        srsDeck: {}
      }),
      
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newBadges = [...state.unlockedBadges];
        if (newXp >= 500 && !newBadges.includes('polyglot')) {
          newBadges.push('polyglot');
        }
        return { xp: newXp, unlockedBadges: newBadges };
      }),
      
      completeLesson: (lessonId) => set((state) => {
        const completed = state.completedLessons.includes(lessonId)
          ? state.completedLessons
          : [...state.completedLessons, lessonId];
          
        const newBadges = [...state.unlockedBadges];
        if (lessonId.includes('cafe') && !newBadges.includes('cafe_master')) {
          newBadges.push('cafe_master');
        }
        if (lessonId.includes('taxi') && !newBadges.includes('taxi_ace')) {
          newBadges.push('taxi_ace');
        }
        
        return { completedLessons: completed, unlockedBadges: newBadges };
      }),

      unlockBadge: (badgeId) => set((state) => ({
        unlockedBadges: state.unlockedBadges.includes(badgeId)
          ? state.unlockedBadges
          : [...state.unlockedBadges, badgeId]
      })),

      useStreakFreeze: () => set((state) => ({
        streakFreezes: Math.max(0, state.streakFreezes - 1)
      })),

      recordActivity: () => set((state) => {
        const today = getLocalTodayDateString();
        
        if (state.activityDates.includes(today)) {
          // Already recorded today
          return state;
        }

        const newActivityDates = [...state.activityDates, today];
        let newStreak = state.streakDays;

        if (state.activityDates.length === 0) {
          newStreak = 1;
        } else {
          // Sort dates to find the last activity date safely
          const sortedDates = [...state.activityDates].sort();
          const lastActivity = sortedDates[sortedDates.length - 1];
          const diffDays = getDaysDifference(today, lastActivity);

          if (diffDays === 1) {
            // Consecutive day
            newStreak += 1;
          } else if (diffDays > 1) {
            // Gap > 1 day, streak breaks (streak freezes logic would go here if fully implemented)
            newStreak = 1;
          }
        }

        return { 
          activityDates: newActivityDates,
          streakDays: newStreak
        };
      }),
      
      setNotation: (notation) => set({ preferredNotation: notation }),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      setAudioSpeed: (speed) => set({ audioSpeed: speed }),
      
      setLanguage: (lang) => set({ uiLanguage: lang }),
      
      addCardsToSRS: (wordIds) => set((state) => {
        const newDeck = { ...state.srsDeck };
        const now = new Date().toISOString();
        
        wordIds.forEach(id => {
          if (!newDeck[id]) {
            newDeck[id] = {
              id: `card_${id}`,
              wordId: id,
              interval: 0,
              repetition: 0,
              easeFactor: 2.5,
              dueDate: now,
              state: 'new' as const
            };
          }
        });
        
        return { srsDeck: newDeck };
      }),
      
      reviewCard: (wordId, grade) => set((state) => {
        const card = state.srsDeck[wordId];
        if (!card) return state;

        let { interval, repetition, easeFactor } = card;

        if (grade === 'again') {
          repetition = 0;
          interval = 1;
        } else {
          if (grade === 'hard') {
            easeFactor = Math.max(1.3, easeFactor - 0.15);
          } else if (grade === 'easy') {
            easeFactor += 0.15;
          }
          
          if (repetition === 0) {
            interval = 1;
          } else if (repetition === 1) {
            interval = 6;
          } else {
            interval = Math.round(interval * easeFactor);
          }
          
          repetition += 1;
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);

        const newDeck = {
          ...state.srsDeck,
          [wordId]: {
            ...card,
            interval,
            repetition,
            easeFactor,
            dueDate: nextDate.toISOString(),
            state: 'review' as const
          }
        };

        // Add 5 XP for reviewing a card
        return { srsDeck: newDeck, xp: state.xp + 5 };
      }),
      
      getDueCards: () => {
        const deck = get().srsDeck;
        const now = new Date().getTime();
        return Object.values(deck).filter(card => {
          return new Date(card.dueDate).getTime() <= now;
        });
      }
    }),
    {
      name: 'darija-quest-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          if (persistedState.srsDeck) {
            const hasLegacyCards = Object.keys(persistedState.srsDeck).some(
              id => id.toLowerCase().startsWith('word_v')
            );
            if (hasLegacyCards) {
              // Purge legacy deck entirely so new one can take over
              persistedState.srsDeck = {};
            }
          }
        }
        return persistedState;
      }
    }
  )
);

export function useTranslation() {
  const uiLanguage = useAppStore((state) => state.uiLanguage);
  return { t: translations[uiLanguage], lang: uiLanguage };
}

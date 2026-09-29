import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';
import { Notation } from '../types/curriculum';
import { SRSCard, ReviewGrade, CustomVocabularyItem } from '../types/srs';

import { UILanguage, translations } from '../lib/i18n/translations';
import { getLocalTodayDateString, getDaysDifference } from '../utils/dateUtils';

import { srsService } from '../services/srsService';
interface AppState {
  // User Progress
  user: User | null;
  setUser: (user: User | null) => void;
  xp: number;
  streakDays: number;
  streakFreezes: number;
  activityDates: string[]; // ISO date strings
  unlockedBadges: string[];
  currentLevel: number;
  completedLessons: string[];
  
  // SRS State
  srsDeck: Record<string, SRSCard>; // Map of wordId to SRSCard
  customVocabulary: Record<string, CustomVocabularyItem>;
  
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
  addCustomWordToSRS: (word: CustomVocabularyItem) => void;
  updateCustomWord: (wordId: string, updates: Partial<CustomVocabularyItem>) => void;
  deleteCustomWord: (wordId: string) => void;
  reviewCard: (wordId: string, grade: ReviewGrade) => void;
  getDueCards: () => SRSCard[];
  
  devUnlockAll: boolean;
  toggleDevUnlockAll: () => void;
  resetData: () => void;
  
  // Onboarding & Premium
  hasCompletedOnboarding: boolean;
  userGoal: string | null;
  dailyTargetMinutes: number | null;
  isPremium: boolean;
  
  completeOnboarding: (goal: string, minutes: number) => void;
  setIsPremium: (isPremium: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user: AppState['user']) => set({ user }),
      xp: 0,
      streakDays: 1,
      streakFreezes: 1,
      activityDates: [],
      unlockedBadges: [],
      currentLevel: 1,
      completedLessons: [],
      srsDeck: {},
      customVocabulary: {},
      preferredNotation: 'arabizi',
      soundEnabled: true,
      audioSpeed: 1.0,
      uiLanguage: 'fr',
      regionalVariant: 'casablanca',
      devUnlockAll: process.env.NEXT_PUBLIC_DEV_UNLOCK_ALL === 'true', // Prod : verrouille ; en local : NEXT_PUBLIC_DEV_UNLOCK_ALL=true
      
      hasCompletedOnboarding: false,
      userGoal: null,
      dailyTargetMinutes: null,
      isPremium: false,
      
      completeOnboarding: (goal: AppState['userGoal'], minutes: AppState['dailyTargetMinutes']) => set({
        hasCompletedOnboarding: true,
        userGoal: goal,
        dailyTargetMinutes: minutes
      }),
      setIsPremium: (isPremium: boolean) => set({ isPremium }),
      
      toggleDevUnlockAll: () => set((state: AppState) => ({ devUnlockAll: !state.devUnlockAll })),
      setRegionalVariant: (variant: AppState['regionalVariant']) => set({ regionalVariant: variant }),
      
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
      
      addXp: (amount: number) => set((state: AppState) => {
        const newXp = state.xp + amount;
        const newBadges = [...state.unlockedBadges];
        if (newXp >= 500 && !newBadges.includes('polyglot')) {
          newBadges.push('polyglot');
        }
        return { xp: newXp, unlockedBadges: newBadges };
      }),
      
      completeLesson: (lessonId: string) => set((state: AppState) => {
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

      unlockBadge: (badgeId: string) => set((state: AppState) => ({
        unlockedBadges: state.unlockedBadges.includes(badgeId)
          ? state.unlockedBadges
          : [...state.unlockedBadges, badgeId]
      })),

      useStreakFreeze: () => set((state: AppState) => ({
        streakFreezes: Math.max(0, state.streakFreezes - 1)
      })),

      recordActivity: () => set((state: AppState) => {
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
      
      setNotation: (notation: Notation) => set({ preferredNotation: notation }),
      
      toggleSound: () => set((state: AppState) => ({ soundEnabled: !state.soundEnabled })),

      setAudioSpeed: (speed: number) => set({ audioSpeed: speed }),
      
      setLanguage: (lang: UILanguage) => set({ uiLanguage: (lang || 'fr').toLowerCase() as UILanguage }),
      
      addCardsToSRS: (wordIds: string[]) => set((state: AppState) => {
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
      
      addCustomWordToSRS: (word: CustomVocabularyItem) => set((state: AppState) => {
        const newVocab = { ...state.customVocabulary, [word.id]: word };
        const newDeck = { ...state.srsDeck };
        const now = new Date().toISOString();
        if (!newDeck[word.id]) {
          newDeck[word.id] = {
            id: `card_${word.id}`,
            wordId: word.id,
            interval: 0,
            repetition: 0,
            easeFactor: 2.5,
            dueDate: now,
            state: 'new' as const
          };
        }
        return { customVocabulary: newVocab, srsDeck: newDeck };
      }),

      updateCustomWord: (wordId: string, updates: Partial<CustomVocabularyItem>) => set((state: AppState) => {
        if (!state.customVocabulary[wordId]) return state;
        const newVocab = { 
          ...state.customVocabulary, 
          [wordId]: { ...state.customVocabulary[wordId], ...updates } 
        };
        return { customVocabulary: newVocab };
      }),

      deleteCustomWord: (wordId: string) => set((state: AppState) => {
        const newVocab = { ...state.customVocabulary };
        delete newVocab[wordId];
        const newDeck = { ...state.srsDeck };
        delete newDeck[wordId];
        return { customVocabulary: newVocab, srsDeck: newDeck };
      }),
      
      reviewCard: (wordId: string, grade: ReviewGrade) => set((state: AppState) => {
        const card = state.srsDeck[wordId];
        if (!card) return state;

        // Use srsService to calculate next review based on the 5-box system
        const updatedCard = srsService.calculateNextReview(card, grade);

        const newDeck = {
          ...state.srsDeck,
          [wordId]: updatedCard
        };

        // Add 5 XP for reviewing a card
        return { srsDeck: newDeck, xp: state.xp + 5 };
      }),
      
      getDueCards: () => {
        const deck = get().srsDeck;
        return srsService.getDueCards(deck);
      }
    }),
    {
      name: 'darija-quest-storage',
      version: 3,
      partialize: (state: AppState) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { devUnlockAll, ...rest } = state;
        return rest;
      },
      migrate: (persistedState: unknown, version: number) => {
        if (!persistedState) return persistedState as AppState;
        const state = persistedState as AppState & { devUnlockAll?: boolean };
        if (version < 2) {
          if (state.srsDeck) {
            const hasLegacyCards = Object.keys(state.srsDeck).some(
              id => id.toLowerCase().startsWith('word_v')
            );
            if (hasLegacyCards) {
              // Purge legacy deck entirely so new one can take over
              state.srsDeck = {};
            }
          }
        }
        if (version < 3) {
          delete (state as { devUnlockAll?: boolean }).devUnlockAll;
        }
        return state;
      }
    }
  )
);

export function useTranslation() {
  const uiLanguage = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(uiLanguage).toLowerCase() as UILanguage;
  return { t: translations[lang] || translations['fr'], lang };
}

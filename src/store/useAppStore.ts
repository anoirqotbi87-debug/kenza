import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notation } from '../types/curriculum';
import { SRSCard, ReviewGrade } from '../types/srs';

import { UILanguage, translations } from '../lib/i18n/translations';

interface AppState {
  // User Progress
  xp: number;
  streakDays: number;
  currentLevel: number;
  completedLessons: string[];
  
  // SRS State
  srsDeck: Record<string, SRSCard>; // Map of wordId to SRSCard
  
  // Settings
  preferredNotation: Notation;
  soundEnabled: boolean;
  uiLanguage: UILanguage;
  
  // Actions
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  setNotation: (notation: Notation) => void;
  toggleSound: () => void;
  setLanguage: (lang: UILanguage) => void;
  
  // SRS Actions
  addCardsToSRS: (wordIds: string[]) => void;
  reviewCard: (wordId: string, grade: ReviewGrade) => void;
  getDueCards: () => SRSCard[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streakDays: 1,
      currentLevel: 1,
      completedLessons: [],
      srsDeck: {},
      preferredNotation: 'arabizi',
      soundEnabled: true,
      uiLanguage: 'fr',
      
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      
      completeLesson: (lessonId) => set((state) => ({ 
        completedLessons: state.completedLessons.includes(lessonId) 
          ? state.completedLessons 
          : [...state.completedLessons, lessonId] 
      })),
      
      setNotation: (notation) => set({ preferredNotation: notation }),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
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
    }
  )
);

export function useTranslation() {
  const uiLanguage = useAppStore((state) => state.uiLanguage);
  return { t: translations[uiLanguage], lang: uiLanguage };
}

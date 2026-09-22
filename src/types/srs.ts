import { MultiLangText } from './curriculum';

export interface SRSCard {
  id: string;
  wordId: string;
  interval: number; // Days before next review
  repetition: number; // Consecutive correct reviews
  easeFactor: number; // Ease factor for SM-2 (default 2.5)
  dueDate: string; // ISO String timestamp
  state: 'new' | 'learning' | 'review';
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export interface CardIllustration {
  iconName: string; // Nom de l'icône Lucide (ex: 'Coffee', 'Car', 'Home')
  category?: string;
}

export interface VocabularySRSData {
  id: string; // the wordId
  arabizi: string;
  arabic: string;
  translation: any;
  category?: string;
  audioUrl?: string;
  illustration?: CardIllustration;
  example?: {
    arabizi: string;
    arabic: string;
    translation: MultiLangText;
  };
  culturalNote?: string;
}

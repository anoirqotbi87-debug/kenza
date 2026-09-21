export type Notation = 'arabizi' | 'arabic' | 'duo';

export interface UserProfile {
  id: string;
  name: string;
  currentLessonId: string;
  xp: number;
  streakDays: number;
  masteredWords: string[];
  srsDeck: Record<string, any>; // Simplified for MVP
  preferredNotation: Notation;
}

export type ExerciseType = 'mcq' | 'reorder' | 'match' | 'dialogue' | 'flashcard' | 'fill-blank' | 'matching';

export interface ExerciseOption {
  id: string;
  arabizi: string;
  arabic: string;
  translation: string;
  audioUrl?: string;
}

export interface MatchingPair {
  id: string;
  left: { text: string; audioUrl?: string }; // Darija
  right: { text: string }; // Français
}

export interface DialogueChoice {
  id: string;
  text: { arabizi: string; arabic: string; translation: string };
  isOptimal: boolean;
  feedback: string;
  nextNpcLine?: string; // Optionnel : réaction immédiate
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string; // The instruction for the user
  audioUrl?: string;
  options?: ExerciseOption[]; // For MCQ, Match, Reorder, Fill-blank
  pairs?: MatchingPair[]; // For Matching
  dialogueContext?: string; // For dialogue
  npcStartLine?: { arabizi: string; arabic: string; translation: string; audioUrl?: string }; // For dialogue
  dialogueChoices?: DialogueChoice[]; // For dialogue
  sentenceTemplate?: string; // For fill-blank (use {blank} for missing word)
  answer: string | string[] | Record<string, string>; // Correct option ID(s), ordered array of IDs, or map for matching
  explanation: string;
  culturalNote?: string;
}

export interface LessonStep {
  id: string;
  type: 'learning' | 'exercise';
  content?: {
    title: string;
    description: string;
    arabizi: string;
    arabic: string;
    translation: string;
    audioUrl?: string;
    culturalNote?: string;
  };
  exercise?: Exercise;
}

export interface Lesson {
  id: string;
  title: string;
  level: number;
  description: string;
  steps: LessonStep[];
}

export interface VocabularyItem {
  id: string;
  arabizi: string;
  arabic: string;
  audioUrl?: string;
  category: string;
  examples: { arabizi: string; arabic: string; translation: string }[];
  culturalNotes?: string;
}

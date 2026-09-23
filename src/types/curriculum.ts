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

export type ExerciseType = 'mcq' | 'reorder' | 'match' | 'matching' | 'fill-blank' | 'dialogue';

export interface MultiLangText {
  fr: string;
  es: string;
  en: string;
  ar: string;
}

export interface Lesson {
  id: string;
  title: MultiLangText | string;
  level: number;
  description: MultiLangText | string;
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  type: 'learning' | 'exercise' | 'grammar';
  content?: {
    title: MultiLangText | string;
    description: MultiLangText | string;
    arabizi: string;
    arabic: string;
    translation: MultiLangText | string;
    audioUrl?: string;
    culturalNote?: MultiLangText | string;
  };
  exercise?: Exercise;
}

export interface ExerciseOption {
  id: string;
  text: string; // Keeps Darija in text
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  left: { text: string }; // Darija
  right: { text: MultiLangText | string }; // Translation
}

export interface DialogueChoice {
  id: string;
  text: { arabizi: string; arabic: string; translation: MultiLangText | string };
  isOptimal: boolean;
  feedback: MultiLangText | string;
  nextNpcLine?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: MultiLangText | string;
  audioUrl?: string;
  options?: ExerciseOption[];
  pairs?: MatchingPair[];
  dialogueContext?: MultiLangText | string;
  npcStartLine?: { arabizi: string; arabic: string; translation: MultiLangText | string; audioUrl?: string };
  dialogueChoices?: DialogueChoice[];
  sentenceTemplate?: string;
  answer?: string | string[] | Record<string, string>;
  explanation?: MultiLangText | string;
  culturalNote?: MultiLangText | string;
}

export interface VocabularyItem {
  id: string;
  arabizi: string;
  arabic: string;
  audioUrl?: string;
  category: string;
  examples: { arabizi: string; arabic: string; translation: MultiLangText }[];
  culturalNotes?: MultiLangText;
}

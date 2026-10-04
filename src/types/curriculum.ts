import type { SRSCard } from './srs';

export type Notation = 'arabizi' | 'arabic' | 'duo';

export interface UserProfile {
  id: string;
  name: string;
  currentLessonId: string;
  xp: number;
  streakDays: number;
  masteredWords: string[];
  srsDeck: Record<string, SRSCard>;
  preferredNotation: Notation;
}

/**
 * Types d'exercices du moteur.
 *
 * - `mcq` : question a choix unique.
 * - `reorder` : remettre des tuiles dans l'ordre (reconstitution de phrase).
 * - `scramble` : alias pedagogique de `reorder` : blocs melanges a reconstituer
 *   en phrase syntaxiquement exacte (rendu et validation identiques).
 * - `match` / `matching` : associer des paires (darija <=> traduction).
 * - `fill-blank` : completer un trou dans une phrase.
 * - `dialogue` : scenario dialogue multi-choix (ronde avec l'IA).
 * - `roleplay_challenge` : epreuve de cloture de module, mise en situation
 *   avec un persona Roleplay (Driss au cafe, Hassan au souk...). Meme structure
 *   que `dialogue`, mais signale la passerelle vers l'onglet Parler.
 */

export type ExerciseType = 'mcq' | 'reorder' | 'scramble' | 'match' | 'matching' | 'fill-blank' | 'dialogue' | 'roleplay_challenge';

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
  /**
   * Verrou premium explicite au niveau de la leçon. Optionnel : le découpage
   * gratuit/payant se décide d'abord par module (`@/lib/premiumModules`).
   */
  isPremium?: boolean;
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
  text: MultiLangText | string; // Darija in text, or localized meaning (MultiLangText)
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
  /**
   * Autres reponses valides, en plus de `answer`.
   *
   * La Darija admet souvent plusieurs formes justes (synonymes, variantes
   * regionales). Sans ce champ, une seule est acceptee et une bonne reponse peut
   * etre comptee fausse. Chaque entree est l'`id` d'une option de l'exercice.
   * `answer` reste la reponse de reference, mise en avant dans la correction.
   */
  acceptedAnswers?: string[];
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

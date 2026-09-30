import type { MultiLangText } from '../../types/curriculum';

/**
 * Vocabulaire clé d'un module : les mots isolés qu'un apprenant doit retenir,
 * par opposition aux dialogues (voir `src/data/dialogues/`) qui mettent ces mots
 * en situation.
 *
 * Chaque entrée est dérivée du contenu réel des leçons du module (le champ
 * `source` indique la leçon d'origine, pour vérification).
 */

export type VocabularyCategory =
  | 'politeness'
  | 'greetings'
  | 'pronouns'
  | 'cafe'
  | 'transport'
  | 'housing'
  | 'food'
  | 'health'
  | 'orientation'
  | 'emergency'
  | 'time'
  | 'verb'
  | 'abstract'
  | 'souk';

export type ModuleId = 1 | 2 | 3 | 4;

export interface ModuleVocabularyItem {
  id: string;
  /** Transcription en Arabizi (chiffres pour les sons absents du latin : 3, 7, 9, kh, gh). */
  arabizi: string;
  /** Graphie arabe. */
  arabic: string;
  /** Sens du mot, dans les quatre langues de l'interface. */
  translation: MultiLangText;
  module: ModuleId;
  category: VocabularyCategory;
  /** Phrase d'exemple reprenant le mot, quand le module en fournit une. */
  example?: {
    arabizi: string;
    arabic: string;
    translation: MultiLangText;
  };
  /** Note culturelle ou d'usage (registre, contexte social). */
  culturalNote?: MultiLangText;
  /** Leçon d'origine, pour tracer la donnée jusqu'au contenu pédagogique. */
  source: string;
}

import { module1Vocabulary } from './module1';
import { module2Vocabulary } from './module2';
import { module3Vocabulary } from './module3';
import { module4Vocabulary } from './module4';
import { module5Vocabulary } from './module5';
import { module6Vocabulary } from './module6';
import { module7Vocabulary } from './module7';
import type { ModuleId, ModuleVocabularyItem, VocabularyCategory } from './types';

export type { ModuleId, ModuleVocabularyItem, VocabularyCategory } from './types';

/** Vocabulaire clé des modules 1 à 7, dans l'ordre du parcours. */
export const vocabularyByModule: Record<ModuleId, ModuleVocabularyItem[]> = {
  1: module1Vocabulary,
  2: module2Vocabulary,
  3: module3Vocabulary,
  4: module4Vocabulary,
  5: module5Vocabulary,
  6: module6Vocabulary,
  7: module7Vocabulary,
};

export const allVocabulary: ModuleVocabularyItem[] = [
  ...module1Vocabulary,
  ...module2Vocabulary,
  ...module3Vocabulary,
  ...module4Vocabulary,
  ...module5Vocabulary,
  ...module6Vocabulary,
  ...module7Vocabulary,
];

export function getVocabularyForModule(module: ModuleId): ModuleVocabularyItem[] {
  return vocabularyByModule[module];
}

export function getVocabularyByCategory(category: VocabularyCategory): ModuleVocabularyItem[] {
  return allVocabulary.filter((item) => item.category === category);
}

/** Mots d'un module ayant une note culturelle, pour les encarts « Le saviez-vous ». */
export function getCulturalNotesForModule(module: ModuleId): ModuleVocabularyItem[] {
  return vocabularyByModule[module].filter((item) => item.culturalNote !== undefined);
}

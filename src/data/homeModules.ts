import { fullCurriculum } from '@/data/curriculum';
import { getLocalizedText } from '@/lib/i18n/utils';
import type { UILanguage } from '@/lib/i18n/translations';
import { isModuleLocked } from '@/lib/premiumModules';

/**
 * Vitrine de l'accueil : les 7 modules du curriculum central, avec leurs
 * lecons jouables et leur statut gratuit / premium.
 *
 * Source unique : `fullCurriculum` + `isModuleLocked` — l'accueil ne
 * redeclare ni titre ni decoupage gratuit / payant.
 */

export interface HomeModuleCard {
  key: string;
  title: string;
  lessons: number;
  steps: number;
  locked: boolean;
  completed: number;
  done: boolean;
}

export interface HomeModuleLesson {
  id: string;
  title: string;
  description: string;
  steps: number;
  free: boolean;
  done: boolean;
}

const text = (value: string | { fr: string; en: string; es: string; ar: string } | undefined, lang: string) =>
  getLocalizedText(value, lang as UILanguage);

const hasSteps = (lesson: { steps: unknown[] }) =>
  Array.isArray(lesson.steps) && lesson.steps.length > 0;

/** Liste des modules avec compteur de lecons realisees, pour la grille 2 colonnes. */
export function getHomeModules(
  lang: string,
  completedLessons: readonly string[],
  isPremium: boolean
): HomeModuleCard[] {
  const done = new Set(completedLessons);
  return Object.entries(fullCurriculum).map(([key, mod]) => {
    const playable = mod.lessons.filter(hasSteps);
    const completed = playable.filter((lesson) => done.has(lesson.id)).length;
    return {
      key,
      title: text(mod.title, lang),
      lessons: playable.length,
      steps: playable.reduce((total, lesson) => total + lesson.steps.length, 0),
      locked: isModuleLocked(key, isPremium),
      completed,
      done: completed === playable.length && playable.length > 0,
    };
  });
}

/** Lecons jouables d'un module precis, pour la vue detaillee. */
export function getHomeModuleLessons(
  lang: string,
  moduleKey: string,
  completedLessons: readonly string[]
): HomeModuleLesson[] {
  const done = new Set(completedLessons);
  const mod = fullCurriculum[moduleKey];
  if (!mod) return [];
  return mod.lessons.filter(hasSteps).map((lesson) => ({
    id: lesson.id,
    title: text(lesson.title, lang),
    description: text(lesson.description, lang),
    steps: lesson.steps.length,
    free: !isModuleLocked(moduleKey, false),
    done: done.has(lesson.id),
  }));
}
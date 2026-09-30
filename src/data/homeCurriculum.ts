import { fullCurriculum } from '@/data/curriculum';
import type { Lesson, MultiLangText } from '@/types/curriculum';
import { getLocalizedText } from '@/lib/i18n/utils';
import type { UILanguage } from '@/lib/i18n/translations';
import { PREMIUM_MODULES, isModuleLocked } from '@/lib/premiumModules';

/**
 * Module du curriculum central auquel chaque lecon de l'accueil se rattachait.
 *
 * Historique : l'accueil affichait autrefois ses propres lecons (`HomeLesson`).
 * Ce type a ete supprime au profit de la source unique, mais cette table reste
 * necessaire a la migration du store : elle traduit les anciens identifiants
 * vers ceux du curriculum central pour ne pas perdre la progression acquise.
 */
export const HOME_LESSON_MODULES: Readonly<Record<string, string>> = {
  hello: '1',
  cafe: '2',
  medina: '2',
  marrakech: '3',
  tanger: '5',
};

/**
 * Correspondance des identifiants de lecons de l'ancien accueil vers le
 * curriculum central, utilisee par la migration du store (v4 -> v5).
 *
 * La lecon `marrakech` de l'accueil enseignait « Bchhal hada / Naqas chwiya » :
 * c'est le contenu du module 2 central (`l_module2_souk_1`), malgre son
 * etiquette B2 d'origine. La migration rattache donc a la lecon reelle.
 */
export const LEGACY_HOME_LESSON_IDS: Readonly<Record<string, string>> = {
  hello: 'l2_greetings_1',
  cafe: 'l_module2_cafe_1',
  medina: 'l_module2_souk_1',
  marrakech: 'l_module2_souk_1',
  tanger: 'l_mod7_1',
};

/**
 * Traduit une liste d'identifiants de lecons de l'ancien accueil vers le
 * curriculum central, en dedupliquant et en conservant les identifiants
 * inconnus tels quels (contenu ajoute plus tard, ids deja centraux).
 */
export function migrateLegacyLessonIds(ids: readonly string[]): string[] {
  return Array.from(new Set(ids.map((id) => LEGACY_HOME_LESSON_IDS[id] ?? id)));
}

/** Vrai si la lecon appartient a un module reserve aux abonnes. */
export function isPremiumLesson(lessonId: string): boolean {
  const moduleKey = HOME_LESSON_MODULES[lessonId];
  return moduleKey ? isModuleLocked(moduleKey, false) : false;
}

export interface ModuleSummary {
  key: string;
  title: MultiLangText;
  lessons: number;
  steps: number;
  free: boolean;
}

export interface LessonRef {
  id: string;
  title: string;
  description: string;
  moduleKey: string;
  moduleTitle: string;
  level: number;
  steps: number;
  free: boolean;
}

const text = (value: MultiLangText | string | undefined, lang: string) =>
  getLocalizedText(value, lang as UILanguage);

const hasSteps = (lesson: Lesson) => Array.isArray(lesson.steps) && lesson.steps.length > 0;

/**
 * Metadonnees officielles de chaque module, lues depuis `fullCurriculum`.
 *
 * L'accueil ne redeclare plus ni titre, ni decoupage gratuit/payant : les deux
 * viennent d'ici et du verrou de `@/lib/premiumModules`.
 */
export function getModuleSummaries(): ModuleSummary[] {
  return Object.entries(fullCurriculum).map(([key, mod]) => {
    const playable = mod.lessons.filter(hasSteps);
    return {
      key,
      title: mod.title,
      lessons: playable.length,
      steps: playable.reduce((total, lesson) => total + lesson.steps.length, 0),
      free: !PREMIUM_MODULES.includes(key),
    };
  });
}

/** Toutes les lecons jouables du curriculum, dans l'ordre des modules. */
export function getPlayableLessons(lang: string): LessonRef[] {
  return Object.entries(fullCurriculum).flatMap(([key, mod]) =>
    mod.lessons.filter(hasSteps).map((lesson) => ({
      id: lesson.id,
      title: text(lesson.title, lang),
      description: text(lesson.description, lang),
      moduleKey: key,
      moduleTitle: text(mod.title, lang),
      level: lesson.level,
      steps: lesson.steps.length,
      free: !PREMIUM_MODULES.includes(key),
    }))
  );
}

/**
 * Prochaine lecon a proposer : la premiere non terminee parmi les modules
 * accessibles. Retombe sur la premiere lecon gratuite quand tout est termine,
 * et vaut `null` si le curriculum n'expose aucune lecon jouable.
 */
export function getNextLesson(lang: string, completedLessons: string[]): LessonRef | null {
  const done = new Set(completedLessons);
  const lessons = getPlayableLessons(lang);
  return (
    lessons.find((lesson) => lesson.free && !done.has(lesson.id)) ??
    lessons.find((lesson) => lesson.free) ??
    null
  );
}

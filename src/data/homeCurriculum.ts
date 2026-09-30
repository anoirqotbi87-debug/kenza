import { isModuleLocked } from '@/lib/premiumModules';

/**
 * Module du curriculum central auquel chaque lecon de l'accueil se rattache.
 *
 * L'accueil affiche sa propre progression (`HomeLesson`), mais le statut
 * gratuit / payant ne doit pas y etre redeclare : `@/lib/premiumModules` en est
 * la source unique, et deux decoupages divergents ont deja produit un gating
 * incoherent (verrouillage sur ['5','6','7'] alors que le paywall annoncait
 * « Modules 3, 4 et 5 »).
 */
export const HOME_LESSON_MODULES: Readonly<Record<string, string>> = {
  hello: '1',
  cafe: '2',
  medina: '2',
  marrakech: '3',
  tanger: '5',
};

/** Vrai si la lecon appartient a un module reserve aux abonnes. */
export function isPremiumLesson(lessonId: string): boolean {
  const moduleKey = HOME_LESSON_MODULES[lessonId];
  return moduleKey ? isModuleLocked(moduleKey, false) : false;
}

/**
 * Source de vérité unique du découpage gratuit / payant.
 *
 * Les modules 1 et 2 sont gratuits pour tous ; les modules 3 à 7 sont réservés
 * aux abonnés Kenza Pro. Toute décision de verrouillage doit passer par
 * `isModuleLocked` : dupliquer cette liste dans un composant a déjà produit
 * deux découpages divergents (gating sur ['5','6','7'] alors que le paywall
 * annonçait « Modules 3, 4 et 5 »).
 */
export const PREMIUM_MODULES: readonly string[] = ['3', '4', '5', '6', '7'];

/** Vrai si le module doit être refusé à cet utilisateur. */
export function isModuleLocked(moduleId: string, isPremium: boolean): boolean {
  return PREMIUM_MODULES.includes(moduleId) && !isPremium;
}

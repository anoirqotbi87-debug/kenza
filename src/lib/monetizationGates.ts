/**
 * Conditions d'affichage des verrous de monétisation, isolées du rendu pour
 * être testables sans DOM.
 */

export interface OnboardingPaywallState {
  hasCompletedOnboarding: boolean;
  hasSeenOnboardingPaywall: boolean;
  isPremium: boolean;
}

/**
 * Trigger 1 : le paywall s'ouvre une seule fois, juste après l'onboarding,
 * et jamais pour un abonné.
 */
export function shouldShowOnboardingPaywall({
  hasCompletedOnboarding,
  hasSeenOnboardingPaywall,
  isPremium,
}: OnboardingPaywallState): boolean {
  return hasCompletedOnboarding && !hasSeenOnboardingPaywall && !isPremium;
}

/** Le téléchargement hors-ligne est réservé aux membres Kenza Pro. */
export function canDownloadOffline(isPremium: boolean): boolean {
  return isPremium;
}

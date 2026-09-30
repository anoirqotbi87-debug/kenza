/**
 * Résolution du premium au retour de Stripe Checkout.
 *
 * Le paramètre d'URL `upgrade=success` est **forgeable** : il ne doit jamais accorder
 * l'accès. Seule la relecture de `profiles.is_premium` décide — colonne que seul le
 * webhook Stripe (service_role) peut écrire.
 *
 * Le webhook peut traiter l'événement juste après l'arrivée du navigateur : on retente
 * quelques fois avant de conclure, sinon un acheteur légitime verrait « paiement reçu »
 * sans accès immédiat.
 */
export const PREMIUM_CONFIRM_ATTEMPTS = 5;
export const PREMIUM_CONFIRM_DELAY_MS = 2000;

export async function confirmPremiumAfterCheckout(
  fetchPremium: () => Promise<boolean>,
  options: { attempts?: number; delayMs?: number } = {}
): Promise<boolean> {
  const attempts = options.attempts ?? PREMIUM_CONFIRM_ATTEMPTS;
  const delayMs = options.delayMs ?? PREMIUM_CONFIRM_DELAY_MS;

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (await fetchPremium()) return true;
    if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

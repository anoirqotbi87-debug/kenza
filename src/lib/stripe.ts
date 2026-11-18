import Stripe from 'stripe';

export type StripeMode = 'LIVE' | 'TEST' | 'MISSING';

/**
 * Détecte le mode de la clé Stripe sans jamais afficher la clé en clair.
 */
export function getStripeKeyMode(key: string | undefined): StripeMode {
  if (!key) return 'MISSING';
  if (key.startsWith('sk_live_')) return 'LIVE';
  if (key.startsWith('sk_test_')) return 'TEST';
  return 'MISSING';
}

/**
 * Helper de journalisation sécurisée (non-sensible) du mode Stripe.
 */
function logStripeMode(mode: StripeMode) {
  console.log(`[Stripe Init] Mode détecté : ${mode}`);
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  if (isProduction && mode === 'TEST') {
    console.warn(
      '[Stripe Warning] ATTENTION : Environnement de production détecté mais STRIPE_SECRET_KEY est en mode TEST (sk_test_). Les paiements réels ne seront pas effectifs !'
    );
  }
}

/**
 * Retourne dynamiquement une instance du client Stripe configurée avec la clé courante.
 */
export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) return null;

  const mode = getStripeKeyMode(secretKey);
  logStripeMode(mode);

  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    appInfo: {
      name: 'Kenza Darija Quest',
      version: '1.0.0',
    },
  });
}

// Instance globale initiale (pour compatibilité avec les imports existants `stripe`)
const initialKey = process.env.STRIPE_SECRET_KEY || '';
const initialMode = getStripeKeyMode(initialKey);
if (initialKey) {
  logStripeMode(initialMode);
}

export const stripe = initialKey
  ? new Stripe(initialKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      appInfo: {
        name: 'Kenza Darija Quest',
        version: '1.0.0',
      },
    })
  : null;

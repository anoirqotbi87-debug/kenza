// Allowlist stricte des origines autorisées pour les redirections Stripe.
// Évite la manipulation des success_url / cancel_url / return_url via des headers clients.

const PRODUCTION_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'https://kenza-dusky.vercel.app';

const STATIC_ALLOWED_ORIGINS = new Set([
  'https://kenza.vercel.app',
  'https://kenza-dusky.vercel.app',
]);

const LOCALHOST_REGEX = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

export function isAllowedOrigin(origin: string): boolean {
  if (origin === PRODUCTION_ORIGIN || STATIC_ALLOWED_ORIGINS.has(origin)) {
    return true;
  }
  if (LOCALHOST_REGEX.test(origin)) {
    return true;
  }
  if (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`) {
    return true;
  }
  if (process.env.VERCEL_BRANCH_URL && origin === `https://${process.env.VERCEL_BRANCH_URL}`) {
    return true;
  }
  return false;
}

/**
 * Retourne une URL de redirection sûre.
 * Si l'origine fournie (header client) n'est pas dans l'allowlist,
 * on retombe sur l'origine de production.
 */
export function safeRedirectOrigin(candidate: string | null | undefined): string {
  if (candidate && isAllowedOrigin(candidate)) {
    return candidate;
  }
  return PRODUCTION_ORIGIN;
}

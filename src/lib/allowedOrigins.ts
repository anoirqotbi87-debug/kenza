// Allowlist stricte des origines autorisées pour les redirections Stripe.
// Évite la manipulation des success_url / cancel_url / return_url via des headers clients.

const PRODUCTION_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'https://kenza-dusky.vercel.app';

const ALLOWED_ORIGIN_REGEX =
  /^https:\/\/([a-z0-9][a-z0-9-]*\.)?vercel\.app$|^http:\/\/localhost:\d+$/i;

export function isAllowedOrigin(origin: string): boolean {
  return origin === PRODUCTION_ORIGIN || ALLOWED_ORIGIN_REGEX.test(origin);
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

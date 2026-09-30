/**
 * Détection de la devise à afficher, remplaçant le choix manuel par défaut.
 *
 * Priorité : pays fourni par l'infrastructure (header Vercel `x-vercel-ip-country`
 * ou Cloudflare `cf-ipcountry`) > fuseau horaire du navigateur > défaut EUR.
 * Le pays prime sur le fuseau : un MRE en France avec un fuseau marocain résiduel
 * doit voir les tarifs EUR. Le toggle manuel reste disponible pour les cas limites.
 */

export type Currency = 'EUR' | 'MAD';

export const DEFAULT_CURRENCY: Currency = 'EUR';

/** Fuseaux rattachés au Maroc. */
const MOROCCO_TIME_ZONES = new Set(['africa/casablanca', 'africa/el_aaiun']);

export interface GeoSignals {
  /** Code pays ISO 3166-1 alpha-2 (ex. « MA »), tel que fourni par l'hébergeur. */
  country?: string | null;
  /** Fuseau horaire IANA du client (ex. « Africa/Casablanca »). */
  timeZone?: string | null;
}

export function resolveCurrency({ country, timeZone }: GeoSignals): Currency {
  if (country) {
    return country.trim().toUpperCase() === 'MA' ? 'MAD' : 'EUR';
  }
  if (timeZone) {
    return MOROCCO_TIME_ZONES.has(timeZone.trim().toLowerCase()) ? 'MAD' : 'EUR';
  }
  return DEFAULT_CURRENCY;
}

/**
 * Lit le pays depuis les headers de la requête (Vercel ou Cloudflare).
 * Renvoie `null` en l'absence de header exploitable.
 */
export function countryFromHeaders(headers: Headers): string | null {
  const raw =
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    headers.get('x-country-code');
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  // Vercel renvoie « XX » ou « T1 » quand le pays est inconnu.
  return code.length === 2 && code !== 'XX' && code !== 'T1' ? code : null;
}

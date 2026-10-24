/**
 * Politique de cache du Service Worker, isolée de `sw.ts` pour être testable
 * sans exécuter un worker.
 *
 * Deux invariants y sont verrouillés :
 *  1. les prédicats de routes utilisent le `pathname` (et non l'URL complète) —
 *     un motif ancré sur `/api/...` ne matcherait jamais `https://hote/api/...` ;
 *  2. le nettoyage à l'activation ne supprime QUE les caches possédés par Kenza,
 *     jamais ceux gérés par Serwist (`pages`, `others`, `sites-*`…). Les effacer
 *     vidait le cache de navigation à chaque mise à jour du worker, donc le mode
 *     hors-ligne redevenait inopérant juste après un déploiement.
 */

export const DAY_SECONDS = 24 * 60 * 60;

export const SW_CACHE_PREFIX = 'kenza-v2-';

export const SW_CACHE_NAMES = {
  tts: `${SW_CACHE_PREFIX}tts-cache`,
  audio: `${SW_CACHE_PREFIX}audio-cache`,
  fonts: `${SW_CACHE_PREFIX}fonts-cache`,
} as const;

export type SwCacheName = (typeof SW_CACHE_NAMES)[keyof typeof SW_CACHE_NAMES];

export const SW_CACHE_LIMITS: Record<
  keyof typeof SW_CACHE_NAMES,
  { maxEntries: number; maxAgeSeconds: number }
> = {
  tts: { maxEntries: 200, maxAgeSeconds: 30 * DAY_SECONDS },
  audio: { maxEntries: 250, maxAgeSeconds: 30 * DAY_SECONDS },
  fonts: { maxEntries: 50, maxAgeSeconds: 365 * DAY_SECONDS },
};

export function getActiveOwnCacheNames(): string[] {
  return Object.values(SW_CACHE_NAMES);
}

/* ------------------------------------------------------------------ */
/* Prédicats de requête                                                */
/* ------------------------------------------------------------------ */

/** Le roleplay IA dépend d'un backend (quota, personas) : jamais de cache. */
export function isRoleplayApiRequest(url: URL): boolean {
  return url.pathname.startsWith('/api/roleplay');
}

/** Synthèse vocale : le texte varie à chaque requête, le cache évite de
 *  rappeler le serveur pour une phrase déjà entendue. */
export function isTtsApiRequest(url: URL): boolean {
  return url.pathname.startsWith('/api/tts');
}

const AUDIO_EXTENSIONS = /\.(?:mp3|wav|ogg|m4a)$/i;
const FONT_EXTENSIONS = /\.(?:woff2?|eot|ttf|otf)$/i;

export function isAudioAsset(url: URL): boolean {
  return AUDIO_EXTENSIONS.test(url.pathname);
}

export function isFontAsset(url: URL): boolean {
  return FONT_EXTENSIONS.test(url.pathname);
}

/** Repli hors-ligne : uniquement les navigations de document, pour ne pas
 *  renvoyer du HTML à la place d'un script ou d'une image manquante. */
export function isDocumentRequest(request: { destination?: string }): boolean {
  return request.destination === 'document';
}

/* ------------------------------------------------------------------ */
/* Nettoyage des caches                                                */
/* ------------------------------------------------------------------ */

/**
 * Décide si un cache doit être supprimé à l'activation.
 * - jamais un cache actif de la version courante ;
 * - uniquement les caches Kenza d'une version précédente (`kenza-v1-*`) ;
 * - jamais les caches Serwist (précache et caches runtime du `defaultCache`).
 */
export function shouldDeleteCache(
  cacheName: string,
  activeOwnCaches: readonly string[] = getActiveOwnCacheNames()
): boolean {
  if (activeOwnCaches.includes(cacheName)) return false;
  if (cacheName.includes('-precache-')) return false;
  return cacheName.startsWith('kenza-');
}

/* ------------------------------------------------------------------ */
/* Précache de la page de repli                                        */
/* ------------------------------------------------------------------ */

export type PrecacheManifestEntry = string | { url: string; revision?: string | null };

function djb2(input: string): number {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/**
 * Révision de précache dérivée du manifeste de build : elle change dès qu'un
 * chunk change, ce qui force le rafraîchissement de `/offline` à chaque
 * déploiement (une révision figée aurait laissé une page de repli périmée
 * pointant vers des chunks supprimés).
 */
export function getPrecacheRevision(entries: readonly PrecacheManifestEntry[] | undefined): string {
  if (!entries || entries.length === 0) return 'w-empty';
  const fingerprint = entries
    .map((entry) => (typeof entry === 'string' ? entry : `${entry.url}@${entry.revision ?? ''}`))
    .sort()
    .join('|');
  return `w${djb2(fingerprint).toString(36)}-${entries.length}`;
}

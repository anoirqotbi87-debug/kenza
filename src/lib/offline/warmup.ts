/**
 * Réchauffement du cache hors-ligne.
 *
 * Les pages de l'App Router n'entrent pas dans le manifeste de précache (rendu
 * dynamique). Après activation du Service Worker, on les traverse donc une fois
 * en arrière-plan : chaque parcours passe par la stratégie `NetworkFirst` de
 * Serwist, qui met la réponse en cache. On réchauffe deux variantes par route :
 *  - le document HTML (navigation « dure », rechargement) ;
 *  - le payload RSC (`RSC: 1`), utilisé par le routeur client de Next.
 *
 * Tout est injectable (`fetchImpl`, `storage`, `isOnline`) pour rester testable
 * hors navigateur. Aucune erreur réseau ne remonte : un échec partiel est
 * simplement rapporté, l'application continue de fonctionner en ligne.
 */

import {
  OFFLINE_APP_ROUTES,
  OFFLINE_WARMUP_STORAGE_KEY,
  OFFLINE_WARMUP_VERSION,
  RSC_REQUEST_HEADERS,
  parseWarmupReport,
  type WarmupReport,
} from './routes';
import { readJSON, writeJSON, type StorageLike } from './storage';

const DEFAULT_CONCURRENCY = 3;
const REQUEST_TIMEOUT_MS = 8_000;

export interface WarmupOptions {
  routes?: readonly string[];
  fetchImpl?: typeof fetch;
  storage?: StorageLike | null;
  isOnline?: () => boolean;
  concurrency?: number;
  now?: () => Date;
  timeoutMs?: number;
  /** Vérifie qu'une route est réellement dans un cache après réchauffement.
   *  Par défaut la Cache API du navigateur ; `null` désactive la vérification. */
  isCached?: ((url: string) => Promise<boolean>) | null;
}

/** Présence effective dans un cache de l'origine, tous caches confondus. */
async function defaultIsCached(url: string): Promise<boolean> {
  if (typeof caches === 'undefined') return true;
  try {
    const hit = await caches.match(url, { ignoreSearch: true });
    return Boolean(hit);
  } catch {
    return true;
  }
}

async function requestOnce(
  fetchImpl: typeof fetch,
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<boolean> {
  const controller = typeof AbortController === 'undefined' ? null : new AbortController();
  const timer =
    controller && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;
  try {
    const response = await fetchImpl(url, {
      credentials: 'same-origin',
      ...init,
      ...(controller ? { signal: controller.signal } : {}),
    });
    if (!response.ok) return false;
    // Le corps doit être consommé : sinon le flux est annulé dès que la
    // promesse retombe, et le clone que la stratégie du worker met en cache est
    // interrompu. Sans cette lecture, `warmOfflineCache` annonçait des routes
    // « en cache » qui n'y étaient pas encore (voire jamais).
    await response.arrayBuffer();
    return true;
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function warmRoute(
  fetchImpl: typeof fetch,
  url: string,
  timeoutMs: number
): Promise<boolean> {
  const [documentResult, rscResult] = await Promise.all([
    requestOnce(fetchImpl, url, { cache: 'reload' }, timeoutMs),
    requestOnce(fetchImpl, url, { headers: { ...RSC_REQUEST_HEADERS } }, timeoutMs),
  ]);
  // Le document suffit à garantir un rechargement hors-ligne ; le payload RSC
  // est un bonus pour la navigation interne.
  return documentResult || rscResult;
}

async function warmRoutes(
  routes: readonly string[],
  fetchImpl: typeof fetch,
  timeoutMs: number,
  isCached: ((url: string) => Promise<boolean>) | null,
  cached: string[],
  failed: string[],
  routeOrder: readonly string[]
): Promise<void> {
  await Promise.all(
    routes.map(async (route) => {
      const fetched = await warmRoute(fetchImpl, route, timeoutMs);
      // Une réponse OK ne garantit pas l'écriture en cache (le worker met en
      // cache de façon asynchrone) : quand la vérification est disponible,
      // c'est elle qui fait foi. Elle valide aussi une route déjà chaude
      // depuis une session précédente.
      const present = isCached ? await isCached(route) : fetched;
      if (present) cached.push(route);
      else failed.push(route);
    })
  );
  cached.sort((a, b) => routeOrder.indexOf(a) - routeOrder.indexOf(b));
  failed.sort((a, b) => routeOrder.indexOf(a) - routeOrder.indexOf(b));
}

export async function warmOfflineCache(options: WarmupOptions = {}): Promise<WarmupReport> {
  const routes = options.routes ?? OFFLINE_APP_ROUTES;
  // `undefined` => stockage navigateur ; `null` => pas de persistance (tests).
  const storage = options.storage;
  const now = options.now ?? (() => new Date());
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY);
  const fetchImpl =
    options.fetchImpl ??
    (typeof fetch === 'function' ? fetch.bind(globalThis) : null);
  const isOnline = options.isOnline ?? (() => true);
  const isCached = options.isCached === null ? null : options.isCached ?? defaultIsCached;

  const cached: string[] = [];
  const failed: string[] = [];

  if (!fetchImpl || !isOnline()) {
    return {
      version: OFFLINE_WARMUP_VERSION,
      completedAt: now().toISOString(),
      cached,
      failed: [...routes],
    };
  }

  for (let index = 0; index < routes.length; index += concurrency) {
    const batch = routes.slice(index, index + concurrency);
    await warmRoutes(batch, fetchImpl, timeoutMs, isCached, cached, failed, routes);
  }

  // Les premières requêtes partent à la seconde où le worker prend la main :
  // un échec transitoire y est fréquent. Une seconde passe sur les seules
  // routes en échec fait converger le warm-up dans la même session.
  if (failed.length > 0) {
    const toRetry = [...failed];
    failed.length = 0;
    await warmRoutes(toRetry, fetchImpl, timeoutMs, isCached, cached, failed, routes);
  }

  const report: WarmupReport = {
    version: OFFLINE_WARMUP_VERSION,
    completedAt: now().toISOString(),
    cached,
    failed,
  };

  if (cached.length > 0) writeWarmupReport(report, storage);
  return report;
}

export function readWarmupReport(storage?: StorageLike | null): WarmupReport | null {
  const raw = readJSON<unknown>(OFFLINE_WARMUP_STORAGE_KEY, null, { storage });
  return parseWarmupReport(raw);
}

export function writeWarmupReport(report: WarmupReport, storage?: StorageLike | null): boolean {
  return writeJSON(OFFLINE_WARMUP_STORAGE_KEY, report, storage);
}

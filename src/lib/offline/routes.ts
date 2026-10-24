/**
 * Inventaire hors-ligne de Kenza.
 *
 * Les pages de l'App Router sont toutes rendues dynamiquement (`ƒ` au build) :
 * elles ne peuvent pas figurer dans le manifeste de précache figé. Elles sont
 * donc réchauffées côté client après activation du Service Worker, puis servies
 * par la stratégie `NetworkFirst` de Serwist quand le réseau disparaît.
 *
 * La liste ci-dessous est la source de vérité partagée entre le réchauffement
 * (`warmup.ts`), l'indicateur d'état (`readiness.ts`) et les tests : ajouter une
 * route critique se fait ici uniquement.
 */

export const OFFLINE_APP_ROUTES = [
  '/',
  '/etudier',
  '/parler',
  '/grammaire',
  '/phrases',
  '/revisions',
  '/dictionnaire',
  '/situations',
  '/culture',
] as const;

export type OfflineAppRoute = (typeof OFFLINE_APP_ROUTES)[number];

/** Page de repli précachée, servie quand une navigation n'est pas en cache. */
export const OFFLINE_FALLBACK_ROUTE = '/offline';

export const OFFLINE_WARMUP_STORAGE_KEY = 'kenza_offline_warmup';

/** Incrémenter invalide les rapports de réchauffement écrits par une version
 *  précédente de l'application. */
export const OFFLINE_WARMUP_VERSION = 2;

/** En-tête qui distingue une requête de navigation client Next.js (payload RSC)
 *  d'une requête de document classique. Les deux doivent être en cache pour que
 *  la navigation interne fonctionne sans réseau. */
export const RSC_REQUEST_HEADERS = { RSC: '1' } as const;

export type WarmupReport = {
  version: number;
  completedAt: string;
  cached: string[];
  failed: string[];
};

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isWarmupReport(value: unknown): value is WarmupReport {
  if (typeof value !== 'object' || value === null) return false;
  const report = value as Partial<WarmupReport>;
  return (
    typeof report.version === 'number' &&
    typeof report.completedAt === 'string' &&
    isStringList(report.cached) &&
    isStringList(report.failed)
  );
}

export function parseWarmupReport(raw: unknown): WarmupReport | null {
  if (typeof raw === 'string') {
    try {
      return parseWarmupReport(JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }
  if (!isWarmupReport(raw)) return null;
  if (raw.version !== OFFLINE_WARMUP_VERSION) return null;
  return { ...raw, cached: [...raw.cached], failed: [...raw.failed] };
}

export function isWarmupComplete(
  report: WarmupReport | null,
  routes: readonly string[] = OFFLINE_APP_ROUTES
): boolean {
  if (!report) return false;
  return routes.every((route) => report.cached.includes(route));
}

/** Un rapport plus vieux que la durée de vie des caches (`pages` : 24 h) ne
 *  garantit plus rien : on le rafraîchit. */
export function isWarmupFresh(
  report: WarmupReport | null,
  maxAgeMs = 12 * 60 * 60 * 1000,
  now: number = Date.now()
): boolean {
  if (!report) return false;
  const completedAt = Date.parse(report.completedAt);
  if (Number.isNaN(completedAt)) return false;
  return now - completedAt >= 0 && now - completedAt < maxAgeMs;
}

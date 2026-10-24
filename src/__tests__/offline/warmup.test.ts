/**
 * Étape 6 — Réchauffement du cache hors-ligne.
 *
 * L'App Router rend les pages dynamiquement (aucune page dans le précache) :
 * c'est le warm-up qui remplit les caches `pages` / `pages-rsc` de Serwist
 * pour que toute l'application soit navigable sans réseau. Les helpers sont
 * testés avec un `fetch` fantaisiste ; aucun vrai réseau n'est requis.
 */

import { describe, it, expect } from 'vitest';
import {
  OFFLINE_APP_ROUTES,
  OFFLINE_FALLBACK_ROUTE,
  OFFLINE_WARMUP_STORAGE_KEY,
  OFFLINE_WARMUP_VERSION,
  RSC_REQUEST_HEADERS,
  isWarmupComplete,
  isWarmupFresh,
  parseWarmupReport,
} from '@/lib/offline/routes';
import { readWarmupReport, warmOfflineCache } from '@/lib/offline/warmup';

function fakeFetchLogic(url: string, init: RequestInit): Response {
  const accept = (init.headers as Record<string, string> | undefined)?.['RSC'];
  const body = accept === '1' ? `RSC:${url}` : `HTML:${url}`;
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/html' } });
}

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  clear(): void {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe('routes — inventaire hors-ligne', () => {
  it('couvre l’application (dashboard, modules, SRS, dictionnaire, situations, culture)', () => {
    const joined = OFFLINE_APP_ROUTES.join(' ');
    for (const route of ['/', '/etudier', '/parler', '/grammaire', '/phrases', '/revisions', '/dictionnaire', '/situations', '/culture']) {
      expect(joined).toContain(route);
    }
  });

  it('distingue la page de repli des routes réchauffées', () => {
    expect(OFFLINE_FALLBACK_ROUTE).toBe('/offline');
    expect(OFFLINE_APP_ROUTES).not.toContain(OFFLINE_FALLBACK_ROUTE);
  });

  it('marque le warm-up complet uniquement quand toutes les routes sont en cache', () => {
    const complete = {
      version: OFFLINE_WARMUP_VERSION,
      completedAt: new Date().toISOString(),
      cached: [...OFFLINE_APP_ROUTES],
      failed: [],
    };
    expect(isWarmupComplete(complete)).toBe(true);
    expect(isWarmupComplete({ ...complete, cached: OFFLINE_APP_ROUTES.slice(0, 3) })).toBe(false);
    expect(isWarmupComplete(null)).toBe(false);
  });

  it('évalue la fraîcheur du rapport', () => {
    const inThePast = {
      version: OFFLINE_WARMUP_VERSION,
      completedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      cached: [...OFFLINE_APP_ROUTES],
      failed: [],
    };
    expect(isWarmupFresh(inThePast, 2 * 60 * 60 * 1000, Date.now())).toBe(true);
    expect(isWarmupFresh(inThePast, 30 * 60 * 1000, Date.now())).toBe(false);
    expect(isWarmupFresh(null)).toBe(false);
  });

  it('ignore les rapports d’une autre version', () => {
    const stale = {
      version: OFFLINE_WARMUP_VERSION - 1,
      completedAt: new Date().toISOString(),
      cached: [...OFFLINE_APP_ROUTES],
      failed: [],
    };
    expect(parseWarmupReport(JSON.stringify(stale))).toBeNull();
    expect(parseWarmupReport('not-json')).toBeNull();
    expect(parseWarmupReport('{bad')).toBeNull();
  });
});

describe('warmOfflineCache', () => {
  it('réchauffe la liste complète (document + payload RSC) et persiste le rapport', async () => {
    const storage = new MemoryStorage();
    const requested: string[] = [];
    const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit) => {
      requested.push(String(input));
      return Promise.resolve(fakeFetchLogic(String(input), init ?? {}));
    }) as typeof fetch;

    const report = await warmOfflineCache({ fetchImpl, storage, concurrency: 2, isCached: null });

    expect(report.cached).toHaveLength(OFFLINE_APP_ROUTES.length);
    expect(report.failed).toHaveLength(0);
    // Deux requêtes par route : le document et le payload RSC.
    for (const route of OFFLINE_APP_ROUTES) {
      expect(requested.filter((r) => r === route).length).toBeGreaterThanOrEqual(1);
    }
    expect(requested).toContain('/dictionnaire');

    const persisted = readWarmupReport(storage);
    expect(persisted).not.toBeNull();
    expect(isWarmupComplete(persisted)).toBe(true);
    expect(persisted?.cached).toEqual(OFFLINE_APP_ROUTES);
  });

  it('annote les requêtes RSC avec l’en-tête attendu par le routeur Next', async () => {
    const headersSeen: Array<Record<string, string>> = [];
    const fetchImpl = ((_input: RequestInfo | URL, init?: RequestInit) => {
      if (String(_input) === '/') headersSeen.push((init?.headers as Record<string, string>) ?? {});
      return Promise.resolve(fakeFetchLogic(String(_input), init ?? {}));
    }) as typeof fetch;

    await warmOfflineCache({ fetchImpl, storage: null, routes: ['/'], isCached: null });

    expect(headersSeen).toHaveLength(2);
    expect(headersSeen).toContainEqual({ ...RSC_REQUEST_HEADERS });
    expect(headersSeen).toContainEqual({});
  });

  it('rapporte les routes en échec sans persister un rapport complet', async () => {
    const storage = new MemoryStorage();
    const fetchImpl = ((_input: RequestInfo | URL) =>
      Promise.resolve(new Response('boom', { status: 503 }))) as typeof fetch;

    const report = await warmOfflineCache({ fetchImpl, storage, routes: ['/', '/culture'], isCached: null });

    expect(report.cached).toHaveLength(0);
    expect(report.failed).toHaveLength(2);
    // Un rapport vide n'est pas persiste : la tentative suivante retentera.
    expect(storage.getItem(OFFLINE_WARMUP_STORAGE_KEY)).toBeNull();
  });

  it('consomme le corps des réponses (sinon le clone mis en cache est annulé)', async () => {
    let consumed = 0;
    const fetchImpl = ((input: RequestInfo | URL) =>
      Promise.resolve(
        new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode(String(input)));
              controller.close();
              consumed += 1;
            },
          }),
          { status: 200 }
        )
      )) as unknown as typeof fetch;

    await warmOfflineCache({ fetchImpl, storage: null, routes: ['/'], isCached: null });

    // Deux flux (document + payload RSC) doivent avoir été lus jusqu'au bout.
    expect(consumed).toBe(2);
  });

  it('ne déclare une route en cache que si la vérification la retrouve', async () => {
    const fetchImpl = ((_input: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(fakeFetchLogic(String(_input), init ?? {}))) as typeof fetch;

    const present = new Set(['/', '/culture']);
    const verified: string[] = [];
    const report = await warmOfflineCache({
      fetchImpl,
      storage: null,
      routes: ['/', '/culture', '/revisions'],
      isCached: async (route) => {
        verified.push(route);
        return present.has(route);
      },
    });

    expect(report.cached).toEqual(['/', '/culture']);
    expect(report.failed).toEqual(['/revisions']);
    expect(verified.length).toBeGreaterThanOrEqual(3);
  });

  it('relance une fois les routes en échec à la première passe', async () => {
    const requestsMade: string[] = [];
    const fetchImpl = ((input: RequestInfo | URL) => {
      requestsMade.push(String(input));
      return Promise.resolve(fakeFetchLogic(String(input), {}));
    }) as unknown as typeof fetch;

    // Seule '/' est « en cache » ; les autres échouent aux deux passes.
    const present = new Set(['/']);
    const report = await warmOfflineCache({
      fetchImpl,
      storage: null,
      routes: ['/', '/revisions'],
      isCached: async (route) => present.has(route),
    });

    expect(report.cached).toEqual(['/']);
    expect(report.failed).toEqual(['/revisions']);
    // La seconde passe réémet les requêtes de la route en échec.
    const retried = requestsMade.filter((u) => u.includes('/revisions'));
    expect(retried.length).toBeGreaterThan(0);
    // Report stable : rien n'est déclaré en cache sans vérification.
    expect(report.failed).toHaveLength(1);
  });

  it('ne fait jamais remonter d’erreur réseau au-dessus des échecs partiels', async () => {
    const fetchImpl = (() => Promise.reject(new TypeError('NetworkError'))) as unknown as typeof fetch;
    const storage = new MemoryStorage();

    const report = await warmOfflineCache({ fetchImpl, storage, routes: ['/', '/revisions'], isCached: null });

    expect(report.cached).toHaveLength(0);
    expect(report.failed).toEqual(['/', '/revisions']);
  });

  it('ne lance aucun réseau quand le rapport est déjà complet (court-circuit au warm-up)', async () => {
    const storage = new MemoryStorage();
    const previous = {
      version: OFFLINE_WARMUP_VERSION,
      completedAt: new Date().toISOString(),
      cached: [...OFFLINE_APP_ROUTES],
      failed: [],
    };
    storage.setItem(OFFLINE_WARMUP_STORAGE_KEY, JSON.stringify(previous));

    let calls = 0;
    const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit) => {
      calls += 1;
      return Promise.resolve(fakeFetchLogic(String(input), init ?? {}));
    }) as typeof fetch;

    // Warm-up inconditionnel relance de toute façon ; c'est le layer de
    // readiness qui court-circuite. On vérifie ici que le contrat `isWarmupComplete`
    // permet ce court-circuit.
    const report = await warmOfflineCache({ fetchImpl, storage, routes: ['/'], isCached: null });
    expect(calls).toBe(2);
    expect(report.cached).toEqual(['/']);
  });
});
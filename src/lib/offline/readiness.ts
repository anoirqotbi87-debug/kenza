'use client';

/**
 * État de préparation hors-ligne, lu par le badge d'interface.
 *
 * Le statut ne décrit pas la connexion (voir `useNetwork`) mais la capacité
 * réelle de l'application à fonctionner sans réseau : Service Worker actif et
 * routes critiques présentes dans le cache.
 */

import { useSyncExternalStore } from 'react';
import {
  OFFLINE_APP_ROUTES,
  isWarmupComplete,
  isWarmupFresh,
  type WarmupReport,
} from './routes';
import { readWarmupReport, warmOfflineCache } from './warmup';

export type OfflineStatus = 'idle' | 'unsupported' | 'preparing' | 'partial' | 'ready';

export interface OfflineReadinessSnapshot {
  status: OfflineStatus;
  cached: number;
  total: number;
  updatedAt: string | null;
}

const TOTAL = OFFLINE_APP_ROUTES.length;
const SERVER_SNAPSHOT: OfflineReadinessSnapshot = Object.freeze({
  status: 'idle',
  cached: 0,
  total: TOTAL,
  updatedAt: null,
});

let snapshot: OfflineReadinessSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit(next: OfflineReadinessSnapshot): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function getOfflineReadinessSnapshot(): OfflineReadinessSnapshot {
  return snapshot;
}

export function getOfflineReadinessServerSnapshot(): OfflineReadinessSnapshot {
  return SERVER_SNAPSHOT;
}

export function subscribeOfflineReadiness(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function snapshotFromReport(report: WarmupReport | null): OfflineReadinessSnapshot {
  if (!report) {
    return { status: 'preparing', cached: 0, total: TOTAL, updatedAt: null };
  }
  const cached = report.cached.filter((route) =>
    (OFFLINE_APP_ROUTES as readonly string[]).includes(route)
  ).length;
  return {
    status: isWarmupComplete(report) ? 'ready' : cached > 0 ? 'partial' : 'preparing',
    cached,
    total: TOTAL,
    updatedAt: report.completedAt,
  };
}

/** Recalcule le statut depuis le rapport persisté (sans réseau). */
export function refreshOfflineReadiness(): OfflineReadinessSnapshot {
  if (typeof window === 'undefined') return snapshot;
  const next = snapshotFromReport(readWarmupReport());
  emit(next);
  return next;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      }
    );
  });
}

let bootstrap: Promise<void> | null = null;

async function runWarmup(): Promise<void> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    emit({ status: 'unsupported', cached: 0, total: TOTAL, updatedAt: null });
    return;
  }

  const stored = readWarmupReport();
  emit(snapshotFromReport(stored));

  // Rapport complet et récent : le cache est déjà chaud, inutile de refaire
  // 18 requêtes à chaque ouverture de l'application.
  if (isWarmupComplete(stored) && isWarmupFresh(stored)) {
    emit({ ...snapshotFromReport(stored), status: 'ready' });
    return;
  }

  const registration = await withTimeout(
    navigator.serviceWorker.ready.catch(() => null),
    10_000
  );
  if (!registration) {
    // Pas de worker actif (développement, navigateur sans support, blocage) :
    // l'application reste pleinement utilisable en ligne.
    emit({ status: 'unsupported', cached: 0, total: TOTAL, updatedAt: null });
    return;
  }

  emit({ ...snapshotFromReport(stored), status: 'preparing' });
  const report = await warmOfflineCache({
    isOnline: () => navigator.onLine,
  });
  emit(snapshotFromReport(report));
}

/** Démarre le réchauffement une seule fois par session. */
export function ensureOfflineWarmup(): Promise<void> {
  if (!bootstrap) {
    bootstrap = runWarmup().catch(() => {
      emit({ status: 'partial', cached: snapshot.cached, total: TOTAL, updatedAt: snapshot.updatedAt });
    });
  }
  return bootstrap;
}

/** Autorise une nouvelle tentative (retour en ligne, changement de SW). */
export function resetOfflineWarmup(): void {
  bootstrap = null;
}

export function useOfflineReadiness(): OfflineReadinessSnapshot {
  return useSyncExternalStore(
    subscribeOfflineReadiness,
    getOfflineReadinessSnapshot,
    getOfflineReadinessServerSnapshot
  );
}

'use client';

import { useEffect } from 'react';
import {
  ensureOfflineWarmup,
  refreshOfflineReadiness,
  resetOfflineWarmup,
} from '@/lib/offline/readiness';

/**
 * Amorçage du mode hors-ligne.
 *
 * Monté une fois dans le layout : lit l'état déjà persisté, puis lance le
 * réchauffement du cache en arrière-plan. Au retour de la connexion, un
 * réchauffement partiel reprend là où il s'était arrêté.
 */
export default function OfflineBootstrap() {
  useEffect(() => {
    refreshOfflineReadiness();
    void ensureOfflineWarmup();

    const handleOnline = () => {
      resetOfflineWarmup();
      void ensureOfflineWarmup();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return null;
}

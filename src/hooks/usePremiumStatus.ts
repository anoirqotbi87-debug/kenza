'use client';

import { useEffect, useState } from 'react';
import { fetchPremiumStatus } from '@/lib/premium';
import { supabase } from '@/lib/supabase';
import { syncService } from '@/lib/syncService';
import { useAppStore } from '@/store/useAppStore';

/** Charge le statut Pro côté serveur et synchronise la progression sur les routes autonomes. */
export function usePremiumStatus() {
  const setIsPremium = useAppStore((state) => state.setIsPremium);
  const isPremium = useAppStore((state) => state.isPremium);
  const [isPremiumReady, setIsPremiumReady] = useState(false);

  useEffect(() => {
    let active = true;
    let requestId = 0;
    let loadedUserId: string | null | undefined;

    const load = async (userId: string | null) => {
      if (loadedUserId === userId) return;
      loadedUserId = userId;
      const currentRequest = ++requestId;
      setIsPremiumReady(false);

      let premium = false;
      if (userId) {
        try {
          await syncService.syncCloudToLocal(userId);
          premium = await fetchPremiumStatus(userId);
        } catch (error) {
          console.warn('[Premium] Impossible de charger les droits du compte.', error);
        }
      }

      if (active && currentRequest === requestId) {
        setIsPremium(premium);
        setIsPremiumReady(true);
      }
    };

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => load(session?.user.id ?? null))
      .catch(() => load(null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        requestId += 1;
        loadedUserId = null;
        setIsPremium(false);
        setIsPremiumReady(true);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Ne pas appeler Supabase pendant le callback d’authentification.
        window.setTimeout(() => {
          if (active) void load(session.user.id);
        }, 0);
      }
    });

    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
    };
  }, [setIsPremium]);

  return { isPremium, isPremiumReady };
}

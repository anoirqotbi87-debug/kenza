'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchPremiumStatus } from '@/lib/premium';
import { useAppStore } from '@/store/useAppStore';

/**
 * Synchroniseur global d'authentification et de statut VIP/Premium.
 * Monté au niveau du RootLayout, il garantit que toutes les routes
 * (/phrases, /etudier, /parler, /revisions, /grammaire, /)
 * reconnaissent immédiatement les droits VIP de l'utilisateur.
 */
export default function AuthAndPremiumSync() {
  const setUser = useAppStore((s) => s.setUser);
  const setIsPremium = useAppStore((s) => s.setIsPremium);
  const setAudioQuotaExceeded = useAppStore((s) => s.setAudioQuotaExceeded);
  const resetUserProgress = useAppStore((s) => s.resetUserProgress);

  useEffect(() => {
    // 1. Initialisation immédiate depuis le flag VIP client local
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('kenza_vip_active') === 'true') {
        setIsPremium(true);
        setAudioQuotaExceeded(false);
      }
    } catch {}

    // 2. Vérification de session Supabase et synchronisation du statut profiles.is_premium
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const isPro = await fetchPremiumStatus(session.user.id);
        setIsPremium(isPro);
        if (isPro) {
          setAudioQuotaExceeded(false);
        }
      }
    });

    // 3. Écoute dynamique des événements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const isPro = await fetchPremiumStatus(session.user.id);
        setIsPremium(isPro);
        if (isPro) {
          setAudioQuotaExceeded(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsPremium(false);
        resetUserProgress();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setIsPremium, setAudioQuotaExceeded, resetUserProgress]);

  return null;
}

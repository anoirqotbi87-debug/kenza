'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { syncService } from './syncService';

/** Utilisateur connecté (null = invité). Synchronise la progression à chaque connexion (e-mail confirmé, Google...). */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (event === 'SIGNED_IN' && session?.user) {
        // Différé pour ne pas appeler Supabase à l'intérieur du callback d'auth
        setTimeout(() => syncService.syncCloudToLocal(session.user.id), 0);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return { user, isGuest: ready && !user, ready };
}

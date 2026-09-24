'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { claimAttribution, getFirstTouch } from '../lib/tracking';

/** Capture la source de la première visite et rattache les connexions OAuth à leur source. */
export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getFirstTouch();

    const { data } = supabase.auth.onAuthStateChange((event) => {
      // Sans effet pour les inscriptions e-mail (déjà attribuées) ou les comptes existants :
      // la fonction serveur ne complète que les comptes créés depuis moins d'une heure sans source.
      if (event === 'SIGNED_IN') claimAttribution();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}

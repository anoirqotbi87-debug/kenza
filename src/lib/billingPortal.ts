'use client';

import { supabase } from './supabase';

/**
 * Ouvre le portail de facturation Stripe pour l'utilisateur connecté et redirige
 * le navigateur vers la session. Renvoie un message d'erreur en cas d'échec
 * (jamais de succès simulé : sans URL renvoyée par le serveur, on ne fait rien).
 */
export async function openBillingPortal(): Promise<{ error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    return { error: 'UNAUTHORIZED' };
  }

  const res = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.url) {
    return { error: data.error || 'PORTAL_UNAVAILABLE' };
  }

  window.location.href = data.url;
  return {};
}

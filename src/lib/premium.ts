import { supabase } from './supabase';

/**
 * Source de vérité unique pour `isPremium`.
 *
 * Le statut premium est lu depuis `profiles.is_premium` et `profiles.subscription_cycle`.
 * Les utilisateurs abonnés via Stripe ou détenteurs du statut VIP (PROMO_VIPEIDER)
 * sont reconnus comme Premium.
 */
export async function fetchPremiumStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_premium, subscription_cycle')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('[Premium] Impossible de lire is_premium:', error.message);
    return false;
  }

  const isPro = data?.is_premium === true || data?.subscription_cycle === 'PROMO_VIPEIDER';

  if (isPro && typeof window !== 'undefined') {
    try {
      localStorage.setItem('kenza_vip_active', 'true');
    } catch {}
  }

  return isPro;
}

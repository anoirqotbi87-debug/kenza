import { supabase } from './supabase';

/**
 * Source de vérité unique pour `isPremium`.
 *
 * Le flag n'est plus persisté localement : il est relu depuis `profiles.is_premium`, seule
 * valeur que le client ne peut pas falsifier (RLS limite la lecture à sa propre ligne, et le
 * client n'a plus le droit d'écrire cette colonne). Sans ce garde-fou, éditer le localStorage
 * suffisait à débloquer les modules et scénarios premium.
 *
 * En cas d'échec (hors ligne, session expirée), le repli est le refus : on ne débloque jamais
 * du contenu par défaut.
 */
export async function fetchPremiumStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', userId)
    .single();

  if (error) {
    console.warn('[Premium] Impossible de lire is_premium:', error.message);
    return false;
  }

  return data?.is_premium === true;
}

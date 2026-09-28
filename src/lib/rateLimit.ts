import { supabase } from '@/lib/supabase';

/**
 * Rate limiting durable basé sur Supabase (RPC check_rate_limit).
 * Remplace le Map en mémoire, inefficace en serverless (multi-instances).
 *
 * Stratégie fail-open : en cas d'erreur Supabase, la requête est autorisée
 * (log explicite) pour ne pas casser l'expérience utilisateur.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });

    if (error) {
      console.error('[RateLimit] RPC error:', error.message);
      return { allowed: true, error: error.message };
    }

    return { allowed: !!data };
  } catch (err: any) {
    console.error('[RateLimit] Unexpected error:', err?.message || err);
    return { allowed: true, error: String(err?.message || err) };
  }
}

/** Extrait l'IP client derrière le proxy Vercel. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '127.0.0.1';
}

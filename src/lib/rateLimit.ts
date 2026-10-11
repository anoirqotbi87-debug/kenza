// src/lib/rateLimit.ts (REMPLACE le fichier existant)
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Rate limiting durable basé sur Supabase (RPC check_rate_limit).
 * Remplace le Map en mémoire, inefficace en serverless (multi-instances).
 *
 * La RPC n'est exécutable que par le service_role : le client utilisé ici est donc
 * le client admin (serveur uniquement), et non plus le client anonyme public.
 *
 * Stratégie : en cas d'erreur, on renvoie `error` et c'est à l'appelant de décider
 * (échec fermé pour /api/tts et /api/roleplay/chat, ouvert pour /api/csp-report).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; error?: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const message =
      'SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant';
    console.error('[RateLimit] Configuration:', message);
    return { allowed: true, error: message };
  }

  try {
    const { data, error } = await admin.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_ms: windowMs,
    });

    if (error) {
      console.error('[RateLimit] RPC error:', error.message);
      return { allowed: true, error: error.message };
    }

    return { allowed: !!data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[RateLimit] Unexpected error:', message);
    return { allowed: true, error: message };
  }
}

/** Extrait l'IP client derrière le proxy Vercel. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? '127.0.0.1';
}

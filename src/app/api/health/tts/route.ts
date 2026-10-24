import { NextRequest, NextResponse } from 'next/server';

import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { probeTts } from '@/lib/tts/health';

/**
 * Sonde de santé du moteur TTS.
 *
 * Le texte synthétisé est **fixe** (`WITNESS_TEXT`) : cette route ne peut pas
 * servir de relais pour faire parler le service avec un contenu arbitraire.
 *
 * `Cache-Control: no-store` est essentiel : la route de synthèse renvoie
 * `max-age=604800`, donc une sonde mise en cache par le CDN validerait un
 * résultat périmé et raterait exactement la panne qu'elle doit détecter.
 */
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Jeton optionnel : tant qu'il n'est pas configuré, la route reste ouverte
  // (elle ne révèle qu'un état binaire et coûte une synthèse d'un mot).
  const secret = process.env.TTS_HEALTH_TOKEN;
  if (secret) {
    const provided =
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
      new URL(req.url).searchParams.get('token');
    if (provided !== secret) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
  }

  const rate = await checkRateLimit(`tts-health:ip:${getClientIp(req)}`, 10, 60 * 1000);
  // Volontairement permissif : si le limiteur est indisponible, on préfère
  // mesurer le service que renvoyer un faux « dégradé » dû à l'infrastructure.
  if (!rate.error && !rate.allowed) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }

  const result = await probeTts({ timeoutMs: 10000 });
  const ok = result.status === 'ok';

  if (!ok) {
    console.error('[TtsHealth] Dégradé:', result.error, `(${result.latencyMs}ms)`);
  }

  return NextResponse.json(
    {
      status: result.status,
      bytes: result.bytes,
      latencyMs: result.latencyMs,
      ...(ok ? {} : { reason: result.error }),
    },
    {
      status: ok ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}

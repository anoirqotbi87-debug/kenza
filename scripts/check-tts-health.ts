/**
 * Sonde de santé TTS en production.
 *
 * Appelée par le workflow planifié `.github/workflows/tts-health.yml` — jamais
 * par la CI de pull request : un hoquet réseau de Microsoft ne doit pas rendre
 * une PR rouge, sinon l'alerte finit par être ignorée.
 *
 * Usage :
 *   npx tsx scripts/check-tts-health.ts [--url <base>] [--token <secret>]
 *
 * Sortie : 0 = sain, 1 = dégradé, 2 = configuration/erreur réseau.
 */
import { MIN_AUDIO_BYTES } from '../src/lib/tts/health';

const DEFAULT_URL = 'https://kenza-dusky.vercel.app';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const base = (arg('url') ?? process.env.TTS_HEALTH_URL ?? DEFAULT_URL).replace(/\/$/, '');
  const token = arg('token') ?? process.env.TTS_HEALTH_TOKEN;

  // Anti-cache : la route de synthèse renvoie `max-age=604800`, donc un
  // intermédiaire pourrait servir un résultat périmé et masquer la panne.
  const url = `${base}/api/health/tts?_=${Date.now()}`;

  console.log(`Sonde TTS → ${base}/api/health/tts`);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(30000),
    });
  } catch (err) {
    console.error(`✗ Service injoignable : ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }

  const body = await res.text();

  if (res.status === 401) {
    console.error('✗ 401 : TTS_HEALTH_TOKEN est configuré côté serveur mais absent ou invalide ici.');
    process.exit(2);
  }

  if (res.status === 404) {
    console.error('✗ 404 : la route /api/health/tts n’est pas déployée sur cette base.');
    process.exit(2);
  }

  if (res.status === 429) {
    console.error('✗ 429 : limite de débit atteinte — relancer plus tard.');
    process.exit(2);
  }

  let payload: { status?: string; bytes?: number; latencyMs?: number; reason?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    console.error(`✗ Réponse non JSON (HTTP ${res.status}) : ${body.slice(0, 200)}`);
    process.exit(1);
  }

  if (payload.status === 'ok') {
    console.log(
      `✓ Moteur TTS sain — ${payload.bytes} octets (min ${MIN_AUDIO_BYTES}), ${payload.latencyMs} ms, HTTP ${res.status}`
    );
    process.exit(0);
  }

  console.error(`✗ Moteur TTS DÉGRADÉ (HTTP ${res.status})`);
  console.error(`  raison   : ${payload.reason ?? 'inconnue'}`);
  console.error(`  octets   : ${payload.bytes ?? 0}`);
  console.error(`  latence  : ${payload.latencyMs ?? '?'} ms`);
  console.error('');
  console.error('  Piste la plus probable : le schéma du jeton Sec-MS-GEC a encore changé.');
  console.error('  Voir src/lib/tts/edgeTtsToken.ts et src/lib/tts/synthesizeEdgeTts.ts.');
  process.exit(1);
}

main().catch((err) => {
  console.error('✗ Erreur inattendue :', err);
  process.exit(2);
});

/**
 * Sonde de santé du moteur TTS Edge.
 *
 * Edge TTS est un point d'entrée **non documenté** : Microsoft a déjà durci son
 * authentification (jeton `Sec-MS-GEC` v1 → v2) et le service répond alors
 * `HTTP 200` au handshake au lieu d'ouvrir le WebSocket. L'échec est donc
 * silencieux : toute l'application devient muette sans erreur exploitable.
 *
 * Cette sonde rejoue le pipeline de production sur un mot témoin fixe et
 * vérifie la **forme réelle de la réponse** (flux MPEG non vide), pas seulement
 * le code HTTP. C'est ce qui distingue un service sain d'un service qui répond
 * « 200 » avec du vide.
 */
import { buildSsml } from './ssml';
import { normalizeDarija } from './darijaPhonetics';
import { prepareDarijaForTts } from './darijaPhonetic';
import { synthesizeEdgeTts } from './synthesizeEdgeTts';

/**
 * Mot témoin **fixe**, jamais issu d'une entrée utilisateur : la sonde doit
 * rester un appel interne et ne peut donc pas servir de relais vers le service.
 */
export const WITNESS_TEXT = 'salam';

/**
 * Un mot court dépasse déjà 11 000 octets en 48 kbit/s. Ce seuil n'attrape pas
 * une dérive de taille, seulement une réponse vide ou tronquée.
 */
export const MIN_AUDIO_BYTES = 1000;

export type TtsHealthStatus = 'ok' | 'degraded';

export interface TtsHealthResult {
  status: TtsHealthStatus;
  /** Taille du flux audio reçu, en octets (0 si la synthèse a échoué). */
  bytes: number;
  latencyMs: number;
  /** Raison de la dégradation, destinée aux logs — jamais renvoyée telle quelle à un tiers. */
  error?: string;
}

/**
 * Vérifie qu'un tampon est bien une suite de trames MPEG audio.
 *
 * Le simple test `0xFF` serait trompeur : un flux vide, tronqué ou une page
 * d'erreur HTML peuvent contenir cet octet. On valide donc l'en-tête complet
 * (synchronisation 11 bits + version et couche non réservées).
 */
export function isMpegAudio(buffer: Buffer): boolean {
  if (buffer.length < MIN_AUDIO_BYTES) return false;

  const b0 = buffer[0];
  const b1 = buffer[1];
  if (b0 !== 0xff || (b1 & 0xe0) !== 0xe0) return false;

  const version = (b1 >> 3) & 0x03;
  const layer = (b1 >> 1) & 0x03;
  return version !== 0x01 && layer !== 0x00;
}

export interface ProbeOptions {
  /** Injectable pour tester le contrat sans réseau. */
  synthesize?: (ssml: string) => Promise<Buffer>;
  timeoutMs?: number;
}

/**
 * Rejoue le pipeline de production sur le mot témoin et valide la réponse.
 *
 * Ne lève jamais : une panne du service est un résultat `degraded`, pas une
 * exception — la sonde doit rester appelable depuis une route HTTP ou un job.
 */
export async function probeTts(options: ProbeOptions = {}): Promise<TtsHealthResult> {
  const synthesize = options.synthesize ?? ((ssml: string) => synthesizeEdgeTts(ssml, { timeoutMs: options.timeoutMs }));
  const startedAt = Date.now();

  try {
    const phonetic = prepareDarijaForTts(WITNESS_TEXT);
    const text = normalizeDarija(phonetic, phonetic);
    const { ssml } = buildSsml(text, 'female', 'normal');

    const audio = await synthesize(ssml);
    const latencyMs = Date.now() - startedAt;

    if (!isMpegAudio(audio)) {
      return {
        status: 'degraded',
        bytes: audio.length,
        latencyMs,
        error: `Réponse non audio (${audio.length} octets) — handshake ou format modifié`,
      };
    }

    return { status: 'ok', bytes: audio.length, latencyMs };
  } catch (err) {
    return {
      status: 'degraded',
      bytes: 0,
      latencyMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

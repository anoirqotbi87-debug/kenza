import WebSocket from 'ws';
import crypto from 'crypto';

import { generateSecMsGecV2, SEC_MS_GEC_VERSION, TRUSTED_CLIENT_TOKEN } from './edgeTtsToken';

const CHROMIUM_MAJOR = '143';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  `(KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR}.0.0.0`;

/**
 * Hôte historique du service « Read Aloud » d'Edge. C'est le seul point d'entrée
 * qui accepte encore le jeton `Sec-MS-GEC` v2 ; l'hôte `api.msedgeservices.com`
 * répond `HTTP 200` (donc jamais d'upgrade WebSocket) et casse la synthèse.
 */
const WSS_BASE = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';

function connectId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

/** Horodatage au format JavaScript attendu par le service (bug assumé côté Edge). */
function dateToString(): string {
  return new Date().toUTCString();
}

export interface EdgeTtsOptions {
  voice?: string;
  rate?: string;
  pitch?: string;
  timeoutMs?: number;
}

/**
 * Synthétise un texte en audio MP3 via le protocole WebSocket Edge TTS.
 *
 * Le service exige désormais un jeton `Sec-MS-GEC` **v2** (voir `edgeTtsToken`).
 * Avec un jeton v1, le handshake échoue en `HTTP 200` au lieu d'ouvrir la
 * connexion : la synthèse échouait alors pour toute l'application.
 */
export async function synthesizeEdgeTts(
  ssml: string,
  options: EdgeTtsOptions = {}
): Promise<Buffer> {
  const timeoutMs = options.timeoutMs || 15000;

  return new Promise((resolve, reject) => {
    const url =
      `${WSS_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
      `&ConnectionId=${connectId()}` +
      `&Sec-MS-GEC=${generateSecMsGecV2()}` +
      `&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;

    const ws = new WebSocket(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'Sec-WebSocket-Version': '13',
        Cookie: `muid=${crypto.randomBytes(16).toString('hex').toUpperCase()};`,
      },
    });

    const chunks: Buffer[] = [];
    const reqId = connectId();

    const timer = setTimeout(() => {
      try {
        ws.terminate();
      } catch {}
      reject(new Error(`TTS synthesis timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    ws.on('open', () => {
      ws.send(
        `X-Timestamp:${dateToString()}\r\n` +
          'Content-Type:application/json; charset=utf-8\r\n' +
          'Path:speech.config\r\n\r\n' +
          JSON.stringify({
            context: {
              synthesis: {
                audio: {
                  metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
                  outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
                },
              },
            },
          })
      );

      const ssmlMsg =
        `X-RequestId:${reqId}\r\n` +
        'Content-Type:application/ssml+xml\r\n' +
        `X-Timestamp:${dateToString()}Z\r\n` +
        'Path:ssml\r\n\r\n' +
        ssml.trim();
      ws.send(ssmlMsg);
    });

    ws.on('message', (data: WebSocket.RawData) => {
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
      const str = buf.toString('utf8');

      if (str.includes('Path:audio')) {
        const delim = Buffer.from('Path:audio\r\n');
        const idx = buf.indexOf(delim);
        if (idx !== -1) {
          const audioPart = buf.subarray(idx + delim.length);
          if (audioPart.length > 0) {
            chunks.push(audioPart);
          }
        }
      }

      if (str.includes('Path:turn.end')) {
        clearTimeout(timer);
        try {
          ws.close();
        } catch {}
        resolve(Buffer.concat(chunks));
      }
    });

    // Un refus d'upgrade arrive ici : sans ce garde-fou, l'erreur générique ne
    // disait pas pourquoi la synthèse échouait (jeton expiré, hôte obsolète…).
    ws.on('unexpected-response', (_req, res) => {
      clearTimeout(timer);
      reject(new Error(`Edge TTS handshake refused: HTTP ${res.statusCode}`));
    });

    ws.on('error', (err: unknown) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

import WebSocket from 'ws';
import crypto from 'crypto';

function generateSecMsGec(): string {
  const ticks = Math.floor(Date.now() / 1000) + 11644473600;
  const rounded = ticks - (ticks % 300);
  const windowsTicks = BigInt(rounded) * BigInt(10000000);
  const data = windowsTicks.toString() + '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

export interface EdgeTtsOptions {
  voice?: string;
  rate?: string;
  pitch?: string;
  timeoutMs?: number;
}

/**
 * Synthétise un texte en audio MP3 via le protocole WebSocket officiel Edge TTS mis à jour (api.msedgeservices.com).
 * Résout le problème de 403 Forbidden apparu sur l'ancien hôte déprécié speech.platform.bing.com.
 */
export async function synthesizeEdgeTts(
  ssml: string,
  options: EdgeTtsOptions = {}
): Promise<Buffer> {
  const timeoutMs = options.timeoutMs || 15000;

  return new Promise((resolve, reject) => {
    const secMsGec = generateSecMsGec();
    const connectionId = crypto.randomUUID().replace(/-/g, '');
    const url = `wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1?Ocp-Apim-Subscription-Key=6A5AA1D4EAFF4E9FB37E23D68491D6F4&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=1-143.0.3650.75&ConnectionId=${connectionId}`;

    const ws = new WebSocket(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      },
    });

    const chunks: Buffer[] = [];
    const reqId = crypto.randomUUID().replace(/-/g, '');

    const timer = setTimeout(() => {
      try {
        ws.terminate();
      } catch {}
      reject(new Error(`TTS synthesis timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    ws.on('open', () => {
      ws.send(
        'Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n' +
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

      const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml.trim()}`;
      ws.send(ssmlMsg);
    });

    ws.on('message', (data: WebSocket.RawData) => {
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
      const str = buf.toString('utf8');

      if (str.includes('Path:turn.end')) {
        clearTimeout(timer);
        try {
          ws.close();
        } catch {}
        const audioBuffer = Buffer.concat(chunks);
        resolve(audioBuffer);
      } else if (str.includes('Path:audio')) {
        const delim = Buffer.from('Path:audio\r\n');
        const idx = buf.indexOf(delim);
        if (idx !== -1) {
          const audioPart = buf.subarray(idx + delim.length);
          if (audioPart.length > 0) {
            chunks.push(audioPart);
          }
        }
      }
    });

    ws.on('error', (err: unknown) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { normalizeDarija } from '@/lib/tts/darijaPhonetics';
import { buildSsml, TtsVoice, TtsSpeed } from '@/lib/tts/ssml';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

async function synthesize(
  text: string,
  arabicText?: string,
  voice: TtsVoice = 'female',
  speed: TtsSpeed = 'normal'
) {
  const textToSpeak = normalizeDarija(text, arabicText);
  const { ssml, voiceName } = buildSsml(textToSpeak, voice, speed);

  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const readable = tts.rawToStream(ssml);
  const chunks: Buffer[] = [];

  return new Promise<NextResponse>((resolve) => {
    readable.audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    readable.audioStream.on('end', () => {
      const audioBuffer = Buffer.concat(chunks);
      resolve(
        new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=604800, immutable',
          },
        })
      );
    });
    readable.audioStream.on('error', (err: Error) => {
      console.error('TTS Stream Error:', err);
      resolve(NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 }));
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Basic Security: Check referer or sec-fetch-site
    const secFetchSite = req.headers.get('sec-fetch-site');
    if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site') {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }

    // Rate limiting durable : 30 requêtes/min par IP
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { text, arabicText, voice, speed } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    const ttsVoice: TtsVoice = voice === 'male' ? 'male' : 'female';
    const ttsSpeed: TtsSpeed = speed === 'slow' ? 'slow' : 'normal';

    return await synthesize(text, arabicText, ttsVoice, ttsSpeed);
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const secFetchSite = req.headers.get('sec-fetch-site');
    if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site') {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }

    // Rate limiting durable : 30 requêtes/min par IP
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const arabicText = searchParams.get('arabicText') || undefined;
    const voiceParam = searchParams.get('voice');
    const speedParam = searchParams.get('speed');

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    const ttsVoice: TtsVoice = voiceParam === 'male' ? 'male' : 'female';
    const ttsSpeed: TtsSpeed = speedParam === 'slow' ? 'slow' : 'normal';

    return await synthesize(text, arabicText, ttsVoice, ttsSpeed);
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

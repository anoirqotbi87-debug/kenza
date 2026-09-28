import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { normalizeDarija } from '../../../lib/tts/darijaPhonetics';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

async function synthesize(text: string, arabicText?: string) {
  const textToSpeak = normalizeDarija(text, arabicText);
  const tts = new MsEdgeTTS();
  await tts.setMetadata('ar-MA-JamalNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const readable = tts.toStream(textToSpeak);
  const chunks: Buffer[] = [];

  return new Promise<NextResponse>((resolve) => {
    readable.audioStream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    readable.audioStream.on('end', () => {
      const audioBuffer = Buffer.concat(chunks);
      resolve(new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      }));
    });
    readable.audioStream.on('error', (err: any) => {
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

    // Rate limiting durable : 30 requêtes/min par IP (audit #5)
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const { text, arabicText } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    return await synthesize(text, arabicText);
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

    // Rate limiting durable : 30 requêtes/min par IP (audit #5)
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 30, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const arabicText = searchParams.get('arabicText') || undefined;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    return await synthesize(text, arabicText);
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

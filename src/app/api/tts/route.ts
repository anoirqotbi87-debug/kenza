import { NextRequest, NextResponse } from 'next/server';
import { normalizeDarija } from '@/lib/tts/darijaPhonetics';
import { buildSsml, TtsVoice, TtsSpeed } from '@/lib/tts/ssml';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/allowedOrigins';
import { extractCleanArabicForTts } from '@/lib/ai/parseAiMessage';

import { synthesizeEdgeTts } from '@/lib/tts/synthesizeEdgeTts';

import { prepareDarijaForTts } from '@/lib/tts/darijaPhonetic';

export type TTSRequest = {
  text: string;
  voice?: 'female' | 'male';
  speed?: 'normal' | 'slow';
  arabicText?: string;
};

async function synthesize(
  text: string,
  arabicText?: string,
  voice: TtsVoice = 'female',
  speed: TtsSpeed = 'normal'
) {
  try {
    const rawToProcess = arabicText?.trim() || text;
    const normalizedPhonetic = prepareDarijaForTts(rawToProcess);
    const textToSpeak = normalizeDarija(normalizedPhonetic, normalizedPhonetic);
    const { ssml } = buildSsml(textToSpeak, voice, speed);

    const audioBuffer = await synthesizeEdgeTts(ssml);

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
      },
    });
  } catch (err) {
    console.error('Edge TTS Synthesis Setup Error:', err);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const secFetchSite = req.headers.get('sec-fetch-site');

    if (!origin && !referer && !secFetchSite) {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site') {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (referer) {
      try {
        const refUrl = new URL(referer);
        if (!isAllowedOrigin(refUrl.origin)) return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
      } catch {
        return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
      }
    }
    // Rate limiting durable : 120 requêtes/min par IP (conversation fluide sans blocage)
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 120, 60 * 1000);
    if (rate.error) {
      return NextResponse.json({ error: 'SERVICE_UNAVAILABLE' }, { status: 503 });
    }
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { text, arabicText, voice, gender, speed } = body;
    const normalizedArabic = typeof arabicText === 'string' && arabicText.trim().length > 0
      ? arabicText.trim()
      : undefined;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    const isMale = gender === 'male' || voice === 'male' || voice === 'ar-MA-JamalNeural';
    const isFemale = gender === 'female' || voice === 'female' || voice === 'ar-MA-MounaNeural';
    const ttsVoice: TtsVoice = isMale ? 'male' : (isFemale ? 'female' : 'male');
    const ttsSpeed: TtsSpeed = speed === 'slow' ? 'slow' : 'normal';

    return await synthesize(text, normalizedArabic, ttsVoice, ttsSpeed);
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const secFetchSite = req.headers.get('sec-fetch-site');

    if (!origin && !referer && !secFetchSite) {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site') {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
    }
    if (referer) {
      try {
        const refUrl = new URL(referer);
        if (!isAllowedOrigin(refUrl.origin)) return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
      } catch {
        return NextResponse.json({ error: 'UNAUTHORIZED_ORIGIN' }, { status: 403 });
      }
    }

    // Rate limiting durable : 120 requêtes/min par IP (conversation fluide sans blocage)
    const rate = await checkRateLimit(`tts:ip:${getClientIp(req)}`, 120, 60 * 1000);
    if (rate.error) {
      return NextResponse.json({ error: 'SERVICE_UNAVAILABLE' }, { status: 503 });
    }
    if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const arabicText = searchParams.get('arabicText') || undefined;
    const voiceParam = searchParams.get('voice');
    const genderParam = searchParams.get('gender');
    const speedParam = searchParams.get('speed');
    const normalizedArabic = typeof arabicText === 'string' && arabicText.trim().length > 0
      ? arabicText.trim()
      : undefined;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'INVALID_TEXT' }, { status: 400 });
    }
    if (text.length > 300) {
      return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    const isMale = genderParam === 'male' || voiceParam === 'male' || voiceParam === 'ar-MA-JamalNeural';
    const isFemale = genderParam === 'female' || voiceParam === 'female' || voiceParam === 'ar-MA-MounaNeural';
    const ttsVoice: TtsVoice = isMale ? 'male' : (isFemale ? 'female' : 'male');
    const ttsSpeed: TtsSpeed = speedParam === 'slow' ? 'slow' : 'normal';

    return await synthesize(text, normalizedArabic, ttsVoice, ttsSpeed);
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'TTS_GENERATION_FAILED' }, { status: 500 });
  }
}

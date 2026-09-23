import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Fonction de conversion Arabizi -> Arabe pour que l'IA prononce la Darija
function arabiziToArabic(text: string): string {
  return text
    .replace(/3/g, 'ع')
    .replace(/7/g, 'ح')
    .replace(/9/g, 'ق')
    .replace(/kh/gi, 'خ')
    .replace(/gh/gi, 'غ');
}

export async function POST(req: NextRequest) {
  try {
    const { text, arabicText } = await req.json();
    const textToSpeak = arabicText || arabiziToArabic(text);

    const tts = new MsEdgeTTS();
    await tts.setMetadata('ar-MA-JamalNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const readable = tts.toStream(textToSpeak);
    const chunks: Buffer[] = [];

    return new Promise<NextResponse>((resolve, reject) => {
      readable.audioStream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
      readable.audioStream.on('end', () => {
        const audioBuffer = Buffer.concat(chunks);
        resolve(new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        }));
      });
      readable.audioStream.on('error', (err: any) => {
        console.error('TTS Stream Error:', err);
        reject(NextResponse.json({ error: 'TTS Error' }, { status: 500 }));
      });
    });
  } catch (error) {
    console.error('API TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}

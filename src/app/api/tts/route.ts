import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Dictionnaire d'optimisation phonétique marocaine (Tashkeel)
const DARIJA_PHONETIC_MAP: Record<string, string> = {
  '3afak': 'عَافَاكْ',
  'afak': 'عَافَاكْ',
  'salam': 'السَّلَامُ عَلَيْكُمْ',
  'sba7 l-khir': 'صْبَاحْ الخِيرْ',
  'mmsa l-khir': 'مسَا الخِيرْ',
  'shukran': 'شُكْرًا',
  'lahetek saha': 'اللَّهْ يَعْطِيكْ الصَّحَّة',
  'bessaha': 'بَالصَّحَّة',
  'tbarkellah': 'تْبَارْكَ اللَّهْ',
  'hchouma': 'حْشُومَة',
  'kif dayer': 'كِيفْ دَايِرْ',
  'kif dayra': 'كِيفْ دَايْرَة',
  'labas': 'لَابَاسْ',
  'hamdullah': 'الحَمْدُ للَّه',
  '9hwa': 'قَهْوَة',
  'atay': 'أَتَايْ',
  'lma': 'المَا',
  '3asir': 'عَصِيرْ',
  'khobz': 'خُبْزْ',
  'sukkar': 'سُكَّارْ',
  'bla sekkar': 'بْلَا سُكَّارْ',
  'bzzaf': 'بْزَّافْ',
  'shwiya': 'شْوِيَّة',
  'flus': 'فْلُوسْ',
  'sarf': 'الصَّرْفْ',
  'l-hsab': 'الحْسَابْ',
  'sh7al hada': 'شْحَالْ هَادَا',
  'ghali': 'غَالِي',
  'nqess shwiya': 'نْقَّصْ شْوِيَّة',
  'dor 3la limen': 'دُورْ عَلَى لِيمِينْ',
  'dor 3la lisir': 'دُورْ عَلَى لِيسِيرْ',
  'khdem l-kuntur': 'خَدَّمْ الكُونْتُورْ',
  'korsa': 'كُورْسَا',
  'taxi': 'طَاكْسِي',
  'bghit': 'بْغِيتْ',
  'ma-bghit-ch': 'مَا بْغِيتْشْ',
  'mzyan': 'مْزْيَانْ',
  'zwin': 'زْوِينْ',
  'daba': 'دَابَا',
  'ghedda': 'غَدًّا',
  'l-bare7': 'البَارِحْ',
  'chkun': 'شْكُونْ',
  'fin': 'فِينْ',
  'wakha': 'وَاخَّا',
  'iyeh': 'إِيِّيهْ',
  'lla': 'لَّا',
  'chaf': 'شَافْ',
  'choft': 'شُفْتْ',
  'gal': 'قَالْ',
  'guelt': 'قُلْتْ',
  'mcha': 'مْشَى',
  'mchit': 'مْشِيتْ',
  'lli fat mat': 'اللِّي فَاتْ مَاتْ',
  'drba b drba kat-bna d-dar': 'ضَرْبَة بْضَرْبَة كَتْبْنَى الدَّارْ',
  'zrbat matat': 'زَرْبَاتْ مَاتَتْ',
};

function normalizeDarija(text: string, arabicText?: string): string {
  if (arabicText && arabicText.trim()) return arabicText;
  const cleanKey = text.toLowerCase().trim().replace(/['"-]/g, '');
  if (DARIJA_PHONETIC_MAP[cleanKey]) {
    return DARIJA_PHONETIC_MAP[cleanKey];
  }
  // Conversion caractère par caractère si hors dictionnaire
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
    const textToSpeak = normalizeDarija(text, arabicText);

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

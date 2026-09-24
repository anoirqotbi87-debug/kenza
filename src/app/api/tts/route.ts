import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// Dictionnaire d'optimisation phonétique marocaine (Tashkeel)
const DARIJA_PHONETIC_MAP: Record<string, string> = {
  'salam': 'السَّلَامُ عَلَيْكُمْ',
  'sba7 l-khir': 'صْبَاحْ الخِيرْ',
  'msa l-khir': 'مسَا الخِيرْ',
  'labas': 'لَابَاسْ',
  'kif dayer': 'كِيفْ دَايِرْ',
  'kif dayra': 'كِيفْ دَايْرَة',
  'hamdullah': 'الحَمْدُ للَّه',
  'shukran': 'شُكْرًا',
  '3afak': 'عَافَاكْ',
  'afak': 'عَافَاكْ',
  'smahli': 'سْمَحْ لِي',
  'bessaha': 'بَالصَّحَّة',
  'lahetek saha': 'اللَّهْ يَعْطِيكْ الصَّحَّة',
  'tbarkellah': 'تْبَارْكَ اللَّهْ',
  'bslama': 'بْسْلَامَة',
  'merhba': 'مَرْحْبَا',
  'wakha': 'وَاخَّا',
  'iyeh': 'إِيِّيهْ',
  'lla': 'لَّا',
  'hchouma': 'حْشُومَة',
  'mashi moshkil': 'مَاشِي مُشْكِيلْ',
  'atay': 'أَتَايْ',
  '9hwa': 'قَهْوَة',
  '9hwa nss-nss': 'قَهْوَة نُصْ نُصْ',
  'lma': 'المَا',
  'lma skhoun': 'المَا سْخُونْ',
  'lma bared': 'المَا بَارِدْ',
  '3asir': 'عَصِيرْ',
  'khobz': 'خُبْزْ',
  'sukkar': 'سُكَّارْ',
  'bla sekkar': 'بْلَا سُكَّارْ',
  'bghit': 'بْغِيتْ',
  'ma-bghit-ch': 'مَا بْغِيتْشْ',
  'l-hsab': 'الحْسَابْ',
  'ftour': 'فْطُورْ',
  'ghdha': 'غْدَا',
  '3sha': 'عْشَا',
  'tajine': 'طَاجِينْ',
  'zit zitoun': 'زِيتْ زِيتُونْ',
  'm3elqa': 'مْعَلْقَة',
  'farshita': 'فَرْشِيطَة',
  'korsa': 'كُورْسَا',
  'khdem l-kuntur': 'خَدَّمْ الكُونْتُورْ',
  'dor 3la limen': 'دُورْ عَلَى لِيمِينْ',
  'dor 3la lisir': 'دُورْ عَلَى لِيسِيرْ',
  'sir nishan': 'سِيرْ نِيشَانْ',
  'wqef hna': 'وقَفْ هْنَا',
  'l-ma7etta': 'المَحَطَّة',
  'l-matar': 'المَطَارْ',
  'bab': 'بَابْ',
  'zanqa': 'زَنْقَة',
  'medina qdima': 'المَدِينَة القْدِيمَة',
  'qrib': 'قْرِيبْ',
  'b3id': 'بْعِيدْ',
  'fin ghadi': 'فِينْ غَادِي',
  'wsel-na': 'وْصَلْنَا',
  'sh7al hada': 'شْحَالْ هَادَا',
  'ghali bzzaf': 'غَالِي بْزَّافْ',
  'nqess shwiya': 'نْقَّصْ شْوِيَّة',
  'flus': 'فْلُوسْ',
  'sarf': 'الصَّرْفْ',
  'akher taman': 'آخِرْ تَمَانْ',
  'zwin': 'زْوِينْ',
  'zwina': 'زْوِينَة',
  'kbir': 'كْبِيرْ',
  'sghir': 'صْغِيرْ',
  'zerbiya': 'زَرْبِيَّة',
  'belgha': 'بَلْغَة',
  'jellaba': 'جَلَّابَة',
  'chri-t': 'شْرِيتْ',
  'baraka': 'بَرَكَة',
  'dar': 'دَارْ',
  'riad': 'رِيَاضْ',
  'bit': 'بِيتْ',
  'sarout': 'سَارُوتْ',
  'l-kra': 'الكْرَا',
  'dman': 'الضْمَانْ',
  'moul d-dar': 'مُولْ الدَّارْ',
  'l-berd': 'البَرْدْ',
  's-skhona': 'السّْخُونَة',
  's-stah': 'السّْطَحْ',
  'l-moushkil': 'المُشْكِيلْ',
  'kheddam': 'خَدَّامْ',
  'khaser': 'خَاسِرْ',
  'nqi': 'نْقِي',
  'moussek': 'مْوَسَّخْ',
  'farmasiyan': 'فَرْمَسْيَانْ',
  'tbib': 'طْبِيبْ',
  'sbitar': 'سْبِيطَارْ',
  '3awenni': 'عَاوْنِّي',
  'd-dwa': 'الدّْوَا',
  'darni rasi': 'ضَرْنِي رَاسِي',
  'l-krash': 'الكْرْشْ',
  'bolis': 'البُولِيسْ',
  'daba': 'دَابَا',
  'ghedda': 'غَدًّا',
  'l-bare7': 'البَارِحْ',
  'shwiya': 'شْوِيَّة',
  'bzzaf': 'بْزَّافْ',
  'waqt': 'وَقْتْ',
  'mzyan': 'مْزْيَانْ',
  'chkun': 'شْكُونْ',
  'fin': 'فِينْ',
  'chaf': 'شَافْ',
  'choft': 'شُفْتْ',
  'gal': 'قَالْ',
  'guelt': 'قُلْتْ',
  'mcha': 'مْشَى',
  'mchit': 'مْشِيتْ',
  'lli fat mat': 'اللِّي فَاتْ مَاتْ',
  'drba b drba kat-bna d-dar': 'ضَرْبَة بْضَرْبَة كَتْبْنَى الدَّارْ',
  'zrbat matat': 'زَرْبَاتْ مَاتَتْ'
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

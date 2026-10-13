export const DARIJA_PHONETIC_MAP: Record<string, string> = {
  'salam': 'السّْلامْ',
  'sba7 l-khir': 'صْباح الخير',
  'msa l-khir': 'مْسا الخير',
  'labas': 'لاباس',
  'kif dayer': 'كيف داير',
  'kif dayra': 'كيف دايرة',
  'hamdullah': 'الحمد لله',
  'shukran': 'شُكْراً',
  '3afak': 'عافاك',
  'afak': 'عافاك',
  'smahli': 'سمح لي',
  'bessaha': 'بالصّحّة',
  'lahetek saha': 'الله يعطيك الصّحّة',
  'tbarkellah': 'تبارك الله',
  'bslama': 'بْسْلامة',
  'merhba': 'مْرحبا',
  'wakha': 'واخّا',
  'iyeh': 'إييه',
  'lla': 'لّا',
  'hchouma': 'حشومة',
  'mashi moshkil': 'ماشي مُشكل',
  'atay': 'أتاي',
  '9hwa': 'قْهوة',
  '9hwa nss-nss': 'قْهوة نص نص',
  'lma': 'لما',
  'lma skhoun': 'لما سخون',
  'lma bared': 'لما بارد',
  '3asir': 'عصير',
  'khobz': 'خْبز',
  'sukkar': 'سُكّر',
  'bla sekkar': 'بلا سكّر',
  'bghit': 'بغيت',
  'ma-bghit-ch': 'ما بغيتش',
  'l-hsab': 'لحساب',
  'ftour': 'فطور',
  'ghdha': 'غدا',
  '3sha': 'عشا',
  'tajine': 'طاجين',
  'zit zitoun': 'زيت زيتون',
  'm3elqa': 'معلقة',
  'farshita': 'فرشيطة',
  'korsa': 'كرصة',
  'khdem l-kuntur': 'خدم لكونتور',
  'dor 3la limen': 'دور على ليمن',
  'dor 3la lisir': 'دور على ليسير',
  'sir nishan': 'سير نيشان',
  'wqef hna': 'وقف هنا',
  'l-ma7etta': 'لمحطّة',
  'l-matar': 'لمطار',
  'bab': 'باب',
  'zanqa': 'زنقة',
  'medina qdima': 'مدينة قديمة',
  'qrib': 'قريب',
  'b3id': 'بعيد',
  'fin ghadi': 'فين غادي',
  'wsel-na': 'وصلنا',
  'sh7al hada': 'شحال هادا',
  'ghali bzzaf': 'غالي بزّاف',
  'nqess shwiya': 'نقص شويّة',
  'flus': 'فلوس',
  'sarf': 'صرف',
  'akher taman': 'آخر ثمن',
  'zwin': 'زوين',
  'zwina': 'زوينة',
  'kbir': 'كبير',
  'sghir': 'صغير',
  'zerbiya': 'زربيّة',
  'belgha': 'بلغة',
  'jellaba': 'جلابة',
  'chri-t': 'شريت',
  'baraka': 'باراكا',
  'dar': 'دار',
  'riad': 'رياض',
  'bit': 'بيت',
  'sarout': 'ساروت',
  'l-kra': 'لكرا',
  'dman': 'ضمان',
  'moul d-dar': 'مول الدار',
  'l-berd': 'لبرد',
  's-skhona': 'السخونة',
  's-stah': 'السطح',
  'l-moushkil': 'المشكل',
  'kheddam': 'خدّام',
  'khaser': 'خاسر',
  'nqi': 'نقي',
  'moussek': 'موسّخ',
  'farmasiyan': 'فرماسيان',
  'tbib': 'طبيب',
  'sbitar': 'صبيطار',
  '3awenni': 'عاوني',
  'd-dwa': 'الدوا',
  'darni rasi': 'ضرني راسي',
  'l-krash': 'الكرش',
  'bolis': 'بوليس',
  'daba': 'دابا',
  'ghedda': 'غدّا',
  'l-bare7': 'لبارح',
  'shwiya': 'شويّة',
  'bzzaf': 'بزّاف',
  'waqt': 'وقت',
  'mzyan': 'مزيان',
  'chkun': 'شكون',
  'fin': 'فين',
  'chaf': 'شاف',
  'choft': 'شفت',
  'gal': 'گال',
  'guelt': 'گلت',
  'mcha': 'مشى',
  'mchit': 'مشيت',
  'lli fat mat': 'لّي فات مات',
  'drba b drba kat-bna d-dar': 'دربا ب دربا كتبنى الدار',
  'zrbat matat': 'زربات ماتت'
};

// Lettres solaires en arabe pour l'assimilation phonétique de l'article 'الـ'
const SOLAR_LETTERS = new Set(['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن']);

/**
 * Nettoie et vocalise le texte arabe pour forcer une prononciation marocaine authentique dans Edge TTS :
 * - Retire les désinences de l'arabe classique (Tanween, voyelles finales inutiles qui créent un ton livresque)
 * - Assimile phonétiquement l'article 'الـ' devant les lettres solaires (ex: 'الشمس' -> 'اشّمس')
 * - Évite les diphtongues étirées de l'arabe littéraire en plaçant les bons Sukūn et Chadda
 */
export function sanitizeArabicForDarijaTts(arabic: string): string {
  if (!arabic) return '';

  const res = arabic
    // 1. Suppression des Tanween (arabe classique absent en Darija)
    .replace(/[\u064B\u064C\u064D]/g, '')
    // 2. Remplacement des ponctuations ou artefacts
    .replace(/[«»""'']/g, '')
    .trim();

  // 3. Assimilation solaire phonétique pour le TTS marocain :
  // En Darija, 'الـ' devant une lettre solaire ne se prononce JAMAIS avec un 'L'.
  // Ex: 'الرّاس' se prononce 'أرّاس' ou 'رّاس', 'السّلام' se prononce 'أسّلام'.
  // Pour forcer Edge TTS à ne pas lire la consonne 'ل', on transforme 'ال' + lettre solaire en 'ا' + lettre + chadda si absente.
  const words = res.split(/\s+/);
  const transformedWords = words.map((w) => {
    // Mot commençant par 'ال' (avec ou sans voyelle sur l'alif)
    const match = w.match(/^([إأاٱ]ل)([\u0621-\u064A])(.*)$/);
    if (match) {
      const secondLetter = match[2];
      if (SOLAR_LETTERS.has(secondLetter)) {
        const rest = match[3];
        const hasShadda = rest.startsWith('\u0651'); // Chadda déjà présente
        return `ا${secondLetter}${hasShadda ? '' : 'ّ'}${rest}`;
      }
    }
    return w;
  });

  return transformedWords.join(' ');
}

/**
 * Normalise une chaîne (Arabizi ou Arabe) en Arabe Darija optimisé phonétiquement pour la synthèse vocale.
 */
export function normalizeDarija(text: string, arabicText?: string): string {
  // 1. Priorité au texte arabe fourni s'il est présent
  if (arabicText && arabicText.trim()) {
    return sanitizeArabicForDarijaTts(arabicText);
  }

  const cleanKey = text.toLowerCase().trim().replace(/['"-]/g, '');
  if (DARIJA_PHONETIC_MAP[cleanKey]) {
    return sanitizeArabicForDarijaTts(DARIJA_PHONETIC_MAP[cleanKey]);
  }

  // Si le texte est déjà principalement en alphabet arabe, le nettoyer phonétiquement
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  if (hasArabic) {
    return sanitizeArabicForDarijaTts(text);
  }

  // 2. Conversion Arabizi mot-à-mot puis caractère par caractère
  const words = text.toLowerCase().trim().split(/\s+/);
  const mappedWords = words.map((word) => {
    const cleanWord = word.replace(/['"-]/g, '');
    if (DARIJA_PHONETIC_MAP[cleanWord]) {
      return DARIJA_PHONETIC_MAP[cleanWord];
    }
    return word
      .replace(/3/g, 'ع')
      .replace(/7/g, 'ح')
      .replace(/9/g, 'ق')
      .replace(/5/g, 'خ')
      .replace(/kh/gi, 'خ')
      .replace(/gh/gi, 'غ');
  });

  return sanitizeArabicForDarijaTts(mappedWords.join(' '));
}

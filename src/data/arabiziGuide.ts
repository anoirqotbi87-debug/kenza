/**
 * Mini-Guide Phonétique des Chiffres Arabizi.
 *
 * Source de vérité des 5 chiffres indispensables du Darija écrit :
 * `2`, `3`, `5` (ou `kh`)`,`7`, `9`. Chaque son est accompagné d'une
 * explication anatomique, respectivement d'exemples vocalisés (chakl complet)
 * pour l'entraînement auditif dual-speed (`/api/tts` : 1.0x normal, 🐢 0.75x).
 */
export interface ArabiziSound {
  number: '2' | '3' | '5' | '7' | '9';
  arabicLetter: string;
  name: string;
  anatomicalTip: string;
  examples: Array<{
    arabizi: string;
    arabicWithTashkeel: string;
    french: string;
  }>;
}

export const ARABIZI_GUIDE: ArabiziSound[] = [
  {
    number: '2',
    arabicLetter: 'ء / ق',
    name: 'Hamza',
    anatomicalTip: "Coup de glotte bref et sec, comme l'arrêt entre les deux 'o' de 'coopération'.",
    examples: [
      { arabizi: 'La2', arabicWithTashkeel: 'لَاأْ', french: 'Non (variante adoucie)' },
      { arabizi: 'Dqi2a', arabicWithTashkeel: 'دْقِيقَة', french: 'Une minute' },
    ],
  },
  {
    number: '3',
    arabicLetter: 'ع',
    name: 'Ayn',
    anatomicalTip: "Consonne pharyngale sonore émise en serrant le fond de la gorge, comme chez le médecin lorsqu'on dit 'Ah'.",
    examples: [
      { arabizi: '3afak', arabicWithTashkeel: 'عَفَاكْ', french: "S'il te plaît" },
      { arabizi: 'M3a', arabicWithTashkeel: 'مْعَا', french: 'Avec' },
      { arabizi: '3la rass', arabicWithTashkeel: 'عْلَى الرَّاسْ', french: 'Avec grand plaisir' },
    ],
  },
  {
    number: '5',
    arabicLetter: 'خ',
    name: 'Kha (ou kh)',
    anatomicalTip: "Fricative uvulaire sourde, semblable au 'j' espagnol dans 'Juan' ou au 'ch' allemand dans 'Bach'.",
    examples: [
      { arabizi: 'Khoya', arabicWithTashkeel: 'خُويَا', french: 'Mon frère' },
      { arabizi: 'Khobz', arabicWithTashkeel: 'خُبْزْ', french: 'Pain' },
    ],
  },
  {
    number: '7',
    arabicLetter: 'ح',
    name: 'Hha',
    anatomicalTip: "Souffle chaud et profond de la gorge, exactement comme pour faire de la buée sur une vitre en hiver.",
    examples: [
      { arabizi: '7bibi', arabicWithTashkeel: 'حْبِيبِي', french: 'Mon ami / cher' },
      { arabizi: 'L-7amdullah', arabicWithTashkeel: 'الحَمْدُ للّٰه', french: 'Dieu merci' },
      { arabizi: 'Sba7 l-khir', arabicWithTashkeel: 'صْبَاحْ الخِيرْ', french: 'Bonjour (matin)' },
    ],
  },
  {
    number: '9',
    arabicLetter: 'ق',
    name: 'Qaf',
    anatomicalTip: "Claquement sec et sourd au fond du palais, plus en arrière que le son 'K' français.",
    examples: [
      { arabizi: 'Qahwa', arabicWithTashkeel: 'قَهْوَة', french: 'Café' },
      { arabizi: 'Qrib', arabicWithTashkeel: 'قْرِيبْ', french: 'Proche' },
    ],
  },
];
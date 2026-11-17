export interface SpeedChallengePhrase {
  id: string;
  arabic: string;
  arabizi: string;
  translation: string;
  expectedKeywords: string[];
  timeLimit: number; // Durée allouée en secondes
  xpReward?: number;
}

export const SPEED_CHALLENGE_PHRASES: SpeedChallengePhrase[] = [
  {
    id: 'phrase_1',
    arabic: 'أَشْ كَاتْعَاوْدْ ؟',
    arabizi: 'Ash kat3awed ?',
    translation: 'Quoi de neuf ? / Comment vas-tu ?',
    expectedKeywords: ['kat3awed', 'ash', 'كاتعاود', 'اش', 'kat3awd', '3awed'],
    timeLimit: 5,
    xpReward: 10,
  },
  {
    id: 'phrase_2',
    arabic: 'دَابَا نْجِي، وَاحْدْ الدّْقِيقَة.',
    arabizi: 'Daba nji, wa7ed d-dqiqa.',
    translation: "J'arrive tout de suite, une minute.",
    expectedKeywords: ['daba', 'nji', 'dqiqa', 'wahed', 'wa7ed', 'دابا', 'نجي', 'دقيقة'],
    timeLimit: 6,
    xpReward: 10,
  },
  {
    id: 'phrase_3',
    arabic: 'سِيرْ نِيشَانْ وْ ضُوَّرْ عَلَى لِيمِينْ.',
    arabizi: 'Sir nichan w dowwer 3la limin.',
    translation: 'Va tout droit et tourne à droite.',
    expectedKeywords: ['sir', 'nichan', 'dowwer', 'limin', 'سير', 'نيشان', 'يمين', 'ضور'],
    timeLimit: 6,
    xpReward: 10,
  },
  {
    id: 'phrase_4',
    arabic: 'عَافَاكْ شْحَالْ هَادْ الشِّي كَامِلْ ؟',
    arabizi: '3afak ch7al had chi kamel ?',
    translation: "S'il vous plaît, combien coûte tout cela ?",
    expectedKeywords: ['3afak', 'ch7al', 'kamel', 'had chi', 'عافاك', 'شحال', 'كامل', 'chi'],
    timeLimit: 5,
    xpReward: 10,
  },
  {
    id: 'phrase_5',
    arabic: 'اللهْ يْعْطِيكْ الصَّحَّة، بْسْلَامَة !',
    arabizi: 'Allah y3tik s-se77a, bslama !',
    translation: 'Que Dieu te donne la santé, au revoir !',
    expectedKeywords: ['allah', 'y3tik', 'se77a', 'bslama', 'الله', 'يعطيك', 'صحة', 'سلامة'],
    timeLimit: 5,
    xpReward: 15,
  },
];

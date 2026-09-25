import { DialogueScenario } from '../../types/dialogue';

export const soukFesScenario: DialogueScenario = {
  id: 'soukFes',
  title: 'Négociation au Souk / F-S-Souq',
  category: 'souk',
  location: 'Fès - Médina',
  level: 'A2',
  turns: [
    {
      id: 'turn_1',
      speaker: 'bot',
      speakerRole: 'Marchand',
      arabicText: 'مَرْحْبَا بِيك أ خُويَا ! دْخُلْ تْفَرَّجْ، كُلْشِي زْوِينْ',
      arabiziText: 'Mre7ba bik a khoya ! Dkhol tferrej, kolchi zwin.',
      translationFr: 'Bienvenue mon frère ! Entre regarder, tout est beau.',
      audioKey: 'mre7ba_dkhol_tferrej'
    },
    {
      id: 'turn_2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'بْشْحَالْ هَادْ البَرَّادْ دْ النْحَاسْ عَفَاك ؟',
      arabiziText: 'Bch7al had l-berrad d-n-n7as 3afak ?',
      translationFr: "Combien coûte cette théière en cuivre s'il vous plaît ?",
      expectedPhrases: {
        primaryArabizi: 'Bch7al had l-berrad d-n-n7as 3afak',
        primaryArabic: 'بشحال هاد البراد د النحاس عفاك',
        acceptedVariants: ['bch7al had lberrad 3afak', 'bch7al lberrad dn7as', 'bch7al hadchi 3afak'],
        hints: ['bch7al', 'lberrad', 'dn7as']
      }
    },
    {
      id: 'turn_3',
      speaker: 'bot',
      speakerRole: 'Marchand',
      arabicText: 'هَادَاك نْحَاسْ حُرّْ دْ فَاسْ، كَانْحْسْبُو بْ مْيَاتَيْنْ دَرْهَم',
      arabiziText: 'Hadak n7as 7orr d-Fas, kan7esbo b-myatayn derhem.',
      translationFr: "C'est du vrai cuivre de Fès, je le fais à 200 dirhams.",
      audioKey: 'n7as_7orr_200_derhem'
    },
    {
      id: 'turn_4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'غَالِي شْوِيَا أ خُويَا، نْقَّصْ لِيَا، نْعْطِيكْ مْيَة وْ خَمْسِينْ',
      arabiziText: 'Ghali chwiya a khoya, nqess liya, n3tik mya w khemsin.',
      translationFr: "C'est un peu cher mon frère, baisse un peu, je vous donne 150.",
      expectedPhrases: {
        primaryArabizi: 'Ghali chwiya a khoya, nqess liya, n3tik mya w khemsin',
        primaryArabic: 'غالي شويا أ خويا، نقص ليا، نعطيك مية و خمسين',
        acceptedVariants: ['ghali chwiya n3tik mya w khemsin', 'nqess liya chwiya', 'n3tik 150 derhem'],
        hints: ['ghali', 'nqess', 'n3tik mya w khemsin']
      }
    },
    {
      id: 'turn_5',
      speaker: 'bot',
      speakerRole: 'Marchand',
      arabicText: 'صَافِي، بْرْبَّاحْ، نْخَلِّيهْ لِيكْ بْ مْيَة وْ خَمْسِينْ حِيتْ 3جْبْتِينِي',
      arabiziText: 'Safi, b-r-rba7, nkhellih lik b-mya w khemsin 7it 3jebtini.',
      translationFr: "D'accord, c'est une affaire, je te le laisse à 150 parce que tu es sympathique.",
      audioKey: 'safi_150_7it_3jebtini'
    },
    {
      id: 'turn_6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'شُكْرًا بْزَّافْ، الله يْخَلْفْ، بْسْلَامَة',
      arabiziText: 'Chokran bezzaf, llah ykhelef, bslama !',
      translationFr: 'Merci beaucoup, que Dieu te récompense, au revoir !',
      expectedPhrases: {
        primaryArabizi: 'Chokran bezzaf, llah ykhelef, bslama',
        primaryArabic: 'شكرا بزاف، الله يخلف، بسلامة',
        acceptedVariants: ['chokran bezzaf bslama', 'llah ykhelef bslama', 'chokran bslama'],
        hints: ['chokran', 'llah ykhelef', 'bslama']
      }
    }
  ]
};

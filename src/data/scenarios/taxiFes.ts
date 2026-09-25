import { DialogueScenario } from '../../types/dialogue';

export const taxiFesScenario: DialogueScenario = {
  id: 'taxiFes',
  title: 'Le Petit Taxi vers Bab Boujloud',
  category: 'transport',
  location: 'Fès',
  level: 'A1',
  turns: [
    {
      id: 'turn_1',
      speaker: 'bot',
      speakerRole: 'Chauffeur',
      arabicText: 'السلام ! فين غادِي ؟',
      arabiziText: 'Salam ! Fin ghadi ?',
      translationFr: 'Bonjour ! Où vas-tu ?',
      audioKey: 'salam_fin_ghadi' // Clé pour la synthèse vocale ou l'audio pré-enregistré
    },
    {
      id: 'turn_2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'بَاب بُوجْلُود عَفَاك',
      arabiziText: 'Bab Boujloud 3afak.',
      translationFr: "À Bab Boujloud s'il vous plaît.",
      expectedPhrases: {
        primaryArabizi: 'Bab Boujloud 3afak',
        primaryArabic: 'باب بوجلود عفاك',
        acceptedVariants: ['l-bab boujloud', 'bab boujloud', 'bab boujloud 3afak'],
        hints: ['Bab Boujloud', '3afak']
      }
    },
    {
      id: 'turn_3',
      speaker: 'bot',
      speakerRole: 'Chauffeur',
      arabicText: 'مَرْحْبَا، طْلَعْ !',
      arabiziText: 'Mre7ba, tle3 !',
      translationFr: 'Bienvenue, monte !',
      audioKey: 'mre7ba_tle3'
    },
    {
      id: 'turn_4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'خَدَّم الكُونْتُور عَفَاك',
      arabiziText: 'Kheddem l-kountour 3afak.',
      translationFr: "Mettez le compteur s'il vous plaît.",
      expectedPhrases: {
        primaryArabizi: 'Kheddem l-kountour 3afak',
        primaryArabic: 'خدم الكونتور عفاك',
        acceptedVariants: ['kheddem kountour', 'kheddem lkountour', 'kheddem l-kountour 3afak', 'kheddm lkountour'],
        hints: ['kheddem', 'kountour']
      }
    },
    {
      id: 'turn_5',
      speaker: 'bot',
      speakerRole: 'Chauffeur',
      arabicText: 'هَا حْنَا وصَلْنَا، طْنْعَاش دَرْهَم',
      arabiziText: 'Ha 7na wselna, tne3ch derhem.',
      translationFr: 'Nous voilà arrivés, 12 dirhams.',
      audioKey: 'ha_7na_wselna_12_derhem'
    },
    {
      id: 'turn_6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'هَاك، شُكْرًا بْزَّاف، بْسْلَامَة',
      arabiziText: 'Hak, chokran bezzaf, bslama !',
      translationFr: 'Tiens, merci beaucoup, au revoir !',
      expectedPhrases: {
        primaryArabizi: 'Hak, chokran bezzaf, bslama',
        primaryArabic: 'هاك، شكرا بزاف، بسلامة',
        acceptedVariants: ['hak chokran bslama', 'chokran bezzaf bslama', 'hak chokran bezzaf'],
        hints: ['hak', 'chokran bezzaf', 'bslama']
      }
    }
  ]
};

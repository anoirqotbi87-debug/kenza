import { DialogueScenario } from '../../types/dialogue';

export const cafeFesScenario: DialogueScenario = {
  id: 'cafeFes',
  title: 'Au Café Populaire / F-L-Gahwa',
  category: 'restaurant',
  location: 'Fès - Ville Nouvelle',
  level: 'A1',
  turns: [
    {
      id: 'turn_1',
      speaker: 'bot',
      speakerRole: 'Serveur',
      arabicText: 'السَّلَامُ عَلَيْكُم ! آشْ حَبّْ الخَاطْرْ أ سِيدِي ؟',
      arabiziText: 'Salamu 3alaykom ! Ach 7abb l-khatr a sidi ?',
      translationFr: 'Bonjour ! Que désirez-vous monsieur ?',
      audioKey: 'salam_ach_7abb_lkhatr'
    },
    {
      id: 'turn_2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'عَفَاك، وَاحْدْ أَتَايْ بْنْعْنَاعْ نَاقْصْ سُكَّارْ',
      arabiziText: '3afak, wa7ed atay b-ne3na3 naqes sekkar.',
      translationFr: "S'il vous plaît, un thé à la menthe peu sucré.",
      expectedPhrases: {
        primaryArabizi: '3afak, wa7ed atay b-ne3na3 naqes sekkar',
        primaryArabic: 'عفاك، واحد أتاي بنعناع ناقص سكار',
        acceptedVariants: ['bghit atay naqes sekkar 3afak', 'wa7ed atay bne3na3', 'atay bne3na3 naqes sekkar'],
        hints: ['atay', 'bne3na3', 'naqes sekkar']
      }
    },
    {
      id: 'turn_3',
      speaker: 'bot',
      speakerRole: 'Serveur',
      arabicText: 'وْخَا أ سِيدِي، تْشْرَبْ مْعَاهْ كَاسْ دْ المَا ؟',
      arabiziText: 'Wakha a sidi, tchreb m3ah kas d-l-ma ?',
      translationFr: "D'accord monsieur, vous buvez un verre d'eau avec ?",
      audioKey: 'wakha_kas_dlma'
    },
    {
      id: 'turn_4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'إِيَه، وْ جِيبْ لِيَا الحْسَابْ مَرَّة وَحْدَة عَفَاك',
      arabiziText: 'Iyeh, w jib liya l-7sab merra we7da 3afak.',
      translationFr: "Oui, et apportez-moi l'addition en même temps s'il vous plaît.",
      expectedPhrases: {
        primaryArabizi: 'Iyeh, w jib liya l-7sab merra we7da 3afak',
        primaryArabic: 'إيه، و جيب ليا الحساب مرة وحدة عفاك',
        acceptedVariants: ['iyeh 3afak jib l7sab', 'jib liya l7sab 3afak', 'iyeh jib l7sab'],
        hints: ['iyeh', 'jib', 'l7sab']
      }
    },
    {
      id: 'turn_5',
      speaker: 'bot',
      speakerRole: 'Serveur',
      arabicText: 'هَا هُوَ أَتَايْ سْخُونْ، المَجْمُوعْ سَبْعْتَاشْ دَرْهَم',
      arabiziText: 'Ha howa atay skhoun, l-majmo3 seb3tache derhem.',
      translationFr: 'Voici le thé bien chaud, le total fait 17 dirhams.',
      audioKey: 'atay_skhoun_17_derhem'
    },
    {
      id: 'turn_6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'هَاك عِشْرِينْ دَرْهَم، خَلِّي الصَّرْفْ عَفَاك',
      arabiziText: 'Hak 3achrin derhem, khelli s-sarf 3afak.',
      translationFr: "Voici 20 dirhams, gardez la monnaie s'il vous plaît.",
      expectedPhrases: {
        primaryArabizi: 'Hak 3achrin derhem, khelli s-sarf 3afak',
        primaryArabic: 'هاك عشرين درهم، خلي الصرف عفاك',
        acceptedVariants: ['hak 3achrin khelli ssarf', 'khelli ssarf 3afak', 'hak 20 derhem khelli ssarf'],
        hints: ['hak 3achrin', 'khelli', 'ssarf']
      }
    }
  ]
};

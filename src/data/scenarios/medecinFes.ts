import { DialogueScenario } from '../../types/dialogue';

export const medecinFes: DialogueScenario = {
  id: 'medecinFes',
  title: 'F-l-Klinik',
  titleFr: 'Chez le Médecin',
  description: 'Décrivez vos symptômes, comprenez le diagnostic et la posologie.',
  category: 'daily',
  location: 'Clinique',
  level: 'B1',
  npcName: 'T-Tbib',
  npcRole: 'Médecin',
  npcAvatar: '/images/avatars/medecin.png',
  difficulty: 'hard',
  objectives: [
    'Décrire ses symptômes',
    'Comprendre l\'auscultation',
    'Prendre connaissance de la posologie'
  ],
  turns: [
    {
      id: 't1',
      speaker: 'bot',
      speakerRole: 'T-Tbib',
      arabicText: 'تْفَضَّلْ أَ سِيدِيْ، بَاشْ كَتْحَسْ لْيُومْ؟',
      arabiziText: 'Tfeddel a sidi, bach kat7ess l-youm?',
      translationFr: 'Entrez monsieur, qu\'est-ce que vous ressentez aujourd\'hui ?',
      audioKey: '/audio/roleplay/medecin/t1.mp3'
    },
    {
      id: 't2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'كَيْضُرْنِيْ رَاسِي بْزَافْ وْ فِيَّا السَّخَانَةْ.',
      arabiziText: 'Kayderrni rasi bezzaf w fiya s-skhana.',
      translationFr: 'J\'ai très mal à la tête et j\'ai de la fièvre.',
      expectedPhrases: {
        primaryArabizi: 'Kayderrni rasi bezzaf w fiya s-skhana.',
        primaryArabic: 'كيضرني راسي بزاف و فيا السخانة.',
        acceptedVariants: [
          'kayderrni rasi bezzaf w fiya s-skhana',
          'kayderrni rasi bezzaf',
          'fiya s-skhana w kayderrni rasi'
        ],
        hints: [
          'kayderrni',
          'rasi',
          's-skhana'
        ]
      }
    },
    {
      id: 't3',
      speaker: 'bot',
      speakerRole: 'T-Tbib',
      arabicText: 'وَاْخَا، غَادِيْ نْقَلْبَكْ دَابَا. تْنَفَّسْ مْزْيَانْ.',
      arabiziText: 'Wakha, ghadi n9ellbek daba. Tneffes mezyan.',
      translationFr: 'D\'accord, je vais vous examiner maintenant. Respirez bien.',
      audioKey: '/audio/roleplay/medecin/t3.mp3'
    },
    {
      id: 't4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'وَاْخَا أَ الطَّبِيبْ، شْنُوْ عَنْدِي؟',
      arabiziText: 'Wakha a t-tbib, chno 3endi?',
      translationFr: 'D\'accord docteur, qu\'est-ce que j\'ai ?',
      expectedPhrases: {
        primaryArabizi: 'Wakha a t-tbib, chno 3endi?',
        primaryArabic: 'واخا أ الطبيب، شنو عندي؟',
        acceptedVariants: [
          'wakha a t-tbib, chno 3endi',
          'chno 3endi a t-tbib',
          'chno 3endi'
        ],
        hints: [
          'wakha',
          'chno',
          '3endi'
        ]
      }
    },
    {
      id: 't5',
      speaker: 'bot',
      speakerRole: 'T-Tbib',
      arabicText: 'عَنْدَكْ غِيرْ رْوَاحْ خْفِيفْ. هَادِيْ لُورْدُونُونْصْ، خُودْ هَادْ الدَّوَا مُورَا الْمَاكْلَةْ.',
      arabiziText: '3endek ghir rwa7 khfif. Hadi l-ordonnance, khoud had d-dwa mowra l-makla.',
      translationFr: 'Vous avez juste un léger rhume. Voici l\'ordonnance, prenez ce médicament après les repas.',
      audioKey: '/audio/roleplay/medecin/t5.mp3'
    },
    {
      id: 't6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'شُكْرَانْ بْزَافْ أَ الطَّبِيبْ، شْحَالْ تِيسْوَا هَادْ الدَّوَا؟',
      arabiziText: 'Choukrane bezzaf a t-tbib, ch7al tayswa had d-dwa?',
      translationFr: 'Merci beaucoup docteur, combien coûte ce médicament ?',
      expectedPhrases: {
        primaryArabizi: 'Choukrane bezzaf a t-tbib, ch7al tayswa had d-dwa?',
        primaryArabic: 'شكرا بزاف أ الطبيب، شحال تيسوا هاد الدوا؟',
        acceptedVariants: [
          'choukrane bezzaf a t-tbib, ch7al tayswa had d-dwa',
          'ch7al tayswa had d-dwa',
          'ch7al tayswa'
        ],
        hints: [
          'choukrane',
          'ch7al',
          'd-dwa'
        ]
      }
    }
  ]
};

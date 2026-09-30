import { DialogueScenario } from '../../types/dialogue';

export const loyerFes: DialogueScenario = {
  id: 'loyerFes',
  title: 'Kré d-Dar',
  titleFr: 'Négociation de Loyer',
  description: 'Négociez le loyer, la caution et les charges avec le propriétaire.',
  category: 'daily',
  location: 'Fès - Médina',
  level: 'A2',
  npcName: 'Moul l-Molk',
  npcRole: 'Propriétaire',
  npcAvatar: '/images/avatars/proprio.png',
  difficulty: 'medium',
  objectives: [
    'Demander le loyer mensuel',
    'Négocier la caution',
    'Clarifier les charges'
  ],
  turns: [
    {
      id: 't1',
      speaker: 'bot',
      speakerRole: 'Moul l-Molk',
      arabicText: 'مرحبا بك أ سيدي. الدار عجباتك؟',
      arabiziText: 'Mar7ba bik a sidi. D-dar 3ejbatk?',
      translationFr: 'Bienvenue monsieur. La maison vous a plu ?',
      audioKey: '/audio/roleplay/loyer/t1.mp3'
    },
    {
      id: 't2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'إيه، عجباتني. بشحال الكرا ف الشهر؟',
      arabiziText: 'Iyeh, 3ejbatni. Bch7al l-kré f ch-chher?',
      translationFr: 'Oui, elle m\'a plu. Combien est le loyer par mois ?',
      expectedPhrases: {
        primaryArabizi: 'Iyeh, 3ejbatni. Bch7al l-kré f ch-chher?',
        primaryArabic: 'إيه، عجباتني. بشحال الكرا ف الشهر؟',
        acceptedVariants: [
          'bch7al l-kra f ch-chher',
          'iyeh 3ejbatni, bch7al l-kra',
          'ch7al l-kra f ch-chher'
        ],
        hints: [
          'bch7al',
          'l-kra',
          'ch-chher'
        ]
      }
    },
    {
      id: 't3',
      speaker: 'bot',
      speakerRole: 'Moul l-Molk',
      arabicText: 'الواجب هو تلتالاف درهم للشهر، و شهرين د الضمان.',
      arabiziText: 'L-wajib howa teltalaf derhem l-ch-chher, w chahrayn d d-daman.',
      translationFr: 'Le loyer est de 3000 dirhams par mois, et deux mois de caution.',
      audioKey: '/audio/roleplay/loyer/t3.mp3'
    },
    {
      id: 't4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'شهرين بزاف، نقدر نعطيك شهر واحد د الضمان؟',
      arabiziText: 'Chahrayn bezzaf, ne9der ne3tik chher wa7ed d d-daman?',
      translationFr: 'Deux mois c\'est beaucoup, je peux vous donner un mois de caution ?',
      expectedPhrases: {
        primaryArabizi: 'Chahrayn bezzaf, ne9der ne3tik chher wa7ed d d-daman?',
        primaryArabic: 'شهرين بزاف، نقدر نعطيك شهر واحد د الضمان؟',
        acceptedVariants: [
          'chahrayn bezzaf, ne9der ne3tik chher we7ed',
          'ne9der ne3tik chher wa7ed d-daman',
          'chher wa7ed d-daman'
        ],
        hints: [
          'chahrayn',
          'bezzaf',
          'chher wa7ed',
          'd-daman'
        ]
      }
    },
    {
      id: 't5',
      speaker: 'bot',
      speakerRole: 'Moul l-Molk',
      arabicText: 'واخا سيدي، ماشي مشكل. و لكن الما و الضو عليك.',
      arabiziText: 'Wakha sidi, machi mouchkil. Walakin l-ma w d-dow 3lik.',
      translationFr: 'D\'accord monsieur, pas de problème. Mais l\'eau et l\'électricité sont à votre charge.',
      audioKey: '/audio/roleplay/loyer/t5.mp3'
    },
    {
      id: 't6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'مزيان، متافقين. فوقاش نقدر ندخل؟',
      arabiziText: 'Mezyan, mtaf9in. Fou9ach ne9der ndkhol?',
      translationFr: 'Bien, nous sommes d\'accord. Quand est-ce que je peux entrer ?',
      expectedPhrases: {
        primaryArabizi: 'Mezyan, mtaf9in. Fou9ach ne9der ndkhol?',
        primaryArabic: 'مزيان، متافقين. فوقاش نقدر ندخل؟',
        acceptedVariants: [
          'mezyan, mtaf9in, fou9ach ndkhol',
          'fou9ach ne9der ndkhol',
          'mezyan fou9ach ndkhol'
        ],
        hints: [
          'mezyan',
          'mtaf9in',
          'fou9ach'
        ]
      }
    }
  ]
};

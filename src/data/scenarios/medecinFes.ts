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
      arabicText: 'تفضل أ سيدي، باش كتحس اليوم؟',
      arabiziText: 'Tfeddel a sidi, bach kat7ess l-youm?',
      translationFr: 'Entrez monsieur, qu\'est-ce que vous ressentez aujourd\'hui ?',
      audioKey: '/audio/roleplay/medecin/t1.mp3'
    },
    {
      id: 't2',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'كيضرني راسي بزاف و فيا السخانة.',
      arabiziText: 'Kayderrni rasi bezzaf w fiya s-skhana.',
      translationFr: 'J\'ai très mal à la tête et j\'ai de la fièvre.'
    },
    {
      id: 't3',
      speaker: 'bot',
      speakerRole: 'T-Tbib',
      arabicText: 'واخا، غادي نقلبك دابا. تنفس مزيان.',
      arabiziText: 'Wakha, ghadi n9ellbek daba. Tneffes mezyan.',
      translationFr: 'D\'accord, je vais vous examiner maintenant. Respirez bien.',
      audioKey: '/audio/roleplay/medecin/t3.mp3'
    },
    {
      id: 't4',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'واخا أ الطبيب، شنو عندي؟',
      arabiziText: 'Wakha a t-tbib, chno 3endi?',
      translationFr: 'D\'accord docteur, qu\'est-ce que j\'ai ?'
    },
    {
      id: 't5',
      speaker: 'bot',
      speakerRole: 'T-Tbib',
      arabicText: 'عندك غير رواح خفيف. هادي لوردونونص، خود هاد الدوا مورا الماكلة.',
      arabiziText: '3endek ghir rwa7 khfif. Hadi l-ordonnance, khoud had d-dwa mowra l-makla.',
      translationFr: 'Vous avez juste un léger rhume. Voici l\'ordonnance, prenez ce médicament après les repas.',
      audioKey: '/audio/roleplay/medecin/t5.mp3'
    },
    {
      id: 't6',
      speaker: 'user',
      speakerRole: 'Apprenant',
      arabicText: 'شكرا بزاف أ الطبيب، شحال تيسوا هاد الدوا؟',
      arabiziText: 'Choukrane bezzaf a t-tbib, ch7al tayswa had d-dwa?',
      translationFr: 'Merci beaucoup docteur, combien coûte ce médicament ?'
    }
  ]
};

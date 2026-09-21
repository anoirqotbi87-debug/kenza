import { Lesson } from '../types/curriculum';

export const module1Lessons: Lesson[] = [
  {
    id: 'l1_phonetics_1',
    title: '1. Les sons de base : 3, 7, 9',
    level: 1,
    description: 'Découvrez les sons uniques de la Darija.',
    steps: [
      {
        id: 's1_learn_3',
        type: 'learning',
        content: {
          title: 'Le son 3 (ع)',
          description: 'Un son guttural venant du fond de la gorge. Imaginez que vous êtes chez le docteur et que vous dites "Aaaah".',
          arabizi: '3afak',
          arabic: 'عفاك',
          translation: 'S\'il te plaît',
          culturalNote: 'Le son 3 est essentiel pour dire s\'il te plaît (3afak) ou exprimer la gratitude.'
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_1',
          type: 'mcq',
          prompt: 'Comment dit-on "S\'il te plaît" ?',
          options: [
            { id: 'opt1', arabizi: '3afak', arabic: 'عفاك', translation: 'S\'il te plaît' },
            { id: 'opt2', arabizi: 'Shokran', arabic: 'شكرا', translation: 'Merci' }
          ],
          answer: 'opt1',
          explanation: '3afak (عفاك) signifie s\'il te plaît.'
        }
      }
    ]
  },
  {
    id: 'l2_greetings_1',
    title: '2. Dire Bonjour',
    level: 1,
    description: 'La salutation la plus courante.',
    steps: [
      {
        id: 's1_learn_salam',
        type: 'learning',
        content: {
          title: 'Bonjour',
          description: 'La salutation la plus courante au Maroc.',
          arabizi: 'Salam',
          arabic: 'سلام',
          translation: 'Bonjour / Paix'
        }
      }
    ]
  },
  {
    id: 'l3_greetings_2',
    title: '3. Demander ça va',
    level: 1,
    description: 'Demander comment va quelqu\'un.',
    steps: [
      {
        id: 's1_learn_labas',
        type: 'learning',
        content: {
          title: 'Ça va ?',
          description: 'La façon standard de demander comment va quelqu\'un.',
          arabizi: 'Labas?',
          arabic: 'لاباس؟',
          translation: 'Ça va ?',
        }
      },
      {
        id: 's2_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_1',
          type: 'reorder',
          prompt: 'Reconstituez la phrase "Bonjour, ça va ?"',
          options: [
            { id: 'word1', arabizi: 'Labas?', arabic: 'لاباس؟', translation: 'Ça va ?' },
            { id: 'word2', arabizi: 'Salam,', arabic: 'سلام،', translation: 'Bonjour,' }
          ],
          answer: ['word2', 'word1'],
          explanation: 'On dit d\'abord Salam, puis on demande Labas?.'
        }
      }
    ]
  },
  {
    id: 'l4_greetings_3',
    title: '4. Répondre ça va',
    level: 1,
    description: 'Répondre "ça va, Dieu merci".',
    steps: [
      {
        id: 's1_learn_l7amdoulillah',
        type: 'learning',
        content: {
          title: 'Dieu Merci',
          description: 'On répond toujours par "Labas, l7amdoulillah".',
          arabizi: 'L7amdoulillah',
          arabic: 'الحمد لله',
          translation: 'Dieu merci',
        }
      }
    ]
  },
  {
    id: 'l5_politeness_1',
    title: '5. Merci et De rien',
    level: 1,
    description: 'La politesse de base.',
    steps: [
      {
        id: 's1_learn_shokran',
        type: 'learning',
        content: {
          title: 'Merci',
          description: 'Pour remercier quelqu\'un.',
          arabizi: 'Shokran',
          arabic: 'شكرا',
          translation: 'Merci',
        }
      },
      {
        id: 's2_learn_bla_jmil',
        type: 'learning',
        content: {
          title: 'De rien',
          description: 'Littéralement "sans faveur".',
          arabizi: 'Bla jmil',
          arabic: 'بلا جميل',
          translation: 'De rien',
        }
      }
    ]
  },
  {
    id: 'l6_pronouns_1',
    title: '6. Je et Tu',
    level: 1,
    description: 'Les pronoms personnels de base.',
    steps: [
      {
        id: 's1_learn_ana',
        type: 'learning',
        content: { title: 'Moi / Je', description: 'Le pronom pour la première personne.', arabizi: 'Ana', arabic: 'أنا', translation: 'Je' }
      },
      {
        id: 's2_learn_nta',
        type: 'learning',
        content: { title: 'Toi / Tu (Masculin)', description: 'Le pronom pour la deuxième personne masculine.', arabizi: 'Nta', arabic: 'نتا', translation: 'Tu (m)' }
      },
      {
        id: 's3_learn_nti',
        type: 'learning',
        content: { title: 'Toi / Tu (Féminin)', description: 'Le pronom pour la deuxième personne féminine.', arabizi: 'Nti', arabic: 'نتي', translation: 'Tu (f)' }
      }
    ]
  },
  {
    id: 'l7_intro_1',
    title: '7. Se présenter',
    level: 1,
    description: 'Dire "Je suis..."',
    steps: [
      {
        id: 's1_learn_ana_ouidad',
        type: 'learning',
        content: { title: 'Je suis (prénom)', description: 'Il suffit de mettre "Ana" devant son prénom.', arabizi: 'Ana Kenza', arabic: 'أنا كنزة', translation: 'Je suis Kenza' }
      }
    ]
  },
  {
    id: 'l8_intro_2',
    title: '8. Demander le nom',
    level: 1,
    description: 'Demander "Comment tu t\'appelles ?"',
    steps: [
      {
        id: 's1_learn_smiya',
        type: 'learning',
        content: { title: 'Nom', description: 'Le mot pour "nom".', arabizi: 'Smiya', arabic: 'سمية', translation: 'Nom' }
      },
      {
        id: 's2_learn_shno_smiytek',
        type: 'learning',
        content: { title: 'Comment tu t\'appelles ?', description: 'Littéralement : "Quoi ton nom ?"', arabizi: 'Shno smiytek?', arabic: 'شنو سميتك؟', translation: 'Comment tu t\'appelles ?' }
      }
    ]
  },
  {
    id: 'l9_farewell_1',
    title: '9. Dire au revoir',
    level: 1,
    description: 'Quitter quelqu\'un poliment.',
    steps: [
      {
        id: 's1_learn_bslama',
        type: 'learning',
        content: { title: 'Au revoir', description: 'Avec la sécurité (paix).', arabizi: 'Bslama', arabic: 'بسلامة', translation: 'Au revoir' }
      }
    ]
  },
  {
    id: 'l10_review_module1',
    title: '10. Révision Module 1',
    level: 1,
    description: 'Testez vos connaissances du module.',
    steps: [
      {
        id: 's1_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_rev1',
          type: 'mcq',
          prompt: 'Que répondez-vous à "Labas?" ?',
          options: [
            { id: 'opt1', arabizi: 'L7amdoulillah', arabic: 'الحمد لله', translation: 'Dieu merci' },
            { id: 'opt2', arabizi: 'Shokran', arabic: 'شكرا', translation: 'Merci' }
          ],
          answer: 'opt1',
          explanation: 'La réponse habituelle est L7amdoulillah.'
        }
      }
    ]
  }
];

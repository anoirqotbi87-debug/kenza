import { Lesson } from '../../types/curriculum';

export const lessonTaxi: Lesson = {
  id: 'l_module2_taxi_1',
  title: 'Le Petit Taxi',
  level: 2,
  description: 'Négociez une course en petit taxi rouge (Casa) ou bleu (Rabat).',
  steps: [
    {
      id: 's1_taxi_vocab',
      type: 'learning',
      content: {
        title: 'Le Petit Taxi',
        description: 'Les petits taxis sont un moyen de transport incontournable. Attention, ils doivent toujours mettre le compteur !',
        arabizi: 'Khdem l-kuntur',
        arabic: 'خدم الكونتور',
        translation: 'Allumez le compteur',
        culturalNote: 'Si le chauffeur refuse de mettre le compteur, il vaut mieux descendre et en prendre un autre.'
      }
    },
    {
      id: 's2_taxi_dialogue',
      type: 'exercise',
      exercise: {
        id: 'ex_dialogue_taxi',
        type: 'dialogue',
        prompt: 'Négociez votre course',
        dialogueContext: 'Course en Petit Taxi à Fès',
        npcStartLine: {
          arabizi: 'Fin ghadi a khouya?',
          arabic: 'فين غادي أ خويا؟',
          translation: 'Où vas-tu mon frère ?'
        },
        answer: '',
        explanation: '',
        dialogueChoices: [
          {
            id: 'c1',
            text: { arabizi: 'Ghadi l Bab Boujloud. Khdem l-kuntur 3afak.', arabic: 'غادي ل باب بوجلود. خدم الكونتور عفاك.', translation: 'Je vais à Bab Boujloud. Allume le compteur s\'il te plaît.' },
            isOptimal: true,
            nextNpcLine: 'Wakha a sidi, merhba.',
            feedback: 'Parfait ! Vous avez donné votre destination et exigé poliment le compteur.'
          },
          {
            id: 'c2',
            text: { arabizi: 'Bab Boujloud. B sh7al?', arabic: 'باب بوجلود. ب شحال؟', translation: 'Bab Boujloud. Pour combien ?' },
            isOptimal: false,
            nextNpcLine: '50 Dirhams a khouya.',
            feedback: 'Attention ! Ne jamais demander le prix d\'un petit taxi à l\'avance, sinon on vous donnera un prix fixe (souvent gonflé) au lieu d\'utiliser le compteur légal.'
          },
          {
            id: 'c3',
            text: { arabizi: 'Ma bghitch.', arabic: 'ما بغيتش.', translation: 'Je ne veux pas.' },
            isOptimal: false,
            nextNpcLine: '...',
            feedback: 'Hors sujet. Le chauffeur vous demande où vous allez.'
          }
        ]
      }
    }
  ]
};

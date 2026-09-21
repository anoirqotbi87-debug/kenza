import { Lesson } from '../../types/curriculum';

export const lessonCafe: Lesson = {
  id: 'l_module2_cafe_1',
  title: 'Au Café',
  level: 2,
  description: 'Apprenez à commander un thé et discuter avec le serveur.',
  steps: [
    {
      id: 's1_intro',
      type: 'learning',
      content: {
        title: 'Vocabulaire du Café',
        description: 'La culture du café est centrale au Maroc. Commençons par les mots clés.',
        arabizi: '9hwa / Atay',
        arabic: 'قهوة / أتاي',
        translation: 'Café / Thé',
        culturalNote: 'Le thé à la menthe (Atay b ne3na3) est la boisson nationale.'
      }
    },
    {
      id: 's2_grammar',
      type: 'learning',
      content: {
        title: 'Grammaire Active',
        description: 'Apprenons à utiliser le verbe vouloir (Bgha) et la négation (Ma...ch).',
        arabizi: 'Bghit',
        arabic: 'بغيت',
        translation: 'Je veux'
      } // The 'Grammaire Active' title acts as a trigger to render ConjugationTable in ExerciseRunner
    },
    {
      id: 's3_matching',
      type: 'exercise',
      exercise: {
        id: 'ex_match_cafe',
        type: 'matching',
        prompt: 'Reliez chaque boisson à sa traduction :',
        pairs: [
          { id: 'p1', left: { text: 'Atay' }, right: { text: 'Thé' } },
          { id: 'p2', left: { text: '9hwa' }, right: { text: 'Café' } },
          { id: 'p3', left: { text: 'Lma' }, right: { text: 'Eau' } },
          { id: 'p4', left: { text: '3asir' }, right: { text: 'Jus' } }
        ],
        answer: {}, // Handled by engine
        explanation: '3asir = jus, Lma = eau, 9hwa = café, Atay = thé.'
      }
    },
    {
      id: 's4_reorder',
      type: 'exercise',
      exercise: {
        id: 'ex_reorder_cafe',
        type: 'reorder',
        prompt: 'Reconstituez : "Je veux un thé à la menthe sans sucre"',
        options: [
          { id: 'w1', arabizi: 'Bghit', arabic: 'بغيت', translation: 'Je veux' },
          { id: 'w2', arabizi: 'atay', arabic: 'أتاي', translation: 'thé' },
          { id: 'w3', arabizi: 'b ne3na3', arabic: 'ب نعناع', translation: 'à la menthe' },
          { id: 'w4', arabizi: 'bla', arabic: 'بلا', translation: 'sans' },
          { id: 'w5', arabizi: 'sekkar', arabic: 'سكر', translation: 'sucre' }
        ],
        answer: ['w1', 'w2', 'w3', 'w4', 'w5'],
        explanation: 'Structure : Sujet+Verbe (Bghit) -> Objet (atay) -> Détails (b ne3na3, bla sekkar).'
      }
    },
    {
      id: 's5_mcq',
      type: 'exercise',
      exercise: {
        id: 'ex_mcq_cafe',
        type: 'mcq',
        prompt: 'Le serveur vous apporte votre commande et dit "Bessaha" (À votre santé). Que répondez-vous ?',
        options: [
          { id: 'opt1', arabizi: 'Lahetek saha', arabic: 'الله يعطيك الصحة', translation: 'Que Dieu te donne la santé' },
          { id: 'opt2', arabizi: 'Shokran', arabic: 'شكرا', translation: 'Merci' },
          { id: 'opt3', arabizi: 'Bslama', arabic: 'بسلامة', translation: 'Au revoir' },
          { id: 'opt4', arabizi: 'Wakhan', arabic: 'واخا', translation: 'D\'accord' }
        ],
        answer: 'opt1',
        explanation: 'On répond toujours "Lahetek saha" quand on nous dit "Bessaha".',
        culturalNote: 'Bessaha s\'utilise quand on achète du neuf, on sort du bain, ou quand on mange !'
      }
    },
    {
      id: 's6_fill_blank',
      type: 'exercise',
      exercise: {
        id: 'ex_fill_cafe',
        type: 'fill-blank',
        prompt: 'Complétez la négation : "Je ne veux pas de sucre"',
        sentenceTemplate: '{blank} sekkar',
        options: [
          { id: 'opt1', arabizi: 'Ma-bghit-ch', arabic: 'مابغيتش', translation: 'Je ne veux pas' },
          { id: 'opt2', arabizi: 'Ma-bghit', arabic: 'مابغيت', translation: 'Je ne veux' },
          { id: 'opt3', arabizi: 'Bghit-ch', arabic: 'بغيتش', translation: 'veux-pas' }
        ],
        answer: 'opt1',
        explanation: 'La négation encadre le verbe : Ma + verbe + ch.'
      }
    }
  ]
};

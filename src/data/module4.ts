import { Lesson } from '../types/curriculum';

export const module4Lessons: Lesson[] = [
  {
    id: 'l_mod4_1',
    title: { fr: 'Le Futur avec (ghadi)', en: 'Future Tense (ghadi)', es: 'Futuro (ghadi)', ar: 'المستقبل (ghadi)' },
    level: 4,
    description: { fr: 'Exprimer une action future.', en: 'Express a future action.', es: 'Expresar una acción futura.', ar: 'التعبير عن حدث مستقبلي.' },
    steps: [
      {
        id: 's1_learn_ghadi',
        type: 'learning',
        content: {
          title: { fr: 'Ghadi (Je vais)', en: 'Ghadi (Going to)', es: 'Ghadi (Voy a)', ar: 'غادي (سوف)' },
          description: { 
            fr: 'On utilise le mot "ghadi" avant le verbe au subjonctif pour le futur.',
            en: 'Use the word "ghadi" before the verb to indicate future tense.',
            es: 'Usa la palabra "ghadi" antes del verbo para indicar el futuro.',
            ar: 'استخدم كلمة "غادي" قبل الفعل للدلالة على المستقبل.'
          },
          arabizi: 'Ghadi nmshi',
          arabic: 'غادي نمشي',
          translation: { fr: 'J\'irai / Je vais y aller', en: 'I will go', es: 'Iré / Voy a ir', ar: 'سأذهب' },
          culturalNote: {
            fr: 'S\'utilise souvent avec "Inshallah" (Si Dieu le veut).',
            en: 'Often used with "Inshallah" (God willing).',
            es: 'A menudo se usa con "Inshallah" (Si Dios quiere).',
            ar: 'يستخدم غالباً مع "إن شاء الله".'
          }
        }
      }
    ]
  },
  {
    id: 'l_mod4_2',
    title: { fr: 'Les Modaux (Bgha, Khass, Qedd)', en: 'Modals (Want, Need, Can)', es: 'Modales (Querer, Necesitar, Poder)', ar: 'الأفعال الناقصة (Bgha, Khass, Qedd)' },
    level: 4,
    description: { fr: 'Exprimer le besoin, la volonté et la capacité.', en: 'Express need, will, and ability.', es: 'Expresar necesidad, voluntad y capacidad.', ar: 'التعبير عن الحاجة، الإرادة والقدرة.' },
    steps: [
      {
        id: 's1_learn_bgha',
        type: 'learning',
        content: {
          title: { fr: 'Bgha (Vouloir)', en: 'Bgha (To want)', es: 'Bgha (Querer)', ar: 'بغى (أراد)' },
          description: { 
            fr: 'Le verbe "bgha" est conjugué au passé pour exprimer un désir présent.',
            en: 'The verb "bgha" is conjugated in the past to express a present desire.',
            es: 'El verbo "bgha" se conjuga en pasado para expresar un deseo presente.',
            ar: 'يُصرف الفعل "بغى" في الماضي للتعبير عن رغبة في الحاضر.'
          },
          arabizi: 'Bghit',
          arabic: 'بغيت',
          translation: { fr: 'Je veux', en: 'I want', es: 'Quiero', ar: 'أريد' },
          culturalNote: {
            fr: 'La forme de politesse "bghit 3afak" (Je veux s\'il te plaît) est essentielle.',
            en: 'The polite form "bghit 3afak" (I want please) is essential.',
            es: 'La forma educada "bghit 3afak" (Quiero por favor) es esencial.',
            ar: 'صيغة التأدب "بغيت عفاك" (أريد من فضلك) ضرورية.'
          }
        }
      }
    ]
  }
];

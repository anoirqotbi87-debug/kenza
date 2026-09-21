import { Lesson } from '../../types/curriculum';

export const lessonCafe: Lesson = {
  id: 'l_module2_cafe_1',
  title: {
    fr: 'Au Café',
    en: 'At the Cafe',
    es: 'En el Café',
    ar: 'في المقهى'
  },
  level: 2,
  description: {
    fr: 'Apprenez à commander un thé et discuter avec le serveur.',
    en: 'Learn how to order tea and talk with the waiter.',
    es: 'Aprende a pedir un té y hablar con el camarero.',
    ar: 'تعلم كيف تطلب شاياً وتتحدث مع النادل.'
  },
  steps: [
    {
      id: 's1_intro',
      type: 'learning',
      content: {
        title: { fr: 'Vocabulaire du Café', en: 'Cafe Vocabulary', es: 'Vocabulario del Café', ar: 'مفردات المقهى' },
        description: { fr: 'La culture du café est centrale au Maroc.', en: 'Cafe culture is central in Morocco.', es: 'La cultura del café es central en Marruecos.', ar: 'ثقافة المقاهي أساسية في المغرب.' },
        arabizi: '9hwa / Atay',
        arabic: 'قهوة / أتاي',
        translation: { fr: 'Café / Thé', en: 'Coffee / Tea', es: 'Café / Té', ar: 'قهوة / شاي' },
        culturalNote: { fr: 'Le thé à la menthe (Atay b ne3na3) est la boisson nationale.', en: 'Mint tea is the national drink.', es: 'El té a la menta es la bebida nacional.', ar: 'الشاي بالنعناع هو المشروب الوطني.' }
      }
    },
    {
      id: 's3_matching',
      type: 'exercise',
      exercise: {
        id: 'ex_match_cafe',
        type: 'matching',
        prompt: { fr: 'Reliez chaque boisson à sa traduction :', en: 'Match each drink to its translation:', es: 'Relaciona cada bebida con su traducción:', ar: 'اربط كل مشروب بترجمته:' },
        pairs: [
          { id: 'p1', left: { text: 'Atay' }, right: { text: { fr: 'Thé', en: 'Tea', es: 'Té', ar: 'شاي' } } },
          { id: 'p2', left: { text: '9hwa' }, right: { text: { fr: 'Café', en: 'Coffee', es: 'Café', ar: 'قهوة' } } },
          { id: 'p3', left: { text: 'Lma' }, right: { text: { fr: 'Eau', en: 'Water', es: 'Agua', ar: 'ماء' } } },
          { id: 'p4', left: { text: '3asir' }, right: { text: { fr: 'Jus', en: 'Juice', es: 'Zumo', ar: 'عصير' } } }
        ],
        answer: {}, 
        explanation: { fr: '3asir = jus, Lma = eau, 9hwa = café, Atay = thé.', en: '3asir = juice, Lma = water, 9hwa = coffee, Atay = tea.', es: '3asir = zumo, Lma = agua, 9hwa = café, Atay = té.', ar: 'عصير = jus, ماء = Lma, قهوة = 9hwa, شاي = Atay.' }
      }
    },
    {
      id: 's4_reorder',
      type: 'exercise',
      exercise: {
        id: 'ex_reorder_cafe',
        type: 'reorder',
        prompt: { fr: 'Reconstituez : "Je veux un thé à la menthe sans sucre"', en: 'Reorder: "I want a mint tea without sugar"', es: 'Reconstruye: "Quiero un té de menta sin azúcar"', ar: 'أعد ترتيب: "أريد شاي بالنعناع بدون سكر"' },
        options: [
          { id: 'w1', text: 'Bghit', isCorrect: true },
          { id: 'w2', text: 'atay', isCorrect: true },
          { id: 'w3', text: 'b ne3na3', isCorrect: true },
          { id: 'w4', text: 'bla', isCorrect: true },
          { id: 'w5', text: 'sekkar', isCorrect: true }
        ],
        answer: ['w1', 'w2', 'w3', 'w4', 'w5'],
        explanation: { fr: 'Structure : Sujet+Verbe (Bghit) -> Objet (atay) -> Détails.', en: 'Structure: Subject+Verb -> Object -> Details.', es: 'Estructura: Sujeto+Verbo -> Objeto -> Detalles.', ar: 'التركيب: فاعل+فعل -> مفعول به -> تفاصيل.' }
      }
    },
    {
      id: 's5_mcq',
      type: 'exercise',
      exercise: {
        id: 'ex_mcq_cafe',
        type: 'mcq',
        prompt: { fr: 'Que répondez-vous à "Bessaha" ?', en: 'What do you reply to "Bessaha"?', es: '¿Qué respondes a "Bessaha"?', ar: 'بماذا ترد على "بالصحة"؟' },
        options: [
          { id: 'opt1', text: 'Lahetek saha', isCorrect: true },
          { id: 'opt2', text: 'Shokran', isCorrect: false },
          { id: 'opt3', text: 'Bslama', isCorrect: false },
          { id: 'opt4', text: 'Wakhan', isCorrect: false }
        ],
        answer: 'opt1',
        explanation: { fr: 'On répond "Lahetek saha".', en: 'We reply "Lahetek saha".', es: 'Respondemos "Lahetek saha".', ar: 'نرد بـ "الله يعطيك الصحة".' }
      }
    }
  ]
};

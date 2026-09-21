import { Lesson } from '../types/curriculum';

export const module1Lessons: Lesson[] = [
  {
    id: 'l1_phonetics_1',
    title: { fr: '1. Les sons de base : 3, 7, 9', en: '1. Basic Sounds: 3, 7, 9', es: '1. Sonidos básicos: 3, 7, 9', ar: '1. الأصوات الأساسية: 3, 7, 9' },
    level: 1,
    description: { fr: 'Découvrez les sons uniques de la Darija.', en: 'Discover the unique sounds of Darija.', es: 'Descubre los sonidos únicos del Darija.', ar: 'اكتشف الأصوات الفريدة للدارجة.' },
    steps: [
      {
        id: 's1_learn_3',
        type: 'learning',
        content: {
          title: { fr: 'Le son 3 (ع)', en: 'The 3 sound (ع)', es: 'El sonido 3 (ع)', ar: 'الصوت 3 (ع)' },
          description: { fr: 'Un son guttural venant du fond de la gorge. Imaginez que vous êtes chez le docteur et que vous dites "Aaaah".', en: 'A guttural sound from the back of the throat.', es: 'Un sonido gutural desde el fondo de la garganta.', ar: 'صوت حلقي من مؤخرة الحلق.' },
          arabizi: '3afak',
          arabic: 'عفاك',
          translation: { fr: 'S\'il te plaît', en: 'Please', es: 'Por favor', ar: 'من فضلك' },
          culturalNote: { fr: 'Le son 3 est essentiel pour dire s\'il te plaît (3afak).', en: 'The 3 sound is essential for saying please (3afak).', es: 'El sonido 3 es esencial para decir por favor (3afak).', ar: 'الصوت 3 أساسي لقول من فضلك (عفاك).' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_1',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "S\'il te plaît" ?', en: 'How do you say "Please"?', es: '¿Cómo se dice "Por favor"?', ar: 'كيف تقول "من فضلك"؟' },
          options: [
            { id: 'opt1', text: '3afak', isCorrect: true },
            { id: 'opt2', text: 'Shokran', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { fr: '3afak (عفاك) signifie s\'il te plaît.', en: '3afak (عفاك) means please.', es: '3afak (عفاك) significa por favor.', ar: '3afak (عفاك) تعني من فضلك.' }
        }
      }
    ]
  },
  {
    id: 'l2_greetings_1',
    title: { fr: '2. Dire Bonjour', en: '2. Saying Hello', es: '2. Decir Hola', ar: '2. قول مرحباً' },
    level: 1,
    description: { fr: 'La salutation la plus courante.', en: 'The most common greeting.', es: 'El saludo más común.', ar: 'التحية الأكثر شيوعاً.' },
    steps: [
      {
        id: 's1_learn_salam',
        type: 'learning',
        content: {
          title: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحباً' },
          description: { fr: 'La salutation la plus courante au Maroc.', en: 'The most common greeting in Morocco.', es: 'El saludo más común en Marruecos.', ar: 'التحية الأكثر شيوعاً في المغرب.' },
          arabizi: 'Salam',
          arabic: 'سلام',
          translation: { fr: 'Bonjour / Paix', en: 'Hello / Peace', es: 'Hola / Paz', ar: 'مرحباً / سلام' }
        }
      }
    ]
  },
  {
    id: 'l3_greetings_2',
    title: { fr: '3. Demander ça va', en: '3. Asking how are you', es: '3. Preguntar cómo estás', ar: '3. السؤال عن الحال' },
    level: 1,
    description: { fr: 'Demander comment va quelqu\'un.', en: 'Ask how someone is doing.', es: 'Preguntar cómo está alguien.', ar: 'السؤال عن حال شخص ما.' },
    steps: [
      {
        id: 's1_learn_labas',
        type: 'learning',
        content: {
          title: { fr: 'Ça va ?', en: 'How are you?', es: '¿Qué tal?', ar: 'لاباس؟' },
          description: { fr: 'La façon standard de demander comment va quelqu\'un.', en: 'The standard way to ask how someone is.', es: 'La forma estándar de preguntar cómo está alguien.', ar: 'الطريقة القياسية للسؤال عن الحال.' },
          arabizi: 'Labas?',
          arabic: 'لاباس؟',
          translation: { fr: 'Ça va ?', en: 'How are you?', es: '¿Qué tal?', ar: 'كيف حالك؟' },
        }
      },
      {
        id: 's2_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_1',
          type: 'reorder',
          prompt: { fr: 'Reconstituez la phrase "Bonjour, ça va ?"', en: 'Reorder: "Hello, how are you?"', es: 'Reconstruye: "Hola, ¿qué tal?"', ar: 'أعد ترتيب: "مرحباً، كيف حالك؟"' },
          options: [
            { id: 'word1', text: 'Labas?', isCorrect: true },
            { id: 'word2', text: 'Salam,', isCorrect: true }
          ],
          answer: ['word2', 'word1'],
          explanation: { fr: 'On dit d\'abord Salam, puis on demande Labas?.', en: 'Say Salam first, then ask Labas?.', es: 'Primero di Salam, luego pregunta Labas?.', ar: 'نقول سلام أولاً، ثم نسأل لاباس؟.' }
        }
      }
    ]
  },
  {
    id: 'l4_greetings_3',
    title: { fr: '4. Répondre ça va', en: '4. Replying to how are you', es: '4. Responder a cómo estás', ar: '4. الرد على كيف حالك' },
    level: 1,
    description: { fr: 'Répondre "ça va, Dieu merci".', en: 'Reply "fine, thank God".', es: 'Responder "bien, gracias a Dios".', ar: 'الرد بـ "بخير، الحمد لله".' },
    steps: [
      {
        id: 's1_learn_l7amdoulillah',
        type: 'learning',
        content: {
          title: { fr: 'Dieu Merci', en: 'Thank God', es: 'Gracias a Dios', ar: 'الحمد لله' },
          description: { fr: 'On répond toujours par "Labas, l7amdoulillah".', en: 'We always reply with "Labas, l7amdoulillah".', es: 'Siempre respondemos con "Labas, l7amdoulillah".', ar: 'نرد دائماً بـ "لاباس، الحمد لله".' },
          arabizi: 'L7amdoulillah',
          arabic: 'الحمد لله',
          translation: { fr: 'Dieu merci', en: 'Thank God', es: 'Gracias a Dios', ar: 'الحمد لله' },
        }
      }
    ]
  },
  {
    id: 'l5_politeness_1',
    title: { fr: '5. Merci et De rien', en: '5. Thank you and You are welcome', es: '5. Gracias y De nada', ar: '5. شكراً وعفواً' },
    level: 1,
    description: { fr: 'La politesse de base.', en: 'Basic politeness.', es: 'Cortesía básica.', ar: 'الآداب الأساسية.' },
    steps: [
      {
        id: 's1_learn_shokran',
        type: 'learning',
        content: {
          title: { fr: 'Merci', en: 'Thank you', es: 'Gracias', ar: 'شكراً' },
          description: { fr: 'Pour remercier quelqu\'un.', en: 'To thank someone.', es: 'Para agradecer a alguien.', ar: 'لشكر شخص ما.' },
          arabizi: 'Shokran',
          arabic: 'شكرا',
          translation: { fr: 'Merci', en: 'Thank you', es: 'Gracias', ar: 'شكراً' },
        }
      },
      {
        id: 's2_learn_bla_jmil',
        type: 'learning',
        content: {
          title: { fr: 'De rien', en: 'You are welcome', es: 'De nada', ar: 'عفواً' },
          description: { fr: 'Littéralement "sans faveur".', en: 'Literally "without favor".', es: 'Literalmente "sin favor".', ar: 'حرفياً "بدون جميل".' },
          arabizi: 'Bla jmil',
          arabic: 'بلا جميل',
          translation: { fr: 'De rien', en: 'You are welcome', es: 'De nada', ar: 'عفواً' },
        }
      }
    ]
  },
  {
    id: 'l6_pronouns_1',
    title: { fr: '6. Je et Tu', en: '6. I and You', es: '6. Yo y Tú', ar: '6. أنا وأنت' },
    level: 1,
    description: { fr: 'Les pronoms personnels de base.', en: 'Basic personal pronouns.', es: 'Pronombres personales básicos.', ar: 'الضمائر الشخصية الأساسية.' },
    steps: [
      {
        id: 's1_learn_ana',
        type: 'learning',
        content: { 
          title: { fr: 'Moi / Je', en: 'I / Me', es: 'Yo', ar: 'أنا' }, 
          description: { fr: 'Le pronom pour la première personne.', en: 'First-person pronoun.', es: 'Pronombre de primera persona.', ar: 'ضمير المتكلم.' }, 
          arabizi: 'Ana', arabic: 'أنا', 
          translation: { fr: 'Je', en: 'I', es: 'Yo', ar: 'أنا' } 
        }
      },
      {
        id: 's2_learn_nta',
        type: 'learning',
        content: { 
          title: { fr: 'Toi / Tu (Masculin)', en: 'You (Male)', es: 'Tú (Masculino)', ar: 'أنتَ' }, 
          description: { fr: 'Pour la 2ème personne masculine.', en: 'For second person male.', es: 'Para segunda persona masculina.', ar: 'للمخاطب المذكر.' }, 
          arabizi: 'Nta', arabic: 'نتا', 
          translation: { fr: 'Tu (m)', en: 'You (m)', es: 'Tú (m)', ar: 'أنتَ' } 
        }
      },
      {
        id: 's3_learn_nti',
        type: 'learning',
        content: { 
          title: { fr: 'Toi / Tu (Féminin)', en: 'You (Female)', es: 'Tú (Femenino)', ar: 'أنتِ' }, 
          description: { fr: 'Pour la 2ème personne féminine.', en: 'For second person female.', es: 'Para segunda persona femenina.', ar: 'للمخاطبة المؤنثة.' }, 
          arabizi: 'Nti', arabic: 'نتي', 
          translation: { fr: 'Tu (f)', en: 'You (f)', es: 'Tú (f)', ar: 'أنتِ' } 
        }
      }
    ]
  }
];

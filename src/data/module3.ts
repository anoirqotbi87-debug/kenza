import { Lesson } from '../types/curriculum';

export const module3Lessons: Lesson[] = [
  {
    id: 'l_mod3_1',
    title: {
      fr: 'Le Présent avec (ka-)',
      en: 'Present Tense with (ka-)',
      es: 'El Presente con (ka-)',
      ar: 'المضارع مع (ka-)'
    },
    level: 3,
    description: {
      fr: 'Apprenez à conjuguer au présent.',
      en: 'Learn to conjugate in the present tense.',
      es: 'Aprende a conjugar en presente.',
      ar: 'تعلم تصريف الأفعال في الحاضر.'
    },
    steps: [
      {
        id: 's1_learn_ka',
        type: 'learning',
        content: {
          title: { fr: 'Le Présent', en: 'Present', es: 'Presente', ar: 'الحاضر' },
          description: { 
            fr: 'On ajoute "ka" avant le verbe pour exprimer une habitude ou une action en cours.',
            en: 'Add "ka" before the verb to express a habit or ongoing action.',
            es: 'Añade "ka" antes del verbo para expresar un hábito o acción en curso.',
            ar: 'أضف "ka" قبل الفعل للتعبير عن عادة أو فعل مستمر.'
          },
          arabizi: 'Ka-nmshi',
          arabic: 'كانمشي',
          translation: { fr: 'Je vais', en: 'I go', es: 'Yo voy', ar: 'أنا أذهب' },
          culturalNote: {
            fr: 'Note : Dans le nord (Tanger), on utilise parfois "la-" au lieu de "ka-".',
            en: 'Note: In the north (Tangier), "la-" is sometimes used instead of "ka-".',
            es: 'Nota: En el norte (Tánger), a veces se usa "la-" en lugar de "ka-".',
            ar: 'ملاحظة: في الشمال (طنجة)، يستخدم أحياناً "la-" بدلاً من "ka-".'
          }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_ka',
          type: 'mcq',
          prompt: {
            fr: 'Comment dire "Je vais" ?',
            en: 'How to say "I go"?',
            es: '¿Cómo decir "Yo voy"?',
            ar: 'كيف تقول "أنا أذهب"؟'
          },
          options: [
            { id: 'opt1', text: 'Ka-nmshi', isCorrect: true },
            { id: 'opt2', text: 'Nmshi', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: {
            fr: 'Il faut ajouter le préfixe du présent "ka-".',
            en: 'You must add the present prefix "ka-".',
            es: 'Debes añadir el prefijo de presente "ka-".',
            ar: 'يجب إضافة بادئة المضارع "ka-".'
          }
        }
      }
    ]
  },
  {
    id: 'l_mod3_2',
    title: {
      fr: 'La Négation (ma...ch)',
      en: 'Negation (ma...ch)',
      es: 'Negación (ma...ch)',
      ar: 'النفي (ma...ch)'
    },
    level: 3,
    description: {
      fr: 'Apprenez à dire non (ma-...-ch).',
      en: 'Learn to say no (ma-...-ch).',
      es: 'Aprende a decir no (ma-...-ch).',
      ar: 'تعلم كيف تقول لا (ma-...-ch).'
    },
    steps: [
      {
        id: 's1_learn_negation',
        type: 'learning',
        content: {
          title: { fr: 'La Négation', en: 'Negation', es: 'Negación', ar: 'النفي' },
          description: {
            fr: 'On encadre le verbe avec "ma" et "ch". Ex: ma-bghitch (je ne veux pas).',
            en: 'Frame the verb with "ma" and "ch". Ex: ma-bghitch (I do not want).',
            es: 'Enmarca el verbo con "ma" y "ch". Ej: ma-bghitch (no quiero).',
            ar: 'نضع الفعل بين "ma" و "ch". مثال: ma-bghitch (لا أريد).'
          },
          arabizi: 'Ma-ka-nmshi-ch',
          arabic: 'ماكانمشيش',
          translation: { fr: 'Je ne vais pas', en: 'I am not going', es: 'No voy', ar: 'أنا لا أذهب' },
          culturalNote: {
            fr: 'Le suffixe "ch" vient de l\'arabe classique "شيء" (chay\', signifiant "chose").',
            en: 'The suffix "ch" comes from Classical Arabic "شيء" (chay\', meaning "thing").',
            es: 'El sufijo "ch" proviene del árabe clásico "شيء" (chay\', que significa "cosa").',
            ar: 'اللاحقة "ch" تأتي من العربية الفصحى "شيء".'
          }
        }
      }
    ]
  },
  {
    id: 'l_mod3_3',
    title: {
      fr: 'La Possession (dyal)',
      en: 'Possession (dyal)',
      es: 'Posesión (dyal)',
      ar: 'الملكية (dyal)'
    },
    level: 3,
    description: {
      fr: 'Utilisation de dyal pour exprimer la possession.',
      en: 'Using dyal to express possession.',
      es: 'Uso de dyal para expresar posesión.',
      ar: 'استخدام dyal للتعبير عن الملكية.'
    },
    steps: [
      {
        id: 's1_learn_dyal',
        type: 'learning',
        content: {
          title: { fr: 'Dyal (de / à)', en: 'Dyal (of / belonging to)', es: 'Dyal (de)', ar: 'ديال (لـ)' },
          description: {
            fr: 'Dyal remplace les pronoms possessifs compliqués. "Le livre de moi" = "L-ktab dyali".',
            en: 'Dyal replaces complex possessives. "The book of me" = "L-ktab dyali".',
            es: 'Dyal reemplaza los posesivos complejos. "El libro de mí" = "L-ktab dyali".',
            ar: 'ديال تحل محل الضمائر المعقدة. "الكتاب لي" = "L-ktab dyali".'
          },
          arabizi: 'L-ktab dyali',
          arabic: 'الكتاب ديالي',
          translation: { fr: 'Mon livre', en: 'My book', es: 'Mi libro', ar: 'كتابي' }
        }
      }
    ]
  }
];

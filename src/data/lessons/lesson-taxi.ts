import { Lesson } from '../../types/curriculum';

export const lessonTaxi: Lesson = {
  id: 'l_module2_taxi_1',
  title: {
    fr: 'Le Petit Taxi',
    en: 'The Little Taxi',
    es: 'El Pequeño Taxi',
    ar: 'الطاكسي الصغير'
  },
  level: 2,
  description: {
    fr: 'Négociez une course en petit taxi rouge (Casa) ou bleu (Rabat).',
    en: 'Negotiate a ride in a small red (Casa) or blue (Rabat) taxi.',
    es: 'Negocia un viaje en un pequeño taxi rojo (Casa) o azul (Rabat).',
    ar: 'تفاوض على رحلة في طاكسي صغير أحمر (الدار البيضاء) أو أزرق (الرباط).'
  },
  steps: [
    {
      id: 's1_taxi_vocab',
      type: 'learning',
      content: {
        title: {
          fr: 'Le Petit Taxi',
          en: 'The Little Taxi',
          es: 'El Pequeño Taxi',
          ar: 'الطاكسي الصغير'
        },
        description: {
          fr: 'Les petits taxis sont incontournables. Attention, ils doivent toujours mettre le compteur !',
          en: 'Little taxis are essential. Attention, they must always turn on the meter!',
          es: 'Los pequeños taxis son esenciales. ¡Atención, siempre deben encender el taxímetro!',
          ar: 'الطاكسيات الصغيرة ضرورية. انتبه، يجب عليهم دائماً تشغيل العداد!'
        },
        arabizi: 'Khdem l-kuntur',
        arabic: 'خدم الكونتور',
        translation: {
          fr: 'Allumez le compteur',
          en: 'Turn on the meter',
          es: 'Enciende el taxímetro',
          ar: 'شغل العداد'
        },
        culturalNote: {
          fr: 'Si le chauffeur refuse de mettre le compteur, descendez et prenez-en un autre.',
          en: 'If the driver refuses to use the meter, get out and take another one.',
          es: 'Si el conductor se niega a usar el taxímetro, bájate y toma otro.',
          ar: 'إذا رفض السائق تشغيل العداد، انزل وخذ واحداً آخر.'
        }
      }
    },
    {
      id: 's2_taxi_dialogue',
      type: 'exercise',
      exercise: {
        id: 'ex_dialogue_taxi',
        type: 'dialogue',
        prompt: {
          fr: 'Négociez votre course',
          en: 'Negotiate your ride',
          es: 'Negocia tu viaje',
          ar: 'تفاوض على رحلتك'
        },
        dialogueContext: {
          fr: 'Course en Petit Taxi à Fès',
          en: 'Little Taxi ride in Fez',
          es: 'Viaje en Pequeño Taxi en Fez',
          ar: 'رحلة طاكسي صغير في فاس'
        },
        npcStartLine: {
          arabizi: 'Fin ghadi a khouya?',
          arabic: 'فين غادي أ خويا؟',
          translation: {
            fr: 'Où vas-tu mon frère ?',
            en: 'Where are you going, my brother?',
            es: '¿A dónde vas, hermano?',
            ar: 'إلى أين أنت ذاهب يا أخي؟'
          }
        },
        answer: '',
        explanation: '',
        dialogueChoices: [
          {
            id: 'c1',
            text: { 
              arabizi: 'Ghadi l Bab Boujloud. Khdem l-kuntur 3afak.', 
              arabic: 'غادي ل باب بوجلود. خدم الكونتور عفاك.', 
              translation: {
                fr: 'Je vais à Bab Boujloud. Allume le compteur s\'il te plaît.',
                en: 'I am going to Bab Boujloud. Turn on the meter, please.',
                es: 'Voy a Bab Boujloud. Enciende el taxímetro por favor.',
                ar: 'أنا ذاهب إلى باب بوجلود. شغل العداد من فضلك.'
              }
            },
            isOptimal: true,
            nextNpcLine: 'Wakha a sidi, merhba.',
            feedback: {
              fr: 'Parfait ! Vous avez donné votre destination et exigé poliment le compteur.',
              en: 'Perfect! You gave your destination and politely requested the meter.',
              es: '¡Perfecto! Diste tu destino y pediste educadamente el taxímetro.',
              ar: 'ممتاز! لقد أعطيت وجهتك وطلبت العداد بأدب.'
            }
          },
          {
            id: 'c2',
            text: { 
              arabizi: 'Bab Boujloud. B sh7al?', 
              arabic: 'باب بوجلود. ب شحال؟', 
              translation: {
                fr: 'Bab Boujloud. Pour combien ?',
                en: 'Bab Boujloud. For how much?',
                es: 'Bab Boujloud. ¿Por cuánto?',
                ar: 'باب بوجلود. بكم؟'
              }
            },
            isOptimal: false,
            nextNpcLine: '50 Dirhams a khouya.',
            feedback: {
              fr: 'Attention ! Ne demandez jamais le prix d\'un petit taxi à l\'avance.',
              en: 'Warning! Never ask the price of a small taxi in advance.',
              es: '¡Cuidado! Nunca preguntes el precio de un pequeño taxi por adelantado.',
              ar: 'احذر! لا تسأل أبداً عن سعر الطاكسي الصغير مسبقاً.'
            }
          },
          {
            id: 'c3',
            text: { 
              arabizi: 'Ma bghitch.', 
              arabic: 'ما بغيتش.', 
              translation: {
                fr: 'Je ne veux pas.',
                en: 'I do not want.',
                es: 'No quiero.',
                ar: 'لا أريد.'
              }
            },
            isOptimal: false,
            nextNpcLine: '...',
            feedback: {
              fr: 'Hors sujet. Le chauffeur vous demande où vous allez.',
              en: 'Off topic. The driver is asking where you are going.',
              es: 'Fuera de tema. El conductor pregunta a dónde vas.',
              ar: 'خارج الموضوع. السائق يسألك إلى أين أنت ذاهب.'
            }
          }
        ]
      }
    }
  ]
};

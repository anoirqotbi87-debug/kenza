import { Lesson } from '../types/curriculum';

export const module6Lessons: Lesson[] = [
  {
    id: 'l_mod6_1',
    title: { fr: 'Verbes creux & défectifs', en: 'Hollow & Defective Verbs', es: 'Verbos Huecos y Defectivos', ar: 'الأفعال الجوفاء والناقصة' },
    level: 1,
    description: { fr: 'Gal / Ygul, Chaf / Ychuf, Mcha / Ymchi', en: 'Gal / Ygul, Chaf / Ychuf, Mcha / Ymchi', es: 'Gal / Ygul, Chaf / Ychuf, Mcha / Ymchi', ar: 'قال / يقول، شاف / يشوف، مشى / يمشي' },
    steps: [
      {
        id: 's1_learn_hollow',
        type: 'learning',
        content: {
          title: { fr: 'Les Verbes Creux (Chaf, Gal)', en: 'Hollow Verbs (Chaf, Gal)', es: 'Verbos Huecos (Chaf, Gal)', ar: 'الأفعال الجوفاء (شاف، قال)' },
          description: { 
            fr: 'Au passé avec je/tu/nous (Ana/Nta/7na), la voyelle centrale A se contracte en O ou U (ex: Chaf -> Chof-t, Gal -> Guel-t). Mais avec "Il", la voyelle reste (Huwa chaf).', 
            en: 'In the past with I/you/we (Ana/Nta/7na), the central vowel A contracts to O or U (e.g. Chaf -> Chof-t, Gal -> Guel-t). But with "He", it stays (Huwa chaf).', 
            es: 'En el pasado con yo/tú/nosotros (Ana/Nta/7na), la vocal central A se contrae a O o U (ej: Chaf -> Chof-t, Gal -> Guel-t). Pero con "Él", se mantiene (Huwa chaf).', 
            ar: 'في الماضي مع أنا/أنت/نحن، يتقلص الحرف الأوسط "أ" إلى "و" أو "ي" (مثل: شاف -> شفت، قال -> قلت). لكن مع "هو"، يبقى كما هو (هو شاف).' 
          },
          arabizi: 'Ana chof-t / Huwa chaf',
          arabic: 'أنا شفت / هو شاف',
          translation: { fr: 'J\'ai vu / Il a vu', en: 'I saw / He saw', es: 'Yo vi / Él vio', ar: 'أنا رأيت / هو رأى' },
          culturalNote: { fr: 'Règle d\'or : "Au passé avec Ana/Nta, le grand A central se contracte en O ou U".', en: 'Golden rule: "In the past with Ana/Nta, the large central A contracts to O or U".', es: 'Regla de oro: "En el pasado con Ana/Nta, la gran A central se contrae a O o U".', ar: 'القاعدة الذهبية: "في الماضي مع أنا/أنت، الحرف الأوسط يتقلص".' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_chaf',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "J\'ai vu" en Darija ?', en: 'How do you say "I saw" in Darija?', es: '¿Cómo se dice "Yo vi" en Darija?', ar: 'كيف تقول "أنا رأيت" بالدارجة؟' },
          options: [
            { id: 'opt1', text: 'Chof-t', isCorrect: true },
            { id: 'opt2', text: 'Chaf-t', isCorrect: false },
            { id: 'opt3', text: 'Ka-nchuf', isCorrect: false },
            { id: 'opt4', text: 'Mchit', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Correct ! Le A de "chaf" devient O avec le pronom Ana -> Chof-t.', 
            en: 'Correct! The A in "chaf" becomes O with the pronoun Ana -> Chof-t.', 
            es: '¡Correcto! La A de "chaf" se convierte en O con el pronombre Ana -> Chof-t.', 
            ar: 'صحيح! حرف الألف في "شاف" يتحول إلى واو مع الضمير أنا -> شفت.' 
          }
        }
      },
      {
        id: 's3_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_mcha',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : "Hier, je suis allé au souk."', en: 'Reorder: "Yesterday, I went to the souk."', es: 'Reconstruye: "Ayer, fui al zoco."', ar: 'أعد ترتيب: "البارحة، ذهبت إلى السوق."' },
          options: [
            { id: 'w1', text: 'L-bare7', isCorrect: true },
            { id: 'w2', text: 'mchi-t', isCorrect: true },
            { id: 'w3', text: 'l', isCorrect: true },
            { id: 'w4', text: 's-souk', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4'],
          explanation: { 
            fr: 'Mcha est un verbe défectif (terminaison en voyelle). Avec Ana, la finale devient -it -> mchi-t.', 
            en: 'Mcha is a defective verb (ends in a vowel). With Ana, the ending becomes -it -> mchi-t.', 
            es: 'Mcha es un verbo defectivo (termina en vocal). Con Ana, el final se convierte en -it -> mchi-t.', 
            ar: 'مشى فعل ناقص (ينتهي بحرف علة). مع الضمير أنا، يتحول إلى ياء -> مشيت.' 
          }
        }
      },
      {
        id: 's4_exercise_fill',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_gal',
          type: 'fill-blank',
          prompt: { fr: 'Complétez la phrase : "Huwa ___ l-7aqiqa" (Il a dit la vérité).', en: 'Complete: "Huwa ___ l-7aqiqa" (He told the truth).', es: 'Completa: "Huwa ___ l-7aqiqa" (Él dijo la verdad).', ar: 'أكمل: "هو ___ الحقيقة"' },
          sentenceTemplate: 'Huwa ___ l-7aqiqa',
          options: [
            { id: 'opt1', text: 'gal', isCorrect: true },
            { id: 'opt2', text: 'guel-t', isCorrect: false },
            { id: 'opt3', text: 'gal-t', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Avec Huwa (Il), la voyelle A est conservée : Huwa gal.', 
            en: 'With Huwa (He), the vowel A is kept: Huwa gal.', 
            es: 'Con Huwa (Él), la vocal A se mantiene: Huwa gal.', 
            ar: 'مع الضمير هو، يبقى حرف الألف: هو قال.' 
          }
        }
      },
      {
        id: 's5_exercise_fill_2',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_gal_2',
          type: 'fill-blank',
          prompt: { fr: 'Et maintenant avec Je : "Ana ___ l-7aqiqa" (J\'ai dit la vérité).', en: 'Now with I: "Ana ___ l-7aqiqa" (I told the truth).', es: 'Y ahora con Yo: "Ana ___ l-7aqiqa" (Yo dije la verdad).', ar: 'والآن مع أنا: "أنا ___ الحقيقة"' },
          sentenceTemplate: 'Ana ___ l-7aqiqa',
          options: [
            { id: 'opt1', text: 'guel-t', isCorrect: true },
            { id: 'opt2', text: 'gal', isCorrect: false },
            { id: 'opt3', text: 'guel', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Ana guel-t. Le verbe "gal" se contracte en "guel-" avec le pronom Ana.', 
            en: 'Ana guel-t. The verb "gal" contracts to "guel-" with the pronoun Ana.', 
            es: 'Ana guel-t. El verbo "gal" se contrae a "guel-" con el pronombre Ana.', 
            ar: 'أنا قلت. الفعل "قال" يتقلص إلى "قلت" مع الضمير أنا.' 
          }
        }
      },
      {
        id: 's6_learn_culture',
        type: 'learning',
        content: {
          title: { fr: 'Le saviez-vous ?', en: 'Did you know?', es: '¿Sabías que?', ar: 'هل تعلم؟' },
          description: { 
            fr: 'L\'expression culte "Chkoun galha lik ?" veut dire "Qui te l\'a dit ?". Ces verbes à mutation vocalique rappellent un peu l\'espagnol (dormir -> duermo).', 
            en: 'The cult expression "Chkoun galha lik?" means "Who told you?". These vowel-mutating verbs are somewhat reminiscent of Spanish (dormir -> duermo).', 
            es: 'La expresión de culto "Chkoun galha lik?" significa "¿Quién te lo dijo?". Estos verbos de mutación vocálica recuerdan un poco al español (dormir -> duermo).', 
            ar: 'التعبير الشهير "شكون قالها ليك؟" يعني "من قال لك ذلك؟". هذه الأفعال ذات الحروف المتغيرة تشبه قليلاً الإسبانية.' 
          },
          arabizi: 'Chkoun galha lik? / Fin ghadi?',
          arabic: 'شكون قالها ليك؟ / فين غادي؟',
          translation: { fr: 'Qui te l\'a dit ? / Où vas-tu ?', en: 'Who told you? / Where are you going?', es: '¿Quién te lo dijo? / ¿A dónde vas?', ar: 'من قال لك ذلك؟ / إلى أين أنت ذاهب؟' }
        }
      }
    ]
  },
  {
    id: 'l_mod6_2',
    title: { fr: 'Pronoms affixés', en: 'Affixed Pronouns', es: 'Pronombres Afijados', ar: 'الضمائر المتصلة' },
    level: 2,
    description: { fr: 'Chef-tu, Guel-t-lih', en: 'Direct and indirect object pronouns', es: 'Pronombres de objeto directo e indirecto', ar: 'الضمائر المتصلة المباشرة وغير المباشرة' },
    steps: [
      {
        id: 's1_learn_affixed',
        type: 'learning',
        content: {
          title: { fr: 'Pronoms Affixés (COD & COI)', en: 'Affixed Pronouns', es: 'Pronombres Afijados', ar: 'الضمائر المتصلة' },
          description: { 
            fr: 'En Darija, les pronoms s\'agglutinent à la fin du verbe. Directs (COD) : -ek, -u, -ha. Indirects (COI, avec "l") : -lik, -lih, -liha.', 
            en: 'In Darija, pronouns are glued to the end of the verb. Direct (COD): -ek, -u, -ha. Indirect (COI, with "l"): -lik, -lih, -liha.', 
            es: 'En Darija, los pronombres se pegan al final del verbo. Directos (COD): -ek, -u, -ha. Indirectos (COI, con "l"): -lik, -lih, -liha.', 
            ar: 'في الدارجة، تلتصق الضمائر بنهاية الفعل. المباشرة: -ك، -ه، -ها. غير المباشرة: -ليك، -ليه، -ليها.' 
          },
          arabizi: 'Chof-t-u (Je l\'ai vu) / Guel-t-lih (Je lui ai dit)',
          arabic: 'شفتو / قلت ليه',
          translation: { fr: 'Direct vs Indirect', en: 'Direct vs Indirect', es: 'Directo vs Indirecto', ar: 'مباشر مقابل غير مباشر' },
          culturalNote: { fr: 'Règle d\'or : "Les petits pronoms s\'agglutinent toujours à la fin du verbe".', en: 'Golden rule: "Pronouns always attach to the end of the verb".', es: 'Regla de oro: "Los pronombres siempre se pegan al final del verbo".', ar: 'القاعدة الذهبية: "الضمائر تلتصق دائماً في نهاية الفعل".' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_chof',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "Je l\'ai vu" (un homme) ?', en: 'How do you say "I saw him"?', es: '¿Cómo se dice "Lo vi" (a él)?', ar: 'كيف تقول "رأيته" (لرجل)؟' },
          options: [
            { id: 'opt1', text: 'Chof-t-u', isCorrect: true },
            { id: 'opt2', text: 'Chof-t huwa', isCorrect: false },
            { id: 'opt3', text: 'Chof-t-ha', isCorrect: false },
            { id: 'opt4', text: 'Ka-nchuf-u', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Correct ! On colle le pronom "-u" (lui) directement à "Chof-t".', 
            en: 'Correct! Attach the pronoun "-u" (him) directly to "Chof-t".', 
            es: '¡Correcto! Se pega el pronombre "-u" (él) directamente a "Chof-t".', 
            ar: 'صحيح! نلصق الضمير "-و" (له) مباشرة بـ "شفت".' 
          }
        }
      },
      {
        id: 's3_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_liha',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : "Hier, je lui ai dit la vérité (à elle)."', en: 'Reorder: "Yesterday, I told her the truth."', es: 'Reconstruye: "Ayer, le dije la verdad (a ella)."', ar: 'أعد ترتيب: "البارحة، قلت لها الحقيقة."' },
          options: [
            { id: 'w1', text: 'L-bare7', isCorrect: true },
            { id: 'w2', text: 'guel-t-liha', isCorrect: true },
            { id: 'w3', text: 'l-7aqiqa', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3'],
          explanation: { 
            fr: 'Guel-t (J\'ai dit) + li (à) + ha (elle) = guel-t-liha.', 
            en: 'Guel-t (I said) + li (to) + ha (her) = guel-t-liha.', 
            es: 'Guel-t (Dije) + li (a) + ha (ella) = guel-t-liha.', 
            ar: 'قلت + لي (لـ) + ها (هي) = قلت ليها.' 
          }
        }
      },
      {
        id: 's4_exercise_fill',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_ni',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "Wash fhem-t-___ ?" (Est-ce que tu m\'as compris ?)', en: 'Complete: "Wash fhem-t-___?" (Did you understand me?)', es: 'Completa: "¿Wash fhem-t-___?" (¿Me entendiste?)', ar: 'أكمل: "واش فهمت___؟" (هل فهمتني؟)' },
          sentenceTemplate: 'Wash fhem-t-___?',
          options: [
            { id: 'opt1', text: 'ni', isCorrect: true },
            { id: 'opt2', text: 'liya', isCorrect: false },
            { id: 'opt3', text: 'ek', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: '"Me" comme COD devient "-ni". Wash fhem-t-ni?', 
            en: '"Me" as a direct object becomes "-ni". Wash fhem-t-ni?', 
            es: '"Me" como objeto directo se convierte en "-ni". ¿Wash fhem-t-ni?', 
            ar: '"ني" هي المفعول به للمتكلم. واش فهمتني؟' 
          }
        }
      },
      {
        id: 's5_exercise_fill_2',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_liya',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "3afak, 3tii-___ l-ma" (S\'il te plaît, donne-moi de l\'eau).', en: 'Complete: "3afak, 3tii-___ l-ma" (Please give me water).', es: 'Completa: "3afak, 3tii-___ l-ma" (Por favor, dame agua).', ar: 'أكمل: "عفاك، عطيني/عطي ليا الما"' },
          sentenceTemplate: '3afak, 3tii-___ l-ma',
          options: [
            { id: 'opt1', text: 'ni', isCorrect: true },
            { id: 'opt2', text: 'liya', isCorrect: true },
            { id: 'opt3', text: 'ek', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Les deux sont possibles ! On entend souvent 3tii-ni (donne-moi) ou 3tii-liya (donne à moi).', 
            en: 'Both are possible! You often hear 3tii-ni (give me) or 3tii-liya (give to me).', 
            es: '¡Ambos son posibles! A menudo se oye 3tii-ni (dame) o 3tii-liya (da a mí).', 
            ar: 'كلاهما ممكن! عطيني (أعطني) أو عطي ليا (أعط لي).' 
          }
        }
      },
      {
        id: 's6_learn_dialogue',
        type: 'learning',
        content: {
          title: { fr: 'En contexte', en: 'In Context', es: 'En Contexto', ar: 'في السياق' },
          description: { 
            fr: 'Ami : "Wash chef-ti Ali l-youm ?" (As-tu vu Ali aujourd\'hui ?)\n\nVous : "Iyeh, chef-t-u f s-souk w guel-t-lih yji 3endna." (Oui, je l\'ai vu au souk et je lui ai dit de venir chez nous.)', 
            en: 'Friend: "Wash chef-ti Ali l-youm?"\n\nYou: "Iyeh, chef-t-u f s-souk w guel-t-lih yji 3endna."', 
            es: 'Amigo: "¿Wash chef-ti Ali l-youm?"\n\nTú: "Iyeh, chef-t-u f s-souk w guel-t-lih yji 3endna."', 
            ar: 'صديق: "واش شفتي علي اليوم؟"\n\nأنت: "إيه، شفتو فالسوق وقلت ليه يجي عندنا."' 
          },
          arabizi: 'Chef-t-u (Je l\'ai vu) / Guel-t-lih (Je lui ai dit)',
          arabic: 'شفتو / قلت ليه',
          translation: { fr: 'Observez l\'agglutination', en: 'Notice the agglutination', es: 'Observa la aglutinación', ar: 'لاحظ الالتصاق' }
        }
      }
    ]
  },
  {
    id: 'l_mod6_3',
    title: { fr: 'L\'hypothèse', en: 'Hypothesis', es: 'La Hipótesis', ar: 'الافتراض' },
    level: 3,
    description: { fr: 'Ila réalisable vs Koun irréel', en: 'Ila (possible) vs Koun (unreal)', es: 'Ila (posible) vs Koun (irreal)', ar: 'إيلا (ممكن) مقابل كون (مستحيل)' },
    steps: []
  },
  {
    id: 'l_mod6_4',
    title: { fr: 'Négociation de bail', en: 'Lease Negotiation', es: 'Negociación de Arrendamiento', ar: 'التفاوض على الإيجار' },
    level: 4,
    description: { fr: 'Kra, caution, état des lieux', en: 'Rent, deposit, inventory', es: 'Alquiler, fianza, inventario', ar: 'الكراء، الضمان، حالة المكان' },
    steps: []
  }
];

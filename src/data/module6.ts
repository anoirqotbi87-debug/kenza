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
          arabic: 'أَنَا شَفْتْ / هُوْ شَافْ',
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
          arabic: 'شْكُونْ قَالْهَا لِيكْ؟ / فِينْ غَادِيْ؟',
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
          arabic: 'شَفْتُو / قُلْتْ لِيهْ',
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
          acceptedAnswers: ['opt2'],
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
          arabic: 'شَفْتُو / قُلْتْ لِيهْ',
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
    steps: [
      {
        id: 's1_learn_ila_koun',
        type: 'learning',
        content: {
          title: { fr: 'L\'Hypothèse : Ila vs Koun', en: 'Hypothesis: Ila vs Koun', es: 'Hipótesis: Ila vs Koun', ar: 'الافتراض: إيلا مقابل كون' },
          description: { 
            fr: 'Ila (Réalisable) : Condition future possible (Ila + verbe -> Ghadi...). Koun (Irréel) : Condition imaginaire ou regret passé (Koun + passé -> Koun + passé).', 
            en: 'Ila (Possible): Possible future condition (Ila + verb -> Ghadi...). Koun (Unreal): Imaginary condition or past regret (Koun + past -> Koun + past).', 
            es: 'Ila (Posible): Condición futura posible (Ila + verbo -> Ghadi...). Koun (Irreal): Condición imaginaria o arrepentimiento pasado (Koun + pasado -> Koun + pasado).', 
            ar: 'إيلا (ممكن): شرط مستقبلي ممكن (إيلا + فعل -> غادي...). كون (غير واقعي): شرط خيالي أو ندم على الماضي (كون + ماضي -> كون + ماضي).' 
          },
          arabizi: 'Ila jiti, ghadi n-chufek / Koun jiti, koun chef-t-ek',
          arabic: 'إِيلَا جِيتِيْ، غَادِيْ نْشُوفَكْ / كُونْ جِيتِيْ، كُونْ شَفْتِكْ',
          translation: { fr: 'Si tu viens, je te verrai / Si tu étais venu, je t\'aurais vu', en: 'If you come, I will see you / If you had come, I would have seen you', es: 'Si vienes, te veré / Si hubieras venido, te habría visto', ar: 'إذا جئت، سأراك / لو جئت، لرأيتك' },
          culturalNote: { fr: 'Règle d\'or : "Koun exprime toujours le regret de ce qui ne s\'est pas produit !"', en: 'Golden rule: "Koun always expresses the regret of what did not happen!"', es: 'Regla de oro: "¡Koun siempre expresa el arrepentimiento de lo que no sucedió!"', ar: 'القاعدة الذهبية: "كون تعبر دائماً عن الندم على ما لم يحدث!"' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_ila',
          type: 'mcq',
          prompt: { fr: 'Complétez : "___ jiti ghdda, ghadi n-chufek" (Si tu viens demain, je te verrai)', en: 'Complete: "___ jiti ghdda, ghadi n-chufek" (If you come tomorrow, I will see you)', es: 'Completa: "___ jiti ghdda, ghadi n-chufek" (Si vienes mañana, te veré)', ar: 'أكمل: "___ جيتي غدا، غادي نشوفك"' },
          options: [
            { id: 'opt1', text: 'Ila', isCorrect: true },
            { id: 'opt2', text: 'Koun', isCorrect: false },
            { id: 'opt3', text: 'Wakha', isCorrect: false },
            { id: 'opt4', text: 'Bghit', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'On parle d\'un événement futur réalisable (ghdda = demain), donc on utilise Ila.', 
            en: 'We are talking about a possible future event (ghdda = tomorrow), so we use Ila.', 
            es: 'Hablamos de un evento futuro posible (ghdda = mañana), por lo que usamos Ila.', 
            ar: 'نحن نتحدث عن حدث مستقبلي ممكن (غدا)، لذلك نستخدم إيلا.' 
          }
        }
      },
      {
        id: 's3_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_koun',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : "Si j\'avais su, je serais venu."', en: 'Reorder: "If I had known, I would have come."', es: 'Reconstruye: "Si lo hubiera sabido, habría venido."', ar: 'أعد ترتيب: "لو كنت أعرف، لكنت جئت."' },
          options: [
            { id: 'w1', text: 'Koun', isCorrect: true },
            { id: 'w2', text: '3ref-t,', isCorrect: true },
            { id: 'w3', text: 'koun', isCorrect: true },
            { id: 'w4', text: 'ji-t', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4'],
          explanation: { 
            fr: 'La double répétition de "Koun" est typique en Darija pour l\'irréel du passé.', 
            en: 'The double repetition of "Koun" is typical in Darija for past unreality.', 
            es: 'La doble repetición de "Koun" es típica en Darija para la irrealidad pasada.', 
            ar: 'التكرار المزدوج لـ "كون" هو نموذجي في الدارجة للماضي غير الواقعي.' 
          }
        }
      },
      {
        id: 's4_exercise_fill',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_koun',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "___ kan 3endi l-flus, koun chri-t had d-dar." (Si j\'avais de l\'argent, j\'aurais acheté cette maison.)', en: 'Complete: "___ kan 3endi l-flus, koun chri-t had d-dar." (If I had money, I would have bought this house.)', es: 'Completa: "___ kan 3endi l-flus, koun chri-t had d-dar." (Si tuviera dinero, habría comprado esta casa.)', ar: 'أكمل: "___ كان عندي الفلوس، كون شريت هاد الدار."' },
          sentenceTemplate: '___ kan 3endi l-flus, koun chri-t had d-dar.',
          options: [
            { id: 'opt1', text: 'Koun', isCorrect: true },
            { id: 'opt2', text: 'Ila', isCorrect: false },
            { id: 'opt3', text: 'Wakha', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'C\'est un regret (irréel). L\'indice est la suite de la phrase qui contient déjà "koun".', 
            en: 'It\'s a regret (unreal). The clue is the rest of the sentence which already contains "koun".', 
            es: 'Es un arrepentimiento (irreal). La pista es el resto de la oración que ya contiene "koun".', 
            ar: 'إنه ندم (غير واقعي). الدليل هو بقية الجملة التي تحتوي بالفعل على "كون".' 
          }
        }
      },
      {
        id: 's5_exercise_fill_2',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_ila',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "___ bghiti, n-mchiw daba." (Si tu veux, on y va maintenant.)', en: 'Complete: "___ bghiti, n-mchiw daba." (If you want, we can go now.)', es: 'Completa: "___ bghiti, n-mchiw daba." (Si quieres, vamos ahora.)', ar: 'أكمل: "___ بغيتي، نمشيو دابا."' },
          sentenceTemplate: '___ bghiti, n-mchiw daba.',
          options: [
            { id: 'opt1', text: 'Ila', isCorrect: true },
            { id: 'opt2', text: 'Koun', isCorrect: false },
            { id: 'opt3', text: 'Wakha', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'C\'est une condition réalisable dans le présent/futur immédiat.', 
            en: 'It\'s a possible condition in the present/immediate future.', 
            es: 'Es una condición posible en el presente/futuro inmediato.', 
            ar: 'إنه شرط ممكن في الحاضر/المستقبل القريب.' 
          }
        }
      },
      {
        id: 's6_learn_dialogue',
        type: 'learning',
        content: {
          title: { fr: 'Dialogue en contexte', en: 'Dialogue in context', es: 'Diálogo en contexto', ar: 'حوار في السياق' },
          description: { 
            fr: 'Rachid : "Ila saliti l-khedma békri, aji n-tlaqaw f l-qhwa." (Si tu finis tôt, viens au café.)\nOmar : "Wakha, walakin koun 3lem-tini l-bare7, koun khwit rasi l-youm !" (D\'accord, mais si tu m\'avais prévenu hier, j\'aurais libéré ma journée !)', 
            en: 'Rachid: "Ila saliti l-khedma békri, aji n-tlaqaw f l-qhwa."\nOmar: "Wakha, walakin koun 3lem-tini l-bare7, koun khwit rasi l-youm!"', 
            es: 'Rachid: "Ila saliti l-khedma békri, aji n-tlaqaw f l-qhwa."\nOmar: "Wakha, walakin koun 3lem-tini l-bare7, koun khwit rasi l-youm!"', 
            ar: 'رشيد: "إيلا ساليتي الخدمة بكري، أجي نتلاقاو فالقهوة."\nعمر: "واخا، ولكن كون علمتيني البارح، كون خويت راسي اليوم!"' 
          },
          arabizi: 'Ila (Promesse) vs Koun (Regret)',
          arabic: 'إِيلَا مُقَابِلْ كُونْ',
          translation: { fr: 'Décryptage de la condition', en: 'Condition decoding', es: 'Decodificación de la condición', ar: 'فك تشفير الشرط' }
        }
      }
    ]
  },
  {
    id: 'l_mod6_4',
    title: { fr: 'Négociation de bail', en: 'Lease Negotiation', es: 'Negociación de Arrendamiento', ar: 'التفاوض على الإيجار' },
    level: 4,
    description: { fr: 'Kra, caution, état des lieux', en: 'Rent, deposit, inventory', es: 'Alquiler, fianza, inventario', ar: 'الكراء، الضمان، حالة المكان' },
    steps: [
      {
        id: 's1_learn_kra',
        type: 'learning',
        content: {
          title: { fr: 'Louer un Appartement', en: 'Renting an Apartment', es: 'Alquilar un Apartamento', ar: 'كراء شقة' },
          description: { 
            fr: 'Mots-clés : L-Kra (Loyer), Dman (Caution), L-Frakh (Meublé), L-ma w d-dow (L\'eau et l\'électricité), Moul d-dar (Propriétaire).', 
            en: 'Keywords: L-Kra (Rent), Dman (Deposit), L-Frakh (Furnished), L-ma w d-dow (Water and electricity), Moul d-dar (Landlord).', 
            es: 'Palabras clave: L-Kra (Alquiler), Dman (Fianza), L-Frakh (Amueblado), L-ma w d-dow (Agua y electricidad), Moul d-dar (Propietario).', 
            ar: 'الكلمات الرئيسية: الكرا، الضمان، الفراش، الما والضو، مول الدار.' 
          },
          arabizi: 'Sh7al l-kra f ch-her?',
          arabic: 'شْحَالْ لْكْرَا فْ الشَّهْرْ؟',
          translation: { fr: 'Combien coûte le loyer par mois ?', en: 'How much is the rent per month?', es: '¿Cuánto es el alquiler al mes?', ar: 'كم الإيجار في الشهر؟' },
          culturalNote: { fr: 'Le propriétaire est souvent appelé "Moul d-dar" (le maître de la maison).', en: 'The landlord is often called "Moul d-dar" (master of the house).', es: 'El propietario a menudo se llama "Moul d-dar" (el amo de la casa).', ar: 'غالباً ما يُطلق على صاحب المنزل اسم "مول الدار".' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_kra',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "Combien coûte le loyer par mois ?"', en: 'How do you say "How much is the rent per month?"', es: '¿Cómo se dice "¿Cuánto es el alquiler al mes?"', ar: 'كيف تقول "كم الإيجار في الشهر؟"' },
          options: [
            { id: 'opt1', text: 'Sh7al l-kra f ch-her?', isCorrect: true },
            { id: 'opt2', text: 'Fin d-dar?', isCorrect: false },
            { id: 'opt3', text: 'Sh7al l-ma?', isCorrect: false },
            { id: 'opt4', text: 'Bghit n-kri', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Sh7al (Combien) + l-kra (le loyer) + f (dans/par) + ch-her (le mois).', 
            en: 'Sh7al (How much) + l-kra (the rent) + f (in/per) + ch-her (the month).', 
            es: 'Sh7al (Cuánto) + l-kra (el alquiler) + f (en/por) + ch-her (el mes).', 
            ar: 'شحال (كم) + الكرا (الإيجار) + ف (في) + الشهر.' 
          }
        }
      },
      {
        id: 's3_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_charges',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : "Est-ce que cet appartement comprend l\'eau et l\'électricité ?"', en: 'Reorder: "Does this apartment include water and electricity?"', es: 'Reconstruye: "¿Este apartamento incluye agua y electricidad?"', ar: 'أعد ترتيب: "هل هذه الشقة تشمل الماء والكهرباء؟"' },
          options: [
            { id: 'w1', text: 'Wash', isCorrect: true },
            { id: 'w2', text: 'had', isCorrect: true },
            { id: 'w3', text: 'd-dar', isCorrect: true },
            { id: 'w4', text: 'fiha', isCorrect: true },
            { id: 'w5', text: 'l-ma', isCorrect: true },
            { id: 'w6', text: 'w', isCorrect: true },
            { id: 'w7', text: 'd-dow?', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7'],
          explanation: { 
            fr: 'Wash (Est-ce que) had (cette) d-dar (maison) fiha (elle contient) l-ma w d-dow (l\'eau et l\'électricité).', 
            en: 'Wash (Does) had (this) d-dar (house) fiha (have in it) l-ma w d-dow (water and electricity).', 
            es: 'Wash (¿Acaso) had (esta) d-dar (casa) fiha (tiene dentro) l-ma w d-dow (agua y electricidad).', 
            ar: 'واش هاد الدار فيها الما والضو؟' 
          }
        }
      },
      {
        id: 's4_exercise_fill',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_dman',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "Khass-ni n-khelles ch-her dyal ___" (Je dois payer un mois de caution).', en: 'Complete: "Khass-ni n-khelles ch-her dyal ___" (I must pay a month\'s deposit).', es: 'Completa: "Khass-ni n-khelles ch-her dyal ___" (Debo pagar un mes de fianza).', ar: 'أكمل: "خاصني نخلص شهر ديال ___" (الضمان)' },
          sentenceTemplate: 'Khass-ni n-khelles ch-her dyal ___',
          options: [
            { id: 'opt1', text: 'dman', isCorrect: true },
            { id: 'opt2', text: 'kra', isCorrect: false },
            { id: 'opt3', text: 'l-ma', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Dman veut dire "caution" ou "garantie".', 
            en: 'Dman means "deposit" or "guarantee".', 
            es: 'Dman significa "fianza" o "garantía".', 
            ar: 'الضمان يعني الوديعة أو التأمين.' 
          }
        }
      },
      {
        id: 's5_learn_dialogue',
        type: 'learning',
        content: {
          title: { fr: 'Négociation (Mouchatara)', en: 'Negotiation', es: 'Negociación', ar: 'المفاوضة' },
          description: { 
            fr: 'Vous : "3jbatni d-dar, walakin l-kra ghali chwiya. Wash momkin t-nqess 500 DH ?" (J\'aime la maison, mais le loyer est un peu cher. Peux-tu baisser de 500 DH ?)\n\nMoul d-dar : "Wakha a sidi, n-khalliha lik b 4000 DH m3a dman dyal ch-her." (D\'accord monsieur, je vous la laisse à 4000 DH avec un mois de caution.)', 
            en: 'You: "3jbatni d-dar, walakin l-kra ghali chwiya. Wash momkin t-nqess 500 DH?"\nLandlord: "Wakha a sidi, n-khalliha lik b 4000 DH m3a dman dyal ch-her."', 
            es: 'Tú: "3jbatni d-dar, walakin l-kra ghali chwiya. Wash momkin t-nqess 500 DH?"\nPropietario: "Wakha a sidi, n-khalliha lik b 4000 DH m3a dman dyal ch-her."', 
            ar: 'أنت: "عجباتني الدار، ولكن الكرا غالي شوية. واش ممكن تنقص 500 درهم؟"\nمول الدار: "واخا أسيدي، نخليها ليك بـ 4000 درهم مع ضمان ديال شهر."' 
          },
          arabizi: 'T-nqess 500 DH? (Baisser 500 DH ?)',
          arabic: 'تَنْقُصْ 500 دْرْهَمْ؟',
          translation: { fr: 'La négociation au Maroc est courante pour le loyer.', en: 'Negotiation in Morocco is common for rent.', es: 'La negociación en Marruecos es común para el alquiler.', ar: 'المفاوضة شائعة في المغرب للإيجار.' }
        }
      },
      {
        id: 's6_exercise_scramble',
        type: 'exercise',
        exercise: {
          id: 'ex_m6_l4_scramble',
          type: 'scramble',
          prompt: { fr: 'Reconstituez : « Je dois payer un mois de caution »', en: 'Reorder: "I have to pay a one-month deposit"', es: 'Reconstruye: "Debo pagar un mes de fianza"', ar: 'أعد ترتيب: "خاصني نخلص شهر ديال الضمان"' },
          options: [
            { id: 'w1', text: 'Khasni', isCorrect: true },
            { id: 'w2', text: 'n-khelles', isCorrect: true },
            { id: 'w3', text: 'dman', isCorrect: true },
            { id: 'w4', text: 'dyal', isCorrect: true },
            { id: 'w5', text: 'ch-her', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4', 'w5'],
          explanation: {
            fr: 'Structure : verbe (Khasni)+ infinitif (n-khelles)+ objet (dman)+ possessif (dyal)+ complément (ch-her)..',
            en: 'Structure: verb (Khasni)+ infinitive (n-khelles)+ object (dman)+ possessive (dyal)+ complement (ch-her)..',
            es: 'Estructura: verbo (Khasni)+ infinitivo (n-khelles)+ objeto (dman)+ posesivo (dyal)+ complemento (ch-her)..',
            ar: 'التركيب: فعل(خاصني)+ مصدر(نخلص)+ مفعول(الضمان)+ ملكية(ديال)+ متمم(الشهر)..'
          }
        }
      },
      {
        id: 's7_boss_medecin',
        type: 'exercise',
        exercise: {
          id: 'ex_m6_boss_medecin',
          type: 'roleplay_challenge',
          prompt: { fr: 'Épreuve finale : relevez le défi « Chez le Médecin » puis enchaînez sur l\'onglet Parler. Vous consultez le Dr Amine à son cabinet.', en: "Final challenge: take on the 'At the Doctor' challenge, then move on to the Parler tab. You consult Dr Amine at his office.", es: 'Desafio final: supera el reto «En el Médico» y luego continúa en la pestana Parler. Consultas al Dr Amine en su consulta.', ar: 'التحدي الختامي: خض مغامرة «عند الطبيب» ثم انتقل إلى تبويب Parler. تستشير الدكتور أمين في عيادته.' },
          dialogueContext: { fr: "Vous entrez au cabinet du Dr Amine. Vous décrivez vos symptômes et comprenez le diagnostic et la posologie.", en: "You enter Dr Amine's office. You describe your symptoms and understand the diagnosis and the dosage.", es: 'Entras a la consulta del Dr Amine. Describes tus síntomas y comprendes el diagnóstico y la posología.', ar: 'تدخل إلى عيادة الدكتور أمين. تصف أعراضك وتفهم التشخيص والجرعة.' },
          npcStartLine: { arabizi: 'Tfeddel a sidi ! Chnou kat7ess l-youm ?', arabic: 'تْفَضَّلْ أَ سِيدِيْ ! شْنُو كَتْحَسْ لْيُومْ ؟', translation: { fr: "Entrez monsieur ! Qu'est-ce que vous ressentez aujourd'hui ?", en: "Come in sir! What are you feeling today?", es: '¡Pase señor! ¿Qué siente hoy?', ar: 'تفضل سيدي! بماذا تشعر اليوم؟' } },
          answer: '',
          explanation: { fr: "Vous décrivez vos symptômes avec précision et demandez la posologie. Ce défi vous prépare au dialogue médical ouvert dans l'onglet Parler.", en: "You describe your symptoms accurately and ask for the dosage. This challenge prepares you for the open medical dialogue on the Parler tab.", es: 'Describes tus síntomas con precisión y preguntas por la posología. Este reto te prepara para el diálogo médico abierto en la pestana Parler.', ar: 'تصف أعراضك بدقة وتسأل عن الجرعة. هذا التحدي يهيئك للحوار الطبي المفتوح في تبويب Parler.' },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: { arabizi: 'S-slam 3likoum docteur ! 3endi l-hraq f r-rass w f l-me3da, w fiya s-skhana. Wash momkin ta3tini chi dwa ?', arabic: 'السَّلَامْ عْلِيكُمْ دُوكْتُورْ ! عَنْدِيْ لْحْرَاقْ فْ رَّاسِيْ وْ فْ لْمَعْدَةْ، وْ فِيَّا السَّخَانَةْ. وَاَشْ مُمْكِنْ تَعْطِينِيْ شِيْ دْوَا ؟', translation: { fr: "Bonjour docteur ! J'ai des brûlures à l'estomac et à la tête, et j'ai de la fièvre. Pouvez-vous me donner un médicament ?", en: "Hello doctor! I have heartburn and a headache,and I have fever. Can you give me some medicine?", es: '¡Hola doctor! Tengo acidez y dolor de cabeza, y tengo fiebre. ¿Puede darme alguna medicina?', ar: 'السلام عليكم دكتور! عندي حرقة في المعدة والرأس، وعندي سخانة. هل يمكنك إعطائي دواء؟' } },
              isOptimal: true,
              nextNpcLine: 'Kolo had d-dwa 2 mratt f n-nhar, 3la r-rass w l-me3da.',
              feedback: { fr: "Impeccable ! Vous décrivez précisément vos symptômes et demandez un traitement. Le médecin vous donne la posologie.", en: "Impeccable! You describe your symptoms precisely and ask foratreatment. The doctor gives you the dosage.", es: '¡Impecable! Describes tus síntomas con precisión y pides un tratamiento. El médico te da la posología.', ar: 'ممتاز! تصف أعراضك بدقة وتطلب علاجاً. يعطيك الطبيب الجرعة.' }
            },
            {
              id: 'boss_c2',
              text: { arabizi: 'L-hamdulillah, ana mzyan bezzaf. Wash nta?', arabic: 'لْحَمْدُولِلّٰهْ، أَنَا مْزْيَانْ بْزَّافْ. وَاشْ نْتَا ؟', translation: { fr: "Dieu merci, je vais très bien. Et vous ?", en: "Thank God, I am doing very well. And you?", es: 'Gracias a Dios, estoy muy bien. ¿Y usted?', ar: 'الحمد لله، أنا بخير جدا. وأنت؟' } },
              isOptimal: false,
              nextNpcLine: 'Wa lakin ana nchouf m3ak chi 7aja, sme7 liya.',
              feedback: { fr: "Presque ! Le médecin attend que vous décriviez vos symptômes, pas que vous disiez que tout va bien. Reformulez.", en: "Almost! The doctor expects you to describe your symptoms, not to say all is well. Rephrase.", es: '¡Casi! El médico espera que describas tus síntomas, no que digas que todo va bien. Reformula.', ar: 'تقريباً! الطبيب ينتظر أن تصف أعراضك، لا أن تقول أن كل شيء بخير. أعد الصياغة.' }
            },
            {
              id: 'boss_c3',
              text: { arabizi: 'Sme7 liya docteur, walakin 3andi l-me3da mchit.', arabic: 'سْمَحْ لِيَّةْ دُوكْتُورْ، وَلَاكِنْ عْنْدِيْ لْمَعْدَةْ مْشِيتْ.', translation: { fr: "Pardon docteur, mais mon estomac est parti.", en: "Excuse me doctor, but my stomach is gone.", es: 'Perdón doctor, pero mi estómago se ha ido.', ar: 'سامحني دكتور، لكن معدتي ذهبت.' } },
              isOptimal: false,
              nextNpcLine: '7na hna l-me3da, a sidi. Kolo fhamni chwiya.',
              feedback: { fr: "Attention : en darija « l-me3da mchit » exprime une douleur vive, pas une disparition. Décrivez plutôt la douleur et sa localisation.", en: "Careful:in Darija 'l-me3da mchit' describes sharp pain, not a disappearance. Describe the pain and its location instead.", es: 'Cuidado:en darija «l-me3da mchit» describe un dolor agudo, no un desaparecimiento. Describe el dolor y su ubicación.', ar: 'انتبه: في الدارجة « لمعدة مشيت » تعبر عن ألم حاد، لا عن اختفاء. صف الألم ومكانه بدلاً من ذلك.' }
            }
          ]
        }
      }
    ]
  }
];

import { Lesson } from '../types/curriculum';

export const module4Lessons: Lesson[] = [
  {
    id: 'm4_l1_passe',
    title: {
      fr: 'Le Passé Régulier',
      en: 'Regular Past Tense',
      es: 'El Pasado Regular',
      ar: 'الماضي المنتظم'
    },
    level: 4,
    description: {
      fr: 'Conjuguer au passé (-t, -ti, -na).',
      en: 'Conjugate in the past (-t, -ti, -na).',
      es: 'Conjugar en pasado (-t, -ti, -na).',
      ar: 'التصريف في الماضي (-t, -ti, -na).'
    },
    steps: [
      {
        id: 'm4_l1_s1',
        type: 'learning',
        content: {
          title: { fr: 'Le Passé : Je, Tu, Nous', en: 'Past: I, You, We', es: 'Pasado: Yo, Tú, Nosotros', ar: 'الماضي: أنا، أنت، نحن' },
          description: { 
            fr: 'En Darija, le passé utilise des suffixes : Je = -t, Tu = -ti, Nous = -na. Ex: Mcha (Aller) -> Mchit, Mchiti, Mchina.',
            en: 'In Darija, the past uses suffixes: I = -t, You = -ti, We = -na.',
            es: 'En Darija, el pasado usa sufijos: Yo = -t, Tú = -ti, Nosotros = -na.',
            ar: 'في الدارجة، يستخدم الماضي لواحق: أنا = -t، أنت = -ti، نحن = -na.'
          },
          arabizi: 'Mchit, mchiti, mchina.',
          arabic: 'مشيت، مشيتي، مشينا.',
          translation: { fr: 'Je suis allé, tu es allé, nous sommes allés.', en: 'I went, you went, we went.', es: 'Fui, fuiste, fuimos.', ar: 'ذهبت، ذهبت، ذهبنا.' }
        }
      },
      {
        id: 'm4_l1_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l1_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Tu es allé" ?', en: 'How to say "You went"?', es: '¿Cómo decir "Fuiste"?', ar: 'كيف تقول "ذهبت"؟' },
          options: [
            { id: 'o1', text: 'Mchit', isCorrect: false },
            { id: 'o2', text: 'Mchiti', isCorrect: true },
            { id: 'o3', text: 'Mchina', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Le suffixe pour "Tu" est "-ti" (Mchiti).', en: 'The suffix for "You" is "-ti".', es: 'El sufijo para "Tú" es "-ti".', ar: 'اللاحقة لـ "أنت" هي "-ti".' }
        }
      },
      {
        id: 'm4_l1_s3',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l1_2',
          type: 'mcq',
          prompt: { fr: 'Quel est le verbe "Manger" (Kla) au passé avec "Nous" ?', en: 'What is the verb "To eat" (Kla) in the past with "We"?', es: '¿Cuál es el verbo "Comer" (Kla) en pasado con "Nosotros"?', ar: 'ما هو الفعل "يأكل" (كلا) في الماضي مع "نحن"؟' },
          options: [
            { id: 'o1', text: 'Klit', isCorrect: false },
            { id: 'o2', text: 'Klina', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: 'Le suffixe pour "Nous" est "-na" (Klina).', en: 'The suffix for "We" is "-na".', es: 'El sufijo para "Nosotros" es "-na".', ar: 'اللاحقة لـ "نحن" هي "-na".' }
        }
      },
      {
        id: 'm4_l1_s4',
        type: 'learning',
        content: {
          title: { fr: 'Voir (Chaf)', en: 'See (Chaf)', es: 'Ver (Chaf)', ar: 'يرى (شاف)' },
          description: { fr: 'Chaf (Il a vu) -> Cheft (J\'ai vu), Chefti (Tu as vu).', en: 'Chaf (He saw) -> Cheft (I saw), Chefti (You saw).', es: 'Chaf (Él vio) -> Cheft (Yo vi), Chefti (Tú viste).', ar: 'شاف (هو رأى) -> شفت (أنا رأيت).' },
          arabizi: 'Cheft wa7ed l-kett.',
          arabic: 'شفت واحد القط.',
          translation: { fr: "J'ai vu un chat.", en: "I saw a cat.", es: "Vi un gato.", ar: "رأيت قطة." }
        }
      },
      {
        id: 'm4_l1_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l1_3',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "J\'ai vu"', en: 'Translate: "I saw"', es: 'Traduce: "Yo vi"', ar: 'ترجم: "رأيت"' },
          options: [
            { id: 'o1', text: 'Cheft', isCorrect: true },
            { id: 'o2', text: 'Chaf', isCorrect: false },
            { id: 'o3', text: 'Chefti', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Cheft = J\'ai vu. Chaf = Il a vu. Chefti = Tu as vu.', en: 'Cheft = I saw.', es: 'Cheft = Yo vi.', ar: 'شفت = رأيت.' }
        }
      }
    ]
  },
  {
    id: 'm4_l2_futur',
    title: {
      fr: 'Le Futur (Ghadi)',
      en: 'The Future (Ghadi)',
      es: 'El Futuro (Ghadi)',
      ar: 'المستقبل (غادي)'
    },
    level: 4,
    description: {
      fr: 'Exprimer des actions futures avec Ghadi.',
      en: 'Express future actions with Ghadi.',
      es: 'Expresar acciones futuras con Ghadi.',
      ar: 'التعبير عن أفعال مستقبلية باستخدام "غادي".'
    },
    steps: [
      {
        id: 'm4_l2_s1',
        type: 'learning',
        content: {
          title: { fr: 'Le Futur avec Ghadi', en: 'Future with Ghadi', es: 'Futuro con Ghadi', ar: 'المستقبل مع غادي' },
          description: { fr: 'On place "Ghadi" devant le verbe au présent sans le "ka-". Ex: Ghadi nsafer (Je vais voyager).', en: 'Place "Ghadi" before the present verb without "ka-".', es: 'Coloca "Ghadi" antes del verbo en presente sin "ka-".', ar: 'نضع "غادي" قبل الفعل المضارع بدون "ka-".' },
          arabizi: 'Ghadi nsafer ghedda.',
          arabic: 'غادي نسافر غدا.',
          translation: { fr: "Je vais voyager demain.", en: "I will travel tomorrow.", es: "Voy a viajar mañana.", ar: "سأسافر غداً." }
        }
      },
      {
        id: 'm4_l2_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l2_1',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "Je vais voyager" ?', en: 'How to say "I will travel"?', es: '¿Cómo se dice "Voy a viajar"?', ar: 'كيف تقول "سأسافر"؟' },
          options: [
            { id: 'o1', text: 'Ka-nsafer', isCorrect: false },
            { id: 'o2', text: 'Ghadi nsafer', isCorrect: true },
            { id: 'o3', text: 'Safert', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Ghadi + nsafer (verbe sans ka-). Ka-nsafer = je voyage (présent).', en: 'Ghadi + nsafer.', es: 'Ghadi + nsafer.', ar: 'غادي + نسافر.' }
        }
      },
      {
        id: 'm4_l2_s3',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l2_2',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Tu vas voir"', en: 'Translate: "You will see"', es: 'Traduce: "Vas a ver"', ar: 'ترجم: "سوف ترى"' },
          options: [
            { id: 'o1', text: 'Ghadi tchouf', isCorrect: true },
            { id: 'o2', text: 'Ghadi nchouf', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'tchouf = tu vois. Ghadi tchouf = tu vas voir.', en: 'tchouf = you see.', es: 'tchouf = tú ves.', ar: 'تشوف = أنت ترى.' }
        }
      },
      {
        id: 'm4_l2_s4',
        type: 'learning',
        content: {
          title: { fr: 'Futur : Elle va', en: 'Future: She will', es: 'Futuro: Ella va', ar: 'المستقبل: هي سوف' },
          description: { fr: 'On utilise souvent "Ghadya" au féminin, mais "Ghadi" est accepté partout.', en: 'Use "Ghadya" for feminine, but "Ghadi" is widely accepted.', es: 'Se usa "Ghadya" para femenino, pero "Ghadi" se acepta.', ar: 'نستخدم "غاديا" للمؤنث، ولكن "غادي" مقبولة أيضاً.' },
          arabizi: 'Ghadi tmshi.',
          arabic: 'غادي تمشي.',
          translation: { fr: "Elle va partir.", en: "She will go.", es: "Ella se irá.", ar: "هي سوف تذهب." }
        }
      },
      {
        id: 'm4_l2_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l2_3',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Ghadi tmshi" ?', en: 'What does "Ghadi tmshi" mean?', es: '¿Qué significa "Ghadi tmshi"?', ar: 'ماذا تعني "غادي تمشي"؟' },
          options: [
            { id: 'o1', text: 'Je vais partir', isCorrect: false },
            { id: 'o2', text: 'Elle va partir (ou Tu vas partir)', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: '"tmshi" peut vouloir dire "tu pars" ou "elle part" selon le contexte.', en: 'tmshi = you go or she goes.', es: 'tmshi = tú vas o ella va.', ar: 'تمشي = أنت تذهب أو هي تذهب.' }
        }
      }
    ]
  },
  {
    id: 'm4_l3_modaux',
    title: {
      fr: 'Souhait & Obligation',
      en: 'Wish & Obligation',
      es: 'Deseo y Obligación',
      ar: 'التمني والالتزام'
    },
    level: 4,
    description: {
      fr: 'Exprimer ce qu\'on veut (bghit) ou doit faire (khassni).',
      en: 'Express what you want or must do.',
      es: 'Expresar lo que quieres o debes hacer.',
      ar: 'التعبير عما تريده أو ما يجب عليك فعله.'
    },
    steps: [
      {
        id: 'm4_l3_s1',
        type: 'learning',
        content: {
          title: { fr: 'Obligation (Khass)', en: 'Obligation (Khass)', es: 'Obligación (Khass)', ar: 'الالتزام (خاص)' },
          description: { fr: 'Khassni (Je dois), Khass-k (Tu dois). Suivi du verbe au présent sans ka-.', en: 'Khassni (I must), followed by present verb without ka-.', es: 'Khassni (Debo), seguido de verbo presente sin ka-.', ar: 'خصني (يجب علي)، يليه الفعل المضارع بدون ka-.' },
          arabizi: 'Khassni nmshi daba.',
          arabic: 'خصني نمشي دابا.',
          translation: { fr: "Je dois partir maintenant.", en: "I must go now.", es: "Debo irme ahora.", ar: "يجب أن أذهب الآن." }
        }
      },
      {
        id: 'm4_l3_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Tu dois" ?', en: 'How to say "You must"?', es: '¿Cómo decir "Debes"?', ar: 'كيف تقول "يجب عليك"؟' },
          options: [
            { id: 'o1', text: 'Khassni', isCorrect: false },
            { id: 'o2', text: 'Khass-k', isCorrect: true },
            { id: 'o3', text: 'Bghiti', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Le suffixe "-k" indique "Toi" (Tu dois).', en: 'Suffix "-k" means "You".', es: 'Sufijo "-k" significa "Tú".', ar: 'اللاحقة "-k" تعني "أنت".' }
        }
      },
      {
        id: 'm4_l3_s3',
        type: 'learning',
        content: {
          title: { fr: 'Pouvoir (9der)', en: 'Can (9der)', es: 'Poder (9der)', ar: 'القدرة (قدر)' },
          description: { fr: 'Ne9der (Je peux), Te9der (Tu peux).', en: 'Ne9der (I can).', es: 'Ne9der (Puedo).', ar: 'نقدر (أستطيع).' },
          arabizi: 'Ne9der n3awnek ?',
          arabic: 'نقدر نعاونك؟',
          translation: { fr: "Est-ce que je peux t'aider ?", en: "Can I help you?", es: "¿Puedo ayudarte?", ar: "هل يمكنني مساعدتك؟" }
        }
      },
      {
        id: 'm4_l3_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_2',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Je peux t\'aider"', en: 'Translate: "I can help you"', es: 'Traduce: "Puedo ayudarte"', ar: 'ترجم: "أستطيع مساعدتك"' },
          options: [
            { id: 'o1', text: 'Ne9der n3awnek', isCorrect: true },
            { id: 'o2', text: 'Khassni n3awnek', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Ne9der = je peux. Khassni = je dois.', en: 'Ne9der = I can. Khassni = I must.', es: 'Ne9der = Puedo. Khassni = Debo.', ar: 'نقدر = أستطيع.' }
        }
      },
      {
        id: 'm4_l3_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_3',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Bghit nmshi" ?', en: 'What does "Bghit nmshi" mean?', es: '¿Qué significa "Bghit nmshi"?', ar: 'ماذا تعني "بغيت نمشي"؟' },
          options: [
            { id: 'o1', text: 'Je veux y aller', isCorrect: true },
            { id: 'o2', text: 'Je dois y aller', isCorrect: false },
            { id: 'o3', text: 'Je peux y aller', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Bghit = Je veux (le verbe s\'utilise au passé pour un souhait présent).', en: 'Bghit = I want.', es: 'Bghit = Quiero.', ar: 'بغيت = أريد.' }
        }
      }
    ]
  },
  {
    id: 'm4_l4_connecteurs',
    title: {
      fr: 'Récit & Connecteurs',
      en: 'Story & Connectors',
      es: 'Relato y Conectores',
      ar: 'السرد والروابط'
    },
    level: 4,
    description: {
      fr: 'Articuler ses phrases (parce que, mais, ensuite).',
      en: 'Articulate sentences (because, but, then).',
      es: 'Articular oraciones (porque, pero, luego).',
      ar: 'ربط الجمل (لأن، لكن، ثم).'
    },
    steps: [
      {
        id: 'm4_l4_s1',
        type: 'learning',
        content: {
          title: { fr: 'Mais & Parce que', en: 'But & Because', es: 'Pero y Porque', ar: 'لكن ولأن' },
          description: { fr: 'Walakin (Mais), 7it (Parce que).', en: 'Walakin (But), 7it (Because).', es: 'Walakin (Pero), 7it (Porque).', ar: 'ولكن (لكن)، حيت (لأن).' },
          arabizi: 'Bghit nmshi walakin khassni nkhdem 7it 3endi bezzaf d-shghol.',
          arabic: 'بغيت نمشي ولكن خصني نخدم حيت عندي بزاف دشغل.',
          translation: { fr: "Je veux y aller mais je dois travailler parce que j'ai beaucoup de travail.", en: "I want to go but I must work because I have a lot of work.", es: "Quiero ir pero debo trabajar porque tengo mucho trabajo.", ar: "أريد الذهاب لكن يجب أن أعمل لأن لدي الكثير من العمل." }
        }
      },
      {
        id: 'm4_l4_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Parce que" ?', en: 'How to say "Because"?', es: '¿Cómo decir "Porque"?', ar: 'كيف تقول "لأن"؟' },
          options: [
            { id: 'o1', text: 'Walakin', isCorrect: false },
            { id: 'o2', text: '7it', isCorrect: true },
            { id: 'o3', text: 'Men be3d', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: '7it = Parce que. Walakin = Mais.', en: '7it = Because.', es: '7it = Porque.', ar: 'حيت = لأن.' }
        }
      },
      {
        id: 'm4_l4_s3',
        type: 'learning',
        content: {
          title: { fr: 'Ensuite / Après', en: 'Then / After', es: 'Luego / Después', ar: 'ثم / بعد ذلك' },
          description: { fr: 'Men be3d (Après / Ensuite).', en: 'Men be3d (After / Then).', es: 'Men be3d (Después / Luego).', ar: 'من بعد (بعد / ثم).' },
          arabizi: 'Nfeter, u men be3d nmshi.',
          arabic: 'نفطر، و من بعد نمشي.',
          translation: { fr: "Je prends mon petit-déjeuner, et ensuite j'y vais.", en: "I eat breakfast, and then I go.", es: "Desayuno, y luego me voy.", ar: "أفطر، ومن بعد أذهب." }
        }
      },
      {
        id: 'm4_l4_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_2',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Mais je suis malade"', en: 'Translate: "But I am sick"', es: 'Traduce: "Pero estoy enfermo"', ar: 'ترجم: "لكنني مريض"' },
          options: [
            { id: 'o1', text: 'Walakin ana mrid', isCorrect: true },
            { id: 'o2', text: '7it ana mrid', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Walakin = Mais. 7it = Parce que.', en: 'Walakin = But.', es: 'Walakin = Pero.', ar: 'ولكن = لكن.' }
        }
      },
      {
        id: 'm4_l4_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_3',
          type: 'mcq',
          prompt: { fr: 'Que veut dire "Men be3d" ?', en: 'What does "Men be3d" mean?', es: '¿Qué significa "Men be3d"?', ar: 'ماذا تعني "من بعد"؟' },
          options: [
            { id: 'o1', text: 'Avant', isCorrect: false },
            { id: 'o2', text: 'Après / Ensuite', isCorrect: true },
            { id: 'o3', text: 'Aujourd\'hui', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Men be3d = Après ou Ensuite. 9bel = Avant.', en: 'Men be3d = After/Then.', es: 'Men be3d = Después/Luego.', ar: 'من بعد = بعد أو ثم.' }
        }
      }
    ]
  }
];

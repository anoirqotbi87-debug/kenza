import { Lesson } from '../types/curriculum';

export const module4Lessons: Lesson[] = [
  {
    id: 'm4_l1_passe',
    title: {
      fr: 'Le Passé (L-Madi)',
      en: 'Past Tense (L-Madi)',
      es: 'El Pasado (L-Madi)',
      ar: 'الماضي'
    },
    level: 4,
    description: {
      fr: 'Raconter des événements passés et utiliser les connecteurs temporels.',
      en: 'Tell past events and use time connectors.',
      es: 'Contar eventos pasados y usar conectores temporales.',
      ar: 'سرد أحداث الماضي واستخدام الروابط الزمنية.'
    },
    steps: [
      {
        id: 'm4_l1_s1',
        type: 'learning',
        content: {
          title: { fr: 'Les suffixes du passé', en: 'Past suffixes', es: 'Sufijos del pasado', ar: 'لواحق الماضي' },
          description: { 
            fr: 'Au passé, les verbes prennent des suffixes : Je = -t, Tu = -ti, Elle = -at, Nous = -na, Ils = -ou. Ex: Kteb ➔ Ktebt, Ktebti, Ketbat, Ktebna, Ketbou.',
            en: 'In the past, verbs take suffixes: I = -t, You = -ti, She = -at, We = -na, They = -ou.',
            es: 'En el pasado, los verbos toman sufijos: Yo = -t, Tú = -ti, Ella = -at, Nosotros = -na, Ellos = -ou.',
            ar: 'في الماضي، تأخذ الأفعال لواحق: أنا = -t، أنت = -ti، هي = -at، نحن = -na، هم = -ou.'
          },
          arabizi: 'Ktebt, ketbat, ktebna, ketbou.',
          arabic: 'كتبت، كتبات، كتبنا، كتبوا.',
          translation: { fr: 'J\'ai écrit, elle a écrit, nous avons écrit, ils ont écrit.', en: 'I wrote, she wrote, we wrote, they wrote.', es: 'Escribí, ella escribió, escribimos, escribieron.', ar: 'كتبت، كتبت، كتبنا، كتبوا.' }
        }
      },
      {
        id: 'm4_l1_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l1_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Elle a écrit" ?', en: 'How to say "She wrote"?', es: '¿Cómo decir "Ella escribió"?', ar: 'كيف تقول "كتبت"؟' },
          options: [
            { id: 'o1', text: 'Ktebti', isCorrect: false },
            { id: 'o2', text: 'Ketbat', isCorrect: true },
            { id: 'o3', text: 'Ketbou', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Le suffixe pour "Elle" est "-at" (Ketbat).', en: 'The suffix for "She" is "-at".', es: 'El sufijo para "Ella" es "-at".', ar: 'اللاحقة لـ "هي" هي "-at".' }
        }
      },
      {
        id: 'm4_l1_s3',
        type: 'learning',
        content: {
          title: { fr: 'Verbes irréguliers (Mcha)', en: 'Irregular verbs (Mcha)', es: 'Verbos irregulares (Mcha)', ar: 'الأفعال غير المنتظمة (مشى)' },
          description: { fr: 'Les verbes se terminant par une voyelle perdent souvent cette voyelle. Mcha (Aller) ➔ Mchit (Je suis allé). Pour "Ils", on ajoute -w : Mchaw.', en: 'Verbs ending in a vowel often lose it. Mcha (Go) ➔ Mchit (I went). They went = Mchaw.', es: 'Los verbos que terminan en vocal a menudo la pierden. Mcha (Ir) ➔ Mchit (Fui). Ellos fueron = Mchaw.', ar: 'الأفعال المنتهية بحرف علة غالبا ما تفقده. مشى ➔ مشيت. هم ذهبوا ➔ مشاو.' },
          arabizi: 'Mchaw l-bar7 l-mdina.',
          arabic: 'مشاو لبارح لمدينة.',
          translation: { fr: "Ils sont allés hier à la médina.", en: "They went to the medina yesterday.", es: "Fueron a la medina ayer.", ar: "ذهبوا البارحة إلى المدينة." }
        }
      },
      {
        id: 'm4_l1_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l1_2',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Nous sommes allés"', en: 'Translate: "We went"', es: 'Traduce: "Fuimos"', ar: 'ترجم: "مشينا"' },
          options: [
            { id: 'o1', text: 'Mchit', isCorrect: false },
            { id: 'o2', text: 'Mchaw', isCorrect: false },
            { id: 'o3', text: 'Mchina', isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Le suffixe pour "Nous" est "-na", donc Mcha ➔ Mchina.', en: 'Suffix for "We" is "-na".', es: 'Sufijo para "Nosotros" es "-na".', ar: 'اللاحقة لـ "نحن" هي "-na".' }
        }
      },
      {
        id: 'm4_l1_s5',
        type: 'learning',
        content: {
          title: { fr: 'Connecteurs Temporels', en: 'Time Connectors', es: 'Conectores de Tiempo', ar: 'الروابط الزمنية' },
          description: { fr: 'L-bareh (Hier), L-3am l-fayet (L\'année dernière), Men be3d (Après).', en: 'L-bareh (Yesterday), L-3am l-fayet (Last year), Men be3d (After).', es: 'L-bareh (Ayer), L-3am l-fayet (El año pasado), Men be3d (Después).', ar: 'البارح، العام الفايت، من بعد.' },
          arabizi: 'L-bareh, mchit l-sbitar, men be3d rje3t l-dar.',
          arabic: 'البارح، مشيت لسبيطار، من بعد رجعت لدار.',
          translation: { fr: "Hier, je suis allé à l'hôpital, après je suis rentré à la maison.", en: "Yesterday, I went to the hospital, then I returned home.", es: "Ayer fui al hospital, luego volví a casa.", ar: "البارحة، ذهبت إلى المستشفى، ثم عدت إلى المنزل." }
        }
      }
    ]
  },
  {
    id: 'm4_l2_present',
    title: {
      fr: 'Le Présent (Ka- / Ta-)',
      en: 'The Present (Ka- / Ta-)',
      es: 'El Presente (Ka- / Ta-)',
      ar: 'المضارع (كا- / تا-)'
    },
    level: 4,
    description: {
      fr: 'Exprimer des habitudes et l\'état continu.',
      en: 'Express habits and continuous state.',
      es: 'Expresar hábitos y estado continuo.',
      ar: 'التعبير عن العادات والحالة المستمرة.'
    },
    steps: [
      {
        id: 'm4_l2_s1',
        type: 'learning',
        content: {
          title: { fr: 'Le présent : Je, Il, Elle', en: 'Present: I, He, She', es: 'Presente: Yo, Él, Ella', ar: 'المضارع: أنا، هو، هي' },
          description: { fr: 'Le présent habituel s\'utilise avec le préfixe "ka-" + préfixe personnel. Ana ➔ ka-n... (ka-nkteb). Houwa ➔ ka-y... (ka-ykteb). Hiya ➔ ka-t... (ka-tkteb).', en: 'Habitual present uses "ka-" + personal prefix. Ana ➔ ka-n... Houwa ➔ ka-y... Hiya ➔ ka-t...', es: 'El presente habitual usa "ka-" + prefijo personal.', ar: 'المضارع المعتاد يستخدم "كا-" + سابقة شخصية.' },
          arabizi: 'Ana ka-nkteb, houwa ka-ykteb.',
          arabic: 'أنا كنكتب، هو كيكتب.',
          translation: { fr: "J'écris, il écrit.", en: "I write, he writes.", es: "Escribo, él escribe.", ar: "أنا أكتب، هو يكتب." }
        }
      },
      {
        id: 'm4_l2_s2',
        type: 'learning',
        content: {
          title: { fr: 'Le présent : Pluriel & Féminin', en: 'Present: Plural & Feminine', es: 'Presente: Plural y Femenino', ar: 'المضارع: الجمع والمؤنث' },
          description: { fr: 'Tu (f) ➔ ka-t...i (ka-tketbi). Nous ➔ ka-n...ou (ka-nketbou). Vous ➔ ka-t...ou (ka-tketbou). Ils/Elles ➔ ka-y...ou (ka-yketbou).', en: 'You (f) ➔ ka-t...i. We ➔ ka-n...ou. You (pl) ➔ ka-t...ou. They ➔ ka-y...ou.', es: 'Tú (f) ➔ ka-t...i. Nosotros ➔ ka-n...ou. Ustedes ➔ ka-t...ou. Ellos ➔ ka-y...ou.', ar: 'أنتِ ➔ كتكتبي. نحن ➔ كنكتبو. أنتم ➔ كتكتبو. هم ➔ كيكتبو.' },
          arabizi: 'Nti ka-tketbi. Hna ka-nketbou.',
          arabic: 'نتي كتكتبي. حنا كنكتبو.',
          translation: { fr: "Tu (f) écris. Nous écrivons.", en: "You (f) write. We write.", es: "Tú (f) escribes. Nosotros escribimos.", ar: "أنتِ تكتبين. نحن نكتب." }
        }
      },
      {
        id: 'm4_l2_s3',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l2_1',
          type: 'mcq',
          prompt: { fr: 'Traduisez "Ils écrivent"', en: 'Translate "They write"', es: 'Traduce "Ellos escriben"', ar: 'ترجم "هم يكتبون"' },
          options: [
            { id: 'o1', text: 'Ka-tketbou', isCorrect: false },
            { id: 'o2', text: 'Ka-yketbou', isCorrect: true },
            { id: 'o3', text: 'Ka-ykteb', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Ils = Houma ➔ ka-y...ou (Ka-yketbou).', en: 'They = Houma ➔ ka-y...ou.', es: 'Ellos = Houma ➔ ka-y...ou.', ar: 'هم = هما ➔ كيكتبو.' }
        }
      },
      {
        id: 'm4_l2_s4',
        type: 'learning',
        content: {
          title: { fr: 'Bonus Culturel : Ta- vs Ka-', en: 'Cultural Bonus: Ta- vs Ka-', es: 'Bono Cultural: Ta- vs Ka-', ar: 'ملاحظة ثقافية: تا- ضد كا-' },
          description: { fr: 'Dans beaucoup de régions (Fès, Meknès, centre), la particule "ta-" remplace "ka-". C\'est 100% équivalent ! Ta-nkteb = Ka-nkteb.', en: 'In many regions, "ta-" replaces "ka-". They are 100% identical! Ta-nkteb = Ka-nkteb.', es: 'En muchas regiones, "ta-" reemplaza a "ka-". ¡Son 100% idénticos!', ar: 'في العديد من المناطق، تحل "تا-" محل "كا-". إنها متطابقة بنسبة 100٪!' },
          arabizi: 'Ta-nmchi l-souk.',
          arabic: 'تنمشي لسوق.',
          translation: { fr: "Je vais au marché (habitude).", en: "I go to the market (habit).", es: "Voy al mercado (hábito).", ar: "أذهب إلى السوق." }
        }
      },
      {
        id: 'm4_l2_s5',
        type: 'learning',
        content: {
          title: { fr: 'Verbes d\'action réguliers', en: 'Regular action verbs', es: 'Verbos de acción regulares', ar: 'أفعال الحركة' },
          description: { fr: 'Attention aux irréguliers très fréquents : Manger (Kla) ➔ ka-nakol. Boire (Chreb) ➔ ka-nchreb. Aller (Mcha) ➔ ka-nmchi.', en: 'Watch out for common irregulars: Eat (Kla) ➔ ka-nakol. Drink (Chreb) ➔ ka-nchreb. Go (Mcha) ➔ ka-nmchi.', es: 'Cuidado con los irregulares comunes: Comer ➔ ka-nakol. Beber ➔ ka-nchreb. Ir ➔ ka-nmchi.', ar: 'احذر الأفعال الشائعة: أكل ➔ كناكل. شرب ➔ كنشرب. مشى ➔ كنمشي.' },
          arabizi: 'Koll sbah, ka-nchreb atay ou ka-nakol l-khobz.',
          arabic: 'كل صباح، كنشرب أتاي وكناكل الخبز.',
          translation: { fr: "Chaque matin, je bois du thé et je mange du pain.", en: "Every morning, I drink tea and eat bread.", es: "Cada mañana bebo té y como pan.", ar: "كل صباح، أشرب الشاي وآكل الخبز." }
        }
      },
      {
        id: 'm4_l2_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l2_2',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Elle boit" ?', en: 'How to say "She drinks"?', es: '¿Cómo decir "Ella bebe"?', ar: 'كيف تقول "هي تشرب"؟' },
          options: [
            { id: 'o1', text: 'Ka-tchreb', isCorrect: true },
            { id: 'o2', text: 'Ka-ychreb', isCorrect: false },
            { id: 'o3', text: 'Ka-nchreb', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Elle (Hiya) ➔ ka-t... (Ka-tchreb).', en: 'She (Hiya) ➔ ka-t... (Ka-tchreb).', es: 'Ella (Hiya) ➔ ka-t... (Ka-tchreb).', ar: 'هي ➔ كتشرب.' }
        }
      }
    ]
  },
  {
    id: 'm4_l3_futur_negation',
    title: {
      fr: 'Futur & Négation',
      en: 'Future & Negation',
      es: 'Futuro y Negación',
      ar: 'المستقبل والنفي'
    },
    level: 4,
    description: {
      fr: 'Ghadi, gha- et l\'encadrement négatif (ma...ch).',
      en: 'Ghadi, gha- and negative framing (ma...ch).',
      es: 'Ghadi, gha- y el marco negativo (ma...ch).',
      ar: 'غادي، غا- والنفي (ما...ش).'
    },
    steps: [
      {
        id: 'm4_l3_s1',
        type: 'learning',
        content: {
          title: { fr: 'La règle d\'or du Futur', en: 'Golden rule of Future', es: 'Regla de oro del Futuro', ar: 'القاعدة الذهبية للمستقبل' },
          description: { fr: 'La particule "ghadi" (ou "gha-") s\'accole au verbe conjugué au présent SANS le "ka-". Gha-nmchi (J\'irai). On ne dit jamais "gha-ka-nmchi".', en: 'The particle "ghadi" attaches to the present verb WITHOUT "ka-". Gha-nmchi (I will go). Never "gha-ka-nmchi".', es: 'La partícula "ghadi" se une al verbo en presente SIN "ka-".', ar: 'ترتبط "غادي" بالفعل المضارع بدون "كا-".' },
          arabizi: 'Gha-nmchi. Ghadi nchoufou.',
          arabic: 'غانمشي. غادي نشوفو.',
          translation: { fr: "J'irai. Nous verrons.", en: "I will go. We will see.", es: "Iré. Veremos.", ar: "سأذهب. سنرى." }
        }
      },
      {
        id: 'm4_l3_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Tu vas écrire" (à un homme) ?', en: 'How to say "You will write" (to a man)?', es: '¿Cómo decir "Escribirás" (a un hombre)?', ar: 'كيف تقول "ستكتب"؟' },
          options: [
            { id: 'o1', text: 'Gha-tkteb', isCorrect: true },
            { id: 'o2', text: 'Gha-ka-tkteb', isCorrect: false },
            { id: 'o3', text: 'Ghadi ktebti', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Gha- (futur) + tkteb (présent sans ka-).', en: 'Gha- + tkteb.', es: 'Gha- + tkteb.', ar: 'غا- + تكتب.' }
        }
      },
      {
        id: 'm4_l3_s3',
        type: 'learning',
        content: {
          title: { fr: 'La Négation : Le Sandwich (Ma...ch)', en: 'Negation: The Sandwich (Ma...ch)', es: 'Negación: El Sándwich (Ma...ch)', ar: 'النفي (ما...ش)' },
          description: { fr: 'Pour nier un verbe, encadrez-le avec Ma ... ch. Au passé : Ma-mchit-ch (Je ne suis pas allé). Au présent, le "ka-" reste encadré : Ma-ka-nchreb-ch (Je ne bois pas).', en: 'To negate a verb, wrap it with Ma ... ch. Past: Ma-mchit-ch. Present: Ma-ka-nchreb-ch.', es: 'Para negar un verbo, envuélvelo con Ma ... ch.', ar: 'لنفي فعل، استخدم ما ... ش. الماضي: مامشيتش. المضارع: ماكنشربش.' },
          arabizi: 'Ma-kla-ch l-ftour.',
          arabic: 'ماكلاش الفطور.',
          translation: { fr: "Il n'a pas mangé le petit-déjeuner.", en: "He didn't eat breakfast.", es: "Él no comió el desayuno.", ar: "لم يأكل الفطور." }
        }
      },
      {
        id: 'm4_l3_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_2',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Je ne mange pas" ?', en: 'How to say "I don\'t eat"?', es: '¿Cómo decir "No como"?', ar: 'كيف تقول "لا آكل"؟' },
          options: [
            { id: 'o1', text: 'Ma-nakol-ch', isCorrect: false },
            { id: 'o2', text: 'Ma-ka-nakol-ch', isCorrect: true },
            { id: 'o3', text: 'Ka-ma-nakol', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Au présent, "ka-" est inclus dans la négation : Ma + ka-nakol + ch.', en: 'In the present, "ka-" is included: Ma + ka-nakol + ch.', es: 'En presente, "ka-" está incluido.', ar: 'في المضارع، "كا-" مشمولة.' }
        }
      },
      {
        id: 'm4_l3_s5',
        type: 'learning',
        content: {
          title: { fr: 'Négation au Futur & "Machi"', en: 'Future Negation & "Machi"', es: 'Negación Futura y "Machi"', ar: 'نفي المستقبل و "ماشي"' },
          description: { fr: 'Au futur : Ma-ghadi-ch nmchi (ou Ma-gha-nmchi-ch). Pour nier un adjectif ou un adverbe (pas un verbe), on utilise "Machi". Machi daba (Pas maintenant), Machi mochkil (Pas de problème).', en: 'Future: Ma-ghadi-ch nmchi. For adjectives/adverbs, use "Machi". Machi daba (Not now).', es: 'Futuro: Ma-ghadi-ch nmchi. Para adjetivos, usa "Machi".', ar: 'في المستقبل: ماغاديش نمشي. لنفي صفة أو ظرف، استخدم "ماشي".' },
          arabizi: 'Machi mochkil, ma-ghadi-ch nqle9.',
          arabic: 'ماشي مشكل، ماغاديش نقلق.',
          translation: { fr: "Pas de problème, je ne vais pas m'inquiéter.", en: "No problem, I won't worry.", es: "No hay problema, no me preocuparé.", ar: "لا مشكلة، لن أقلق." }
        }
      },
      {
        id: 'm4_l3_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l3_3',
          type: 'mcq',
          prompt: { fr: 'Complétez : "... mochkil" (Pas de problème)', en: 'Fill in: "... mochkil" (No problem)', es: 'Completa: "... mochkil" (No hay problema)', ar: 'أكمل: "... مشكل"' },
          options: [
            { id: 'o1', text: 'Ma-mochkil-ch', isCorrect: false },
            { id: 'o2', text: 'Machi', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: 'Pour un nom/adjectif, on utilise "Machi".', en: 'For nouns/adjectives, use "Machi".', es: 'Para sustantivos/adjetivos, usa "Machi".', ar: 'للأسماء والصفات، استخدم "ماشي".' }
        }
      }
    ]
  },
  {
    id: 'm4_l4_modaux',
    title: {
      fr: 'Les Modaux (Khas, Qedd, Bgha)',
      en: 'Modals (Khas, Qedd, Bgha)',
      es: 'Modales (Khas, Qedd, Bgha)',
      ar: 'الأفعال الناقصة'
    },
    level: 4,
    description: {
      fr: 'Obligation (Khasni), Capacité (Qedd), Volonté (Bgha).',
      en: 'Obligation, Ability, Will.',
      es: 'Obligación, Capacidad, Voluntad.',
      ar: 'الالتزام، القدرة، الإرادة.'
    },
    steps: [] // Skeleton to fill later
  },
  {
    id: 'm4_checkpoint_b1',
    title: {
      fr: 'Checkpoint B1',
      en: 'Checkpoint B1',
      es: 'Checkpoint B1',
      ar: 'نقطة تفتيش B1'
    },
    level: 4,
    description: {
      fr: 'Validation du niveau B1 (Temps, Négation, Modaux).',
      en: 'Validation of B1 level.',
      es: 'Validación del nivel B1.',
      ar: 'تقييم مستوى B1.'
    },
    steps: [] // Skeleton for Checkpoint to fill later
  }
];

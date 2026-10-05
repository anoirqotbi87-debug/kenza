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
          arabic: 'كْتَبْتْ، كْتَبَاتْ، كْتَبْنَا، كْتَبُواْ.',
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
          arabic: 'مْشَاوْ لْبَارَحْ لْمَدِينَةْ.',
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
          arabic: 'البَارَحْ، مْشِيتْ لَسْبِيطَارْ، مَن بَعْدْ رْجَعْتْ لْدَارْ.',
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
          arabic: 'أَنَا كَنْكْتَبْ، هُوْ كَيْكْتَبْ.',
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
          arabic: 'نْتِي كْتَكْبِيْ. حْنَا كَنْكْتَبُوْ.',
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
          arabic: 'تْنَمْشِي لَسُّوقْ.',
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
          arabic: 'كُلّ صْبَاحْ، كَنْشْرَبْ أَتَايْ وْ كَنَاكُلْ الخُبْزْ.',
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
          arabic: 'غَادِي نْمْشِيْ. غَادِي نْشُوفُوْ.',
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
          arabic: 'مَا كْلَاشْ الفْطُورْ.',
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
          arabic: 'مَاشِي مُشْكِلْ، مَاغَادِيشْ نْقَلَّقْ.',
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
    steps: [
      {
        id: 'm4_l4_s1',
        type: 'learning',
        content: {
          title: { fr: 'L\'obligation (Khassni)', en: 'Obligation (Khassni)', es: 'Obligación (Khassni)', ar: 'الالتزام (خاصني)' },
          description: { fr: 'Le verbe "devoir" (khass) se conjugue avec des pronoms objets : Khass-ni, khass-ek, khass-ou, khass-ha, khass-na, khass-koum, khass-houm. Le verbe qui suit est à l\'inaccompli SANS "ka-".', en: 'Khass takes object pronouns. The following verb is imperfective WITHOUT "ka-".', es: 'Khass toma pronombres objeto. El verbo siguiente va sin "ka-".', ar: 'الفعل "خاص" يأخذ ضمائر المفعول. الفعل التالي يكون في المضارع بدون "كا-".' },
          arabizi: 'Khassna nchoufou l-tbib.',
          arabic: 'خَاصْنَا نْشُوفُوْ الطَّبِيبْ.',
          translation: { fr: "Nous devons voir le médecin.", en: "We must see the doctor.", es: "Debemos ver al médico.", ar: "يجب أن نرى الطبيب." }
        }
      },
      {
        id: 'm4_l4_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_1',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Je dois partir"', en: 'Translate: "I must go"', es: 'Traduce: "Debo irme"', ar: 'ترجم: "يجب أن أذهب"' },
          options: [
            { id: 'o1', text: 'Khassni nemchi', isCorrect: true },
            { id: 'o2', text: 'Khassni ka-nmchi', isCorrect: false },
            { id: 'o3', text: 'Khass nemchi', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Khassni + verbe sans ka- (nemchi).', en: 'Khassni + verb without ka- (nemchi).', es: 'Khassni + verbo sin ka- (nemchi).', ar: 'خاصني + فعل بدون كا-.' }
        }
      },
      {
        id: 'm4_l4_s3',
        type: 'learning',
        content: {
          title: { fr: 'La volonté (Bgha)', en: 'Will (Bgha)', es: 'Voluntad (Bgha)', ar: 'الإرادة (بغى)' },
          description: { fr: 'Pour exprimer un souhait au présent, on utilise le verbe Bgha au PASSÉ ! Bghit (Je veux), Bghiti (Tu veux), Bgha (Il veut), Bghat (Elle veut).', en: 'To express a present wish, use Bgha in the PAST tense! Bghit (I want), Bghiti (You want).', es: 'Para expresar un deseo presente, ¡usa Bgha en PASADO! Bghit (Quiero), Bghiti (Quieres).', ar: 'للتعبير عن رغبة في الحاضر، نستخدم الفعل بغى في الماضي! بغيت (أريد)، بغيتي (تريد).' },
          arabizi: 'Bghit nchreb qahwa.',
          arabic: 'بْغِيتْ نْشْرَبْ قَهْوَةْ.',
          translation: { fr: "Je voudrais boire un café.", en: "I would like to drink a coffee.", es: "Me gustaría beber un café.", ar: "أريد أن أشرب قهوة." }
        }
      },
      {
        id: 'm4_l4_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_2',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Tu veux" ?', en: 'How to say "You want"?', es: '¿Cómo decir "Quieres"?', ar: 'كيف تقول "تريد"؟' },
          options: [
            { id: 'o1', text: 'Ka-tbghi', isCorrect: false },
            { id: 'o2', text: 'Bghit', isCorrect: false },
            { id: 'o3', text: 'Bghiti', isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Bgha au passé pour "Tu" devient Bghiti.', en: 'Bgha in past for "You" is Bghiti.', es: 'Bgha en pasado para "Tú" es Bghiti.', ar: '"بغى" في الماضي لـ "أنت" هي "بغيتي".' }
        }
      },
      {
        id: 'm4_l4_s5',
        type: 'learning',
        content: {
          title: { fr: 'Capacité : Qedd vs Moumkin', en: 'Capacity: Qedd vs Moumkin', es: 'Capacidad: Qedd vs Moumkin', ar: 'القدرة: قد ضد ممكن' },
          description: { fr: 'Qedd indique une capacité physique/temporelle (Tqedd t3awenni ? = Peux-tu m\'aider ?). Moumkin est invariable et indique une possibilité générale (Moumkin nchouf l-menu ?).', en: 'Qedd = physical capacity. Moumkin = general possibility.', es: 'Qedd = capacidad física. Moumkin = posibilidad general.', ar: 'قد = القدرة البدنية/الزمنية. ممكن = إمكانية عامة.' },
          arabizi: 'Moumkin nchouf l-menu ? Tqedd t3awenni 3afak ?',
          arabic: 'مُمْكِنْ نْشُوفْ المِينُوْ؟ تْقَدَّرْ تْعَاوْنِي عَفَاكْ؟',
          translation: { fr: "Puis-je voir le menu ? Peux-tu m'aider s'il te plaît ?", en: "May I see the menu? Can you help me please?", es: "¿Puedo ver el menú? ¿Puedes ayudarme por favor?", ar: "هل يمكنني رؤية القائمة؟ هل يمكنك مساعدتي من فضلك؟" }
        }
      },
      {
        id: 'm4_l4_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_3',
          type: 'mcq',
          prompt: { fr: 'Pour demander poliment "Est-il possible de...", on dit :', en: 'To politely ask "Is it possible to...", we say:', es: 'Para preguntar cortésmente "¿Es posible...", decimos:', ar: 'لطلب "هل من الممكن..." نقول:' },
          options: [
            { id: 'o1', text: 'Moumkin', isCorrect: true },
            { id: 'o2', text: 'Khass', isCorrect: false },
            { id: 'o3', text: 'Bghit', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Moumkin = Est-il possible.', en: 'Moumkin = Is it possible.', es: 'Moumkin = ¿Es posible?', ar: 'ممكن = هل من الممكن.' }
        }
      },
      {
        id: 'm4_l4_s7',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_scramble',
          type: 'scramble',
          prompt: {
            fr: 'Reconstituez : « Je voudrais boire un café et voir le menu »',
            en: 'Reorder: "I would like to drink a coffee and see the menu"',
            es: 'Reconstruye: "Quisiera beber un café y ver el menú"',
            ar: 'أعد ترتيب: "أريد أن أشرب قهوة وأرى القائمة"'
          },
          options: [
            { id: 'w1', text: 'Bghit', isCorrect: true },
            { id: 'w2', text: 'nchreb', isCorrect: true },
            { id: 'w3', text: 'qahwa', isCorrect: true },
            { id: 'w4', text: 'w', isCorrect: true },
            { id: 'w5', text: 'nchouf', isCorrect: true },
            { id: 'w6', text: 'l-menu', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'],
          explanation: {
            fr: 'Structure : désir (Bghit)+ verbe (nchreb)+ objet (qahwa)+ coordonnant (w)+ verbe (nchouf)+ objet (l-menu)..',
            en: 'Structure: wish (Bghit)+ verb (nchreb)+ object (qahwa)+ conjunction (w)+ verb (nchouf)+ object (l-menu)..',
            es: 'Estructura: deseo (Bghit)+ verbo (nchreb)+ objeto (qahwa)+ conjunción (w)+ verbo (nchouf)+ objeto (l-menu)..',
            ar: 'التركيب: رغبة (بغيت)+ فعل (نشرب)+ مفعول (قهوة)+ عطف (و)+ فعل (نشوف)+ مفعول (المينو)..'
          }
        }
      },
      {
        id: 'm4_boss_challenge',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_boss_restaurant',
          type: 'roleplay_challenge',
          prompt: {
            fr: 'Épreuve finale : relevez le défi « Au restaurant marocain » puis enchaînez sur l\'onglet Parler.',
            en: 'Final challenge: take on the "Moroccan Restaurant" challenge, then move on to the Parler tab.',
            es: 'Desafio final: supera el reto «En el restaurante marroquí» y luego continúa en la pestana Parler.',
            ar: 'التحدي الختامي: خض مغامرة «في المطعم المغربي» ثم انتقل إلى تبويب Parler.'
          },
          dialogueContext: {
            fr: 'Vous êtes attablé dans un restaurant marocain. Le serveur vous apporte le menu. Vous utilisez les modaux pour commander.',
            en: 'You sit down in a Moroccan restaurant. The waiter brings the menu. You use modals to order.',
            es: 'Estás sentado en un restaurante marroquí. El camarero trae el menú. Usas los modales para pedir.',
            ar: 'أنت جالس في مطعم مغربي. يحضر النادل القائمة. تستخدم الأفعال الناقصة للطلب.'
          },
          npcStartLine: {
            arabizi: 'Merhba bik ! Shnou bghiti t-tlob ?',
            arabic: 'مَرْحْبَا بِيكْ ! شْنُوْ بْغِيتِيْ تْطْلُبْ ؟',
            translation: {
              fr: 'Bienvenue ! Que voulez-vous commander ?',
              en: 'Welcome! What would you like to order?',
              es: '¡Bienvenido! ¿Qué deseas pedir?',
              ar: 'مرحبا بك! ماذا تريد أن تطلب؟'
            }
          },
          answer: '',
          explanation: {
            fr: 'Vous commandez avec les modaux (Bghit, Moumkin), personnalisez votre plat et terminez par une formule de politesse. Ce défi vous prépare au dialogue ouvert du restaurant dans l\'onglet Parler.',
            en: 'You order with modals (Bghit, Moumkin), customise your dish and finish with a polite formula. This challenge prepares you for the open restaurant dialogue on the Parler tab.',
            es: 'Pides con los modales (Bghit, Moumkin), personalizas tu plato y cierras con una fórmula cortés. Este reto te prepara para el dialogo abierto del restaurante.',
            ar: 'تطلب بالأفعال الناقصة (بغيت، ممكن)، تخصص طبقك وتختم بصيغة مجاملة. هذا التحدي يهيئك للحوار المفتوح في المطعم.'
          },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: {
                arabizi: 'Bghit l-houte mcharmel, bla melha, 3afak. Moumkin nchouf l-menu daba ?',
                arabic: 'بْغِيتْ لْحُوتْ مْشَرْمَلْ، بْلَا مَلْحَةْ، عَفَاكْ. مُمْكِنْ نْشُوفْ لْمِينُوْ دَابَا ؟',
                translation: {
                  fr: 'Je voudrais le poisson aux herbes, sans sel, s\'il vous plaît. Puis-je voir le menu maintenant ?',
                  en: 'I would like the herb fish, without salt, please. May I see the menu now?',
                  es: 'Quisiera el pescado a las hierbas, sin sal, por favor. ¿Puedo ver el menú ahora?',
                  ar: 'أريد السمك بالأعشاب، بدون ملح، من فضلك. هل يمكنني رؤية القائمة الآن؟'
                }
              },
              isOptimal: true,
              nextNpcLine: 'Wakha a sidi ! Moumkin. Daba njib lik l-menu w l-houte mcharmel. Bssa7a !',
              feedback: {
                fr: 'Excellent ! Commande claire avec un modal, personnalisation (sans sel) et demande polie du menu.',
                en: 'Excellent! Clear modal order, customisation (no salt)and a polite menu request.',
                es: '¡Excelente! Pedido claro con modal, personalización (sin sal)y petición cortés del menú.',
                ar: 'ممتاز! طلب واضح بفعل ناقص، تخصيص (بدون ملح( وطلب مهذب للقائمة.'
              }
            },
            {
              id: 'boss_c2',
              text: {
                arabizi: 'Ma bghitch n-tlob daba.',
                arabic: 'مَا بْغِيتْشْ نْطْلُبْ دَابَا.',
                translation: {
                  fr: 'Je ne veux pas commander maintenant.',
                  en: "I don't want to order now.",
                  es: 'No quiero pedir ahora.',
                  ar: 'لا أريد أن أطلب الآن.'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Wah ? Chno behi tdir daba : tchouf l-menu wla tkhroj ?',
              feedback: {
                fr: 'Le serveur vient de vous accueillir : il faut enchaîner sur la commande ou demander le menu, pas le refuser.',
                en: 'The waiter just welcomed you: follow up with an order or ask for the menu, not refuse.',
                es: 'El camarero te acaba de saludar: sigue con un pedido o pide el menú, no lo rechaces.',
                ar: 'النادل رحب بك فقط: تابع بالطلب أو اطلب القائمة، لا ترفض.'
              }
            },
            {
              id: 'boss_c3',
              text: {
                arabizi: 'Jib liya l-7sab, 3afak !',
                arabic: 'جِيبْ لِيَا لْحْسَابْ، عَفَاكْ !',
                translation: {
                  fr: "Apportez-moi l'addition, s'il vous plaît !",
                  en: 'Bring me the bill, please!',
                  es: '¡Tráigame la cuenta, por favor!',
                  ar: 'أحضر لي الحساب، من فضلك!'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Daba, a sidi ? Ma kliti walou ! Bghiti t-tlob wla la ?',
              feedback: {
                fr: 'Trop tôt : vous n\'avez pas encore commandé. Demandez d\'abord le menu ou commandez votre plat.',
                en: 'Too early: you have not ordered yet. Ask for the menu first or order your dish.',
                es: 'Demasiado pronto: todavía no has pedido. Pide el menú primero u ordena tu plato.',
                ar: 'مبكراً جدا: لم تطلب بعد. اطلب القائمة أولا أو اطلب طبقك.'
              }
            }
          ]
        }
      }
    ]
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
    steps: [
      {
        id: 'chk_b1_1',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_1_ex',
          type: 'mcq',
          prompt: { fr: 'Hier, Fatima est allée au souk', en: 'Yesterday, Fatima went to the souk', es: 'Ayer, Fátima fue al zoco', ar: 'البارحة، ذهبت فاطمة إلى السوق' },
          options: [
            { id: 'o1', text: 'Mcha', isCorrect: false },
            { id: 'o2', text: 'Mchat', isCorrect: true },
            { id: 'o3', text: 'Mchit', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b1_2',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_2_ex',
          type: 'mcq',
          prompt: { fr: 'Ils ont écrit le message', en: 'They wrote the message', es: 'Escribieron el mensaje', ar: 'كتبوا الرسالة' },
          options: [
            { id: 'o1', text: 'Ketbat', isCorrect: false },
            { id: 'o2', text: 'Kteb', isCorrect: false },
            { id: 'o3', text: 'Ketbou', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_3',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_3_ex',
          type: 'mcq',
          prompt: { fr: 'Tu bois (à une femme) du thé chaque matin', en: 'You (f) drink tea every morning', es: 'Bebes (a una mujer) té cada mañana', ar: 'أنتِ تشربين الشاي كل صباح' },
          options: [
            { id: 'o1', text: 'Ka-tchrebi', isCorrect: true },
            { id: 'o2', text: 'Ka-tchreb', isCorrect: false },
            { id: 'o3', text: 'Chrebti', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_4',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_4_ex',
          type: 'mcq',
          prompt: { fr: 'Nous habitons à Fès', en: 'We live in Fez', es: 'Vivimos en Fez', ar: 'نحن نعيش في فاس' },
          options: [
            { id: 'o1', text: 'Ka-nsoknou', isCorrect: true },
            { id: 'o2', text: 'Ka-nskon', isCorrect: false },
            { id: 'o3', text: 'Skenna', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_5',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_5_ex',
          type: 'mcq',
          prompt: { fr: 'Demain, nous voyagerons', en: 'Tomorrow, we will travel', es: 'Mañana, viajaremos', ar: 'غدا، سنسافر' },
          options: [
            { id: 'o1', text: 'Gha-ka-nsafrou', isCorrect: false },
            { id: 'o2', text: 'Safrou', isCorrect: false },
            { id: 'o3', text: 'Gha-nsafrou', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_6',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_6_ex',
          type: 'mcq',
          prompt: { fr: 'Je n\'ai pas compris', en: 'I didn\'t understand', es: 'No entendí', ar: 'لم أفهم' },
          options: [
            { id: 'o1', text: 'Ma-ka-nfhem-ch', isCorrect: false },
            { id: 'o2', text: 'Ma-fhemt-ch', isCorrect: true },
            { id: 'o3', text: 'Machi fhemt', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b1_7',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_7_ex',
          type: 'mcq',
          prompt: { fr: 'Il ne mange pas de viande', en: 'He doesn\'t eat meat', es: 'Él no come carne', ar: 'هو لا يأكل اللحم' },
          options: [
            { id: 'o1', text: 'Ma-kla-ch', isCorrect: false },
            { id: 'o2', text: 'Machi yakol', isCorrect: false },
            { id: 'o3', text: 'Ma-ka-yakol-ch', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_8',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_8_ex',
          type: 'mcq',
          prompt: { fr: 'Ce n\'est pas cher', en: 'It\'s not expensive', es: 'No es caro', ar: 'إنه ليس غاليا' },
          options: [
            { id: 'o1', text: 'Ma-ghali-ch', isCorrect: false },
            { id: 'o2', text: 'Ma-ka-ghalich', isCorrect: false },
            { id: 'o3', text: 'Machi ghali', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_9',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_9_ex',
          type: 'mcq',
          prompt: { fr: 'Nous devons partir maintenant', en: 'We must leave now', es: 'Debemos irnos ahora', ar: 'يجب أن نغادر الآن' },
          options: [
            { id: 'o1', text: 'Khassna nemchiw', isCorrect: true },
            { id: 'o2', text: 'Khassni nemchi', isCorrect: false },
            { id: 'o3', text: 'Ka-nkhassou', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_10',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_10_ex',
          type: 'mcq',
          prompt: { fr: 'Peux-tu m\'aider s\'il te plaît ?', en: 'Can you help me please?', es: '¿Puedes ayudarme por favor?', ar: 'هل يمكنك مساعدتي من فضلك؟' },
          options: [
            { id: 'o1', text: 'Khassni n3awnek', isCorrect: false },
            { id: 'o2', text: 'Bghit t3awenni', isCorrect: false },
            { id: 'o3', text: 'Tqedd t3awenni 3afak ?', isCorrect: true }
          ],
          answer: 'o3'
        }
      }
    ]
  }
];

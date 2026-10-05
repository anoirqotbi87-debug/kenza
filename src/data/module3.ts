import { Lesson } from '../types/curriculum';

export const module3Lessons: Lesson[] = [
  {
    id: 'm3_l1_checkin',
    title: {
      fr: 'Check-in au Riad',
      en: 'Check-in at the Riad',
      es: 'Check-in en el Riad',
      ar: 'تسجيل الدخول في الرياض'
    },
    level: 3,
    description: {
      fr: 'Arrivée, clés, wifi et petit-déjeuner.',
      en: 'Arrival, keys, wifi and breakfast.',
      es: 'Llegada, llaves, wifi y desayuno.',
      ar: 'الوصول، المفاتيح، الواي فاي والإفطار.'
    },
    steps: [
      {
        id: 'm3_l1_s1',
        type: 'learning',
        content: {
          title: { fr: 'La Clé et la Chambre', en: 'Key and Room', es: 'Llave y Habitación', ar: 'المفتاح والغرفة' },
          description: { 
            fr: 'Apprenez à demander votre clé (sarout) et votre chambre (bit).',
            en: 'Learn to ask for your key (sarout) and your room (bit).',
            es: 'Aprende a pedir tu llave (sarout) y tu habitación (bit).',
            ar: 'تعلم كيف تطلب مفتاحك (sarout) وغرفتك (bit).'
          },
          arabizi: '3tini s-sarout 3afak. Fin jate l-bit dyali ?',
          arabic: 'عْطِيْنِي السَّارُوتْ عَفَاكْ. فِينْ جَاتْ البِيتْ دْيَالِيْ ؟',
          translation: { 
            fr: "Donne-moi la clé s'il te plaît. Où est ma chambre ?", 
            en: "Give me the key please. Where is my room?", 
            es: "Dame la llave por favor. ¿Dónde está mi habitación?", 
            ar: "أعطني المفتاح من فضلك. أين غرفتي؟" 
          }
        }
      },
      {
        id: 'm3_l1_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l1_1',
          type: 'mcq',
          prompt: { fr: 'Que signifie "s-sarout" ?', en: 'What does "s-sarout" mean?', es: '¿Qué significa "s-sarout"?', ar: 'ماذا تعني "s-sarout"؟' },
          options: [
            { id: 'o1', text: { fr: 'La chambre', en: 'The bedroom', es: 'El dormitorio', ar: 'الغرفة' }, isCorrect: false },
            { id: 'o2', text: { fr: 'La clé', en: 'The key', es: 'La llave', ar: 'المفتاح' }, isCorrect: true },
            { id: 'o3', text: { fr: 'Le lit', en: 'The bed', es: 'La cama', ar: 'السرير' }, isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'La clé se dit "sarout" et la chambre "bit".', en: 'The key is "sarout".', es: 'La llave es "sarout".', ar: 'المفتاح هو "ساروت".' }
        }
      },
      {
        id: 'm3_l1_s3',
        type: 'learning',
        content: {
          title: { fr: 'Le Petit-déjeuner', en: 'Breakfast', es: 'Desayuno', ar: 'الفطور' },
          description: { fr: 'Demandez l\'heure du petit-déjeuner.', en: 'Ask for breakfast time.', es: 'Pregunta la hora del desayuno.', ar: 'اسأل عن وقت الإفطار.' },
          arabizi: 'F-ay weqt kaykoun l-ftour ?',
          arabic: 'فْ أَشْمِنْ وَقْتْ كَايَكُونْ الفْطُورْ ؟',
          translation: { fr: "À quelle heure est le petit-déjeuner ?", en: "What time is breakfast?", es: "¿A qué hora es el desayuno?", ar: "في أي وقت يكون الفطور؟" }
        }
      },
      {
        id: 'm3_l1_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l1_2',
          type: 'mcq',
          prompt: { fr: 'Comment demander l\'heure du petit-déjeuner ?', en: 'How to ask for breakfast time?', es: '¿Cómo preguntar la hora del desayuno?', ar: 'كيف تسأل عن وقت الإفطار؟' },
          options: [
            { id: 'o1', text: 'F-ay weqt kaykoun l-ftour ?', isCorrect: true },
            { id: 'o2', text: 'Bch7al l-ftour ?', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: '"F-ay weqt" veut dire "à quel moment / heure".', en: '"F-ay weqt" means "at what time".', es: '"F-ay weqt" significa "a qué hora".', ar: '"فأشمن وقت" تعني "في أي وقت".' }
        }
      },
      {
        id: 'm3_l1_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l1_3',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Où est ma chambre ?"', en: 'Translate: "Where is my room?"', es: 'Traduce: "¿Dónde está mi habitación?"', ar: 'ترجم: "أين غرفتي؟"' },
          options: [
            { id: 'o1', text: 'Fin jate l-bit dyali ?', isCorrect: true },
            { id: 'o2', text: 'Fin jate l-mdina ?', isCorrect: false },
            { id: 'o3', text: 'Bch7al l-bit ?', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: '"Fin jate" s\'utilise pour demander où se trouve un lieu.', en: '"Fin jate" is used for locations.', es: 'Se usa "Fin jate" para ubicaciones.', ar: 'تستخدم "فين جات" للسؤال عن المكان.' }
        }
      }
    ]
  },
  {
    id: 'm3_l2_maintenance',
    title: {
      fr: 'Confort & Pannes',
      en: 'Comfort & Maintenance',
      es: 'Confort y Mantenimiento',
      ar: 'الراحة والصيانة'
    },
    level: 3,
    description: {
      fr: 'Signaler une panne ou demander des objets.',
      en: 'Report an issue or ask for items.',
      es: 'Reportar un problema o pedir artículos.',
      ar: 'الإبلاغ عن عطل أو طلب أشياء.'
    },
    steps: [
      {
        id: 'm3_l2_s1',
        type: 'learning',
        content: {
          title: { fr: 'Signaler un problème', en: 'Report a problem', es: 'Reportar un problema', ar: 'الإبلاغ عن مشكلة' },
          description: { fr: 'Utilisez "makhddamch" pour dire "en panne".', en: 'Use "makhddamch" for broken.', es: 'Usa "makhddamch" para averiado.', ar: 'استخدم "ماخدامش" للقول بأنه معطل.' },
          arabizi: 'L-ma skhoun makhddamch. La clim katdir s-sda3.',
          arabic: 'الْمَا سْخُونْ مَاخْدَامْشْ. لاَ كْلِيمْ كَادِيرْ الصُّدَاعْ.',
          translation: { fr: "L'eau chaude ne marche pas. La clim fait du bruit.", en: "Hot water isn't working. AC is making noise.", es: "El agua caliente no funciona. El aire hace ruido.", ar: "الماء الساخن لا يعمل. المكيف يصدر ضجيجا." }
        }
      },
      {
        id: 'm3_l2_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l2_1',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "en panne" / "ne marche pas" ?', en: 'How to say "broken" / "not working"?', es: '¿Cómo se dice "averiado"?', ar: 'كيف تقول "معطل"؟' },
          options: [
            { id: 'o1', text: 'Makhddamch', isCorrect: true },
            { id: 'o2', text: 'Skhoun', isCorrect: false },
            { id: 'o3', text: 'Zwin', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: '"Makhddamch" vient du verbe "khdem" (fonctionner).', en: 'From verb "khdem" (to work).', es: 'Del verbo "khdem" (funcionar).', ar: 'من الفعل "خدم" (يعمل).' }
        }
      },
      {
        id: 'm3_l2_s3',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l2_2',
          type: 'mcq',
          prompt: { fr: 'Pourquoi dit-on "skhoun" et non "skhouna" pour l\'eau ?', en: 'Why "skhoun" instead of "skhouna" for water?', es: '¿Por qué "skhoun" y no "skhouna" para agua?', ar: 'لماذا "سخون" وليس "سخونة" للماء؟' },
          options: [
            { id: 'o1', text: 'Parce que "l-ma" (eau) est masculin en Darija', isCorrect: true },
            { id: 'o2', text: 'Parce que c\'est invariable', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'En Darija, "l-ma" (l\'eau) est masculin, on dit donc "skhoun" et non "skhouna".', en: '"L-ma" is masculine.', es: '"L-ma" es masculino.', ar: '"الما" مذكر في الدارجة.' }
        }
      },
      {
        id: 'm3_l2_s4',
        type: 'learning',
        content: {
          title: { fr: 'Demander des objets', en: 'Ask for items', es: 'Pedir objetos', ar: 'طلب أشياء' },
          description: { fr: 'Khesni (il me faut) ou Bghit (je veux).', en: 'Khesni (I need).', es: 'Khesni (necesito).', ar: 'خصني (أحتاج).' },
          arabizi: 'Khesni fota okhra 3afak.',
          arabic: 'خَصْنِي فُوطَةْ أُخْرَى عَفَاكْ.',
          translation: { fr: "Il me faut une autre serviette s'il vous plaît.", en: "I need another towel please.", es: "Necesito otra toalla por favor.", ar: "أحتاج منشفة أخرى من فضلك." }
        }
      },
      {
        id: 'm3_l2_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l2_3',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Il me faut une autre serviette"', en: 'Translate: "I need another towel"', es: 'Traduce: "Necesito otra toalla"', ar: 'ترجم: "أحتاج منشفة أخرى"' },
          options: [
            { id: 'o1', text: 'Khesni fota okhra', isCorrect: true },
            { id: 'o2', text: 'Bghit l-ma', isCorrect: false },
            { id: 'o3', text: 'Khesni sarout', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Khesni = Il me faut. Fota = Serviette.', en: 'Khesni = I need. Fota = Towel.', es: 'Khesni = Necesito. Fota = Toalla.', ar: 'خصني = أحتاج. فوطة = منشفة.' }
        }
      }
    ]
  },
  {
    id: 'm3_l3_pharmacie',
    title: {
      fr: 'À la Pharmacie',
      en: 'At the Pharmacy',
      es: 'En la Farmacia',
      ar: 'في الصيدلية'
    },
    level: 3,
    description: {
      fr: 'Santé et maux courants.',
      en: 'Health and common ailments.',
      es: 'Salud y dolencias comunes.',
      ar: 'الصحة والأمراض الشائعة.'
    },
    steps: [
      {
        id: 'm3_l3_s1',
        type: 'learning',
        content: {
          title: { fr: 'Exprimer la douleur', en: 'Express pain', es: 'Expresar dolor', ar: 'التعبير عن الألم' },
          description: { fr: 'Utilisez "Kayderrni" (Il me fait mal).', en: 'Use "Kayderrni" (It hurts me).', es: 'Usa "Kayderrni" (Me duele).', ar: 'استخدم "كيضرني" (يؤلمني).' },
          arabizi: 'Kayderrni rasi bezzaf.',
          arabic: 'كَيْضْرْنِي رَاسِي بْزَافْ.',
          translation: { fr: "J'ai très mal à la tête.", en: "My head hurts a lot.", es: "Me duele mucho la cabeza.", ar: "يؤلمني رأسي كثيرا." }
        }
      },
      {
        id: 'm3_l3_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l3_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "La tête" ?', en: 'How to say "Head"?', es: '¿Cómo decir "Cabeza"?', ar: 'كيف تقول "الرأس"؟' },
          options: [
            { id: 'o1', text: 'L-kersh', isCorrect: false },
            { id: 'o2', text: 'Ras', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: 'Ras = Tête, L-kersh = Ventre.', en: 'Ras = Head, L-kersh = Stomach.', es: 'Ras = Cabeza, L-kersh = Estómago.', ar: 'الرأس = راس، البطن = الكرش.' }
        }
      },
      {
        id: 'm3_l3_s3',
        type: 'learning',
        content: {
          title: { fr: 'Acheter un médicament', en: 'Buy medicine', es: 'Comprar medicina', ar: 'شراء دواء' },
          description: { fr: 'D-dwa = Le médicament.', en: 'D-dwa = Medicine.', es: 'D-dwa = Medicina.', ar: 'الدوا = الدواء.' },
          arabizi: '3tini dwa dyal l-kersh 3afak. Fin kayna a9rab fermasian ?',
          arabic: 'عْطِيْنِي دْوَا دْيَالْ الكَرْشْ عَفَاكْ. فِينْ كَايْنَةْ أَقْرَبْ فَرْمَسْيَانْ ؟',
          translation: { fr: "Donne-moi un médicament pour le ventre svp. Où est la pharmacie la plus proche ?", en: "Give me medicine for the stomach please. Where is the nearest pharmacy?", es: "Dame medicina para el estómago por favor. ¿Dónde está la farmacia más cercana?", ar: "أعطني دواء للبطن من فضلك. أين أقرب صيدلية؟" }
        }
      },
      {
        id: 'm3_l3_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l3_2',
          type: 'mcq',
          prompt: { fr: 'Que veut dire "Dwa" ?', en: 'What does "Dwa" mean?', es: '¿Qué significa "Dwa"?', ar: 'ماذا تعني "دوا"؟' },
          options: [
            { id: 'o1', text: { fr: 'Médecin', en: 'Doctor', es: 'Médico', ar: 'طبيب' }, isCorrect: false },
            { id: 'o2', text: { fr: 'Médicament', en: 'Medicine', es: 'Medicamento', ar: 'دواء' }, isCorrect: true },
            { id: 'o3', text: { fr: 'Malade', en: 'Sick', es: 'Enfermo', ar: 'مريض' }, isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Dwa = Médicament. Tbib = Médecin. Mrid = Malade.', en: 'Dwa = Medicine.', es: 'Dwa = Medicina.', ar: 'دوا = دواء.' }
        }
      },
      {
        id: 'm3_l3_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l3_3',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "J\'ai très mal à la tête"', en: 'Translate: "My head hurts a lot"', es: 'Traduce: "Me duele mucho la cabeza"', ar: 'ترجم: "يؤلمني رأسي كثيرا"' },
          options: [
            { id: 'o1', text: 'Kayderrni rasi bezzaf', isCorrect: true },
            { id: 'o2', text: 'Ana mrid', isCorrect: false },
            { id: 'o3', text: 'Kayderrni l-kersh bezzaf', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Kayderrni = ça me fait mal. rasi = ma tête. bezzaf = beaucoup.', en: 'Kayderrni = hurts me.', es: 'Kayderrni = me duele.', ar: 'كيضرني = يؤلمني.' }
        }
      }
    ]
  },
  {
    id: 'm3_l4_orientation',
    title: {
      fr: 'Orientation & Urgences',
      en: 'Orientation & Emergencies',
      es: 'Orientación y Emergencias',
      ar: 'التوجيه والطوارئ'
    },
    level: 3,
    description: {
      fr: 'Perdu en médina et demander de l\'aide.',
      en: 'Lost in medina and asking for help.',
      es: 'Perdido en la medina y pedir ayuda.',
      ar: 'ضائع في المدينة وطلب المساعدة.'
    },
    steps: [
      {
        id: 'm3_l4_s1',
        type: 'learning',
        content: {
          title: { fr: 'Orientation', en: 'Orientation', es: 'Orientación', ar: 'التوجيه' },
          description: { fr: 'Apprenez les directions.', en: 'Learn directions.', es: 'Aprende las direcciones.', ar: 'تعلم الاتجاهات.' },
          arabizi: 'Tleft f-l-medina, fin jat triq Bab Boujloud ?',
          arabic: 'تَلْفَتْ فْالمَدِينَةْ، فِينْ جَاتْ طْرِيقْ بَابْ بُوجْلُودْ ؟',
          translation: { fr: "Je suis perdu dans la médina, où est la route de Bab Boujloud ?", en: "I'm lost in the medina, where is the road to Bab Boujloud?", es: "Estoy perdido en la medina, ¿dónde está el camino a Bab Boujloud?", ar: "لقد ضعت في المدينة، أين طريق باب بوجلود؟" }
        }
      },
      {
        id: 'm3_l4_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l4_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Je suis perdu" ?', en: 'How to say "I am lost"?', es: '¿Cómo decir "Estoy perdido"?', ar: 'كيف تقول "أنا ضائع"؟' },
          options: [
            { id: 'o1', text: 'Mrid', isCorrect: false },
            { id: 'o2', text: 'Tleft', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: '"Tleft" vient du verbe perdre son chemin.', en: '"Tleft" means lost.', es: '"Tleft" significa perdido.', ar: '"تلفت" تعني ضعت.' }
        }
      },
      {
        id: 'm3_l4_s3',
        type: 'learning',
        content: {
          title: { fr: 'Urgences et Aide', en: 'Emergencies and Help', es: 'Emergencias y Ayuda', ar: 'الطوارئ والمساعدة' },
          description: { fr: 'Savoir réagir.', en: 'Know how to react.', es: 'Saber cómo reaccionar.', ar: 'معرفة كيفية التصرف.' },
          arabizi: '3awenni 3afak. Khellini f t-ti9ar.',
          arabic: 'عَاوْنِي عَفَاكْ. خَلِّيْنِي فْ التِّيقَارْ.',
          translation: { fr: "Aide-moi s'il te plaît. Laissez-moi tranquille.", en: "Help me please. Leave me alone.", es: "Ayúdame por favor. Déjame en paz.", ar: "ساعدني من فضلك. اتركني وشأني." }
        }
      },
      {
        id: 'm3_l4_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l4_2',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Khellini f t-ti9ar" ?', en: 'What does "Khellini f t-ti9ar" mean?', es: '¿Qué significa "Khellini f t-ti9ar"?', ar: 'ماذا تعني "خليني فالتيقار"؟' },
          options: [
            { id: 'o1', text: 'Aide-moi', isCorrect: false },
            { id: 'o2', text: 'Laissez-moi tranquille', isCorrect: true }
          ],
          answer: 'o2',
          explanation: { fr: 'Très utile pour repousser gentiment mais fermement les vendeurs insistants.', en: 'Very useful for pushy sellers.', es: 'Muy útil para vendedores insistentes.', ar: 'مفيدة جداً للبائعين الملحين.' }
        }
      },
      {
        id: 'm3_l4_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l4_3',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Aide-moi s\'il te plaît"', en: 'Translate: "Help me please"', es: 'Traduce: "Ayúdame por favor"', ar: 'ترجم: "ساعدني من فضلك"' },
          options: [
            { id: 'o1', text: '3awenni 3afak', isCorrect: true },
            { id: 'o2', text: 'Khellini 3afak', isCorrect: false },
            { id: 'o3', text: 'Shoukrane bezzaf', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Le verbe est 3awen (aider). 3awen-ni = aide-moi.', en: 'Verb 3awen (to help).', es: 'Verbo 3awen (ayudar).', ar: 'الفصل عاون.' }
        }
      },
      {
        id: 'm3_l4_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_l4_scramble',
          type: 'scramble',
          prompt: {
            fr: 'Reconstituez la phrase : « Il me faut une autre serviette, s\'il vous plaît »',
            en: 'Reorder: "I need another towel, please"',
            es: 'Reconstruye: "Necesito otra toalla, por favor"',
            ar: 'أعد ترتيب: "أحتاج منشفة أخرى، من فضلك"'
          },
          options: [
            { id: 'w1', text: 'Khesni', isCorrect: true },
            { id: 'w2', text: 'fota', isCorrect: true },
            { id: 'w3', text: 'okhra', isCorrect: true },
            { id: 'w4', text: '3afak', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4'],
          explanation: {
            fr: 'Structure : besoin (Khesni)+ objet (fota)+ adjectif (okhra)+ politesse (3afak)..',
            en: 'Structure: need (Khesni)+ object (fota)+ adjective (okhra)+ politeness (3afak)..',
            es: 'Estructura: necesidad (Khesni)+ objeto (fota)+ adjetivo (okhra)+ cortesía (3afak)..',
            ar: 'التركيب: حاجة (خصني)+ مفعول (فوطة)+ صفة (أخرى)+ مجاملة (عفاك)..'
          }
        }
      },
      {
        id: 'm3_boss_challenge',
        type: 'exercise',
        exercise: {
          id: 'ex_m3_boss_karim',
          type: 'roleplay_challenge',
          prompt: {
            fr: 'Épreuve finale : relevez le défi « Le taxi de Karim » puis enchaînez sur l\'onglet Parler.',
            en: 'Final challenge: take on the "Karim Taxi" challenge, then move on to the Parler tab.',
            es: 'Desafio final: supera el reto «El taxi de Karim» y luego continúa en la pestana Parler.',
            ar: 'التحدي الختامي: خض مغامرة «طاكسي كريم» ثم انتقل إلى تبويب Parler.'
          },
          dialogueContext: {
            fr: 'Vous sortez de la médina, un peu perdu. Karim, chauffeur de petit taxi, s\'arrête. Vous voulez rentrer à votre riad.',
            en: 'You leave the medina, slightly lost. Karim, a petit taxi driver, stops. You want to get back to your riad.',
            es: 'Sales de la medina, un poco perdido. Karim, conductor de petit taxi, se detiene. Quieres volver a tu riad.',
            ar: 'تخرج من المدينة، ضائعة قليلاً. يتوقف كريم، سائق الطاكسي الصغير. تريد العودة إلى الرياض.'
          },
          npcStartLine: {
            arabizi: 'Salam ! Fin ghadi a khoya ?',
            arabic: 'سَلَامْ ! فِينْ غَادِيْ أَ خُويَا ؟',
            translation: {
              fr: 'Bonjour ! Où vas-tu, mon frère ?',
              en: 'Hello! Where are you going, brother?',
              es: 'Hola! ¿A dónde vas, hermano?',
              ar: 'مرحبا! إلى أين أنت ذاهب يا أخي؟'
            }
          },
          answer: '',
          explanation: {
            fr: 'Vous donnez votre destination, demandez le compteur et remerciez. Ce défi vous prépare au dialogue ouvert avec Karim dans l\'onglet Parler, en réutilisant les mots de orientation et de taxi.',
            en: 'You state your destination, ask for the meter and thank. This challenge prepares you for the open dialogue with Karim on the Parler tab, reusing orientation and taxi vocabulary.',
            es: 'Indicas tu destino, pides el taxímetro y agradeces. Este reto te prepara para el dialogo abierto con Karim, reutilizando vocabulario de orientación y taxi.',
            ar: 'تذكر وجهتك، تطلب العداد وتشكر. هذا التحدي يهيئك للحوار المفتوح مع كريم في تبويب Parler، معيداً استخدام كلمات التوجيه والطاكسي.'
          },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: {
                arabizi: 'Salam ! Khassni nemchi l-riad dyali, 3end bab Boujloud. Khddem l-kuntour, 3afak.',
                arabic: 'سَلَامْ ! خَصْنِي نْمْشِيْ لْرِيَاضْ دْيَالِيْ، عَنْدْ بَابْ بُوجْلُودْ. خَدِّمْ لْكُونْتُورْ، عَفَاكْ.',
                translation: {
                  fr: 'Bonjour ! Je dois aller à mon riad, vers Bab Boujloud. Mettez le compteur, s\'il vous plaît.',
                  en: 'Hello! I need to go to my riad, near Bab Boujloud. Turn on the meter, please.',
                  es: 'Hola! Tengo que ir a mi riad, cerca de Bab Boujloud. Ponga el taxímetro, por favor.',
                  ar: 'مرحبا! يجب أن أذهب إلى الرياض، قرب باب بوجلود. شغل العداد، من فضلك.'
                }
              },
              isOptimal: true,
              nextNpcLine: 'Wakha khoya ! Daba nkhddem l-kuntour. Dour 3la limin ?',
              feedback: {
                fr: 'Parfait ! Destination claire, compteur demandé : Karim vous emmène.',
                en: 'Perfect! Clear destination, meter asked: Karim takes you.',
                es: 'Perfecto! Destino claro, taxímetro pedido: Karim te lleva.',
                ar: 'ممتاز! وجهة واضحة، وطلبت العداد: كريم يأخذك.'
              }
            },
            {
              id: 'boss_c2',
              text: {
                arabizi: 'Sir nichan, w dour 3la limin !',
                arabic: 'سِيرْ نِيشَانْ، وْ دُورْ عْلَى لِيمِينْ !',
                translation: {
                  fr: 'Allez tout droit, puis tournez à gauche !',
                  en: 'Go straight, then turn left!',
                  es: 'Ve recto, luego gira a la izquierda!',
                  ar: 'سر مباشرة، ثم انعطف يسارا!'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Haha, a sidi ! Daba houwa li kayn : fin ghadi 3la l-qqahwa ?',
              feedback: {
                fr: 'Karim demandait votre destination, pas l\'itinéraire : il connaît déjà la route. Redonnez-lui votre but.',
                en: 'Karim asked your destination, not the route: he already knows the way. Tell him your goal again.',
                es: 'Karim preguntó tu destino, no la ruta: ya conoce el camino. Vuelve a decirle tu objetivo.',
                ar: 'كريم سأل عن وجهتك، ليس الطريق: هو يعرف الطريق. أعد له هدفك.'
              }
            },
            {
              id: 'boss_c3',
              text: {
                arabizi: 'Ma 3reftch fin kayn l-riad. 3awenni 3afak !',
                arabic: 'مَا عْرَفْتْشْ فِينْ كَايْنْ لْرِيَاضْ. عَاوْنِيْ عَفَاكْ !',
                translation: {
                  fr: 'Je ne sais pas où est le riad. Aidez-moi, s\'il vous plaît !',
                  en: "I don't know where the riad is. Help me, please!",
                  es: 'No sé dónde está el riad. ¡Ayúdame, por favor!',
                  ar: 'لا أعرف أين الرياض. ساعدني من فضلك!'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Ma 3reftch ! Nta houwa li hder lmdina. Win mchiti daba ?',
              feedback: {
                fr: 'Utile en cas de panne, mais ici c\'est vous le client : Karim vous demande votre destination, pas l\'inverse.',
                en: 'Useful if lost, but here you are the customer: Karim asks your destination, not the other way around.',
                es: 'Útil si estás perdido, pero aquí eres el cliente: Karim pregunta tu destino, no al revés.',
                ar: 'مفيدة إن ضعت، لكن هنا أنت الزبون: كريم يسأل عن وجهتك، ليس العكس.'
              }
            }
          ]
        }
      }
    ]
  }
];

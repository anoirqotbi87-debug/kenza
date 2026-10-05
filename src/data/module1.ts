import { Lesson } from '../types/curriculum';

export const module1Lessons: Lesson[] = [
  {
    id: 'l1_phonetics_1',
    title: { fr: '1. Les sons essentiels : 3, 7, 9, kh, gh', en: '1. Essential Sounds: 3, 7, 9, kh, gh', es: '1. Sonidos esenciales: 3, 7, 9, kh, gh', ar: '1. الأصوات الأساسية: 3، 7، 9، خ، غ' },
    level: 1,
    description: { fr: 'Les cinq sons de la Darija qui n\'existent pas en français.', en: 'The five Darija sounds that do not exist in French.', es: 'Los cinco sonidos del Darija que no existen en francés.', ar: 'الأصوات الخمسة في الدارجة التي لا توجد في الفرنسية.' },
    steps: [
      {
        id: 's1_learn_3',
        type: 'learning',
        content: {
          title: { fr: 'Le son 3 (ع)', en: 'The 3 sound (ع)', es: 'El sonido 3 (ع)', ar: 'الصوت 3 (ع)' },
          description: { fr: 'Un son guttural venant du fond de la gorge. Imaginez que vous êtes chez le docteur et que vous dites "Aaaah".', en: 'A guttural sound from the back of the throat.', es: 'Un sonido gutural desde el fondo de la garganta.', ar: 'صوت حلقي من مؤخرة الحلق.' },
          arabizi: '3afak',
          arabic: 'عَفَاكْ',
          translation: { fr: 'S\'il te plaît', en: 'Please', es: 'Por favor', ar: 'من فضلك' },
          culturalNote: { fr: 'Le son 3 est essentiel pour dire s\'il te plaît (3afak).', en: 'The 3 sound is essential for saying please (3afak).', es: 'El sonido 3 es esencial para decir por favor (3afak).', ar: 'الصوت 3 أساسي لقول من فضلك (عفاك).' }
        }
      },
      {
        id: 's2_learn_7',
        type: 'learning',
        content: {
          title: { fr: 'Le son 7 (ح)', en: 'The 7 sound (ح)', es: 'El sonido 7 (ح)', ar: 'الصوت 7 (ح)' },
          description: { fr: 'Un souffle chaud expiré du fond de la gorge, comme si vous souffliez sur des lunettes pour les nettoyer. C\'est un H très appuyé.', en: 'A warm breath pushed from deep in the throat, like fogging up glasses.', es: 'Un aliento cálido desde el fondo de la garganta, como empañar unas gafas.', ar: 'نفس حار من عمق الحلق، كأنك تنفخ على نظارة لتنظيفها.' },
          arabizi: 'sba7 l-khir',
          arabic: 'صْبَاحْ الْخِيرْ',
          translation: { fr: 'Bonjour (le matin)', en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' },
          culturalNote: { fr: 'On dit « sba7 l-khir » le matin, et « msa l-khir » le soir.', en: 'Say "sba7 l-khir" in the morning and "msa l-khir" in the evening.', es: 'Se dice «sba7 l-khir» por la mañana y «msa l-khir» por la noche.', ar: 'نقول «صباح الخير» في الصباح و«مسا الخير» في المساء.' }
        }
      },
      {
        id: 's3_learn_9',
        type: 'learning',
        content: {
          title: { fr: 'Le son 9 (ق)', en: 'The 9 sound (ق)', es: 'El sonido 9 (ق)', ar: 'الصوت 9 (ق)' },
          description: { fr: 'Une occlusive produite tout au fond de la bouche, au niveau de la luette. Plus profonde qu\'un K français.', en: 'A stop produced far back in the mouth, at the uvula. Deeper than a French K.', es: 'Una oclusiva producida al fondo de la boca, en la úvula. Más profunda que una K francesa.', ar: 'صوت انفجاري يُنطق في أعماق الفم عند اللهاة، أعمق من الكاف الفرنسية.' },
          arabizi: '9hwa',
          arabic: 'قَهْوَةْ',
          translation: { fr: 'Café', en: 'Coffee', es: 'Café', ar: 'قهوة' },
          culturalNote: { fr: '« 9hwa » désigne le café, souvent servi très fort et sucré. Le 9 est le son le plus identitaire de la Darija.', en: '"9hwa" is coffee, often served strong and sweet. The 9 is the most distinctive Darija sound.', es: '«9hwa» es el café, a menudo muy fuerte y dulce. El 9 es el sonido más característico del Darija.', ar: '«قهوة» تُقدَّم غالباً قوية وحلوة. الصوت 9 هو الأكثر تميزاً في الدارجة.' }
        }
      },
      {
        id: 's4_learn_kh',
        type: 'learning',
        content: {
          title: { fr: 'Le son kh (خ)', en: 'The kh sound (خ)', es: 'El sonido kh (خ)', ar: 'الصوت خ' },
          description: { fr: 'Un son râpeux, comme un frottement au fond de la gorge — exactement la « jota » espagnole (ou le « ch » allemand de « Bach »).', en: 'A raspy sound, like friction at the back of the throat — the Spanish "jota".', es: 'Un sonido rasposo, como la «jota» española.', ar: 'صوت خشن، مثل الاحتكاك في مؤخرة الحلق.' },
          arabizi: 'khobz',
          arabic: 'خُبْزْ',
          translation: { fr: 'Pain', en: 'Bread', es: 'Pan', ar: 'خبز' },
          culturalNote: { fr: 'Le kh et le gh sont la paire la plus confondue : kh râpe (خبز, pain), gh roule (غادي, aller).', en: 'kh and gh are the most confused pair: kh rasps, gh rolls.', es: 'kh y gh son la pareja más confundida: kh raspa, gh rueda.', ar: 'خ و غ هما الأكثر التباساً: خ خشن، غ يرتعد.' }
        }
      },
      {
        id: 's5_learn_gh',
        type: 'learning',
        content: {
          title: { fr: 'Le son gh (غ)', en: 'The gh sound (غ)', es: 'El sonido gh (غ)', ar: 'الصوت غ' },
          description: { fr: 'Le même frottement que kh, mais avec la voix : c\'est le R parisien râpeux (« Paris »).', en: 'The same friction as kh, but voiced: it is the French guttural R.', es: 'La misma fricción que kh, pero sonora: es la R gutural francesa.', ar: 'نفس احتكاك خ لكن مع الصوت: هو الراء الفرنسية.' },
          arabizi: 'ghadi',
          arabic: 'غَادِيْ',
          translation: { fr: 'Je vais / (futur proche)', en: 'I am going / (near future)', es: 'Voy / (futuro próximo)', ar: 'سوف / (المستقبل القريب)' },
          culturalNote: { fr: '« ghadi » sert aussi à former le futur : « ghadi nemshi » = je vais partir.', en: '"ghadi" also builds the future: "ghadi nemshi" = I will go.', es: '«ghadi» también forma el futuro: «ghadi nemshi» = iré.', ar: '«غادي» تُستعمل أيضاً لبناء المستقبل: «غادي نمشي».' }
        }
      },
      {
        id: 's6_exercise_3',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_sound3',
          type: 'mcq',
          prompt: { fr: 'Quel son entendez-vous au début de « 3afak » ?', en: 'Which sound starts "3afak"?', es: '¿Qué sonido empieza «3afak»?', ar: 'أي صوت يبدأ به «عفاك»؟' },
          options: [
            { id: 'opt_3', text: '3 (ع)', isCorrect: true },
            { id: 'opt_h', text: 'h', isCorrect: false }
          ],
          answer: 'opt_3',
          explanation: { fr: '« 3afak » commence par le son 3 (ع), un son guttural profond.', en: '"3afak" starts with the 3 sound (ع), a deep guttural sound.', es: '«3afak» empieza con el sonido 3 (ع), un sonido gutural profundo.', ar: '«عفاك» تبدأ بالصوت 3 (ع)، وهو صوت حلقي عميق.' }
        }
      },
      {
        id: 's7_exercise_match_sounds',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_match_sounds',
          type: 'matching',
          prompt: { fr: 'Reliez chaque notation Arabizi à sa lettre arabe.', en: 'Match each Arabizi notation to its Arabic letter.', es: 'Une cada notación Arabizi con su letra árabe.', ar: 'اربط كل رمز عربيزي بحرفه العربي.' },
          pairs: [
            { id: 'pair_3', left: { text: '3' }, right: { text: 'ع' } },
            { id: 'pair_7', left: { text: '7' }, right: { text: 'ح' } },
            { id: 'pair_9', left: { text: '9' }, right: { text: 'ق' } },
            { id: 'pair_kh', left: { text: 'kh' }, right: { text: 'خ' } },
            { id: 'pair_gh', left: { text: 'gh' }, right: { text: 'غ' } }
          ],
          explanation: { fr: 'L\'Arabizi note par un chiffre les sons absents du latin : 3 = ع, 7 = ح, 9 = ق, et par deux lettres kh = خ, gh = غ.', en: 'Arabizi uses digits for sounds missing from Latin: 3 = ع, 7 = ح, 9 = ق, and kh = خ, gh = غ.', es: 'El Arabizi usa cifras para los sonidos ausentes del latín: 3 = ع, 7 = ح, 9 = ق, y kh = خ, gh = غ.', ar: 'العربيزي يستعمل الأرقام للأصوات غير الموجودة في اللاتينية: 3 = ع، 7 = ح، 9 = ق، وkh = خ، gh = غ.' }
        }
      },
      {
        id: 's8_exercise_kh_gh',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_kh_gh',
          type: 'mcq',
          prompt: { fr: 'Quel mot commence par le son kh (خ) ?', en: 'Which word starts with the kh sound (خ)?', es: '¿Qué palabra empieza con el sonido kh (خ)?', ar: 'أي كلمة تبدأ بالصوت خ؟' },
          options: [
            { id: 'opt_khobz', text: 'khobz', isCorrect: true },
            { id: 'opt_ghali', text: 'ghali', isCorrect: false }
          ],
          answer: 'opt_khobz',
          explanation: { fr: '« khobz » (خبز) commence par kh ; « ghali » (غالي, cher) commence par gh. La différence : kh est soufflé, gh est voisé.', en: '"khobz" (خبز) starts with kh; "ghali" (غالي, expensive) starts with gh. kh is voiceless, gh is voiced.', es: '«khobz» (خبز) empieza por kh; «ghali» (غالي, caro) empieza por gh.', ar: '«خبز» تبدأ بـ خ، و«غالي» تبدأ بـ غ. الفرق: خ مهموس، غ مجهور.' }
        }
      }
    ]
  },
  {
    id: 'l2_greetings_1',
    title: { fr: '2. Saluer : Salam u 3alaykum', en: '2. Greeting: Salam u 3alaykum', es: '2. Saludar: Salam u 3alaykum', ar: '2. التحية: السلام عليكم' },
    level: 1,
    description: { fr: 'La salutation la plus courante et sa réponse obligatoire.', en: 'The most common greeting and its mandatory reply.', es: 'El saludo más común y su respuesta obligatoria.', ar: 'التحية الأكثر شيوعاً وردها الواجب.' },
    steps: [
      {
        id: 's1_learn_salam',
        type: 'learning',
        content: {
          title: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحباً' },
          description: { fr: 'La salutation la plus courante au Maroc. Forme courte de « Salam u 3alaykum ».', en: 'The most common greeting in Morocco. Short form of "Salam u 3alaykum".', es: 'El saludo más común en Marruecos. Forma corta de «Salam u 3alaykum».', ar: 'التحية الأكثر شيوعاً في المغرب. اختصار «السلام عليكم».' },
          arabizi: 'Salam',
          arabic: 'سَلَامْ',
          translation: { fr: 'Bonjour / Paix', en: 'Hello / Peace', es: 'Hola / Paz', ar: 'مرحباً / سلام' }
        }
      },
  {
        id: 'm1_l2_tip_salutations',
        type: 'culture_tip',
        cultureTip: {
          title: 'L’art des salutations — et les nouvelles de la famille',
          badge: '🇳🇦 Code social marocain',
          content: 'On n’enchaîne pas seulement les salutations : on y répond toujours. Quand on te dit « Salam », tu réponds « Wa 3alaykum salam ». On enchaîne aussitôt avec les nouvelles rituelles : « Kif dayer ? » (toi, au masculin( ou « Kif dayra ? » (à une femme( puis « Wa l-3ayla ? » — on demande toujours des nouvelles de la famille, c’est la politesse du pays. « Lah ykhelef » (que Dieu te rende la pareille( est la réponse obligée quand on te dit « merci ».',
          expressions: [
            { darija: 'Salam u 3alaykum', arabicWithTashkeel: 'السَّلَامُ عَلَيْكُمْ', french: 'Que la paix soit sur toi' },
            { darija: 'Wa 3alaykum salam', arabicWithTashkeel: 'وَعَلَيْكُمُ السَّلَامْ', french: 'Et sur toi la paix' },
            { darija: 'Kif dayer ?', arabicWithTashkeel: 'كِيفْ دَايِرْ؟', french: 'Comment vas-tu ? (au masculin)' },
            { darija: 'Wa l-3ayla ?', arabicWithTashkeel: 'وَ الْعَايْلَةْ؟', french: 'Et la famille, comment va-t-elle ?' },
            { darija: 'Lah ykhelef', arabicWithTashkeel: 'اللّٰه يْخَلِّفْ', french: 'Que Dieu te rende la pareille' },
          ],
        },
      },
      {
        id: 's2_learn_salam_3alaykum',
        type: 'learning',
        content: {
          title: { fr: 'La paix sur vous', en: 'Peace be upon you', es: 'La paz sea con usted', ar: 'السلام عليكم' },
          description: { fr: 'La salutation complète. On l\'emploie en entrant dans un lieu, même chez le commerçant.', en: 'The full greeting. Used when entering a place, even a shop.', es: 'El saludo completo. Se usa al entrar en un lugar.', ar: 'التحية الكاملة. تُستعمل عند دخول المكان.' },
          arabizi: 'Salam u 3alaykum',
          arabic: 'السَّلَامُ عَلَيْكُمْ',
          translation: { fr: 'Que la paix soit sur vous', en: 'Peace be upon you', es: 'La paz sea con usted', ar: 'السلام عليكم' }
        }
      },
      {
        id: 's3_learn_reply',
        type: 'learning',
        content: {
          title: { fr: 'Et sur vous la paix', en: 'And upon you peace', es: 'Y sobre usted la paz', ar: 'وعليكم السلام' },
          description: { fr: 'La réponse rituelle. Ne pas répondre est perçu comme un manque de politesse.', en: 'The ritual reply. Not replying is seen as impolite.', es: 'La respuesta ritual. No responder se considera descortés.', ar: 'الرد الواجب. عدم الرد يُعتبر قلة أدب.' },
          arabizi: 'Wa 3alaykum salam',
          arabic: 'وَعَلَيْكُمُ السَّلَامْ',
          translation: { fr: 'Et sur vous la paix', en: 'And upon you peace', es: 'Y sobre usted la paz', ar: 'وعليكم السلام' }
        }
      },
      {
        id: 's4_exercise_reply',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_reply',
          type: 'mcq',
          prompt: { fr: 'On vous dit « Salam u 3alaykum ». Que répondez-vous ?', en: 'Someone says "Salam u 3alaykum". What do you reply?', es: 'Alguien dice «Salam u 3alaykum». ¿Qué respondes?', ar: 'قال لك أحدهم «السلام عليكم». بماذا ترد؟' },
          options: [
            { id: 'opt_wa3', text: 'Wa 3alaykum salam', isCorrect: true },
            { id: 'opt_shokran', text: 'Shokran', isCorrect: false }
          ],
          answer: 'opt_wa3',
          explanation: { fr: 'La réponse à « Salam u 3alaykum » est « Wa 3alaykum salam ». « Shokran » veut dire merci, ce n\'est pas une réponse à une salutation.', en: 'The reply to "Salam u 3alaykum" is "Wa 3alaykum salam". "Shokran" means thank you.', es: 'La respuesta a «Salam u 3alaykum» es «Wa 3alaykum salam».', ar: 'الرد على «السلام عليكم» هو «وعليكم السلام».' }
        }
      },
      {
        id: 's5_exercise_reorder_reply',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_reorder_reply',
          type: 'scramble',
          prompt: { fr: 'Reconstituez la réponse dans le bon ordre.', en: 'Rebuild the reply in the right order.', es: 'Reconstruye la respuesta en el orden correcto.', ar: 'أعد ترتيب الرد بالترتيب الصحيح.' },
          options: [
            { id: 'w_wa', text: 'Wa', isCorrect: true },
            { id: 'w_3alaykum', text: '3alaykum', isCorrect: true },
            { id: 'w_salam', text: 'salam', isCorrect: true }
          ],
          answer: ['w_wa', 'w_3alaykum', 'w_salam'],
          explanation: { fr: 'L\'ordre est : Wa + 3alaykum + salam.', en: 'The order is: Wa + 3alaykum + salam.', es: 'El orden es: Wa + 3alaykum + salam.', ar: 'الترتيب هو: وعليكم سلام.' }
        }
      }
    ]
  },
  {
    id: 'l3_greetings_2',
    title: { fr: '3. Prendre des nouvelles : Labas, Kidayr', en: '3. Asking how are you: Labas, Kidayr', es: '3. Preguntar cómo estás: Labas, Kidayr', ar: '3. السؤال عن الحال: لاباس، كيدير' },
    level: 1,
    description: { fr: 'Demander comment va quelqu\'un, au masculin et au féminin.', en: 'Ask how someone is doing, male and female forms.', es: 'Preguntar cómo está alguien, masculino y femenino.', ar: 'السؤال عن حال شخص ما، للمذكر والمؤنث.' },
    steps: [
      {
        id: 's1_learn_labas',
        type: 'learning',
        content: {
          title: { fr: 'Ça va ?', en: 'How are you?', es: '¿Qué tal?', ar: 'لاباس؟' },
          description: { fr: 'La façon standard de demander comment va quelqu\'un.', en: 'The standard way to ask how someone is.', es: 'La forma estándar de preguntar cómo está alguien.', ar: 'الطريقة القياسية للسؤال عن الحال.' },
          arabizi: 'Labas?',
          arabic: 'لَابَاسْ؟',
          translation: { fr: 'Ça va ?', en: 'How are you?', es: '¿Qué tal?', ar: 'كيف حالك؟' }
        }
      },
      {
        id: 's2_learn_kidayr',
        type: 'learning',
        content: {
          title: { fr: 'Comment vas-tu ? (à un homme)', en: 'How are you? (to a man)', es: '¿Cómo estás? (a un hombre)', ar: 'كيف حالك؟ (لرجل)' },
          description: { fr: 'Forme adressée à un homme. Le son final r marque le masculin.', en: 'Form addressed to a man. The final r marks the masculine.', es: 'Forma dirigida a un hombre.', ar: 'صيغة موجهة للرجل.' },
          arabizi: 'Kidayr?',
          arabic: 'كِيدَايِرْ؟',
          translation: { fr: 'Comment vas-tu ? (m)', en: 'How are you? (m)', es: '¿Cómo estás? (m)', ar: 'كيف حالك؟ (مذكر)' }
        }
      },
      {
        id: 's3_learn_kidayra',
        type: 'learning',
        content: {
          title: { fr: 'Comment vas-tu ? (à une femme)', en: 'How are you? (to a woman)', es: '¿Cómo estás? (a una mujer)', ar: 'كيف حالك؟ (لامرأة)' },
          description: { fr: 'Forme adressée à une femme : on ajoute un a final à « Kidayr ».', en: 'Form addressed to a woman: add a final a to "Kidayr".', es: 'Forma dirigida a una mujer: se añade una a final.', ar: 'صيغة موجهة للمرأة: نضيف ألفاً في النهاية.' },
          arabizi: 'Kidayra?',
          arabic: 'كِيدَايْرَةْ؟',
          translation: { fr: 'Comment vas-tu ? (f)', en: 'How are you? (f)', es: '¿Cómo estás? (f)', ar: 'كيف حالك؟ (مؤنث)' }
        }
      },
      {
        id: 's4_exercise_kidayra',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_kidayra',
          type: 'mcq',
          prompt: { fr: 'Vous demandez des nouvelles à une amie. Que dites-vous ?', en: 'You ask a female friend how she is. What do you say?', es: 'Preguntas a una amiga cómo está. ¿Qué dices?', ar: 'تسأل صديقتك عن حالها. بماذا تقول؟' },
          options: [
            { id: 'opt_kidayra', text: 'Kidayra?', isCorrect: true },
            { id: 'opt_kidayr', text: 'Kidayr?', isCorrect: false }
          ],
          answer: 'opt_kidayra',
          explanation: { fr: 'À une femme on dit « Kidayra ? », avec le a final. « Kidayr ? » s\'adresse à un homme.', en: 'To a woman, say "Kidayra?" with the final a. "Kidayr?" is for a man.', es: 'A una mujer se le dice «Kidayra?».', ar: 'للمرأة نقول «كيديرة؟».' }
        }
      },
      {
        id: 's5_exercise_reorder_greeting',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_reorder_greeting',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : « Bonjour, comment vas-tu, ça va ? »', en: 'Rebuild: "Hello, how are you, all good?"', es: 'Reconstruye: «Hola, ¿cómo estás, qué tal?»', ar: 'أعد ترتيب: «سلام، كيدير، لاباس؟»' },
          options: [
            { id: 'g_salam', text: 'Salam,', isCorrect: true },
            { id: 'g_kidayr', text: 'kidayr,', isCorrect: true },
            { id: 'g_labas', text: 'labas?', isCorrect: true }
          ],
          answer: ['g_salam', 'g_kidayr', 'g_labas'],
          explanation: { fr: 'On salue d\'abord (Salam), puis on demande (kidayr), puis on vérifie (labas?).', en: 'Greet first (Salam), then ask (kidayr), then check (labas?).', es: 'Primero saluda (Salam), luego pregunta (kidayr), luego confirma (labas?).', ar: 'نبدأ بالتحية (سلام)، ثم السؤال (كيدير)، ثم التأكيد (لاباس؟).' }
        }
      }
    ]
  },
  {
    id: 'l4_greetings_3',
    title: { fr: '4. Répondre : L7amdullah & Bikhir', en: '4. Replying: L7amdullah & Bikhir', es: '4. Responder: L7amdullah & Bikhir', ar: '4. الرد: الحمد لله وبخير' },
    level: 1,
    description: { fr: 'Répondre « ça va, Dieu merci ».', en: 'Reply "fine, thank God".', es: 'Responder «bien, gracias a Dios».', ar: 'الرد بـ «بخير، الحمد لله».' },
    steps: [
      {
        id: 's1_learn_l7amdoulillah',
        type: 'learning',
        content: {
          title: { fr: 'Dieu Merci', en: 'Thank God', es: 'Gracias a Dios', ar: 'الحمد لله' },
          description: { fr: 'On répond toujours par « Labas, l7amdullah ». Le son 7 est appuyé.', en: 'We always reply with "Labas, l7amdullah".', es: 'Siempre respondemos con «Labas, l7amdullah».', ar: 'نرد دائماً بـ «لاباس، الحمد لله».' },
          arabizi: 'l7amdullah',
          arabic: 'الْحَمْدُ لِلَّهْ',
          translation: { fr: 'Dieu merci', en: 'Thank God', es: 'Gracias a Dios', ar: 'الحمد لله' }
        }
      },
      {
        id: 's2_learn_bikhir',
        type: 'learning',
        content: {
          title: { fr: 'Bien', en: 'Fine', es: 'Bien', ar: 'بخير' },
          description: { fr: 'Réponse courte et positive. On la complète souvent par « rbi ykhellik » (que Dieu te garde).', en: 'A short positive reply, often completed by "rbi ykhellik" (may God keep you).', es: 'Respuesta corta y positiva, a menudo completada con «rbi ykhellik».', ar: 'رد قصير وإيجابي، غالباً نكمله بـ «ربي يخليك».' },
          arabizi: 'Bikhir, rbi ykhellik',
          arabic: 'بْخِيرْ، رَبِّي يْخَلِّيكْ',
          translation: { fr: 'Bien, que Dieu te garde', en: 'Fine, may God keep you', es: 'Bien, que Dios te guarde', ar: 'بخير، ربي يخليك' }
        }
      },
      {
        id: 's3_learn_kullshi',
        type: 'learning',
        content: {
          title: { fr: 'Tout va bien ?', en: 'Is everything fine?', es: '¿Todo bien?', ar: 'كلشي بخير؟' },
          description: { fr: 'Question de relance pour prendre des nouvelles de la famille ou du travail.', en: 'A follow-up question about family or work.', es: 'Pregunta de seguimiento sobre la familia o el trabajo.', ar: 'سؤال متابعة عن العائلة أو العمل.' },
          arabizi: 'Kullshi bikhir?',
          arabic: 'كُلْشِي بْخِيرْ؟',
          translation: { fr: 'Tout va bien ?', en: 'Is everything fine?', es: '¿Todo bien?', ar: 'كلشي بخير؟' }
        }
      },
      {
        id: 's4_exercise_polite',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_polite',
          type: 'mcq',
          prompt: { fr: 'Quelle formule accompagne souvent « Bikhir » pour remercier ?', en: 'Which phrase often accompanies "Bikhir" to thank?', es: '¿Qué fórmula acompaña a menudo «Bikhir» para agradecer?', ar: 'أي عبارة ترافق «بخير» للشكر؟' },
          options: [
            { id: 'opt_rbi', text: 'rbi ykhellik', isCorrect: true },
            { id: 'opt_smeh', text: 'smeh li', isCorrect: false }
          ],
          answer: 'opt_rbi',
          explanation: { fr: '« rbi ykhellik » (que Dieu te garde) remercie et bénit. « smeh li » veut dire excuse-moi.', en: '"rbi ykhellik" thanks and blesses. "smeh li" means excuse me.', es: '«rbi ykhellik» agradece y bendice. «smeh li» significa perdóname.', ar: '«ربي يخليك» للشكر والبركة. «سمح لي» تعني اعذرني.' }
        }
      },
      {
        id: 's5_exercise_reorder_reply',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_reorder_reply2',
          type: 'reorder',
          prompt: { fr: 'Reconstituez la réponse complète.', en: 'Rebuild the full reply.', es: 'Reconstruye la respuesta completa.', ar: 'أعد ترتيب الرد الكامل.' },
          options: [
            { id: 'r_labas', text: 'Labas,', isCorrect: true },
            { id: 'r_l7amd', text: 'l7amdullah,', isCorrect: true },
            { id: 'r_kullshi', text: 'kullshi bikhir', isCorrect: true }
          ],
          answer: ['r_labas', 'r_l7amd', 'r_kullshi'],
          explanation: { fr: 'On répond : Labas, l7amdullah, puis on relance : kullshi bikhir.', en: 'Reply: Labas, l7amdullah, then follow up: kullshi bikhir.', es: 'Responde: Labas, l7amdullah, luego pregunta: kullshi bikhir.', ar: 'نرد: لاباس، الحمد لله، ثم نسأل: كلشي بخير.' }
        }
      }
    ]
  },
  {
    id: 'l5_politeness_1',
    title: { fr: '5. Politesse : Shokran, Bla jmil, Smeh li', en: '5. Politeness: Shokran, Bla jmil, Smeh li', es: '5. Cortesía: Shokran, Bla jmil, Smeh li', ar: '5. المجاملة: شكرا، بلا جميل، سمح لي' },
    level: 1,
    description: { fr: 'Remercier, répondre aux remerciements et s\'excuser.', en: 'Thank, answer thanks and apologize.', es: 'Agradecer, responder y disculparse.', ar: 'الشكر والرد عليه والاعتذار.' },
    steps: [
      {
        id: 's1_learn_shokran',
        type: 'learning',
        content: {
          title: { fr: 'Merci beaucoup', en: 'Thank you very much', es: 'Muchas gracias', ar: 'شكرا بزاف' },
          description: { fr: '« Shokran » seul suffit ; « bzzaf » (beaucoup) renforce le remerciement.', en: '"Shokran" alone is enough; "bzzaf" (a lot) strengthens it.', es: '«Shokran» solo basta; «bzzaf» lo refuerza.', ar: '«شكرا» وحدها تكفي؛ «بزاف» تؤكد الشكر.' },
          arabizi: 'Shokran bzzaf',
          arabic: 'شُكْرًا بْزَّافْ',
          translation: { fr: 'Merci beaucoup', en: 'Thank you very much', es: 'Muchas gracias', ar: 'شكرا بزاف' }
        }
      },
  {
        id: 'm1_l5_tip_mots_magiques',
        type: 'culture_tip',
        cultureTip: {
          title: '3afak, l’épine dorsale de la politesse',
          badge: '🇳🇦 Les mots magiques',
          content: '« 3afak »(s’il te plaît( est le mot que tu entendras le plus souvent, du souk au taxi. Pour remercier, on ne dit pas seulement « merci » : on bénit. « Bssa7a » après un repas ou un achat, ou « Allah y3tik l-3afya »(que Dieu te donne la force( après un effort.',
          expressions: [
            { darija: '3afak', arabicWithTashkeel: 'عَفَاكْ', french: 'S’il te plaît' },
            { darija: 'Bssa7a', arabicWithTashkeel: 'بْصَحَّةْ', french: 'À ta santé' },
            { darija: 'Allah y3tik l-3afya', arabicWithTashkeel: 'اللّٰه يْعْطِيكْ العَافْيَةْ', french: 'Que Dieu te donne la force' },
          ],
        },
      },
      {
        id: 's2_learn_bla_jmil',
        type: 'learning',
        content: {
          title: { fr: 'De rien', en: 'You are welcome', es: 'De nada', ar: 'بلا جميل' },
          description: { fr: 'Littéralement « sans faveur » : on répond aux remerciements.', en: 'Literally "without favor": the reply to thanks.', es: 'Literalmente «sin favor»: la respuesta a las gracias.', ar: 'حرفياً «بدون جميل»: الرد على الشكر.' },
          arabizi: 'Bla jmil',
          arabic: 'بْلَا جْمِيلْ',
          translation: { fr: 'De rien', en: 'You are welcome', es: 'De nada', ar: 'عفواً' }
        }
      },
      {
        id: 's3_learn_smeh_li',
        type: 'learning',
        content: {
          title: { fr: 'Excuse-moi', en: 'Excuse me', es: 'Perdóname', ar: 'سمح لي' },
          description: { fr: 'Pour s\'excuser ou attirer l\'attention. À une femme on dit « Semhi li ».', en: 'To apologize or draw attention. To a woman, say "Semhi li".', es: 'Para disculparse o llamar la atención. A una mujer: «Semhi li».', ar: 'للاعتذار أو لفت الانتباه. للمرأة نقول «سمحي لي».' },
          arabizi: 'Smeh li',
          arabic: 'سْمَحْ لِيْ',
          translation: { fr: 'Excuse-moi', en: 'Excuse me', es: 'Perdóname', ar: 'سمح لي' }
        }
      },
      {
        id: 's4_exercise_bla_jmil',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_bla_jmil',
          type: 'mcq',
          prompt: { fr: 'Que signifie « Bla jmil » ?', en: 'What does "Bla jmil" mean?', es: '¿Qué significa «Bla jmil»?', ar: 'ماذا تعني «بلا جميل»؟' },
          options: [
            { id: 'opt_derien', text: 'De rien', isCorrect: true },
            { id: 'opt_merci', text: 'Merci beaucoup', isCorrect: false }
          ],
          answer: 'opt_derien',
          explanation: { fr: '« Bla jmil » est la réponse à un remerciement, l\'équivalent de « de rien ».', en: '"Bla jmil" replies to thanks, like "you are welcome".', es: '«Bla jmil» responde a las gracias.', ar: '«بلا جميل» رد على الشكر.' }
        }
      },
      {
        id: 's5_exercise_match_politeness',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_match_politeness',
          type: 'matching',
          prompt: { fr: 'Reliez chaque formule à sa fonction.', en: 'Match each phrase to its function.', es: 'Une cada fórmula con su función.', ar: 'اربط كل عبارة بوظيفتها.' },
          pairs: [
            { id: 'pair_thanks', left: { text: 'Shokran' }, right: { text: { fr: 'Merci', en: 'Thank you', es: 'Gracias', ar: 'شكراً' } } },
            { id: 'pair_derien', left: { text: 'Bla jmil' }, right: { text: { fr: 'De rien', en: 'You are welcome', es: 'De nada', ar: 'عفواً' } } },
            { id: 'pair_sorry', left: { text: 'Smeh li' }, right: { text: { fr: 'Excuse-moi', en: 'Excuse me', es: 'Perdóname', ar: 'سمح لي' } } }
          ],
          explanation: { fr: 'Shokran remercie, Bla jmil répond au remerciement, Smeh li s\'excuse.', en: 'Shokran thanks, Bla jmil replies to thanks, Smeh li apologizes.', es: 'Shokran agradece, Bla jmil responde, Smeh li se disculpa.', ar: 'شكرا للشكر، بلا جميل للرد، سمح لي للاعتذار.' }
        }
        },
        {
          id: 's6_boss_challenge',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_boss_driss',
          type: 'roleplay_challenge',
          prompt: {
            fr: 'Épreuve finale : relevez le défi « Au café avec Driss » puis enchaînez sur l\'onglet Parler.',
            en: 'Final challenge: take on the "Cafe with Driss" challenge, then continue on the Parler tab.',
            es: 'Desafio final: supera el reto «En el cafe con Driss» y luego continua en la pestana Parler.',
            ar: 'التحدي الختامي: خض مغامرة «في المقهى مع دريس» ثم انتقل إلى تبويب Parler.'
          },
          dialogueContext: {
            fr: 'Vous entrez au Cafe du Coin. Driss, le serveur, vous accueille.',
            en: 'You walk into the Corner Cafe. Driss, the waiter, welcomes you.',
            es: 'Entras al Cafe de la Esquina. Driss, el camarero, te da la bienvenida.',
            ar: 'تدخل إلى مقهى الزاوية. النادل دريس يرحب بك.'
          },
          npcStartLine: {
            arabizi: 'Salamu 3alaykom ! Ach 7abb l-khatr a sidi ?',
            arabic: 'السَّلَامُ عَلَيْكُمْ ! آشْ حَبّْ الخَاطْرْ أَ سِيدِيْ ؟',
            translation: {
              fr: 'Bonjour ! Que desirez-vous, monsieur ?',
              en: 'Hello! What would you like, sir?',
              es: 'Hola! Que desea, senor?',
              ar: 'مرحبا! ماذا تريد يا سيدي؟'
            }
          },
          answer: '',
          explanation: {
            fr: 'Vous repondez rituellement a la salutation, puis vous commandez poliment. Ce defi vous prepare au dialogue ouvert avec Driss dans l\'onglet Parler.',
            en: 'You reply to the greeting ritually, then order politely. This challenge prepares you for the open dialogue with Driss on the Parler tab.',
            es: 'Respondes al saludo ritualmente y luego pides con cortesia. Este reto te prepara para el dialogo abierto con Driss.',
            ar: 'ترد على التحية ثم تطلب بأدب. هذا التحدي يهيئك للحوار المفتوح مع دريس في تبويب Parler.'
          },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: {
                arabizi: 'Wa 3alaykum salam ! 3afak, bghit wa7ed atay b-ne3na3.',
                arabic: 'وَعَلَيْكُمُ السَّلَامْ ! عَفَاكْ، بْغِيتْ وَاحْدْ أَتَايْ بْ نَعْنَاعْ.',
                translation: {
                  fr: 'Et sur vous la paix ! S\'il vous plait, je veux un the a la menthe.',
                  en: 'And upon you peace! Please, I would like a mint tea.',
                  es: 'Y sobre usted la paz! Por favor, quiero un te de menta.',
                  ar: 'وعليكم السلام! من فضلك، أريد شاياً بالنعناع.'
                }
              },
              isOptimal: true,
              nextNpcLine: 'Wa 3alaykum. Mezyan, ghadi njib lik wa7ed atay skhoun !',
              feedback: {
                fr: 'Parfait ! Vous repondez a la salutation puis commandez avec « 3afak ».',
                en: 'Perfect! You answer the greeting then order with "3afak".',
                es: 'Perfecto! Respondes al saludo y pides con «3afak».',
                ar: 'ممتاز! ترد على التحية ثم تطلب بكلمة «عفاك».'
              }
            },
            {
              id: 'boss_c2',
              text: {
                arabizi: 'Shokran bzzaf !',
                arabic: 'شُكْرًا بْزَّافْ !',
                translation: {
                  fr: 'Merci beaucoup !',
                  en: 'Thank you very much!',
                  es: 'Muchas gracias!',
                  ar: 'شكرا جزيلا!'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Bla jmil a sidi, walakin ach 7abb l-khatr ?',
              feedback: {
                fr: 'Pas encore : Driss vient de vous souhaiter la bienvenue. Remerciez apres la commande, pas avant.',
                en: 'Not yet: Driss just welcomed you. Thank after ordering, not before.',
                es: 'Todavia no: Driss te ha dado la bienvenida. Agradece despues de pedir.',
                ar: 'ليس بعد: دريس رحب بك فقط. اشكر بعد الطلب، ليس قبله.'
              }
            },
            {
              id: 'boss_c3',
              text: {
                arabizi: 'Smeh li, ma fhemtch.',
                arabic: 'سْمَحْ لِيْ، مَا فْهِمْتْشْ.',
                translation: {
                  fr: 'Excusez-moi, je n\'ai pas compris.',
                  en: 'Excuse me, I did not understand.',
                  es: 'Perdon, no he entendido.',
                  ar: 'اعذرني، لم أفهم.'
                }
              },
              isOptimal: false,
              nextNpcLine: 'Ma 3reftch. N3awed: ach 7abb l-khatr a sidi ?',
              feedback: {
                fr: '« Smeh li » excuse une incomprehension, mais ici Driss vous a accueilli : repondez d\'abord a la salutation.',
                en: '"Smeh li" excuses a misunderstanding, but here Driss welcomed you: reply to the greeting first.',
                es: '«Smeh li» disculpa, pero aqui Driss te saludo: responde primero al saludo.',
                ar: '«سمح لي» للاعتذار، لكن دريس رحب بك: رد على التحية أولا.'
              }
            }
          ]
        }
      }
    ],

  },
  {
    id: 'l6_pronouns_1',
    title: { fr: '6. Les pronoms sujets', en: '6. Subject pronouns', es: '6. Los pronombres sujeto', ar: '6. ضمائر الفاعل' },
    level: 1,
    description: { fr: 'Les pronoms personnels, du singulier au pluriel.', en: 'Personal pronouns, from singular to plural.', es: 'Los pronombres personales, del singular al plural.', ar: 'الضمائر الشخصية، من المفرد إلى الجمع.' },
    steps: [
      {
        id: 's1_learn_ana',
        type: 'learning',
        content: {
          title: { fr: 'Moi / Je', en: 'I / Me', es: 'Yo', ar: 'أنا' },
          description: { fr: 'Le pronom pour la première personne.', en: 'First-person pronoun.', es: 'Pronombre de primera persona.', ar: 'ضمير المتكلم.' },
          arabizi: 'Ana',
          arabic: 'أَنَا',
          translation: { fr: 'Je', en: 'I', es: 'Yo', ar: 'أنا' }
        }
      },
      {
        id: 's2_learn_nta_nti',
        type: 'learning',
        content: {
          title: { fr: 'Toi / Tu (masculin et féminin)', en: 'You (male and female)', es: 'Tú (masculino y femenino)', ar: 'أنتَ وأنتِ' },
          description: { fr: '« Nta » pour un homme, « Nti » pour une femme.', en: '"Nta" for a man, "Nti" for a woman.', es: '«Nta» para un hombre, «Nti» para una mujer.', ar: '«نتا» للرجل، «نتي» للمرأة.' },
          arabizi: 'Nta / Nti',
          arabic: 'نْتَا / نْتِيْ',
          translation: { fr: 'Tu (m) / Tu (f)', en: 'You (m) / You (f)', es: 'Tú (m) / Tú (f)', ar: 'أنتَ / أنتِ' }
        }
      },
      {
        id: 's3_learn_huwa_hiya',
        type: 'learning',
        content: {
          title: { fr: 'Il et Elle', en: 'He and She', es: 'Él y Ella', ar: 'هو وهي' },
          description: { fr: '« Huwa » pour lui, « Hiya » pour elle.', en: '"Huwa" for him, "Hiya" for her.', es: '«Huwa» para él, «Hiya» para ella.', ar: '«هو» له، «هي» لها.' },
          arabizi: 'Huwa / Hiya',
          arabic: 'هُوَاْ / هِيَاْ',
          translation: { fr: 'Il / Elle', en: 'He / She', es: 'Él / Ella', ar: 'هو / هي' }
        }
      },
      {
        id: 's4_learn_hna_ntuma',
        type: 'learning',
        content: {
          title: { fr: 'Nous et Vous', en: 'We and You (plural)', es: 'Nosotros y Ustedes', ar: 'حنا وأنتوما' },
          description: { fr: '« Hna » pour nous, « Ntuma » pour vous (plusieurs personnes).', en: '"Hna" for we, "Ntuma" for you (several people).', es: '«Hna» para nosotros, «Ntuma» para ustedes.', ar: '«حنا» لنا، «نتوما» لكم.' },
          arabizi: 'Hna / Ntuma',
          arabic: 'حْنَا / نْتُومَاْ',
          translation: { fr: 'Nous / Vous', en: 'We / You (pl)', es: 'Nosotros / Ustedes', ar: 'نحن / أنتم' }
        }
      },
      {
        id: 's5_exercise_nti',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_nti',
          type: 'mcq',
          prompt: { fr: 'Quel pronom utilisez-vous pour dire « tu » à une femme ?', en: 'Which pronoun do you use to say "you" to a woman?', es: '¿Qué pronombre usas para decir «tú» a una mujer?', ar: 'أي ضمير تستعمل لقول «أنت» لامرأة؟' },
          options: [
            { id: 'opt_nti', text: 'Nti', isCorrect: true },
            { id: 'opt_nta', text: 'Nta', isCorrect: false }
          ],
          answer: 'opt_nti',
          explanation: { fr: '« Nti » s\'adresse à une femme ; « Nta » à un homme.', en: '"Nti" is for a woman; "Nta" for a man.', es: '«Nti» es para una mujer; «Nta» para un hombre.', ar: '«نتي» للمرأة، «نتا» للرجل.' }
        }
      },
      {
        id: 's6_exercise_match_pronouns',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_match_pronouns',
          type: 'matching',
          prompt: { fr: 'Reliez chaque pronom à sa traduction.', en: 'Match each pronoun to its translation.', es: 'Une cada pronombre con su traducción.', ar: 'اربط كل ضمير بترجمته.' },
          pairs: [
            { id: 'pair_ana', left: { text: 'Ana' }, right: { text: { fr: 'Je', en: 'I', es: 'Yo', ar: 'أنا' } } },
            { id: 'pair_huwa', left: { text: 'Huwa' }, right: { text: { fr: 'Il', en: 'He', es: 'Él', ar: 'هو' } } },
            { id: 'pair_hiya', left: { text: 'Hiya' }, right: { text: { fr: 'Elle', en: 'She', es: 'Ella', ar: 'هي' } } },
            { id: 'pair_hna', left: { text: 'Hna' }, right: { text: { fr: 'Nous', en: 'We', es: 'Nosotros', ar: 'نحن' } } }
          ],
          explanation: { fr: 'Ana = je, Huwa = il, Hiya = elle, Hna = nous.', en: 'Ana = I, Huwa = he, Hiya = she, Hna = we.', es: 'Ana = yo, Huwa = él, Hiya = ella, Hna = nosotros.', ar: 'أنا = je، هو = il، هي = elle، حنا = nous.' }
        }
      },
      {
        id: 's7_exercise_ana',
        type: 'exercise',
        exercise: {
          id: 'ex_m1_ana',
          type: 'mcq',
          prompt: { fr: 'Complétez : « ___ fer7an » (Je suis content).', en: 'Fill in: "___ fer7an" (I am happy).', es: 'Completa: «___ fer7an» (Estoy contento).', ar: 'أكمل: «___ فرحان» (أنا سعيد).' },
          options: [
            { id: 'opt_ana', text: 'Ana', isCorrect: true },
            { id: 'opt_nta', text: 'Nta', isCorrect: false }
          ],
          answer: 'opt_ana',
          explanation: { fr: 'On dit « Ana fer7an » : le pronom de la première personne est « Ana ».', en: 'We say "Ana fer7an": the first-person pronoun is "Ana".', es: 'Decimos «Ana fer7an»: el pronombre de primera persona es «Ana».', ar: 'نقول «أنا فرحان»: ضمير المتكلم هو «أنا».' }
        }
      }
    ]
  }
];

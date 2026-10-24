import type { MultiLangText } from '../types/curriculum';

/** Une réplique localisée : arabizi + arabe vocalisé + traduction 4 langues. */
export interface GemPhrase {
  arabizi: string;
  arabic: string;
  translation: MultiLangText;
}

export type GemCategory = 'pingpong' | 'proverb';

/** « Ping-Pong Social » : formule entendue → réponse exacte attendue. */
export interface PingPongGem {
  id: string;
  category: 'pingpong';
  situation: MultiLangText;
  prompt: GemPhrase;
  response: GemPhrase;
  context: MultiLangText;
}

/** « Sagesse de la Rue » : proverbe ou expression imagée. */
export interface ProverbGem {
  id: string;
  category: 'proverb';
  expression: GemPhrase;
  literal: MultiLangText;
  meaning: MultiLangText;
  streetExample: GemPhrase;
}

export type CulturalGem = PingPongGem | ProverbGem;

export const PINGPONG_GEMS: PingPongGem[] = [
  {
    id: 'pp_salam',
    category: 'pingpong',
    situation: {
      fr: 'Deux personnes se croisent dans la rue.',
      en: 'Two people pass each other in the street.',
      es: 'Dos personas se cruzan en la calle.',
      ar: 'شخصان يتقابلان في الشارع.',
    },
    prompt: {
      arabizi: 'Salam 3likom',
      arabic: 'سَلَامْ عَلَيْكُمْ',
      translation: {
        fr: 'La paix sur vous',
        en: 'Peace be upon you',
        es: 'La paz sea con vosotros',
        ar: 'السلام عليكم',
      },
    },
    response: {
      arabizi: 'Wa 3likom salam',
      arabic: 'وَ عَلَيْكُمْ سَلَامْ',
      translation: {
        fr: 'Et sur vous la paix',
        en: 'And peace be upon you too',
        es: 'Y la paz sea contigo también',
        ar: 'وعليكم السلام',
      },
    },
    context: {
      fr: 'Salutation d’ouverture, à toute heure. Elle s’adresse à une ou plusieurs personnes ; la réponse reprend toujours la formule en miroir.',
      en: 'Opening greeting, at any hour. It works for one or several people; the reply always mirrors the formula.',
      es: 'Saludo de apertura, a cualquier hora. Vale para una o varias personas; la respuesta repite siempre la fórmula.',
      ar: 'تحية الافتتاح في أي وقت. تُقال لشخص أو لجماعة، والردّ يعكس الصيغة نفسها.',
    },
  },
  {
    id: 'pp_labas',
    category: 'pingpong',
    situation: {
      fr: 'Un voisin t’aborde devant l’épicerie.',
      en: 'A neighbour greets you outside the corner shop.',
      es: 'Un vecino te aborda delante de la tienda.',
      ar: 'جارك يحييك أمام دكان الحي.',
    },
    prompt: {
      arabizi: 'Labas 3lik ?',
      arabic: 'لَابَاسْ عَلِيكْ ؟',
      translation: { fr: 'Ça va ?', en: 'How are you?', es: '¿Qué tal?', ar: 'لا بأس عليك؟' },
    },
    response: {
      arabizi: 'Labas, l7amdollah.',
      arabic: 'لَابَاسْ، الْحَمْدُ لِلَّهْ.',
      translation: {
        fr: 'Ça va, Dieu merci.',
        en: 'Fine, thank God.',
        es: 'Bien, gracias a Dios.',
        ar: 'لا بأس، الحمد لله.',
      },
    },
    context: {
      fr: 'La formule la plus courante pour prendre des nouvelles. On ne répond jamais « labas » tout court : la gratitude fait partie de la réponse.',
      en: 'The most common way to ask for news. Never answer just “labas”: gratitude is part of the reply.',
      es: 'La fórmula más habitual para interesarse por alguien. Nunca se responde solo «labas»: la gratitud forma parte de la respuesta.',
      ar: 'أكثر صيغة شيوعاً للسؤال عن الحال. لا يُجاب بـ«لاباس» وحدها: الحمد جزء من الردّ.',
    },
  },
  {
    id: 'pp_kidayr',
    category: 'pingpong',
    situation: {
      fr: 'Tu retrouves un collègue le matin au travail.',
      en: 'You meet a colleague at work in the morning.',
      es: 'Te encuentras con un compañero por la mañana en el trabajo.',
      ar: 'تلتقي بزميل صباحاً في العمل.',
    },
    prompt: {
      arabizi: 'Kidayr ?',
      arabic: 'كِيدَايِرْ ؟',
      translation: { fr: 'Comment tu vas ?', en: 'How are you doing?', es: '¿Cómo estás?', ar: 'كيف حالك؟' },
    },
    response: {
      arabizi: 'Bikhir, chokran. W nta ?',
      arabic: 'بِخِيرْ، شُكْرَنْ. وَ نْتَ ؟',
      translation: {
        fr: 'Bien, merci. Et toi ?',
        en: 'Fine, thanks. And you?',
        es: 'Bien, gracias. ¿Y tú?',
        ar: 'بخير، شكراً. وأنت؟',
      },
    },
    context: {
      fr: 'Entre amis ou collègues. À une femme on dit « kidayra ? ». La question en retour est quasi obligatoire pour ne pas paraître indifférent.',
      en: 'Among friends or colleagues. To a woman, say “kidayra?”. Asking back is almost mandatory so you do not seem indifferent.',
      es: 'Entre amigos o colegas. A una mujer se le dice «kidayra?». Devolver la pregunta es casi obligatorio para no parecer indiferente.',
      ar: 'بين الأصدقاء أو الزملاء. للمرأة نقول «كيدايرة؟». وإعادة السؤال شبه واجبة حتى لا تبدو غير مبالٍ.',
    },
  },
  {
    id: 'pp_sbah',
    category: 'pingpong',
    situation: {
      fr: 'Tu croises le gardien de ton immeuble à 8 h du matin.',
      en: 'You meet your building caretaker at 8 a.m.',
      es: 'Te cruzas con el portero de tu edificio a las 8 de la mañana.',
      ar: 'تلاقي حارس العمارة في الثامنة صباحاً.',
    },
    prompt: {
      arabizi: 'Sbah lkhir',
      arabic: 'صْبَاحْ الْخِيرْ',
      translation: { fr: 'Bonjour (le matin)', en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' },
    },
    response: {
      arabizi: 'Sbah ennour',
      arabic: 'صْبَاحْ النُّورْ',
      translation: {
        fr: 'Matin de lumière',
        en: 'Morning of light',
        es: 'Mañana de luz',
        ar: 'صباح النور',
      },
    },
    context: {
      fr: 'Réservé au matin. La réponse « sbah ennour » est la seule attendue — répondre « sbah lkhir » sonnerait comme un écho maladroit.',
      en: 'Morning only. “Sbah ennour” is the only expected reply — echoing “sbah lkhir” would sound clumsy.',
      es: 'Solo por la mañana. «Sbah ennour» es la única respuesta esperada; repetir «sbah lkhir» suena torpe.',
      ar: 'خاصة بالصباح. الردّ «صباح النور» هو المتوقع؛ تكرار «صباح الخير» يبدو ركيكاً.',
    },
  },
  {
    id: 'pp_mer7ba',
    category: 'pingpong',
    situation: {
      fr: 'Tu franchis la porte d’une maison amie.',
      en: 'You step through the door of a friend’s house.',
      es: 'Cruzas la puerta de la casa de un amigo.',
      ar: 'تدخل بيت صديق.',
    },
    prompt: {
      arabizi: 'Mer7ba bik !',
      arabic: 'مَرْحْبَا بِيكْ !',
      translation: { fr: 'Bienvenue chez toi !', en: 'Welcome!', es: '¡Bienvenido!', ar: 'مرحبا بك!' },
    },
    response: {
      arabizi: 'Llah ykhellik.',
      arabic: 'اللَّهْ يْخَلِّيكْ.',
      translation: {
        fr: 'Que Dieu te garde.',
        en: 'May God keep you.',
        es: 'Que Dios te guarde.',
        ar: 'الله يخليك.',
      },
    },
    context: {
      fr: 'L’hôte ouvre avec « mer7ba » ; l’invité remercie en reconnaissant le bienfait. « Chokran bezzaf » passe aussi, mais « Llah ykhellik » est plus chaleureux.',
      en: 'The host opens with “mer7ba”; the guest thanks by acknowledging the kindness. “Chokran bezzaf” works too, but “Llah ykhellik” is warmer.',
      es: 'El anfitrión abre con «mer7ba»; el invitado agradece reconociendo el favor. «Chokran bezzaf» también vale, pero «Llah ykhellik» es más cálido.',
      ar: 'المضيف يبدأ بـ«مرحبا»، والضيف يشكر معترفاً بالجميل. «شكراً بزاف» مقبولة، لكن «الله يخليك» أدفأ.',
    },
  },
  {
    id: 'pp_3afak',
    category: 'pingpong',
    situation: {
      fr: 'À table, tu demandes qu’on te passe l’eau.',
      en: 'At the table, you ask someone to pass the water.',
      es: 'En la mesa, pides que te pasen el agua.',
      ar: 'على المائدة، تطلب أن يناولوك الماء.',
    },
    prompt: {
      arabizi: '3afak, 3tini l-ma.',
      arabic: 'عَافَاكْ، عْطِينِي الْمَا.',
      translation: {
        fr: 'S’il te plaît, donne-moi l’eau.',
        en: 'Please, give me the water.',
        es: 'Por favor, dame el agua.',
        ar: 'من فضلك، أعطني الماء.',
      },
    },
    response: {
      arabizi: 'Hak, l3afou.',
      arabic: 'هَاكْ، الْعَفْوْ.',
      translation: {
        fr: 'Tiens, je t’en prie.',
        en: 'Here you go, you’re welcome.',
        es: 'Toma, de nada.',
        ar: 'خذ، العفو.',
      },
    },
    context: {
      fr: '« 3afak » sert à la fois pour « s’il te plaît » et « pardon ». « L3afou » couvre « je t’en prie » et « de rien ».',
      en: '“3afak” means both “please” and “excuse me”. “L3afou” covers both “here you go” and “you’re welcome”.',
      es: '«3afak» sirve tanto para «por favor» como para «perdón». «L3afou» cubre «aquí tienes» y «de nada».',
      ar: '«عافاك» تُستعمل لـ«من فضلك» و«المعذرة». و«العفو» تغطي «خذ» و«لا شكر على واجب».',
    },
  },
  {
    id: 'pp_chokran',
    category: 'pingpong',
    situation: {
      fr: 'Un passant t’aide à porter tes sacs.',
      en: 'A passer-by helps you carry your bags.',
      es: 'Un transeúnte te ayuda a llevar las bolsas.',
      ar: 'مارٌّ يساعدك في حمل أكياسك.',
    },
    prompt: {
      arabizi: 'Chokran bezzaf 3la l-mdada.',
      arabic: 'شُكْرَنْ بَزَّافْ عَلَى الْمْدَادَة.',
      translation: {
        fr: 'Merci beaucoup pour l’aide.',
        en: 'Thank you very much for the help.',
        es: 'Muchas gracias por la ayuda.',
        ar: 'شكراً جزيلاً على المساعدة.',
      },
    },
    response: {
      arabizi: 'L3afou, bla jmil.',
      arabic: 'الْعَفْوْ، بْلَا جْمِيلْ.',
      translation: {
        fr: 'Je t’en prie, sans façon.',
        en: 'You’re welcome, no fuss.',
        es: 'De nada, sin compromiso.',
        ar: 'العفو، بلا جميل.',
      },
    },
    context: {
      fr: '« Bla jmil » insiste sur le fait que le service était gratuit, sans attente de retour. Très apprécié dans les échanges de rue.',
      en: '“Bla jmil” stresses that the help was free, with no expectation of return. Very appreciated in street exchanges.',
      es: '«Bla jmil» insiste en que el favor fue gratuito, sin esperar nada a cambio. Muy apreciado en la calle.',
      ar: '«بلا جميل» تؤكد أن المساعدة مجانية بلا انتظار مقابل. وتحظى بتقدير كبير في الشارع.',
    },
  },
  {
    id: 'pp_bslama',
    category: 'pingpong',
    situation: {
      fr: 'Tu quittes la maison d’un ami.',
      en: 'You leave a friend’s house.',
      es: 'Sales de casa de un amigo.',
      ar: 'تغادر بيت صديق.',
    },
    prompt: {
      arabizi: 'Bslama !',
      arabic: 'بْسْلَامَة !',
      translation: { fr: 'Au revoir !', en: 'Goodbye!', es: '¡Adiós!', ar: 'بسلامة!' },
    },
    response: {
      arabizi: 'Bslama, thlla f rasek.',
      arabic: 'بْسْلَامَة، تْحَلَّى فْ رَاسْكْ.',
      translation: {
        fr: 'Au revoir, prends soin de toi.',
        en: 'Goodbye, take care of yourself.',
        es: 'Adiós, cuídate.',
        ar: 'بسلامة، تحلّى في راسك.',
      },
    },
    context: {
      fr: '« Thlla f rasek » littéralement « sois bien dans ta tête », c’est-à-dire prends soin de toi. Très affectueux, entre proches.',
      en: '“Thlla f rasek” literally “be well in your head”, i.e. take care of yourself. Very affectionate, between close ones.',
      es: '«Thlla f rasek» significa literalmente «estate bien en tu cabeza», es decir, cuídate. Muy afectuoso entre allegados.',
      ar: '«تحلّى في راسك» تعني حرفياً «كن بخير في رأسك»، أي اعتنِ بنفسك. ودودة جداً بين المقربين.',
    },
  },
  {
    id: 'pp_l3afya',
    category: 'pingpong',
    situation: {
      fr: 'On vient de te servir un tajine fumant.',
      en: 'Someone has just served you a steaming tagine.',
      es: 'Acaban de servirte un tajín humeante.',
      ar: 'قدّم لك أحدهم طاجيناً ساخناً.',
    },
    prompt: {
      arabizi: 'Allah y3tik l3afya.',
      arabic: 'اللَّهْ يْعْطِيكْ الْعَافْيَة.',
      translation: {
        fr: 'Que Dieu te donne la santé.',
        en: 'May God give you health.',
        es: 'Que Dios te dé salud.',
        ar: 'الله يعطيك العافية.',
      },
    },
    response: {
      arabizi: 'Allah ybarek fik.',
      arabic: 'اللَّهْ يْبَارَكْ فِيكْ.',
      translation: {
        fr: 'Que Dieu te bénisse.',
        en: 'May God bless you.',
        es: 'Que Dios te bendiga.',
        ar: 'الله يبارك فيك.',
      },
    },
    context: {
      fr: 'Se dit à qui sert à manger, travaille ou se lève de table. La réponse consacrée est « Allah ybarek fik » ; on peut aussi renvoyer « Allah y3tik l3afya ».',
      en: 'Said to whoever serves food, works or leaves the table. The customary reply is “Allah ybarek fik”; you may also return “Allah y3tik l3afya”.',
      es: 'Se dice a quien sirve comida, trabaja o se levanta de la mesa. La respuesta consagrada es «Allah ybarek fik»; también puede devolverse «Allah y3tik l3afya».',
      ar: 'تُقال لمن يقدّم الطعام أو يعمل أو يقوم عن المائدة. والردّ المأثور «الله يبارك فيك»، ويمكن ردّ «الله يعطيك العافية».',
    },
  },
  {
    id: 'pp_3id',
    category: 'pingpong',
    situation: {
      fr: 'C’est l’Aïd, tu croises un voisin endimanché.',
      en: 'It is Eid, you meet a neighbour in his best clothes.',
      es: 'Es Eid, te cruzas con un vecino bien arreglado.',
      ar: 'في العيد، تلاقي جاراً في أحسن هيئة.',
    },
    prompt: {
      arabizi: '3id mubarak sa3id !',
      arabic: 'عِيدْ مُبَارَكْ سَعِيدْ !',
      translation: { fr: 'Bonne fête !', en: 'Happy Eid!', es: '¡Feliz Eid!', ar: 'عيد مبارك سعيد!' },
    },
    response: {
      arabizi: 'Kol 3am w nta bkhir.',
      arabic: 'كُلْ عَامْ وَ نْتَ بِخِيرْ.',
      translation: {
        fr: 'Que chaque année te trouve en paix.',
        en: 'May every year find you in peace.',
        es: 'Que cada año te encuentre en paz.',
        ar: 'كل عام وأنت بخير.',
      },
    },
    context: {
      fr: 'Pour l’Aïd, les mariages et les naissances. La réponse « Kol 3am w nta bkhir » (au féminin : « w nti ») est quasi rituelle.',
      en: 'For Eid, weddings and births. The reply “Kol 3am w nta bkhir” (feminine: “w nti”) is almost ritual.',
      es: 'Para el Eid, bodas y nacimientos. La respuesta «Kol 3am w nta bkhir» (femenino: «w nti») es casi ritual.',
      ar: 'للعيد والأعراس والولادات. والردّ «كل عام وأنت بخير» (للمؤنث: «وأنتِ») شبه طقسي.',
    },
  },
  {
    id: 'pp_sme7',
    category: 'pingpong',
    situation: {
      fr: 'Tu bouscules quelqu’un dans le souk.',
      en: 'You bump into someone in the souk.',
      es: 'Empujas a alguien en el zoco.',
      ar: 'تصطدم بشخص في السوق.',
    },
    prompt: {
      arabizi: 'Sme7 liya, m’a chftch.',
      arabic: 'سْمَحْ لِيَا، مَا شُفْتْشْ.',
      translation: {
        fr: 'Pardon, je ne t’ai pas vu.',
        en: 'Sorry, I did not see you.',
        es: 'Perdón, no te vi.',
        ar: 'سامحني، ما شفتك.',
      },
    },
    response: {
      arabizi: 'La baas, makayn mochkil.',
      arabic: 'لَا بَاسْ، مَا كَايِنْ مُشْكِيلْ.',
      translation: {
        fr: 'Pas de mal, il n’y a pas de problème.',
        en: 'No harm, no problem at all.',
        es: 'No pasa nada, no hay problema.',
        ar: 'لا بأس، ما كاين مشكل.',
      },
    },
    context: {
      fr: 'S’excuser dans la rue pour une bousculade ou un retard. « La baas » rassure immédiatement et clôt l’incident.',
      en: 'Apologising in the street for a bump or a delay. “La baas” reassures at once and closes the matter.',
      es: 'Disculparse en la calle por un empujón o un retraso. «La baas» tranquiliza al instante y zanja el asunto.',
      ar: 'الاعتذار في الشارع عن صدمة أو تأخير. و«لا بأس» تطمئن فوراً وتُغلق الموقف.',
    },
  },
  {
    id: 'pp_slamtak',
    category: 'pingpong',
    situation: {
      fr: 'Un ami rentre d’un long voyage.',
      en: 'A friend comes back from a long trip.',
      es: 'Un amigo vuelve de un largo viaje.',
      ar: 'صديق يعود من سفر طويل.',
    },
    prompt: {
      arabizi: '7amdollah 3la slamtak !',
      arabic: 'الْحَمْدُ لِلَّهْ عَلَى سْلَامْتِكْ !',
      translation: {
        fr: 'Dieu merci, te voilà sain et sauf !',
        en: 'Thank God, you are back safe!',
        es: '¡Gracias a Dios, estás sano y salvo!',
        ar: 'الحمد لله على سلامتك!',
      },
    },
    response: {
      arabizi: 'Llah ysallmek.',
      arabic: 'اللَّهْ يْسَلْمِكْ.',
      translation: {
        fr: 'Que Dieu te préserve.',
        en: 'May God keep you safe.',
        es: 'Que Dios te proteja.',
        ar: 'الله يسلمك.',
      },
    },
    context: {
      fr: 'Retour de voyage, sortie d’hôpital, fin d’une épreuve. On répond « Llah ysallmek », jamais « l7amdollah » seul.',
      en: 'Back from a trip, out of hospital, after a hard time. The reply is “Llah ysallmek”, never “l7amdollah” alone.',
      es: 'Vuelta de viaje, salida del hospital, fin de una prueba. Se responde «Llah ysallmek», nunca solo «l7amdollah».',
      ar: 'العودة من السفر، الخروج من المستشفى، نهاية محنة. والردّ «الله يسلمك» لا «الحمد لله» وحدها.',
    },
  },
];

export const PROVERB_GEMS: ProverbGem[] = [
  {
    id: 'pv_lqerd',
    category: 'proverb',
    expression: {
      arabizi: 'L9erd f 3in mmo ghzal.',
      arabic: 'الْقِرْدْ فْ عِينْ مْمُو غْزَالْ.',
      translation: {
        fr: 'Le singe est une gazelle aux yeux de sa mère.',
        en: 'The monkey is a gazelle in its mother’s eyes.',
        es: 'El mono es una gacela a los ojos de su madre.',
        ar: 'القرد في عين أمه غزال.',
      },
    },
    literal: {
      fr: 'Le singe, dans l’œil de sa mère, est une gazelle.',
      en: 'The monkey, in its mother’s eye, is a gazelle.',
      es: 'El mono, a los ojos de su madre, es una gacela.',
      ar: 'القرد في عين أمه غزال.',
    },
    meaning: {
      fr: 'Chacun trouve les siens parfaits : l’amour rend indulgent. Se dit pour excuser un défaut chez un proche.',
      en: 'Everyone finds their own perfect: love makes us lenient. Said to excuse a flaw in someone close.',
      es: 'Cada uno ve perfectos a los suyos: el amor nos vuelve indulgentes. Se dice para disculpar un defecto de un allegado.',
      ar: 'كل واحد يرى أهله كاملين: الحب يجعلنا متسامحين. تُقال للتماس العذر لعيب في قريب.',
    },
    streetExample: {
      arabizi: '— Wach had l-3rs ? — L9erd f 3in mmo ghzal, 3ndhom zwin bezzaf.',
      arabic: '— وَاشْ هَادْ الْعَرْسْ ؟ — الْقِرْدْ فْ عِينْ مْمُو غْزَالْ، عَنْدْهُمْ زْوِينْ بَزَّافْ.',
      translation: {
        fr: '— Comment était ce mariage ? — Chacun trouve les siens parfaits, ils sont adorables.',
        en: '— How was the wedding? — Everyone finds their own perfect, they are lovely.',
        es: '— ¿Cómo era la boda? — Cada uno ve perfectos a los suyos, son encantadores.',
        ar: '— كيف كان العرس؟ — القرد في عين أمه غزال، عندهم زوين بزاف.',
      },
    },
  },
  {
    id: 'pv_jbel',
    category: 'proverb',
    expression: {
      arabizi: 'Jbel w jbel ma ytla9aw, l’insan w l’insan ytla9aw.',
      arabic: 'جْبَلْ وَ جْبَلْ مَا يْتْلَاقَاوْ، الْإِنْسَانْ وَ الْإِنْسَانْ يْتْلَاقَاوْ.',
      translation: {
        fr: 'Deux montagnes ne se rencontrent pas, deux êtres humains si.',
        en: 'Two mountains never meet, two people do.',
        es: 'Dos montañas no se encuentran, dos personas sí.',
        ar: 'جبل وجبل ما يتلاقاو، والإنسان والإنسان يتلاقاو.',
      },
    },
    literal: {
      fr: 'Montagne et montagne ne se rencontrent pas ; homme et homme se rencontrent.',
      en: 'Mountain and mountain do not meet; man and man do meet.',
      es: 'Montaña y montaña no se encuentran; hombre y hombre se encuentran.',
      ar: 'جبل وجبل لا يتلاقيان، والإنسان والإنسان يتلاقيان.',
    },
    meaning: {
      fr: 'Les routes se croisent toujours : reste correct avec chacun, tu recroiseras ton monde un jour.',
      en: 'Paths always cross again: treat everyone well, you will meet them again someday.',
      es: 'Los caminos siempre se cruzan: trátalos bien, algún día los volverás a ver.',
      ar: 'الدروب تتقاطع دائماً: أحسن التعامل مع الجميع، فستلقاهم يوماً.',
    },
    streetExample: {
      arabizi: '— Sme7 liya a khouya… — Makayn mochkil, jbel w jbel ma ytla9aw.',
      arabic: '— سْمَحْ لِيَا أَ خُويَا… — مَا كَايِنْ مُشْكِيلْ، جْبَلْ وَ جْبَلْ مَا يْتْلَاقَاوْ.',
      translation: {
        fr: '— Pardon mon frère… — Aucun problème, on se recroisera de toute façon.',
        en: '— Sorry brother… — No problem, we will meet again anyway.',
        es: '— Perdón, hermano… — Ningún problema, de todos modos nos volveremos a ver.',
        ar: '— سامحني أخويا… — ما كاين مشكل، جبل وجبل ما يتلاقاو.',
      },
    },
  },
  {
    id: 'pv_l3asal',
    category: 'proverb',
    expression: {
      arabizi: 'Lli bgha l3asal yseber 3la 9ris n7al.',
      arabic: 'اللِّي بْغَى الْعَسَلْ يْصْبَرْ عَلَى قْرِيسْ النَّحْلْ.',
      translation: {
        fr: 'Qui veut le miel doit endurer les piqûres des abeilles.',
        en: 'Whoever wants honey must endure bee stings.',
        es: 'Quien quiere miel debe aguantar las picaduras de las abejas.',
        ar: 'اللي بغى العسل يصبر على قريس النحل.',
      },
    },
    literal: {
      fr: 'Celui qui veut le miel patiente sur les piqûres des abeilles.',
      en: 'The one who wants honey is patient with bee stings.',
      es: 'El que quiere miel tiene paciencia con las picaduras de las abejas.',
      ar: 'من يريد العسل يصبر على لسعات النحل.',
    },
    meaning: {
      fr: 'Aucune chose précieuse ne s’obtient sans patience ni effort. Se dit pour encourager avant un travail long.',
      en: 'Nothing valuable comes without patience and effort. Said to encourage before long work.',
      es: 'Nada valioso se logra sin paciencia ni esfuerzo. Se dice para animar antes de un trabajo largo.',
      ar: 'لا شيء ثمين يُنال بلا صبر وجهد. تُقال للتشجيع قبل عمل طويل.',
    },
    streetExample: {
      arabizi: '— Bghit nwelli nheder darija… — Lli bgha l3asal yseber 3la 9ris n7al, 20 minutes koll nhar.',
      arabic: '— بْغِيتْ نْوَلِّي نْهْدَرْ الدَّارِيجَة… — اللِّي بْغَى الْعَسَلْ يْصْبَرْ عَلَى قْرِيسْ النَّحْلْ، ٢٠ دَقِيقَة كُلْ نْهَارْ.',
      translation: {
        fr: '— Je veux parler darija… — Qui veut le miel endure les piqûres : 20 minutes chaque jour.',
        en: '— I want to speak Darija… — Whoever wants honey endures the stings: 20 minutes a day.',
        es: '— Quiero hablar dariya… — Quien quiere miel aguanta las picaduras: 20 minutos cada día.',
        ar: '— بغيت نهدر الدارجة… — اللي بغى العسل يصبر على قريس النحل، ٢٠ دقيقة كل نهار.',
      },
    },
  },
  {
    id: 'pv_7out',
    category: 'proverb',
    expression: {
      arabizi: 'L7out lkbir kayakel l7out sghir.',
      arabic: 'الْحُوتْ الْكْبِيرْ كَايَاكِلْ الْحُوتْ الصْغِيرْ.',
      translation: {
        fr: 'Le gros poisson mange le petit.',
        en: 'The big fish eats the small one.',
        es: 'El pez grande se come al pequeño.',
        ar: 'الحوت الكبير كياكل الحوت الصغير.',
      },
    },
    literal: {
      fr: 'Le poisson grand mange le poisson petit.',
      en: 'The big fish eats the small fish.',
      es: 'El pez grande come al pez pequeño.',
      ar: 'السمكة الكبيرة تأكل السمكة الصغيرة.',
    },
    meaning: {
      fr: 'Les rapports de force écrasent les plus faibles. Se dit des affaires, de la politique ou d’un marché impitoyable.',
      en: 'Power relations crush the weakest. Said of business, politics or a ruthless market.',
      es: 'Las relaciones de poder aplastan a los más débiles. Se dice de los negocios, la política o un mercado despiadado.',
      ar: 'موازين القوة تسحق الأضعف. تُقال في التجارة والسياسة أو سوق لا يرحم.',
    },
    streetExample: {
      arabizi: '— Chri l-bourse… — L7out lkbir kayakel l7out sghir, 7ta l-ghachi.',
      arabic: '— شْرِي فْ الْبُورْصَة… — الْحُوتْ الْكْبِيرْ كَايَاكِلْ الْحُوتْ الصْغِيرْ، حَتَّى الْغَاشِي.',
      translation: {
        fr: '— Achète en Bourse… — Le gros poisson mange le petit, même les naïfs.',
        en: '— Buy on the stock market… — The big fish eats the small one, even the naive.',
        es: '— Compra en bolsa… — El pez grande se come al pequeño, incluso a los ingenuos.',
        ar: '— شري في البورصة… — الحوت الكبير كياكل الحوت الصغير، حتى الغاشي.',
      },
    },
  },
  {
    id: 'pv_kelb',
    category: 'proverb',
    expression: {
      arabizi: 'Lkalb lli kayneb7 ma kay3edch.',
      arabic: 'الْكَلْبْ اللِّي كَايْنْبَحْ مَا كَايْعَضْشْ.',
      translation: {
        fr: 'Le chien qui aboie ne mord pas.',
        en: 'The dog that barks does not bite.',
        es: 'El perro que ladra no muerde.',
        ar: 'الكلب اللي كينبح ما كيعضش.',
      },
    },
    literal: {
      fr: 'Le chien qui aboie ne mord pas.',
      en: 'The barking dog does not bite.',
      es: 'El perro que ladra no muerde.',
      ar: 'الكلب الذي ينبح لا يعض.',
    },
    meaning: {
      fr: 'Les grandes menaces en l’air cachent souvent l’impuissance. Se dit pour désamorcer une colère bruyante.',
      en: 'Loud empty threats often hide powerlessness. Said to defuse loud anger.',
      es: 'Las grandes amenazas vacías suelen esconder impotencia. Se dice para desactivar una ira ruidosa.',
      ar: 'التهديدات الفارغة تخفي غالباً العجز. تُقال لتهدئة غضب صاخب.',
    },
    streetExample: {
      arabizi: '— Gol liya ghir… — Lkalb lli kayneb7 ma kay3edch, khellih yheder.',
      arabic: '— گُولْ لِيَا غِيرْ… — الْكَلْبْ اللِّي كَايْنْبَحْ مَا كَايْعَضْشْ، خَلِّيهْ يْهْدَرْ.',
      translation: {
        fr: '— Dis-moi seulement… — Le chien qui aboie ne mord pas, laisse-le parler.',
        en: '— Just tell me… — The dog that barks does not bite, let him talk.',
        es: '— Dime solo… — El perro que ladra no muerde, déjalo hablar.',
        ar: '— قول ليا غير… — الكلب اللي كينبح ما كيعضش، خليه يهدر.',
      },
    },
  },
  {
    id: 'pv_felous',
    category: 'proverb',
    expression: {
      arabizi: 'Lfelous kayjibou lfelous.',
      arabic: 'الْفْلُوسْ كَايْجِيبُو الْفْلُوسْ.',
      translation: {
        fr: 'L’argent fait venir l’argent.',
        en: 'Money brings money.',
        es: 'El dinero llama al dinero.',
        ar: 'الفلوس كتجيب الفلوس.',
      },
    },
    literal: {
      fr: 'Les sous font venir les sous.',
      en: 'The cash brings the cash.',
      es: 'El dinero trae dinero.',
      ar: 'النقود تجلب النقود.',
    },
    meaning: {
      fr: 'Il faut déjà un capital pour en profiter : les moyens appellent les moyens. Se dit d’un petit commerce qui plafonne.',
      en: 'You need capital first to benefit: means attract means. Said of a small business hitting a ceiling.',
      es: 'Hace falta capital para aprovechar: los medios atraen medios. Se dice de un negocio pequeño que se estanca.',
      ar: 'لا بد من رأس مال للاستفادة: الوسائل تجلب الوسائل. تُقال عن تجارة صغيرة وصلت سقفها.',
    },
    streetExample: {
      arabizi: '— Bghit nebda t-tijara b 100 derhem… — Lfelous kayjibou lfelous, bda b chi chwiya kbira.',
      arabic: '— بْغِيتْ نْبْدَا التِّجَارَة بْ ١٠٠ دَرْهَمْ… — الْفْلُوسْ كَايْجِيبُو الْفْلُوسْ، بْدَا بْ شِي شْوِيَّة كْبِيرَة.',
      translation: {
        fr: '— Je veux lancer un commerce avec 100 dirhams… — L’argent appelle l’argent, commence avec un peu plus.',
        en: '— I want to start a business with 100 dirhams… — Money brings money, start with a bit more.',
        es: '— Quiero montar un negocio con 100 dírhams… — El dinero llama al dinero, empieza con algo más.',
        ar: '— بغيت نبدا التجارة بـ١٠٠ درهم… — الفلوس كتجيب الفلوس، بدا بشي شوية كبيرة.',
      },
    },
  },
  {
    id: 'pv_jar',
    category: 'proverb',
    expression: {
      arabizi: 'Jar 9rib wla khou b3id.',
      arabic: 'جَارْ قْرِيبْ وَلَا خُو بْعِيدْ.',
      translation: {
        fr: 'Un voisin proche vaut mieux qu’un frère lointain.',
        en: 'A close neighbour is better than a distant brother.',
        es: 'Mejor un vecino cercano que un hermano lejano.',
        ar: 'جار قريب ولا خو بعيد.',
      },
    },
    literal: {
      fr: 'Voisin proche plutôt que frère lointain.',
      en: 'A near neighbour rather than a far brother.',
      es: 'Vecino cercano antes que hermano lejano.',
      ar: 'جار قريب بدلاً من أخ بعيد.',
    },
    meaning: {
      fr: 'Le voisinage du quotidien compte plus qu’une parenté éloignée. Se dit pour remercier un voisin serviable.',
      en: 'Daily neighbourliness matters more than distant kinship. Said to thank a helpful neighbour.',
      es: 'La vecindad diaria cuenta más que un parentesco lejano. Se dice para agradecer a un vecino servicial.',
      ar: 'الجيرة اليومية أهم من قرابة بعيدة. تُقال لشكر جار خدوم.',
    },
    streetExample: {
      arabizi: '— 3ndi khouya f Canada… — Jar 9rib wla khou b3id, hna l-jiran homa l-3ayla.',
      arabic: '— عَنْدِي خُويَا فْ كَنَدَا… — جَارْ قْرِيبْ وَلَا خُو بْعِيدْ، هْنَا الْجِيرَانْ هُمَا الْعَايْلَة.',
      translation: {
        fr: '— J’ai mon frère au Canada… — Un voisin proche vaut mieux qu’un frère lointain, ici les voisins sont la famille.',
        en: '— My brother lives in Canada… — A close neighbour beats a distant brother, here neighbours are family.',
        es: '— Mi hermano vive en Canadá… — Mejor un vecino cercano que un hermano lejano, aquí los vecinos son familia.',
        ar: '— عندي خويا في كندا… — جار قريب ولا خو بعيد، هنا الجيران هما العايلة.',
      },
    },
  },
  {
    id: 'ex_rassi',
    category: 'proverb',
    expression: {
      arabizi: '3la rassi w 3la 3ini.',
      arabic: 'عَلَى رَاسِي وَ عَلَى عِينِي.',
      translation: {
        fr: 'Sur ma tête et sur mes yeux.',
        en: 'On my head and on my eyes.',
        es: 'Sobre mi cabeza y sobre mis ojos.',
        ar: 'على راسي وعلى عيني.',
      },
    },
    literal: {
      fr: 'Sur ma tête et sur mon œil.',
      en: 'On my head and on my eye.',
      es: 'Sobre mi cabeza y sobre mi ojo.',
      ar: 'على رأسي وعلى عيني.',
    },
    meaning: {
      fr: 'Avec le plus grand plaisir, à votre service. Marque un accueil empressé et un engagement total.',
      en: 'With the greatest pleasure, at your service. Signals eager welcome and full commitment.',
      es: 'Con el mayor gusto, a tu servicio. Marca una acogida solícita y un compromiso total.',
      ar: 'بكل سرور، في خدمتك. تعبّر عن ترحيب حار والتزام تام.',
    },
    streetExample: {
      arabizi: '— Nqder n3awnek ? — 3la rassi w 3la 3ini, yallah.',
      arabic: '— نْقْدَرْ نْعَاوْنَكْ ؟ — عَلَى رَاسِي وَ عَلَى عِينِي، يَلَّاهْ.',
      translation: {
        fr: '— Je peux t’aider ? — Avec le plus grand plaisir, allons-y.',
        en: '— Can I help you? — With the greatest pleasure, let’s go.',
        es: '— ¿Puedo ayudarte? — Con mucho gusto, vamos.',
        ar: '— نقدر نعاونك؟ — على راسي وعلى عيني، يلاّه.',
      },
    },
  },
  {
    id: 'ex_yedd',
    category: 'proverb',
    expression: {
      arabizi: 'Yeddi f yeddek.',
      arabic: 'يَدِّي فْ يَدِّكْ.',
      translation: {
        fr: 'Ma main dans ta main.',
        en: 'My hand in your hand.',
        es: 'Mi mano en tu mano.',
        ar: 'يدي في يدك.',
      },
    },
    literal: {
      fr: 'Ma main dans ta main.',
      en: 'My hand in your hand.',
      es: 'Mi mano en tu mano.',
      ar: 'يدي في يدك.',
    },
    meaning: {
      fr: 'On avance ensemble, soudés et solidaires. Se dit pour sceller une collaboration ou rassurer quelqu’un.',
      en: 'We move forward together, united. Said to seal a collaboration or reassure someone.',
      es: 'Avanzamos juntos, unidos. Se dice para sellar una colaboración o tranquilizar a alguien.',
      ar: 'نمشي مع بعضنا، متضامنين. تُقال لتوثيق تعاون أو طمأنة أحد.',
    },
    streetExample: {
      arabizi: '— Kifach ndiro ? — Yeddi f yeddek, kolchi ghadi ykon mzyan.',
      arabic: '— كِيفَاشْ نْدِيرُو ؟ — يَدِّي فْ يَدِّكْ، كُلْشِي غَادِي يْكُونْ مْزْيَانْ.',
      translation: {
        fr: '— Comment on fait ? — Ma main dans ta main, tout ira bien.',
        en: '— How do we do it? — My hand in your hand, everything will be fine.',
        es: '— ¿Cómo lo hacemos? — Mi mano en tu mano, todo irá bien.',
        ar: '— كيفاش نديرو؟ — يدي في يدك، كلشي غادي يكون مزيان.',
      },
    },
  },
  {
    id: 'ex_b7al',
    category: 'proverb',
    expression: {
      arabizi: 'B7al b7al.',
      arabic: 'بْحَالْ بْحَالْ.',
      translation: {
        fr: 'Comme ci, comme ça.',
        en: 'So-so.',
        es: 'Así así.',
        ar: 'بحال بحال.',
      },
    },
    literal: {
      fr: 'Pareil, pareil.',
      en: 'Same, same.',
      es: 'Igual, igual.',
      ar: 'مثل، مثل.',
    },
    meaning: {
      fr: 'Réponse à « labas ? » quand ça va moyennement : ni bien ni mal. Sert aussi à dire « c’est du pareil au même ».',
      en: 'Answer to “labas?” when things are middling: neither good nor bad. Also means “it is all the same”.',
      es: 'Respuesta a «labas?» cuando todo va regular: ni bien ni mal. También significa «es lo mismo».',
      ar: 'جواب على «لاباس؟» حين الحال متوسطة: لا خير ولا شر. وتُستعمل أيضاً بمعنى «الأمر سيان».',
    },
    streetExample: {
      arabizi: '— Kidayr ? — B7al b7al, chwiya.',
      arabic: '— كِيدَايِرْ ؟ — بْحَالْ بْحَالْ، شْوِيَّة.',
      translation: {
        fr: '— Comment tu vas ? — Comme ci, comme ça, moyen.',
        en: '— How are you? — So-so, average.',
        es: '— ¿Cómo estás? — Así así, regular.',
        ar: '— كيداير؟ — بحال بحال، شوية.',
      },
    },
  },
];

export const CULTURAL_GEMS: CulturalGem[] = [...PINGPONG_GEMS, ...PROVERB_GEMS];

export const CULTURAL_GEMS_BY_CATEGORY: Record<GemCategory, CulturalGem[]> = {
  pingpong: PINGPONG_GEMS,
  proverb: PROVERB_GEMS,
};

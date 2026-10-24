import type { MultiLangText } from '../../types/curriculum';

/** Interlocuteur d'une réplique du scénario. */
export type SituationSpeaker = 'interlocutor' | 'user';

/** Un mot de la réplique, pour l'inspection tactile (Tap-to-Inspect). */
export interface SituationToken {
  /** Mot Arabizi tel qu'écrit dans la réplique (« 7anout », « labas »). */
  arabizi: string;
  /** Mot arabe vocalisé correspondant (« حَانُوتْ »). */
  arabic: string;
  /** Traduction exacte du mot (« boutique », « ça va ? »). */
  translation: MultiLangText;
  /** Chiffre Arabizi présent dans le mot (2, 3, 5, 7, 9) — ouvre le guide phonétique. */
  arabiziDigit?: '2' | '3' | '5' | '7' | '9';
}

/** Une option de réponse proposée à l'apprenant (Choose Your Reply). */
export interface SituationReplyOption {
  /** Arabizi de la réponse proposée. */
  arabizi: string;
  /** Arabe vocalisé de la réponse proposée. */
  arabic: string;
  /** Traduction de la réponse. */
  translation: MultiLangText;
  /** Feedback immédiat : explication de ce qui est maladroit ou pourquoi c'est adapté. */
  feedback: MultiLangText;
  /** Indique si l'option est la réponse contextuellement la plus naturelle. */
  correct: boolean;
}

/** Une réplique du simulateur. */
export interface SituationTurn {
  id: string;
  speaker: SituationSpeaker;
  /** Libellé du rôle, localisé (ex : « Chauffeur de taxi »). */
  role: MultiLangText;
  /** Arabe vocalisé complet de la réplique. */
  arabicVocalized: string;
  /** Translittération Arabizi complète. */
  arabizi: string;
  /** Traduction française de la réplique (ou locale via MultiLangText). */
  frenchTranslation: string;
  /** Transcription en français / anglais / espagnol / arabe selon la langue d'interface. */
  translation: MultiLangText;
  /** Décomposition mot à mot pour le Tap-to-Inspect. */
  tokens: SituationToken[];
  /** Pour le tour de l'apprenant : réponses suggérées avec feedback. */
  options?: SituationReplyOption[];
}

/** Un scénario complet du simulateur « Situations du Bled ». */
export interface SituationScenario {
  id: string;
  /** Emoji illustrant le scénario dans la carte de sélection. */
  emoji: string;
  title: MultiLangText;
  /** Sous-titre / contexte (lieu, objectif pédagogique). */
  context: MultiLangText;
  badge: MultiLangText;
  category: 'taxi' | 'souk' | 'politesse';
  difficulty: 'easy' | 'medium' | 'hard';
  /** Emoji affiché dans l'avatar de l'interlocuteur. */
  interlocutorEmoji: string;
  interlocutorName: MultiLangText;
  turns: SituationTurn[];
}

export const SITUATION_SCENARIOS: SituationScenario[] = [
  {
    id: 'taxi_fes',
    emoji: '🚕',
    category: 'taxi',
    difficulty: 'medium',
    badge: { fr: 'Transport · Fès', en: 'Transport · Fez', es: 'Transporte · Fez', ar: 'النقل · فاس' },
    title: {
      fr: 'Prendre un petit taxi au Bled',
      en: 'Taking a petit taxi in the Bled',
      es: 'Coger un petit taxi en el Bled',
      ar: 'أخذ طاكسي صغير في البلد',
    },
    context: {
      fr: 'Tu hèles un petit taxi bleu. Le chauffeur te demande où tu vas : indique la direction, demande le compteur et paye la course.',
      en: 'You hail a blue petit taxi. The driver asks where you are going: give the direction, ask for the meter and pay the fare.',
      es: 'Paras a un petit taxi azul. El conductor te pregunta adónde vas: indica la dirección, pide el taxímetro y paga el trayecto.',
      ar: 'توقّف طاكسي صغير أزرق. يسألك السائق إلى أين تذهب: حدّد الوجهة، واطلب العداد، وادفع ثمن الرحلة.',
    },
    interlocutorEmoji: '👨‍✈️',
    interlocutorName: { fr: 'Chauffeur de taxi', en: 'Taxi driver', es: 'Conductor de taxi', ar: 'سائق الطاكسي' },
    turns: [
      {
        id: 'taxi_t1',
        speaker: 'interlocutor',
        role: { fr: 'Chauffeur', en: 'Driver', es: 'Conductor', ar: 'السائق' },
        arabicVocalized: 'اَلسَّلَامْ عَلِيكُمْ ! فِينْ غَادِي ؟',
        arabizi: 'Salam 3likom ! Fin ghadi ?',
        frenchTranslation: 'Bonjour ! Où vas-tu ?',
        translation: {
          fr: 'Bonjour ! Où vas-tu ?',
          en: 'Hello! Where are you going?',
          es: '¡Hola! ¿Adónde vas?',
          ar: 'السلام عليكم! أين أنت ذاهب؟',
        },
        tokens: [
          { arabizi: 'Salam', arabic: 'سَلَامْ', translation: { fr: 'Paix / bonjour', en: 'Peace / hello', es: 'Paz / hola', ar: 'سلام' } },
          { arabizi: '3likom', arabic: 'عَلِيكُمْ', arabiziDigit: '3', translation: { fr: 'sur vous', en: 'upon you', es: 'sobre vosotros', ar: 'عليكم' } },
          { arabizi: 'Fin', arabic: 'فِينْ', translation: { fr: 'où', en: 'where', es: 'dónde', ar: 'أين' } },
          { arabizi: 'ghadi', arabic: 'غَادِي', translation: { fr: 'tu vas', en: 'you are going', es: 'vas', ar: 'ذاهب' } },
        ],
      },
      {
        id: 'taxi_t2',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'بَابْ بُوجْلُودْ عَفَاكْ',
        arabizi: 'Bab Boujloud 3afak.',
        frenchTranslation: "À Bab Boujloud, s'il te plaît.",
        translation: {
          fr: "À Bab Boujloud, s'il te plaît.",
          en: 'To Bab Boujloud, please.',
          es: 'A Bab Boujloud, por favor.',
          ar: 'إلى باب بوجلود، من فضلك.',
        },
        tokens: [
          { arabizi: 'Bab', arabic: 'بَابْ', translation: { fr: 'porte', en: 'gate', es: 'puerta', ar: 'باب' } },
          { arabizi: 'Boujloud', arabic: 'بُوجْلُودْ', translation: { fr: 'Boujloud (quartier de Fès)', en: 'Boujloud (Fez district)', es: 'Boujloud (barrio de Fez)', ar: 'بوجلود' } },
          { arabizi: '3afak', arabic: 'عَفَاكْ', arabiziDigit: '3', translation: { fr: "s'il te plaît", en: 'please', es: 'por favor', ar: 'من فضلك' } },
        ],
        options: [
          {
            arabizi: 'Bab Boujloud 3afak.',
            arabic: 'بَابْ بُوجْلُودْ عَفَاكْ',
            translation: { fr: "À Bab Boujloud, s'il te plaît.", en: 'To Bab Boujloud, please.', es: 'A Bab Boujloud, por favor.', ar: 'إلى باب بوجلود من فضلك' },
            feedback: {
              fr: 'Parfait ! Donner directement la destination est exactement ce qu’attend un chauffeur.',
              en: 'Perfect! Giving the destination directly is exactly what a driver expects.',
              es: '¡Perfecto! Decir el destino directamente es justo lo que espera un conductor.',
              ar: 'ممتاز! تحديد الوجهة مباشرة هو بالضبط ما يتوقعه السائق.',
            },
            correct: true,
          },
          {
            arabizi: '3ndi flous bzzaf.',
            arabic: 'عِنْدِي فْلُوسْ بْزَّافْ',
            translation: { fr: "J'ai beaucoup d'argent.", en: 'I have a lot of money.', es: 'Tengo mucho dinero.', ar: 'عندي مال كثير' },
            feedback: {
              fr: 'Assez maladroit : dire que tu as beaucoup d’argent peut inciter le chauffeur à gonfler le prix !',
              en: 'Awkward: saying you have a lot of money may invite the driver to inflate the fare!',
              es: 'Torpe: decir que tienes mucho dinero puede incitar al conductor a inflar la tarifa.',
              ar: 'غير لبِق: قولك إن معك مالا كثيرا قد يدفع السائق لرفع الأجرة!',
            },
            correct: false,
          },
          {
            arabizi: 'Lalla mchi, rani m3ayet.',
            arabic: 'لَلَّا مْشِي، رَانِي مْعَيَّتْ',
            translation: { fr: "Non vas-y, je suis fatigué.", en: 'No go ahead, I am tired.', es: 'No, vete, estoy cansado.', ar: 'لا امشِ، أنا متعب' },
            feedback: {
              fr: 'Maladroit : le chauffeur ne t’a pas demandé si tu étais fatigué. Réponds à sa question !',
              en: 'Awkward: the driver did not ask if you were tired. Answer his question!',
              es: 'Torpe: el conductor no te preguntó si estabas cansado. ¡Responde a su pregunta!',
              ar: 'غير لبِق: السائق لم يسألك إن كنت متعبا. أجب على سؤاله!',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'taxi_t3',
        speaker: 'interlocutor',
        role: { fr: 'Chauffeur', en: 'Driver', es: 'Conductor', ar: 'السائق' },
        arabicVocalized: 'مْرَحْبَا، طْلَعْ !',
        arabizi: 'Mre7ba, tle3 !',
        frenchTranslation: 'Bienvenue, monte !',
        translation: {
          fr: 'Bienvenue, monte !',
          en: 'Welcome, get in!',
          es: '¡Bienvenido, sube!',
          ar: 'مرحبا، اركب!',
        },
        tokens: [
          { arabizi: 'Mre7ba', arabic: 'مْرَحْبَا', arabiziDigit: '7', translation: { fr: 'bienvenue', en: 'welcome', es: 'bienvenido', ar: 'مرحبا' } },
          { arabizi: 'tle3', arabic: 'طْلَعْ', arabiziDigit: '3', translation: { fr: 'monte', en: 'get in', es: 'sube', ar: 'اصعد' } },
        ],
      },
      {
        id: 'taxi_t4',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'خَدَّمْ لَكُونْتُورْ عَفَاكْ',
        arabizi: 'Kheddem l-kountour 3afak.',
        frenchTranslation: "Mets le compteur, s'il te plaît.",
        translation: {
          fr: "Mets le compteur, s'il te plaît.",
          en: 'Turn on the meter, please.',
          es: 'Pon el taxímetro, por favor.',
          ar: 'شغّل العداد من فضلك.',
        },
        tokens: [
          { arabizi: 'Kheddem', arabic: 'خَدَّمْ', arabiziDigit: '5', translation: { fr: 'mets en marche', en: 'turn on', es: 'pon en marcha', ar: 'شغّل' } },
          { arabizi: 'l-kountour', arabic: 'لَكُونْتُورْ', translation: { fr: 'le compteur', en: 'the meter', es: 'el taxímetro', ar: 'العداد' } },
          { arabizi: '3afak', arabic: 'عَفَاكْ', arabiziDigit: '3', translation: { fr: "s'il te plaît", en: 'please', es: 'por favor', ar: 'من فضلك' } },
        ],
        options: [
          {
            arabizi: 'Kheddem l-kountour 3afak.',
            arabic: 'خَدَّمْ لَكُونْتُورْ عَفَاكْ',
            translation: { fr: "Mets le compteur, s'il te plaît.", en: 'Turn on the meter, please.', es: 'Pon el taxímetro, por favor.', ar: 'شغّل العداد من فضلك' },
            feedback: {
              fr: 'Excellent réflexe ! Le compteur protège d’un prix gonflé à la fin de la course.',
              en: 'Great reflex! The meter protects against an inflated fare at the end of the ride.',
              es: '¡Buen reflejo! El taxímetro te protege de una tarifa inflada al final del trayecto.',
              ar: 'تصرف ممتاز! العداد يحميك من أجرة مبالغ فيها في نهاية الرحلة.',
            },
            correct: true,
          },
          {
            arabizi: 'Safi, mchiti bzzaf.',
            arabic: 'صَافِي، مْشِيتِي بْزَّافْ',
            translation: { fr: "Tant pis, tu as fait beaucoup.", en: 'Never mind, you went a lot.', es: 'Da igual, has viajado mucho.', ar: 'حسنا، سافرت كثيرا' },
            feedback: {
              fr: 'Confus : tu n’as pas encore voyagé. Demande le compteur avant de démarrer !',
              en: 'Confusing: you have not travelled yet. Ask for the meter before starting!',
              es: 'Confuso: todavía no has viajado. ¡Pide el taxímetro antes de empezar!',
              ar: 'مربك: لم تسافر بعد. اطلب العداد قبل الانطلاق!',
            },
            correct: false,
          },
          {
            arabizi: 'Xllini nchouf, bghit nmshi mchya.',
            arabic: 'خَلِّينِي نْشُوفْ، بْغِيتْ نْمْشِي مْشْيَا',
            translation: { fr: "Laisse-moi voir, je veux aller à pied.", en: 'Let me see, I want to go on foot.', es: 'Déjame ver, quiero ir a pie.', ar: 'دعني أرى، أريد المشي' },
            feedback: {
              fr: 'Maladroit : tu viens de monter ! Si tu voulais marcher, il fallait le dire au chauffeur plus tôt.',
              en: 'Awkward: you just got in! If you wanted to walk, you should have said so earlier.',
              es: 'Torpe: ¡acabas de subir! Si querías ir andando, debías decirlo antes.',
              ar: 'غير لبِق: لقد ركبت للتو! لو أردت المشي، كان عليك قوله سابقا.',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'taxi_t5',
        speaker: 'interlocutor',
        role: { fr: 'Chauffeur', en: 'Driver', es: 'Conductor', ar: 'السائق' },
        arabicVocalized: 'هَا حْنَا وْصَلْنَا، طْنْعَاشْ دَرْهَمْ',
        arabizi: 'Ha 7na wselna, tne3ch derhem.',
        frenchTranslation: 'Nous voilà arrivés, douze dirhams.',
        translation: {
          fr: 'Nous voilà arrivés, douze dirhams.',
          en: 'Here we are, twelve dirhams.',
          es: 'Ya hemos llegado, doce dírhams.',
          ar: 'وصلنا، اثنا عشر درهما.',
        },
        tokens: [
          { arabizi: '7na', arabic: 'حْنَا', arabiziDigit: '7', translation: { fr: 'nous', en: 'we', es: 'nosotros', ar: 'نحن' } },
          { arabizi: 'wselna', arabic: 'وْصَلْنَا', translation: { fr: 'nous sommes arrivés', en: 'we have arrived', es: 'hemos llegado', ar: 'وصلنا' } },
          { arabizi: 'tne3ch', arabic: 'طْنْعَاشْ', arabiziDigit: '3', translation: { fr: 'douze', en: 'twelve', es: 'doce', ar: 'اثنا عشر' } },
          { arabizi: 'derhem', arabic: 'دَرْهَمْ', translation: { fr: 'dirhams', en: 'dirhams', es: 'dírhams', ar: 'درهم' } },
        ],
      },
      {
        id: 'taxi_t6',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'هَاكْ، شُكْرَانْ بْزَّافْ، بْسْلَامَةْ !',
        arabizi: 'Hak, chokran bezzaf, bslama !',
        frenchTranslation: 'Tiens, merci beaucoup, au revoir !',
        translation: {
          fr: 'Tiens, merci beaucoup, au revoir !',
          en: 'Here, thanks a lot, goodbye!',
          es: 'Toma, muchas gracias, ¡adiós!',
          ar: 'هاك، شكرا جزيلا، إلى اللقاء!',
        },
        tokens: [
          { arabizi: 'Hak', arabic: 'هَاكْ', translation: { fr: 'tiens (voici)', en: 'here you go', es: 'toma', ar: 'هاك' } },
          { arabizi: 'chokran', arabic: 'شُكْرَانْ', translation: { fr: 'merci', en: 'thanks', es: 'gracias', ar: 'شكرا' } },
          { arabizi: 'bezzaf', arabic: 'بْزَّافْ', translation: { fr: 'beaucoup', en: 'a lot', es: 'mucho', ar: 'كثيرا' } },
          { arabizi: 'bslama', arabic: 'بْسْلَامَةْ', translation: { fr: 'au revoir / en paix', en: 'goodbye', es: 'adiós', ar: 'بسلامة' } },
        ],
        options: [
          {
            arabizi: 'Hak, chokran bezzaf, bslama !',
            arabic: 'هَاكْ، شُكْرَانْ بْزَّافْ، بْسْلَامَةْ !',
            translation: { fr: 'Tiens, merci beaucoup, au revoir !', en: 'Here, thanks a lot, goodbye!', es: 'Toma, muchas gracias, ¡adiós!', ar: 'هاك، شكرا جزيلا، إلى اللقاء' },
            feedback: {
              fr: 'Très poli et naturel : on paye, on remercie et on salue en descendant.',
              en: 'Very polite and natural: pay, thank and greet as you get out.',
              es: 'Muy educado y natural: pagas, agradeces y te despides al bajar.',
              ar: 'لبِق وطبيعي جدا: تدفع وتشكر وتسلم عند النزول.',
            },
            correct: true,
          },
          {
            arabizi: 'Ch7al ana mdenni lik ?',
            arabic: 'شْحَالْ أَنَا مْدَيِّنْ لِيكْ ؟',
            translation: { fr: "Combien je te dois ?", en: 'How much do I owe you?', es: '¿Cuánto te debo?', ar: 'كم أدين لك؟' },
            feedback: {
              fr: 'Correct mais redondant : le chauffeur vient de donner le prix. Payer et remercier suffit !',
              en: 'Correct but redundant: the driver just gave the price. Pay and thank is enough!',
              es: 'Correcto pero redundante: el conductor acaba de decir el precio. ¡Basta con pagar y agradecer!',
              ar: 'صحيح لكنه مكرر: السائق ذكر الثمن للتو. يكفي أن تدفع وتشكر!',
            },
            correct: false,
          },
          {
            arabizi: 'La la, ghali bzzaf !',
            arabic: 'لَا لَا، غَالِي بْزَّافْ !',
            translation: { fr: 'Non non, trop cher !', en: 'No no, too expensive!', es: 'No no, ¡muy caro!', ar: 'لا لا، غالٍ جدا!' },
            feedback: {
              fr: 'Maladroit ici : douze dirhams est le tarif normal pour cette courte course. On paie et on remercie.',
              en: 'Awkward here: twelve dirhams is the normal fare for this short ride. Pay and thank.',
              es: 'Torpe aquí: doce dírhams es la tarifa normal para este trayecto corto. Paga y agradece.',
              ar: 'غير لبِق هنا: اثنا عشر درهما هو الأجر العادي لهذه الرحلة القصيرة. ادفع واشكر.',
            },
            correct: false,
          },
        ],
      },
    ],
  },
  {
    id: 'moul_7anout',
    emoji: '🛒',
    category: 'souk',
    difficulty: 'easy',
    badge: { fr: 'Épicerie de quartier', en: 'Corner grocery', es: 'Tienda de barrio', ar: 'حانوت الحي' },
    title: {
      fr: "Chez Moul L'7anout",
      en: "At the corner shop (Moul L'7anout)",
      es: "En la tienda del barrio (Moul L'7anout)",
      ar: 'عند مول الحانوت',
    },
    context: {
      fr: "Tout se demande à l'oral chez l'épicier du quartier. Demande le prix, achète du pain et de la menthe, et paie.",
      en: 'Everything is asked out loud at the neighbourhood grocer. Ask for the price, buy bread and mint, and pay.',
      es: 'En la tienda del barrio todo se pide de palabra. Pide el precio, compra pan y menta, y paga.',
      ar: 'في حانوت الحي، كل شيء يُطلب شفهيا. اسأل عن الثمن، اشترِ الخبز والنعناع، وادفع.',
    },
    interlocutorEmoji: '🧔',
    interlocutorName: { fr: "Moul L'7anout", en: 'The shopkeeper', es: 'El tendero', ar: 'صاحب الحانوت' },
    turns: [
      {
        id: 'epicier_t1',
        speaker: 'interlocutor',
        role: { fr: "L'épicier", en: 'The shopkeeper', es: 'El tendero', ar: 'الحانوتي' },
        arabicVocalized: 'أَهْلًا، أَشْ بْغِيتِي ؟',
        arabizi: 'Ahla, ach bghiti ?',
        frenchTranslation: 'Bonjour, tu veux quoi ?',
        translation: {
          fr: 'Bonjour, tu veux quoi ?',
          en: 'Hello, what would you like?',
          es: 'Hola, ¿qué quieres?',
          ar: 'أهلا، ماذا تريد؟',
        },
        tokens: [
          { arabizi: 'Ahla', arabic: 'أَهْلًا', translation: { fr: 'bonjour / bienvenue', en: 'hello / welcome', es: 'hola / bienvenido', ar: 'أهلا' } },
          { arabizi: 'ach', arabic: 'أَشْ', translation: { fr: 'quoi', en: 'what', es: 'qué', ar: 'ماذا' } },
          { arabizi: 'bghiti', arabic: 'بْغِيتِي', translation: { fr: 'tu veux', en: 'you want', es: 'quieres', ar: 'تريد' } },
        ],
      },
      {
        id: 'epicier_t2',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'بْشْحَالْ هَادْ الخُبْزْ ؟',
        arabizi: 'Bch7al had l-khobz ?',
        frenchTranslation: "C'est combien, ce pain ?",
        translation: {
          fr: "C'est combien, ce pain ?",
          en: 'How much is this bread?',
          es: '¿Cuánto cuesta este pan?',
          ar: 'بكم هذا الخبز؟',
        },
        tokens: [
          { arabizi: 'Bch7al', arabic: 'بْشْحَالْ', arabiziDigit: '7', translation: { fr: 'combien (ça coûte)', en: 'how much', es: 'cuánto cuesta', ar: 'بكم' } },
          { arabizi: 'had', arabic: 'هَادْ', translation: { fr: 'ce / cette', en: 'this', es: 'este', ar: 'هذا' } },
          { arabizi: 'l-khobz', arabic: 'الخُبْزْ', arabiziDigit: '5', translation: { fr: 'le pain', en: 'the bread', es: 'el pan', ar: 'الخبز' } },
        ],
        options: [
          {
            arabizi: 'Bch7al had l-khobz ?',
            arabic: 'بْشْحَالْ هَادْ الخُبْزْ ؟',
            translation: { fr: "C'est combien, ce pain ?", en: 'How much is this bread?', es: '¿Cuánto cuesta este pan?', ar: 'بكم هذا الخبز؟' },
            feedback: {
              fr: 'La question clé du souk ! « Bch7al » est le réflexe numéro un pour tout prix.',
              en: 'The key question of the souk! "Bch7al" is the number one reflex for any price.',
              es: '¡La pregunta clave del zoco! "Bch7al" es el reflejo número uno para cualquier precio.',
              ar: 'السؤال المفتاحي في السوق! «بشحال» هو البصمة الأولى لأي ثمن.',
            },
            correct: true,
          },
          {
            arabizi: 'Wach had l-khobz tayeb ?',
            arabic: 'وَاشْ هَادْ الخُبْزْ طَايَبْ ؟',
            translation: { fr: 'Ce pain est-il cuit ?', en: 'Is this bread cooked?', es: '¿Está cocido este pan?', ar: 'هل هذا الخبز مطبوخ؟' },
            feedback: {
              fr: 'Drôle mais maladroit : personne ne demande si le pain est cuit ! Demande plutôt le prix.',
              en: 'Funny but awkward: nobody asks if bread is cooked! Ask for the price instead.',
              es: 'Gracioso pero torpe: ¡nadie pregunta si el pan está cocido! Pide el precio.',
              ar: 'مضحك لكنه غير لبِق: لا أحد يسأل إن كان الخبز مطبوخا! اسأل عن الثمن بدل ذلك.',
            },
            correct: false,
          },
          {
            arabizi: 'Fin kayn l-7anout ?',
            arabic: 'فِينْ كَايْنْ لَحَانُوتْ ؟',
            translation: { fr: "Où est l'épicerie ?", en: 'Where is the shop?', es: '¿Dónde está la tienda?', ar: 'أين الحانوت؟' },
            feedback: {
              fr: "Maladroit : tu es déjà dans l'épicerie ! Pose plutôt une question d'achat.",
              en: 'Awkward: you are already in the shop! Ask a buying question instead.',
              es: 'Torpe: ¡ya estás en la tienda! Mejor haz una pregunta de compra.',
              ar: 'غير لبِق: أنت داخل الحانوت بالفعل! اسأل سؤال شراء بدلا من ذلك.',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'epicier_t3',
        speaker: 'interlocutor',
        role: { fr: "L'épicier", en: 'The shopkeeper', es: 'El tendero', ar: 'الحانوتي' },
        arabicVocalized: 'هَادَاكْ بْ دَرْهَمَيْنْ، وْ النَّعْنَاعْ بْ عَشَرَةْ دَرَاهِمْ.',
        arabizi: 'Hadak b derhemayn, o n3na3 b 3chra derahem.',
        frenchTranslation: "Celui-ci, deux dirhams, et la menthe, dix dirhams.",
        translation: {
          fr: "Celui-ci, deux dirhams, et la menthe, dix dirhams.",
          en: "That one, two dirhams, and the mint, ten dirhams.",
          es: 'Ese, dos dírhams, y la menta, diez dírhams.',
          ar: 'ذاك بدرهمين، والنعناع بعشرة دراهم.',
        },
        tokens: [
          { arabizi: 'derhemayn', arabic: 'دَرْهَمَيْنْ', translation: { fr: 'deux dirhams', en: 'two dirhams', es: 'dos dírhams', ar: 'درهمين' } },
          { arabizi: 'n3na3', arabic: 'نَّعْنَاعْ', arabiziDigit: '3', translation: { fr: 'la menthe', en: 'the mint', es: 'la menta', ar: 'النعناع' } },
          { arabizi: '3chra', arabic: 'عَشَرَةْ', arabiziDigit: '3', translation: { fr: 'dix', en: 'ten', es: 'diez', ar: 'عشرة' } },
          { arabizi: 'derahem', arabic: 'دَرَاهِمْ', translation: { fr: 'dirhams', en: 'dirhams', es: 'dírhams', ar: 'دراهم' } },
        ],
      },
      {
        id: 'epicier_t4',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'عْطِينِي وَاحْدْ خُبْزَةْ وْ عُودْ نَّعْنَاعْ.',
        arabizi: '3tini wa7ed khobza o 3oud n3na3.',
        frenchTranslation: "Donne-moi un pain et un brin de menthe.",
        translation: {
          fr: "Donne-moi un pain et un brin de menthe.",
          en: 'Give me a bread and a sprig of mint.',
          es: 'Dame un pan y una ramita de menta.',
          ar: 'أعطني خبزة وعود نعناع.',
        },
        tokens: [
          { arabizi: '3tini', arabic: 'عْطِينِي', arabiziDigit: '3', translation: { fr: 'donne-moi', en: 'give me', es: 'dame', ar: 'أعطني' } },
          { arabizi: 'wa7ed', arabic: 'وَاحْدْ', arabiziDigit: '7', translation: { fr: 'un(e)', en: 'one', es: 'un(a)', ar: 'واحد' } },
          { arabizi: 'khobza', arabic: 'خُبْزَةْ', arabiziDigit: '5', translation: { fr: 'un pain (galette)', en: 'a bread loaf', es: 'un pan', ar: 'خبزة' } },
          { arabizi: '3oud', arabic: 'عُودْ', arabiziDigit: '3', translation: { fr: 'un brin / une tige', en: 'a sprig', es: 'una ramita', ar: 'عود' } },
          { arabizi: 'n3na3', arabic: 'نَّعْنَاعْ', arabiziDigit: '3', translation: { fr: 'menthe', en: 'mint', es: 'menta', ar: 'نعناع' } },
        ],
        options: [
          {
            arabizi: '3tini wa7ed khobza o 3oud n3na3.',
            arabic: 'عْطِينِي وَاحْدْ خُبْزَةْ وْ عُودْ نَّعْنَاعْ.',
            translation: { fr: "Donne-moi un pain et un brin de menthe.", en: 'Give me a bread and a sprig of mint.', es: 'Dame un pan y una ramita de menta.', ar: 'أعطني خبزة وعود نعناع' },
            feedback: {
              fr: 'Exactement ce qu’il faut demander à l’épicier : simple, clair et poli.',
              en: 'Exactly what to ask the grocer: simple, clear and polite.',
              es: 'Exactamente lo que hay que pedir al tendero: simple, claro y educado.',
              ar: 'بالضبط ما يجب طلبه من الحانوتي: بسيط وواضح ومهذب.',
            },
            correct: true,
          },
          {
            arabizi: 'Bghit nchri l-mdina kollha.',
            arabic: 'بْغِيتْ نْشْرِي لْمْدِينَةْ كُلَّهَا',
            translation: { fr: "Je veux acheter toute la ville.", en: 'I want to buy the whole city.', es: 'Quiero comprar toda la ciudad.', ar: 'أريد شراء المدينة كلها' },
            feedback: {
              fr: 'Plaisant mais irréaliste ! Reste sur des achats simples : pain et menthe.',
              en: 'Funny but unrealistic! Stick to simple purchases: bread and mint.',
              es: '¡Gracioso pero poco realista! Quédate con compras simples: pan y menta.',
              ar: 'مضحك لكنه غير واقعي! التزم بشراء بسيط: خبز ونعناع.',
            },
            correct: false,
          },
          {
            arabizi: 'Ch7al f l-modir ?',
            arabic: 'شْحَالْ فْ لْمُودِيرْ ؟',
            translation: { fr: "C'est combien au directeur ?", en: 'How much is the director?', es: '¿Cuánto cuesta el director?', ar: 'كم الثمن عند المدير؟' },
            feedback: {
              fr: 'Hors sujet : inutile de parler de directeur à l’épicier !',
              en: 'Off-topic: no need to talk about a director with the grocer!',
              es: 'Fuera de lugar: ¡no hace falta hablar del director con el tendero!',
              ar: 'خارج الموضوع: لا داعي للحديث عن مدير مع الحانوتي!',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'epicier_t5',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'شُكْرَانْ، هَاكْ ثْلَاثَةْ عْشَرْ دَرْهَمْ.',
        arabizi: 'Chokran, hak tleta3ch derhem.',
        frenchTranslation: 'Merci, tiens treize dirhams.',
        translation: {
          fr: 'Merci, tiens treize dirhams.',
          en: 'Thanks, here are thirteen dirhams.',
          es: 'Gracias, toma trece dírhams.',
          ar: 'شكرا، هاك ثلاثة عشر درهما.',
        },
        tokens: [
          { arabizi: 'Chokran', arabic: 'شُكْرَانْ', translation: { fr: 'merci', en: 'thanks', es: 'gracias', ar: 'شكرا' } },
          { arabizi: 'hak', arabic: 'هَاكْ', translation: { fr: 'tiens (voici)', en: 'here you go', es: 'toma', ar: 'هاك' } },
          { arabizi: 'tleta3ch', arabic: 'ثْلَاثَةْ عْشَرْ', arabiziDigit: '3', translation: { fr: 'treize', en: 'thirteen', es: 'trece', ar: 'ثلاثة عشر' } },
          { arabizi: 'derhem', arabic: 'دَرْهَمْ', translation: { fr: 'dirhams', en: 'dirhams', es: 'dírhams', ar: 'درهم' } },
        ],
        options: [
          {
            arabizi: 'Chokran, hak tleta3ch derhem.',
            arabic: 'شُكْرَانْ، هَاكْ ثْلَاثَةْ عْشَرْ دَرْهَمْ.',
            translation: { fr: 'Merci, tiens treize dirhams.', en: 'Thanks, here are thirteen dirhams.', es: 'Gracias, toma trece dírhams.', ar: 'شكرا، هاك ثلاثة عشر درهما' },
            feedback: {
              fr: 'Parfait : tu paies le prix exact (2 + 10 + 1 = 13) et tu remercies. Le commerçant est content.',
              en: 'Perfect: you pay the exact price (2 + 10 + 1 = 13) and thank. The merchant is happy.',
              es: 'Perfecto: pagas el precio exacto (2 + 10 + 1 = 13) y agradeces. El comerciante está contento.',
              ar: 'ممتاز: تدفع الثمن المحدد (2 + 10 + 1 = 13) وتشكر. الحانوتي سعيد.',
            },
            correct: true,
          },
          {
            arabizi: 'Khassni tfakki, ma 3ndi flous.',
            arabic: 'خَاصِّنِي تْفَاكِّي، مَا عِنْدِي فْلُوسْ',
            translation: { fr: "J'ai besoin de réfléchir, je n'ai pas d'argent.", en: 'I need to think, I have no money.', es: 'Necesito pensarlo, no tengo dinero.', ar: 'يجب أن أتفكر، ليس معي نقود' },
            feedback: {
              fr: 'Maladroit : tu viens de faire tes achats ! Sors l’argent et paye.',
              en: 'Awkward: you just made your purchases! Take out the money and pay.',
              es: 'Torpe: ¡acabas de hacer tus compras! Saca el dinero y paga.',
              ar: 'غير لبِق: لقد اشتريت للتو! أخرج النقود وادفع.',
            },
            correct: false,
          },
          {
            arabizi: 'Nchouf f hal, nmchi l 7anout okhr.',
            arabic: 'نْشُوفْ فْ حَالِي، نْمْشِي لْ حَانُوتْ أُخَرْ',
            translation: { fr: "J'y réfléchis, je vais dans une autre épicerie.", en: "Let me see, I'll go to another shop.", es: 'Lo pensaré, iré a otra tienda.', ar: 'سأرى، سأذهب إلى حانوت آخر' },
            feedback: {
              fr: 'Sans raison : les prix sont corrects. On achète et on paye.',
              en: 'Unnecessary: the prices are fair. Buy and pay.',
              es: 'Innecesario: los precios son justos. Compra y paga.',
              ar: 'لا داعي: الأسعار معقولة. اشترِ وادفع.',
            },
            correct: false,
          },
        ],
      },
    ],
  },
  {
    id: 'accueil_famille',
    emoji: '🏠',
    category: 'politesse',
    difficulty: 'easy',
    badge: { fr: 'Politesse en famille', en: 'Family politeness', es: 'Cortesía en familia', ar: 'المجاملة في العائلة' },
    title: {
      fr: 'Accueil en famille',
      en: 'Welcome at a family home',
      es: 'Recibimiento en familia',
      ar: 'استقبال في العائلة',
    },
    context: {
      fr: 'On frappe à la porte de la maison familiale. On te dit « Mer7ba » : réponds poliment et demande des nouvelles.',
      en: 'Someone knocks at the family house door. You hear "Mer7ba": reply politely and ask how everyone is.',
      es: 'Llaman a la puerta de la casa familiar. Te dicen "Mer7ba": responde con cortesía y pregunta cómo está todo el mundo.',
      ar: 'يُطرق باب البيت العائلي. يقولون لك «مرحبا»: ردّ بأدب واسأل عن الأحوال.',
    },
    interlocutorEmoji: '👵',
    interlocutorName: { fr: 'La maman', en: 'The mother', es: 'La madre', ar: 'الأم' },
    turns: [
      {
        id: 'fam_t1',
        speaker: 'interlocutor',
        role: { fr: 'La maman', en: 'The mother', es: 'La madre', ar: 'الأم' },
        arabicVocalized: 'مِرْحْبَا ! لَابَاسْ ٣ْلِيكْ ؟',
        arabizi: 'Mer7ba ! Labas 3lik ?',
        frenchTranslation: 'Bienvenue ! Tout va bien pour toi ?',
        translation: {
          fr: 'Bienvenue ! Tout va bien pour toi ?',
          en: 'Welcome! Is everything okay with you?',
          es: '¡Bienvenido! ¿Todo bien por ti?',
          ar: 'مرحبا! لا بأس عليك؟',
        },
        tokens: [
          { arabizi: 'Mer7ba', arabic: 'مِرْحْبَا', arabiziDigit: '7', translation: { fr: 'bienvenue', en: 'welcome', es: 'bienvenido', ar: 'مرحبا' } },
          { arabizi: 'Labas', arabic: 'لَابَاسْ', translation: { fr: 'ça va ? (litt. pas de mal)', en: 'okay? (lit. no harm)', es: '¿todo bien?', ar: 'لا بأس' } },
          { arabizi: '3lik', arabic: '٣ْلِيكْ', arabiziDigit: '3', translation: { fr: 'sur toi', en: 'on you', es: 'sobre ti', ar: 'عليك' } },
        ],
      },
      {
        id: 'fam_t2',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'لَابَاسْ، اَلْحَمْدُ لِلَّهْ. وْ أَنْتِي ؟',
        arabizi: 'Labas, l7amdullah. O nti ?',
        frenchTranslation: "Ça va, Dieu merci. Et toi ?",
        translation: {
          fr: 'Ça va, Dieu merci. Et toi ?',
          en: 'Fine, thank God. And you?',
          es: 'Bien, gracias a Dios. ¿Y tú?',
          ar: 'لا بأس، الحمد لله. وأنت؟',
        },
        tokens: [
          { arabizi: 'Labas', arabic: 'لَابَاسْ', translation: { fr: 'ça va', en: 'fine', es: 'bien', ar: 'لا بأس' } },
          { arabizi: 'l7amdullah', arabic: 'اَلْحَمْدُ لِلَّهْ', arabiziDigit: '7', translation: { fr: 'Dieu merci', en: 'thank God', es: 'gracias a Dios', ar: 'الحمد لله' } },
          { arabizi: 'nti', arabic: 'أَنْتِي', translation: { fr: 'toi (f.)', en: 'you (f.)', es: 'tú', ar: 'أنتِ' } },
        ],
        options: [
          {
            arabizi: 'Labas, l7amdullah. O nti ?',
            arabic: 'لَابَاسْ، اَلْحَمْدُ لِلَّهْ. وْ أَنْتِي ؟',
            translation: { fr: 'Ça va, Dieu merci. Et toi ?', en: 'Fine, thank God. And you?', es: 'Bien, gracias a Dios. ¿Y tú?', ar: 'لا بأس، الحمد لله. وأنت؟' },
            feedback: {
              fr: 'La réponse la plus naturelle du monde: on répond « Labas », on remercie Dieu et on rend la question.',
              en: 'The most natural answer in the world: reply "Labas", thank God and return the question.',
              es: 'La respuesta más natural del mundo: respondes "Labas", das gracias a Dios y devuelves la pregunta.',
              ar: 'أجمل ردّ في العالم: تجيب «لا بأس»، تحمد الله وتعكس السؤال.',
            },
            correct: true,
          },
          {
            arabizi: 'Labas ? Labas ? labas ?',
            arabic: 'لَابَاسْ ؟ لَابَاسْ ؟ لَابَاسْ ؟',
            translation: { fr: 'Ça va ? Ça va ? Ça va ?', en: 'Okay? Okay? Okay?', es: '¿Bien? ¿Bien? ¿Bien?', ar: 'لا بأس؟ لا بأس؟ لا بأس؟' },
            feedback: {
              fr: 'Répéter « Labas » trois fois est comique : une fois suffit, puis rends la question.',
              en: 'Saying "Labas" three times is funny: once is enough, then return the question.',
              es: 'Decir "Labas" tres veces es cómico: basta una vez, y devuelve la pregunta.',
              ar: 'تكرار «لا بأس» ثلاث مرات مضحك: مرة واحدة تكفي، ثم أعد السؤال.',
            },
            correct: false,
          },
          {
            arabizi: '3afak, bghit nkoun b3id.',
            arabic: 'عَفَاكْ، بْغِيتْ نْكُونْ بْعِيدْ',
            translation: { fr: "S'il te plaît, je veux être loin.", en: 'Please, I want to be far away.', es: 'Por favor, quiero estar lejos.', ar: 'من فضلك، أريد أن أكون بعيدا' },
            feedback: {
              fr: 'Très étrange dans une salutation ! Réponds simplement à la question posée.',
              en: 'Very strange in a greeting! Simply answer the question asked.',
              es: '¡Muy extraño en un saludo! Responde simplemente a la pregunta.',
              ar: 'غريب جدا في التحية! أجب ببساطة على السؤال المطروح.',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'fam_t3',
        speaker: 'interlocutor',
        role: { fr: 'La maman', en: 'The mother', es: 'La madre', ar: 'الأم' },
        arabicVocalized: 'لْحَمْدُ لِلَّهْ، كُلِّشِي مْزْيَانْ. تْفَضَّلْ، دْخُلْ!',
        arabizi: 'L7amdullah, kollchi mzyan. Tfaddal, dkhol !',
        frenchTranslation: 'Dieu merci, tout va bien. Entre, je t’en prie !',
        translation: {
          fr: 'Dieu merci, tout va bien. Entre, je t’en prie !',
          en: 'Thank God, everything is fine. Come in, please!',
          es: 'Gracias a Dios, todo va bien. ¡Entra, por favor!',
          ar: 'الحمد لله، كل شيء بخير. تفضل، ادخل!',
        },
        tokens: [
          { arabizi: 'L7amdullah', arabic: 'اَلْحَمْدُ لِلَّهْ', arabiziDigit: '7', translation: { fr: 'Dieu merci', en: 'thank God', es: 'gracias a Dios', ar: 'الحمد لله' } },
          { arabizi: 'kollchi', arabic: 'كُلِّشِي', translation: { fr: 'tout', en: 'everything', es: 'todo', ar: 'كل شيء' } },
          { arabizi: 'mzyan', arabic: 'مْزْيَانْ', translation: { fr: 'bien / bon', en: 'fine / good', es: 'bien', ar: 'جيد' } },
          { arabizi: 'Tfaddal', arabic: 'تَفَضَّلْ', translation: { fr: 'je t’en prie / entre', en: 'here you go / please come in', es: 'por favor / pasa', ar: 'تفضل' } },
          { arabizi: 'dkhol', arabic: 'دْخُلْ', translation: { fr: 'entre', en: 'come in', es: 'entra', ar: 'ادخل' } },
        ],
      },
      {
        id: 'fam_t4',
        speaker: 'user',
        role: { fr: 'Toi', en: 'You', es: 'Tú', ar: 'أنت' },
        arabicVocalized: 'شُكْرَانْ بْزَّافْ، تْفَضَّلْ بَعْدَكْ.',
        arabizi: 'Chokran bezzaf, tfaddal b3dak.',
        frenchTranslation: 'Merci beaucoup, après toi.',
        translation: {
          fr: 'Merci beaucoup, après toi.',
          en: 'Thank you very much, after you.',
          es: 'Muchas gracias, después de ti.',
          ar: 'شكرا جزيلا، بعدك.',
        },
        tokens: [
          { arabizi: 'Chokran', arabic: 'شُكْرَانْ', translation: { fr: 'merci', en: 'thanks', es: 'gracias', ar: 'شكرا' } },
          { arabizi: 'bezzaf', arabic: 'بْزَّافْ', translation: { fr: 'beaucoup', en: 'a lot', es: 'mucho', ar: 'جزيلا' } },
          { arabizi: 'tfaddal', arabic: 'تَفَضَّلْ', translation: { fr: 'je t’en prie (à toi)', en: 'after you', es: 'tú primero', ar: 'تفضل' } },
          { arabizi: 'b3dak', arabic: 'بَعْدَكْ', arabiziDigit: '3', translation: { fr: 'après toi', en: 'after you', es: 'después de ti', ar: 'بعدك' } },
        ],
        options: [
          {
            arabizi: 'Chokran bezzaf, tfaddal b3dak.',
            arabic: 'شُكْرَانْ بْزَّافْ، تْفَضَّلْ بَعْدَكْ.',
            translation: { fr: 'Merci beaucoup, après toi.', en: 'Thank you very much, after you.', es: 'Muchas gracias, después de ti.', ar: 'شكرا جزيلا، بعدك' },
            feedback: {
              fr: 'Très poli : on remercie et on laisse passer la personne devant soi.',
              en: 'Very polite: you thank and let the person go in before you.',
              es: 'Muy educado: agradeces y dejas pasar a la persona delante de ti.',
              ar: 'مهذب جدا: تشكر وتترك الشخص يدخل قبلك.',
            },
            correct: true,
          },
          {
            arabizi: 'Lalla, ana howa l-mlik !',
            arabic: 'لَلَّا، أَنَا هُوَ المَلِيكْ !',
            translation: { fr: 'Non, c’est moi le roi !', en: 'No, I am the king!', es: 'No, ¡yo soy el rey!', ar: 'لا، أنا هو الملك!' },
            feedback: {
              fr: 'Amusant mais très malpoli dans une famille marocaine ! La modestie est de mise.',
              en: 'Funny but very impolite in a Moroccan family! Modesty is the rule.',
              es: 'Gracioso pero muy descortés en una familia marroquí. ¡La modestia manda!',
              ar: 'مضحك لكنه غير مهذب جدا في عائلة مغربية! التواضع هو القاعدة.',
            },
            correct: false,
          },
          {
            arabizi: 'Bghit nkol l-ghda daba.',
            arabic: 'بْغِيتْ نَكُولْ لْغْدَا دَابَا',
            translation: { fr: 'Je veux manger le déjeuner maintenant.', en: 'I want to eat lunch now.', es: 'Quiero comer el almuerzo ahora.', ar: 'أريد أن آكل الغداء الآن' },
            feedback: {
              fr: 'Brutal : rien n’est encore servi ! Entre d’abord et salue tout le monde.',
              en: 'Rude: nothing is served yet! Come in first and greet everyone.',
              es: 'Brutal: ¡aún no se ha servido nada! Entra primero y saluda a todos.',
              ar: 'فظ: لم يُقدَّم شيء بعد! ادخل أولا وسلّم على الجميع.',
            },
            correct: false,
          },
        ],
      },
      {
        id: 'fam_t5',
        speaker: 'interlocutor',
        role: { fr: 'La maman', en: 'The mother', es: 'La madre', ar: 'الأم' },
        arabicVocalized: 'اَلْعَفْوْ، اِسْتَرِيحْ، اَنْتَ ضِيفْنَا.',
        arabizi: 'L3afou, Steri7, nta dhibna.',
        frenchTranslation: 'De rien, repose-toi, tu es notre invité.',
        translation: {
          fr: 'De rien, repose-toi, tu es notre invité.',
          en: 'You are welcome, rest, you are our guest.',
          es: 'De nada, descansa, eres nuestro invitado.',
          ar: 'عفوا، استرح، أنت ضيفنا.',
        },
        tokens: [
          { arabizi: 'L3afou', arabic: 'اَلْعَفْوْ', arabiziDigit: '3', translation: { fr: 'de rien / pardon', en: 'you are welcome', es: 'de nada', ar: 'العفو' } },
          { arabizi: 'Steri7', arabic: 'اِسْتَرِيحْ', arabiziDigit: '7', translation: { fr: 'repose-toi', en: 'rest', es: 'descansa', ar: 'استرح' } },
          { arabizi: 'dhibna', arabic: 'ضِيفْنَا', translation: { fr: 'notre invité', en: 'our guest', es: 'nuestro invitado', ar: 'ضيفنا' } },
        ],
      },
    ],
  },
];

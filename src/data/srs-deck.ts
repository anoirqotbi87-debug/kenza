import { VocabularySRSData } from '../types/srs';

export type SRSDictionaryItem = VocabularySRSData;
export const srsVocabulary: VocabularySRSData[] = [
  {
    id: 'srs_salam',
    arabizi: 'Salam',
    arabic: 'السَّلَامُ عَلَيْكُمْ',
    translation: {
      fr: 'Bonjour / Paix',
      en: 'Hello / Peace',
      es: 'Hola / Paz',
      ar: 'سلام'
    },
    category: 'polite_social',
    illustration: { iconName: 'Handshake' },
    example: {
      arabizi: 'Salam, labas?',
      arabic: 'السلام، لاباس؟',
      translation: {
        fr: 'Bonjour, ça va ?',
        en: 'Hello, how are you?',
        es: 'Hola, ¿qué tal?',
        ar: 'السلام، كيف الحال؟'
      }
    }
  },
  {
    id: 'srs_sba7_lkhir',
    arabizi: 'Sba7 l-khir',
    arabic: 'صْبَاحْ الخِيرْ',
    translation: {
      fr: 'Bonjour (matin)',
      en: 'Good morning',
      es: 'Buenos días',
      ar: 'صباح الخير'
    },
    category: 'polite_social',
    illustration: { iconName: 'Sun' },
    example: {
      arabizi: 'Sba7 l-khir a khoya',
      arabic: 'صباح الخير ا خويا',
      translation: {
        fr: 'Bonjour mon frère',
        en: 'Good morning brother',
        es: 'Buenos días hermano',
        ar: 'صباح الخير يا أخي'
      }
    }
  },
  {
    id: 'srs_msa_lkhir',
    arabizi: 'Msa l-khir',
    arabic: 'مسَا الخِيرْ',
    translation: {
      fr: 'Bonsoir',
      en: 'Good evening',
      es: 'Buenas tardes',
      ar: 'مساء الخير'
    },
    category: 'polite_social',
    illustration: { iconName: 'Moon' },
    example: {
      arabizi: 'Msa l-khir a lalla',
      arabic: 'مسا الخير ا لالة',
      translation: {
        fr: 'Bonsoir madame',
        en: 'Good evening madam',
        es: 'Buenas noches señora',
        ar: 'مساء الخير يا سيدتي'
      }
    }
  },
  {
    id: 'srs_labas',
    arabizi: 'Labas',
    arabic: 'لَابَاسْ',
    translation: {
      fr: 'Ça va ?',
      en: 'How are you?',
      es: '¿Qué tal?',
      ar: 'لاباس'
    },
    category: 'polite_social',
    illustration: { iconName: 'Smile' },
    example: {
      arabizi: 'Labas 3lik?',
      arabic: 'لاباس عليك؟',
      translation: {
        fr: 'Est-ce que ça va ?',
        en: 'Are you okay?',
        es: '¿Estás bien?',
        ar: 'هل أنت بخير؟'
      }
    }
  },
  {
    id: 'srs_kif_dayer',
    arabizi: 'Kif dayer',
    arabic: 'كِيفْ دَايِرْ',
    translation: {
      fr: 'Comment vas-tu ? (masc)',
      en: 'How are you? (masc)',
      es: '¿Cómo estás? (masc)',
      ar: 'كيف داير'
    },
    category: 'polite_social',
    illustration: { iconName: 'User' },
    example: {
      arabizi: 'Kif dayer m3a s-saha?',
      arabic: 'كيف داير مع الصحة؟',
      translation: {
        fr: 'Comment va la santé ?',
        en: 'How is your health?',
        es: '¿Cómo va la salud?',
        ar: 'كيف حال صحتك؟'
      }
    }
  },
  {
    id: 'srs_kif_dayra',
    arabizi: 'Kif dayra',
    arabic: 'كِيفْ دَايْرَة',
    translation: {
      fr: 'Comment vas-tu ? (fém)',
      en: 'How are you? (fem)',
      es: '¿Cómo estás? (fem)',
      ar: 'كيف دايرة'
    },
    category: 'polite_social',
    illustration: { iconName: 'User' },
    example: {
      arabizi: 'Kif dayra a lalla?',
      arabic: 'كيف دايرة ا لالة؟',
      translation: {
        fr: 'Comment vas-tu madame ?',
        en: 'How are you madam?',
        es: '¿Cómo estás señora?',
        ar: 'كيف حالك يا سيدتي؟'
      }
    }
  },
  {
    id: 'srs_hamdullah',
    arabizi: 'Hamdullah',
    arabic: 'الحَمْدُ للَّه',
    translation: {
      fr: 'Dieu merci / Tout va bien',
      en: 'Thank God / All good',
      es: 'Gracias a Dios / Todo bien',
      ar: 'الحمد لله'
    },
    category: 'polite_social',
    illustration: { iconName: 'Heart' },
    example: {
      arabizi: 'Labas, hamdullah',
      arabic: 'لاباس، الحمد لله',
      translation: {
        fr: 'Ça va, Dieu merci',
        en: 'Fine, thank God',
        es: 'Bien, gracias a Dios',
        ar: 'بخير، الحمد لله'
      }
    }
  },
  {
    id: 'srs_shukran',
    arabizi: 'Shukran',
    arabic: 'شُكْرًا',
    translation: {
      fr: 'Merci',
      en: 'Thank you',
      es: 'Gracias',
      ar: 'شكرا'
    },
    category: 'polite_social',
    illustration: { iconName: 'ThumbsUp' },
    example: {
      arabizi: 'Shukran bzzaf',
      arabic: 'شكرا بزاف',
      translation: {
        fr: 'Merci beaucoup',
        en: 'Thank you very much',
        es: 'Muchas gracias',
        ar: 'شكرا جزيلا'
      }
    }
  },
  {
    id: 'srs_afak',
    arabizi: '3afak',
    arabic: 'عَافَاكْ',
    translation: {
      fr: 'S\'il te plaît',
      en: 'Please',
      es: 'Por favor',
      ar: 'عفاك'
    },
    category: 'polite_social',
    illustration: { iconName: 'Star' },
    example: {
      arabizi: '3tini lma 3afak',
      arabic: 'عطيني لما عفاك',
      translation: {
        fr: 'Donne-moi de l\'eau s\'il te plaît',
        en: 'Give me water please',
        es: 'Dame agua por favor',
        ar: 'أعطني الماء من فضلك'
      }
    }
  },
  {
    id: 'srs_smahli',
    arabizi: 'Smahli',
    arabic: 'سْمَحْ لِي',
    translation: {
      fr: 'Excusez-moi / Pardon',
      en: 'Excuse me',
      es: 'Disculpe',
      ar: 'سمح لي'
    },
    category: 'polite_social',
    illustration: { iconName: 'Info' },
    example: {
      arabizi: 'Smahli a khoya',
      arabic: 'سمح لي ا خويا',
      translation: {
        fr: 'Excuse-moi mon frère',
        en: 'Excuse me brother',
        es: 'Disculpa hermano',
        ar: 'عذرا يا أخي'
      }
    }
  },
  {
    id: 'srs_bessaha',
    arabizi: 'Bessaha',
    arabic: 'بَالصَّحَّة',
    translation: {
      fr: 'À votre santé / Bon appétit',
      en: 'To your health / Bon appetit',
      es: 'A su salud / Buen provecho',
      ar: 'بالصحة'
    },
    category: 'polite_social',
    illustration: { iconName: 'Coffee' },
    example: {
      arabizi: 'Bessaha w raha',
      arabic: 'بالصحة و الراحة',
      translation: {
        fr: 'À votre santé et repos',
        en: 'To your health and rest',
        es: 'A su salud y descanso',
        ar: 'بالصحة والراحة'
      }
    }
  },
  {
    id: 'srs_lahetek_saha',
    arabizi: 'Lahetek saha',
    arabic: 'اللَّهْ يَعْطِيكْ الصَّحَّة',
    translation: {
      fr: 'Réponse à Bessaha',
      en: 'Response to Bessaha',
      es: 'Respuesta a Bessaha',
      ar: 'الله يعطيك الصحة'
    },
    category: 'polite_social',
    illustration: { iconName: 'Heart' },
    example: {
      arabizi: 'Lahetek saha',
      arabic: 'الله يعطيك الصحة',
      translation: {
        fr: 'Que Dieu te donne la santé',
        en: 'May God give you health',
        es: 'Que Dios te dé salud',
        ar: 'الله يعطيك الصحة'
      }
    }
  },
  {
    id: 'srs_tbarkellah',
    arabizi: 'Tbarkellah',
    arabic: 'تْبَارْكَ اللَّهْ',
    translation: {
      fr: 'Formule d\'admiration',
      en: 'Expression of admiration',
      es: 'Expresión de admiración',
      ar: 'تبارك الله'
    },
    category: 'polite_social',
    illustration: { iconName: 'Sparkles' },
    example: {
      arabizi: 'Tbarkellah 3lik',
      arabic: 'تبارك الله عليك',
      translation: {
        fr: 'Que Dieu te bénisse (admiration)',
        en: 'God bless you (admiration)',
        es: 'Dios te bendiga (admiración)',
        ar: 'تبارك الله عليك'
      }
    }
  },
  {
    id: 'srs_bslama',
    arabizi: 'Bslama',
    arabic: 'بْسْلَامَة',
    translation: {
      fr: 'Au revoir',
      en: 'Goodbye',
      es: 'Adiós',
      ar: 'بسلامة'
    },
    category: 'polite_social',
    illustration: { iconName: 'LogOut' },
    example: {
      arabizi: 'Yallah bslama',
      arabic: 'يالاه بسلامة',
      translation: {
        fr: 'Allez, au revoir',
        en: 'Alright, goodbye',
        es: 'Venga, adiós',
        ar: 'يلا، مع السلامة'
      }
    }
  },
  {
    id: 'srs_merhba',
    arabizi: 'Merhba',
    arabic: 'مَرْحْبَا',
    translation: {
      fr: 'Bienvenue',
      en: 'Welcome',
      es: 'Bienvenido',
      ar: 'مرحبا'
    },
    category: 'polite_social',
    illustration: { iconName: 'DoorOpen' },
    example: {
      arabizi: 'Merhba bik',
      arabic: 'مرحبا بيك',
      translation: {
        fr: 'Bienvenue à toi',
        en: 'Welcome to you',
        es: 'Bienvenido seas',
        ar: 'مرحبا بك'
      }
    }
  },
  {
    id: 'srs_wakha',
    arabizi: 'Wakha',
    arabic: 'وَاخَّا',
    translation: {
      fr: 'D\'accord / Entendu',
      en: 'Okay / Understood',
      es: 'De acuerdo / Entendido',
      ar: 'واخا'
    },
    category: 'polite_social',
    illustration: { iconName: 'Check' },
    example: {
      arabizi: 'Wakha, machi moshkil',
      arabic: 'واخا، ماشي مشكيل',
      translation: {
        fr: 'D\'accord, pas de problème',
        en: 'Okay, no problem',
        es: 'Vale, no hay problema',
        ar: 'حسنا، لا مشكلة'
      }
    }
  },
  {
    id: 'srs_iyeh',
    arabizi: 'Iyeh',
    arabic: 'إِيِّيهْ',
    translation: {
      fr: 'Oui',
      en: 'Yes',
      es: 'Sí',
      ar: 'إييه'
    },
    category: 'polite_social',
    illustration: { iconName: 'CheckCircle' },
    example: {
      arabizi: 'Iyeh, bghit',
      arabic: 'إييه، بغيت',
      translation: {
        fr: 'Oui, je veux',
        en: 'Yes, I want',
        es: 'Sí, quiero',
        ar: 'نعم، أريد'
      }
    }
  },
  {
    id: 'srs_lla',
    arabizi: 'Lla',
    arabic: 'لَّا',
    translation: {
      fr: 'Non',
      en: 'No',
      es: 'No',
      ar: 'لا'
    },
    category: 'polite_social',
    illustration: { iconName: 'XCircle' },
    example: {
      arabizi: 'Lla, shukran',
      arabic: 'لا، شكرا',
      translation: {
        fr: 'Non, merci',
        en: 'No, thank you',
        es: 'No, gracias',
        ar: 'لا، شكرا'
      }
    }
  },
  {
    id: 'srs_hchouma',
    arabizi: 'Hchouma',
    arabic: 'حْشُومَة',
    translation: {
      fr: 'C\'est honteux / C\'est déplacé',
      en: 'It\'s shameful',
      es: 'Es vergonzoso',
      ar: 'حشومة'
    },
    category: 'polite_social',
    illustration: { iconName: 'AlertCircle' },
    example: {
      arabizi: 'Hchouma 3lik',
      arabic: 'حشومة عليك',
      translation: {
        fr: 'Honte à toi',
        en: 'Shame on you',
        es: 'Qué vergüenza',
        ar: 'عيب عليك'
      }
    }
  },
  {
    id: 'srs_mashi_moshkil',
    arabizi: 'Mashi moshkil',
    arabic: 'مَاشِي مُشْكِيلْ',
    translation: {
      fr: 'Pas de problème',
      en: 'No problem',
      es: 'Ningún problema',
      ar: 'ماشي مشكيل'
    },
    category: 'polite_social',
    illustration: { iconName: 'ThumbsUp' },
    example: {
      arabizi: 'Wakha, mashi moshkil',
      arabic: 'واخا، ماشي مشكيل',
      translation: {
        fr: 'D\'accord, pas de problème',
        en: 'Okay, no problem',
        es: 'Vale, ningún problema',
        ar: 'حسنا، لا مشكلة'
      }
    }
  },
  {
    id: 'srs_atay',
    arabizi: 'Atay',
    arabic: 'أَتَايْ',
    translation: {
      fr: 'Thé à la menthe',
      en: 'Mint tea',
      es: 'Té de menta',
      ar: 'شاي'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Coffee' },
    example: {
      arabizi: 'Bghit atay b n3na3',
      arabic: 'بغيت اتاي ب النعناع',
      translation: {
        fr: 'Je veux un thé à la menthe',
        en: 'I want mint tea',
        es: 'Quiero un té con menta',
        ar: 'أريد شاي بالنعناع'
      }
    }
  },
  {
    id: 'srs_qhwa',
    arabizi: '9hwa',
    arabic: 'قَهْوَة',
    translation: {
      fr: 'Café',
      en: 'Coffee',
      es: 'Café',
      ar: 'قهوة'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Coffee' },
    example: {
      arabizi: '9hwa kahla 3afak',
      arabic: 'قهوة كحلة عفاك',
      translation: {
        fr: 'Un café noir s\'il te plaît',
        en: 'Black coffee please',
        es: 'Un café solo por favor',
        ar: 'قهوة سوداء من فضلك'
      }
    }
  },
  {
    id: 'srs_qhwa_nss',
    arabizi: '9hwa nss-nss',
    arabic: 'قَهْوَة نُصْ نُصْ',
    translation: {
      fr: 'Café au lait',
      en: 'Coffee with milk',
      es: 'Café con leche',
      ar: 'قهوة حليب'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Coffee' },
    example: {
      arabizi: 'Jib li 9hwa nss-nss',
      arabic: 'جيب لي قهوة نص نص',
      translation: {
        fr: 'Apporte-moi un café au lait',
        en: 'Bring me a coffee with milk',
        es: 'Tráeme un café con leche',
        ar: 'أحضر لي قهوة بالحليب'
      }
    }
  },
  {
    id: 'srs_lma',
    arabizi: 'Lma',
    arabic: 'المَا',
    translation: {
      fr: 'L\'eau',
      en: 'Water',
      es: 'Agua',
      ar: 'الماء'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Droplets' },
    example: {
      arabizi: '3tini lma',
      arabic: 'عطيني لما',
      translation: {
        fr: 'Donne-moi de l\'eau',
        en: 'Give me water',
        es: 'Dame agua',
        ar: 'أعطني الماء'
      }
    }
  },
  {
    id: 'srs_lma_skhoun',
    arabizi: 'Lma skhoun',
    arabic: 'المَا سْخُونْ',
    translation: {
      fr: 'Eau chaude',
      en: 'Hot water',
      es: 'Agua caliente',
      ar: 'ماء ساخن'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Flame' },
    example: {
      arabizi: 'Lma skhoun bzzaf',
      arabic: 'لما سخون بزاف',
      translation: {
        fr: 'L\'eau est très chaude',
        en: 'The water is very hot',
        es: 'El agua está muy caliente',
        ar: 'الماء ساخن جدا'
      }
    }
  },
  {
    id: 'srs_lma_bared',
    arabizi: 'Lma bared',
    arabic: 'المَا بَارِدْ',
    translation: {
      fr: 'Eau fraîche',
      en: 'Cold water',
      es: 'Agua fría',
      ar: 'ماء بارد'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Snowflake' },
    example: {
      arabizi: 'Bghit lma bared',
      arabic: 'بغيت لما بارد',
      translation: {
        fr: 'Je veux de l\'eau fraîche',
        en: 'I want cold water',
        es: 'Quiero agua fría',
        ar: 'أريد ماء بارد'
      }
    }
  },
  {
    id: 'srs_asir',
    arabizi: '3asir',
    arabic: 'عَصِيرْ',
    translation: {
      fr: 'Jus de fruit',
      en: 'Juice',
      es: 'Zumo',
      ar: 'عصير'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'GlassWater' },
    example: {
      arabizi: '3asir l-limoun',
      arabic: 'عصير الليمون',
      translation: {
        fr: 'Jus d\'orange',
        en: 'Orange juice',
        es: 'Zumo de naranja',
        ar: 'عصير البرتقال'
      }
    }
  },
  {
    id: 'srs_khobz',
    arabizi: 'Khobz',
    arabic: 'خُبْزْ',
    translation: {
      fr: 'Pain',
      en: 'Bread',
      es: 'Pan',
      ar: 'خبز'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Croissant' },
    example: {
      arabizi: 'Jib l-khobz',
      arabic: 'جيب الخبز',
      translation: {
        fr: 'Apporte le pain',
        en: 'Bring the bread',
        es: 'Trae el pan',
        ar: 'أحضر الخبز'
      }
    }
  },
  {
    id: 'srs_sukkar',
    arabizi: 'Sukkar',
    arabic: 'سُكَّارْ',
    translation: {
      fr: 'Sucre',
      en: 'Sugar',
      es: 'Azúcar',
      ar: 'سكر'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Box' },
    example: {
      arabizi: 'Zid s-sukkar',
      arabic: 'زيد السكر',
      translation: {
        fr: 'Ajoute du sucre',
        en: 'Add sugar',
        es: 'Añade azúcar',
        ar: 'أضف السكر'
      }
    }
  },
  {
    id: 'srs_bla_sekkar',
    arabizi: 'Bla sekkar',
    arabic: 'بْلَا سُكَّارْ',
    translation: {
      fr: 'Sans sucre',
      en: 'Without sugar',
      es: 'Sin azúcar',
      ar: 'بدون سكر'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Ban' },
    example: {
      arabizi: '9hwa bla sekkar',
      arabic: 'قهوة بلا سكار',
      translation: {
        fr: 'Café sans sucre',
        en: 'Coffee without sugar',
        es: 'Café sin azúcar',
        ar: 'قهوة بدون سكر'
      }
    }
  },
  {
    id: 'srs_bghit',
    arabizi: 'Bghit',
    arabic: 'بْغِيتْ',
    translation: {
      fr: 'Je veux',
      en: 'I want',
      es: 'Quiero',
      ar: 'أريد'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Pointer' },
    example: {
      arabizi: 'Bghit nakoul',
      arabic: 'بغيت ناكل',
      translation: {
        fr: 'Je veux manger',
        en: 'I want to eat',
        es: 'Quiero comer',
        ar: 'أريد أن آكل'
      }
    }
  },
  {
    id: 'srs_mabghitch',
    arabizi: 'Ma-bghit-ch',
    arabic: 'مَا بْغِيتْشْ',
    translation: {
      fr: 'Je ne veux pas',
      en: 'I do not want',
      es: 'No quiero',
      ar: 'لا أريد'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'XSquare' },
    example: {
      arabizi: 'Ma-bghit-ch hada',
      arabic: 'ما بغيتش هادا',
      translation: {
        fr: 'Je ne veux pas ça',
        en: 'I do not want this',
        es: 'No quiero esto',
        ar: 'لا أريد هذا'
      }
    }
  },
  {
    id: 'srs_lhsab',
    arabizi: 'L-hsab',
    arabic: 'الحْسَابْ',
    translation: {
      fr: 'L\'addition',
      en: 'The bill',
      es: 'La cuenta',
      ar: 'الحساب'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Receipt' },
    example: {
      arabizi: 'L-hsab 3afak',
      arabic: 'الحساب عفاك',
      translation: {
        fr: 'L\'addition s\'il te plaît',
        en: 'The bill please',
        es: 'La cuenta por favor',
        ar: 'الحساب من فضلك'
      }
    }
  },
  {
    id: 'srs_ftour',
    arabizi: 'Ftour',
    arabic: 'فْطُورْ',
    translation: {
      fr: 'Petit-déjeuner',
      en: 'Breakfast',
      es: 'Desayuno',
      ar: 'فطور'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Sunrise' },
    example: {
      arabizi: 'Waqt l-ftour',
      arabic: 'وقت الفطور',
      translation: {
        fr: 'L\'heure du petit-déjeuner',
        en: 'Breakfast time',
        es: 'Hora del desayuno',
        ar: 'وقت الفطور'
      }
    }
  },
  {
    id: 'srs_ghdha',
    arabizi: 'Ghdha',
    arabic: 'غْدَا',
    translation: {
      fr: 'Déjeuner',
      en: 'Lunch',
      es: 'Almuerzo',
      ar: 'غداء'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Sun' },
    example: {
      arabizi: 'Shnu kayn f l-ghdha?',
      arabic: 'شنو كاين ف الغدا؟',
      translation: {
        fr: 'Qu\'y a-t-il pour le déjeuner ?',
        en: 'What is for lunch?',
        es: '¿Qué hay para almorzar?',
        ar: 'ماذا يوجد للغداء؟'
      }
    }
  },
  {
    id: 'srs_asha',
    arabizi: '3sha',
    arabic: 'عْشَا',
    translation: {
      fr: 'Dîner',
      en: 'Dinner',
      es: 'Cena',
      ar: 'عشاء'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Moon' },
    example: {
      arabizi: 'L-3sha wajed',
      arabic: 'العشا واجد',
      translation: {
        fr: 'Le dîner est prêt',
        en: 'Dinner is ready',
        es: 'La cena está lista',
        ar: 'العشاء جاهز'
      }
    }
  },
  {
    id: 'srs_tajine',
    arabizi: 'Tajine',
    arabic: 'طَاجِينْ',
    translation: {
      fr: 'Tajine',
      en: 'Tajine',
      es: 'Tayín',
      ar: 'طاجين'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Utensils' },
    example: {
      arabizi: 'Tajine d l-l7em',
      arabic: 'طاجين د اللحم',
      translation: {
        fr: 'Tajine de viande',
        en: 'Meat tajine',
        es: 'Tayín de carne',
        ar: 'طاجين اللحم'
      }
    }
  },
  {
    id: 'srs_zit_zitoun',
    arabizi: 'Zit zitoun',
    arabic: 'زِيتْ زِيتُونْ',
    translation: {
      fr: 'Huile d\'olive',
      en: 'Olive oil',
      es: 'Aceite de oliva',
      ar: 'زيت الزيتون'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Droplet' },
    example: {
      arabizi: 'Khobz b zit zitoun',
      arabic: 'خبز ب زيت زيتون',
      translation: {
        fr: 'Pain avec de l\'huile d\'olive',
        en: 'Bread with olive oil',
        es: 'Pan con aceite de oliva',
        ar: 'خبز بزيت الزيتون'
      }
    }
  },
  {
    id: 'srs_m3elqa',
    arabizi: 'M3elqa',
    arabic: 'مْعَلْقَة',
    translation: {
      fr: 'Cuillère',
      en: 'Spoon',
      es: 'Cuchara',
      ar: 'ملعقة'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Utensils' },
    example: {
      arabizi: '3tini m3elqa',
      arabic: 'عطيني معلقة',
      translation: {
        fr: 'Donne-moi une cuillère',
        en: 'Give me a spoon',
        es: 'Dame una cuchara',
        ar: 'أعطني ملعقة'
      }
    }
  },
  {
    id: 'srs_farshita',
    arabizi: 'Farshita',
    arabic: 'فَرْشِيطَة',
    translation: {
      fr: 'Fourchette',
      en: 'Fork',
      es: 'Tenedor',
      ar: 'شوكة'
    },
    category: 'cafe_resto',
    illustration: { iconName: 'Utensils' },
    example: {
      arabizi: 'Khasni farshita',
      arabic: 'خصني فرشيطة',
      translation: {
        fr: 'J\'ai besoin d\'une fourchette',
        en: 'I need a fork',
        es: 'Necesito un tenedor',
        ar: 'أحتاج شوكة'
      }
    }
  },
  {
    id: 'srs_korsa',
    arabizi: 'Korsa',
    arabic: 'كُورْسَا',
    translation: {
      fr: 'Course en taxi',
      en: 'Taxi ride',
      es: 'Viaje en taxi',
      ar: 'رحلة تاكسي'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Car' },
    example: {
      arabizi: 'Korsa l medina',
      arabic: 'كورسا ل مدينة',
      translation: {
        fr: 'Course vers la médina',
        en: 'Ride to the medina',
        es: 'Viaje a la medina',
        ar: 'رحلة للمدينة'
      }
    }
  },
  {
    id: 'srs_kuntur',
    arabizi: 'Khdem l-kuntur',
    arabic: 'خَدَّمْ الكُونْتُورْ',
    translation: {
      fr: 'Mettez le compteur',
      en: 'Turn on the meter',
      es: 'Ponga el taxímetro',
      ar: 'شغل العداد'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Gauge' },
    example: {
      arabizi: 'Khdem l-kuntur 3afak',
      arabic: 'خدم الكونتور عفاك',
      translation: {
        fr: 'Mettez le compteur s\'il vous plaît',
        en: 'Turn on the meter please',
        es: 'Ponga el taxímetro por favor',
        ar: 'شغل العداد من فضلك'
      }
    }
  },
  {
    id: 'srs_dor_limen',
    arabizi: 'Dor 3la limen',
    arabic: 'دُورْ عَلَى لِيمِينْ',
    translation: {
      fr: 'Tourne à droite',
      en: 'Turn right',
      es: 'Gira a la derecha',
      ar: 'در يمينا'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'CornerUpRight' },
    example: {
      arabizi: 'Dor 3la limen hna',
      arabic: 'دور على ليمين هنا',
      translation: {
        fr: 'Tourne à droite ici',
        en: 'Turn right here',
        es: 'Gira a la derecha aquí',
        ar: 'در يمينا هنا'
      }
    }
  },
  {
    id: 'srs_dor_lisir',
    arabizi: 'Dor 3la lisir',
    arabic: 'دُورْ عَلَى لِيسِيرْ',
    translation: {
      fr: 'Tourne à gauche',
      en: 'Turn left',
      es: 'Gira a la izquierda',
      ar: 'در يسارا'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'CornerUpLeft' },
    example: {
      arabizi: 'Dor 3la lisir mor d-dar',
      arabic: 'دور على ليسير مور الدار',
      translation: {
        fr: 'Tourne à gauche après la maison',
        en: 'Turn left after the house',
        es: 'Gira a la izquierda después de la casa',
        ar: 'در يسارا بعد المنزل'
      }
    }
  },
  {
    id: 'srs_sir_nishan',
    arabizi: 'Sir nishan',
    arabic: 'سِيرْ نِيشَانْ',
    translation: {
      fr: 'Va tout droit',
      en: 'Go straight',
      es: 'Sigue todo recto',
      ar: 'سر مباشرة'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'ArrowUp' },
    example: {
      arabizi: 'Sir nishan tal chanti',
      arabic: 'سير نيشان تال شانطي',
      translation: {
        fr: 'Va tout droit jusqu\'à la route',
        en: 'Go straight until the road',
        es: 'Sigue recto hasta la carretera',
        ar: 'سر مباشرة حتى الطريق'
      }
    }
  },
  {
    id: 'srs_wqef_hna',
    arabizi: 'Wqef hna',
    arabic: 'وقَفْ هْنَا',
    translation: {
      fr: 'Arrête-toi ici',
      en: 'Stop here',
      es: 'Para aquí',
      ar: 'قف هنا'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Octagon' },
    example: {
      arabizi: 'Wqef hna 3afak',
      arabic: 'وقف هنا عفاك',
      translation: {
        fr: 'Arrête-toi ici s\'il te plaît',
        en: 'Stop here please',
        es: 'Para aquí por favor',
        ar: 'قف هنا من فضلك'
      }
    }
  },
  {
    id: 'srs_lmahetta',
    arabizi: 'L-ma7etta',
    arabic: 'المَحَطَّة',
    translation: {
      fr: 'La gare / station',
      en: 'The station',
      es: 'La estación',
      ar: 'المحطة'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Train' },
    example: {
      arabizi: 'Bghit nemchi l-ma7etta d tran',
      arabic: 'بغيت نمشي ل محطة د تران',
      translation: {
        fr: 'Je veux aller à la gare',
        en: 'I want to go to the train station',
        es: 'Quiero ir a la estación de tren',
        ar: 'أريد الذهاب إلى محطة القطار'
      }
    }
  },
  {
    id: 'srs_lmatar',
    arabizi: 'L-matar',
    arabic: 'المَطَارْ',
    translation: {
      fr: 'L\'aéroport',
      en: 'The airport',
      es: 'El aeropuerto',
      ar: 'المطار'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Plane' },
    example: {
      arabizi: 'Korsa l-matar',
      arabic: 'كورسا ل مطار',
      translation: {
        fr: 'Course vers l\'aéroport',
        en: 'Ride to the airport',
        es: 'Viaje al aeropuerto',
        ar: 'رحلة إلى المطار'
      }
    }
  },
  {
    id: 'srs_bab',
    arabizi: 'Bab',
    arabic: 'بَابْ',
    translation: {
      fr: 'Porte',
      en: 'Door / Gate',
      es: 'Puerta',
      ar: 'باب'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'DoorClosed' },
    example: {
      arabizi: 'Wqef f bab boujeloud',
      arabic: 'وقف ف باب بوجلود',
      translation: {
        fr: 'Arrête-toi à Bab Boujeloud',
        en: 'Stop at Bab Boujeloud',
        es: 'Para en Bab Boujeloud',
        ar: 'قف في باب بوجلود'
      }
    }
  },
  {
    id: 'srs_zanqa',
    arabizi: 'Zanqa',
    arabic: 'زَنْقَة',
    translation: {
      fr: 'Ruelle / Rue',
      en: 'Street / Alley',
      es: 'Calle / Callejón',
      ar: 'زنقة'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Map' },
    example: {
      arabizi: 'Dor f had z-zanqa',
      arabic: 'دور ف هاد الزنقة',
      translation: {
        fr: 'Tourne dans cette rue',
        en: 'Turn into this street',
        es: 'Gira en esta calle',
        ar: 'در في هذا الشارع'
      }
    }
  },
  {
    id: 'srs_medina',
    arabizi: 'Medina qdima',
    arabic: 'المَدِينَة القْدِيمَة',
    translation: {
      fr: 'L\'ancienne médina',
      en: 'The old medina',
      es: 'La antigua medina',
      ar: 'المدينة القديمة'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Castle' },
    example: {
      arabizi: 'Nemchiw l-medina l-qdima',
      arabic: 'نمشيو ل مدينة ل قديمة',
      translation: {
        fr: 'Allons à l\'ancienne médina',
        en: 'Let\'s go to the old medina',
        es: 'Vamos a la antigua medina',
        ar: 'لنذهب إلى المدينة القديمة'
      }
    }
  },
  {
    id: 'srs_qrib',
    arabizi: 'Qrib',
    arabic: 'قْرِيبْ',
    translation: {
      fr: 'Proche',
      en: 'Near',
      es: 'Cerca',
      ar: 'قريب'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'MapPin' },
    example: {
      arabizi: 'Wesh qrib mn hna?',
      arabic: 'واش قريب من هنا؟',
      translation: {
        fr: 'Est-ce proche d\'ici ?',
        en: 'Is it near here?',
        es: '¿Está cerca de aquí?',
        ar: 'هل هو قريب من هنا؟'
      }
    }
  },
  {
    id: 'srs_b3id',
    arabizi: 'B3id',
    arabic: 'بْعِيدْ',
    translation: {
      fr: 'Loin',
      en: 'Far',
      es: 'Lejos',
      ar: 'بعيد'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Navigation' },
    example: {
      arabizi: 'L-matar b3id bzzaf',
      arabic: 'المطار بعيد بزاف',
      translation: {
        fr: 'L\'aéroport est très loin',
        en: 'The airport is very far',
        es: 'El aeropuerto está muy lejos',
        ar: 'المطار بعيد جدا'
      }
    }
  },
  {
    id: 'srs_fin_ghadi',
    arabizi: 'Fin ghadi',
    arabic: 'فِينْ غَادِي',
    translation: {
      fr: 'Où vas-tu ?',
      en: 'Where are you going?',
      es: '¿A dónde vas?',
      ar: 'إلى أين أنت ذاهب؟'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'Compass' },
    example: {
      arabizi: 'Fin ghadi a sidi?',
      arabic: 'فين غادي ا سيدي؟',
      translation: {
        fr: 'Où allez-vous monsieur ?',
        en: 'Where are you going sir?',
        es: '¿A dónde va señor?',
        ar: 'إلى أين أنت ذاهب يا سيدي؟'
      }
    }
  },
  {
    id: 'srs_wselna',
    arabizi: 'Wsel-na',
    arabic: 'وْصَلْنَا',
    translation: {
      fr: 'Nous sommes arrivés',
      en: 'We have arrived',
      es: 'Hemos llegado',
      ar: 'وصلنا'
    },
    category: 'taxi_transport',
    illustration: { iconName: 'CheckCircle' },
    example: {
      arabizi: 'Hamdullah wsel-na',
      arabic: 'الحمد لله وصلنا',
      translation: {
        fr: 'Dieu merci, nous sommes arrivés',
        en: 'Thank God we arrived',
        es: 'Gracias a Dios hemos llegado',
        ar: 'الحمد لله وصلنا'
      }
    }
  },
  {
    id: 'srs_sh7al',
    arabizi: 'Sh7al hada',
    arabic: 'شْحَالْ هَادَا',
    translation: {
      fr: 'Combien ça coûte ?',
      en: 'How much is this?',
      es: '¿Cuánto cuesta?',
      ar: 'بكم هذا؟'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Tag' },
    example: {
      arabizi: 'B sh7al had z-zerbiya?',
      arabic: 'ب شحال هاد الزربية؟',
      translation: {
        fr: 'Combien coûte ce tapis ?',
        en: 'How much is this carpet?',
        es: '¿Cuánto cuesta esta alfombra?',
        ar: 'بكم هذه الزربية؟'
      }
    }
  },
  {
    id: 'srs_ghali',
    arabizi: 'Ghali bzzaf',
    arabic: 'غَالِي بْزَّافْ',
    translation: {
      fr: 'Trop cher',
      en: 'Too expensive',
      es: 'Demasiado caro',
      ar: 'غال جدا'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'TrendingUp' },
    example: {
      arabizi: 'Hada ghali bzzaf',
      arabic: 'هادا غالي بزاف',
      translation: {
        fr: 'C\'est trop cher',
        en: 'This is too expensive',
        es: 'Esto es demasiado caro',
        ar: 'هذا غالي جدا'
      }
    }
  },
  {
    id: 'srs_nqess',
    arabizi: 'Nqess shwiya',
    arabic: 'نْقَّصْ شْوِيَّة',
    translation: {
      fr: 'Baisse un peu le prix',
      en: 'Lower the price a bit',
      es: 'Baja un poco el precio',
      ar: 'خفض قليلا'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'TrendingDown' },
    example: {
      arabizi: 'Nqess shwiya 3afak',
      arabic: 'نقص شوية عفاك',
      translation: {
        fr: 'Baisse un peu s\'il te plaît',
        en: 'Lower it a bit please',
        es: 'Baja un poco por favor',
        ar: 'نقص قليلا من فضلك'
      }
    }
  },
  {
    id: 'srs_flus',
    arabizi: 'Flus',
    arabic: 'فْلُوسْ',
    translation: {
      fr: 'Argent',
      en: 'Money',
      es: 'Dinero',
      ar: 'نقود'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Coins' },
    example: {
      arabizi: 'Ma-3endi-ch l-flus',
      arabic: 'ما عنديش الفلوس',
      translation: {
        fr: 'Je n\'ai pas d\'argent',
        en: 'I don\'t have money',
        es: 'No tengo dinero',
        ar: 'ليس لدي نقود'
      }
    }
  },
  {
    id: 'srs_sarf',
    arabizi: 'Sarf',
    arabic: 'الصَّرْفْ',
    translation: {
      fr: 'Monnaie / Pièces',
      en: 'Change / Coins',
      es: 'Cambio / Monedas',
      ar: 'صرف'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'CircleDollarSign' },
    example: {
      arabizi: 'Wesh 3endek s-sarf?',
      arabic: 'واش عندك الصرف؟',
      translation: {
        fr: 'As-tu de la monnaie ?',
        en: 'Do you have change?',
        es: '¿Tienes cambio?',
        ar: 'هل لديك صرف؟'
      }
    }
  },
  {
    id: 'srs_akher_taman',
    arabizi: 'Akher taman',
    arabic: 'آخِرْ تَمَانْ',
    translation: {
      fr: 'Le dernier prix',
      en: 'The last price',
      es: 'El último precio',
      ar: 'آخر ثمن'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'BadgeCent' },
    example: {
      arabizi: 'Shnu akher taman?',
      arabic: 'شنو آخر ثمن؟',
      translation: {
        fr: 'Quel est le dernier prix ?',
        en: 'What is the last price?',
        es: '¿Cuál es el último precio?',
        ar: 'ما هو آخر ثمن؟'
      }
    }
  },
  {
    id: 'srs_zwin',
    arabizi: 'Zwin',
    arabic: 'زْوِينْ',
    translation: {
      fr: 'Beau / Joli (masc)',
      en: 'Beautiful / Nice (masc)',
      es: 'Bonito (masc)',
      ar: 'جميل'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Sparkles' },
    example: {
      arabizi: 'Had s-sebbat zwin',
      arabic: 'هاد الصباط زوين',
      translation: {
        fr: 'Ces chaussures sont belles',
        en: 'These shoes are nice',
        es: 'Estos zapatos son bonitos',
        ar: 'هذا الحذاء جميل'
      }
    }
  },
  {
    id: 'srs_zwina',
    arabizi: 'Zwina',
    arabic: 'زْوِينَة',
    translation: {
      fr: 'Belle / Jolie (fém)',
      en: 'Beautiful / Nice (fem)',
      es: 'Bonita (fem)',
      ar: 'جميلة'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Star' },
    example: {
      arabizi: 'Jellaba zwina',
      arabic: 'جلابة زوينة',
      translation: {
        fr: 'Une belle djellaba',
        en: 'A beautiful djellaba',
        es: 'Una bonita chilaba',
        ar: 'جلابة جميلة'
      }
    }
  },
  {
    id: 'srs_kbir',
    arabizi: 'Kbir',
    arabic: 'كْبِيرْ',
    translation: {
      fr: 'Grand',
      en: 'Big / Large',
      es: 'Grande',
      ar: 'كبير'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Maximize' },
    example: {
      arabizi: 'Hada kbir bzzaf',
      arabic: 'هادا كبير بزاف',
      translation: {
        fr: 'C\'est trop grand',
        en: 'This is too big',
        es: 'Esto es demasiado grande',
        ar: 'هذا كبير جدا'
      }
    }
  },
  {
    id: 'srs_sghir',
    arabizi: 'Sghir',
    arabic: 'صْغِيرْ',
    translation: {
      fr: 'Petit',
      en: 'Small',
      es: 'Pequeño',
      ar: 'صغير'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Minimize' },
    example: {
      arabizi: '3tini wahed sghir',
      arabic: 'عطيني واحد صغير',
      translation: {
        fr: 'Donne-moi un petit',
        en: 'Give me a small one',
        es: 'Dame uno pequeño',
        ar: 'أعطني واحدا صغيرا'
      }
    }
  },
  {
    id: 'srs_zerbiya',
    arabizi: 'Zerbiya',
    arabic: 'زَرْبِيَّة',
    translation: {
      fr: 'Tapis',
      en: 'Carpet',
      es: 'Alfombra',
      ar: 'زربية'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Layout' },
    example: {
      arabizi: 'Bghit nchri zerbiya',
      arabic: 'بغيت نشري زربية',
      translation: {
        fr: 'Je veux acheter un tapis',
        en: 'I want to buy a carpet',
        es: 'Quiero comprar una alfombra',
        ar: 'أريد شراء زربية'
      }
    }
  },
  {
    id: 'srs_belgha',
    arabizi: 'Belgha',
    arabic: 'بَلْغَة',
    translation: {
      fr: 'Babouche',
      en: 'Babouche (shoes)',
      es: 'Babucha',
      ar: 'بلغة'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Footprints' },
    example: {
      arabizi: 'Belgha fs-sfar',
      arabic: 'بلغة ف الصفر',
      translation: {
        fr: 'Babouche en jaune',
        en: 'Babouche in yellow',
        es: 'Babucha en amarillo',
        ar: 'بلغة صفراء'
      }
    }
  },
  {
    id: 'srs_jellaba',
    arabizi: 'Jellaba',
    arabic: 'جَلَّابَة',
    translation: {
      fr: 'Djellaba',
      en: 'Djellaba',
      es: 'Chilaba',
      ar: 'جلابة'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'Shirt' },
    example: {
      arabizi: 'Jellaba maghribiya',
      arabic: 'جلابة مغربية',
      translation: {
        fr: 'Djellaba marocaine',
        en: 'Moroccan djellaba',
        es: 'Chilaba marroquí',
        ar: 'جلابة مغربية'
      }
    }
  },
  {
    id: 'srs_chrit',
    arabizi: 'Chri-t',
    arabic: 'شْرِيتْ',
    translation: {
      fr: 'J\'ai acheté',
      en: 'I bought',
      es: 'Compré',
      ar: 'اشتريت'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'ShoppingBag' },
    example: {
      arabizi: 'Chri-t hada l-bare7',
      arabic: 'شريت هادا البارح',
      translation: {
        fr: 'J\'ai acheté ça hier',
        en: 'I bought this yesterday',
        es: 'Compré esto ayer',
        ar: 'اشتريت هذا البارحة'
      }
    }
  },
  {
    id: 'srs_baraka',
    arabizi: 'Baraka',
    arabic: 'بَرَكَة',
    translation: {
      fr: 'Ça suffit / C\'est assez',
      en: 'That\'s enough',
      es: 'Basta / Es suficiente',
      ar: 'كفى'
    },
    category: 'souk_shopping',
    illustration: { iconName: 'StopCircle' },
    example: {
      arabizi: 'Baraka 3afak',
      arabic: 'بركة عفاك',
      translation: {
        fr: 'Ça suffit s\'il te plaît',
        en: 'That\'s enough please',
        es: 'Basta por favor',
        ar: 'كفى من فضلك'
      }
    }
  },
  {
    id: 'srs_dar',
    arabizi: 'Dar',
    arabic: 'دَارْ',
    translation: {
      fr: 'Maison',
      en: 'House',
      es: 'Casa',
      ar: 'دار'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Home' },
    example: {
      arabizi: 'Dar kbira',
      arabic: 'دار كبيرة',
      translation: {
        fr: 'Grande maison',
        en: 'Big house',
        es: 'Casa grande',
        ar: 'منزل كبير'
      }
    }
  },
  {
    id: 'srs_riad',
    arabizi: 'Riad',
    arabic: 'رِيَاضْ',
    translation: {
      fr: 'Riad',
      en: 'Riad (Traditional house)',
      es: 'Riad',
      ar: 'رياض'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Home' },
    example: {
      arabizi: 'Riad zwin f l-medina',
      arabic: 'رياض زوين ف لمدينة',
      translation: {
        fr: 'Un beau riad dans la médina',
        en: 'A beautiful riad in the medina',
        es: 'Un hermoso riad en la medina',
        ar: 'رياض جميل في المدينة'
      }
    }
  },
  {
    id: 'srs_bit',
    arabizi: 'Bit',
    arabic: 'بِيتْ',
    translation: {
      fr: 'Chambre',
      en: 'Room',
      es: 'Habitación',
      ar: 'غرفة'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Bed' },
    example: {
      arabizi: 'Bit n3as',
      arabic: 'بيت النعاس',
      translation: {
        fr: 'Chambre à coucher',
        en: 'Bedroom',
        es: 'Dormitorio',
        ar: 'غرفة النوم'
      }
    }
  },
  {
    id: 'srs_sarout',
    arabizi: 'Sarout',
    arabic: 'سَارُوتْ',
    translation: {
      fr: 'Clé',
      en: 'Key',
      es: 'Llave',
      ar: 'مفتاح'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Key' },
    example: {
      arabizi: '3tini s-sarout',
      arabic: 'عطيني الساروت',
      translation: {
        fr: 'Donne-moi la clé',
        en: 'Give me the key',
        es: 'Dame la llave',
        ar: 'أعطني المفتاح'
      }
    }
  },
  {
    id: 'srs_lkra',
    arabizi: 'L-kra',
    arabic: 'الكْرَا',
    translation: {
      fr: 'Le loyer',
      en: 'The rent',
      es: 'El alquiler',
      ar: 'الكراء'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Banknote' },
    example: {
      arabizi: 'Khelest l-kra',
      arabic: 'خلصت الكرا',
      translation: {
        fr: 'J\'ai payé le loyer',
        en: 'I paid the rent',
        es: 'He pagado el alquiler',
        ar: 'دفعت الإيجار'
      }
    }
  },
  {
    id: 'srs_dman',
    arabizi: 'Dman',
    arabic: 'الضْمَانْ',
    translation: {
      fr: 'La caution',
      en: 'The deposit',
      es: 'La fianza',
      ar: 'الضمان'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Shield' },
    example: {
      arabizi: 'Dman ghali',
      arabic: 'الضمان غالي',
      translation: {
        fr: 'La caution est chère',
        en: 'The deposit is expensive',
        es: 'La fianza es cara',
        ar: 'الضمان غال'
      }
    }
  },
  {
    id: 'srs_moul_ddar',
    arabizi: 'Moul d-dar',
    arabic: 'مُولْ الدَّارْ',
    translation: {
      fr: 'Le propriétaire',
      en: 'The owner',
      es: 'El propietario',
      ar: 'صاحب الدار'
    },
    category: 'housing_riad',
    illustration: { iconName: 'UserCircle' },
    example: {
      arabizi: 'Moul d-dar mzyan',
      arabic: 'مول الدار مزيان',
      translation: {
        fr: 'Le propriétaire est gentil',
        en: 'The owner is nice',
        es: 'El propietario es amable',
        ar: 'صاحب المنزل جيد'
      }
    }
  },
  {
    id: 'srs_lberd',
    arabizi: 'L-berd',
    arabic: 'البَرْدْ',
    translation: {
      fr: 'Climatisation / Frais',
      en: 'AC / Cold',
      es: 'Aire acondicionado / Frío',
      ar: 'البرد'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Wind' },
    example: {
      arabizi: 'Kayn l-berd hna',
      arabic: 'كاين البرد هنا',
      translation: {
        fr: 'Il fait froid ici',
        en: 'It is cold here',
        es: 'Hace frío aquí',
        ar: 'الجو بارد هنا'
      }
    }
  },
  {
    id: 'srs_sskhona',
    arabizi: 'S-skhona',
    arabic: 'السّْخُونَة',
    translation: {
      fr: 'Chauffage / Chaleur',
      en: 'Heating / Heat',
      es: 'Calefacción / Calor',
      ar: 'السخونة'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Flame' },
    example: {
      arabizi: 'S-skhona bzzaf l-youm',
      arabic: 'السخونة بزاف اليوم',
      translation: {
        fr: 'Il fait très chaud aujourd\'hui',
        en: 'It is very hot today',
        es: 'Hace mucho calor hoy',
        ar: 'الجو حار جدا اليوم'
      }
    }
  },
  {
    id: 'srs_sstah',
    arabizi: 'S-stah',
    arabic: 'السّْطَحْ',
    translation: {
      fr: 'La terrasse / toit',
      en: 'Terrace / Roof',
      es: 'Terraza / Tejado',
      ar: 'السطح'
    },
    category: 'housing_riad',
    illustration: { iconName: 'LayoutPanelTop' },
    example: {
      arabizi: 'Ntl3o l s-stah',
      arabic: 'نطلعو ل السطح',
      translation: {
        fr: 'Montons sur la terrasse',
        en: 'Let\'s go up to the roof',
        es: 'Subamos a la terraza',
        ar: 'لنصعد إلى السطح'
      }
    }
  },
  {
    id: 'srs_lmoushkil',
    arabizi: 'L-moushkil',
    arabic: 'المُشْكِيلْ',
    translation: {
      fr: 'Le problème',
      en: 'The problem',
      es: 'El problema',
      ar: 'المشكل'
    },
    category: 'housing_riad',
    illustration: { iconName: 'AlertTriangle' },
    example: {
      arabizi: '3endi moushkil',
      arabic: 'عندي مشكيل',
      translation: {
        fr: 'J\'ai un problème',
        en: 'I have a problem',
        es: 'Tengo un problema',
        ar: 'لدي مشكلة'
      }
    }
  },
  {
    id: 'srs_kheddam',
    arabizi: 'Kheddam',
    arabic: 'خَدَّامْ',
    translation: {
      fr: 'Ça fonctionne',
      en: 'It works',
      es: 'Funciona',
      ar: 'شغال'
    },
    category: 'housing_riad',
    illustration: { iconName: 'CheckCircle' },
    example: {
      arabizi: 'Dou kheddam',
      arabic: 'الضو خدام',
      translation: {
        fr: 'L\'électricité fonctionne',
        en: 'The electricity is working',
        es: 'La luz funciona',
        ar: 'الكهرباء شغالة'
      }
    }
  },
  {
    id: 'srs_khaser',
    arabizi: 'Khaser',
    arabic: 'خَاسِرْ',
    translation: {
      fr: 'En panne',
      en: 'Broken',
      es: 'Estropeado',
      ar: 'عطلان'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Wrench' },
    example: {
      arabizi: 'Tele khasra',
      arabic: 'التلفازة خاسرة',
      translation: {
        fr: 'La télé est en panne',
        en: 'The TV is broken',
        es: 'La televisión está estropeada',
        ar: 'التلفاز معطل'
      }
    }
  },
  {
    id: 'srs_nqi',
    arabizi: 'Nqi',
    arabic: 'نْقِي',
    translation: {
      fr: 'Propre',
      en: 'Clean',
      es: 'Limpio',
      ar: 'نقي'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Sparkles' },
    example: {
      arabizi: 'Bit nqi',
      arabic: 'بيت نقي',
      translation: {
        fr: 'Chambre propre',
        en: 'Clean room',
        es: 'Habitación limpia',
        ar: 'غرفة نظيفة'
      }
    }
  },
  {
    id: 'srs_moussek',
    arabizi: 'Moussek',
    arabic: 'مْوَسَّخْ',
    translation: {
      fr: 'Sale',
      en: 'Dirty',
      es: 'Sucio',
      ar: 'موسخ'
    },
    category: 'housing_riad',
    illustration: { iconName: 'Trash2' },
    example: {
      arabizi: 'L-kachkoula mouskha',
      arabic: 'الكشكولة موسخة',
      translation: {
        fr: 'L\'écharpe est sale',
        en: 'The scarf is dirty',
        es: 'La bufanda está sucia',
        ar: 'الوشاح متسخ'
      }
    }
  },
  {
    id: 'srs_farmasiyan',
    arabizi: 'Farmasiyan',
    arabic: 'فَرْمَسْيَانْ',
    translation: {
      fr: 'Pharmacie',
      en: 'Pharmacy',
      es: 'Farmacia',
      ar: 'صيدلية'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Pill' },
    example: {
      arabizi: 'Fin jat l-farmasiyan?',
      arabic: 'فين جات الفرمسيان؟',
      translation: {
        fr: 'Où se trouve la pharmacie ?',
        en: 'Where is the pharmacy?',
        es: '¿Dónde está la farmacia?',
        ar: 'أين توجد الصيدلية؟'
      }
    }
  },
  {
    id: 'srs_tbib',
    arabizi: 'Tbib',
    arabic: 'طْبِيبْ',
    translation: {
      fr: 'Médecin',
      en: 'Doctor',
      es: 'Médico',
      ar: 'طبيب'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Stethoscope' },
    example: {
      arabizi: 'Khasni nchouf tbib',
      arabic: 'خصني نشوف طبيب',
      translation: {
        fr: 'Je dois voir un médecin',
        en: 'I need to see a doctor',
        es: 'Necesito ver a un médico',
        ar: 'يجب أن أرى طبيبا'
      }
    }
  },
  {
    id: 'srs_sbitar',
    arabizi: 'Sbitar',
    arabic: 'سْبِيطَارْ',
    translation: {
      fr: 'Hôpital',
      en: 'Hospital',
      es: 'Hospital',
      ar: 'مستشفى'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Building' },
    example: {
      arabizi: 'Sbitar qrib',
      arabic: 'سبيطار قريب',
      translation: {
        fr: 'Hôpital proche',
        en: 'Near hospital',
        es: 'Hospital cercano',
        ar: 'مستشفى قريب'
      }
    }
  },
  {
    id: 'srs_awenni',
    arabizi: '3awenni',
    arabic: 'عَاوْنِّي',
    translation: {
      fr: 'Aidez-moi',
      en: 'Help me',
      es: 'Ayúdeme',
      ar: 'عاوني'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'LifeBuoy' },
    example: {
      arabizi: '3awenni 3afak',
      arabic: 'عاوني عفاك',
      translation: {
        fr: 'Aidez-moi s\'il vous plaît',
        en: 'Help me please',
        es: 'Ayúdeme por favor',
        ar: 'ساعدني من فضلك'
      }
    }
  },
  {
    id: 'srs_ddwa',
    arabizi: 'D-dwa',
    arabic: 'الدّْوَا',
    translation: {
      fr: 'Le médicament',
      en: 'The medicine',
      es: 'El medicamento',
      ar: 'الدواء'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Syringe' },
    example: {
      arabizi: 'Bghit d-dwa',
      arabic: 'بغيت الدوا',
      translation: {
        fr: 'Je veux le médicament',
        en: 'I want the medicine',
        es: 'Quiero el medicamento',
        ar: 'أريد الدواء'
      }
    }
  },
  {
    id: 'srs_darni_rasi',
    arabizi: 'Darni rasi',
    arabic: 'ضَرْنِي رَاسِي',
    translation: {
      fr: 'J\'ai mal à la tête',
      en: 'I have a headache',
      es: 'Me duele la cabeza',
      ar: 'ضرني راسي'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Frown' },
    example: {
      arabizi: 'Darni rasi bzzaf',
      arabic: 'ضرني راسي بزاف',
      translation: {
        fr: 'J\'ai très mal à la tête',
        en: 'I have a bad headache',
        es: 'Me duele mucho la cabeza',
        ar: 'ألم شديد في الرأس'
      }
    }
  },
  {
    id: 'srs_lkrash',
    arabizi: 'L-krash',
    arabic: 'الكْرْشْ',
    translation: {
      fr: 'Le ventre / estomac',
      en: 'The belly / stomach',
      es: 'El vientre / estómago',
      ar: 'الكرش'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Activity' },
    example: {
      arabizi: 'Dratni kershi',
      arabic: 'ضراتني كرشي',
      translation: {
        fr: 'J\'ai mal au ventre',
        en: 'My stomach hurts',
        es: 'Me duele la barriga',
        ar: 'تؤلمني معدتي'
      }
    }
  },
  {
    id: 'srs_bolis',
    arabizi: 'Bolis',
    arabic: 'البُولِيسْ',
    translation: {
      fr: 'La police',
      en: 'The police',
      es: 'La policía',
      ar: 'البوليس'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'ShieldAlert' },
    example: {
      arabizi: '3eyet l-bolis',
      arabic: 'عيط ل البوليس',
      translation: {
        fr: 'Appelle la police',
        en: 'Call the police',
        es: 'Llama a la policía',
        ar: 'اتصل بالشرطة'
      }
    }
  },
  {
    id: 'srs_daba',
    arabizi: 'Daba',
    arabic: 'دَابَا',
    translation: {
      fr: 'Maintenant',
      en: 'Now',
      es: 'Ahora',
      ar: 'دابا'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Clock' },
    example: {
      arabizi: 'Daba awla b3din?',
      arabic: 'دابا اولا بعدين؟',
      translation: {
        fr: 'Maintenant ou plus tard ?',
        en: 'Now or later?',
        es: '¿Ahora o más tarde?',
        ar: 'الآن أو لاحقا؟'
      }
    }
  },
  {
    id: 'srs_ghedda',
    arabizi: 'Ghedda',
    arabic: 'غَدًّا',
    translation: {
      fr: 'Demain',
      en: 'Tomorrow',
      es: 'Mañana',
      ar: 'غدا'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'CalendarDays' },
    example: {
      arabizi: 'Nchoufek ghedda',
      arabic: 'نشوفك غدا',
      translation: {
        fr: 'Je te vois demain',
        en: 'See you tomorrow',
        es: 'Te veo mañana',
        ar: 'أراك غدا'
      }
    }
  },
  {
    id: 'srs_lbareh',
    arabizi: 'L-bare7',
    arabic: 'البَارِحْ',
    translation: {
      fr: 'Hier',
      en: 'Yesterday',
      es: 'Ayer',
      ar: 'البارح'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'CalendarClock' },
    example: {
      arabizi: 'Kunt mrid l-bare7',
      arabic: 'كنت مريض البارح',
      translation: {
        fr: 'J\'étais malade hier',
        en: 'I was sick yesterday',
        es: 'Ayer estuve enfermo',
        ar: 'كنت مريضا البارحة'
      }
    }
  },
  {
    id: 'srs_shwiya',
    arabizi: 'Shwiya',
    arabic: 'شْوِيَّة',
    translation: {
      fr: 'Un peu / Lentement',
      en: 'A little / Slowly',
      es: 'Un poco / Despacio',
      ar: 'شوية'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'TrendingDown' },
    example: {
      arabizi: 'Sog shwiya 3afak',
      arabic: 'صوك شوية عفاك',
      translation: {
        fr: 'Conduis doucement s\'il te plaît',
        en: 'Drive slowly please',
        es: 'Conduce despacio por favor',
        ar: 'قد ببطء من فضلك'
      }
    }
  },
  {
    id: 'srs_bzzaf',
    arabizi: 'Bzzaf',
    arabic: 'بْزَّافْ',
    translation: {
      fr: 'Beaucoup',
      en: 'A lot / Much',
      es: 'Mucho',
      ar: 'بزاف'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'TrendingUp' },
    example: {
      arabizi: 'Mrid bzzaf',
      arabic: 'مريض بزاف',
      translation: {
        fr: 'Très malade',
        en: 'Very sick',
        es: 'Muy enfermo',
        ar: 'مريض جدا'
      }
    }
  },
  {
    id: 'srs_waqt',
    arabizi: 'Waqt',
    arabic: 'وَقْتْ',
    translation: {
      fr: 'L\'heure / le temps',
      en: 'Time',
      es: 'Tiempo',
      ar: 'وقت'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'Timer' },
    example: {
      arabizi: 'Ma-3endich l-waqt',
      arabic: 'ما عنديش الوقت',
      translation: {
        fr: 'Je n\'ai pas le temps',
        en: 'I don\'t have time',
        es: 'No tengo tiempo',
        ar: 'ليس لدي وقت'
      }
    }
  },
  {
    id: 'srs_mzyan',
    arabizi: 'Mzyan',
    arabic: 'مْزْيَانْ',
    translation: {
      fr: 'Bien / Parfait',
      en: 'Good / Perfect',
      es: 'Bien / Perfecto',
      ar: 'مزيان'
    },
    category: 'urgencies_health',
    illustration: { iconName: 'ThumbsUp' },
    example: {
      arabizi: 'Kulshi mzyan',
      arabic: 'كلشي مزيان',
      translation: {
        fr: 'Tout va bien',
        en: 'Everything is good',
        es: 'Todo está bien',
        ar: 'كل شيء على ما يرام'
      }
    }
  },
];


export const getWordFromDictionary = (id: string): VocabularySRSData | undefined => { return srsVocabulary.find(w => w.id === id); };

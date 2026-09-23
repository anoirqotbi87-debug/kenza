import { MultiLangText } from '../types/curriculum';
import { CardIllustration } from '../types/srs';

export interface SRSDictionaryItem {
  id: string;
  arabizi: string;
  arabic: string;
  translation: MultiLangText;
  illustration?: CardIllustration;
  category?: 'cafe_resto' | 'taxi_transport' | 'souk_shopping' | 'polite_social' | 'housing_riad' | 'urgencies_health';
  example?: {
    arabizi: string;
    arabic: string;
    translation: MultiLangText;
  };
}

export const srsVocabulary: SRSDictionaryItem[] = [
  {
    id: 'srs_3afak',
    arabizi: '3afak',
    arabic: 'عفاك',
    translation: { fr: 'S\'il te plaît', en: 'Please', es: 'Por favor', ar: 'من فضلك' },
    illustration: { iconName: 'HandHeart' },
    example: { arabizi: '3tini lma 3afak', arabic: 'عطيني الما عفاك', translation: { fr: 'Donne-moi de l\'eau s\'il te plaît', en: 'Give me water please', es: 'Dame agua por favor', ar: 'أعطني الماء من فضلك' } },
    category: 'polite_social',
  },
  {
    id: 'srs_salam',
    arabizi: 'Salam',
    arabic: 'سلام',
    translation: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحباً' },
    illustration: { iconName: 'Hand' },
    example: { arabizi: 'Salam, labas?', arabic: 'سلام، لاباس؟', translation: { fr: 'Bonjour, ça va ?', en: 'Hello, how are you?', es: 'Hola, ¿qué tal?', ar: 'مرحباً، كيف حالك؟' } },
    category: 'polite_social',
  },
  {
    id: 'srs_9hwa',
    arabizi: '9hwa',
    arabic: 'قهوة',
    translation: { fr: 'Café', en: 'Coffee', es: 'Café', ar: 'قهوة' },
    illustration: { iconName: 'Coffee' },
    example: { arabizi: 'Bghit 9hwa', arabic: 'بغيت قهوة', translation: { fr: 'Je veux un café', en: 'I want a coffee', es: 'Quiero un café', ar: 'أريد قهوة' } },
    category: 'cafe_resto',
  },
  {
    id: 'srs_atay',
    arabizi: 'Atay',
    arabic: 'أتاي',
    translation: { fr: 'Thé', en: 'Tea', es: 'Té', ar: 'شاي' },
    illustration: { iconName: 'CupSoda' },
    example: { arabizi: 'Kass atay b n3na3', arabic: 'كاس أتاي بالنعناع', translation: { fr: 'Un verre de thé à la menthe', en: 'A glass of mint tea', es: 'Un vaso de té con menta', ar: 'كأس شاي بالنعناع' } },
    category: 'cafe_resto',
  },
  {
    id: 'srs_lma',
    arabizi: 'Lma',
    arabic: 'الماء',
    translation: { fr: 'Eau', en: 'Water', es: 'Agua', ar: 'ماء' },
    illustration: { iconName: 'Droplets' },
    example: { arabizi: 'Bghit nshreb lma', arabic: 'بغيت نشرب الما', translation: { fr: 'Je veux boire de l\'eau', en: 'I want to drink water', es: 'Quiero beber agua', ar: 'أريد أن أشرب الماء' } }
  },
  {
    id: 'srs_shukran',
    arabizi: 'Shukran',
    arabic: 'شكراً',
    translation: { fr: 'Merci', en: 'Thank you', es: 'Gracias', ar: 'شكراً' },
    illustration: { iconName: 'Heart' },
    example: { arabizi: 'Shukran bzzaf', arabic: 'شكراً بزاف', translation: { fr: 'Merci beaucoup', en: 'Thank you very much', es: 'Muchas gracias', ar: 'شكراً جزيلاً' } }
  },
  {
    id: 'srs_lla',
    arabizi: 'Lla',
    arabic: 'لا',
    translation: { fr: 'Non', en: 'No', es: 'No', ar: 'لا' },
    illustration: { iconName: 'X' },
    example: { arabizi: 'Lla shukran', arabic: 'لا شكراً', translation: { fr: 'Non merci', en: 'No thank you', es: 'No gracias', ar: 'لا شكراً' } }
  },
  {
    id: 'srs_iyeh',
    arabizi: 'Iyeh',
    arabic: 'إيه',
    translation: { fr: 'Oui', en: 'Yes', es: 'Sí', ar: 'نعم' },
    illustration: { iconName: 'Check' },
    example: { arabizi: 'Iyeh, mzyan', arabic: 'إيه، مزيان', translation: { fr: 'Oui, c\'est bien', en: 'Yes, it is good', es: 'Sí, está bien', ar: 'نعم، هذا جيد' } }
  },
  {
    id: 'srs_bzzaf',
    arabizi: 'Bzzaf',
    arabic: 'بزاف',
    translation: { fr: 'Beaucoup', en: 'A lot', es: 'Mucho', ar: 'كثيراً' },
    illustration: { iconName: 'Plus' },
    example: { arabizi: 'Ghali bzzaf', arabic: 'غالي بزاف', translation: { fr: 'C\'est très cher', en: 'It is very expensive', es: 'Es muy caro', ar: 'غالي جداً' } }
  },
  {
    id: 'srs_shwiya',
    arabizi: 'Shwiya',
    arabic: 'شوية',
    translation: { fr: 'Un peu', en: 'A little', es: 'Un poco', ar: 'قليلاً' },
    illustration: { iconName: 'Minus' },
    example: { arabizi: 'Shwiya b shwiya', arabic: 'شوية بشوية', translation: { fr: 'Petit à petit', en: 'Little by little', es: 'Poco a poco', ar: 'شيئاً فشيئاً' } }
  },
  {
    id: 'srs_fin',
    arabizi: 'Fin',
    arabic: 'فين',
    translation: { fr: 'Où', en: 'Where', es: 'Dónde', ar: 'أين' },
    illustration: { iconName: 'MapPin' },
    example: { arabizi: 'Fin kaina l-ma7ta?', arabic: 'فين كاينة المحطة؟', translation: { fr: 'Où est la station ?', en: 'Where is the station?', es: '¿Dónde está la estación?', ar: 'أين توجد المحطة؟' } }
  },
  {
    id: 'srs_bghit',
    arabizi: 'Bghit',
    arabic: 'بغيت',
    translation: { fr: 'Je veux', en: 'I want', es: 'Quiero', ar: 'أريد' },
    illustration: { iconName: 'ShoppingBag' },
    example: { arabizi: 'Bghit nshri hada', arabic: 'بغيت نشري هادا', translation: { fr: 'Je veux acheter ça', en: 'I want to buy this', es: 'Quiero comprar esto', ar: 'أريد شراء هذا' } },
    category: 'cafe_resto',
  },
  {
    id: 'srs_flus',
    arabizi: 'Flus',
    arabic: 'فلوس',
    translation: { fr: 'Argent', en: 'Money', es: 'Dinero', ar: 'مال' },
    illustration: { iconName: 'Coins' },
    example: { arabizi: 'Ma 3ndish l-flus', arabic: 'ما عنديش الفلوس', translation: { fr: 'Je n\'ai pas d\'argent', en: 'I do not have money', es: 'No tengo dinero', ar: 'ليس لدي مال' } }
  },
  {
    id: 'srs_lhsab',
    arabizi: 'L-hsab',
    arabic: 'الحساب',
    translation: { fr: 'L\'addition', en: 'The bill', es: 'La cuenta', ar: 'الحساب' },
    illustration: { iconName: 'Receipt' },
    example: { arabizi: 'L-hsab 3afak', arabic: 'الحساب عفاك', translation: { fr: 'L\'addition s\'il vous plaît', en: 'The bill please', es: 'La cuenta por favor', ar: 'الحساب من فضلك' } }
  },
  {
    id: 'srs_dor',
    arabizi: 'Dor',
    arabic: 'دور',
    translation: { fr: 'Tourne', en: 'Turn', es: 'Gira', ar: 'دُر' },
    illustration: { iconName: 'CornerUpRight' },
    example: { arabizi: 'Dor 3la l-imin', arabic: 'دور على ليمن', translation: { fr: 'Tourne à droite', en: 'Turn right', es: 'Gira a la derecha', ar: 'دُر على اليمين' } }
  },
  {
    id: 'srs_wakhed',
    arabizi: 'Wakha',
    arabic: 'واخا',
    translation: { fr: 'D\'accord', en: 'Okay', es: 'De acuerdo', ar: 'حسناً' },
    illustration: { iconName: 'ThumbsUp' },
    example: { arabizi: 'Wakha, machi mouchkil', arabic: 'واخا، ماشي مشكل', translation: { fr: 'D\'accord, pas de problème', en: 'Okay, no problem', es: 'De acuerdo, no hay problema', ar: 'حسناً، لا مشكلة' } }
  },
  {
    id: 'srs_zwin',
    arabizi: 'Zwin',
    arabic: 'زوين',
    translation: { fr: 'Beau / Bon', en: 'Beautiful / Good', es: 'Hermoso / Bueno', ar: 'جميل / جيد' },
    illustration: { iconName: 'Star' },
    example: { arabizi: 'Hadshi zwin', arabic: 'هادشي زوين', translation: { fr: 'C\'est beau', en: 'This is beautiful', es: 'Esto es hermoso', ar: 'هذا جميل' } },
    category: 'polite_social',
  },
  {
    id: 'srs_khobz',
    arabizi: 'Khobz',
    arabic: 'خبز',
    translation: { fr: 'Pain', en: 'Bread', es: 'Pan', ar: 'خبز' },
    illustration: { iconName: 'Croissant' },
    example: { arabizi: 'Bghit nṣs khobza', arabic: 'بغيت نص خبزة', translation: { fr: 'Je veux un demi-pain', en: 'I want half a bread', es: 'Quiero medio pan', ar: 'أريد نصف خبزة' } }
  },
  {
    id: 'srs_mzyan',
    arabizi: 'Mzyan',
    arabic: 'مزيان',
    translation: { fr: 'Bien', en: 'Good', es: 'Bien', ar: 'جيد' },
    illustration: { iconName: 'CheckCircle2' },
    example: { arabizi: 'Kulshi mzyan', arabic: 'كلشي مزيان', translation: { fr: 'Tout va bien', en: 'Everything is good', es: 'Todo está bien', ar: 'كل شيء جيد' } }
  },
  {
    id: 'srs_daba',
    arabizi: 'Daba',
    arabic: 'دابا',
    translation: { fr: 'Maintenant', en: 'Now', es: 'Ahora', ar: 'الآن' },
    illustration: { iconName: 'Clock' },
    example: { arabizi: 'Bghitha daba', arabic: 'بغيتها دابا', translation: { fr: 'Je la veux maintenant', en: 'I want it now', es: 'Lo quiero ahora', ar: 'أريدها الآن' } }
  },
  {
    id: 'srs_ghedda',
    arabizi: 'Ghedda',
    arabic: 'غدا',
    translation: { fr: 'Demain', en: 'Tomorrow', es: 'Mañana', ar: 'غداً' },
    illustration: { iconName: 'Calendar' },
    example: { arabizi: 'Nshufek ghedda', arabic: 'نشوفك غدا', translation: { fr: 'On se voit demain', en: 'See you tomorrow', es: 'Nos vemos mañana', ar: 'أراك غداً' } }
  },
  {
    id: 'srs_lyoum',
    arabizi: 'Lyoum',
    arabic: 'اليوم',
    translation: { fr: 'Aujourd\'hui', en: 'Today', es: 'Hoy', ar: 'اليوم' },
    illustration: { iconName: 'CalendarDays' },
    example: { arabizi: 'Ash ghandirou lyoum?', arabic: 'أش غنديرو اليوم؟', translation: { fr: 'Qu\'est-ce qu\'on fait aujourd\'hui ?', en: 'What are we doing today?', es: '¿Qué hacemos hoy?', ar: 'ماذا سنفعل اليوم؟' } }
  },
  {
    id: 'srs_machi',
    arabizi: 'Machi',
    arabic: 'ماشي',
    translation: { fr: 'Pas (Négation)', en: 'Not', es: 'No (Negación)', ar: 'ليس' },
    illustration: { iconName: 'Ban' },
    example: { arabizi: 'Machi mouchkil', arabic: 'ماشي مشكل', translation: { fr: 'Pas de problème', en: 'No problem', es: 'No hay problema', ar: 'ليس مشكلة' } }
  },
  {
    id: 'srs_chhal',
    arabizi: 'Chhal',
    arabic: 'شحال',
    translation: { fr: 'Combien', en: 'How much', es: 'Cuánto', ar: 'بكم / كم' },
    illustration: { iconName: 'HelpCircle' },
    example: { arabizi: 'Chhal hada?', arabic: 'شحال هادا؟', translation: { fr: 'C\'est combien ?', en: 'How much is this?', es: '¿Cuánto es esto?', ar: 'بكم هذا؟' } }
  },
  {
    id: 'srs_dyal',
    arabizi: 'Dyal',
    arabic: 'ديال',
    translation: { fr: 'De (Appartenance)', en: 'Of / Belonging to', es: 'De (Pertenencia)', ar: 'ديال / خاص بـ' },
    illustration: { iconName: 'Link' },
    example: { arabizi: 'Dar dyali', arabic: 'دار ديالي', translation: { fr: 'Ma maison (La maison de moi)', en: 'My house', es: 'Mi casa', ar: 'بيتي' } }
  }
];

export function getWordFromDictionary(id: string): SRSDictionaryItem | undefined {
  return srsVocabulary.find(w => w.id === id);
}

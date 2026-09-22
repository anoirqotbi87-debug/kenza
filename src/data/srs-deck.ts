import { MultiLangText } from '../types/curriculum';
import { CardIllustration } from '../types/srs';

export interface SRSDictionaryItem {
  id: string;
  arabizi: string;
  arabic: string;
  translation: MultiLangText;
  illustration?: CardIllustration;
}

export const srsVocabulary: SRSDictionaryItem[] = [
  {
    id: 'w_3afak',
    arabizi: '3afak',
    arabic: 'عفاك',
    translation: { fr: 'S\'il te plaît', en: 'Please', es: 'Por favor', ar: 'من فضلك' },
    illustration: { iconName: 'HandHeart' }
  },
  {
    id: 'w_salam',
    arabizi: 'Salam',
    arabic: 'سلام',
    translation: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحباً' },
    illustration: { iconName: 'Hand' }
  },
  {
    id: 'w_9hwa',
    arabizi: '9hwa',
    arabic: 'قهوة',
    translation: { fr: 'Café', en: 'Coffee', es: 'Café', ar: 'قهوة' },
    illustration: { iconName: 'Coffee' }
  },
  {
    id: 'w_atay',
    arabizi: 'Atay',
    arabic: 'أتاي',
    translation: { fr: 'Thé', en: 'Tea', es: 'Té', ar: 'شاي' },
    illustration: { iconName: 'CupSoda' }
  },
  {
    id: 'w_lma',
    arabizi: 'Lma',
    arabic: 'الماء',
    translation: { fr: 'Eau', en: 'Water', es: 'Agua', ar: 'ماء' },
    illustration: { iconName: 'Droplets' }
  }
];

export function getWordFromDictionary(id: string): SRSDictionaryItem | undefined {
  return srsVocabulary.find(w => w.id === id);
}

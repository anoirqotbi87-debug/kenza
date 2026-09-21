import { MultiLangText } from '../../types/curriculum';
import { UILanguage } from './translations';

export function getLocalizedText(
  text: MultiLangText | string | undefined, 
  lang: UILanguage, 
  fallback: UILanguage = 'fr'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text[fallback] || Object.values(text)[0] || '';
}

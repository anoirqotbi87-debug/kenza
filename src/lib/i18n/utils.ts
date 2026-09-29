import { MultiLangText } from '../../types/curriculum';
import { UILanguage } from './translations';

export function getLocalizedText(
  text: MultiLangText | string | undefined, 
  lang: UILanguage, 
  fallback: UILanguage = 'fr'
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  if (lang === 'es' && !text.es) {
    console.warn(`[i18n Warning] Traduction espagnole manquante pour :`, text);
  }
  
  return text[lang] || text[fallback] || Object.values(text)[0] || '';
}

/**
 * Retourne la locale BCP-47 correspondant à la langue d'interface,
 * afin d'éviter les dates codées en dur (ex : 'fr-FR').
 */
export function getDateLocale(lang: string | undefined): string {
  switch (lang) {
    case 'en': return 'en-US';
    case 'es': return 'es-ES';
    case 'ar': return 'ar-MA';
    case 'fr':
    default: return 'fr-FR';
  }
}

export function getExerciseText(item: any, lang: string = 'fr'): string {
  if (item === null || item === undefined) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);

  // 1. Clés directes de dialecte et de texte
  const candidate = 
    item.arabizi || 
    item.text || 
    item.word || 
    item.label || 
    item.value || 
    item.darija || 
    item.arabic;

  if (typeof candidate === 'string') return candidate;
  if (typeof candidate === 'object') {
    return candidate[lang] || candidate.arabizi || candidate.fr || candidate.en || Object.values(candidate)[0] || '';
  }

  // 2. Objet multilingue direct { fr: '...', en: '...', arabizi: '...' }
  if (item[lang]) return String(item[lang]);
  if (item.arabizi) return String(item.arabizi);
  if (item.fr) return String(item.fr);

  // 3. Fallback : première chaîne trouvée dans l'objet
  const firstStr = Object.values(item).find(v => typeof v === 'string' && v.length > 0 && !v.startsWith('http') && v !== item.id);
  if (firstStr) return String(firstStr);

  return JSON.stringify(item);
}

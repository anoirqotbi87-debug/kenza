import type { MultiLangText } from '../../types/curriculum';

/** Saisit une chaîne localisée MultiLangText avec repli fr. */
export function localize(m: MultiLangText | { fr: string }, lang: string): string {
  const key = lang === 'fr' || lang === 'en' || lang === 'es' || lang === 'ar' ? lang : 'fr';
  const value = (m as MultiLangText)[key as keyof MultiLangText];
  return value ?? m.fr ?? '';
}

/**
 * Détecte un chiffre Arabizi (2, 3, 5, 7, 9) ou le son kh (= 5) dans un token.
 * Sert à proposer l'ouverture du guide phonétique depuis le Tap-to-Inspect.
 */
export function detectArabiziDigit(text: string): string | undefined {
  const digit = text.match(/[23579]/);
  if (digit) return digit[0];
  if (/kh/i.test(text)) return '5';
  return undefined;
}

/** Nombre de tours visibles selon la progression (1 = première bulle affichée). */
export function getVisibleTurnCount(selectedIndex: number): number {
  return selectedIndex + 1;
}
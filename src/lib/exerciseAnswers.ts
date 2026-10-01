import type { Exercise } from '../types/curriculum';

/**
 * Reponses valides d'un exercice a choix : la reponse de reference (`answer`)
 * suivie des variantes declarees (`acceptedAnswers`).
 *
 * Renvoie une liste vide pour les `reorder` et les `matching` : leur `answer`
 * n'est pas une option a choisir (liste d'ids ordonnee, ou table d'associations),
 * mais une structure — l'ordre ou l'appariement fait la reponse.
 */
export function getAcceptedAnswers(exercise: Exercise): string[] {
  const ids: string[] = [];
  if (typeof exercise.answer === 'string') ids.push(exercise.answer);
  for (const variant of exercise.acceptedAnswers ?? []) ids.push(variant);

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const id of ids) {
    if (!id || !id.trim()) continue;
    const key = id.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(id.trim());
  }
  return unique;
}

/**
 * La reponse de l'apprenant est-elle juste ? Accepte la reponse de reference
 * comme toute variante declaree, sans tenir compte de la casse ni des espaces.
 */
export function isAcceptedAnswer(exercise: Exercise, selectedId: string | null | undefined): boolean {
  if (!selectedId || !selectedId.trim()) return false;
  const selected = selectedId.trim().toLowerCase();
  return getAcceptedAnswers(exercise).some((id) => id.toLowerCase() === selected);
}

/**
 * L'ordre propose est-il celui attendu ? Sert aux exercices `reorder`, ou
 * `answer` est la suite d'ids dans le bon ordre. L'ordre fait la reponse : on
 * compare donc position par position, et non comme un ensemble.
 *
 * Partage par la validation du runner et par la correction visuelle, pour que
 * « compte juste » et « affiche juste » ne puissent pas diverger.
 */
export function isAcceptedOrder(exercise: Exercise, orderedIds: string[]): boolean {
  if (!Array.isArray(exercise.answer)) return false;
  const expected = exercise.answer as string[];
  return orderedIds.length === expected.length && orderedIds.every((id, i) => id === expected[i]);
}

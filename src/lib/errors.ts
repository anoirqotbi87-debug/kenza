/**
 * Normalise une valeur capturée dans un `catch` en message affichable.
 *
 * `catch` reçoit un `unknown` : accéder à `.message` directement obligeait à
 * annoter la variable en `any`, ce qui désactivait tout contrôle de type sur le
 * reste de la route.
 */
export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

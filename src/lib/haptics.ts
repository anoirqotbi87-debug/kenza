/**
 * Retours haptiques légers (vibration) pour renforcer le feedback d'évaluation
 * des cartes SRS. Utilise l'API Vibration si disponible ; no-op sinon.
 * Les motifs courts et distincts différencient le succès de l'erreur.
 */
const SUCCESS_PATTERN = [24, 42, 46];
const ERROR_PATTERN = [70, 50, 70];

const canVibrate = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export const hapticSuccess = (): void => {
  if (canVibrate()) navigator.vibrate(SUCCESS_PATTERN);
};

export const hapticError = (): void => {
  if (canVibrate()) navigator.vibrate(ERROR_PATTERN);
};
/**
 * Quota d'écoutes audio pour les utilisateurs gratuits.
 *
 * L'écoute est la valeur centrale de l'apprentissage de la darija : l'illimité
 * est réservé aux abonnés. Le compteur est journalier (clé par date) et vit
 * côté client — il ne s'agit PAS d'un contrôle de sécurité (un utilisateur
 * déterminé peut vider son localStorage) mais d'un frein de conversion.
 * Le contrôle anti-abus réel reste le rate-limit serveur de `/api/tts`.
 */

export const FREE_DAILY_AUDIO_LIMIT = 10;

/** Sous-ensemble de localStorage utilisé ici (permet de tester sans DOM). */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Clé de stockage pour le jour calendaire local de `date`. */
export function audioQuotaStorageKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `kenza_audio_quota_${y}-${m}-${d}`;
}

/** Nombre d'écoutes déjà consommées aujourd'hui (0 si absent ou illisible). */
export function readAudioQuota(storage: StorageLike | null, date: Date): number {
  if (!storage) return 0;
  try {
    const raw = storage.getItem(audioQuotaStorageKey(date));
    const parsed = Number.parseInt(raw ?? '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

/** Vrai si l'utilisateur peut encore lancer une écoute. Les abonnés sont illimités. */
export function hasAudioQuota(
  storage: StorageLike | null,
  isPremium: boolean,
  date: Date
): boolean {
  if (isPremium) return true;
  return readAudioQuota(storage, date) < FREE_DAILY_AUDIO_LIMIT;
}

/** Incrémente le compteur du jour et renvoie le nouveau total. */
export function recordAudioPlay(storage: StorageLike | null, date: Date): number {
  if (!storage) return 0;
  const next = readAudioQuota(storage, date) + 1;
  try {
    storage.setItem(audioQuotaStorageKey(date), String(next));
  } catch {
    // Stockage plein ou indisponible : on ne bloque pas la lecture pour autant.
  }
  return next;
}

/** Écoutes restantes aujourd'hui, ou `null` si illimité (abonné). */
export function remainingAudioQuota(
  storage: StorageLike | null,
  isPremium: boolean,
  date: Date
): number | null {
  if (isPremium) return null;
  return Math.max(0, FREE_DAILY_AUDIO_LIMIT - readAudioQuota(storage, date));
}

/**
 * Vrai si cette lecture doit décrémenter le quota.
 * Les bips de feedback (`correct` / `error`) sont des sons d'interface, pas du
 * contenu pédagogique : les compter épuiserait le quota sans valeur perçue.
 */
export function shouldConsumeAudioQuota(text: string, audioUrl?: string): boolean {
  const trimmed = (text ?? '').trim();
  if (trimmed === 'correct' || trimmed === 'error') return false;
  return trimmed.length > 0 || Boolean(audioUrl);
}

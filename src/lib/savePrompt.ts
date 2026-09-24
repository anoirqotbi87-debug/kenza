// Règles d'affichage de l'invitation « Sauvegarder ma progression » pour les invités.
// 1) Après la 1re leçon terminée.
// 2) Si « Plus tard » : un seul rappel, à partir de la 3e leçon ou d'une série de 2 jours.
const KEY = 'kenza_save_prompt';

type State = { dismissCount: number; lessonsAtDismiss: number };

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { dismissCount: 0, lessonsAtDismiss: 0 };
}

export type SavePromptVariant = 'first' | 'reminder';

export function getSavePromptVariant(lessonsCompleted: number, streakDays: number): SavePromptVariant | null {
  if (typeof window === 'undefined' || lessonsCompleted < 1) return null;
  const s = read();
  if (s.dismissCount === 0) return 'first';
  if (s.dismissCount === 1 && lessonsCompleted > s.lessonsAtDismiss && (lessonsCompleted >= 3 || streakDays >= 2)) {
    return 'reminder';
  }
  return null;
}

export function dismissSavePrompt(lessonsCompleted: number) {
  const s = read();
  try {
    localStorage.setItem(KEY, JSON.stringify({ dismissCount: s.dismissCount + 1, lessonsAtDismiss: lessonsCompleted }));
  } catch {
    /* ignore */
  }
}

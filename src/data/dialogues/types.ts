import type { DialogueScenario, DialogueTurn } from '../../types/dialogue';

/**
 * Couche pédagogique des dialogues du quotidien.
 *
 * Les scénarios eux-mêmes vivent dans `src/data/scenarios/` (ils sont consommés
 * par le moteur de roleplay). Ce module ajoute ce qui manquait : à quel module du
 * parcours chaque dialogue appartient, et la transcription normalisée qui sert
 * aux exercices de lecture.
 */

export type DialogueTheme = 'transport' | 'restaurant' | 'souk' | 'housing' | 'health';

export interface DialogueCatalogEntry {
  scenario: DialogueScenario;
  /** Module du parcours où ce dialogue est travaillé. */
  module: 1 | 2 | 3 | 4;
  theme: DialogueTheme;
}

/** Une réplique transcrite, prête pour un exercice de lecture. */
export interface TranscriptLine {
  turnId: string;
  speaker: 'bot' | 'user';
  speakerRole: string;
  /** Arabizi normalisé (voir `normalizeArabizi`). */
  arabizi: string;
  /** Arabizi tel qu'écrit dans le scénario, avec sa ponctuation. */
  arabiziRaw: string;
  arabic: string;
  translationFr: string;
}

/**
 * Normalise une transcription Arabizi pour la comparaison et l'affichage.
 *
 * L'Arabizi n'a pas d'orthographe unique : on met en minuscules, on ramène la
 * ponctuation à un espace et on écrase les espaces multiples. Les chiffres
 * (3, 7, 9) et les traits d'union internes sont conservés : ils portent des sons
 * et des frontières de mots (« l-kré », « s-skhana »).
 */
export function normalizeArabizi(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,!?؟;:"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Transcription d'une réplique, dans les trois écritures utiles à l'apprenant. */
export function toTranscriptLine(turn: DialogueTurn): TranscriptLine {
  return {
    turnId: turn.id,
    speaker: turn.speaker,
    speakerRole: turn.speakerRole,
    arabizi: normalizeArabizi(turn.arabiziText),
    arabiziRaw: turn.arabiziText,
    arabic: turn.arabicText,
    translationFr: turn.translationFr,
  };
}

/** Transcription complète d'un scénario, dans l'ordre du dialogue. */
export function buildTranscript(scenario: DialogueScenario): TranscriptLine[] {
  return scenario.turns.map(toTranscriptLine);
}

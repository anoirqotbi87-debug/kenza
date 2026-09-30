import { taxiFesScenario } from '../scenarios/taxiFes';
import { cafeFesScenario } from '../scenarios/cafeFes';
import { soukFesScenario } from '../scenarios/soukFes';
import { loyerFes } from '../scenarios/loyerFes';
import { medecinFes } from '../scenarios/medecinFes';
import { buildTranscript } from './types';
import type { DialogueCatalogEntry, DialogueTheme, TranscriptLine } from './types';

export { buildTranscript, normalizeArabizi, toTranscriptLine } from './types';
export type { DialogueCatalogEntry, DialogueTheme, TranscriptLine } from './types';

/**
 * Dialogues du quotidien rattachés aux modules 1 à 4.
 *
 * Le rattachement suit la progression du parcours : le taxi et le café (module 2,
 * « survie quotidienne ») précèdent la négociation du loyer et la consultation
 * médicale (module 3, « autonomie »). Les modules 1 et 4 sont grammaticaux et
 * n'ont pas de dialogue propre ; ils réutilisent les dialogues du module 2 pour
 * la mise en pratique.
 */
export const DIALOGUE_CATALOG: DialogueCatalogEntry[] = [
  { scenario: cafeFesScenario, module: 2, theme: 'restaurant' },
  { scenario: taxiFesScenario, module: 2, theme: 'transport' },
  { scenario: soukFesScenario, module: 2, theme: 'souk' },
  { scenario: loyerFes, module: 3, theme: 'housing' },
  { scenario: medecinFes, module: 3, theme: 'health' },
];

export function getDialoguesForModule(module: 1 | 2 | 3 | 4): DialogueCatalogEntry[] {
  return DIALOGUE_CATALOG.filter((entry) => entry.module === module);
}

export function getDialoguesByTheme(theme: DialogueTheme): DialogueCatalogEntry[] {
  return DIALOGUE_CATALOG.filter((entry) => entry.theme === theme);
}

export function getDialogueById(id: string): DialogueCatalogEntry | undefined {
  return DIALOGUE_CATALOG.find((entry) => entry.scenario.id === id);
}

/** Transcription complète d'un dialogue, retrouvé par son id de scénario. */
export function getTranscript(dialogueId: string): TranscriptLine[] {
  const entry = getDialogueById(dialogueId);
  return entry ? buildTranscript(entry.scenario) : [];
}

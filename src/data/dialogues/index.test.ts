import { describe, it, expect } from 'vitest';
import {
  DIALOGUE_CATALOG,
  getDialoguesForModule,
  getDialoguesByTheme,
  getDialogueById,
  getTranscript,
  buildTranscript,
  normalizeArabizi,
} from './index';
import { ALL_SCENARIOS } from '../scenarios';
import type { DialogueTheme } from './types';

const THEMES: DialogueTheme[] = ['transport', 'restaurant', 'souk', 'housing', 'health'];

describe('dialogues — catalogage', () => {
  it('chaque scenario des donnees est catalogue exactement une fois', () => {
    const cataloguedIds = DIALOGUE_CATALOG.map((e) => e.scenario.id).sort();
    const scenarioIds = ALL_SCENARIOS.map((s) => s.id).sort();
    expect(cataloguedIds).toEqual(scenarioIds);
  });

  it('chaque dialogue est rattache a un module 1 a 4', () => {
    for (const entry of DIALOGUE_CATALOG) {
      expect([1, 2, 3, 4], entry.scenario.id).toContain(entry.module);
    }
  });

  it('les modules 2 et 3 portent bien les dialogues du quotidien', () => {
    // Le module 1 est phonetique et le 4 grammatical : ils n'ont pas de dialogue propre.
    expect(getDialoguesForModule(2).length).toBeGreaterThan(0);
    expect(getDialoguesForModule(3).length).toBeGreaterThan(0);
  });

  it('les themes couvrent le quotidien annonce', () => {
    const present = new Set(DIALOGUE_CATALOG.map((e) => e.theme));
    for (const theme of THEMES) {
      expect(present.has(theme), `theme manquant : ${theme}`).toBe(true);
    }
  });

  it('getDialoguesByTheme et getDialogueById filtrent correctement', () => {
    expect(getDialoguesByTheme('transport').every((e) => e.theme === 'transport')).toBe(true);
    expect(getDialogueById('taxiFes')?.scenario.id).toBe('taxiFes');
    expect(getDialogueById('inexistant')).toBeUndefined();
  });
});

describe('dialogues — integrite des scenarios', () => {
  it('chaque scenario a un titre, un lieu et au moins 4 repliques', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      expect(scenario.title.trim().length, scenario.id).toBeGreaterThan(0);
      expect(scenario.location.trim().length, scenario.id).toBeGreaterThan(0);
      expect(scenario.turns.length, scenario.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('les repliques alternent bot et utilisateur en commencant par le bot', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      expect(scenario.turns[0].speaker, scenario.id).toBe('bot');
      for (const turn of scenario.turns) {
        expect(['bot', 'user'], `${scenario.id}.${turn.id}`).toContain(turn.speaker);
      }
    }
  });

  it('chaque replique a une transcription Arabizi et une graphie arabe', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      for (const turn of scenario.turns) {
        const where = `${scenario.id}.${turn.id}`;
        expect(turn.arabiziText.trim().length, `${where} arabizi`).toBeGreaterThan(0);
        expect(/[\u0600-\u06FF]/.test(turn.arabicText), `${where} arabic`).toBe(true);
        expect(turn.translationFr.trim().length, `${where} fr`).toBeGreaterThan(0);
      }
    }
  });

  it('les ids de replique sont uniques dans un scenario', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      const ids = scenario.turns.map((t) => t.id);
      expect(new Set(ids).size, scenario.id).toBe(ids.length);
    }
  });
});

describe('dialogues — tours utilisateur exploitables par l apprenant', () => {
  // Sans expectedPhrases, le moteur de roleplay ne peut ni valider la reponse
  // ni proposer d'indice : le tour est injouable. C'est la regression corrigee
  // sur loyerFes et medecinFes.
  it('chaque tour utilisateur a une reponse attendue complete', () => {
    const offenders: string[] = [];
    for (const { scenario } of DIALOGUE_CATALOG) {
      for (const turn of scenario.turns) {
        if (turn.speaker !== 'user') continue;
        const where = `${scenario.id}.${turn.id}`;
        if (!turn.expectedPhrases) {
          offenders.push(`${where} sans expectedPhrases`);
          continue;
        }
        if (!turn.expectedPhrases.primaryArabizi.trim()) offenders.push(`${where} sans primaryArabizi`);
        if (!/[\u0600-\u06FF]/.test(turn.expectedPhrases.primaryArabic)) {
          offenders.push(`${where} primaryArabic non arabe`);
        }
        if (turn.expectedPhrases.acceptedVariants.length === 0) offenders.push(`${where} sans variante`);
        if (turn.expectedPhrases.hints.length === 0) offenders.push(`${where} sans indice`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('les indices sont deja contenus dans la reponse principale ou ses variantes', () => {
    const offenders: string[] = [];
    for (const { scenario } of DIALOGUE_CATALOG) {
      for (const turn of scenario.turns) {
        if (turn.speaker !== 'user' || !turn.expectedPhrases) continue;
        const { primaryArabizi, acceptedVariants, hints } = turn.expectedPhrases;
        const haystack = normalizeArabizi([primaryArabizi, ...acceptedVariants].join(' '));
        for (const hint of hints) {
          if (!haystack.includes(normalizeArabizi(hint))) {
            offenders.push(`${scenario.id}.${turn.id} : indice « ${hint} » introuvable`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('transcriptions', () => {
  it('normalizeArabizi met en minuscules, retire la ponctuation et compresse les espaces', () => {
    expect(normalizeArabizi('Salam,  Labas ?')).toBe('salam labas');
    expect(normalizeArabizi('3afak, wa7ed atay!')).toBe('3afak wa7ed atay');
    expect(normalizeArabizi('')).toBe('');
  });

  it('normalizeArabizi preserve les chiffres et les traits d union porteurs de sens', () => {
    expect(normalizeArabizi('L-kré f ch-chher?')).toBe('l-kré f ch-chher');
    expect(normalizeArabizi('Ma-kla-ch l-ftour.')).toBe('ma-kla-ch l-ftour');
  });

  it('buildTranscript produit une ligne par replique, dans l ordre', () => {
    const scenario = DIALOGUE_CATALOG[0].scenario;
    const transcript = buildTranscript(scenario);
    expect(transcript.length).toBe(scenario.turns.length);
    expect(transcript.map((l) => l.turnId)).toEqual(scenario.turns.map((t) => t.id));
  });

  it('chaque ligne de transcription porte les trois ecritures', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      for (const line of buildTranscript(scenario)) {
        const where = `${scenario.id}.${line.turnId}`;
        expect(line.arabizi.trim().length, `${where} arabizi`).toBeGreaterThan(0);
        expect(/[\u0600-\u06FF]/.test(line.arabic), `${where} arabic`).toBe(true);
        expect(line.translationFr.trim().length, `${where} fr`).toBeGreaterThan(0);
      }
    }
  });

  it('l arabizi normalise ne contient jamais de caractere arabe', () => {
    for (const { scenario } of DIALOGUE_CATALOG) {
      for (const line of buildTranscript(scenario)) {
        expect(/[\u0600-\u06FF]/.test(line.arabizi), `${scenario.id}.${line.turnId}`).toBe(false);
      }
    }
  });

  it('getTranscript retrouve un dialogue par son id et renvoie vide sinon', () => {
    expect(getTranscript('taxiFes').length).toBeGreaterThan(0);
    expect(getTranscript('inexistant')).toEqual([]);
  });
});

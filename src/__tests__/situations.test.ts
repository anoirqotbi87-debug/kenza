import { describe, it, expect } from 'vitest';
import { SITUATION_SCENARIOS } from '@/data/scenarios';
import {
  localize,
  detectArabiziDigit,
  getVisibleTurnCount,
} from '@/lib/situations/engine';

/**
 * Étape 4 — Situations du Bled (simulateur de conversations hors-ligne).
 *
 * Le disque des scénarios est statique et embarqué : les 3 situations
 * authentiques (taxi à Fès, épicier, accueil en famille) doivent rester
 * valides pour le moteur de chat (tours, tokens, options de réponse).
 */

describe('SITUATION_SCENARIOS', () => {
  it('expose au moins 3 scénarios authentiques', () => {
    expect(SITUATION_SCENARIOS.length).toBeGreaterThanOrEqual(3);
    expect(SITUATION_SCENARIOS.map((s) => s.id)).toEqual(
      expect.arrayContaining(['taxi_fes', 'moul_7anout', 'accueil_famille'])
    );
  });

  it('chaque scénario est localisé sur les 4 langues (titre + contexte)', () => {
    for (const s of SITUATION_SCENARIOS) {
      expect(s.title.fr).toBeTruthy();
      expect(s.title.en).toBeTruthy();
      expect(s.title.es).toBeTruthy();
      expect(s.title.ar).toBeTruthy();
      expect(s.context.fr).toBeTruthy();
      expect(s.context.ar).toBeTruthy();
    }
  });

  it('chaque scénario alterne interlocuteur et apprenant, avec tokens par tour', () => {
    for (const s of SITUATION_SCENARIOS) {
      expect(s.turns.length).toBeGreaterThanOrEqual(4);
      for (const turn of s.turns) {
        expect(['interlocutor', 'user']).toContain(turn.speaker);
        expect(turn.arabizi.trim()).toBeTruthy();
        expect(turn.arabicVocalized.trim()).toBeTruthy();
        expect(turn.tokens.length).toBeGreaterThan(0);
      }
    }
  });

  it('la première réplique vient toujours de l’interlocuteur', () => {
    for (const s of SITUATION_SCENARIOS) {
      expect(s.turns[0].speaker).toBe('interlocutor');
    }
  });

  it('chaque tour apprenant propose au moins 2 réponses avec feedback', () => {
    for (const s of SITUATION_SCENARIOS) {
      const userTurns = s.turns.filter((t) => t.speaker === 'user');
      for (const turn of userTurns) {
        expect(turn.options).toBeDefined();
        expect(turn.options!.length).toBeGreaterThanOrEqual(2);
        // Exactement une réponse « correcte » par tour.
        expect(turn.options!.filter((o) => o.correct).length).toBe(1);
        for (const option of turn.options!) {
          expect(option.feedback.fr).toBeTruthy();
          expect(option.feedback.ar).toBeTruthy();
        }
      }
    }
  });

  it('les tokens portent la traduction mot à mot et les chiffres Arabizi sont signalés', () => {
    for (const s of SITUATION_SCENARIOS) {
      for (const turn of s.turns) {
        for (const token of turn.tokens) {
          expect(token.arabizi).toBeTruthy();
          expect(token.arabic).toBeTruthy();
          expect(token.translation.fr).toBeTruthy();
          if (token.arabiziDigit) {
            expect(['2', '3', '5', '7', '9']).toContain(token.arabiziDigit);
          }
        }
      }
    }
  });
});

describe('localize', () => {
  const m = { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحبا' };

  it('saisit chaque langue', () => {
    expect(localize(m, 'fr')).toBe('Bonjour');
    expect(localize(m, 'en')).toBe('Hello');
    expect(localize(m, 'es')).toBe('Hola');
    expect(localize(m, 'ar')).toBe('مرحبا');
  });

  it('replie sur le français pour une langue inconnue', () => {
    expect(localize(m, 'de')).toBe('Bonjour');
    expect(localize(m, '')).toBe('Bonjour');
  });
});

describe('detectArabiziDigit', () => {
  it('détecte les chiffres Arabizi 2, 3, 5, 7, 9', () => {
    expect(detectArabiziDigit('3likom')).toBe('3');
    expect(detectArabiziDigit('Mer7ba')).toBe('7');
    expect(detectArabiziDigit('Bch7al')).toBe('7');
    expect(detectArabiziDigit('khobza')).toBe('5'); // kh = son du 5
    expect(detectArabiziDigit('5elj')).toBe('5');
    expect(detectArabiziDigit('9bala liya')).toBe('9');
    expect(detectArabiziDigit('Dqi2a')).toBe('2');
  });

  it('ne détecte rien sans chiffre Arabizi', () => {
    expect(detectArabiziDigit('Salam')).toBeUndefined();
    expect(detectArabiziDigit('Chokran bezzaf')).toBeUndefined();
    expect(detectArabiziDigit('')).toBeUndefined();
  });

  it('tout token chiffré du corpus est bien décodé', () => {
    const tokens = SITUATION_SCENARIOS.flatMap((s) => s.turns.flatMap((t) => t.tokens));
    const digitTokens = tokens.filter((tk) => tk.arabiziDigit);
    for (const tk of digitTokens) {
      expect(detectArabiziDigit(tk.arabizi)).toBe(tk.arabiziDigit);
    }
  });
});

describe('getVisibleTurnCount', () => {
  it('progresse bulle par bulle', () => {
    expect(getVisibleTurnCount(0)).toBe(1);
    expect(getVisibleTurnCount(2)).toBe(3);
    expect(getVisibleTurnCount(5)).toBe(6);
  });
});
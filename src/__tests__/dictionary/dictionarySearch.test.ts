import { describe, it, expect } from 'vitest';
import {
  normalizeArabizi,
  levenshtein,
  stripArabicDiacritics,
  searchDictionary,
} from '@/lib/dictionary/dictionarySearch';

/**
 * Étape 3 — Dictionnaire de Survie hors-ligne.
 *
 * La recherche phonétique DOIT tolérer les variantes Arabizi qui n'ont aucune
 * orthographe standard : chiffres (chhal / ch7al, 9hwa / qahwa), doublons
 * (machi / mashi), groupes sonores (sh/ch), et l'arabe saisi sans diacritiques.
 * Le corpus est embarqué (hors-ligne) : le moteur vient de `ESSENTIAL_SRS_WORDS`.
 */

describe('normalizeArabizi', () => {
  it('réduit la casse et supprime les espaces/apostrophes', () => {
    expect(normalizeArabizi('  Bchhal Hada ? ')).toBe('bchhalhada');
    expect(normalizeArabizi('l-3afiya')).toBe('leafiya'); // 3 → e (ayn)
  });

  it('convertit les chiffres Arabizi en lettres', () => {
    expect(normalizeArabizi('ch7al')).toBe('chhal');
    expect(normalizeArabizi('9hwa')).toBe('qhwa');
    expect(normalizeArabizi('wa7ed')).toBe('wahed');
    expect(normalizeArabizi('bch7al')).toBe('bchhal');
  });

  it('unifie les groupes sonores proches', () => {
    expect(normalizeArabizi('shhal')).toBe('chhal');
    expect(normalizeArabizi('mashi')).toBe('machi');
  });

  it('gère les accents et lettres étrangères', () => {
    expect(normalizeArabizi('Dónde')).toBe('donde');
    expect(normalizeArabizi('fin?')).toBe('fin');
  });
});

describe('levenshtein', () => {
  it('calcule les coûts classiques', () => {
    expect(levenshtein('', '')).toBe(0);
    expect(levenshtein('chat', 'chats')).toBe(1);
    expect(levenshtein('dor', 'dour')).toBe(1);
    expect(levenshtein('chhal', 'chhal')).toBe(0);
  });
});

describe('stripArabicDiacritics', () => {
  it('supprime les chakl arabes', () => {
    expect(stripArabicDiacritics('دُورْ')).toBe('دور');
    expect(stripArabicDiacritics('شْحَالْ')).toBe('شحال');
    expect(stripArabicDiacritics('سلام')).toBe('سلام');
  });
});

describe('searchDictionary', () => {
  it('retrouve "combien" via la variante chiffrée ch7al', () => {
    const results = searchDictionary('ch7al');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('srs_chhal');
  });

  it('retrouve "combien" via la variante orthographique chhal', () => {
    const results = searchDictionary('chhal');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('srs_chhal');
  });

  it('retrouve un mot identique exact', () => {
    const results = searchDictionary('dor');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('srs_dor');
  });

  it('retrouve un mot par son arabe (sans diacritiques)', () => {
    const results = searchDictionary('دور'); // dour (sans chakl)
    expect(results.some(r => r.id === 'srs_dor')).toBe(true);
  });

  it('retrouve les mots dont la traduction correspond (recherche fr)', () => {
    const results = searchDictionary('pain');
    expect(results.length).toBeGreaterThan(0);
    // Match exact de traduction (fr « pain ») : prioritaire sur les faux positifs
    expect(results[0].id).toBe('srs_khobz');
  });

  it('retourne les résultats les plus pertinents en premier', () => {
    const results = searchDictionary('chhal', 5);
    expect(results.length).toBeLessThanOrEqual(5);
    // Le premier résultat doit être le match exact
    expect(results[0].id).toBe('srs_chhal');
  });

  it('retourne une liste vide pour une saisie vide', () => {
    expect(searchDictionary('')).toEqual([]);
    expect(searchDictionary('   ')).toEqual([]);
  });

  it('expose toutes les entrées avec la clé aliases (requis par l’UI)', () => {
    const results = searchDictionary('dor');
    expect(results[0].aliases).toContain('dour');
  });
});
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import DictionnairePage from '@/app/dictionnaire/page';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PAGE_SOURCE = resolve(SRC, 'app/dictionnaire/page.tsx');

/**
 * Étape 3 — Page Dictionnaire de Survie.
 *
 * - Le rendu SSR initial affiche le header, le champ de recherche, le badge
 *   « 100% hors-ligne » et l'état vide guidant vers la frappe d'un mot.
 * - La page est un client component (interactivité de recherche) mais ne lit
 *   jamais le navigateur au rendu (aucune lecture de window) — parité SSR.
 * - Le moteur de recherche est branché depuis cette page.
 */
describe('Page /dictionnaire (rendu SSR)', () => {
  it('rend le strict minimum : header, recherche, badge hors-ligne, pas de crash', () => {
    const html = renderToStaticMarkup(React.createElement(DictionnairePage));
    expect(html).toContain('Dictionnaire');
    expect(html).toContain('search');
    expect(html).toContain('100% hors-ligne');
    // Pas d'état de résultats au chargement initial
    expect(html).not.toContain('Filtrer');
  });
});

describe('Page /dictionnaire (structure source)', () => {
  it("déclare 'use client' (recherche interactive côté client)", () => {
    const source = readFileSync(PAGE_SOURCE, 'utf8');
    expect(source.trimStart().startsWith("'use client'")).toBe(true);
  });

  it('utilise searchDictionary (moteur hors-ligne) et playAudio', () => {
    const source = readFileSync(PAGE_SOURCE, 'utf8');
    expect(source).toContain('searchDictionary');
    expect(source).toContain('playAudio');
  });

  it('affiche la lecture lente (tortue) en plus de la lecture normale', () => {
    const source = readFileSync(PAGE_SOURCE, 'utf8');
    expect(source).toContain('SLOW_SPEED');
  });
});
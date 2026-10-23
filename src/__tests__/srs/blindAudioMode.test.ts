import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { hasPlayableAudio } from '@/components/srs/FlashcardDeck';
import { useAppStore } from '@/store/useAppStore';
import type { VocabularySRSData } from '@/types/srs';

/**
 * Mode « Écoute Pure » (Blind Audio Mode) du module SRS — Étape 2.
 *
 * 1. Quand le mode est actif, le recto de la flashcard masque les textes
 *    (arabe/arabizi/traduction) au profit d'une icône audio animée + lecture
 *    lente, pour forcer l'écoute avant le retournement.
 * 2. Si une carte n'a aucun audio jouable (ni fichier statique, ni texte à
 *    synthétiser en darija marocaine), le mode est désactivé pour cette carte :
 *    fallback propre sur l'affichage normal.
 * 3. Le verso révèle toujours le texte complet (comportement existant).
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FLASHCARD_SOURCE = resolve(SRC, 'components/srs/FlashcardDeck.tsx');

// --- helper : carte de test ---
const baseWord = (overrides: Partial<VocabularySRSData> = {}): VocabularySRSData => ({
  id: 'w_salam',
  arabizi: 'salam',
  arabic: 'سلام',
  translation: { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحبا' },
  category: 'POLITE_SOCIAL',
  ...overrides,
});

const cardFixture = [
  {
    id: 'srs_salam',
    wordId: 'srs_salam',
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: '2026-10-23T00:00:00.000Z',
    state: 'learning' as const,
  },
];

beforeEach(() => {
  useAppStore.setState({ blindAudioMode: false });
});

describe('hasPlayableAudio (fallback audio)', () => {
  it('carte avec fichier audio statique → jouable', () => {
    expect(hasPlayableAudio(baseWord({ audioUrl: 'https://x/mp3/salam.mp3' }))).toBe(true);
  });

  it('carte sans fichier mais avec texte depuis lequel synthétiser (arabizi + arabe) → jouable', () => {
    expect(hasPlayableAudio(baseWord())).toBe(true);
  });

  it('carte sans aucune donnée audio ni texte → NON jouable (mode désactivé)', () => {
    const word = baseWord();
    word.arabizi = '';
    word.arabic = '';
    word.audioUrl = undefined;
    expect(hasPlayableAudio(word)).toBe(false);
  });

  it('wordData null → non jouable', () => {
    expect(hasPlayableAudio(null)).toBe(false);
  });
});

describe('Persistance du réglage Mode Écoute Pure', () => {
  it('le store stocke bien le flag et l’action le bascule', () => {
    expect(useAppStore.getState().blindAudioMode).toBe(false);
    useAppStore.getState().setBlindAudioMode(true);
    expect(useAppStore.getState().blindAudioMode).toBe(true);
    useAppStore.getState().setBlindAudioMode(false);
    expect(useAppStore.getState().blindAudioMode).toBe(false);
  });
});

describe('Non-régression du composant FlashcardDeck', () => {
  it('rend la traduction (affichage normal) quand le mode est désactivé — SSR', async () => {
    const { default: FlashcardDeck } = await import('@/components/srs/FlashcardDeck');
    useAppStore.setState({ blindAudioMode: false });
    const html = renderToStaticMarkup(
      React.createElement(FlashcardDeck, {
        cards: cardFixture,
        vocabulary: [baseWord()],
        onComplete: () => {},
      })
    );
    expect(html).toContain('Bonjour');
    // TODO: vérifier le masquage quand le mode est actif nécessiterait un DOM
    // interactif (le recto blind est géré côté client via les props d'état).
    expect(html).not.toContain('🐢');
  });

  it('la logique de masquage conditionnel est présente dans la source', () => {
    const src = readFileSync(FLASHCARD_SOURCE, 'utf-8');
    expect(src).toContain('isBlindAudio');
    expect(src).toMatch(/blindAudioMode\s*&&\s*!isFlipped\s*&&\s*hasPlayableAudio\(wordData\)/);
    expect(src).toContain('t.srs?.slowListen');
    expect(src).toContain('handlePlayAudio(e, true)');
    expect(src).toMatch(/SLOW_SPEED\s*=\s*0\.75/);
  });
});
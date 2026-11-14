import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getLocalizedVoiceError } from './useVoiceRecognition';

const source = readFileSync(
  fileURLToPath(new URL('./useVoiceRecognition.ts', import.meta.url)),
  'utf8'
);

/**
 * Le support de la Web Speech API dépend du navigateur : le lire pendant le rendu
 * fait diverger le premier rendu client du HTML SSR et déclenche l'erreur React #418
 * (observée sur /parler). La détection doit passer par `useSyncExternalStore` avec un
 * `getServerSnapshot` renvoyant `null`.
 */
describe('useVoiceRecognition — parité SSR', () => {
  it('lit le support navigateur via useSyncExternalStore', () => {
    expect(source).toMatch(/useSyncExternalStore\(/);
  });

  it('renvoie null comme snapshot serveur', () => {
    expect(source).toMatch(/\(\)\s*=>\s*null\s*\)/);
  });

  it("n'évalue pas window dans un initialiseur de useState", () => {
    expect(source).not.toMatch(/useState\(\s*\(\)\s*=>\s*\{[^}]*window/);
  });
});

describe('useVoiceRecognition — localisation des messages d’erreur (FR, EN, ES, AR)', () => {
  const codes = ['not-allowed', 'no-speech', 'language-not-supported', 'not-supported', 'network'];

  it('fournit des messages dédiés en anglais sans fuite française', () => {
    for (const code of codes) {
      const msg = getLocalizedVoiceError(code, 'en');
      expect(msg).toBeTruthy();
      expect(msg).not.toContain('Erreur vocale');
      expect(msg).not.toContain('Permission micro refusée');
    }
  });

  it('fournit des messages dédiés en espagnol sans fuite française', () => {
    for (const code of codes) {
      const msg = getLocalizedVoiceError(code, 'es');
      expect(msg).toBeTruthy();
      expect(msg).not.toContain('Erreur vocale');
      expect(msg).not.toContain('Permission micro refusée');
    }
  });

  it('fournit des messages dédiés en arabe sans fuite française', () => {
    for (const code of codes) {
      const msg = getLocalizedVoiceError(code, 'ar');
      expect(msg).toBeTruthy();
      expect(msg).not.toContain('Erreur vocale');
      expect(msg).not.toContain('Permission micro refusée');
    }
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

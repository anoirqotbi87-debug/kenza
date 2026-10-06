import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { translations } from '@/lib/i18n/translations';

/**
 * Non-régression de l'audit accessibilité (PR #22).
 *
 * Le défaut corrigé : l'audit avait ajouté des `aria-label` à certains boutons
 * (PageHeader, PaywallModal, CheckpointResult, PronunciationTrainer…) mais en avait
 * oublié 8 — des boutons purement iconographiques (fermer, retour, micro) sans aucun
 * nom accessible. Un lecteur d'écran les annonçait comme « bouton », sans plus.
 *
 * Le test lit les sources comme texte : `vitest` est configuré sur `environment: 'node'`
 * et aucun outil de rendu DOM n'est installé, donc on ne peut pas monter les composants.
 * C'est le même parti pris que `headers.test.ts` pour `next.config.ts`.
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS = resolve(SRC, 'components');

function readSource(relativePath: string): string {
  return readFileSync(resolve(COMPONENTS, relativePath), 'utf-8');
}

/** Un `<button>` est accessible s'il porte un nom : texte, `aria-label`, `title` ou `sr-only`. */
function iconButtonsWithoutName(source: string): string[] {
  const offenders: string[] = [];
  for (const match of source.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const [full, inner] = [match[0], match[1].trim()];
    if (inner.replace(/<[^>]+>/g, '').trim()) continue; // a du texte visible
    if (inner.includes('sr-only')) continue; // nom réservé aux lecteurs d'écran
    if (full.includes('aria-label') || full.includes('title=')) continue;
    offenders.push(full.split('\n')[0].trim().slice(0, 70));
  }
  return offenders;
}

const LABELLED = [
  'auth/AuthModal.tsx',
  'checkpoint/CheckpointModal.tsx',
  'dialogue/ScenarioSelectorModal.tsx',
  'srs/CustomCardEditor.tsx',
  'dialogue/DialogueView.tsx',
  'audio/SpeechTrainer.tsx',
  'dialogue/AiRoleplayView.tsx',
  'pwa/InstallPwaBanner.tsx',
];

describe('accessibilité — boutons iconographiques', () => {
  it.each(LABELLED)('%s : aucun bouton sans nom accessible', (file) => {
    expect(iconButtonsWithoutName(readSource(file))).toEqual([]);
  });

  it('DialogueView branche bien le hook de traduction (aria-label={t.common.back})', () => {
    const source = readSource('dialogue/DialogueView.tsx');
    expect(source).toContain('useTranslation');
    expect(source).toContain('aria-label={t.common.back}');
  });

  it('SpeechTrainer annonce l’état réel du micro (écoute / appui)', () => {
    const source = readSource('audio/SpeechTrainer.tsx');
    expect(source).toContain('aria-label={isListening ? t.modules.speech.listening : t.modules.speech.pressMic}');
  });

  it('aucun composant n’expose de bouton iconographique sans nom', () => {
    const offenders: string[] = [];
    for (const file of [
      'auth/AuthModal.tsx',
      'checkpoint/CheckpointModal.tsx',
      'dialogue/ScenarioSelectorModal.tsx',
      'srs/CustomCardEditor.tsx',
      'dialogue/DialogueView.tsx',
      'audio/SpeechTrainer.tsx',
      'dialogue/AiRoleplayView.tsx',
      'pwa/InstallPwaBanner.tsx',
      'ui/PageHeader.tsx',
      'monetization/PaywallModal.tsx',
    ]) {
      for (const button of iconButtonsWithoutName(readSource(file))) {
        offenders.push(`${file}: ${button}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('accessibilité — libellés des boutons', () => {
  /**
   * Les chemins sont DÉRIVÉS des sources, pas listés à la main : un `aria-label` pointant
   * vers une clé inexistante (`t.speech.listening` au lieu de `t.modules.speech.listening`)
   * rend `undefined` dans le DOM et plante le composant — exactement le bug que ce test a
   * attrapé lors de l'écriture du correctif.
   */
  it('chaque chemin de traduction référencé dans un aria-label existe dans les 4 langues', () => {
    const paths = new Set<string>();
    for (const file of LABELLED) {
      const source = readSource(file);
      for (const match of source.matchAll(/aria-label=\{([^}]*)\}/g)) {
        for (const ref of match[1].matchAll(/\bt((?:\.[A-Za-z0-9_]+)+)/g)) {
          paths.add(ref[1].slice(1));
        }
      }
    }
    expect(paths.size, 'aucun aria-label i18n trouvé : le test ne garde rien').toBeGreaterThan(0);

    for (const path of paths) {
      for (const lang of ['fr', 'en', 'es', 'ar'] as const) {
        const value = path
          .split('.')
          .reduce<unknown>(
            (node, key) => (node as Record<string, unknown> | undefined)?.[key],
            translations[lang]
          );
        expect(value, `${lang} : t.${path} n'existe pas`).toBeTruthy();
      }
    }
  });
});

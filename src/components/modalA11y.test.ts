import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Non-régression de l'audit sécurité/UI (points 8, 9 et 12).
 *
 * Le test lit les sources comme texte : `vitest` tourne sur `environment: 'node'` et aucun
 * outil de rendu DOM n'est installé, donc on ne peut pas monter les composants. Même parti
 * pris que `a11y.test.ts` et `headers.test.ts`.
 *
 * Le point 9 mérite une précision : l'audit demandait de remplacer `#a0a096` par `#767d70`
 * au nom du seuil AA (4.5:1). Ce remplacement ne l'atteint pas — 4.18:1 sur le fond du
 * panneau latéral. Le test calcule donc réellement le ratio plutôt que de comparer des
 * chaînes : une consigne fausse ne peut pas se glisser dans le code.
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readSource(relativePath: string): string {
  return readFileSync(resolve(SRC, relativePath), 'utf-8');
}

// --- Calcul du contraste WCAG 2.1 (relative luminance) ---

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Compose une couleur semi-transparente sur un fond opaque (le panneau latéral l'est). */
function composite(fg: string, alpha: number, bg: string): string {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [f, b] = [parse(fg), parse(bg)];
  return (
    '#' +
    f
      .map((c, i) => Math.round(alpha * c + (1 - alpha) * b[i]).toString(16).padStart(2, '0'))
      .join('')
  );
}

const AA_NORMAL_TEXT = 4.5;

describe('audit UI — dialogue modal accessible (point 8)', () => {
  const DIALOGS = [
    'components/auth/AuthModal.tsx',
    'components/checkpoint/CheckpointModal.tsx',
    'components/dialogue/ScenarioSelectorModal.tsx',
    'components/dialogue/AiRoleplayView.tsx',
    'components/ExerciseRunner.tsx',
    'components/onboarding/OnboardingModal.tsx',
  ];

  it.each(DIALOGS)('%s : le conteneur porte le pattern dialog complet', (file) => {
    const source = readSource(file);
    expect(source, 'useDialog non branché').toContain('useDialog');
    expect(source, 'ref={dialogRef} manquant').toContain('ref={dialogRef}');
    expect(source, 'role="dialog" manquant').toContain('role="dialog"');
    expect(source, 'aria-modal="true" manquant').toContain('aria-modal="true"');
    expect(source, 'tabIndex={-1} manquant (nécessaire pour focaliser le conteneur)').toContain(
      'tabIndex={-1}'
    );
  });

  it.each(DIALOGS)('%s : aria-labelledby pointe vers un id présent dans le fichier', (file) => {
    const source = readSource(file);
    const labelledBy = source.match(/aria-labelledby="([^"]+)"/);
    expect(labelledBy, 'aria-labelledby absent').not.toBeNull();
    const id = labelledBy![1];
    expect(source, `id="${id}" introuvable : le dialogue n'a plus de nom`).toContain(`id="${id}"`);
  });

  it('ExerciseRunner : le hook est appelé avant les retours anticipés', () => {
    const source = readSource('components/ExerciseRunner.tsx');
    const hookCall = source.indexOf('useDialog(true, onClose)');
    // Premier `return` du corps : les branches crash guard / game over / fin de leçon.
    const firstReturn = source.indexOf('\n    return (');
    expect(hookCall, 'useDialog absent').toBeGreaterThan(-1);
    expect(firstReturn, 'aucun retour trouvé : le test ne garde rien').toBeGreaterThan(-1);
    expect(hookCall, 'un hook après un return viole les règles des Hooks React').toBeLessThan(
      firstReturn
    );
  });

  it('useDialog : l\'effet ne dépend pas de onClose (sinon la boucle de focus revient)', () => {
    const source = readSource('hooks/useDialog.ts');
    expect(source, 'onClose inline relancerait l\'effet à chaque rendu').not.toMatch(
      /\}, \[isOpen, onClose\]\)/
    );
    expect(source).toMatch(/\}, \[isOpen\]\)/);
  });

  it('les vues plein écran neutralisent l\'arrière-plan (inert)', () => {
    const source = readSource('app/page.tsx');
    expect(source, 'arrière-plan non inerte sous une modale').toContain('inert={backgroundInert}');
    for (const flag of ['showScenarioSelector', 'activePersonaId', 'checkpointOpen', 'authMode']) {
      expect(source, `${flag} absent du calcul de backgroundInert`).toContain(flag);
    }
  });
});

describe('audit UI — contraste du texte secondaire (point 9)', () => {
  const css = readSource('app/globals.css');
  const PAPER = css.match(/--paper:\s*(#[0-9a-f]{6})/i)![1];
  const MUTED = css.match(/--muted-ink:\s*(#[0-9a-f]{6})/i)![1];

  it('le jeton --muted-ink atteint AA (4.5:1) sur --paper', () => {
    expect(contrastRatio(MUTED, PAPER)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('--muted-ink atteint AA sur le fond réel du panneau latéral', () => {
    // Le panneau est `rgba(255, 254, 250, .92)` par-dessus `--paper`.
    const panel = composite('#fffefa', 0.92, PAPER);
    expect(contrastRatio(MUTED, panel)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('la couleur écartée par l\'audit (#767d70) échoue bien au seuil : elle n\'est pas utilisée', () => {
    const panel = composite('#fffefa', 0.92, PAPER);
    expect(contrastRatio('#767d70', panel), 'la consigne de l\'audit est fausse').toBeLessThan(
      AA_NORMAL_TEXT
    );
    expect(css, '#767d70 ne doit pas entrer dans le thème').not.toContain('#767d70');
  });

  it('les libellés secondaires du panneau latéral utilisent le jeton, pas une couleur ad hoc', () => {
    expect(css, 'ancienne couleur trop claire encore présente').not.toContain('#a0a096');
    for (const selector of ['.sidebar-label {', '.brand-tagline {', '.sidebar-footer {']) {
      const block = css.slice(css.indexOf(selector), css.indexOf('}', css.indexOf(selector)));
      expect(block, `${selector} n'utilise pas var(--muted-ink)`).toContain('var(--muted-ink)');
    }
  });
});

describe('audit UI — annonce des messages temporaires (point 12)', () => {
  it('chaque conteneur de type toast est annoncé aux lecteurs d\'écran', () => {
    for (const file of ['app/page.tsx', 'components/dialogue/AiRoleplayView.tsx']) {
      const source = readSource(file);
      expect(source, `${file} : aucun toast trouvé`).toMatch(/toast|Toast/);
      expect(source, `${file} : toast non annoncé`).toContain('role="status"');
      expect(source, `${file} : aria-live manquant`).toContain('aria-live="polite"');
    }
  });
});

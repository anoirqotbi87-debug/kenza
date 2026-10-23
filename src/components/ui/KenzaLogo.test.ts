import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { translations, type UILanguage } from '@/lib/i18n/translations';
import { useAppStore } from '@/store/useAppStore';

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => React.createElement('img', { alt }),
}));

/**
 * Non-régression i18n du slogan sous le logo KENZA (Header + Sidebar/Drawer).
 *
 * Le défaut corrigé : le sous-titre « la darija, en chemin » était codé en dur dans
 * `KenzaLogo.tsx` et restait en français quelle que soit la langue d'interface.
 * Le slogan est désormais une clé `brand.tagline` de `translations`, lue via
 * `useTranslation()` (donc indexée par `uiLanguage`).
 *
 * Comme `vitest` est configuré sur `environment: 'node'` sans outil de rendu DOM
 * (même parti pris que `a11y.test.ts`), on teste la source de vérité (les traductions)
 * et on s'assure que le composant la consomme bien au lieu d'un littéral.
 */

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SOURCE = resolve(SRC, 'components/ui/KenzaLogo.tsx');

const TAGLINES: Record<UILanguage, string> = {
  fr: 'la darija, en chemin',
  en: 'darija, on the way',
  es: 'la darija, en camino',
  ar: 'الدارجة، في الطريق',
};

beforeEach(() => {
  useAppStore.getState().setLanguage('fr');
});

describe('KenzaLogo — slogan selon uiLanguage', () => {
  it('expose une traduction du slogan pour chaque langue de l’interface', () => {
    const langs = Object.keys(translations) as UILanguage[];
    expect(langs).toEqual(expect.arrayContaining(['fr', 'en', 'es', 'ar']));
    for (const lang of langs) {
      expect(translations[lang].brand?.tagline, `slogan manquant pour ${lang}`).toBe(TAGLINES[lang]);
    }
  });

  it('lit le slogan via useTranslation (plus de littéral codé en dur dans le rendu)', () => {
    const source = readFileSync(SOURCE, 'utf-8');
    expect(source).toContain('useTranslation');
    expect(source).toContain("const tagline = t.brand?.tagline");
    // Le JSX du slogan doit rendre la variable traduite, pas une valeur en dur.
    expect(source).toMatch(/\{\s*tagline\s*\}/);
    expect(source).not.toMatch(/tagline\s*:\s*["'][a-z]/);
  });

  it('le fallback par défaut reste le slogan français', () => {
    expect(translations.fr.brand.tagline).toBe(TAGLINES.fr);
  });

  it('rend le slogan du store via le composant (SSR, cas de référence fr)', async () => {
    const { KenzaLogo } = await import('./KenzaLogo');
    useAppStore.setState({ uiLanguage: 'fr' });
    const html = renderToStaticMarkup(
      React.createElement(KenzaLogo, { size: 'sm', showWordmark: true })
    );
    expect(html).toContain(TAGLINES.fr);
  });
});
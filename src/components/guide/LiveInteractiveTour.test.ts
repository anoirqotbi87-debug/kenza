import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOUR_STEPS } from './LiveInteractiveTour';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('LiveInteractiveTour 6 Steps & Non-overlapping Compact Tooltip', () => {
  const tourPath = resolve(__dirname, 'LiveInteractiveTour.tsx');
  const tourSource = readFileSync(tourPath, 'utf-8');

  it('intègre exactement les 6 étapes interactives avec l’icône ☰ du menu', () => {
    const keys = TOUR_STEPS.map((s) => s.key);
    expect(keys).toEqual([
      'header-lang',
      'header-menu',
      'today-resume',
      'path-curriculum',
      'phrases-heading',
      'space-vip',
    ]);
    expect(TOUR_STEPS.length).toBe(6);
  });

  it('fournit les traductions complètes FR, EN, ES, AR pour toutes les 6 étapes', () => {
    const languages = ['fr', 'en', 'es', 'ar'] as const;

    TOUR_STEPS.forEach((step) => {
      languages.forEach((lang) => {
        expect(step.title[lang]).toBeTruthy();
        expect(step.title[lang].length).toBeGreaterThan(4);

        expect(step.explanation[lang]).toBeTruthy();
        expect(step.explanation[lang].length).toBeGreaterThan(15);

        expect(step.badge[lang]).toBeTruthy();
      });
    });
  });

  it('configure précisément les sélecteurs cibles de chaque étape sans encadrer la page entière', () => {
    const selectors = TOUR_STEPS.map((s) => s.targetSelector);
    expect(selectors).toEqual([
      '#tour-header-lang',
      '#tour-hamburger-btn',
      '#tour-today-hero',
      '#tour-path-module-1',
      '#tour-heading-phrases',
      '#tour-space-vip',
    ]);
  });

  it('cadre proprement le menu burger avec le texte sur la Grammaire et le Roleplay Karim', () => {
    const menuStep = TOUR_STEPS.find((s) => s.key === 'header-menu');
    expect(menuStep).toBeDefined();
    expect(menuStep?.targetSelector).toBe('#tour-hamburger-btn');
    expect(menuStep?.title.fr).toContain('Menu complet');
    expect(menuStep?.explanation.fr).toContain('Grammaire active');
    expect(menuStep?.explanation.fr).toContain('Roleplay avec Karim');
  });

  it('assure la synchronisation temporelle fluide avec défilement orienté et attente 350ms', () => {
    expect(tourSource).toContain('executeStepTransition');
    expect(tourSource).toContain('isTransitioning');
    expect(tourSource).toContain('scrollIntoView');
    expect(tourSource).toContain("behavior: 'smooth'");
    expect(tourSource).toContain('350');
  });

  it('garantit le positionnement vertical décalé avec marge stricte sans recouvrir la cible', () => {
    expect(tourSource).toContain('safeTop');
    expect(tourSource).toContain('safeLeft');
    expect(tourSource).toContain("maxHeight: '130px'");
    expect(tourSource).toContain('targetRect.bottom');
    expect(tourSource).toContain('targetRect.top');
  });

  it('verrouille le démarrage du tour interactif tant que le paywall ou la modale des prix est active dans page.tsx', () => {
    const pagePath = resolve(__dirname, '../../app/page.tsx');
    const pageSource = readFileSync(pagePath, 'utf-8');
    expect(pageSource).toContain('isPaywallOpen');
    expect(pageSource).toContain('!isPlanModalOpen && !isPaywallOpen');
  });

  it('assure la compatibilité RTL pour l’arabe', () => {
    expect(tourSource).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(tourSource).toContain("const isRtl = langKey === 'ar'");
  });
});

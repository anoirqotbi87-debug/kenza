import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPOTLIGHT_STEPS } from './AppSpotlightTour';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('AppSpotlightTour & FloatingHelpHub Component', () => {
  const spotlightPath = resolve(__dirname, 'AppSpotlightTour.tsx');
  const spotlightSource = readFileSync(spotlightPath, 'utf-8');

  const hubPath = resolve(__dirname, 'FloatingHelpHub.tsx');
  const hubSource = readFileSync(hubPath, 'utf-8');

  it('intègre les 5 étapes correspondant aux 5 onglets clés de Kenza', () => {
    const tabKeys = SPOTLIGHT_STEPS.map((s) => s.tabKey);
    expect(tabKeys).toEqual(['today', 'path', 'phrases', 'review', 'space']);
    expect(SPOTLIGHT_STEPS.length).toBe(5);
  });

  it('fournit pour chaque étape les traductions complètes FR, EN, ES, AR', () => {
    const langs = ['fr', 'en', 'es', 'ar'] as const;

    SPOTLIGHT_STEPS.forEach((step) => {
      langs.forEach((lang) => {
        expect(step.title[lang]).toBeTruthy();
        expect(step.explanation[lang]).toBeTruthy();
        expect(step.badge[lang]).toBeTruthy();
        expect(step.actionAdvice[lang]).toBeTruthy();
      });
      expect(step.screenshot).toMatch(/^\/guide\/screen-/);
    });
  });

  it('supporte l’orientation RTL pour la langue arabe', () => {
    expect(spotlightSource).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(spotlightSource).toContain("const isRtl = langKey === 'ar'");
    expect(hubSource).toContain("dir={isAr ? 'rtl' : 'ltr'}");
  });

  it('contient la persistance localStorage de la visite guidée', () => {
    expect(spotlightSource).toContain("localStorage.getItem('kenza_spotlight_completed')");
    expect(spotlightSource).toContain("localStorage.setItem('kenza_spotlight_completed', 'true')");
  });

  it('le FloatingHelpHub offre un bouton circulaire d’assistance avec popover et les 3 options', () => {
    expect(hubSource).toContain('fixed z-40');
    expect(hubSource).toContain('rounded-full');
    expect(hubSource).toContain('setSpotlightOpen');
    expect(hubSource).toContain('setUserGuideOpen');
    expect(hubSource).toContain('setHelpCenterOpen');
  });
});

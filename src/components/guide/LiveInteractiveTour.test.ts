import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOUR_STEPS } from './LiveInteractiveTour';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('LiveInteractiveTour 7 Steps & Drawer Navigation', () => {
  const tourPath = resolve(__dirname, 'LiveInteractiveTour.tsx');
  const tourSource = readFileSync(tourPath, 'utf-8');

  it('intègre exactement les 7 étapes interactives avec les étapes du menu latéral', () => {
    const keys = TOUR_STEPS.map((s) => s.key);
    expect(keys).toEqual([
      'header-lang',
      'today-resume',
      'drawer-explorer',
      'drawer-roleplay',
      'path-curriculum',
      'phrases-heading',
      'space-vip',
    ]);
    expect(TOUR_STEPS.length).toBe(7);
  });

  it('fournit les traductions complètes FR, EN, ES, AR pour toutes les 7 étapes', () => {
    const languages = ['fr', 'en', 'es', 'ar'] as const;

    TOUR_STEPS.forEach((step) => {
      languages.forEach((lang) => {
        expect(step.title[lang]).toBeTruthy();
        expect(step.title[lang].length).toBeGreaterThan(4);

        expect(step.explanation[lang]).toBeTruthy();
        expect(step.explanation[lang].length).toBeGreaterThan(15);

        expect(step.badge[lang]).toBeTruthy();
        expect(step.actionAdvice[lang]).toBeTruthy();
      });
    });
  });

  it('gère l’ouverture automatique du tiroir pour les étapes de grammaire et roleplay', () => {
    const drawerExplorer = TOUR_STEPS.find((s) => s.key === 'drawer-explorer');
    const drawerRoleplay = TOUR_STEPS.find((s) => s.key === 'drawer-roleplay');

    expect(drawerExplorer?.openDrawer).toBe(true);
    expect(drawerRoleplay?.openDrawer).toBe(true);
    expect(drawerRoleplay?.closeDrawerAfter).toBe(true);
  });

  it('assure la synchronisation temporelle fluide avec masquage/réaffichage simultané', () => {
    expect(tourSource).toContain('executeStepTransition');
    expect(tourSource).toContain('isTransitioning');
    expect(tourSource).toContain('boxShadow');
    expect(tourSource).toContain('scrollIntoView');
  });

  it('ne tronque aucun titre d’en-tête (absence de truncate sur le titre)', () => {
    // Vérifie que le titre h3 dans la bulle ne possède pas la classe 'truncate'
    expect(tourSource).not.toContain('<h3 className="text-sm font-bold text-[#142943] truncate">');
  });

  it('assure la compatibilité RTL pour l’arabe', () => {
    expect(tourSource).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(tourSource).toContain("const isRtl = langKey === 'ar'");
  });
});

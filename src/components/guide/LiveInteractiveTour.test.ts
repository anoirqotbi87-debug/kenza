import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOUR_STEPS } from './LiveInteractiveTour';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('LiveInteractiveTour & HeaderHelpPopover Component', () => {
  const tourPath = resolve(__dirname, 'LiveInteractiveTour.tsx');
  const tourSource = readFileSync(tourPath, 'utf-8');

  const popoverPath = resolve(__dirname, 'HeaderHelpPopover.tsx');
  const popoverSource = readFileSync(popoverPath, 'utf-8');

  it('intègre exactement les 6 étapes interactives requises', () => {
    const keys = TOUR_STEPS.map((s) => s.key);
    expect(keys).toEqual([
      'header-lang',
      'today-next-step',
      'path-modules',
      'phrases-categories',
      'review-flashcard',
      'space-vip',
    ]);
    expect(TOUR_STEPS.length).toBe(6);
  });

  it('fournit les traductions complètes FR, EN, ES, AR pour toutes les étapes', () => {
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

  it('supporte le mécanisme spotlight, le halo lumineux et la flèche directionnelle', () => {
    expect(tourSource).toContain('boxShadow');
    expect(tourSource).toContain('border-x-transparent');
    expect(tourSource).toContain('placement');
    expect(tourSource).toContain('scrollIntoView');
  });

  it('assure l’orientation RTL pour la langue arabe', () => {
    expect(tourSource).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(tourSource).toContain("const isRtl = langKey === 'ar'");
    expect(popoverSource).toContain("dir={isAr ? 'rtl' : 'ltr'}");
  });

  it('mémorise la fin de la visite dans localStorage', () => {
    expect(tourSource).toContain("localStorage.setItem('kenza_live_tour_completed', 'true')");
  });

  it('HeaderHelpPopover propose les 3 options (Visite guidée, FAQ, VIP)', () => {
    expect(popoverSource).toContain('onStartLiveTour');
    expect(popoverSource).toContain('onOpenFaq');
    expect(popoverSource).toContain('onOpenVipPromo');
  });
});

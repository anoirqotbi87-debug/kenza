import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAQ_ITEMS } from './HelpCenterView';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('HelpCenterView & FAQ Component', () => {
  const componentPath = resolve(__dirname, 'HelpCenterView.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('contient les 5 questions obligatoires', () => {
    const questionIds = FAQ_ITEMS.map((item) => item.id);
    expect(questionIds).toContain('where-to-start');
    expect(questionIds).toContain('sound-too-fast');
    expect(questionIds).toContain('talk-to-karim');
    expect(questionIds).toContain('change-language');
    expect(questionIds).toContain('where-are-reviews');
  });

  it('fournit des traductions complètes dans les 4 langues (FR, EN, ES, AR)', () => {
    const languages = ['fr', 'en', 'es', 'ar'] as const;

    FAQ_ITEMS.forEach((item) => {
      languages.forEach((lang) => {
        expect(item.question[lang]).toBeTruthy();
        expect(item.question[lang].length).toBeGreaterThan(3);

        expect(item.answer[lang]).toBeTruthy();
        expect(item.answer[lang].length).toBeGreaterThan(15);

        expect(item.category[lang]).toBeTruthy();
      });
    });
  });

  it('gère l’orientation RTL pour la langue arabe', () => {
    expect(source).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(source).toContain("const isRtl = langKey === 'ar'");
  });

  it('intègre les icônes requises (Volume2, Mic, Languages, Brain, Compass/HelpCircle)', () => {
    expect(source).toContain('Volume2');
    expect(source).toContain('Mic');
    expect(source).toContain('Languages');
    expect(source).toContain('Brain');
    expect(source).toContain('HelpCircle');
  });

  it('supporte le mode accordéon / onglets', () => {
    expect(source).toContain('aria-expanded={isOpen}');
    expect(source).toContain('toggleItem');
    expect(source).toContain('setSelectedCategory');
  });
});

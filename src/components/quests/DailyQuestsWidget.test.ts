import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('DailyQuestsWidget component', () => {
  const componentPath = resolve(__dirname, 'DailyQuestsWidget.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('se connecte au store Zustand pour lire les quêtes quotidiennes', () => {
    expect(source).toContain('useAppStore');
    expect(source).toContain('s.dailyQuests');
    expect(source).toContain('s.ensureDailyQuests');
  });

  it('affiche le coffre bonus quotidien avec la récompense +50 XP', () => {
    expect(source).toContain('Coffre Bonus Quotidien');
    expect(source).toContain('+50 XP');
    expect(source).toContain('Gift');
  });

  it('intègre les 3 catégories de quêtes (mémoire, vocal, exploration)', () => {
    expect(source).toContain("case 'memory'");
    expect(source).toContain("case 'vocal'");
    expect(source).toContain("case 'exploration'");
  });

  it('fournit des liens d’action rapide vers les sections correspondantes', () => {
    expect(source).toContain('/revisions');
    expect(source).toContain('/parler');
    expect(source).toContain('/etudier');
  });

  it('supporte l’internationalisation complète en 4 langues avec RTL pour l’arabe', () => {
    expect(source).toContain('fr:');
    expect(source).toContain('en:');
    expect(source).toContain('es:');
    expect(source).toContain('ar:');
    expect(source).toContain("dir={isAr ? 'rtl' : 'ltr'}");
  });

  it('propose une variante compacte pour le tableau de bord d’accueil', () => {
    expect(source).toContain('export interface DailyQuestsWidgetProps');
    expect(source).toContain('compact?: boolean');
    expect(source).toContain('if (compact)');
    expect(source).toContain('viewAll:');
    expect(source).toContain('href="/revisions"');
  });
});

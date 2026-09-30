import { describe, it, expect } from 'vitest';
import { PREMIUM_MODULES, isModuleLocked } from './premiumModules';

/**
 * Regle d'acces unique : les modules 1 et 2 sont gratuits pour tous,
 * les modules 3 a 7 sont reserves aux abonnes Kenza Pro.
 */
describe('PREMIUM_MODULES', () => {
  it('est exactement la liste 3 a 7, dans l ordre', () => {
    expect(PREMIUM_MODULES).toEqual(['3', '4', '5', '6', '7']);
  });
});

describe('isModuleLocked — utilisateur gratuit (isPremium = false)', () => {
  it.each(['1', '2'])('laisse passer le module %s', (moduleId) => {
    expect(isModuleLocked(moduleId, false)).toBe(false);
  });

  it.each(['3', '4', '5', '6', '7'])('bloque le module %s', (moduleId) => {
    expect(isModuleLocked(moduleId, false)).toBe(true);
  });
});

describe('isModuleLocked — utilisateur premium (isPremium = true)', () => {
  it.each(['1', '2', '3', '4', '5', '6', '7'])('laisse passer le module %s', (moduleId) => {
    expect(isModuleLocked(moduleId, true)).toBe(false);
  });
});

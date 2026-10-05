import { describe, expect, it } from 'vitest';
import { ARABIZI_GUIDE } from '@/data/arabiziGuide';
import type { ArabiziSound } from '@/data/arabiziGuide';

const ARABIC = /[\u0600-\u06FF]/;

describe('arabiziGuide — mini-guide phonétique des chiffres Arabizi', () => {
  it('couvre les 5 chiffres indispensables, dans le bon ordre', () => {
    expect(ARABIZI_GUIDE.map((s) => s.number)).toEqual(['2', '3', '5', '7', '9']);
  });

  it('chaque son a un numéro unique, une lettre arabe et une explication anatomique', () => {
    for (const sound of ARABIZI_GUIDE as ArabiziSound[]) {
      expect(sound.number).toBeTruthy();
      expect(sound.arabicLetter.trim().length).toBeGreaterThan(0);
      expect(sound.name.trim().length).toBeGreaterThan(0);
      expect(sound.anatomicalTip.trim().length).toBeGreaterThan(10);
    }
    expect(new Set(ARABIZI_GUIDE.map((s) => s.number)).size).toBe(5);
  });

  it('chaque son propose au moins 2 exemples vocalisés (chakl complet)', () => {
    for (const sound of ARABIZI_GUIDE) {
      expect(sound.examples.length).toBeGreaterThanOrEqual(2);
      for (const ex of sound.examples) {
        expect(ex.arabizi.trim().length).toBeGreaterThan(0);
        expect(ARABIC.test(ex.arabicWithTashkeel), `${sound.number}: ${ex.arabizi}`).toBe(true);
        expect(ex.french.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('chaque exemple est unique au sein de son chiffre', () => {
    for (const sound of ARABIZI_GUIDE) {
      const arabizi = sound.examples.map((e) => e.arabizi);
      expect(new Set(arabizi).size, sound.number).toBe(arabizi.length);
    }
  });
});
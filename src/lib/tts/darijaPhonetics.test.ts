import { describe, it, expect } from 'vitest';
import { normalizeDarija, sanitizeArabicForDarijaTts, DARIJA_PHONETIC_MAP } from './darijaPhonetics';

describe('normalizeDarija', () => {
  it("donne la priorité au texte arabe (vocalisé/chakl) transmis pour la synthèse et applique l'assimilation", () => {
    const arabizi = 'Salam kidayr';
    const arabeVocalise = 'سَلَامْ كِي دَايْرْ';
    expect(normalizeDarija(arabizi, arabeVocalise)).toBe(arabeVocalise);
  });

  it('applique l’assimilation solaire de l’article الـ (ex: السلام -> اسّلام)', () => {
    expect(sanitizeArabicForDarijaTts('السلام')).toBe('اسّلام');
    expect(sanitizeArabicForDarijaTts('الرّاس')).toBe('ارّاس');
  });

  it('retombe sur la carte phonétique arabizi→arabe si aucun texte arabe fourni', () => {
    expect(normalizeDarija('3afak')).toBe('عافاك');
    expect(normalizeDarija('9hwa')).toBe('قْهوة');
  });

  it('convertit mot par mot et caractère par caractère en arabe hors carte connue', () => {
    expect(normalizeDarija('wash ghadi 3la 7al')).toBe('wash غadi عla حal');
  });

  it('ignore un arabicText vide et utilise le texte principal avec la prononciation darija', () => {
    // 'salam' est mappé sur 'السّْلامْ' avec assimilation solaire -> 'اسّْلامْ'
    expect(normalizeDarija('salam', '   ')).toBe('اسّْلامْ');
  });

  it('la carte phonétique contient bien des entrées vocalisées authentiques sans tanween', () => {
    expect(DARIJA_PHONETIC_MAP['shukran']).toBe('شُكْراً');
    expect(DARIJA_PHONETIC_MAP['9hwa']).toBe('قْهوة');
    expect(DARIJA_PHONETIC_MAP['salam']).toBe('السّْلامْ');
  });
});
import { describe, it, expect } from 'vitest';
import { normalizeDarija, DARIJA_PHONETIC_MAP } from './darijaPhonetics';

describe('normalizeDarija', () => {
  it("donne la priorité au texte arabe (vocalisé/chakl) transmis pour la synthèse", () => {
    const arabizi = 'Salam kidayr';
    const arabeVocalise = 'سَلَامْ كِي دَايْرْ';
    expect(normalizeDarija(arabizi, arabeVocalise)).toBe(arabeVocalise);
  });

  it('retombe sur la carte phonétique arabizi→arabe si aucun texte arabe fourni', () => {
    expect(normalizeDarija('3afak')).toBe('عافاك');
    expect(normalizeDarija('9hwa')).toBe('قْهوة');
  });

  it('convertit caractère par caractère en arabe hors carte connue (3/7/9/kh/gh uniquement)', () => {
    expect(normalizeDarija('wash ghadi 3la 7al')).toBe('wash غadi عla حal');
  });

  it('ignore un arabicText vide et utilise le texte principal', () => {
    expect(normalizeDarija('salam', '   ')).toBe('السّلامُ');
  });

  it('la carte phonétique contient bien des entrées vocalisées utiles au TTS', () => {
    expect(DARIJA_PHONETIC_MAP['shukran']).toBe('شُكراً');
    expect(DARIJA_PHONETIC_MAP['9hwa']).toBe('قْهوة');
  });
});
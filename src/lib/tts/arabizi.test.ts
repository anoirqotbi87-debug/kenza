import { describe, it, expect } from 'vitest';
import { arabiziToArabicWord, translateArabiziText, isMostlyArabizi } from './arabizi';

describe('arabizi → arabe (translittération TTS)', () => {
  describe('isMostlyArabizi', () => {
    it('détecte un texte purement latin comme arabizi', () => {
      expect(isMostlyArabizi('bghit 9hwa nss-nss')).toBe(true);
      expect(isMostlyArabizi('Salam, labas?')).toBe(true);
    });

    it('exclut un texte déjà arabe', () => {
      expect(isMostlyArabizi('بغيت قهوة نص نص')).toBe(false);
      expect(isMostlyArabizi('السلام')).toBe(false);
    });

    it('exclut un texte mixte où le latin est parasite', () => {
      expect(isMostlyArabizi('[ARZ] bghit 9hwa')).toBe(true);
      expect(isMostlyArabizi('بغيت قهوة نص نص')).toBe(false);
    });
  });

  describe('arabiziToArabicWord', () => {
    it('convertit les chiffres arabizi (3/7/9/5)', () => {
      expect(arabiziToArabicWord('9hwa')).toContain('ق');
      expect(arabiziToArabicWord('3afak')).toContain('ع');
      expect(arabiziToArabicWord('7al')).toContain('ح');
      expect(arabiziToArabicWord('5obz')).toContain('خ');
    });

    it('gère les digraphes kh/gh/sh', () => {
      // 'khobz'/'shwiya' sont au lexique : prononciation vocalisée authentique
      expect(arabiziToArabicWord('khobz')).toBe('خْبز');
      expect(arabiziToArabicWord('ghadi')).toBe('غادي');
      expect(arabiziToArabicWord('shwiya')).toBe('شويّة');
      expect(arabiziToArabicWord('chwiya')).toBe('شويّة');
    });

    it('résout les mots du lexique vers leur vocalisation authentique', () => {
      expect(arabiziToArabicWord('salam')).toBe('السّْلامْ');
      expect(arabiziToArabicWord('bslama')).toBe('بْسْلامة');
    });

    it('élide les voyelles pour un mot hors lexique', () => {
      expect(arabiziToArabicWord('sir')).toBe('سر');
    });

    it('conserve un mot déjà en arabe', () => {
      expect(arabiziToArabicWord('سوق')).toBe('سوق');
    });
  });

  describe('translateArabiziText (phrases complètes)', () => {
    it('traduit une phrase arabizi via le lexique quand la clé existe', () => {
      const out = translateArabiziText('bghit 9hwa nss-nss');
      // via le lexique '9hwa' -> 'قْهوة', 'bghit' -> 'بغيت'
      expect(out).toContain('قْهوة');
      expect(out).toContain('بغيت');
    });

    it('assemble une phrase avec translittération des mots hors lexique', () => {
      const out = translateArabiziText('salam labas');
      expect(out).toContain('السّْلام');
      expect(out).toContain('لاباس');
    });

    it('ne coupe pas sur les tirets composés du lexique', () => {
      expect(translateArabiziText('ma-bghit-ch')).toContain('بغيت');
    });

    it('préserve les mots arabes d’une phrase mixte', () => {
      const out = translateArabiziText('ghadi سوق');
      expect(out).toContain('غادي');
      expect(out).toContain('سوق');
    });
  });
});
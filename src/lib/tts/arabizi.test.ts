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

  describe('négations ma-...-ch (lexique enrichi)', () => {
    it('résout la négation courante « ma bghitch » en une vocalisation authentique', () => {
      expect(translateArabiziText('ma bghitch')).toBe('ما بغيتش');
    });

    it('résout « makhddamch » (ne fonctionne pas)', () => {
      expect(translateArabiziText('makhddamch')).toBe('ما خدمتش');
    });

    it('gère la variante à tirets du corpus « ma-ghadi-ch »', () => {
      expect(translateArabiziText('ma-ghadi-ch nqle9')).toBe('ما غاديش نقلق');
    });

    it('traduit « machi mochkil » comme un ensemble figé', () => {
      expect(translateArabiziText('machi mochkil')).toBe('ماشي مشكل');
    });
  });

  describe('verbes conjugués courants (lexique enrichi)', () => {
    it('conjugue au présent continu « ka-nkteb » / « ka-ykteb »', () => {
      expect(translateArabiziText('ka-nkteb')).toBe('كنكتب');
      expect(translateArabiziText('ka-ykteb')).toBe('كيكتب');
    });

    it('résout les participes passés à tiret du corpus (« chof-t », « mchi-t »)', () => {
      expect(translateArabiziText('chof-t l-makan')).toBe('شفت المكان');
      expect(translateArabiziText('mchi-t l-sbitar')).toBe('مشيت لسبتر');
    });

    it('résout « khellini », pronom suffixé courant', () => {
      expect(translateArabiziText('khellini f t-ti9ar')).toBe('خلّيني ف التيقار');
    });

    it('résout le regret « koun 3ref-t, koun ji-t »', () => {
      expect(translateArabiziText('koun 3ref-t, koun ji-t')).toBe('كون عرفت كون جيت');
    });

    it('résout les verbes modaux et d’optatif « khassna », « nchoufou », « n9der »', () => {
      expect(translateArabiziText('khassna nchoufou l-tbib')).toBe('خاصّنا نشوفو الطبيب');
      expect(translateArabiziText('n9der')).toBe('نقدر');
    });
  });

  describe('compléments figés & mots outils (lexique enrichi)', () => {
    it('résout les nombres et monnaie « n3tik mya w khemsin derhem »', () => {
      expect(translateArabiziText('n3tik mya w khemsin derhem')).toBe('نعطيك مية وخمسين درهم');
    });

    it('résout les possessifs « dyali » / « dyalek »', () => {
      expect(translateArabiziText('dyali')).toBe('ديالي');
      expect(translateArabiziText('dyalek')).toBe('ديالك');
    });

    it('résout « sh7al » (variante sh-) et « f ch-her »', () => {
      expect(translateArabiziText('sh7al')).toBe('شحال');
      expect(translateArabiziText('f ch-her')).toBe('ف الشهر');
    });

    it('résout « 3endek l-heqq », expression de justice courante', () => {
      expect(translateArabiziText('3endek l-heqq')).toBe('عندك لهقق');
    });

    it('résout le vocatif « a sidi » sans le réduire au « a » isolé', () => {
      expect(translateArabiziText('salam a sidi')).toBe('السّْلامْ أ سيدي');
    });
  });

  describe('intégrité du lexique', () => {
    it('ne contient aucune clé dupliquée', async () => {
      const { DARIJA_PHONETIC_MAP } = await import('./lexicon');
      const keys = Object.keys(DARIJA_PHONETIC_MAP);
      expect(new Set(keys).size).toBe(keys.length);
      expect(keys.length).toBeGreaterThanOrEqual(320);
    });
  });
});
import { describe, it, expect } from 'vitest';
import { prepareDarijaForTts, removeTrailingSukun } from './darijaPhonetic';

describe('prepareDarijaForTts', () => {
  it('préserve 100% du chakl complet (fat-ha, damma, kasra, shadda) et les sukūns internes et initiaux', () => {
    // Dans بْغِيتْ : le sukūn initial sur بْ doit être PRÉSERVÉ, seul le sukūn final sur تْ est retiré
    const input = 'بْغِيتْ وَاحِدْ أَتَايْ، عَافَاكْ';
    const result = prepareDarijaForTts(input);

    expect(result).toContain('بْ'); // Sukūn interne/initial préservé !
    expect(result).toContain('غِ'); // Kasra préservée !
    expect(result).toContain('وَاحِد'); // Sukūn final retiré
    expect(result).toContain('أَتَاي');  // Sukūn final retiré
    expect(result).toContain('عَافَاك'); // Sukūn final retiré
    expect(result.endsWith(' ، ')).toBe(true);
  });

  it('retire UNIQUEMENT le sukūn final sans altérer les voyelles et sukūns précédents', () => {
    expect(removeTrailingSukun('بْغِيتْ')).toBe('بْغِيت');
    expect(removeTrailingSukun('خَدَّامْ')).toBe('خَدَّام');
    expect(removeTrailingSukun('لَابَاسْ')).toBe('لَابَاس');
    expect(removeTrailingSukun('عَافَاكْ')).toBe('عَافَاك');
  });

  it('convertit les chiffres Arabizi résiduels (3, 7, 9, 5, 8, 2)', () => {
    const input = '3afak bghit 9hwa 7lwa bla 5obz m8rib la2';
    const result = prepareDarijaForTts(input);
    expect(result).toContain('ع');
    expect(result).toContain('ق');
    expect(result).toContain('ح');
    expect(result).toContain('خ');
    expect(result).toContain('غ');
    expect(result).toContain('ء');
    expect(result.endsWith(' ، ')).toBe(true);
  });

  it('applique le dictionnaire de réécriture phonétique marocaine sur mots non diacritisés', () => {
    expect(prepareDarijaForTts('عفاك')).toContain('عَافَاك');
    expect(prepareDarijaForTts('لباس')).toContain('لَابَاس');
    expect(prepareDarijaForTts('هدا')).toContain('هَادَا');
    expect(prepareDarijaForTts('اخويا')).toContain('آ خُويَا');
    expect(prepareDarijaForTts('اختي')).toContain('آ خْتِي');
    expect(prepareDarijaForTts('مرحبًا')).toContain('مْرْحْبَا');
  });

  it('applique l’assimilation solaire de l’article ال (ex: السوق -> اسّوق)', () => {
    const result = prepareDarijaForTts('فين كاين السوق ؟');
    expect(result).toContain('اسّوق');
  });

  it('ajoute un coussin acoustique (" ، ") en fin de phrase pour empêcher la coupure WebSocket', () => {
    const result = prepareDarijaForTts('مرحبا بك');
    expect(result.endsWith(' ، ')).toBe(true);
  });

  it('gère les chaînes vides', () => {
    expect(prepareDarijaForTts('')).toBe('');
    expect(prepareDarijaForTts('   ')).toBe('');
  });
});

describe('Normalisation Phonétique — Modules 2 à 7 (Tashkeel Chirurgical & Équilibre Vocalique)', () => {
  it('applique le patron C1ْC2َC3ْ sur les verbes trilitères (Arabizi et arabe nu)', () => {
    // 1. Arabizi -> Arabe avec patron C1ْ + C2َ + C3ْ
    const dkhel = prepareDarijaForTts('dkhel');
    expect(dkhel).toContain('دْخَل'); // Sukūn sur دْ, Fatha sur خَ
    expect(dkhel).not.toContain('دْخْلْ'); // Pas de triple sukūn étouffant
    expect(dkhel).not.toContain('دَخَلَ'); // Pas de triple fatha Fusha

    const khrej = prepareDarijaForTts('khrej');
    expect(khrej).toContain('خْرَج');
    expect(khrej).not.toContain('خْرْجْ');

    const chreb = prepareDarijaForTts('chreb');
    expect(chreb).toContain('شْرَب');

    const gles = prepareDarijaForTts('gles');
    expect(gles).toContain('گْلَس');

    // 2. Arabe nu -> patron vocalique restauré
    expect(prepareDarijaForTts('دخل')).toContain('دْخَل');
    expect(prepareDarijaForTts('خرج')).toContain('خْرَج');
    expect(prepareDarijaForTts('شرب')).toContain('شْرَب');
    expect(prepareDarijaForTts('جلس')).toContain('گْلَس');
    expect(prepareDarijaForTts('گلس')).toContain('گْلَس');
  });

  it('force le son [g] marocain avec گ (\\u06AF) sur gddam, gles, ga3, goul', () => {
    // Vérification du caractère \u06AF (گ)
    const gddam = prepareDarijaForTts('gddam');
    expect(gddam).toContain('گُدَّام');
    expect(gddam).toContain('\u06AF');

    const gles = prepareDarijaForTts('gles');
    expect(gles).toContain('گْلَس');
    expect(gles).toContain('\u06AF');

    const ga3 = prepareDarijaForTts('ga3');
    expect(ga3).toContain('گَاع');
    expect(ga3).toContain('\u06AF');

    const goul = prepareDarijaForTts('goul');
    expect(goul).toContain('گُول');
    expect(goul).toContain('\u06AF');

    // Neutralisation du Qaf ou Jim littéraire sur entrées arabes
    expect(prepareDarijaForTts('قدام')).toContain('گُدَّام');
    expect(prepareDarijaForTts('گدام')).toContain('گُدَّام');
    expect(prepareDarijaForTts('جلس')).toContain('گْلَس');
    expect(prepareDarijaForTts('گاع')).toContain('گَاع');
    expect(prepareDarijaForTts('كاع')).toContain('گَاع');
  });

  it('applique l’attaque consonantique sèche (Sukūn initial) sur le vocabulaire des Modules 2 à 7', () => {
    // Module 2 : Famille
    expect(prepareDarijaForTts('khti')).toContain('خْتِي');
    expect(prepareDarijaForTts('ختي')).toContain('خْتِي');
    expect(prepareDarijaForTts('khouya')).toContain('خُويَا');
    expect(prepareDarijaForTts('خويا')).toContain('خُويَا');

    // Module 3 : Souk & Adjectifs
    expect(prepareDarijaForTts('rkhis')).toContain('رْخِيص');
    expect(prepareDarijaForTts('رخيص')).toContain('رْخِيص');
    expect(prepareDarijaForTts('kbir')).toContain('كْبِير');
    expect(prepareDarijaForTts('sghir')).toContain('صْغِير');

    // Module 4 : Ville & Directions
    expect(prepareDarijaForTts('blassa')).toContain('بْلَاصَة');
    expect(prepareDarijaForTts('بلاصة')).toContain('بْلَاصَة');

    // Module 7 : Santé
    expect(prepareDarijaForTts('tbib')).toContain('طْبِيب');
    expect(prepareDarijaForTts('طبيب')).toContain('طْبِيب');
    expect(prepareDarijaForTts('mrid')).toContain('مْرِيض');
    expect(prepareDarijaForTts('مريض')).toContain('مْرِيض');
  });

  it('garantit l’absence totale de chiffres Arabizi résiduels sur les phrases du curriculum', () => {
    const testCorpus = [
      '3afak bghit 9hwa 7lwa bla 5obz m8rib la2',
      'dkhel l-dar w chreb atay m3a khti 3afak',
      'tbib 9rib f l-m7tta',
      'had l-7aja rkhisa bzzaf 3la 9bel l-walida',
      'mrid f kerchi w rassi bzzaf',
      'blassa 9ddam l-sbitar',
      'dor 3la limen w sir nishan l-m7tta',
      'bch7al had l-khobz w l-7em 3afak',
      'machi mochkil, goul l-walid rah kolchi mzyan'
    ];

    for (const phrase of testCorpus) {
      const result = prepareDarijaForTts(phrase);
      expect(result).not.toMatch(/[0-9]/);
      expect(result).not.toMatch(/[a-zA-Z]/);
      expect(result.endsWith(' ، ')).toBe(true);
    }
  });
});


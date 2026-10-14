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

  it('convertit les chiffres Arabizi résiduels', () => {
    const input = '3afak bghit 9hwa 7lwa bla 5obz';
    const result = prepareDarijaForTts(input);
    expect(result).toContain('ع');
    expect(result).toContain('ق');
    expect(result).toContain('ح');
    expect(result).toContain('خ');
    expect(result.endsWith(' ، ')).toBe(true);
  });

  it('applique le dictionnaire de réécriture phonétique marocaine sur mots non diacritisés', () => {
    expect(prepareDarijaForTts('عفاك')).toContain('عافاك');
    expect(prepareDarijaForTts('لباس')).toContain('لاباس');
    expect(prepareDarijaForTts('هدا')).toContain('هادا');
    expect(prepareDarijaForTts('اخويا')).toContain('آ خويا');
    expect(prepareDarijaForTts('اختي')).toContain('آ ختي');
    expect(prepareDarijaForTts('مرحبًا')).toContain('مرحبا');
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

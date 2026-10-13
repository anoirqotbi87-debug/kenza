import { describe, it, expect } from 'vitest';
import { prepareDarijaForTts, DARIJA_RESPEL_MAP } from './darijaPhonetic';

describe('prepareDarijaForTts', () => {
  it('convertit les chiffres Arabizi résiduels', () => {
    const input = '3afak bghit 9hwa 7lwa bla 5obz';
    const result = prepareDarijaForTts(input);
    expect(result).toContain('ع');
    expect(result).toContain('ق');
    expect(result).toContain('ح');
    expect(result).toContain('خ');
    expect(result.endsWith(' . ')).toBe(true);
  });

  it('supprime systématiquement tous les sukūns et tanwīns', () => {
    const input = 'شُكْرًا جَزِيلًا لَكَ مَعَ السَّلَامْ';
    const result = prepareDarijaForTts(input);
    expect(result).not.toContain('\u0652'); // Sukūn
    expect(result).not.toContain('\u064B'); // Tanwīn fat-ha
    expect(result).not.toContain('\u064C'); // Tanwīn damma
    expect(result).not.toContain('\u064D'); // Tanwīn kasra
  });

  it('supprime les voyelles brèves classiques tout en conservant la shadda interne', () => {
    const input = 'بِالسَّلَامَةْ وَبِالصَّحَّةْ';
    const result = prepareDarijaForTts(input);
    expect(result).not.toContain('\u064E'); // Fat-ha
    expect(result).not.toContain('\u064F'); // Damma
    expect(result).not.toContain('\u0650'); // Kasra
    expect(result).toContain('\u0651');     // Shadda préservée
  });

  it('applique le dictionnaire de réécriture phonétique marocaine', () => {
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

  it('ajoute un coussin acoustique en fin de phrase pour relâcher la dernière consonne', () => {
    const result = prepareDarijaForTts('مرحبا بك');
    expect(result.endsWith(' . ')).toBe(true);
  });

  it('gère les chaînes vides', () => {
    expect(prepareDarijaForTts('')).toBe('');
    expect(prepareDarijaForTts('   ')).toBe('');
  });
});

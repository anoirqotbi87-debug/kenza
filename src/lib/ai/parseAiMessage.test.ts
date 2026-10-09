import { describe, expect, it } from 'vitest';
import { parseAiMessage, extractCleanArabicForTts } from './parseAiMessage';

describe('parseAiMessage', () => {
  it('conserve le premier caractère arabe dans chaque réplique roleplay', () => {
    const samples = [
      '[AR] فِينْ غَادِي عَفَاكْ ؟\n[ARZ] Fin ghadi 3afak ?\n[FR] Où vas-tu ?',
      '[AR]بُوجْلُودْ، رْكَبْ\n[ARZ] Boujloud, rkb\n[FR] Boujloud, monte',
      '[AR] سَلَامْ ! فِينْ غَادِيْ أَ خُويَا ؟',
      '[FR] Bonjour.\n[AR] وَعَلَيْكُمُ السَّلَامْ',
    ];

    for (const sample of samples) {
      const { ar } = parseAiMessage(sample);
      expect(ar.length, `longueur pour "${sample.slice(0, 20)}"`).toBeGreaterThan(0);
      // Le premier caractère attendu est un glyphe arabe, jamais un caractère
      // tronqué (ce qui donnerait un code point hors plage arabe ou un contrôle).
      const first = ar.codePointAt(0)!;
      expect(first, `premier code point pour "${ar}"`).toBeGreaterThanOrEqual(0x0600);
      expect(first, `premier code point pour "${ar}"`).toBeLessThanOrEqual(0x06ff);
    }
  });

  it('neutralise les caractères invisibles qui précèdent le texte', () => {
    const { ar } = parseAiMessage('');
    expect(ar).toBe('');
  });

  it('ignore les caractères invisibles de tête (BOM, ZWSP, marques RTL)', () => {
    const cases: Array<[string, string]> = [
      ['\uFEFF[AR] فِينْ غَادِي عَفَاكْ ؟\n[FR] Où vas-tu ?', 'فِينْ غَادِي عَفَاكْ ؟'],
      ['\u200B[AR] بُوجْلُودْ، رْكَبْ', 'بُوجْلُودْ، رْكَبْ'],
      ['\u200F\u200F[AR] سَلَامْ ا خُويَا\n[ARZ] Salam a khoya\n[FR] Bonjour', 'سَلَامْ ا خُويَا'],
      ['[AR]\nفِينْ غَادِي عَفَاكْ ؟', 'فِينْ غَادِي عَفَاكْ ؟'],
      ['[AR]\r\nبُوجْلُودْ، رْكَبْ', 'بُوجْلُودْ، رْكَبْ'],
    ];

    for (const [input, expected] of cases) {
      const { ar } = parseAiMessage(input);
      expect(ar).toBe(expected);
    }
  });

  it('parse les trois champs indépendamment', () => {
    const { ar, arz, fr } = parseAiMessage('[AR] سَلَامْ [ARZ] Salam [FR] Bonjour');
    expect(ar).toBe('سَلَامْ');
    expect(arz).toBe('Salam');
    expect(fr).toBe('Bonjour');
  });

  it('ne s’écrase pas si un marqueur arrive dans le désordre', () => {
    const { ar, arz, fr } = parseAiMessage('[FR] Bonjour [ARZ] Salam [AR] سَلَامْ');
    expect(ar).toBe('سَلَامْ');
    expect(arz).toBe('Salam');
    expect(fr).toBe('Bonjour');
  });

  it('repli sur le texte arabe même sans balises', () => {
    const { ar, arz, fr } = parseAiMessage('وَعَلَيْكُمُ السَّلَامْ');
    expect(ar).toBe('وَعَلَيْكُمُ السَّلَامْ');
    expect(arz).toBe('');
    expect(fr).toBe('');
  });

  it('neutralise une diacritique isolée émise en tête par le modèle', () => {
    // Gemini peut émettre une kasra/damma isolée AVANT la consonne : « ِينْ ».
    // La diacritique flottante est retirée pour qu'aucune voyelle isolée ne
    // précède le début du mot.
    const cases: Array<[string, string]> = [
      ['[AR] ِينْ غَادِي عَفَاكْ ؟\n[FR] Où vas-tu ?', 'ينْ غَادِي عَفَاكْ ؟'],
      ['[AR]ُوجْلُودْ، رْكَبْ', 'وجْلُودْ، رْكَبْ'],
      ['[AR]\u200Fُوجْلُودْ، رْكَبْ\n[ARZ] Boujloud, rkb', 'وجْلُودْ، رْكَبْ'],
      ['[AR]\u061Cفِينْ غَادِي عَفَاكْ ؟', 'فِينْ غَادِي عَفَاكْ ؟'],
    ];
    for (const [input, expected] of cases) {
      const { ar } = parseAiMessage(input);
      expect(ar).toBe(expected);
    }
  });

  it('ne supprime jamais un glyphe arabe visible en tête de champ', () => {
    const { ar } = parseAiMessage('[AR] فِينْ غَادِي عَفَاكْ ؟\n[ARZ] Fin ghadi 3afak ?');
    expect(ar).toBe('فِينْ غَادِي عَفَاكْ ؟');
  });

  it('gère le format [AR] ... [/AR] et [TR] ... [/TR]', () => {
    const { ar, fr } = parseAiMessage('[AR] فِينْ غَادِي أَ خُويَا ؟ [/AR]\n[TR] Où vas-tu mon frère ? [/TR]');
    expect(ar).toBe('فِينْ غَادِي أَ خُويَا ؟');
    expect(fr).toBe('Où vas-tu mon frère ?');
  });
});

describe('extractCleanArabicForTts', () => {
  it('extrait chirurgicalement le texte arabe pur depuis une réponse tripartite', () => {
    const raw = `[AR] وَعَلَيْكُمُ السَّلَامْ ! فِينْ غَادِي أَخُويَا ؟ [/AR]
[ARZ] Wa 3alaykoum salam ! Fin ghadi a khoya ? [/ARZ]
[FR] Bonjour ! Où vas-tu mon frère ? [/FR]`;
    const clean = extractCleanArabicForTts(raw);
    expect(clean).toBe('وَعَلَيْكُمُ السَّلَامْ ! فِينْ غَادِي أَخُويَا ؟');
  });

  it('élimine les balises orphelines, caractères latins, chiffres et parenthèses', () => {
    const raw = '[AR] (مَرْحْبَا) bghit nemchi 123 [/AR]';
    const clean = extractCleanArabicForTts(raw);
    expect(clean).toBe('مَرْحْبَا');
  });

  it('gère une chaîne déjà propre ou du texte arabe pur', () => {
    const raw = 'أَهْلًا بيكْ ! شْنُو نْجِيبْ لِكْ تْشْرَبْ ؟';
    const clean = extractCleanArabicForTts(raw);
    expect(clean).toBe('أَهْلًا بيكْ ! شْنُو نْجِيبْ لِكْ تْشْرَبْ ؟');
  });

  it('gère les chaînes vides', () => {
    expect(extractCleanArabicForTts('')).toBe('');
  });
});
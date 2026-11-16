import { describe, it, expect } from 'vitest';
import { MODULES_8_10_DATA } from '@/data/modules8to10';
import type { AdvancedModule, ModuleUnit, ModuleUnitWord } from '@/data/modules8to10';

const LANGS = ['fr', 'en', 'es', 'ar'] as const;

/**
 * Expression régulière pour détecter la présence de Tashkeel (diacritiques arabes) :
 * \u064B-\u0652 : Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun
 * \u0670 : Alif suscrit (dagger alif)
 */
const TASHKEEL_REGEX = /[\u064B-\u0652\u0670]/;

function expectCompleteText(value: unknown, label: string) {
  expect(value, label).toBeTruthy();
  for (const lang of LANGS) {
    expect((value as Record<string, string>)[lang], `${label}.${lang}`).toBeTruthy();
    expect((value as Record<string, string>)[lang].trim().length, `${label}.${lang} non-empty`).toBeGreaterThan(0);
  }
}

describe('MODULES_8_10_DATA - Modules Avancés C1 & C2', () => {
  it('contient exactement les 3 modules avancés 8, 9 et 10', () => {
    expect(MODULES_8_10_DATA).toHaveLength(3);
    const moduleNumbers = MODULES_8_10_DATA.map((m: AdvancedModule) => m.moduleNumber);
    expect(moduleNumbers).toEqual([8, 9, 10]);

    const moduleIds = MODULES_8_10_DATA.map((m: AdvancedModule) => m.id);
    expect(moduleIds).toEqual([8, 9, 10]);
  });

  it('respecte la hiérarchie des niveaux CECRL (C1 pour modules 8 & 9, C2 pour module 10)', () => {
    const [mod8, mod9, mod10] = MODULES_8_10_DATA;
    expect(mod8.level).toBe('C1');
    expect(mod9.level).toBe('C1');
    expect(mod10.level).toBe('C2');
  });

  it('définit les titres et descriptions des modules dans les 4 langues (fr, en, es, ar)', () => {
    for (const mod of MODULES_8_10_DATA) {
      expectCompleteText(mod.title, `Module ${mod.id} title`);
      expectCompleteText(mod.description, `Module ${mod.id} description`);
    }
  });

  describe('Structure des Unités', () => {
    it('contient exactement 3 unités par module (total 9 unités)', () => {
      let totalUnits = 0;
      for (const mod of MODULES_8_10_DATA) {
        expect(mod.units).toHaveLength(3);
        totalUnits += mod.units.length;
      }
      expect(totalUnits).toBe(9);
    });

    it('attribue des identifiants d’unités uniques et cohérents (unit_X_Y)', () => {
      const unitIds: string[] = [];
      for (const mod of MODULES_8_10_DATA) {
        for (let uIdx = 0; uIdx < mod.units.length; uIdx++) {
          const unit = mod.units[uIdx];
          expect(unit.id).toBe(`unit_${mod.moduleNumber}_${uIdx + 1}`);
          unitIds.push(unit.id);
        }
      }
      expect(new Set(unitIds).size).toBe(9);
    });

    it('définit les métadonnées de chaque unité dans les 4 langues', () => {
      for (const mod of MODULES_8_10_DATA) {
        for (const unit of mod.units) {
          expectCompleteText(unit.title, `Unit ${unit.id} title`);
          expectCompleteText(unit.description, `Unit ${unit.id} description`);
        }
      }
    });
  });

  describe('Vocabulaire et Mots (ModuleUnitWord)', () => {
    const allWords: ModuleUnitWord[] = MODULES_8_10_DATA.flatMap((m: AdvancedModule) =>
      m.units.flatMap((u: ModuleUnit) => u.words)
    );

    it('contient un total de 54 mots (6 mots par unité)', () => {
      expect(allWords).toHaveLength(54);
      for (const mod of MODULES_8_10_DATA) {
        for (const unit of mod.units) {
          expect(unit.words, `Mots pour l'unité ${unit.id}`).toHaveLength(6);
        }
      }
    });

    it('n’a aucun identifiant de mot en double', () => {
      const wordIds = allWords.map((w) => w.id);
      expect(new Set(wordIds).size).toBe(allWords.length);
    });

    it('fournit arabizi, arabe et traduction 4 langues pour chaque mot', () => {
      for (const word of allWords) {
        expect(word.arabizi.trim(), `Word ${word.id} arabizi`).toBeTruthy();
        expect(word.arabic.trim(), `Word ${word.id} arabic`).toBeTruthy();
        expectCompleteText(word.translation, `Word ${word.id} translation`);
      }
    });

    it('valide l’intégrité des exemples de phrases s’ils sont fournis', () => {
      const wordsWithExamples = allWords.filter((w) => w.example);
      expect(wordsWithExamples.length).toBeGreaterThan(0);

      for (const word of wordsWithExamples) {
        const ex = word.example!;
        expect(ex.arabizi.trim(), `Example arabizi for ${word.id}`).toBeTruthy();
        expect(ex.arabic.trim(), `Example arabic for ${word.id}`).toBeTruthy();
        expectCompleteText(ex.translation, `Example translation for ${word.id}`);
        expect(
          TASHKEEL_REGEX.test(ex.arabic),
          `L'exemple en arabe pour '${word.id}' (${ex.arabic}) doit comporter du Tashkeel`
        ).toBe(true);
      }
    });
  });

  describe('Conformité Phonétique & Tashkeel Chirurgical (100%)', () => {
    const allWords: ModuleUnitWord[] = MODULES_8_10_DATA.flatMap((m: AdvancedModule) =>
      m.units.flatMap((u: ModuleUnit) => u.words)
    );

    it('chaque mot arabe possède un Tashkeel chirurgical pour garantir la prononciation', () => {
      const wordsMissingTashkeel: { id: string; arabizi: string; arabic: string }[] = [];

      for (const word of allWords) {
        if (!TASHKEEL_REGEX.test(word.arabic)) {
          wordsMissingTashkeel.push({
            id: word.id,
            arabizi: word.arabizi,
            arabic: word.arabic,
          });
        }
      }

      expect(
        wordsMissingTashkeel,
        `Mots arabes sans Tashkeel détectés: ${JSON.stringify(wordsMissingTashkeel)}`
      ).toEqual([]);
    });

    it('le titre en arabe de chaque module et unité comporte du Tashkeel', () => {
      for (const mod of MODULES_8_10_DATA) {
        expect(
          TASHKEEL_REGEX.test(mod.title.ar),
          `Le titre arabe du module ${mod.id} (${mod.title.ar}) doit comporter du Tashkeel`
        ).toBe(true);

        for (const unit of mod.units) {
          expect(
            TASHKEEL_REGEX.test(unit.title.ar),
            `Le titre arabe de l'unité ${unit.id} (${unit.title.ar}) doit comporter du Tashkeel`
          ).toBe(true);
        }
      }
    });
  });
});

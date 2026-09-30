import { describe, it, expect } from 'vitest';
import {
  allVocabulary,
  vocabularyByModule,
  getVocabularyForModule,
  getVocabularyByCategory,
  getCulturalNotesForModule,
} from './index';
import type { ModuleId } from './types';

const MODULES: ModuleId[] = [1, 2, 3, 4];
const LANGS = ['fr', 'en', 'es', 'ar'] as const;

/** Ids de leçons réellement présents dans le curriculum, pour vérifier `source`. */
const KNOWN_SOURCES = new Set([
  'l1_phonetics_1',
  'l2_greetings_1',
  'l3_greetings_2',
  'l4_greetings_3',
  'l5_politeness_1',
  'l6_pronouns_1',
  'l_module2_cafe_1',
  'l_module2_taxi_1',
  'l_module2_souk_1',
  'm3_l1_checkin',
  'm3_l2_maintenance',
  'm3_l3_pharmacie',
  'm3_l4_orientation',
  'm4_l1_passe',
  'm4_l2_present',
  'm4_l3_futur_negation',
  'm4_l4_modaux',
]);

describe('vocabulaire — integrite des donnees', () => {
  it('chaque module 1 a 4 a du vocabulaire', () => {
    for (const m of MODULES) {
      expect(vocabularyByModule[m].length, `module ${m} vide`).toBeGreaterThan(0);
    }
  });

  it('les ids sont uniques sur tout le corpus', () => {
    const ids = allVocabulary.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('chaque entree a arabizi et arabic non vides', () => {
    for (const v of allVocabulary) {
      expect(v.arabizi.trim().length, v.id).toBeGreaterThan(0);
      expect(v.arabic.trim().length, v.id).toBeGreaterThan(0);
    }
  });

  it('chaque entree a une traduction complete dans les 4 langues', () => {
    for (const v of allVocabulary) {
      for (const lang of LANGS) {
        expect(v.translation[lang]?.trim().length, `${v.id}.${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('le module declare sur l entree correspond au module de rattachement', () => {
    for (const m of MODULES) {
      for (const v of vocabularyByModule[m]) {
        expect(v.module, v.id).toBe(m);
      }
    }
  });
});

describe('vocabulaire — tracabilite vers les lecons', () => {
  it('chaque entree pointe vers une lecon existante du curriculum', () => {
    const unknown = allVocabulary.filter((v) => !KNOWN_SOURCES.has(v.source));
    expect(unknown.map((v) => `${v.id} -> ${v.source}`)).toEqual([]);
  });
});

describe('vocabulaire — transcriptions Arabizi', () => {
  // L'Arabizi note les sons absents du latin par des chiffres (3=ع, 7=ح, 9=ق)
  // et par kh/gh. On vérifie que le corpus est bien de l'Arabizi, pas du latin
  // « inventé » : au moins une entrée par module doit utiliser cette notation.
  it('chaque module contient au moins une transcription avec notation chiffree', () => {
    for (const m of MODULES) {
      // La notation chiffree peut apparaitre dans le mot lui-meme (3afak, 9hwa)
      // ou seulement dans son exemple : le module 4 est grammatical, ses mots
      // sont des formes verbales latines et la notation n'apparait que dans
      // les phrases (« men be3d »).
      const withDigit = vocabularyByModule[m].filter(
        (v) => /[379]/.test(v.arabizi) || /[379]/.test(v.example?.arabizi ?? '')
      );
      expect(withDigit.length, `module ${m} sans notation chiffree`).toBeGreaterThan(0);
    }
  });

  it('l arabizi n utilise pas de caracteres arabes (c est le role du champ arabic)', () => {
    const offenders = allVocabulary.filter((v) => /[\u0600-\u06FF]/.test(v.arabizi));
    expect(offenders.map((v) => v.id)).toEqual([]);
  });

  it('le champ arabic est bien en ecriture arabe', () => {
    const offenders = allVocabulary.filter((v) => !/[\u0600-\u06FF]/.test(v.arabic));
    expect(offenders.map((v) => v.id)).toEqual([]);
  });
});

describe('vocabulaire — exemples et notes culturelles', () => {
  it('les exemples sont bilingues et traduits dans les 4 langues', () => {
    for (const v of allVocabulary) {
      if (!v.example) continue;
      expect(v.example.arabizi.trim().length, v.id).toBeGreaterThan(0);
      expect(/[\u0600-\u06FF]/.test(v.example.arabic), `${v.id} exemple non arabe`).toBe(true);
      for (const lang of LANGS) {
        expect(v.example.translation[lang]?.trim().length, `${v.id}.example.${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('les notes culturelles sont traduites dans les 4 langues', () => {
    for (const v of allVocabulary) {
      if (!v.culturalNote) continue;
      for (const lang of LANGS) {
        expect(v.culturalNote[lang]?.trim().length, `${v.id}.note.${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('chaque module expose au moins une note culturelle', () => {
    for (const m of MODULES) {
      expect(getCulturalNotesForModule(m).length, `module ${m}`).toBeGreaterThan(0);
    }
  });
});

describe('vocabulaire — API d acces', () => {
  it('getVocabularyForModule renvoie la liste du module', () => {
    expect(getVocabularyForModule(1)).toBe(vocabularyByModule[1]);
  });

  it('getVocabularyByCategory filtre correctement', () => {
    const politeness = getVocabularyByCategory('politeness');
    expect(politeness.length).toBeGreaterThan(0);
    expect(politeness.every((v) => v.category === 'politeness')).toBe(true);
  });

  it('allVocabulary couvre exactement les modules 1 a 4', () => {
    const total = MODULES.reduce((sum, m) => sum + vocabularyByModule[m].length, 0);
    expect(allVocabulary.length).toBe(total);
    expect(new Set(allVocabulary.map((v) => v.module))).toEqual(new Set(MODULES));
  });
});

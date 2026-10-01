import { describe, it, expect } from 'vitest';
import {
  allVocabulary,
  vocabularyByModule,
  getVocabularyForModule,
  getVocabularyByCategory,
  getCulturalNotesForModule,
} from './index';
import type { ModuleId } from './types';
import { allLessonsList } from '../curriculum';

const MODULES: ModuleId[] = [1, 2, 3, 4, 5, 6, 7];
const LANGS = ['fr', 'en', 'es', 'ar'] as const;

/**
 * Ids de leçons réellement présents dans le curriculum.
 *
 * Dérivés de la source, et non recopiés à la main : une liste figée dérive
 * silencieusement du curriculum, et une leçon renommée ferait passer le test
 * pour un test de données alors qu'il ne vérifie plus rien.
 */
const KNOWN_SOURCES = new Set(allLessonsList.map((l) => l.id));

describe('vocabulaire — integrite des donnees', () => {
  it('chaque module 1 a 7 a du vocabulaire', () => {
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

describe('vocabulaire — modules 5 a 7', () => {
  // Ces trois modules portaient le curriculum sans aucun lexique : un apprenant
  // arrivé en fin de parcours n'avait aucun mot à réviser. On fige ici une
  // densité minimale, pour que le corpus ne puisse pas se vider en silence.
  const NEW_MODULES: ModuleId[] = [5, 6, 7];

  it('chaque nouveau module expose au moins huit mots', () => {
    for (const m of NEW_MODULES) {
      expect(vocabularyByModule[m].length, `module ${m}`).toBeGreaterThanOrEqual(8);
    }
  });

  it('les mots sont rattaches au bon module et tracables vers une lecon', () => {
    for (const m of NEW_MODULES) {
      for (const v of vocabularyByModule[m]) {
        expect(v.module, v.id).toBe(m);
        expect(KNOWN_SOURCES.has(v.source), `${v.id} -> ${v.source}`).toBe(true);
      }
    }
  });

  it('les categories propres aux nouveaux modules sont representees', () => {
    const categories = new Set(allVocabulary.filter((v) => NEW_MODULES.includes(v.module)).map((v) => v.category));
    for (const expected of ['debate', 'work', 'proverb', 'grammar', 'narration', 'dialect'] as const) {
      expect(categories.has(expected), `categorie ${expected} absente`).toBe(true);
    }
  });

  it('chaque nouveau module porte au moins une note culturelle', () => {
    for (const m of NEW_MODULES) {
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

  it('allVocabulary couvre exactement les modules 1 a 7', () => {
    const total = MODULES.reduce((sum, m) => sum + vocabularyByModule[m].length, 0);
    expect(allVocabulary.length).toBe(total);
    expect(new Set(allVocabulary.map((v) => v.module))).toEqual(new Set(MODULES));
  });
});

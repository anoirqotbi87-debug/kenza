import { describe, it, expect } from 'vitest';
import {
  CULTURAL_GEMS,
  CULTURAL_GEMS_BY_CATEGORY,
  PINGPONG_GEMS,
  PROVERB_GEMS,
  type CulturalGem,
} from '@/data/culturalGems';
import {
  filterGems,
  getGemExplanation,
  getGemIndexForDate,
  getGemOfTheDay,
  getGemStreetExample,
  getHeadlinePhrase,
  getSecondaryPhrase,
  localize,
  parseFavorites,
  toSrsCard,
  toggleFavorite,
} from '@/lib/culture/engine';
import { translations } from '@/lib/i18n/translations';

/**
 * Étape 5 — Sagesse & Street Darija.
 *
 * Le corpus est embarqué (hors-ligne) : chaque perle doit être complète dans
 * les 4 langues, et le tirage du jour doit rester déterministe pour que le
 * widget du dashboard et la page /culture affichent la même perle.
 */

const LANGS = ['fr', 'en', 'es', 'ar'] as const;

function expectCompleteText(value: unknown, label: string) {
  expect(value, label).toBeTruthy();
  for (const lang of LANGS) {
    expect((value as Record<string, string>)[lang], `${label}.${lang}`).toBeTruthy();
  }
}

function allPhrases(gem: CulturalGem) {
  return gem.category === 'pingpong'
    ? [gem.prompt, gem.response]
    : [gem.expression, gem.streetExample];
}

describe('corpus culturel', () => {
  it('contient au moins 10 perles par catégorie', () => {
    expect(PINGPONG_GEMS.length).toBeGreaterThanOrEqual(10);
    expect(PROVERB_GEMS.length).toBeGreaterThanOrEqual(10);
    expect(CULTURAL_GEMS.length).toBe(PINGPONG_GEMS.length + PROVERB_GEMS.length);
  });

  it('n’a aucun identifiant en double', () => {
    const ids = CULTURAL_GEMS.map((gem) => gem.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('range chaque perle dans la bonne catégorie', () => {
    expect(CULTURAL_GEMS_BY_CATEGORY.pingpong).toEqual(PINGPONG_GEMS);
    expect(CULTURAL_GEMS_BY_CATEGORY.proverb).toEqual(PROVERB_GEMS);
    for (const gem of CULTURAL_GEMS) {
      expect(Object.keys(CULTURAL_GEMS_BY_CATEGORY)).toContain(gem.category);
    }
  });

  it('fournit arabizi, arabe et traduction 4 langues pour chaque réplique', () => {
    for (const gem of CULTURAL_GEMS) {
      for (const phrase of allPhrases(gem)) {
        expect(phrase.arabizi.trim(), `${gem.id} arabizi`).toBeTruthy();
        expect(phrase.arabic.trim(), `${gem.id} arabic`).toBeTruthy();
        expectCompleteText(phrase.translation, `${gem.id} translation`);
      }
    }
  });

  it('documente le contexte ou le sens dans les 4 langues', () => {
    for (const gem of CULTURAL_GEMS) {
      if (gem.category === 'pingpong') {
        expectCompleteText(gem.situation, `${gem.id} situation`);
        expectCompleteText(gem.context, `${gem.id} context`);
      } else {
        expectCompleteText(gem.literal, `${gem.id} literal`);
        expectCompleteText(gem.meaning, `${gem.id} meaning`);
      }
    }
  });

  it('les formules ping-pong ont une réponse différente de la question', () => {
    for (const gem of PINGPONG_GEMS) {
      expect(gem.response.arabizi).not.toBe(gem.prompt.arabizi);
    }
  });
});

describe('filterGems', () => {
  it('isole les deux onglets', () => {
    expect(filterGems(CULTURAL_GEMS, 'pingpong')).toHaveLength(PINGPONG_GEMS.length);
    expect(filterGems(CULTURAL_GEMS, 'proverb')).toHaveLength(PROVERB_GEMS.length);
    expect(filterGems(CULTURAL_GEMS, 'proverb').every((g) => g.category === 'proverb')).toBe(true);
  });
});

describe('localize', () => {
  const text = { fr: 'Bonjour', en: 'Hello', es: 'Hola', ar: 'مرحبا' };

  it('saisit chaque langue', () => {
    expect(localize(text, 'fr')).toBe('Bonjour');
    expect(localize(text, 'en')).toBe('Hello');
    expect(localize(text, 'es')).toBe('Hola');
    expect(localize(text, 'ar')).toBe('مرحبا');
  });

  it('replie sur le français pour une langue inconnue', () => {
    expect(localize(text, 'de')).toBe('Bonjour');
    expect(localize(text, '')).toBe('Bonjour');
  });

  it('renvoie telle quelle une chaîne simple', () => {
    expect(localize('texte brut', 'en')).toBe('texte brut');
  });
});

describe('perle du jour', () => {
  const day = new Date(Date.UTC(2026, 9, 23, 12, 0, 0));

  it('reste dans les bornes du corpus', () => {
    for (let offset = 0; offset < 40; offset += 1) {
      const date = new Date(day.getTime() + offset * 86_400_000);
      const index = getGemIndexForDate(date, CULTURAL_GEMS.length);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(CULTURAL_GEMS.length);
    }
  });

  it('est stable sur une même journée', () => {
    const morning = new Date(Date.UTC(2026, 9, 23, 6, 0, 0));
    const evening = new Date(Date.UTC(2026, 9, 23, 23, 30, 0));
    expect(getGemOfTheDay(CULTURAL_GEMS, morning)).toBe(
      getGemOfTheDay(CULTURAL_GEMS, evening)
    );
  });

  it('tourne d’un jour à l’autre', () => {
    const today = getGemOfTheDay(CULTURAL_GEMS, day);
    const tomorrow = getGemOfTheDay(CULTURAL_GEMS, new Date(day.getTime() + 86_400_000));
    if (CULTURAL_GEMS.length > 1) expect(tomorrow.id).not.toBe(today.id);
  });

  it('couvre tout le corpus sur un cycle complet', () => {
    const seen = new Set<string>();
    for (let offset = 0; offset < CULTURAL_GEMS.length; offset += 1) {
      const date = new Date(day.getTime() + offset * 86_400_000);
      seen.add(getGemOfTheDay(CULTURAL_GEMS, date).id);
    }
    expect(seen.size).toBe(CULTURAL_GEMS.length);
  });

  it('refuse un corpus vide', () => {
    expect(() => getGemOfTheDay([], day)).toThrow();
  });
});

describe('accès aux champs selon la catégorie', () => {
  it('met en avant la réponse (ping-pong) ou le proverbe', () => {
    expect(getHeadlinePhrase(PINGPONG_GEMS[0])).toBe(PINGPONG_GEMS[0].response);
    expect(getHeadlinePhrase(PROVERB_GEMS[0])).toBe(PROVERB_GEMS[0].expression);
  });

  it('expose la formule entendue seulement pour le ping-pong', () => {
    expect(getSecondaryPhrase(PINGPONG_GEMS[0])).toBe(PINGPONG_GEMS[0].prompt);
    expect(getSecondaryPhrase(PROVERB_GEMS[0])).toBeNull();
  });

  it('expose l’exemple de rue seulement pour les proverbes', () => {
    expect(getGemStreetExample(PROVERB_GEMS[0])).toBe(PROVERB_GEMS[0].streetExample);
    expect(getGemStreetExample(PINGPONG_GEMS[0])).toBeNull();
  });

  it('localise l’explication sur les 4 langues', () => {
    for (const gem of CULTURAL_GEMS) {
      for (const lang of LANGS) {
        expect(getGemExplanation(gem, lang).trim(), `${gem.id}.${lang}`).toBeTruthy();
      }
    }
  });
});

describe('toSrsCard', () => {
  it('produit une carte prête pour la révision', () => {
    const card = toSrsCard(PINGPONG_GEMS[0], 'fr');
    expect(card.id).toBe(`srs_culture_${PINGPONG_GEMS[0].id}`);
    expect(card.arabizi).toBe(PINGPONG_GEMS[0].response.arabizi);
    expect(card.arabic).toBe(PINGPONG_GEMS[0].response.arabic);
    expect(card.category).toBe('culture_pingpong');
    expect(card.source).toBe('manual');
    expect(card.example?.arabizi).toBe(PINGPONG_GEMS[0].prompt.arabizi);
    expect(card.culturalNote).toBe(localize(PINGPONG_GEMS[0].context, 'fr'));
  });

  it('utilise l’exemple de rue pour un proverbe', () => {
    const card = toSrsCard(PROVERB_GEMS[0], 'en');
    expect(card.category).toBe('culture_proverb');
    expect(card.example?.arabizi).toBe(PROVERB_GEMS[0].streetExample.arabizi);
    expect(card.translation).toEqual(PROVERB_GEMS[0].expression.translation);
    expect(card.culturalNote).toBe(PROVERB_GEMS[0].meaning.en);
  });

  it('donne un identifiant unique par perle', () => {
    const ids = CULTURAL_GEMS.map((gem) => toSrsCard(gem, 'fr').id);
    expect(new Set(ids).size).toBe(CULTURAL_GEMS.length);
  });
});

describe('favoris', () => {
  it('tolère un stockage vide ou corrompu', () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites('')).toEqual([]);
    expect(parseFavorites('{')).toEqual([]);
    expect(parseFavorites('{"a":1}')).toEqual([]);
    expect(parseFavorites('[1,"pp_salam",null]')).toEqual(['pp_salam']);
  });

  it('ajoute puis retire sans muter la liste d’origine', () => {
    const initial = ['pp_salam'];
    const added = toggleFavorite(initial, 'pv_jbel');
    expect(added).toEqual(['pp_salam', 'pv_jbel']);
    expect(initial).toEqual(['pp_salam']);
    expect(toggleFavorite(added, 'pp_salam')).toEqual(['pv_jbel']);
  });
});

describe('i18n de la page culture', () => {
  const KEYS = [
    'badge',
    'title',
    'subtitle',
    'offlineBadge',
    'tabPoliteness',
    'tabWisdom',
    'heard',
    'answer',
    'literal',
    'meaning',
    'inTheStreet',
    'addToSrs',
    'addedToSrs',
    'onlyFavorites',
    'emptyFavorites',
    'gemsLabel',
    'widgetKicker',
    'widgetCta',
  ];

  it.each(LANGS)('%s : expose toutes les clés attendues', (lang) => {
    const culture = (translations[lang].pages as Record<string, Record<string, unknown>>).culture;
    expect(culture).toBeTruthy();
    for (const key of KEYS) {
      expect(typeof culture[key], `${lang}.${key}`).toBe('string');
      expect(String(culture[key]).length, `${lang}.${key}`).toBeGreaterThan(0);
    }
  });

  it.each(LANGS)('%s : les deux onglets ont des libellés distincts', (lang) => {
    const culture = (translations[lang].pages as Record<string, Record<string, unknown>>).culture;
    expect(culture.tabPoliteness).not.toBe(culture.tabWisdom);
  });
});

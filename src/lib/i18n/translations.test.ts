import { describe, it, expect } from 'vitest';
import { translations } from './translations';

const LANGS = ['fr', 'en', 'es', 'ar'] as const;

/** Le noeud paywall de chaque langue, typé souplement pour les assertions de contenu. */
function paywall(lang: (typeof LANGS)[number]): Record<string, unknown> {
  return (translations[lang] as { modules: { paywall: Record<string, unknown> } }).modules.paywall;
}

describe('paywall i18n — residus du faux deblocage (Mode Demo)', () => {
  it.each(LANGS)('%s : aucune chaine ne mentionne un mode demo', (lang) => {
    const dump = JSON.stringify(paywall(lang)).toLowerCase();
    expect(dump).not.toContain('démo');
    expect(dump).not.toContain('demo');
    expect(dump).not.toContain('تجريبي');
  });

  it.each(LANGS)('%s : la cle upgradeSuccess (vestige) a disparu', (lang) => {
    expect(paywall(lang)).not.toHaveProperty('upgradeSuccess');
  });
});

describe('paywall i18n — perimetre premium annonce', () => {
  it.each(LANGS)('%s : benefit1 annonce les modules 3 a 7, plus "3, 4 et 5"', (lang) => {
    const benefit1 = String(paywall(lang).benefit1);
    // Doit mentionner la borne haute du perimetre payant.
    expect(benefit1).toMatch(/7|sept/);
    // Ne doit plus enumerer l ancien perimetre tronque.
    expect(benefit1).not.toMatch(/3,\s*4\s*(et|and|y|و)\s*5/);
  });
});

describe('paywall i18n — essai gratuit 7 jours', () => {
  it.each(LANGS)('%s : expose un CTA d essai et une timeline', (lang) => {
    const pw = paywall(lang);
    expect(typeof pw.trialCta).toBe('string');
    expect(String(pw.trialCta).length).toBeGreaterThan(0);
    expect(typeof pw.trialTimeline).toBe('string');
    expect(String(pw.trialTimeline).length).toBeGreaterThan(0);
  });

  it.each(LANGS)('%s : la timeline mentionne 7 jours et l absence de debit immediat', (lang) => {
    const timeline = String(paywall(lang).trialTimeline);
    expect(timeline).toMatch(/7/);
    expect(timeline).toMatch(/0\s*€|0\s*€|0/);
  });
});

describe('paywall i18n — moteur de conversion (tranche 3)', () => {
  const REQUIRED_KEYS = [
    // Trigger 1 : fin d'onboarding
    'onboardingTitle',
    'onboardingDismiss',
    // Quota audio
    'audioQuotaTitle',
    // Mode hors-ligne
    'offlineTitle',
    // Timeline 3 etapes
    'timelineStep1',
    'timelineStep2',
    'timelineStep3',
    // Toggle devise discret
    'currencyToggle',
  ];

  it.each(LANGS)('%s : toutes les nouvelles cles paywall existent et sont non vides', (lang) => {
    const pw = paywall(lang);
    for (const key of REQUIRED_KEYS) {
      expect(typeof pw[key], `cle manquante : ${key}`).toBe('string');
      expect(String(pw[key]).length, `cle vide : ${key}`).toBeGreaterThan(0);
    }
  });

  it.each(LANGS)('%s : l accroche onboarding annonce les 7 jours gratuits', (lang) => {
    expect(String(paywall(lang).onboardingTitle)).toMatch(/7/);
  });

  it.each(LANGS)('%s : l accroche quota audio annonce les 10 ecoutes gratuites', (lang) => {
    expect(String(paywall(lang).audioQuotaTitle)).toMatch(/10/);
  });

  it.each(LANGS)('%s : la timeline couvre aujourd hui, jour 5 et jour 7', (lang) => {
    const pw = paywall(lang);
    expect(String(pw.timelineStep1)).toMatch(/0\s*€|0/);
    expect(String(pw.timelineStep2)).toMatch(/5/);
    expect(String(pw.timelineStep3)).toMatch(/7/);
  });
});

describe('i18n — badges de navigation persistants (Trigger 4)', () => {
  const NAV_KEYS = ['freeBadge', 'proBadge', 'upgradeCta'];

  function header(lang: (typeof LANGS)[number]): Record<string, unknown> {
    return (translations[lang] as { header: Record<string, unknown> }).header;
  }

  it.each(LANGS)('%s : expose les cles de badge gratuit / pro / upgrade', (lang) => {
    const h = header(lang);
    for (const key of NAV_KEYS) {
      expect(typeof h[key], `cle manquante : header.${key}`).toBe('string');
      expect(String(h[key]).length, `cle vide : header.${key}`).toBeGreaterThan(0);
    }
  });

  it.each(LANGS)('%s : les badges mentionnent la marque Kenza', (lang) => {
    // En arabe la marque s'ecrit « كنزة » : on accepte les deux graphies.
    const brand = /Kenza|كنزة/i;
    expect(String(header(lang).freeBadge)).toMatch(brand);
    expect(String(header(lang).proBadge)).toMatch(brand);
  });
});

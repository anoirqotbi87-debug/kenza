import { describe, it, expect } from 'vitest';
import { resolveCurrency, countryFromHeaders, DEFAULT_CURRENCY } from './geoCurrency';

describe('resolveCurrency — detection pays / timezone', () => {
  it('pays MA (header Vercel) -> MAD', () => {
    expect(resolveCurrency({ country: 'MA' })).toBe('MAD');
  });

  it('pays MA en minuscules -> MAD', () => {
    expect(resolveCurrency({ country: 'ma' })).toBe('MAD');
  });

  it('timezone Casablanca -> MAD', () => {
    expect(resolveCurrency({ timeZone: 'Africa/Casablanca' })).toBe('MAD');
  });

  it('pays FR -> EUR', () => {
    expect(resolveCurrency({ country: 'FR' })).toBe('EUR');
  });

  it('timezone Europe/Paris -> EUR', () => {
    expect(resolveCurrency({ timeZone: 'Europe/Paris' })).toBe('EUR');
  });

  it('pays US -> EUR (international = tarif EUR)', () => {
    expect(resolveCurrency({ country: 'US' })).toBe('EUR');
  });

  it('aucune info -> devise par defaut EUR', () => {
    expect(resolveCurrency({})).toBe(DEFAULT_CURRENCY);
    expect(DEFAULT_CURRENCY).toBe('EUR');
  });

  it('le pays prime sur la timezone', () => {
    // MRE en France avec une timezone marocaine residuelle : le pays tranche.
    expect(resolveCurrency({ country: 'FR', timeZone: 'Africa/Casablanca' })).toBe('EUR');
  });
});

describe('countryFromHeaders — lecture des headers hebergeur', () => {
  it('lit x-vercel-ip-country', () => {
    expect(countryFromHeaders(new Headers({ 'x-vercel-ip-country': 'MA' }))).toBe('MA');
  });

  it('lit cf-ipcountry (Cloudflare)', () => {
    expect(countryFromHeaders(new Headers({ 'cf-ipcountry': 'fr' }))).toBe('FR');
  });

  it('Vercel renvoie XX quand le pays est inconnu -> null', () => {
    expect(countryFromHeaders(new Headers({ 'x-vercel-ip-country': 'XX' }))).toBeNull();
  });

  it('Vercel renvoie T1 (anonymisation) -> null', () => {
    expect(countryFromHeaders(new Headers({ 'x-vercel-ip-country': 'T1' }))).toBeNull();
  });

  it('aucun header -> null', () => {
    expect(countryFromHeaders(new Headers())).toBeNull();
  });

  it('pays inconnu -> devise par defaut EUR', () => {
    expect(resolveCurrency({ country: countryFromHeaders(new Headers()) })).toBe('EUR');
  });
});

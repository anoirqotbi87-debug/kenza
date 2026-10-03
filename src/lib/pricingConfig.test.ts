import { describe, it, expect } from 'vitest';
import { PRICING_CONFIG } from './pricingConfig';

describe('pricingConfig — source de vérité unique', () => {
  it('définit le plan mensuel correctement', () => {
    expect(PRICING_CONFIG.monthly.id).toBe('monthly');
    expect(PRICING_CONFIG.monthly.name).toBe('Mensuel');
    expect(PRICING_CONFIG.monthly.priceEUR).toBe(9);
    expect(PRICING_CONFIG.monthly.priceMAD).toBe(90);
    expect(PRICING_CONFIG.monthly.interval).toBe('month');
  });

  it('définit le plan annuel correctement avec 7 jours d’essai', () => {
    expect(PRICING_CONFIG.annual.id).toBe('annual');
    expect(PRICING_CONFIG.annual.name).toBe('Annuel');
    expect(PRICING_CONFIG.annual.priceEUR).toBe(59);
    expect(PRICING_CONFIG.annual.priceMAD).toBe(590);
    expect(PRICING_CONFIG.annual.interval).toBe('year');
    expect(PRICING_CONFIG.annual.trialDays).toBe(7);
    expect(PRICING_CONFIG.annual.highlight).toBe(true);
  });

  it('garantit un rapport de prix avantageux pour l’annuel vs mensuel', () => {
    const monthlyTotalEUR = PRICING_CONFIG.monthly.priceEUR * 12;
    expect(PRICING_CONFIG.annual.priceEUR).toBeLessThan(monthlyTotalEUR);

    const monthlyTotalMAD = PRICING_CONFIG.monthly.priceMAD * 12;
    expect(PRICING_CONFIG.annual.priceMAD).toBeLessThan(monthlyTotalMAD);
  });
});

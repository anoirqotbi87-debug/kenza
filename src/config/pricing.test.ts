import { describe, it, expect } from 'vitest';
import {
  PRICING_CONFIG,
  ANNUAL_DISCOUNT_PERCENT,
  CURRENCIES,
  BILLING_CYCLES,
  TRIAL_PERIOD_DAYS,
  formatPrice,
  formatPriceInBothCurrencies,
  getDisplayPricing,
  type BillingCycle,
  type Currency,
} from './pricing';

describe('pricing — coherence des montants Stripe', () => {
  it.each(CURRENCIES)('%s : les deux cadences sont definies', (currency) => {
    for (const cycle of BILLING_CYCLES) {
      const plan = PRICING_CONFIG[currency][cycle];
      expect(plan.unitAmount).toBeGreaterThan(0);
      expect(Number.isInteger(plan.unitAmount)).toBe(true);
    }
  });

  it.each(CURRENCIES)('%s : la devise Stripe correspond a la cle', (currency) => {
    for (const cycle of BILLING_CYCLES) {
      expect(PRICING_CONFIG[currency][cycle].currency).toBe(currency.toLowerCase());
    }
  });

  it('annuel = interval year, mensuel = interval month', () => {
    for (const currency of CURRENCIES) {
      expect(PRICING_CONFIG[currency].yearly.interval).toBe('year');
      expect(PRICING_CONFIG[currency].monthly.interval).toBe('month');
    }
  });

  it('le mensuel n est pas moins cher que 1/12 de l annuel (sinon l annuel est absurde)', () => {
    for (const currency of CURRENCIES) {
      const yearly = PRICING_CONFIG[currency].yearly.unitAmount;
      const monthly = PRICING_CONFIG[currency].monthly.unitAmount;
      expect(monthly * 12).toBeGreaterThan(yearly);
    }
  });
});

describe('pricing — badge de remise honnete', () => {
  // Un badge « -45% » associe a un prix qui ne fait pas cette remise est une
  // pratique commerciale trompeuse : on verrouille la coherence par test.
  it.each(CURRENCIES)('%s : la remise annuelle annoncee correspond au prix', (currency) => {
    const yearly = PRICING_CONFIG[currency].yearly.unitAmount;
    const monthly = PRICING_CONFIG[currency].monthly.unitAmount;
    const realDiscount = Math.round((1 - yearly / (monthly * 12)) * 100);
    expect(Math.abs(realDiscount - ANNUAL_DISCOUNT_PERCENT)).toBeLessThanOrEqual(1);
  });
});

describe('pricing — affichage', () => {
  it('formatPrice produit un libelle annuel et mensuel par devise', () => {
    expect(formatPrice('EUR', 'yearly')).toBe('59 € / an');
    expect(formatPrice('EUR', 'monthly')).toBe('9 € / mois');
    expect(formatPrice('MAD', 'yearly')).toBe('590 DH / an');
    expect(formatPrice('MAD', 'monthly')).toBe('90 DH / mois');
  });

  it('formatPriceInBothCurrencies cite bien les deux devises', () => {
    expect(formatPriceInBothCurrencies('yearly')).toContain('59 €');
    expect(formatPriceInBothCurrencies('yearly')).toContain('590 DH');
  });

  it.each(CURRENCIES)('%s : les montants affiches correspondent aux centimes factures', (currency) => {
    const display = getDisplayPricing(currency);
    // Le montant annuel affiche (nombre nu) doit egaler unit_amount / 100.
    const yearlyNumber = Number(display.yearlyAmount.replace(/[^\d]/g, ''));
    const monthlyNumber = Number(display.monthlyAmount.replace(/[^\d]/g, ''));
    expect(yearlyNumber).toBe(PRICING_CONFIG[currency].yearly.unitAmount / 100);
    expect(monthlyNumber).toBe(PRICING_CONFIG[currency].monthly.unitAmount / 100);
  });

  it.each(CURRENCIES)('%s : le prix « par mois » de l annuel est coherent', (currency) => {
    const display = getDisplayPricing(currency);
    const perMonth = Number(display.yearlyPerMonth.replace(/[^\d,.]/g, '').replace(',', '.'));
    const yearlyTotal = PRICING_CONFIG[currency].yearly.unitAmount / 100;
    // Arrondi marketing : l'EUR est arrondi au centime, le MAD au dirham entier.
    const tolerance = currency === 'MAD' ? 0.5 : 0.05;
    expect(Math.abs(perMonth - yearlyTotal / 12)).toBeLessThan(tolerance);
  });
});

describe('pricing — essai gratuit', () => {
  it('dure 7 jours', () => {
    expect(TRIAL_PERIOD_DAYS).toBe(7);
  });
});

describe('pricing — aucune duplication hors de la source unique', () => {
  it('les libelles produits sont non vides pour chaque offre', () => {
    for (const currency of CURRENCIES as readonly Currency[]) {
      for (const cycle of BILLING_CYCLES as readonly BillingCycle[]) {
        const plan = PRICING_CONFIG[currency][cycle];
        expect(plan.name.length).toBeGreaterThan(0);
        expect(plan.description.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('pricing — plus aucune duplication de montant dans le code', () => {
  // Garde-fou : si un montant reapparait en dur ailleurs, ce test echoue.
  it('aucun fichier hors src/config ne redeclare un prix formate', async () => {
    const { readFileSync, readdirSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');

    const FORBIDDEN = ['59 €', '590 DH', '4,90 €', '9,00 €', '90 DH', '49 DH'];
    const IGNORED_DIRS = new Set(['node_modules', '.next', '.git']);

    function walk(dir: string): string[] {
      return readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          return IGNORED_DIRS.has(entry) ? [] : walk(full);
        }
        return /\.(ts|tsx)$/.test(entry) ? [full] : [];
      });
    }

    const offenders: string[] = [];
    for (const file of walk(join(process.cwd(), 'src'))) {
      if (file.includes(join('src', 'config', 'pricing'))) continue;
      const content = readFileSync(file, 'utf8');
      for (const needle of FORBIDDEN) {
        if (content.includes(needle)) offenders.push(`${file} -> ${needle}`);
      }
    }
    expect(offenders).toEqual([]);
  }, 60000);
});

/**
 * Source unique des tarifs Kenza Pro.
 *
 * Tout ce qui touche au prix vit ici : montants facturés par Stripe (centimes),
 * libellés produits, essai gratuit, et chaînes affichées (paywall, CGU, i18n).
 * Aucun autre fichier ne doit redéclarer un montant ou un prix formaté.
 *
 * Note : ce module est importé côté serveur (route Stripe) ET côté client
 * (paywall), il ne doit donc contenir aucune donnée secrète ni import du SDK.
 */

import { PRICING_CONFIG as BASE_PRICING, type PricingPlan, type PricingConfig } from '@/lib/pricingConfig';

export type Currency = 'EUR' | 'MAD';
export type BillingCycle = 'yearly' | 'monthly';

export const CURRENCIES: readonly Currency[] = ['EUR', 'MAD'] as const;
export const BILLING_CYCLES: readonly BillingCycle[] = ['yearly', 'monthly'] as const;

/** Durée de l'essai gratuit, offert sur l'abonnement annuel uniquement. */
export const TRIAL_PERIOD_DAYS = BASE_PRICING.annual.trialDays ?? 7;

interface PlanSpec {
  /** Montant en centimes, tel qu'attendu par Stripe. */
  unitAmount: number;
  currency: 'eur' | 'mad';
  interval: 'year' | 'month';
  name: string;
  description: string;
}

export const PRICING_CONFIG: Record<Currency, Record<BillingCycle, PlanSpec>> = {
  EUR: {
    yearly: {
      unitAmount: BASE_PRICING.annual.priceEUR * 100, // 59,00 €
      currency: 'eur',
      interval: 'year',
      name: 'Kenza Pro - Abonnement Annuel',
      description:
        'Accès illimité aux Modules B1/B2, Roleplay IA et Passeport Culturel (Facturé annuellement)',
    },
    monthly: {
      unitAmount: BASE_PRICING.monthly.priceEUR * 100, // 9,00 €
      currency: 'eur',
      interval: 'month',
      name: 'Kenza Pro - Abonnement Mensuel',
      description:
        'Accès illimité aux Modules B1/B2, Roleplay IA et Passeport Culturel (Sans engagement)',
    },
  },
  MAD: {
    yearly: {
      unitAmount: BASE_PRICING.annual.priceMAD * 100, // 590,00 DH (MAD en centimes)
      currency: 'mad',
      interval: 'year',
      name: 'Kenza Pro - Abonnement Annuel (Maroc)',
      description: 'Accès complet au dialecte marocain, IA et certification (Facturé annuellement)',
    },
    monthly: {
      unitAmount: BASE_PRICING.monthly.priceMAD * 100, // 90,00 DH
      currency: 'mad',
      interval: 'month',
      name: 'Kenza Pro - Abonnement Mensuel (Maroc)',
      description: 'Accès complet sans engagement',
    },
  },
};

export { BASE_PRICING, type PricingPlan, type PricingConfig };

/**
 * Remise annoncée par le badge « meilleure offre », en pourcentage.
 * Les prix affichés ci-dessous doivent la respecter : c'est vérifié par test,
 * car une incohérence entre le badge et le prix réel est une pratique trompeuse.
 */
export const ANNUAL_DISCOUNT_PERCENT = 45;

interface CurrencyDisplay {
  /** Symbole affiché à côté d'un montant nu. */
  symbol: string;
  /** Montant annuel nu, pour les textes légaux (« 59 € »). */
  yearlyAmount: string;
  /** Montant mensuel nu (« 9 € »). */
  monthlyAmount: string;
  /** Prix annuel rapporté au mois (« 4,90 € »), argument de conversion. */
  yearlyPerMonth: string;
  /** Prix annuel facturé (« 59 € / an »). */
  yearlyTotal: string;
  /** Prix mensuel facturé (« 9,00 € »). */
  monthlyPrice: string;
}

/**
 * Chaînes affichées. Volontairement écrites en dur plutôt que dérivées des
 * centimes : ce sont des choix marketing (arrondi du « par mois », symbole,
 * séparateurs) et une dérivation automatique les modifierait en silence.
 */
const DISPLAY_PRICING: Record<Currency, CurrencyDisplay> = {
  EUR: {
    symbol: '€',
    yearlyAmount: `${BASE_PRICING.annual.priceEUR} €`,
    monthlyAmount: `${BASE_PRICING.monthly.priceEUR} €`,
    yearlyPerMonth: '4,90 €',
    yearlyTotal: `${BASE_PRICING.annual.priceEUR} € / an`,
    monthlyPrice: `${BASE_PRICING.monthly.priceEUR},00 €`,
  },
  MAD: {
    symbol: 'DH',
    yearlyAmount: `${BASE_PRICING.annual.priceMAD} DH`,
    monthlyAmount: `${BASE_PRICING.monthly.priceMAD} DH`,
    yearlyPerMonth: '49 DH',
    yearlyTotal: `${BASE_PRICING.annual.priceMAD} DH / an`,
    monthlyPrice: `${BASE_PRICING.monthly.priceMAD} DH`,
  },
};

export function getDisplayPricing(currency: Currency): CurrencyDisplay {
  return DISPLAY_PRICING[currency];
}

/** Montant formaté pour une devise et une cadence (« 59 € / an », « 9 € / mois »). */
export function formatPrice(currency: Currency, cycle: BillingCycle): string {
  const display = DISPLAY_PRICING[currency];
  return cycle === 'yearly' ? display.yearlyTotal : `${display.monthlyAmount} / mois`;
}

/**
 * Les deux devises d'une même cadence, pour les textes qui doivent les citer
 * ensemble (« 59 € / an (ou 590 MAD / an) »).
 */
export function formatPriceInBothCurrencies(cycle: BillingCycle): string {
  return `${formatPrice('EUR', cycle)} (ou ${formatPrice('MAD', cycle)})`;
}

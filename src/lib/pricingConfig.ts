/**
 * Configuration source de vérité unique pour les plans de tarification Kenza.
 * Centralise les tarifs d'abonnement (EUR et MAD) ainsi que les périodes d'essai.
 */

export interface PricingPlan {
  id: 'monthly' | 'annual';
  name: string;
  priceEUR: number;
  priceMAD: number;
  interval: 'month' | 'year';
  trialDays?: number;
  highlight?: boolean;
}

export const PRICING_CONFIG = {
  monthly: {
    id: 'monthly',
    name: 'Mensuel',
    priceEUR: 9,
    priceMAD: 90,
    interval: 'month',
  },
  annual: {
    id: 'annual',
    name: 'Annuel',
    priceEUR: 59,
    priceMAD: 590,
    interval: 'year',
    trialDays: 7,
    highlight: true,
  },
} as const;

export type PricingConfig = typeof PRICING_CONFIG;

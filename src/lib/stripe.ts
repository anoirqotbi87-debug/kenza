import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
      appInfo: {
        name: 'Kenza Darija Quest',
        version: '1.0.0',
      },
    })
  : null;

export const PRICING_CONFIG = {
  EUR: {
    yearly: {
      unitAmount: 5900, // 59,00 €
      currency: 'eur',
      interval: 'year' as const,
      name: 'Kenza Pro - Abonnement Annuel',
      description: 'Accès illimité aux Modules B1/B2, Roleplay IA et Passeport Culturel (Facturé annuellement)',
    },
    monthly: {
      unitAmount: 900, // 9,00 €
      currency: 'eur',
      interval: 'month' as const,
      name: 'Kenza Pro - Abonnement Mensuel',
      description: 'Accès illimité aux Modules B1/B2, Roleplay IA et Passeport Culturel (Sans engagement)',
    },
  },
  MAD: {
    yearly: {
      unitAmount: 59000, // 590,00 DH (MAD en centimes)
      currency: 'mad',
      interval: 'year' as const,
      name: 'Kenza Pro - Abonnement Annuel (Maroc)',
      description: 'Accès complet au dialecte marocain, IA et certification (Facturé annuellement)',
    },
    monthly: {
      unitAmount: 9000, // 90,00 DH
      currency: 'mad',
      interval: 'month' as const,
      name: 'Kenza Pro - Abonnement Mensuel (Maroc)',
      description: 'Accès complet sans engagement',
    },
  },
};

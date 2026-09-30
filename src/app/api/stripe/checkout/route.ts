import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING_CONFIG } from '@/lib/stripe';
import { getErrorMessage } from '@/lib/errors';
import { createClient } from '@supabase/supabase-js';
import { safeRedirectOrigin } from '@/lib/allowedOrigins';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { billingCycle = 'yearly', currency = 'EUR', source = 'direct', email } = body;

    // 1. Vérification de l'authentification utilisateur via Supabase
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    let userId: string | null = null;
    let customerEmail: string | undefined = email;

    if (authHeader) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        customerEmail = user.email || customerEmail;
      }
    }

    // 2. Si la clé secrète Stripe n'est pas configurée dans l'environnement
    if (!stripe) {
      // En production, l'absence de clé est une erreur de configuration : on refuse
      // explicitement plutôt que de renvoyer un succès simulé (qui, combiné au client,
      // débloquait le premium sans paiement).
      if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
        console.error('[Stripe Checkout] STRIPE_SECRET_KEY manquante en production.');
        return NextResponse.json(
          { error: 'Le paiement est momentanément indisponible. Merci de réessayer plus tard.' },
          { status: 503 }
        );
      }
      console.warn('[Stripe Checkout] STRIPE_SECRET_KEY non configurée (hors production).');
      return NextResponse.json(
        { error: 'Paiement non configuré dans cet environnement.' },
        { status: 503 }
      );
    }

    // 3. Définition du tarif
    const currKey = (currency === 'MAD' ? 'MAD' : 'EUR') as 'EUR' | 'MAD';
    const cycleKey = (billingCycle === 'monthly' ? 'monthly' : 'yearly') as 'monthly' | 'yearly';
    const planConfig = PRICING_CONFIG[currKey][cycleKey];

    // Sécurité : allowlist stricte de l'origine (jamais de header brut injecté tel quel)
    const origin = safeRedirectOrigin(req.headers.get('origin') || req.headers.get('referer'));

    // 4. Création de la session Checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: customerEmail,
      client_reference_id: userId || undefined,
      line_items: [
        {
          price_data: {
            currency: planConfig.currency,
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
              images: ['https://kenza-dusky.vercel.app/icons/icon-512x512.png'],
            },
            unit_amount: planConfig.unitAmount,
            recurring: {
              interval: planConfig.interval,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || 'anonymous',
        billingCycle: cycleKey,
        currency: currKey,
        source,
      },
      success_url: `${origin}/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?upgrade=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('[Stripe Checkout Error]:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

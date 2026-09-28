import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING_CONFIG } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

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
      console.warn('[Stripe Checkout] STRIPE_SECRET_KEY non configurée. Mode démo actif.');
      return NextResponse.json({
        simulated: true,
        message: 'Clé Stripe non configurée dans .env.local. Simulation réussie.',
      });
    }

    // 3. Définition du tarif
    const currKey = (currency === 'MAD' ? 'MAD' : 'EUR') as 'EUR' | 'MAD';
    const cycleKey = (billingCycle === 'monthly' ? 'monthly' : 'yearly') as 'monthly' | 'yearly';
    const planConfig = PRICING_CONFIG[currKey][cycleKey];

    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://kenza.vercel.app';

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
              images: ['https://kenza.vercel.app/icons/icon-512x512.png'],
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
  } catch (error: any) {
    console.error('[Stripe Checkout Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}

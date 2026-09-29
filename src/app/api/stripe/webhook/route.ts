/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe) {
      console.error('[Stripe Webhook] STRIPE_SECRET_KEY non configurée.');
      return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
    }

    // Sécurité : la signature est OBLIGATOIRE. Aucun fallback JSON brut.
    if (!webhookSecret) {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET manquant — requête rejetée.');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error('[Stripe Webhook Signature Error]:', err.message);
      return NextResponse.json({ error: 'Webhook Signature Error' }, { status: 400 });
    }

    // Sécurité : la clé service-role est OBLIGATOIRE (jamais de fallback vers la clé anon).
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Stripe Webhook] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant.');
      return NextResponse.json({ error: 'Supabase service configuration missing' }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const cycle = session.metadata?.billingCycle || 'yearly';

        if (userId && userId !== 'anonymous') {
          console.log(`[Stripe Webhook] Activation Kenza Pro pour utilisateur ${userId}`);
          const { error } = await supabase.rpc('set_user_subscription', {
            p_user_id: userId,
            p_is_premium: true,
            p_customer_id: typeof session.customer === 'string' ? session.customer : null,
            p_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
            p_cycle: cycle,
          });

          if (error) {
            console.error('[Stripe Webhook Error set_user_subscription]:', error);
            return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Résiliation abonnement ${subscription.id}`);

        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('[Stripe Webhook Error subscription.deleted]:', error);
          return NextResponse.json({ error: 'Failed to process deletion' }, { status: 500 });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';

        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: isActive })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('[Stripe Webhook Error subscription.updated]:', error);
          return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe Webhook Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Stripe not initialized' }, { status: 500 });
    }

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error('[Stripe Webhook Signature Error]:', err.message);
        return NextResponse.json({ error: `Webhook Signature Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Pour les environnements de test / prévisualisation sans secret webhook
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
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
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Résiliation abonnement ${subscription.id}`);
        
        // Trouver et désactiver l'abonnement dans profiles
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('[Stripe Webhook Error subscription.deleted]:', error);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active' || subscription.status === 'trialing';
        
        await supabase
          .from('profiles')
          .update({ is_premium: isActive })
          .eq('stripe_subscription_id', subscription.id);
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

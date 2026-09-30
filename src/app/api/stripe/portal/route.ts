import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getErrorMessage } from '@/lib/errors';
import { createClient } from '@supabase/supabase-js';
import { safeRedirectOrigin } from '@/lib/allowedOrigins';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    // Récupérer le stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, is_premium')
      .eq('id', user.id)
      .single();

    if (!stripe) {
      // Stripe non configure : on le dit franchement. Un `simulated: true` laissait
      // croire a un portail ouvert alors que rien ne s'est passe.
      return NextResponse.json(
        { error: 'BILLING_PORTAL_UNAVAILABLE' },
        { status: 503 }
      );
    }

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: 'Aucun compte client Stripe associé à cet utilisateur' },
        { status: 404 }
      );
    }

    // Sécurité : allowlist stricte de l'origine
    const origin = safeRedirectOrigin(req.headers.get('origin') || req.headers.get('referer'));

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/?tab=profile`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error('[Stripe Portal Error]:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Erreur lors de l’ouverture du portail de facturation' },
      { status: 500 }
    );
  }
}

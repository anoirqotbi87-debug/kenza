import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

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
      // Simulation mode
      return NextResponse.json({
        simulated: true,
        message: 'Portail client en mode démo.',
      });
    }

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: 'Aucun compte client Stripe associé à cet utilisateur' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://kenza.vercel.app';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/?tab=profile`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('[Stripe Portal Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l’ouverture du portail de facturation' },
      { status: 500 }
    );
  }
}

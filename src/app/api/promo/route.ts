import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const VALID_PROMO_CODES = new Set(['vipeider']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, userId } = body;

    // 1. Vérification que userId et code sont fournis
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return NextResponse.json(
        { error: 'Veuillez vous connecter pour activer un code promotionnel.' },
        { status: 401 }
      );
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { error: 'Code promotionnel manquant.' },
        { status: 400 }
      );
    }

    // 2. Normalisation du code (insensible à la casse)
    const cleanCode = code.trim().toLowerCase();

    // 3. Vérification des codes valides
    if (!VALID_PROMO_CODES.has(cleanCode)) {
      return NextResponse.json(
        { error: 'Code promotionnel invalide ou expiré.' },
        { status: 400 }
      );
    }

    // 4. Supabase Admin Client avec service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Promo API] Configuration Supabase manquante (URL ou SERVICE_ROLE_KEY).');
      return NextResponse.json(
        { error: 'Service temporairement indisponible.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Mise à jour de la table profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_premium: true,
        subscription_cycle: 'PROMO_VIPEIDER',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId.trim());

    if (updateError) {
      console.error('[Promo API Update Error]:', updateError);
      return NextResponse.json(
        { error: "Échec de l'activation du code promotionnel. Veuillez réessayer." },
        { status: 500 }
      );
    }

    // 6. Succès 200 OK
    return NextResponse.json({
      success: true,
      message: 'Code VIP activé ! Votre accès Premium est débloqué.',
    });
  } catch (error: unknown) {
    console.error('[Promo API Uncaught Error]:', error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue lors de l'activation." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { resolveCurrency, countryFromHeaders } from '@/lib/geoCurrency';

/**
 * Détection de la devise d'affichage.
 *
 * Le pays vient de l'infrastructure (header Vercel / Cloudflare), pas du client :
 * il n'est donc pas falsifiable par un utilisateur qui voudrait changer de tarif.
 * Le fuseau horaire est accepté en secours (`?tz=`) pour les déploiements qui
 * ne fournissent pas ces headers (ex. `next dev` en local).
 */
export async function GET(req: NextRequest) {
  const country = countryFromHeaders(req.headers);
  const timeZone = req.nextUrl.searchParams.get('tz');
  const currency = resolveCurrency({ country, timeZone });

  return NextResponse.json(
    { currency, country },
    { headers: { 'Cache-Control': 'private, max-age=3600' } }
  );
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';
import { PRICING_CONFIG } from '@/lib/pricingConfig';

const sessionsCreate = vi.fn();
const getUser = vi.fn();

// Le module stripe reel exige STRIPE_SECRET_KEY : on l'intercepte pour observer
// exactement ce que la route transmet a l'API Stripe.
vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: sessionsCreate } } },
}));

// Supabase est mocke : la route exige un utilisateur authentifie (un invite ne peut pas
// s'abonner, le webhook n'aurait personne a crediter).
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { getUser } }),
}));

const { POST } = await import('./route');

const AUTH = { Authorization: 'Bearer fake-jwt-token' };

function post(body: Record<string, unknown>, headers: Record<string, string> = AUTH): Promise<Response> {
  const req = new Request('http://localhost/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return POST(req as unknown as NextRequest);
}

function lastCreateArg() {
  return sessionsCreate.mock.calls.at(-1)?.[0];
}

beforeEach(() => {
  sessionsCreate.mockReset();
  sessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.test/session' });
  getUser.mockReset();
  getUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'eleve@kenza.test' } }, error: null });
});

describe('checkout — compte obligatoire', () => {
  it('sans Authorization : refuse en 401 sans appeler Stripe', async () => {
    const res = await post({ billingCycle: 'yearly', currency: 'EUR' }, {});
    expect(res.status).toBe(401);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('jeton invalide (aucun utilisateur) : refuse en 401 sans appeler Stripe', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: { message: 'invalid token' } });
    const res = await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(res.status).toBe(401);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('utilisateur authentifie : rattache la session a son id, jamais a anonymous', async () => {
    await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(lastCreateArg().metadata.userId).toBe('user-1');
    expect(lastCreateArg().client_reference_id).toBe('user-1');
  });
});

describe('checkout — essai gratuit 7 jours', () => {
  it('annuel (EUR) : passe subscription_data.trial_period_days = 7', async () => {
    const res = await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(res.status).toBe(200);
    expect(lastCreateArg().subscription_data).toEqual({ trial_period_days: PRICING_CONFIG.annual.trialDays });
  });

  it('annuel (MAD) : passe aussi trial_period_days = 7', async () => {
    await post({ billingCycle: 'yearly', currency: 'MAD' });
    expect(lastCreateArg().subscription_data).toEqual({ trial_period_days: PRICING_CONFIG.annual.trialDays });
  });

  it('mensuel : ne passe AUCUN trial_period_days (facturation immediate)', async () => {
    const res = await post({ billingCycle: 'monthly', currency: 'EUR' });
    expect(res.status).toBe(200);
    expect(lastCreateArg().subscription_data).toBeUndefined();
  });

  it('annuel : le tarif reste celui de la config (59,00 EUR)', async () => {
    await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(lastCreateArg().line_items[0].price_data.unit_amount).toBe(PRICING_CONFIG.annual.priceEUR * 100);
  });

  it('annuel : reste un abonnement recurrent annuel', async () => {
    await post({ billingCycle: 'yearly', currency: 'EUR' });
    const price = lastCreateArg().line_items[0].price_data;
    expect(lastCreateArg().mode).toBe('subscription');
    expect(price.recurring.interval).toBe('year');
  });
});

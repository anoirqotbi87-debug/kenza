import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const sessionsCreate = vi.fn();

// Le module stripe reel exige STRIPE_SECRET_KEY : on l'intercepte pour observer
// exactement ce que la route transmet a l'API Stripe.
vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: sessionsCreate } } },
}));

const { POST } = await import('./route');

function post(body: Record<string, unknown>): Promise<Response> {
  const req = new Request('http://localhost/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
});

describe('checkout — essai gratuit 7 jours', () => {
  it('annuel (EUR) : passe subscription_data.trial_period_days = 7', async () => {
    const res = await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(res.status).toBe(200);
    expect(lastCreateArg().subscription_data).toEqual({ trial_period_days: 7 });
  });

  it('annuel (MAD) : passe aussi trial_period_days = 7', async () => {
    await post({ billingCycle: 'yearly', currency: 'MAD' });
    expect(lastCreateArg().subscription_data).toEqual({ trial_period_days: 7 });
  });

  it('mensuel : ne passe AUCUN trial_period_days (facturation immediate)', async () => {
    const res = await post({ billingCycle: 'monthly', currency: 'EUR' });
    expect(res.status).toBe(200);
    expect(lastCreateArg().subscription_data).toBeUndefined();
  });

  it('annuel : le tarif reste celui de la config (59,00 EUR)', async () => {
    await post({ billingCycle: 'yearly', currency: 'EUR' });
    expect(lastCreateArg().line_items[0].price_data.unit_amount).toBe(5900);
  });

  it('annuel : reste un abonnement recurrent annuel', async () => {
    await post({ billingCycle: 'yearly', currency: 'EUR' });
    const price = lastCreateArg().line_items[0].price_data;
    expect(lastCreateArg().mode).toBe('subscription');
    expect(price.recurring.interval).toBe('year');
  });
});

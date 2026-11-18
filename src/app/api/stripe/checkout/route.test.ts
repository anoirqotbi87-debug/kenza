import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockCreateSession = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/stripe', () => {
  const mockStripe = {
    checkout: {
      sessions: {
        create: (...args: unknown[]) => mockCreateSession(...args),
      },
    },
  };
  return {
    stripe: mockStripe,
    getStripe: () => mockStripe,
    getStripeKeyMode: () => 'TEST',
  };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getUser: () => mockGetUser(),
    },
  }),
}));

import { POST } from './route';

describe('/api/stripe/checkout', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mocked',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test_anon_key',
      NEXT_PUBLIC_APP_URL: 'https://kenza-dusky.vercel.app',
    };
    mockCreateSession.mockReset();
    mockGetUser.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejette avec HTTP 401 si l’utilisateur n’est pas connecté', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const req = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ billingCycle: 'yearly', currency: 'EUR' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('Connectez-vous');
  });

  it('génère une session Checkout Annuelle EUR avec 59 EUR et 7 jours d’essai', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'usr_abc', email: 'test@example.com' } },
      error: null,
    });

    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test_annual_eur' });

    const req = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid_user_jwt',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ billingCycle: 'yearly', currency: 'EUR' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe('https://checkout.stripe.com/pay/cs_test_annual_eur');

    expect(mockCreateSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'subscription',
        customer_email: 'test@example.com',
        client_reference_id: 'usr_abc',
        subscription_data: { trial_period_days: 7 },
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: expect.objectContaining({
                name: 'Kenza Pro - Abonnement Annuel',
              }),
              unit_amount: 5900,
              recurring: { interval: 'year' },
            },
            quantity: 1,
          },
        ],
        success_url: 'https://kenza-dusky.vercel.app/?upgrade=success&session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://kenza-dusky.vercel.app/?upgrade=cancel',
      })
    );
  });

  it('génère une session Checkout Mensuelle EUR avec 9 EUR SANS période d’essai', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'usr_abc', email: 'test@example.com' } },
      error: null,
    });

    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test_monthly_eur' });

    const req = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid_user_jwt',
      },
      body: JSON.stringify({ billingCycle: 'monthly', currency: 'EUR' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const callArgs = mockCreateSession.mock.calls[0][0];
    expect(callArgs.subscription_data).toBeUndefined();
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(900);
    expect(callArgs.line_items[0].price_data.recurring.interval).toBe('month');
  });

  it('génère une session Checkout Annuelle MAD avec 590 MAD et 7 jours d’essai', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'usr_mad', email: 'mad@example.com' } },
      error: null,
    });

    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test_annual_mad' });

    const req = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid_user_jwt',
      },
      body: JSON.stringify({ billingCycle: 'yearly', currency: 'MAD' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const callArgs = mockCreateSession.mock.calls[0][0];
    expect(callArgs.subscription_data).toEqual({ trial_period_days: 7 });
    expect(callArgs.line_items[0].price_data.currency).toBe('mad');
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(59000);
  });

  it('utilise un price ID d’environnement si disponible', async () => {
    process.env.STRIPE_PRICE_ANNUAL_EUR = 'price_live_custom_annual_eur';

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'usr_abc', email: 'test@example.com' } },
      error: null,
    });

    mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/pay/cs_test_custom_price' });

    const req = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer valid_user_jwt',
      },
      body: JSON.stringify({ billingCycle: 'yearly', currency: 'EUR' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const callArgs = mockCreateSession.mock.calls[0][0];
    expect(callArgs.line_items[0]).toEqual({
      price: 'price_live_custom_annual_eur',
      quantity: 1,
    });
  });
});

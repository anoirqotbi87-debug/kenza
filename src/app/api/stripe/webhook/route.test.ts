import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockConstructEvent = vi.fn();
const mockRpc = vi.fn();

vi.mock('@/lib/stripe', () => {
  const mockStripe = {
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
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
    rpc: (...args: unknown[]) => mockRpc(...args),
  }),
}));

import { POST } from './route';

describe('/api/stripe/webhook', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: 'sk_test_mocked',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_secret',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test_service_key',
    };
    mockConstructEvent.mockReset();
    mockRpc.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejette avec HTTP 400 si l’en-tête stripe-signature est manquant', async () => {
    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({ test: true }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing stripe-signature header');
  });

  it('rejette avec HTTP 400 si la signature est invalide', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid_sig',
      },
      body: 'raw_payload',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Webhook Signature Error');
  });

  it('traite checkout.session.completed avec succès et appelle set_user_subscription', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'user_123',
          customer: 'cus_abc',
          subscription: 'sub_xyz',
          metadata: {
            billingCycle: 'yearly',
          },
        },
      },
    });

    mockRpc.mockResolvedValue({ error: null });

    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_sig',
      },
      body: 'valid_payload',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    expect(mockRpc).toHaveBeenCalledWith('set_user_subscription', {
      p_user_id: 'user_123',
      p_is_premium: true,
      p_customer_id: 'cus_abc',
      p_subscription_id: 'sub_xyz',
      p_cycle: 'yearly',
    });
  });

  it('traite customer.subscription.created et met à jour update_user_subscription_status', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_created_123',
          status: 'trialing',
        },
      },
    });

    mockRpc.mockResolvedValue({ error: null });

    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_sig',
      },
      body: 'valid_payload',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    expect(mockRpc).toHaveBeenCalledWith('update_user_subscription_status', {
      p_subscription_id: 'sub_created_123',
      p_is_active: true,
    });
  });

  it('traite customer.subscription.updated et met à jour update_user_subscription_status', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_updated_123',
          status: 'active',
        },
      },
    });

    mockRpc.mockResolvedValue({ error: null });

    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_sig',
      },
      body: 'valid_payload',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    expect(mockRpc).toHaveBeenCalledWith('update_user_subscription_status', {
      p_subscription_id: 'sub_updated_123',
      p_is_active: true,
    });
  });

  it('traite customer.subscription.deleted et appelle cancel_user_subscription', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_deleted_123',
        },
      },
    });

    mockRpc.mockResolvedValue({ error: null });

    const req = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'valid_sig',
      },
      body: 'valid_payload',
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    expect(mockRpc).toHaveBeenCalledWith('cancel_user_subscription', {
      p_subscription_id: 'sub_deleted_123',
    });
  });
});

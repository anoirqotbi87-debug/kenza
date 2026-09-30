import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const getUser = vi.fn();
const single = vi.fn();

// `stripe` est volontairement null : on teste le cas « Stripe non configuré ».
vi.mock('@/lib/stripe', () => ({ stripe: null }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: { getUser },
    from: () => ({ select: () => ({ eq: () => ({ single }) }) }),
  }),
}));

const { POST } = await import('./route');

function post(headers: Record<string, string> = { Authorization: 'Bearer token' }) {
  const req = new Request('http://localhost/api/stripe/portal', { method: 'POST', headers });
  return POST(req as unknown as NextRequest);
}

beforeEach(() => {
  getUser.mockReset();
  single.mockReset();
  getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
  single.mockResolvedValue({ data: { stripe_customer_id: null, is_premium: true } });
});

describe('portail Stripe — pas de faux succes', () => {
  it('sans Authorization -> 401', async () => {
    const res = await post({});
    expect(res.status).toBe(401);
  });

  it('Stripe non configure -> 503 explicite, jamais un succes simule', async () => {
    const res = await post();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.url).toBeUndefined();
    expect(body.simulated).toBeUndefined();
    expect(JSON.stringify(body).toLowerCase()).not.toContain('démo');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('demo');
  });
});

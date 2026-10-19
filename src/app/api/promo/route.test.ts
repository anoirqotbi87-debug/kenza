import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const eqMock = vi.fn();
const updateMock = vi.fn(() => ({
  eq: eqMock,
}));
const fromMock = vi.fn(() => ({
  update: updateMock,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: fromMock,
  })),
}));

// Setup test env variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

const { POST } = await import('./route');

describe('/api/promo route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eqMock.mockResolvedValue({ error: null });
  });

  it('renvoie 401 si userId est manquant', async () => {
    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'vipeider' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain('connecter');
  });

  it('renvoie 400 si le code est manquant', async () => {
    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-123' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('manquant');
  });

  it('renvoie 400 si le code est invalide', async () => {
    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-123', code: 'INVALID_CODE' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Code promotionnel invalide ou expiré.');
  });

  it('active le code en minuscules (vipeider) et renvoie 200', async () => {
    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-123', code: 'vipeider' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Code VIP activé');

    expect(fromMock).toHaveBeenCalledWith('profiles');
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        is_premium: true,
        subscription_cycle: 'PROMO_VIPEIDER',
      })
    );
    expect(eqMock).toHaveBeenCalledWith('id', 'user-123');
  });

  it('active le code en majuscules avec espaces (  VIPEIDER  ) et renvoie 200', async () => {
    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-456', code: '  VIPEIDER  ' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(eqMock).toHaveBeenCalledWith('id', 'user-456');
  });

  it('renvoie 500 si la mise à jour Supabase échoue', async () => {
    eqMock.mockResolvedValue({ error: { message: 'Database error' } });

    const req = new Request('http://localhost/api/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-123', code: 'vipeider' }),
    });

    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("Échec de l'activation");
  });
});

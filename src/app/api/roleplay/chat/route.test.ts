import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const checkRateLimitMock = vi.fn();
const streamTextMock = vi.fn();

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimitMock(...args),
  getClientIp: () => '127.0.0.1',
}));

vi.mock('ai', () => ({
  streamText: (...args: unknown[]) => streamTextMock(...args),
}));

vi.mock('@ai-sdk/google', () => ({
  google: vi.fn(),
  createGoogleGenerativeAI: () => vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  }),
}));

const { POST } = await import('./route');
const { sanitizeHistory } = await import('@/lib/ai/sanitizeHistory');

beforeEach(() => {
  checkRateLimitMock.mockReset();
  checkRateLimitMock.mockResolvedValue({ allowed: true });
  streamTextMock.mockReset();
  streamTextMock.mockResolvedValue({
    toDataStreamResponse: () => new Response('streamed-data', { status: 200 }),
  });
});

describe('/api/roleplay/chat security & rate limit', () => {
  it('rejette avec 403 si aucun en-tête d’origine, referer ou sec-fetch-site n’est présent', async () => {
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
    const text = await res.text();
    expect(text).toContain('Missing origin headers');
  });

  it('rejette avec 403 si sec-fetch-site vaut cross-site', async () => {
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sec-fetch-site': 'cross-site',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('rejette avec 403 si l’Origin n’est pas autorisée', async () => {
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://malicious-site.com',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('rejette avec 403 si le Referer n’est pas autorisé', async () => {
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        referer: 'https://malicious-site.com/test',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('fail-closed : renvoie 503 si le rate limit IP échoue (erreur Supabase DB)', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: true, error: 'DB_CONNECTION_FAILED' });
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(503);
    const text = await res.text();
    expect(text).toBe('Service Unavailable (DB)');
  });

  it('fail-closed : renvoie 503 si le quota invité échoue (erreur Supabase DB)', async () => {
    // 1st call for per-minute rate limit passes
    checkRateLimitMock.mockResolvedValueOnce({ allowed: true });
    // 2nd call for guest quota fails with DB error
    checkRateLimitMock.mockResolvedValueOnce({ allowed: true, error: 'DB_DOWN' });

    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(503);
  });

  it('renvoie 429 si le rate limit par minute est dépassé', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false });
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(429);
  });

  it('renvoie 403 avec code QUOTA_EXCEEDED si le quota invité est dépassé', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: true });
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false });

    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe('QUOTA_EXCEEDED');
  });

  it('autorise et traite la requête avec Origin valide', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true });
    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
  });

  it('renvoie immédiatement HTTP 503 en cas d’erreur 403 upstream (permission/clé invalide)', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true });
    const authErr = new Error('Permission denied');
    (authErr as unknown as { statusCode: number }).statusCode = 403;
    streamTextMock.mockRejectedValueOnce(authErr);

    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('AI_SERVICE_UNAVAILABLE');
  });

  it('renvoie HTTP 429 avec RATE_LIMIT_EXCEEDED en cas d’erreur 429 upstream (quota/rate-limit Google)', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true });
    const quotaErr = new Error('Resource exhausted');
    (quotaErr as unknown as { statusCode: number }).statusCode = 429;
    streamTextMock.mockRejectedValueOnce(quotaErr);

    const req = new Request('http://localhost/api/roleplay/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Salam' }], personaId: 'cafe' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe('RATE_LIMIT_EXCEEDED');
    expect(data.message).toContain("L'agent reprend son souffle");
  });

  it('sanitizeHistory : fusionne deux messages consécutifs et retire un message initial assistant', () => {
    const input = [
      { role: 'assistant', content: 'Salam! Marhaban bik.' },
      { role: 'user', content: 'Labas?' },
      { role: 'user', content: 'Kidayr?' },
      { role: 'assistant', content: 'Labas hamdullah.' },
      { role: 'user', content: 'Fin ghadi?' },
    ];

    const result = sanitizeHistory(input);
    expect(result).toEqual([
      { role: 'user', content: 'Labas?\nKidayr?' },
      { role: 'assistant', content: 'Labas hamdullah.' },
      { role: 'user', content: 'Fin ghadi?' },
    ]);
  });

  it('sanitizeHistory : filtre les messages vides et rejette si le dernier message n’est pas user', () => {
    expect(sanitizeHistory([])).toBeNull();
    expect(sanitizeHistory([{ role: 'assistant', content: 'Salam' }])).toBeNull();
    expect(sanitizeHistory([
      { role: 'user', content: 'Salam' },
      { role: 'assistant', content: 'Labas' },
    ])).toBeNull();
    expect(sanitizeHistory([
      { role: 'user', content: '   ' },
    ])).toBeNull();
  });
});

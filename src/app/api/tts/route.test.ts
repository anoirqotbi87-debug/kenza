import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const checkRateLimitMock = vi.fn();

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimitMock(...args),
  getClientIp: () => '127.0.0.1',
}));

vi.mock('msedge-tts', () => ({
  OUTPUT_FORMAT: { AUDIO_24KHZ_48KBITRATE_MONO_MP3: 'audio-mp3' },
  MsEdgeTTS: vi.fn().mockImplementation(() => ({
    setMetadata: vi.fn().mockResolvedValue(undefined),
    rawToStream: vi.fn().mockReturnValue({
      audioStream: {
        on: (event: string, cb: (data?: unknown) => void) => {
          if (event === 'data') cb(Buffer.from('fake-audio'));
          if (event === 'end') cb();
        },
      },
    }),
  })),
}));

const { POST, GET } = await import('./route');

beforeEach(() => {
  checkRateLimitMock.mockReset();
  checkRateLimitMock.mockResolvedValue({ allowed: true });
});

describe('/api/tts security & rate limit', () => {
  it('rejette avec 403 si aucun en-tête d’origine, referer ou sec-fetch-site n’est présent', async () => {
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe('UNAUTHORIZED_ORIGIN');
  });

  it('rejette avec 403 si sec-fetch-site vaut cross-site', async () => {
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sec-fetch-site': 'cross-site',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('rejette avec 403 si l’Origin n’est pas autorisée', async () => {
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://evil-attacker.com',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('rejette avec 403 si le Referer n’est pas autorisé', async () => {
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        referer: 'https://evil-attacker.com/malicious',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(403);
  });

  it('fail-closed : renvoie 503 si la base de données de rate limit est en erreur (POST)', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true, error: 'DB_CONNECTION_TIMEOUT' });
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://kenza-dusky.vercel.app',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('SERVICE_UNAVAILABLE');
  });

  it('fail-closed : renvoie 503 si la base de données de rate limit est en erreur (GET)', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true, error: 'DB_CONNECTION_TIMEOUT' });
    const req = new Request('http://localhost/api/tts?text=Salam', {
      method: 'GET',
      headers: {
        'sec-fetch-site': 'same-origin',
      },
    });
    const res = await GET(req as unknown as NextRequest);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('SERVICE_UNAVAILABLE');
  });

  it('renvoie 429 si le rate limit est dépassé', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false });
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(429);
  });

  it('autorise une requête avec Origin valide (localhost / vercel)', async () => {
    const req = new Request('http://localhost/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ text: 'Salam' }),
    });
    const res = await POST(req as unknown as NextRequest);
    expect(res.status).toBe(200);
  });
});

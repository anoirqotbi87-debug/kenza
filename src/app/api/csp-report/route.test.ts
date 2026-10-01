import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { NextRequest } from 'next/server';

const checkRateLimitMock = vi.fn();

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimitMock(...args),
  getClientIp: () => '127.0.0.1',
}));

const { POST } = await import('./route');

/** Requête de rapport : sans Origin ni Referer, comme un navigateur réel. */
function report(body: unknown, raw?: string) {
  const req = new Request('http://localhost/api/csp-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/csp-report' },
    body: raw ?? JSON.stringify(body),
  });
  return POST(req as unknown as NextRequest);
}

const LEGACY = {
  'csp-report': {
    'document-uri': 'https://kenza-dusky.vercel.app/etudier',
    'violated-directive': "script-src 'self'",
    'effective-directive': 'script-src-elem',
    'blocked-uri': 'https://evil.example.com/x.js',
  },
};

let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  checkRateLimitMock.mockReset();
  checkRateLimitMock.mockResolvedValue({ allowed: true });
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
});

describe('/api/csp-report collecte', () => {
  it('accepte un rapport legacy SANS Origin ni Referer (204)', async () => {
    const res = await report(LEGACY);
    expect(res.status).toBe(204);
  });

  it('accepte le format Reporting API { type, body } (204)', async () => {
    const res = await report({
      type: 'csp-violation',
      body: { 'effective-directive': 'img-src', 'blocked-uri': 'https://tracker.example.com/p.gif' },
    });
    expect(res.status).toBe(204);
  });

  it('accepte un lot de rapports (204)', async () => {
    const res = await report([LEGACY, { type: 'csp-violation', body: { 'effective-directive': 'style-src' } }]);
    expect(res.status).toBe(204);
  });

  it('journalise la directive et l’URI bloquée', async () => {
    await report(LEGACY);
    const logged = warnSpy.mock.calls.map((c) => String(c[0])).join(' ');
    expect(logged).toContain('[CSP Violation]');
    expect(warnSpy.mock.calls.map((c) => JSON.stringify(c)).join(' ')).toContain('script-src-elem');
  });

  it('neutralise les caractères de contrôle pour empêcher la forge de lignes de log', async () => {
    await report({
      'csp-report': { 'effective-directive': 'script-src', 'blocked-uri': 'evil\nFAKE LOG LINE\r\nx' },
    });
    const payloads = warnSpy.mock.calls
      .filter((c) => String(c[0]).includes('[CSP Violation]'))
      .map((c) => String(c[1] ?? ''))
      .join(' ');
    expect(payloads).not.toContain('\n');
    expect(payloads).not.toContain('\r');
    expect(payloads).toContain('evil FAKE LOG LINE');
  });

  it('ignore silencieusement un corps inexploitable (204)', async () => {
    const res = await report(null);
    expect(res.status).toBe(204);
  });
});

describe('/api/csp-report robustesse', () => {
  it('rejette un corps non-JSON avec 400', async () => {
    const res = await report(null, 'pas du json');
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('INVALID_JSON');
  });

  it('rejette un corps trop volumineux avec 413', async () => {
    const res = await report(null, 'x'.repeat(8 * 1024 + 1));
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe('PAYLOAD_TOO_LARGE');
  });

  it('renvoie 429 quand le rate limit est dépassé', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false });
    const res = await report(LEGACY);
    expect(res.status).toBe(429);
  });

  it('fail-open : accepte le rapport (204) si le rate limit est indisponible', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false, error: 'DB_CONNECTION_TIMEOUT' });
    const res = await report(LEGACY);
    expect(res.status).toBe(204);
    expect(warnSpy.mock.calls.map((c) => String(c[0])).join(' ')).toContain('indisponible');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { NextRequest } from 'next/server';

const checkRateLimitMock = vi.fn();
const probeTtsMock = vi.fn();

vi.mock('@/lib/rateLimit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimitMock(...args),
  getClientIp: () => '127.0.0.1',
}));

vi.mock('@/lib/tts/health', () => ({
  probeTts: (...args: unknown[]) => probeTtsMock(...args),
}));

const { GET } = await import('./route');

beforeEach(() => {
  checkRateLimitMock.mockReset();
  checkRateLimitMock.mockResolvedValue({ allowed: true });
  probeTtsMock.mockReset();
  delete process.env.TTS_HEALTH_TOKEN;
});

afterEach(() => {
  delete process.env.TTS_HEALTH_TOKEN;
});

function request(url = 'http://localhost/api/health/tts', headers: Record<string, string> = {}) {
  return new Request(url, { headers }) as unknown as NextRequest;
}

describe('GET /api/health/tts', () => {
  it('renvoie 200 avec la taille du flux quand le moteur est sain', async () => {
    probeTtsMock.mockResolvedValue({ status: 'ok', bytes: 11232, latencyMs: 900 });

    const res = await GET(request());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ status: 'ok', bytes: 11232, latencyMs: 900 });
  });

  it('renvoie 503 avec la raison quand le moteur est dégradé', async () => {
    probeTtsMock.mockResolvedValue({
      status: 'degraded',
      bytes: 0,
      latencyMs: 1500,
      error: 'Edge TTS handshake refused: HTTP 200',
    });

    const res = await GET(request());
    const data = await res.json();

    expect(res.status).toBe(503);
    expect(data.status).toBe('degraded');
    expect(data.reason).toContain('HTTP 200');
  });

  it('interdit la mise en cache (sinon la sonde validerait un résultat périmé)', async () => {
    probeTtsMock.mockResolvedValue({ status: 'ok', bytes: 11232, latencyMs: 900 });

    const res = await GET(request());

    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('ne prend AUCUN paramètre de texte : impossible de s’en servir comme relais', async () => {
    probeTtsMock.mockResolvedValue({ status: 'ok', bytes: 11232, latencyMs: 900 });

    await GET(request('http://localhost/api/health/tts?text=n%27importe%20quoi'));

    // probeTts est appelé sans argument métier : le mot témoin est figé dans le module.
    expect(probeTtsMock).toHaveBeenCalledWith({ timeoutMs: 10000 });
  });

  it('exige le jeton quand TTS_HEALTH_TOKEN est configuré', async () => {
    process.env.TTS_HEALTH_TOKEN = 'secret-value';
    probeTtsMock.mockResolvedValue({ status: 'ok', bytes: 11232, latencyMs: 900 });

    const denied = await GET(request());
    expect(denied.status).toBe(401);

    const allowed = await GET(request('http://localhost/api/health/tts', {
      authorization: 'Bearer secret-value',
    }));
    expect(allowed.status).toBe(200);
    expect(probeTtsMock).toHaveBeenCalledTimes(1);
  });

  it('refuse au-delà de la limite de débit', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false });

    const res = await GET(request());

    expect(res.status).toBe(429);
    expect(probeTtsMock).not.toHaveBeenCalled();
  });

  it('mesure quand même si le limiteur est indisponible (pas de faux dégradé)', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: true, error: 'SUPABASE_SERVICE_ROLE_KEY manquant' });
    probeTtsMock.mockResolvedValue({ status: 'ok', bytes: 11232, latencyMs: 900 });

    const res = await GET(request());

    expect(res.status).toBe(200);
    expect(probeTtsMock).toHaveBeenCalledTimes(1);
  });
});

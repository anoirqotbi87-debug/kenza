import { describe, it, expect, afterAll } from 'vitest';

type HeaderEntry = { key: string; value: string };

// Fixé avant l'import : `next.config.ts` dérive `connect-src` de cette variable
// au chargement du module.
const ORIGINAL_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-projet.supabase.co';

const config = (await import('../../../../next.config')).default;

afterAll(() => {
  if (ORIGINAL_SUPABASE_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_SUPABASE_URL;
});

async function headersFor(): Promise<HeaderEntry[]> {
  const groups = await config.headers!();
  return groups.flatMap((group) => group.headers as HeaderEntry[]);
}

async function csp(): Promise<string> {
  const header = (await headersFor()).find((h) => h.key === 'Content-Security-Policy-Report-Only');
  expect(header).toBeDefined();
  return header!.value;
}

describe('en-têtes de sécurité (next.config.ts)', () => {
  it('la CSP Report-Only déclare un endpoint de collecte', async () => {
    expect(await csp()).toContain('report-uri /api/csp-report');
  });

  it('la CSP reste en mode Report-Only (aucun blocage en production)', async () => {
    const keys = (await headersFor()).map((h) => h.key);
    expect(keys).toContain('Content-Security-Policy-Report-Only');
    expect(keys).not.toContain('Content-Security-Policy');
  });

  it('les en-têtes de sécurité de base sont toujours présents', async () => {
    const keys = (await headersFor()).map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Strict-Transport-Security',
      ])
    );
  });
});

describe('assainissement de la CSP', () => {
  it("n'autorise plus 'unsafe-eval'", async () => {
    expect(await csp()).not.toContain("'unsafe-eval'");
  });

  it("conserve 'unsafe-inline' (requis par l'hydratation Next.js)", async () => {
    expect(await csp()).toContain("script-src 'self' 'unsafe-inline'");
  });

  it('ne référence plus les domaines Google Fonts (polices auto-hébergées)', async () => {
    const value = await csp();
    expect(value).not.toContain('fonts.googleapis.com');
    expect(value).not.toContain('fonts.gstatic.com');
    expect(value).toContain("font-src 'self'");
  });

  it("n'autorise plus `https:` en bloc pour les images", async () => {
    const imgSrc = (await csp()).split(';').find((d) => d.trim().startsWith('img-src'));
    expect(imgSrc).toBeDefined();
    expect(imgSrc!.trim()).toBe("img-src 'self' data: blob:");
  });

  it('borne connect-src à soi-même et à Supabase (plus de `https:` ni `wss:` générique)', async () => {
    const connectSrc = (await csp()).split(';').find((d) => d.trim().startsWith('connect-src'));
    expect(connectSrc).toBeDefined();
    expect(connectSrc).toContain("'self'");
    expect(connectSrc).toContain('https://test-projet.supabase.co');
    // Le point de l'assainissement : aucune autorisation en bloc.
    expect(connectSrc).not.toMatch(/connect-src[^;]*\shttps:(\s|;|$)/);
    expect(connectSrc).not.toContain('wss:');
  });

  it('déclare les directives manquantes', async () => {
    const value = await csp();
    expect(value).toContain("object-src 'none'");
    expect(value).toContain("base-uri 'self'");
    expect(value).toContain("frame-ancestors 'none'");
  });
});

describe('en-têtes de téléchargement APK', () => {
  it('configure le type MIME et le téléchargement direct pour les fichiers APK', async () => {
    const groups = await config.headers!();
    const apkGroup = groups.find((g: { source: string }) => g.source === '/downloads/:path*.apk');
    expect(apkGroup).toBeDefined();
    const headers = apkGroup!.headers as HeaderEntry[];
    expect(headers).toContainEqual({
      key: 'Content-Type',
      value: 'application/vnd.android.package-archive',
    });
    expect(headers).toContainEqual({
      key: 'Content-Disposition',
      value: 'attachment; filename="kenza-v1.0.apk"',
    });
    expect(headers).toContainEqual({
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    });
  });
});


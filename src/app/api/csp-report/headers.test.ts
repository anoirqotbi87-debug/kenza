import { describe, it, expect } from 'vitest';

type HeaderEntry = { key: string; value: string };

const config = (await import('../../../../next.config')).default;

async function headersFor(): Promise<HeaderEntry[]> {
  const groups = await config.headers!();
  return groups.flatMap((group) => group.headers as HeaderEntry[]);
}

describe('en-têtes de sécurité (next.config.ts)', () => {
  it('la CSP Report-Only déclare un endpoint de collecte', async () => {
    const csp = (await headersFor()).find((h) => h.key === 'Content-Security-Policy-Report-Only');
    expect(csp).toBeDefined();
    expect(csp!.value).toContain('report-uri /api/csp-report');
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

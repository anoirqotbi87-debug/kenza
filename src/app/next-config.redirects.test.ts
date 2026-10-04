import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('next.config redirects (légaux)', () => {
  const config = readFileSync(resolve(ROOT, 'next.config.ts'), 'utf-8');

  it('redirige /privacy vers /confidentialite (permanent) avant toute autre règle', () => {
    expect(config).toContain("source: '/privacy'");
    expect(config).toContain("destination: '/confidentialite'");
    expect(config).toContain('permanent: true');
  });

  it('garde la redirection de /roleplay vers /parler existante', () => {
    expect(config).toContain("source: '/roleplay'");
    expect(config).toContain("destination: '/parler'");
  });
});
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isAllowedOrigin, safeRedirectOrigin } from './allowedOrigins';

describe('allowedOrigins security allowlist', () => {
  const origEnv = process.env;

  beforeEach(() => {
    process.env = { ...origEnv };
  });

  afterEach(() => {
    process.env = origEnv;
  });

  it('autorise les domaines officiels de production', () => {
    expect(isAllowedOrigin('https://kenza.vercel.app')).toBe(true);
    expect(isAllowedOrigin('https://kenza-dusky.vercel.app')).toBe(true);
  });

  it('autorise localhost en développement', () => {
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://localhost:8080')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:3000')).toBe(true);
  });

  it('REJETTE les domaines tiers *.vercel.app (anti-phishing / anti-bypass)', () => {
    expect(isAllowedOrigin('https://attacker.vercel.app')).toBe(false);
    expect(isAllowedOrigin('https://evil-kenza.vercel.app')).toBe(false);
    expect(isAllowedOrigin('https://phishing.vercel.app')).toBe(false);
    expect(isAllowedOrigin('https://malicious.com')).toBe(false);
  });

  it('autorise VERCEL_URL si défini par l’infrastructure Vercel pour une preview légitime', () => {
    process.env.VERCEL_URL = 'kenza-git-feat-branch.vercel.app';
    expect(isAllowedOrigin('https://kenza-git-feat-branch.vercel.app')).toBe(true);
  });

  it('safeRedirectOrigin retombe sur PRODUCTION_ORIGIN pour les origines non autorisées', () => {
    expect(safeRedirectOrigin('https://attacker.vercel.app')).toBe('https://kenza-dusky.vercel.app');
    expect(safeRedirectOrigin('https://evil.com')).toBe('https://kenza-dusky.vercel.app');
    expect(safeRedirectOrigin(null)).toBe('https://kenza-dusky.vercel.app');
    expect(safeRedirectOrigin('https://kenza.vercel.app')).toBe('https://kenza.vercel.app');
  });
});

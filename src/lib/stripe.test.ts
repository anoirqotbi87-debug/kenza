import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStripeKeyMode, getStripe } from './stripe';

describe('stripe key mode and initialization', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('détecte correctement le mode LIVE', () => {
    expect(getStripeKeyMode('sk_live_1234567890abcdef')).toBe('LIVE');
  });

  it('détecte correctement le mode TEST', () => {
    expect(getStripeKeyMode('sk_test_1234567890abcdef')).toBe('TEST');
  });

  it('détecte correctement une clé manquante ou invalide', () => {
    expect(getStripeKeyMode(undefined)).toBe('MISSING');
    expect(getStripeKeyMode('')).toBe('MISSING');
    expect(getStripeKeyMode('invalid_key')).toBe('MISSING');
  });

  it('retourne null si STRIPE_SECRET_KEY est absente', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(getStripe()).toBeNull();
  });

  it('émet un avertissement si mode TEST en environnement de production', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mocked_for_test';
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    process.env.VERCEL_ENV = 'production';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    getStripe();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Environnement de production détecté mais STRIPE_SECRET_KEY est en mode TEST')
    );
  });
});

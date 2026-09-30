import { describe, it, expect, vi } from 'vitest';
import { confirmPremiumAfterCheckout } from './stripeReturn';

const FAST = { attempts: 5, delayMs: 0 };

describe('confirmPremiumAfterCheckout', () => {
  it("n'accorde jamais le premium si la base dit non (URL forgee)", async () => {
    const fetchPremium = vi.fn().mockResolvedValue(false);
    await expect(confirmPremiumAfterCheckout(fetchPremium, FAST)).resolves.toBe(false);
    expect(fetchPremium).toHaveBeenCalledTimes(5);
  });

  it('accorde le premium des que la base confirme', async () => {
    const fetchPremium = vi.fn().mockResolvedValue(true);
    await expect(confirmPremiumAfterCheckout(fetchPremium, FAST)).resolves.toBe(true);
    expect(fetchPremium).toHaveBeenCalledTimes(1);
  });

  it('retente quand le webhook Stripe arrive apres le navigateur', async () => {
    const fetchPremium = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);
    await expect(confirmPremiumAfterCheckout(fetchPremium, FAST)).resolves.toBe(true);
    expect(fetchPremium).toHaveBeenCalledTimes(3);
  });

  it('remonte une erreur de lecture comme un refus, sans jamais debloquer', async () => {
    const fetchPremium = vi.fn().mockRejectedValue(new Error('network down'));
    await expect(confirmPremiumAfterCheckout(fetchPremium, FAST)).rejects.toThrow('network down');
  });
});

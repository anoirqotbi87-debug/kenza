import { describe, it, expect, vi, beforeEach } from 'vitest';

const singleMock = vi.fn();
const eqMock = vi.fn(() => ({
  single: singleMock,
}));
const selectMock = vi.fn(() => ({
  eq: eqMock,
}));
const fromMock = vi.fn(() => ({
  select: selectMock,
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: fromMock,
  },
}));

const { fetchPremiumStatus } = await import('./premium');

describe('fetchPremiumStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renvoie true si is_premium est true', async () => {
    singleMock.mockResolvedValue({
      data: { is_premium: true, subscription_cycle: 'yearly' },
      error: null,
    });

    const isPro = await fetchPremiumStatus('user-1');
    expect(isPro).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('profiles');
    expect(selectMock).toHaveBeenCalledWith('is_premium, subscription_cycle');
  });

  it('renvoie true si subscription_cycle est PROMO_VIPEIDER (accès VIP)', async () => {
    singleMock.mockResolvedValue({
      data: { is_premium: false, subscription_cycle: 'PROMO_VIPEIDER' },
      error: null,
    });

    const isPro = await fetchPremiumStatus('user-vip');
    expect(isPro).toBe(true);
  });

  it('renvoie false si l’utilisateur est gratuit', async () => {
    singleMock.mockResolvedValue({
      data: { is_premium: false, subscription_cycle: null },
      error: null,
    });

    const isPro = await fetchPremiumStatus('user-free');
    expect(isPro).toBe(false);
  });

  it('renvoie false en cas d’erreur Supabase', async () => {
    singleMock.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' },
    });

    const isPro = await fetchPremiumStatus('user-err');
    expect(isPro).toBe(false);
  });
});

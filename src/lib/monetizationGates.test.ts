import { describe, it, expect } from 'vitest';
import { shouldShowOnboardingPaywall, canDownloadOffline } from './monetizationGates';

describe('shouldShowOnboardingPaywall — Trigger 1, une seule fois', () => {
  it('se declenche quand l onboarding vient d etre termine et que le paywall n a jamais ete vu', () => {
    expect(
      shouldShowOnboardingPaywall({ hasCompletedOnboarding: true, hasSeenOnboardingPaywall: false, isPremium: false })
    ).toBe(true);
  });

  it('ne se declenche jamais deux fois', () => {
    expect(
      shouldShowOnboardingPaywall({ hasCompletedOnboarding: true, hasSeenOnboardingPaywall: true, isPremium: false })
    ).toBe(false);
  });

  it('ne se declenche pas si l onboarding n est pas termine', () => {
    expect(
      shouldShowOnboardingPaywall({ hasCompletedOnboarding: false, hasSeenOnboardingPaywall: false, isPremium: false })
    ).toBe(false);
  });

  it('ne se declenche pas pour un abonne', () => {
    expect(
      shouldShowOnboardingPaywall({ hasCompletedOnboarding: true, hasSeenOnboardingPaywall: false, isPremium: true })
    ).toBe(false);
  });
});

describe('canDownloadOffline — mode hors-ligne reserve aux Pro', () => {
  it('autorise un abonne', () => {
    expect(canDownloadOffline(true)).toBe(true);
  });

  it('refuse un utilisateur gratuit', () => {
    expect(canDownloadOffline(false)).toBe(false);
  });
});

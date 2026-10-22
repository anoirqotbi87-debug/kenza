import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';
import { fullCurriculum } from '../data/curriculum';

describe('Onboarding & Placement Store Logic', () => {
  beforeEach(() => {
    useAppStore.setState({
      completedLessons: [],
      xp: 0,
      hasCompletedOnboarding: false,
      dailyTargetMinutes: 10,
    });
  });

  it('sets completed lessons directly via setCompletedLessons', () => {
    const store = useAppStore.getState();
    expect(store.completedLessons).toEqual([]);

    store.setCompletedLessons(['greetings-1', 'numbers-1']);
    expect(useAppStore.getState().completedLessons).toEqual(['greetings-1', 'numbers-1']);
  });

  it('completes onboarding and updates goal and duration', () => {
    const store = useAppStore.getState();
    store.completeOnboarding('family', 15);

    const state = useAppStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(state.dailyTargetMinutes).toBe(15);
  });

  it('marks Module 1 and Module 2 lessons as completed for intermediate placement with +60 XP', () => {
    const m1Lessons = fullCurriculum['1']?.lessons?.map((l) => l.id) || [];
    const m2Lessons = fullCurriculum['2']?.lessons?.map((l) => l.id) || [];
    expect(m1Lessons.length).toBeGreaterThan(0);
    expect(m2Lessons.length).toBeGreaterThan(0);

    const store = useAppStore.getState();
    store.setCompletedModules(['1', '2']);
    store.addXp(60);
    store.completeOnboarding('travel', 10);

    const updated = useAppStore.getState();
    expect(updated.hasCompletedOnboarding).toBe(true);
    expect(updated.xp).toBe(60);
    expect(updated.completedLessons).toEqual(expect.arrayContaining(m1Lessons));
    expect(updated.completedLessons).toEqual(expect.arrayContaining(m2Lessons));
  });
});

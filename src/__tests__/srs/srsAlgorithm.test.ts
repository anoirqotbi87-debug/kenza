import { describe, it, expect } from 'vitest';
import {
  srsService,
  calculateEaseFactor,
  normalizeDateToUtcMidnight,
  MIN_EASE_FACTOR,
  DEFAULT_EASE_FACTOR,
} from '@/services/srsService';
import type { SRSCard } from '@/types/srs';

describe('SRS SM-2 Algorithm & Due Date Scheduling', () => {
  const baseCard: SRSCard = {
    id: 'card_salam',
    wordId: 'srs_salam',
    interval: 0,
    repetition: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: '2026-10-03T00:00:00.000Z',
    state: 'new',
  };

  const fixedToday = new Date('2026-10-03T12:34:56.789Z');

  describe('calculateEaseFactor', () => {
    it('maintains EF on quality 4 (good): delta = 0', () => {
      const ef = calculateEaseFactor(2.5, 4);
      expect(ef).toBe(2.5);
    });

    it('increases EF by 0.1 on quality 5 (easy)', () => {
      const ef = calculateEaseFactor(2.5, 5);
      expect(ef).toBe(2.6);
    });

    it('decreases EF by 0.14 on quality 3 (hard)', () => {
      const ef = calculateEaseFactor(2.5, 3);
      expect(ef).toBe(2.36);
    });

    it('decreases EF by 0.54 on quality 1 (again)', () => {
      const ef = calculateEaseFactor(2.5, 1);
      expect(ef).toBe(1.96);
    });

    it('enforces strict minimum ease factor of 1.3', () => {
      let ef = 1.5;
      ef = calculateEaseFactor(ef, 1); // 1.5 - 0.54 = 0.96 -> clamped to 1.3
      expect(ef).toBe(MIN_EASE_FACTOR);
    });
  });

  describe('calculateNextReview progression (1st, 2nd, successive successes)', () => {
    it('schedules interval = 1 day on 1st successful review (repetition 0 -> 1)', () => {
      const next = srsService.calculateNextReview(baseCard, 'good', fixedToday);
      expect(next.interval).toBe(1);
      expect(next.repetition).toBe(1);
      expect(next.state).toBe('learning');
      expect(next.dueDate).toBe('2026-10-04T00:00:00.000Z');
      expect(next.easeFactor).toBe(2.5);
    });

    it('schedules interval = 6 days on 2nd consecutive success (repetition 1 -> 2)', () => {
      const cardAfterFirst: SRSCard = {
        ...baseCard,
        interval: 1,
        repetition: 1,
        state: 'learning',
      };
      const next = srsService.calculateNextReview(cardAfterFirst, 'good', fixedToday);
      expect(next.interval).toBe(6);
      expect(next.repetition).toBe(2);
      expect(next.state).toBe('learning');
      expect(next.dueDate).toBe('2026-10-09T00:00:00.000Z');
    });

    it('schedules interval = round(previous * EF) on 3rd success (repetition 2 -> 3)', () => {
      const cardAfterSecond: SRSCard = {
        ...baseCard,
        interval: 6,
        repetition: 2,
        state: 'learning',
        easeFactor: 2.5,
      };
      const next = srsService.calculateNextReview(cardAfterSecond, 'good', fixedToday);
      expect(next.interval).toBe(15); // Math.round(6 * 2.5) = 15
      expect(next.repetition).toBe(3);
      expect(next.dueDate).toBe('2026-10-18T00:00:00.000Z');
    });

    it('transitions to review state when repetition threshold is reached', () => {
      const cardAfterThird: SRSCard = {
        ...baseCard,
        interval: 15,
        repetition: 3,
        state: 'learning',
        easeFactor: 2.5,
      };
      const next = srsService.calculateNextReview(cardAfterThird, 'good', fixedToday);
      expect(next.repetition).toBe(4);
      expect(next.state).toBe('review');
    });
  });

  describe('Handling of failures (Again) and successive failures', () => {
    it('resets interval to 1 day and repetition to 0 on failure after previous successes', () => {
      const advancedCard: SRSCard = {
        ...baseCard,
        interval: 38,
        repetition: 4,
        easeFactor: 2.5,
        state: 'review',
      };
      const failed = srsService.calculateNextReview(advancedCard, 'again', fixedToday);
      expect(failed.interval).toBe(1);
      expect(failed.repetition).toBe(0);
      expect(failed.state).toBe('learning');
      expect(failed.easeFactor).toBe(1.96); // 2.5 - 0.54
      expect(failed.dueDate).toBe('2026-10-04T00:00:00.000Z');
    });

    it('handles successive failures without getting stuck on previous interval and floors EF at 1.3', () => {
      let card: SRSCard = {
        ...baseCard,
        interval: 15,
        repetition: 3,
        easeFactor: 2.1,
        state: 'learning',
      };

      // 1st failure
      card = srsService.calculateNextReview(card, 'again', fixedToday);
      expect(card.interval).toBe(1);
      expect(card.repetition).toBe(0);
      expect(card.easeFactor).toBe(1.56); // 2.1 - 0.54

      // 2nd successive failure
      card = srsService.calculateNextReview(card, 'again', fixedToday);
      expect(card.interval).toBe(1);
      expect(card.repetition).toBe(0);
      expect(card.easeFactor).toBe(MIN_EASE_FACTOR); // 1.56 - 0.54 = 1.02 -> clamped to 1.3

      // 3rd successive failure
      card = srsService.calculateNextReview(card, 'again', fixedToday);
      expect(card.interval).toBe(1);
      expect(card.repetition).toBe(0);
      expect(card.easeFactor).toBe(MIN_EASE_FACTOR);
    });
  });

  describe('normalizeDateToUtcMidnight', () => {
    it('sets hours, minutes, seconds and ms to zero UTC', () => {
      const date = new Date('2026-10-03T23:59:59.999Z');
      const normalized = normalizeDateToUtcMidnight(date);
      expect(normalized.getUTCHours()).toBe(0);
      expect(normalized.getUTCMinutes()).toBe(0);
      expect(normalized.getUTCSeconds()).toBe(0);
      expect(normalized.getUTCMilliseconds()).toBe(0);
      expect(normalized.toISOString()).toBe('2026-10-03T00:00:00.000Z');
    });
  });

  describe('getDueCards filtering', () => {
    it('strictly excludes unstarted cards with state = "new"', () => {
      const deck: Record<string, SRSCard> = {
        c1: { ...baseCard, id: 'c1', state: 'new', dueDate: '2026-10-01T00:00:00.000Z' },
        c2: { ...baseCard, id: 'c2', state: 'new', dueDate: '2026-10-03T00:00:00.000Z' },
      };
      const due = srsService.getDueCards(deck, fixedToday);
      expect(due).toHaveLength(0);
    });

    it('excludes cards already validated today (due tomorrow or later)', () => {
      const deck: Record<string, SRSCard> = {
        reviewedToday: {
          ...baseCard,
          id: 'rev1',
          state: 'learning',
          repetition: 1,
          interval: 1,
          dueDate: '2026-10-04T00:00:00.000Z', // Tomorrow
        },
      };
      const due = srsService.getDueCards(deck, fixedToday);
      expect(due).toHaveLength(0);
    });

    it('includes cards due today or overdue', () => {
      const deck: Record<string, SRSCard> = {
        dueToday: {
          ...baseCard,
          id: 'due1',
          state: 'learning',
          repetition: 1,
          interval: 1,
          dueDate: '2026-10-03T00:00:00.000Z',
        },
        overdue: {
          ...baseCard,
          id: 'overdue1',
          state: 'review',
          repetition: 3,
          interval: 14,
          dueDate: '2026-10-01T00:00:00.000Z',
        },
        future: {
          ...baseCard,
          id: 'future1',
          state: 'review',
          repetition: 2,
          interval: 6,
          dueDate: '2026-10-09T00:00:00.000Z',
        },
      };
      const due = srsService.getDueCards(deck, fixedToday);
      expect(due).toHaveLength(2);
      expect(due.map(c => c.id)).toEqual(expect.arrayContaining(['due1', 'overdue1']));
    });
  });
});

import { SRSCard, ReviewGrade } from '../types/srs';

const INTERVALS = [1, 3, 7, 14, 30]; // Intervals in days for boxes 1 to 5

export const srsService = {
  calculateNextReview(card: SRSCard, grade: ReviewGrade): SRSCard {
    let newRepetition = card.repetition;
    let newInterval = card.interval;

    if (grade === 'good' || grade === 'easy') {
      newRepetition = Math.min(newRepetition + 1, 5);
    } else {
      newRepetition = 1;
    }

    // Box index is repetition - 1 (box 1 -> index 0)
    const intervalDays = INTERVALS[newRepetition - 1] || 1;
    newInterval = intervalDays;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + intervalDays);

    return {
      ...card,
      repetition: newRepetition,
      interval: newInterval,
      dueDate: dueDate.toISOString(),
      state: newRepetition >= 5 ? 'review' : 'learning'
    };
  },

  getDueCards(deck: Record<string, SRSCard>): SRSCard[] {
    const now = new Date();
    return Object.values(deck).filter(card => {
      if (card.state === 'new') return true;
      const dueDate = new Date(card.dueDate);
      return dueDate <= now;
    });
  }
};

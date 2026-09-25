/**
 * Utilities for handling local dates correctly across timezones
 * Prevents UTC timezone shift issues when calculating streaks.
 */

/**
 * Returns the current local date as a YYYY-MM-DD string.
 */
export function getLocalTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the difference in days between two YYYY-MM-DD date strings.
 * Disregards time completely.
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  // Parse strings directly as YYYY, MM-1, DD to enforce local time interpretation
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);

  // Use Date.UTC to get an absolute time without timezone offsets
  const date1 = Date.UTC(y1, m1 - 1, d1);
  const date2 = Date.UTC(y2, m2 - 1, d2);

  // 1000 * 60 * 60 * 24 = 86400000
  return Math.round(Math.abs((date2 - date1) / 86400000));
}

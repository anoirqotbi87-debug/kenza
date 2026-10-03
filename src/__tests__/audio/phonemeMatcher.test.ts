import { describe, it, expect } from 'vitest';
import {
  normalizeDarijaText,
  arabicToPhoneticArabizi,
  levenshteinDistance,
  evaluatePronunciation,
  calculateSimilarity,
  CRITICAL_PHONEMES,
  ARABIC_TO_ARABIZI,
  ARABIZI_TO_ARABIC,
} from '@/lib/phonemeMatcher';

describe('Phoneme Matcher & Pronunciation Scoring (Darija)', () => {
  describe('Critical Phonemes Definition', () => {
    it('includes all 5 Moroccan Darija difficult sounds: 3, 7, 9, kh, gh', () => {
      expect(CRITICAL_PHONEMES).toEqual(['3', '7', '9', 'kh', 'gh']);
    });

    it('has accurate bidirectional mappings between Arabizi and Arabic', () => {
      expect(ARABIC_TO_ARABIZI['ع']).toBe('3');
      expect(ARABIC_TO_ARABIZI['ح']).toBe('7');
      expect(ARABIC_TO_ARABIZI['ق']).toBe('9');
      expect(ARABIC_TO_ARABIZI['خ']).toBe('kh');
      expect(ARABIC_TO_ARABIZI['غ']).toBe('gh');

      expect(ARABIZI_TO_ARABIC['3']).toBe('ع');
      expect(ARABIZI_TO_ARABIC['7']).toBe('ح');
      expect(ARABIZI_TO_ARABIC['9']).toBe('ق');
      expect(ARABIZI_TO_ARABIC['kh']).toBe('خ');
      expect(ARABIZI_TO_ARABIC['gh']).toBe('غ');
    });
  });

  describe('normalizeDarijaText', () => {
    it('converts to lowercase, removes punctuation and excess whitespace', () => {
      expect(normalizeDarijaText('Salam, Kidayr !?')).toBe('salam kidayr');
    });

    it('strips Arabic tashkeel (diacritics) and normalizes alif variants', () => {
      // أَهْلًا -> اهلا
      const input = 'أَهْلاً وَسَهْلاً';
      const normalized = normalizeDarijaText(input);
      expect(normalized).not.toContain('\u064E'); // fatha
      expect(normalized).toContain('اهلا');
    });

    it('handles empty or undefined string safely', () => {
      expect(normalizeDarijaText('')).toBe('');
    });
  });

  describe('arabicToPhoneticArabizi', () => {
    it('transliterates Arabic characters to standard Arabizi numerals', () => {
      expect(arabicToPhoneticArabizi('عافاك')).toContain('3');
      expect(arabicToPhoneticArabizi('صباح الخير')).toContain('kh');
      expect(arabicToPhoneticArabizi('قهوة')).toContain('9');
      expect(arabicToPhoneticArabizi('غادي')).toContain('gh');
      expect(arabicToPhoneticArabizi('شكرا بزاف')).toBeDefined();
    });
  });

  describe('levenshteinDistance', () => {
    it('computes 0 for identical strings', () => {
      expect(levenshteinDistance('salam', 'salam')).toBe(0);
    });

    it('computes correct edit distance for substitutions, insertions, deletions', () => {
      expect(levenshteinDistance('salam', 'salaam')).toBe(1);
      expect(levenshteinDistance('chhal', 'chhal')).toBe(0);
      expect(levenshteinDistance('daba', 'data')).toBe(1);
    });
  });

  describe('evaluatePronunciation', () => {
    it('awards 100% score and 🟢 Excellent tier for exact matching Arabizi', () => {
      const result = evaluatePronunciation('3afak bzzaf', '3afak bzzaf', 'عافاك بزاف');
      expect(result.score).toBe(100);
      expect(result.tier).toBe('excellent');
      expect(result.badge.icon).toBe('🟢');
      expect(result.missingPhonemes).toHaveLength(0);
      expect(result.detectedPhonemes).toContain('3');
    });

    it('matches spoken Arabic script with target Arabizi successfully', () => {
      const result = evaluatePronunciation('عافاك', '3afak', 'عافاك');
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.tier).toBe('excellent');
      expect(result.badge.icon).toBe('🟢');
    });

    it('detects missing critical phoneme 3 (ʿayn) and gives targeted feedback', () => {
      // User said 'afak' without the '3'
      const result = evaluatePronunciation('afak', '3afak', 'عافاك');
      expect(result.missingPhonemes).toContain('3');
      expect(result.targetPhonemes.find(p => p.char === '3')?.detected).toBe(false);
      expect(result.score).toBeLessThan(90);
    });

    it('detects missing critical phoneme 7 (ḥāʾ) in sbah l-khir / sba7 l-khir', () => {
      const result = evaluatePronunciation('sba lkhir', 'sba7 l-khir', 'صباح الخير');
      expect(result.missingPhonemes).toContain('7');
      expect(result.badge.icon).toBe('🟡');
      expect(result.badge.text).toContain('7');
    });

    it('recognizes 5 as Arabizi variant of kh (خ)', () => {
      const result = evaluatePronunciation('sba7 l-5ir', 'sba7 l-khir', 'صباح الخير');
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.tier).toBe('excellent');
      expect(result.detectedPhonemes).toContain('kh');
    });

    it('gives 🔴 Needs Work tier when pronunciation is distant', () => {
      const result = evaluatePronunciation('bonjour monsieur', '3afak bzzaf', 'عافاك بزاف');
      expect(result.score).toBeLessThan(50);
      expect(result.tier).toBe('needs_work');
      expect(result.badge.icon).toBe('🔴');
      expect(result.badge.text).toContain('mode ralenti');
    });

    it('provides backwards-compatible calculateSimilarity alias', () => {
      expect(typeof calculateSimilarity).toBe('function');
      const res = calculateSimilarity('salam', 'salam');
      expect(res.score).toBe(100);
    });
  });
});

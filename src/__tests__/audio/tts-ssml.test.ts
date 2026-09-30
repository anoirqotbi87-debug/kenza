import { describe, it, expect } from 'vitest';
import {
  escapeXml,
  getVoiceName,
  getProsodyRate,
  buildSsml,
  VOICE_FEMALE,
  VOICE_MALE,
  RATE_NORMAL,
  RATE_SLOW,
} from '@/lib/tts/ssml';

describe('TTS SSML Builder (msedge-tts Moroccan Darija)', () => {
  describe('escapeXml', () => {
    it('escapes reserved XML characters correctly', () => {
      const input = `Darija & Arabic: <tag> "citation" 'quote'`;
      const expected = `Darija &amp; Arabic: &lt;tag&gt; &quot;citation&quot; &apos;quote&apos;`;
      expect(escapeXml(input)).toBe(expected);
    });

    it('returns empty string if given empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('leaves plain text untouched', () => {
      expect(escapeXml('Salam kidayr')).toBe('Salam kidayr');
    });
  });

  describe('Voice and Rate resolution', () => {
    it('resolves female voice by default or when specified', () => {
      expect(getVoiceName('female')).toBe(VOICE_FEMALE);
      expect(getVoiceName()).toBe(VOICE_FEMALE);
      expect(VOICE_FEMALE).toBe('ar-MA-MounaNeural');
    });

    it('resolves male voice when specified', () => {
      expect(getVoiceName('male')).toBe(VOICE_MALE);
      expect(VOICE_MALE).toBe('ar-MA-JamalNeural');
    });

    it('resolves normal speed to -5% rate (fluent spoken Darija)', () => {
      expect(getProsodyRate('normal')).toBe(RATE_NORMAL);
      expect(RATE_NORMAL).toBe('-5%');
      expect(getProsodyRate()).toBe(RATE_NORMAL);
    });

    it('resolves slow speed to -25% rate (0.75x turtle mode for phoneme clarity)', () => {
      expect(getProsodyRate('slow')).toBe(RATE_SLOW);
      expect(RATE_SLOW).toBe('-25%');
    });
  });

  describe('buildSsml', () => {
    it('generates valid well-formed SSML with female voice and normal speed', () => {
      const result = buildSsml('Salam kidayr', 'female', 'normal');
      expect(result.voiceName).toBe('ar-MA-MounaNeural');
      expect(result.rate).toBe('-5%');
      expect(result.ssml).toBe(
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-MA"><voice name="ar-MA-MounaNeural"><prosody rate="-5%">Salam kidayr</prosody></voice></speak>'
      );
    });

    it('generates well-formed SSML with male voice and slow turtle speed', () => {
      const result = buildSsml('Fin ghadi 3afak ?', 'male', 'slow');
      expect(result.voiceName).toBe('ar-MA-JamalNeural');
      expect(result.rate).toBe('-25%');
      expect(result.ssml).toContain('name="ar-MA-JamalNeural"');
      expect(result.ssml).toContain('rate="-25%"');
      expect(result.ssml).toContain('Fin ghadi 3afak ?');
    });

    it('escapes XML characters in the synthesized text', () => {
      const result = buildSsml('Atay & Qahwa <nss-nss>', 'female', 'normal');
      expect(result.ssml).toContain('Atay &amp; Qahwa &lt;nss-nss&gt;');
      expect(result.ssml).not.toContain('<nss-nss>');
    });
  });
});

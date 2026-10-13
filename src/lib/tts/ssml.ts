export type TtsVoice = 'female' | 'male';
export type TtsSpeed = 'normal' | 'slow';

export const VOICE_FEMALE = 'ar-MA-MounaNeural';
export const VOICE_MALE = 'ar-MA-JamalNeural';

export const RATE_NORMAL = '-8%';  // Natural Moroccan spoken cadence with distinct consonant release
export const RATE_SLOW = '-28%';   // 0.72x Turtle mode for pharyngeal/guttural clarity

/**
 * Escapes reserved XML characters to ensure valid SSML structure.
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Resolves the Edge TTS voice identifier.
 */
export function getVoiceName(voice?: TtsVoice | string): string {
  return voice === 'male' || voice === 'ar-MA-JamalNeural' || voice === VOICE_MALE
    ? VOICE_MALE
    : VOICE_FEMALE;
}

/**
 * Resolves the prosody rate percentage.
 */
export function getProsodyRate(speed?: TtsSpeed | string): string {
  return speed === 'slow' ? RATE_SLOW : RATE_NORMAL;
}

/**
 * Kept for backwards-compatibility: returns text as-is without injecting SSML breaks.
 * Moroccan voice models (ar-MA-JamalNeural / ar-MA-MounaNeural) natively pause on Arabic (،) and Latin (,) commas.
 */
export function injectBreathingPauses(escapedText: string): string {
  return escapedText;
}

/**
 * Builds a strict, well-formed SSML payload for msedge-tts.
 * - speed === 'slow': rate="-25%" pitch="+2Hz"
 * - speed === 'normal': rate="-5%"
 * - No internal <break/> tags injected to guarantee stability with Edge TTS WebSocket.
 */
export function buildSsml(
  text: string,
  voice: TtsVoice = 'female',
  speed: TtsSpeed = 'normal'
): { ssml: string; voiceName: string; rate: string } {
  const voiceName = getVoiceName(voice);
  const rate = getProsodyRate(speed);
  const pitchAttr = speed === 'slow' ? ' pitch="+2Hz"' : '';
  const escapedText = escapeXml(text);

  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-MA"><voice name="${voiceName}"><prosody rate="${rate}"${pitchAttr}>${escapedText}</prosody></voice></speak>`;

  return { ssml, voiceName, rate };
}

export type TtsVoice = 'female' | 'male';
export type TtsSpeed = 'normal' | 'slow';

export const VOICE_FEMALE = 'ar-MA-MounaNeural';
export const VOICE_MALE = 'ar-MA-JamalNeural';

export const RATE_NORMAL = '-5%';  // Natural Moroccan spoken cadence
export const RATE_SLOW = '-25%';   // 0.75x Turtle mode for pharyngeal/guttural clarity

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
 * Builds a strict, well-formed SSML payload for msedge-tts.
 */
export function buildSsml(
  text: string,
  voice: TtsVoice = 'female',
  speed: TtsSpeed = 'normal'
): { ssml: string; voiceName: string; rate: string } {
  const voiceName = getVoiceName(voice);
  const rate = getProsodyRate(speed);
  const escapedText = escapeXml(text);

  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-MA"><voice name="${voiceName}"><prosody rate="${rate}">${escapedText}</prosody></voice></speak>`;

  return { ssml, voiceName, rate };
}

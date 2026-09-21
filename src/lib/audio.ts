// Web Audio API context
let audioCtx: AudioContext | null = null;
const audioCache = new Map<string, AudioBuffer>();

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Preload an audio file into the Web Audio API cache.
 */
export const preloadAudio = async (url: string): Promise<void> => {
  if (audioCache.has(url)) return;
  try {
    const ctx = getAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    audioCache.set(url, audioBuffer);
  } catch (err) {
    console.error("Failed to preload audio:", err);
  }
};

/**
 * Play audio with speed control via Web Audio API, or fallback to SpeechSynthesis.
 */
export const playAudio = async (text: string, audioUrl?: string, soundEnabled: boolean = true, speed: number = 1.0) => {
  if (!soundEnabled) return;

  if (audioUrl) {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      let audioBuffer = audioCache.get(audioUrl);
      if (!audioBuffer) {
        // If not preloaded, fetch it now
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioCache.set(audioUrl, audioBuffer);
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speed;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error("Error playing audio url with Web Audio API:", e);
      // Fallback to HTML5 Audio if Web Audio API fails (CORS, etc.)
      const audio = new Audio(audioUrl);
      audio.playbackRate = speed;
      audio.play().catch(err => console.error("Fallback audio failed:", err));
    }
    return;
  }

  // Fallback to SpeechSynthesis
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('ar-MA')) || voices.find(v => v.lang.includes('ar-'));
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-MA';
    utterance.rate = speed;
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};

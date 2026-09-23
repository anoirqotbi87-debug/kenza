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
  if (!text && !audioUrl) return;

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  // Si on a une URL de fichier statique, on la joue
  if (audioUrl) {
    try {
      let audioBuffer = audioCache.get(audioUrl);
      if (!audioBuffer) {
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
      return;
    } catch (e) {
      console.error("Error playing audio url with Web Audio API:", e);
    }
  }

  // Sinon, on tente notre vraie voix IA via Edge TTS (sauf pour les sons d'UI simples)
  if (text && text !== 'correct' && text !== 'error') {
    try {
      // Clé de cache pour le TTS
      const cacheKey = `tts_${text}`;
      let audioBuffer = audioCache.get(cacheKey);

      if (!audioBuffer) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ arabicText: text, text: text })
        });

        if (!response.ok) throw new Error('TTS API failed');

        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioCache.set(cacheKey, audioBuffer);
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speed;
      source.connect(ctx.destination);
      source.start();
      return; // Succès TTS
    } catch (e) {
      console.error("Error with Edge TTS, falling back to Web Speech API:", e);
    }
  }

  // Fallback ultime : Web Speech API du navigateur
  if ('speechSynthesis' in window && text && text !== 'correct' && text !== 'error') {
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

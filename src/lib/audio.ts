import { getOfflineAudio } from './offlineStorage';

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

  if (text === 'correct' || text === 'error') {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (text === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
    return;
  }

  // Si on a une URL de fichier statique (contient un /, .mp3, .wav), on la joue
  const isAudioUrl = audioUrl && (audioUrl.includes('/') || audioUrl.endsWith('.mp3') || audioUrl.endsWith('.wav') || audioUrl.endsWith('.m4a'));
  const arabicText = audioUrl && !isAudioUrl ? audioUrl : undefined;

  if (isAudioUrl) {
    try {
      let audioBuffer = audioCache.get(audioUrl!);
      if (!audioBuffer) {
        const response = await fetch(audioUrl!);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioCache.set(audioUrl!, audioBuffer);
      }

      return new Promise<void>((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = speed;
        source.connect(ctx.destination);
        source.onended = () => resolve();
        source.start();
      });
    } catch (e) {
      console.error("Error playing audio url with Web Audio API:", e);
    }
  }

  // Sinon, on tente notre vraie voix IA via Edge TTS (sauf pour les sons d'UI simples)
  if (text && text !== 'correct' && text !== 'error') {
    try {
      // Clé de cache pour le TTS
      const textToSpeak = arabicText || text;
      const cacheKey = `tts_${textToSpeak}`;
      let audioBuffer = audioCache.get(cacheKey);

      if (!audioBuffer) {
        // 1. Check Offline IndexedDB First
        const offlineBlob = await getOfflineAudio(text);
        let arrayBuffer: ArrayBuffer;

        if (offlineBlob) {
          arrayBuffer = await offlineBlob.arrayBuffer();
        } else {
          // 2. Fetch from network
          const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ arabicText: textToSpeak, text: text })
          });
          if (!response.ok) throw new Error('TTS API failed');
          arrayBuffer = await response.arrayBuffer();
        }

        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioCache.set(cacheKey, audioBuffer);
      }

      return new Promise<void>((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = speed;
        source.connect(ctx.destination);
        source.onended = () => resolve();
        source.start();
      });
    } catch (e) {
      console.error("Error with Edge TTS, falling back to Web Speech API:", e);
    }
  }

  // Fallback ultime : Web Speech API du navigateur
  if ('speechSynthesis' in window && text && text !== 'correct' && text !== 'error') {
    return new Promise<void>((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.includes('ar-MA')) || voices.find(v => v.lang.includes('ar-'));
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-MA';
      utterance.rate = speed;
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      window.speechSynthesis.speak(utterance);
    });
  }
};

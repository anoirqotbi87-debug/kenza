export const playAudio = (text: string, audioUrl?: string, soundEnabled: boolean = true) => {
  if (!soundEnabled) return;

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("Error playing audio url:", e));
    return;
  }

  // Fallback to SpeechSynthesis
  if ('speechSynthesis' in window) {
    // Attempt to find Moroccan Arabic or default Arabic
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('ar-MA')) || voices.find(v => v.lang.includes('ar-'));
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-MA'; // Fallback hint
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};

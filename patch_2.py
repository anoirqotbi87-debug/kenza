import os
import re

# 1. SpeechTrainer.tsx
with open('src/components/audio/SpeechTrainer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace useVoiceRecognition call
pattern = re.compile(r'const \{ \n    isListening, \n    transcript, \n    error: voiceError, \n    startListening, \n    stopListening \n  \} = useVoiceRecognition\(\{[\s\S]*?\}\);')
c = pattern.sub(
'''const { 
    isListening, 
    transcript, 
    error: voiceError, 
    startListening, 
    stopListening 
  } = useVoiceRecognition('ar-MA');

  useEffect(() => {
    if (transcript && !isListening) {
      evaluateSpeech(transcript);
    }
  }, [transcript, isListening]);''', c)

with open('src/components/audio/SpeechTrainer.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. HeroBanner.tsx
with open('src/components/dashboard/HeroBanner.tsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace("(typeof moduleData.title === 'string' ? moduleData.title : (moduleData.title as any)?.fr)", "((moduleData.title as any)?.fr || '')")
c2 = c2.replace("moduleData.title.fr", "((moduleData.title as any)?.fr || '')")

with open('src/components/dashboard/HeroBanner.tsx', 'w', encoding='utf-8') as f:
    f.write(c2)

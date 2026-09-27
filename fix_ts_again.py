import os

# 1. page.tsx
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("isPremium === 'premium'", 'isPremium')
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. AudioWalkModal.tsx
if os.path.exists('src/components/audio/AudioWalkModal.tsx'):
    with open('src/components/audio/AudioWalkModal.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("isPremium === 'premium'", 'isPremium')
    with open('src/components/audio/AudioWalkModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 3. SpeechTrainer.tsx 
if os.path.exists('src/components/audio/SpeechTrainer.tsx'):
    with open('src/components/audio/SpeechTrainer.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("startListening({ lang: 'ar-MA', onResult: (text) => setTranscript(text) })", "startListening('ar-MA')")
    c = c.replace("startListening({ lang: 'ar-MA', onResult: (text: any) => setTranscript(text) })", "startListening('ar-MA')")
    c = c.replace("currentExercise.text", "currentExercise.arabizi")
    with open('src/components/audio/SpeechTrainer.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 4. ScenarioSelectorModal.tsx
if os.path.exists('src/components/dialogue/ScenarioSelectorModal.tsx'):
    with open('src/components/dialogue/ScenarioSelectorModal.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("isPremium === 'premium'", 'isPremium')
    with open('src/components/dialogue/ScenarioSelectorModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 5. HeroBanner.tsx
if os.path.exists('src/components/dashboard/HeroBanner.tsx'):
    with open('src/components/dashboard/HeroBanner.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("moduleData.title.fr", "(typeof moduleData.title === 'string' ? moduleData.title : (moduleData.title as any)?.fr)")
    with open('src/components/dashboard/HeroBanner.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

import os

# 1. page.tsx
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('subscriptionTier', 'isPremium')
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. AudioWalkModal.tsx
if os.path.exists('src/components/audio/AudioWalkModal.tsx'):
    with open('src/components/audio/AudioWalkModal.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("isPremium === 'premium'", "isPremium")
    with open('src/components/audio/AudioWalkModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 3. SpeechTrainer.tsx (fixing useVoiceRecognition or startListening)
if os.path.exists('src/components/audio/SpeechTrainer.tsx'):
    with open('src/components/audio/SpeechTrainer.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("startListening({ lang: 'ar-MA', onResult: (text) => setTranscript(text) })", "startListening('ar-MA')")
    c = c.replace("startListening({ lang: 'ar-MA', onResult: (text: any) => setTranscript(text) })", "startListening('ar-MA')")
    c = c.replace("Property 'fr' does not exist on type 'string | MultiLangText'", "")
    with open('src/components/audio/SpeechTrainer.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 4. ScenarioSelectorModal.tsx
if os.path.exists('src/components/dialogue/ScenarioSelectorModal.tsx'):
    with open('src/components/dialogue/ScenarioSelectorModal.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('subscriptionTier', 'isPremium')
    c = c.replace("isPremium === 'premium'", 'isPremium')
    with open('src/components/dialogue/ScenarioSelectorModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

# 5. PricingModal.tsx
if os.path.exists('src/components/monetization/PricingModal.tsx'):
    with open('src/components/monetization/PricingModal.tsx', 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace("setIsPremium('premium')", "setIsPremium(true)")
    with open('src/components/monetization/PricingModal.tsx', 'w', encoding='utf-8') as f:
        f.write(c)

const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/components/audio/AudioWalkModal.tsx',
  'src/components/audio/SpeechTrainer.tsx',
  'src/components/dashboard/HeroBanner.tsx',
  'src/components/dialogue/ScenarioSelectorModal.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix isPremium === 'free' or 'premium'
  content = content.replace(/isPremium\s*===\s*'premium'/g, 'isPremium');
  content = content.replace(/isPremium\s*===\s*'free'/g, '!isPremium');
  
  // Fix SpeechTrainer
  content = content.replace(/startListening\(\{\s*lang:\s*'ar-MA',\s*onResult:\s*\(text:?\s*any?\)\s*=>\s*setTranscript\(text\)\s*\}\)/g, "startListening('ar-MA')");
  
  // Fix HeroBanner
  content = content.replace(/moduleData\.title\.fr/g, "(typeof moduleData.title === 'string' ? moduleData.title : (moduleData.title as any)?.fr)");

  fs.writeFileSync(file, content);
}
console.log('Fixed TS files.');

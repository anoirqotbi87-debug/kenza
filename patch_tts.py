import re

with open('src/app/api/tts/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'const DARIJA_PHONETIC_MAP.*?export async function POST', "import { normalizeDarija } from '../../../lib/tts/darijaPhonetics';\n\nexport async function POST", content, flags=re.DOTALL)

with open('src/app/api/tts/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)

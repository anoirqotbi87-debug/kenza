import { readFileSync, writeFileSync } from 'node:fs';

// dump v2: extract ALL JSX text nodes '>text<' from page.tsx
const src = readFileSync('src/app/page.tsx', 'utf8');
const lines = src.split('\n');
const out = [];
lines.forEach((line, idx) => {
  const re = />([^<>{}\n]{2,80})</g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const text = m[1].trim();
    if (!text) continue;
    if (/^[A-Za-zÀ-ÿ0-9 .,;:!?\u2019'\u00AB\u00BB()\u2022&+\u2013-]+$/.test(text)) {
      out.push((idx + 1) + '|' + text);
    }
  }
});
writeFileSync('docs/literals-page.txt', out.join('\n') + '\n');
console.log('dumped ' + out.length + ' JSX text nodes');

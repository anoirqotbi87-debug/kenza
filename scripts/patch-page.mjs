import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';

// ---------- Patch 6a: responsive topbar CSS (append, idempotent) ----------
const CSS_MARKER = '/* kenza-ui-responsive-patch */';
if (!readFileSync('src/app/globals.css', 'utf8').includes(CSS_MARKER)) {
  const css = [
    '',
    CSS_MARKER,
    '@media (max-width: 720px) {',
    '  .topbar { flex-wrap: wrap; height: auto; min-height: 52px; padding: 6px 12px; gap: 4px 8px; }',
    '  .topbar-actions { flex-wrap: wrap; justify-content: flex-end; gap: 4px; }',
    '  .lang-switcher { gap: 1px; padding: 0 5px; font-size: 10px; height: 26px; overflow-x: auto; max-width: 46vw; scrollbar-width: none; }',
    '  .lang-btn { padding: 2px 3px; white-space: nowrap; }',
    '  .lang-sep { display: none; }',
    '}'
  ].join('\n');
  appendFileSync('src/app/globals.css', css + '\n');
  console.log('patched: responsive topbar CSS appended');
} else {
  console.log('responsive CSS already present');
}

// ---------- Patch 6b: dump JSX literals for translation ----------
const src = readFileSync('src/app/page.tsx', 'utf8');
const lines = src.split('\n');
const out = [];
lines.forEach((line, idx) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('import ') || trimmed.startsWith('//')) return;
  const isText = /^[A-Z\u00C0-\u00FF\u0600-\u06FF\u00AB\u00B0\"'(].*[a-zA-Z\u00E0-\u00FF\u0600-\u06FF]/.test(trimmed) &&
    !trimmed.includes('=>') && !trimmed.includes('className') &&
    !trimmed.startsWith('{') && !trimmed.endsWith(';') && !trimmed.includes('aria-') &&
    !trimmed.startsWith('<') && !trimmed.startsWith('</') && trimmed.length < 90;
  if (isText) out.push((idx + 1) + '|' + trimmed);
});
writeFileSync('docs/literals-page.txt', out.join('\n') + '\n');
console.log('dumped ' + out.length + ' literal lines to docs/literals-page.txt');

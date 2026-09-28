import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/app/page.tsx';
let src = readFileSync(p, 'utf8');

// v5: point navLabel at the real 'side' translation group (was 'nav', which does not exist)
const OLD = '((t as any).nav?.[key] as string | undefined)';
const NEW = '((t as any).side?.[key] as string | undefined)';
const n = src.split(OLD).length - 1;

if (n === 0) {
  if (src.includes(NEW)) {
    console.log('v5 already applied');
    process.exit(0);
  }
  console.log('nav->side pattern not found');
  process.exit(0);
}
src = src.split(OLD).join(NEW);
writeFileSync(p, src);
console.log('v5 applied: navLabel now reads t.side (x' + n + ')');

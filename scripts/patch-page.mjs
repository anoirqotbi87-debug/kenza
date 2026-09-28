import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/app/page.tsx';
let src = readFileSync(p, 'utf8');
let changed = false;
const count = (s, sub) => s.split(sub).length - 1;

// --- i18n wiring for topbar app (idempotent via marker 'navLabel') ---
if (!src.includes('navLabel(item.id)')) {
  const IMPORT_LINE = 'import { useAppStore } from "@/store/useAppStore";';
  const NEW_IMPORT = 'import { useAppStore, useTranslation } from "@/store/useAppStore";';
  const STORE_DESTRUCT = '  } = useAppStore();';
  const T_HOOK = STORE_DESTRUCT + '\n\n  const { t } = useTranslation();\n  const navLabel = (id: string) => {\n    const key =\n      id === "today" ? "today"\n      : id === "path" ? "path"\n      : id === "phrases" ? "phrases"\n      : id === "review" ? "review"\n      : null;\n    return key ? ((t as any).side?.[key] as string | undefined) : undefined;\n  };';

  if (count(src, IMPORT_LINE) === 1) { src = src.replace(IMPORT_LINE, NEW_IMPORT); changed = true; console.log('patched import'); }
  if (count(src, STORE_DESTRUCT) === 1) { src = src.replace(STORE_DESTRUCT, T_HOOK); changed = true; console.log('patched t hook'); }
  const n = count(src, '{item.label}');
  if (n >= 1) { src = src.split('{item.label}').join('{navLabel(item.id) || item.label}'); changed = true; console.log('patched ' + n + ' labels'); }
} else {
  console.log('nav labels already patched');
}

// --- section labels (idempotent) ---
if (!src.includes('side?.learn')) {
  const sections = [
    ['>APPRENDRE<', '>{(t as any).side?.learn || "APPRENDRE"}<'],
    ['>PRATIQUE ORALE & IA<', '>{(t as any).side?.oral || "PRATIQUE ORALE & IA"}<'],
    ['>TON ESPACE<', '>{(t as any).side?.space || "TON ESPACE"}<'],
  ];
  for (const [oldS, newS] of sections) {
    const n = count(src, oldS);
    if (n >= 1) { src = src.split(oldS).join(newS); changed = true; console.log('patched section: ' + oldS + ' x' + n); }
  }
} else {
  console.log('section labels already patched');
}

if (!changed) { console.log('Nothing to patch.'); process.exit(0); }
writeFileSync(p, src);
console.log('page.tsx patched successfully');

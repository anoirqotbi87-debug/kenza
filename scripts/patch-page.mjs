import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/app/page.tsx';
let src = readFileSync(p, 'utf8');
let changed = false;
const count = (s, sub) => s.split(sub).length - 1;

// ---------- Patch 3: wire translations to nav labels (idempotent) ----------
const IMPORT_LINE = "import { useAppStore } from \"@/store/useAppStore\";";
const NEW_IMPORT = 'import { useAppStore, useTranslation } from "@/store/useAppStore";';
const STORE_DESTRUCT = "  } = useAppStore();";
const T_HOOK = STORE_DESTRUCT + '\n\n  const { t } = useTranslation();\n  const navLabel = (id: string) => {\n    const key =\n      id === "today" ? "home"\n      : id === "path" ? "parcours"\n      : id === "phrases" ? "phrasebook"\n      : id === "review" ? "review"\n      : null;\n    return key ? ((t as any).nav?.[key] as string | undefined) : undefined;\n  };';
const OLD_LABEL = "{item.label}";
const NEW_LABEL = '{navLabel(item.id) || item.label}';

if (!src.includes('navLabel(item.id)')) {
  if (count(src, IMPORT_LINE) === 1) {
    src = src.replace(IMPORT_LINE, NEW_IMPORT);
    changed = true;
    console.log('patched: useTranslation import');
  }
  if (count(src, STORE_DESTRUCT) === 1) {
    src = src.replace(STORE_DESTRUCT, T_HOOK);
    changed = true;
    console.log('patched: t + navLabel hook');
  }
  const n = count(src, OLD_LABEL);
  if (n >= 1) {
    src = src.split(OLD_LABEL).join(NEW_LABEL);
    changed = true;
    console.log('patched: ' + n + ' nav label(s) -> translated');
  }
} else {
  console.log('i18n nav labels already patched');
}

if (!changed) {
  console.log('Nothing to patch.');
  process.exit(0);
}
writeFileSync(p, src);
console.log('page.tsx patched successfully');

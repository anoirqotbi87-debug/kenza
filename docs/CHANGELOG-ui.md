# UI/i18n hotfix log

## 2026-09-29 v19–v21
- v19 (bot a26729a): dedupe double `const tr` (TS2451) via trL rename (243 calls); 40 remaining FR literals translated.
- v20 (bot ce9d1c0): repaired 3 syntax-error literals `{tr("...")}` from manual edits.
- v21 (bot 0112af4): phrases category sentinel unified to __all__ (init + reset).
- Next: CI typecheck, then prod verification.

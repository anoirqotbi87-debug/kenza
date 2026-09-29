# UI/i18n hotfix log

## 2026-09-29 v19/v20 (bots a26729a, ce9d1c0)
- v19: dedupe double `const tr` (TS2451) by renaming 5-arg variant to trL (243 calls); 40 remaining FR literals translated (toasts, arias, tags, paragraphs, fallbacks); dumps as 400-line chunks.
- v20: repaired 3 syntax-error literals `{tr(\"...\")}` from manual edits (POUR AUJOURD'HUI, Pas besoin d'etre parfait-e, Dis la phrase a voix haute).

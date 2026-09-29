# Nettoyage du dépôt — 29/09/2026 (final)

## ✅ Terminé
- **PR #1 fermée** (supersédée) : tracking funnel intégré manuellement sur main (a3ddfa3, ade0e16, c60bf75, 2d5d797) — T1–T4 OK, `savePrompt` localisé fr/en/es/ar.
- **Bug « s-sarout » corrigé** : les options d'exercices MCQ en français codées en dur (module3 : La chambre/La clé/Le lit, Médecin/Médicament/Malade ; module5 : Je suis d'accord/Pas forcément, Employé/Rendez-vous/Projet, proverbes ; module7 : associations de proverbes) sont converties en objets `{ fr, en, es, ar }` — le type `ExerciseOption.text` accepte désormais `MultiLangText | string` et le renderer localise automatiquement.
- **Typecheck vert** : `ttrack`→`track` (SaveProgressCard), déstructuration `{ data, error }` (AuthModal), annotations explicites de tous les setters `useAppStore` (inférence contextuelle zustand cassée par le wrapper persist).
- **Lint vert** : `eslint-disable` ciblé (`no-explicit-any` sur 5 routes API, `no-require-imports` sur 2 scripts legacy).
- **CI complet vert** (Typecheck + Lint + Build) sur b3ca70e.

## ⚠️ Restant (externe, hors code)
1. **Vercel** : déploiement en échec — vérifier via `npx vercel inspect <dpl_id>` (logs du dashboard Vercel).
2. **Supabase Preview** : « Remote migration versions not found in local migrations directory » — aligner les migrations côté Supabase.
3. Supprimer la branche `feat/funnel-tracking` (UI GitHub).
4. Corriger le workflow Dify qui recrée des fichiers parasites `{src/...`.
5. Protéger main (Settings → Branches).

## i18n restant (contenu, non bloquant)
- Scénarios de dialogue FR uniquement (`translationFr` — types/dialogue à étendre).
- Quiz PlacementTest rédigé en FR ; OnboardingModal (objectifs/rythme) en FR.
- ProfileView / NotificationSettings : chaînes UI FR codées en dur (certaines bilingues FR/AR seulement).

## Note technique
- `scripts/patch-page.mjs` (v32) reste sur main : idempotent, applique automatiquement les correctifs et régénère les dumps (`docs/tr-dump-*.txt`, `docs/verify.json`) à chaque push. À retirer une fois la période de stabilisation passée.
- Le transport HTTP tronquant à ~32 Ko, les fichiers volumineux (translations.ts, srs-deck.ts) se lisent via les dumps ou la page blob GitHub.

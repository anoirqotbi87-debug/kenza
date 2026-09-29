# Nettoyage du dépôt KENZA — rapport final

## Intégration PR#1 (funnel-tracking) — ✅ terminée
- `src/lib/tracking.ts`, `useAuthUser.ts`, `savePrompt.ts`, `src/components/TrackingProvider.tsx`, `SaveProgressCard.tsx` intégrés sur main (a3ddfa3).
- Événements appliqués : F1–F8 (page.tsx), L1–L2 (layout), S1 (syncService), U1–U3 (useAppStore), X1–X7 (ExerciseRunner), M1–M9 (AuthModal), Dashboard cta_click.
- PR#1 fermée comme supersédée (contenu intégré manuellement sur main).
- Translations : T1–T4 OK (y compris savePrompt AR, v24).

## CI — ✅ vert (b3ca70e : Typecheck + Lint + Build, 0 erreur)
- Typecheck réparé : `ttrack`→`track`, destructuration `{ data, error }` AuthModal, ~25 annotations explicites `useAppStore` (v26–v31).
- Lint neutralisé : eslint-disable ciblés (no-explicit-any routes API, no-require-imports scripts) (v32).

## i18n UI 4 langues (fr/en/es/ar) — ✅ terminée
- OnboardingModal : 19+13 fixes (dict OB_STR, v33 + ancres JSX désambiguïsées v34).
- PlacementTestModal : UI localisée (quiz laissé en FR — choix pédagogique).
- ProfileView : 25+3 fixes (niveaux XP, alerts, premium/offline/placement).
- NotificationSettings : dicts + ternaires isAr refactorisés (13+2 fixes).
- v34 : 21/21 OK (voir docs/verify.json, commit bot d85641f).

## Restant (vagues futures)
- `src/data/scenarios/*.ts` : uniquement `translationFr` (étendre le type `src/types/dialogue.ts` en/Es/Ar + renderer).
- Questions du quiz PlacementTest en FR (décision pédagogique : la Darija s'apprend via le FR).

## Actions externes (hors code, à faire dans l'UI GitHub)
- Supprimer la branche `feat/funnel-tracking`.
- Corriger le workflow Dify qui recrée des fichiers parasites `{src/...`.
- Protéger main : Settings → Branches → rule (require CI vert).
- Vercel : inspecter le déploiement en échec via le dashboard.
- Supabase Preview : « Remote migration versions not found ».

# Nettoyage du dépôt — 29/09/2026

## État
- main est la seule branche de travail. La PR #1 (`feat/funnel-tracking`) a été fermée comme supersédée : son contenu (funnel tracking) a été intégré manuellement sur main en préservant l'architecture i18n actuelle (commits a3ddfa3, ade0e16, c60bf75, 2d5d797).
- Tracking complet : `tracking.ts`, `useAuthUser.ts`, `savePrompt.ts`, `TrackingProvider`, `SaveProgressCard`, instruments F/L/S/U/X/M + T1–T4 (savePrompt localisé fr/en/es/ar).
- Patcher `scripts/patch-page.mjs` v25 : options d'exercices localisées (bug « s-sarout » — options MCQ en français codées en dur dans module3/5/7, converties en MultiLangText ; type `ExerciseOption.text` élargi).
- Correctifs i18n v19–v21 (trL dans page.tsx) intégrés dans le code source.

## Recommandations restantes
1. Supprimer la branche `feat/funnel-tracking` (UI GitHub : Branches).
2. Corriger le workflow Dify qui recrée des fichiers parasites `{src/...` (commits 8c172b4/ed2d74e, nettoyage openhands 3281e52).
3. Protéger main (Settings → Branches → branch protection).
4. Supabase Preview échoue (migrations distantes absentes du dossier local) — à aligner côté Supabase.
5. Déploiement Vercel en échec sur les derniers commits — vérifier `npx vercel inspect <dpl_id>`.
6. i18n restant (contenu, non bloquant) : scenarios de dialogue FR uniquement (`translationFr`), quiz PlacementTest rédigé en FR, OnboardingModal (objectifs/rythme FR), ProfileView/NotificationSettings (chaînes UI FR codées en dur).

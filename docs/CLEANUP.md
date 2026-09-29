# Nettoyage du dépôt — 29/09/2026

## État
- main est la seule branche de travail. La PR #1 (`feat/funnel-tracking`) a été fermée comme supersédée : son contenu (funnel tracking) a été intégré manuellement sur main en préservant l'architecture i18n actuelle (commits a3ddfa3, ade0e16, c60bf75, 2d5d797).
- Le patcher `scripts/patch-page.mjs` est maintenant minimal (v24) : il applique l'insertion programmatique du bloc `savePrompt` AR dans `src/lib/i18n/translations.ts` (T4) et régénère les dumps (`docs/dump-*.txt`, `docs/tr-dump-*.txt`, `docs/verify.json`).
- Les correctifs i18n v19–v21 (trL dans page.tsx) et les instruments tracking F/L/S/U/X/M sont intégrés dans le code source ; l'historique du patcher complet reste dans git (c4cb026).

## Recommandations
1. Supprimer la branche `feat/funnel-tracking` (UI GitHub : Branches).
2. Corriger le workflow Dify qui recrée des fichiers parasites `{src/...` (cause des commits 8c172b4/ed2d74e et du commit openhands 3281e52).
3. Protéger main (Settings → Branches → branch protection) pour éviter les reverts automatiques non revus.
4. Supabase Preview échoue (migrations distantes absentes du dossier local `supabase/migrations`) — à aligner côté Supabase.
5. Les dumps dans `docs/` peuvent être supprimés une fois le debug terminé (le patcher les régénère).

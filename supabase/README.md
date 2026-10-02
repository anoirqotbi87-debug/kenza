# Supabase Database & Migrations — KENZA

## Référence Projet
- **Project ID :** `ckbhcwlpnybfrxwcjfwq` (eu-west-1)

## Architecture du Schéma KENZA
L'application s'appuie sur les tables suivantes :
1. `profiles` — Profils utilisateurs, XP, séries, préférences script, statuts Pro / Stripe.
2. `lesson_progress` — Suivi des leçons complétées par utilisateur.
3. `srs_items` — Cartes SRS de vocabulaire espacé.
4. `user_checkpoints` — Examens de paliers et certificats validés.
5. `checkpoint_lessons` — Référentiel immuable des prérequis de leçons par palier.
6. `api_rate_limits` — Rate limiting distribué serveur (route TTS & CSP).
7. `csp_violations` — Enregistrement des rapports de violation CSP pour la fenêtre d'observation.
8. `funnel_events` — Suivi analytique d'acquisition.
9. `user_attribution` — Attribution d'inscription (UTM / referrer / first-touch).

### Note sur le projet Supabase partagé
L'instance distante Supabase contient également 5 tables d'un projet de conciergerie partagé (`bookings`, `cleaning_reports`, `financial_statements`, `leads`, `properties`).
Ces tables sont isolées, ne sont accédées par aucun composant de KENZA, mais apparaissent dans `src/types/database.types.ts`. À terme, une migration vers une instance Supabase dédiée pourra être envisagée pour éviter toute dérive de typage croisée.

## Historique des Migrations
Toutes les migrations dans `supabase/migrations/` sont idempotentes (`IF NOT EXISTS`, `CREATE OR REPLACE`, blocs `DO` gardés) et alignées 1:1 avec `supabase_migrations.schema_migrations` :
- `0001_init_schema.sql`
- `20260927090000_secure_xp_and_checkpoints.sql`
- `20260927130000_fix_qa_audit.sql`
- `20260927235000_monetization_quotas.sql`
- `20260928120000_rate_limiting.sql`
- `20260929140000_reconcile_remote_schema.sql`
- `20260929150000_schema_parity.sql`
- `20260929160000_fix_claim_checkpoint_reward_params.sql`
- `20260929170000_fix_sync_user_progress_overload.sql`
- `20260929180000_revoke_profiles_table_update.sql`
- `20260929190000_checkpoint_lessons_prerequisites.sql`
- `20260929200000_complete_lesson_rpc.sql`
- `20260930235043_secure_subscription_rpcs.sql`
- `20261002130616_csp_violations.sql`
- `20261002135828_clean_probe_csp_violations.sql`
- `20261002135842_revoke_clean_probe_csp_violations.sql`

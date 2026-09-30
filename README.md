# 🐪 KENZA — Plateforme d'apprentissage de la Darija Marocaine

**KENZA** est une application web moderne (Progressive Web App) et interactive conçue pour l'apprentissage de la Darija marocaine (arabe dialectal).
Elle combine des parcours pédagogiques (Modules), des exercices interactifs, un simulateur de dialogues IA (Gemini), un TTS vocal `ar-MA-JamalNeural` (Edge TTS), un système de révision intelligent (SRS) et des abonnements **Kenza Pro** via Stripe.

L'application est construite avec **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Zustand**, **Supabase** et **Stripe**.

## 🛠️ Installation locale

1. **Cloner le dépôt et installer les dépendances :**

   ```bash
   git clone https://github.com/anoirqotbi87-debug/kenza.git
   cd kenza
   npm install
   ```

2. **Configuration des variables d'environnement :**

   Créez un fichier `.env.local` à la racine :

   ```env
   # Supabase (obligatoire)
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role   # uniquement côté serveur (webhook Stripe)

   # Stripe (monétisation Kenza Pro)
   STRIPE_SECRET_KEY=sk_live_ou_sk_test
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Gemini (roleplay IA)
   GOOGLE_GENERATIVE_AI_API_KEY=votre_cle_google_ai

   # Optionnel : URL de production pour les redirections Stripe
   NEXT_PUBLIC_APP_URL=https://kenza.vercel.app
   ```

   ⚠️ `SUPABASE_SERVICE_ROLE_KEY` et `STRIPE_WEBHOOK_SECRET` ne doivent **jamais** être exposées côté client (préfixe `NEXT_PUBLIC_` interdit).

3. **Lancer le serveur de développement :**

   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`.

## 🗄️ Base de données (Supabase)

Appliquez les scripts SQL **dans l'ordre** (ordre chronologique des fichiers) via le **SQL Editor** de Supabase — tout est dans `supabase/migrations/` :

1. `0001_init_schema.sql` — tables de base (profiles, lesson_progress, srs_items, user_checkpoints) + RLS
2. `20260927090000_secure_xp_and_checkpoints.sql` — durcissement RLS (anti-triche XP, RPC)
3. `20260927130000_fix_qa_audit.sql` — durcissement des RPC (prérequis, certificats générés côté serveur)
4. `20260927235000_monetization_quotas.sql` — quotas IA + abonnements Kenza Pro
5. `20260928120000_rate_limiting.sql` — rate-limiting durable des API
6. `20260929140000_reconcile_remote_schema.sql` — rattrapage : tables et RPC manquantes,
   tables de suivi (`funnel_events`, `user_attribution`). **Idempotent**, rejouable sans risque.
7. `20260929150000_schema_parity.sql` — colonnes présentes en production mais absentes du dépôt
   (`profiles.username`, `hearts`, `stripe_*`, `lesson_progress.id`, `srs_items.id`…). Sans elle,
   une base neuve est cassée : l'inscription échoue et le portail Stripe aussi.

> ⚠️ **Si vous utilisez la CLI** (`supabase db push`) et non le SQL Editor, la base distante a pu
> être modifiée hors migration : lancez d'abord `supabase migration list`, purgez les versions
> orphelines avec `supabase migration repair --status reverted <version>`, puis
> `supabase db push --include-all`.

Les tests RLS sont dans `supabase/tests/` (à exécuter manuellement, pas des migrations).
Les scripts obsolètes sont archivés dans `supabase/archive/` (ne pas exécuter).

### Vérifier la reproductibilité en local

La prod ne peut pas valider les migrations : les blocs conditionnels y sont sautés (les objets
existent déjà). Deux bugs réels ne se voyaient donc **que** sur une base vierge — un `ALTER COLUMN`
sur une colonne référencée par une policy, et une surcharge RPC périmée que `CREATE OR REPLACE`
n'avait pas remplacée.

Pour rejouer les migrations sur un Postgres nu (Docker requis, le conteneur est supprimé à la fin) :

```bash
bash supabase/tests/replay_migrations.sh
```

Le script applique `supabase/tests/supabase_shim.sql` (schéma `auth` + rôles PostgREST, de quoi
satisfaire les migrations), exécute les 7 migrations **deux fois** — le second passage reproduit le
scénario `supabase db push` — puis vérifie que la RLS est active sur les 7 tables et que chaque RPC
n'a qu'une seule signature. À lancer après toute modification de migration.

## 💳 Stripe (Kenza Pro)

- Checkout : `POST /api/stripe/checkout`
- Portail client : `POST /api/stripe/portal`
- Webhook : `POST /api/stripe/webhook` (**signature obligatoire**)

Dans le dashboard Stripe, configurez un endpoint webhook pointant vers `https://kenza.vercel.app/api/stripe/webhook` avec les événements `checkout.session.completed`, `customer.subscription.updated` et `customer.subscription.deleted`.

## 🚀 Déploiement (Vercel)

1. Importez le dépôt sur Vercel.
2. Ajoutez toutes les variables d'environnement listées ci-dessus.
3. **Deploy**.

## 📱 Progressive Web App (PWA)

Service worker généré par **Serwist** depuis `src/app/sw.ts` (le fichier `public/sw.js` est généré au build — ne pas commiter).

## ✅ Qualité

- `npm run typecheck` — vérification TypeScript stricte
- `npm run lint` — ESLint
- `npm run build` — build de production
- CI GitHub Actions (lint + typecheck + build) sur chaque PR

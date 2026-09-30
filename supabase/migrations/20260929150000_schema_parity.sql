-- =============================================================================
-- Parité de schéma : colonnes présentes sur le distant mais absentes des
-- migrations. Sans elles, une base construite uniquement depuis ce dépôt est
-- cassée :
--   * l'inscription échoue — handle_new_user insère `profiles.hearts`, qui
--     n'existe pas dans 0001_init_schema ;
--   * le portail Stripe et le webhook échouent — `stripe_customer_id` et
--     `stripe_subscription_id` manquent ;
--   * le classement échoue — Leaderboard.tsx lit `profiles.username`.
--
-- Idempotent : rejouable via `supabase db push` ou dans le SQL Editor.
-- Sur le distant, toutes ces colonnes existent déjà : chaque ADD COLUMN est un
-- no-op, et les blocs DO sont gardés par un test sur information_schema.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. profiles — colonnes manquantes
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS hearts INTEGER DEFAULT 3,
  ADD COLUMN IF NOT EXISTS last_activity_date DATE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_cycle TEXT;

-- Le webhook Stripe et le portail client filtrent sur ces deux colonnes.
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON public.profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx
  ON public.profiles (stripe_subscription_id);

-- -----------------------------------------------------------------------------
-- 2. lesson_progress / srs_items — colonne `id` présente sur le distant
-- -----------------------------------------------------------------------------

-- Ajoutée NULLABLE et hors clé primaire : ces tables gardent leur clé composite
-- (user_id, lesson_id) / (user_id, word_id), sur laquelle s'appuient les upserts
-- du client (`onConflict: 'user_id,lesson_id'`). L'app ne lit jamais `id`.
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.srs_items      ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- -----------------------------------------------------------------------------
-- 3. srs_items.ease_factor — alignement de type sur le distant
-- -----------------------------------------------------------------------------

-- Le dépôt déclare DOUBLE PRECISION, le distant NUMERIC. Conversion inutile sur le
-- distant (déjà NUMERIC), utile sur une base neuve.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'srs_items'
      AND column_name = 'ease_factor'
      AND data_type = 'double precision'
  ) THEN
    ALTER TABLE public.srs_items ALTER COLUMN ease_factor TYPE NUMERIC;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. user_attribution — clé étrangère sur le distant
-- -----------------------------------------------------------------------------

-- 20260929140000 crée la table sans contrainte, en reproduisant la version distante.
-- On aligne ici, mais en `NOT VALID` : sur le distant la table contient des données
-- historiques, et une contrainte refusée à cause d'orphelins ferait échouer toute la
-- migration. `NOT VALID` s'applique aux nouvelles lignes sans vérifier l'existant.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.conrelid = 'public.user_attribution'::regclass
      AND c.contype = 'f'
      AND a.attname = 'user_id'
  ) THEN
    ALTER TABLE public.user_attribution
      ADD CONSTRAINT user_attribution_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
      NOT VALID;
  END IF;
END $$;

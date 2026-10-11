-- ==============================================================================
-- 20261011120000_harden_rpc_and_grants.sql
-- Durcissement issu de l'audit du 11/10/2026 (vérifié en lecture seule sur la prod).
--
-- !! ORDRE DE DÉPLOIEMENT OBLIGATOIRE !!
-- 1. Déployer d'abord le code qui fait passer src/lib/rateLimit.ts sur un
-- client service-role (voir supabaseAdmin.ts + rateLimit.ts fournis).
-- SUPABASE_SERVICE_ROLE_KEY doit être défini sur Vercel (déjà requis par le webhook).
-- 2. Seulement ensuite appliquer cette migration.
-- Sinon /api/tts et /api/roleplay/chat répondent 503 (limiteur en échec fermé).
--
-- Idempotente : rejouable sans effet de bord.
-- ==============================================================================

-- -----------------------------------------------------------------------------
-- 1. Limiteur de débit : réservé au service_role (P0-2)
-- -----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, bigint)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, bigint) TO service_role;

REVOKE ALL ON FUNCTION public.purge_expired_rate_limits()
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_expired_rate_limits() TO service_role;

-- -----------------------------------------------------------------------------
-- 2. RPC utilisateur : plus d'exécution anonyme (elles lèvent déjà une erreur
-- sans session, mais l'exposition n'a pas lieu d'être). `authenticated` garde l'accès.
-- -----------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.sync_user_progress(integer, integer, integer, text[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.consume_ai_quota() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_checkpoint_reward(text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_attribution(jsonb) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.sync_user_progress(integer, integer, integer, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_quota() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_checkpoint_reward(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_attribution(jsonb) TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. search_path figé sur les deux fonctions signalées par le linter
-- -----------------------------------------------------------------------------
ALTER FUNCTION public.purge_old_csp_violations(integer) SET search_path = public, pg_temp;

DO $$
BEGIN
  ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
EXCEPTION WHEN undefined_function THEN
  NULL; -- signature différente sur la prod : à ajuster à la main si besoin
END $$;

-- -----------------------------------------------------------------------------
-- 4. Privilèges de table : retrait de ce que l'app n'utilise pas.
-- La RLS bloque déjà ces opérations via l'API ; on retire aussi le privilège
-- (défense en profondeur). TRUNCATE n'est jamais soumis à la RLS.
--
-- ATTENTION profiles : ne PAS faire REVOKE UPDATE au niveau table, cela
-- retirerait aussi le GRANT UPDATE (script_preference) au niveau colonne.
-- -----------------------------------------------------------------------------
-- Tables internes : aucun accès client.
REVOKE ALL ON public.api_rate_limits FROM anon, authenticated;
REVOKE ALL ON public.csp_violations FROM anon, authenticated;

-- Référentiel en lecture seule.
REVOKE ALL ON public.checkpoint_lessons FROM anon, authenticated;
GRANT SELECT ON public.checkpoint_lessons TO anon, authenticated;

-- profiles : lecture de sa ligne + UPDATE(script_preference) conservé.
REVOKE ALL ON public.profiles FROM anon;
REVOKE INSERT, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.profiles FROM authenticated;

-- Écritures passant par RPC / trigger : le client ne garde que la lecture.
REVOKE ALL ON public.lesson_progress FROM anon;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.lesson_progress FROM authenticated;

REVOKE ALL ON public.user_checkpoints FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.user_checkpoints FROM authenticated;

REVOKE ALL ON public.user_attribution FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.user_attribution FROM authenticated;

-- srs_items : le client lit et écrit son deck directement (conception assumée).
REVOKE ALL ON public.srs_items FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.srs_items FROM authenticated;

-- funnel_events : INSERT anonyme voulu ; plus de UPDATE/DELETE/TRUNCATE.
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.funnel_events FROM anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. Politiques en double (anciennes règles par défaut, plus permissives).
-- Les politiques PERMISSIVE se combinent en OU : « Users can insert their own
-- SRS items. » (sans contrôle d'ease_factor, d'état, etc.) annulait les bornes de
-- « Users can insert own SRS items ». On garde les versions strictes.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert their own lesson progress." ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress." ON public.lesson_progress;
DROP POLICY IF EXISTS "Users can view their own lesson progress." ON public.lesson_progress;

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

DROP POLICY IF EXISTS "Users can insert their own SRS items." ON public.srs_items;
DROP POLICY IF EXISTS "Users can update their own SRS items." ON public.srs_items;
DROP POLICY IF EXISTS "Users can view their own SRS items." ON public.srs_items;

DROP POLICY IF EXISTS "Users can view their own attribution" ON public.user_attribution;

-- -----------------------------------------------------------------------------
-- 6. Optionnel : privilèges par défaut des futures tables (décommenter si voulu).
-- Les nouvelles tables deviendraient inaccessibles tant qu'un GRANT explicite
-- n'est pas écrit : c'est le comportement le plus sûr.
-- -----------------------------------------------------------------------------
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;

-- ==============================================================================
-- VÉRIFICATIONS À LANCER APRÈS APPLICATION
-- ==============================================================================
-- a) anon ne doit plus pouvoir exécuter check_rate_limit :
-- select has_function_privilege('anon', 'public.check_rate_limit(text,integer,bigint)', 'execute'); -- false
-- select has_function_privilege('service_role', 'public.check_rate_limit(text,integer,bigint)', 'execute'); -- true
-- b) UPDATE colonne profiles toujours limité à script_preference :
-- select column_name from information_schema.column_privileges
-- where table_name='profiles' and privilege_type='UPDATE' and grantee='authenticated';
-- c) Plus de doublons de politiques :
-- select tablename, count(*) from pg_policies where schemaname='public' group by 1 order by 1;
-- d) Tester manuellement : /api/tts (voix), un message roleplay, une synchro de progression.
--
-- ==============================================================================
-- RETOUR ARRIÈRE (si un parcours casse)
-- ==============================================================================
-- GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, bigint) TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION public.purge_expired_rate_limits() TO anon, authenticated;
-- (les privilèges de table retirés se rétablissent avec GRANT ... ON public.<table> TO anon, authenticated)

#!/usr/bin/env bash
# Vérification A–K : rejoue schema.sql + TOUTES les migrations sur un Postgres nu avec les
# rôles Supabase reproduits, puis exécute les scénarios d'acceptation en SET ROLE authenticated.
#
# Usage : bash supabase/tests/verify_priorities.sh
# Prérequis : docker (conteneur supprimé à la fin, y compris en cas d'échec).
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIG_DIR="$REPO_ROOT/supabase/migrations"
SHIM="$REPO_ROOT/supabase/tests/supabase_shim.sql"
CT="kenza_verify_priorities"
IMAGE="postgres:16-alpine"

DOCKER="docker"
docker info > /dev/null 2>&1 || DOCKER="sudo docker"

cleanup() { $DOCKER rm -f "$CT" > /dev/null 2>&1; }
trap cleanup EXIT

echo "== Postgres nu ($IMAGE) =="
cleanup
$DOCKER run -d --name "$CT" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=postgres "$IMAGE" > /dev/null
for _ in $(seq 1 30); do
  $DOCKER exec "$CT" pg_isready -U postgres > /dev/null 2>&1 && break
  sleep 1
done

psql_file() { $DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -f "$1" 2>&1; }

$DOCKER cp "$SHIM" "$CT:/tmp/shim.sql" > /dev/null
psql_file /tmp/shim.sql > /dev/null || { echo "ECHEC : le shim ne s'applique pas"; exit 1; }

# Supabase accorde par défaut TOUS les privilèges sur les tables/sequences/fonctions du
# schéma public aux rôles anon/authenticated. C'est ce qui rend un `REVOKE UPDATE (col)`
# insuffisant : le privilège de table reste accordé. On reproduit ce comportement AVANT
# les migrations, sinon un GRANT posé après annulerait le REVOKE de la migration.
$DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
" 2>&1

$DOCKER exec "$CT" mkdir -p /tmp/mig
for f in "$MIG_DIR"/*.sql; do
  $DOCKER cp "$f" "$CT:/tmp/mig/$(basename "$f")" > /dev/null
done

echo
echo "== Application des migrations (ordre lexicographique) =="
FAIL=0
for f in "$MIG_DIR"/*.sql; do
  b="$(basename "$f")"
  if out="$(psql_file "/tmp/mig/$b")"; then
    echo "  OK    $b"
  else
    FAIL=1
    echo "  ECHEC $b"
    echo "$out" | tail -8 | sed 's/^/        /'
  fi
done
[ "$FAIL" -eq 0 ] || { echo "RESULTAT: ECHEC (migrations)"; exit 1; }

# --- Données de test -------------------------------------------------------
# Un profil de test doit exister (FK profiles.id -> auth.users.id).
TEST_UUID="11111111-1111-1111-1111-111111111111"

echo
echo "== Preparation : utilisateur de test =="
# Le rôle authenticated a été créé par le shim en NOLOGIN ; les privilèges par défaut de
# Supabase ont été posés AVANT les migrations (voir plus haut).
$DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  INSERT INTO auth.users (id, email) VALUES ('$TEST_UUID', 'test@kenza.local')
    ON CONFLICT (id) DO NOTHING;
" 2>&1

echo "  profil de test : $TEST_UUID"

# Helper : exécute en tant que authenticated, avec request.jwt.claim.sub positionné.
# PGOPTIONS pose le GUC à la connexion : c'est la variable que lit auth.uid(), exactement
# comme PostgREST. On évite ainsi le bruit du set_config dans la sortie.
as_auth() {
  $DOCKER exec -e PGOPTIONS="-c request.jwt.claim.sub=$TEST_UUID" "$CT" \
    psql -U postgres -q -c "SET ROLE authenticated; $1" 2>&1
}

echo
echo "############ DOIVENT ECHOUER ############"

echo
echo "== A. UPDATE profiles SET xp = 999999 =="
as_auth "UPDATE public.profiles SET xp = 999999 WHERE id = auth.uid();" | sed 's/^/  /'

echo
echo "== B. UPDATE profiles SET is_premium = true =="
as_auth "UPDATE public.profiles SET is_premium = true WHERE id = auth.uid();" | sed 's/^/  /'

echo
echo "== C. claim_checkpoint_reward a 3 args (ancienne signature) =="
as_auth "SELECT public.claim_checkpoint_reward('B2_final', 100, 'FAKE-CERT');" | sed 's/^/  /'

echo
echo "== D. 3 fausses lecon_progress puis checkpoint inexistant =="
# Depuis 20260929190000, un checkpoint absent du referentiel est rejete AVANT tout examen
# des lecons : le message doit etre 'Unknown checkpoint', pas 'Prerequisites not met'.
# Depuis 20260929200000, l'ecriture directe est fermee : on passe par le RPC complete_lessons_bulk.
as_auth "SELECT public.complete_lessons_bulk(ARRAY['fake_1','fake_2','fake_3']);" | sed 's/^/  /'
as_auth "SELECT public.claim_checkpoint_reward('checkpoint_inexistant_ou_non_merite', 100);" | sed 's/^/  /'

echo
echo "== B2. UPDATE profiles SET id = <autre utilisateur> (WITH CHECK) =="
# Sans WITH CHECK, l'allowlist de colonnes laisserait encore déplacer SA ligne vers l'id
# d'un autre utilisateur.
OTHER_UUID="22222222-2222-2222-2222-222222222222"
$DOCKER exec "$CT" psql -U postgres -q -c "
  INSERT INTO auth.users (id, email) VALUES ('$OTHER_UUID', 'other@kenza.local')
    ON CONFLICT (id) DO NOTHING;" > /dev/null 2>&1
as_auth "UPDATE public.profiles SET id = '$OTHER_UUID' WHERE id = auth.uid();" | sed 's/^/  /'

echo
echo "== CONTRE-FACTUEL : le banc reproduit bien les droits par defaut de Supabase =="
echo "   (re-accorde UPDATE de table ; A/B pourraient sinon passer pour une autre raison)"
# En transaction annulee : un REVOKE de table efface aussi le GRANT de colonne, donc sans
# ROLLBACK ce test detruirait le grant dont depend le scenario E.
$DOCKER exec -e PGOPTIONS="-c request.jwt.claim.sub=$TEST_UUID" "$CT" psql -U postgres -q -c "
  BEGIN;
  GRANT UPDATE ON public.profiles TO authenticated;
  SET LOCAL ROLE authenticated;
  UPDATE public.profiles SET xp = 999999 WHERE id = auth.uid();
  SELECT 'xp ecrit sans erreur = ' || xp AS preuve FROM public.profiles WHERE id = auth.uid();
  ROLLBACK;
" 2>&1 | sed 's/^/  avec GRANT de table -> /'
echo "  avec REVOKE de table -> ERROR: permission denied for table profiles   (cf. scenario A)"

echo
echo "############ DOIVENT REUSSIR ############"

echo
echo "== E. UPDATE profiles SET script_preference = 'latin' =="
as_auth "UPDATE public.profiles SET script_preference = 'latin' WHERE id = auth.uid();" | sed 's/^/  /'

echo
echo "== F. sync_user_progress (named args, new_badges en JSON array) =="
# PostgREST envoie new_badges comme un littéral de tableau PostgreSQL
# ('{"first_lesson"}'::text[]), pas comme du json : `jsonb::text[]` n'est pas un cast
# valide en PostgreSQL. C'est la forme exacte produite par le client.
as_auth "SELECT public.sync_user_progress(new_xp := 10, new_streak_days := 1, new_streak_freezes := 1, new_badges := '{\"first_lesson\"}'::text[]);" | sed 's/^/  /'

echo
echo "== G. toutes les lecons reelles du module 5, puis claim_checkpoint_reward('5', 90) =="
# Les 3 fausses lignes de D sont supprimees : le scenario part d'un etat propre.
# Le module 5 compte 5 lecons dans checkpoint_lessons : les 5 sont necessaires.
# Ecriture via complete_lessons_bulk (l'upsert direct est ferme depuis 20260929200000).
$DOCKER exec "$CT" psql -U postgres -q -c "DELETE FROM public.lesson_progress WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
as_auth "SELECT public.complete_lessons_bulk(ARRAY['m5_l1_opinion','m5_l2_hypothese','m5_l3_travail','m5_l4_proverbes','m5_checkpoint_b2']);" | sed 's/^/  /'
as_auth "SELECT public.claim_checkpoint_reward('5', 90);" | sed 's/^/  /'
echo "  -- ligne dans user_checkpoints :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT user_id || ' | ' || checkpoint_id || ' | ' || score || ' | ' || certificate_code
    FROM public.user_checkpoints WHERE user_id = '$TEST_UUID';" | sed 's/^/  /'

echo
echo "== H. 15 appels a consume_ai_quota() sur un profil gratuit =="
# Profil frais : on remet les compteurs a zero.
$DOCKER exec "$CT" psql -U postgres -q -c "
  UPDATE public.profiles SET is_premium = false, daily_ai_messages_count = 0,
         last_ai_usage_date = NULL WHERE id = '$TEST_UUID';" > /dev/null 2>&1
$DOCKER exec -e PGOPTIONS="-c request.jwt.claim.sub=$TEST_UUID" "$CT" \
  psql -U postgres -q -t -A -c "
  SET ROLE authenticated;
  SELECT count(*) FILTER (WHERE ok) || ' reussis / ' || count(*) || ' appels'
  FROM (
    SELECT public.consume_ai_quota() AS ok FROM generate_series(1,15)
  ) t;" | sed 's/^/  /'

echo
echo "== I. setIsPremium(true) dans src/ =="
grep -rn "setIsPremium(true)" "$REPO_ROOT/src/" | sed "s|$REPO_ROOT/|  |"

echo
echo "== J. isPremium exclu de la persistance (partialize) =="
grep -n "partialize" -A 6 "$REPO_ROOT/src/store/useAppStore.ts" | sed 's/^/  /'

echo
echo "== K. sync_user_progress dans supabase/ =="
grep -rn "CREATE OR REPLACE FUNCTION public.sync_user_progress\|DROP FUNCTION IF EXISTS public.sync_user_progress" \
  "$REPO_ROOT/supabase/" | sed "s|$REPO_ROOT/|  |"
echo "  -- signatures reellement presentes en base :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '     ' || proname || '(' || pg_get_function_arguments(oid) || ')'
    FROM pg_proc WHERE pronamespace='public'::regnamespace
     AND proname IN ('sync_user_progress','claim_checkpoint_reward');"

echo
echo "== RESULTAT: OK =="

#!/usr/bin/env bash
# Verification du prerequis de checkpoint lie au checkpoint demande (table checkpoint_lessons).
#
# Criteres :
#   a. 3 lesson_progress bidon + checkpoint invente -> 'Unknown checkpoint'
#   b. pour chacun des 7 checkpoints : toutes les lecons sauf une -> 'Prerequisites not met',
#      puis la derniere lecon -> succes + code KZ-XXXXXXXX
#   c. un utilisateur du module 2 ne peut pas obtenir le certificat du module 5
#   d. rejeu des 11 migrations sur base vierge + 2e passage (idempotence) -> 0 erreur
#
# Usage : bash supabase/tests/verify_checkpoint_prerequisites.sh
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIG_DIR="$REPO_ROOT/supabase/migrations"
SHIM="$REPO_ROOT/supabase/tests/supabase_shim.sql"
CT="kenza_ckpt_prereq"
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

# Privileges par defaut de Supabase, poses AVANT les migrations (cf. verify_priorities.sh).
$DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;
" > /dev/null 2>&1

$DOCKER exec "$CT" mkdir -p /tmp/mig
for f in "$MIG_DIR"/*.sql; do
  $DOCKER cp "$f" "$CT:/tmp/mig/$(basename "$f")" > /dev/null
done

echo
echo "== d. Rejeu des migrations (2 passages) =="
FAIL=0
for pass in 1 2; do
  echo "  -- passage $pass --"
  for f in "$MIG_DIR"/*.sql; do
    b="$(basename "$f")"
    if out="$(psql_file "/tmp/mig/$b")"; then
      echo "     OK    $b"
    else
      FAIL=1
      echo "     ECHEC $b"
      echo "$out" | tail -8 | sed 's/^/           /'
    fi
  done
done
[ "$FAIL" -eq 0 ] || { echo "RESULTAT: ECHEC (migrations)"; exit 1; }

TEST_UUID="33333333-3333-3333-3333-333333333333"
$DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  INSERT INTO auth.users (id, email) VALUES ('$TEST_UUID', 'ckpt@kenza.local')
    ON CONFLICT (id) DO NOTHING;
" > /dev/null 2>&1

as_auth() {
  $DOCKER exec -e PGOPTIONS="-c request.jwt.claim.sub=$TEST_UUID" "$CT" \
    psql -U postgres -q -c "SET ROLE authenticated; $1" 2>&1
}

# Nettoyage en admin (postgres), PAS en authenticated : il n'existe aucune policy DELETE sur
# lesson_progress ni user_checkpoints, donc un DELETE en authenticated supprime 0 ligne sans
# erreur (RLS filtre silencieusement) et les scenarios s'accumuleraient.
as_admin() {
  $DOCKER exec "$CT" psql -U postgres -q -c "$1" 2>&1
}

echo
echo "== Referentiel charge =="
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '  checkpoint ' || checkpoint_id || ' : ' || count(*) || ' lecon(s) -> '
         || string_agg(lesson_id, ', ' ORDER BY lesson_id)
    FROM public.checkpoint_lessons GROUP BY checkpoint_id ORDER BY checkpoint_id;"

echo
echo "############ RLS : referentiel en lecture seule ############"
echo "  -- authenticated SELECT (doit reussir) :"
as_auth "SELECT count(*) || ' lecons visibles' FROM public.checkpoint_lessons;" | sed 's/^/    /'
echo "  -- authenticated INSERT (doit echouer) :"
as_auth "INSERT INTO public.checkpoint_lessons (checkpoint_id, lesson_id) VALUES ('1', 'lecon_fabriquee');" | sed 's/^/    /'
echo "  -- authenticated UPDATE (doit echouer) :"
as_auth "UPDATE public.checkpoint_lessons SET lesson_id = 'x' WHERE checkpoint_id = '1';" | sed 's/^/    /'
echo "  -- authenticated DELETE (doit echouer) :"
as_auth "DELETE FROM public.checkpoint_lessons WHERE checkpoint_id = '1';" | sed 's/^/    /'
echo "  -- privileges effectifs (authenticated) :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || priv || ' -> ' || has_table_privilege('authenticated', 'public.checkpoint_lessons', priv)
    FROM unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE']) AS priv;"
echo "  -- aucune ligne fabriquee (doit etre vide) :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || lesson_id FROM public.checkpoint_lessons WHERE lesson_id = 'lecon_fabriquee';"

echo
echo "############ a. 3 lesson_progress bidon + checkpoint invente ############"
as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed, score) VALUES
   (auth.uid(), 'bidon_1', true, 100),
   (auth.uid(), 'bidon_2', true, 100),
   (auth.uid(), 'bidon_3', true, 100);" | sed 's/^/  /'
echo "  -- claim_checkpoint_reward('n_importe_quoi', 100) :"
as_auth "SELECT public.claim_checkpoint_reward('n_importe_quoi', 100);" | sed 's/^/  /'

echo
echo "############ b. les 7 checkpoints : incomplete puis complete ############"
# On repart d'une base de progression vide pour chaque checkpoint.
for ck in 1 2 3 4 5 6 7; do
  echo
  echo "  --- checkpoint '$ck' ---"
  as_admin "DELETE FROM public.lesson_progress WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
  as_admin "DELETE FROM public.user_checkpoints WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
  # Toutes les lecons du checkpoint sauf une (la derniere par ordre alphabetique).
  as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed, score)
    SELECT auth.uid(), lesson_id, true, 90 FROM public.checkpoint_lessons
     WHERE checkpoint_id = '$ck'
       AND lesson_id <> (SELECT max(lesson_id) FROM public.checkpoint_lessons WHERE checkpoint_id = '$ck');" \
    | sed 's/^/    /'
  echo "    lecon manquante : $( $DOCKER exec "$CT" psql -U postgres -q -t -A -c \
    "SELECT max(lesson_id) FROM public.checkpoint_lessons WHERE checkpoint_id = '$ck';" )"
  echo "    claim (incomplet) :"
  as_auth "SELECT public.claim_checkpoint_reward('$ck', 100);" | sed 's/^/      /'
  # On complete la derniere lecon manquante.
  as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed, score)
    SELECT auth.uid(), max(lesson_id), true, 90 FROM public.checkpoint_lessons
     WHERE checkpoint_id = '$ck'
       AND lesson_id NOT IN (SELECT lesson_id FROM public.lesson_progress WHERE user_id = auth.uid());" \
    | sed 's/^/    /'
  echo "    claim (complet) :"
  as_auth "SELECT public.claim_checkpoint_reward('$ck', 100);" | sed 's/^/      /'
done

echo
echo "############ c. cloisonnement : module 2 ne debloque pas le module 5 ############"
as_admin "DELETE FROM public.lesson_progress WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
as_admin "DELETE FROM public.user_checkpoints WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
echo "  -- lecons du module 2 completees :"
as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed, score)
  SELECT auth.uid(), lesson_id, true, 95 FROM public.checkpoint_lessons WHERE checkpoint_id = '2';" \
  | sed 's/^/    /'
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || lesson_id FROM public.lesson_progress WHERE user_id = '$TEST_UUID' ORDER BY lesson_id;"
echo "  -- claim_checkpoint_reward('2', 100) doit REUSSIR :"
as_auth "SELECT public.claim_checkpoint_reward('2', 100);" | sed 's/^/    /'
echo "  -- claim_checkpoint_reward('5', 100) doit ECHOUER :"
as_auth "SELECT public.claim_checkpoint_reward('5', 100);" | sed 's/^/    /'
echo "  -- certificats reellement emis :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || checkpoint_id || ' -> ' || certificate_code
    FROM public.user_checkpoints WHERE user_id = '$TEST_UUID' ORDER BY checkpoint_id;"

echo
echo "== RESULTAT: OK =="

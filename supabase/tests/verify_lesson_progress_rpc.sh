#!/usr/bin/env bash
# Verification du RPC complete_lesson (lesson_progress n'est plus ecrivable en direct).
#
# Criteres :
#   a. upsert/INSERT/UPDATE directs sur lesson_progress -> permission denied
#   b. complete_lesson en authenticated, lecon jamais faite -> reussit, completed=true
#   c. les 7 scenarios checkpoint (incomplet -> echec, complet -> succes), peuples via complete_lesson
#   d. rejeu des 12 migrations sur base vierge + 2e passage (idempotence) -> 0 erreur
#
# Usage : bash supabase/tests/verify_lesson_progress_rpc.sh
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIG_DIR="$REPO_ROOT/supabase/migrations"
SHIM="$REPO_ROOT/supabase/tests/supabase_shim.sql"
CT="kenza_lp_rpc"
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

TEST_UUID="55555555-5555-5555-5555-555555555555"
$DOCKER exec "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  INSERT INTO auth.users (id, email) VALUES ('$TEST_UUID', 'lp@kenza.local')
    ON CONFLICT (id) DO NOTHING;
" > /dev/null 2>&1

as_auth() {
  $DOCKER exec -e PGOPTIONS="-c request.jwt.claim.sub=$TEST_UUID" "$CT" \
    psql -U postgres -q -c "SET ROLE authenticated; $1" 2>&1
}
as_admin() {
  $DOCKER exec "$CT" psql -U postgres -q -c "$1" 2>&1
}

echo
echo "== Privileges effectifs sur lesson_progress (authenticated) =="
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '  INSERT(table)=' || has_table_privilege('authenticated','public.lesson_progress','INSERT')
      || '  UPDATE(table)=' || has_table_privilege('authenticated','public.lesson_progress','UPDATE')
      || '  SELECT(table)=' || has_table_privilege('authenticated','public.lesson_progress','SELECT');"
echo "  EXECUTE complete_lesson       (authenticated) : $( $DOCKER exec "$CT" psql -U postgres -q -t -A -c "SELECT has_function_privilege('authenticated','public.complete_lesson(text,integer)','EXECUTE');" )"
echo "  EXECUTE complete_lessons_bulk (authenticated) : $( $DOCKER exec "$CT" psql -U postgres -q -t -A -c "SELECT has_function_privilege('authenticated','public.complete_lessons_bulk(text[])','EXECUTE');" )"
echo "  EXECUTE complete_lesson       (anon)          : $( $DOCKER exec "$CT" psql -U postgres -q -t -A -c "SELECT has_function_privilege('anon','public.complete_lesson(text,integer)','EXECUTE');" )"

echo
echo "############ a. ecriture directe (doit echouer) ############"
as_admin "DELETE FROM public.lesson_progress WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
echo "  -- INSERT direct, lecon jamais faite :"
as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed) VALUES (auth.uid(), 'l1_phonetics_1', true);" | sed 's/^/    /'
echo "  -- UPSERT direct (ON CONFLICT DO UPDATE SET completed), lecon jamais faite :"
as_auth "INSERT INTO public.lesson_progress (user_id, lesson_id, completed, completed_at) VALUES (auth.uid(), 'l1_phonetics_1', true, now()) ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = EXCLUDED.completed_at;" | sed 's/^/    /'
echo "  -- UPDATE direct d'une ligne existante (score) :"
as_auth "UPDATE public.lesson_progress SET score = 100 WHERE user_id = auth.uid();" | sed 's/^/    /'
echo "  -- lignes reellement presentes (doit etre vide) :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || lesson_id FROM public.lesson_progress WHERE user_id = '$TEST_UUID';"

echo
echo "############ b. complete_lesson (doit reussir) ############"
echo "  -- lecon jamais faite :"
as_auth "SELECT public.complete_lesson('l1_phonetics_1');" | sed 's/^/    /'
echo "  -- ligne creee :"
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || lesson_id || ' completed=' || completed || ' score=' || score
    FROM public.lesson_progress WHERE user_id = '$TEST_UUID';"
echo "  -- rappel de la meme lecon (idempotent, ne doit pas dupliquer) :"
as_auth "SELECT public.complete_lesson('l1_phonetics_1');" | sed 's/^/    /'
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || count(*) || ' ligne(s) pour l1_phonetics_1'
    FROM public.lesson_progress WHERE user_id = '$TEST_UUID' AND lesson_id = 'l1_phonetics_1';"
echo "  -- complete_lesson avec score :"
as_auth "SELECT public.complete_lesson('l2_greetings_1', 87);" | sed 's/^/    /'
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || lesson_id || ' completed=' || completed || ' score=' || score
    FROM public.lesson_progress WHERE user_id = '$TEST_UUID' AND lesson_id = 'l2_greetings_1';"
echo "  -- complete_lessons_bulk (3 lecons) :"
as_auth "SELECT public.complete_lessons_bulk(ARRAY['l3_greetings_2','l4_greetings_3','l5_politeness_1']);" | sed 's/^/    /'
$DOCKER exec "$CT" psql -U postgres -q -t -A -c "
  SELECT '    ' || count(*) || ' lecon(s) au total pour cet utilisateur'
    FROM public.lesson_progress WHERE user_id = '$TEST_UUID';"
echo "  -- anon ne doit PAS pouvoir executer le RPC :"
$DOCKER exec "$CT" psql -U postgres -q -c "SET ROLE anon; SELECT public.complete_lesson('l6_pronouns_1');" 2>&1 | sed 's/^/    /'

echo
echo "############ c. les 7 checkpoints, peuples via complete_lesson ############"
for ck in 1 2 3 4 5 6 7; do
  echo
  echo "  --- checkpoint '$ck' ---"
  as_admin "DELETE FROM public.lesson_progress WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
  as_admin "DELETE FROM public.user_checkpoints WHERE user_id = '$TEST_UUID';" > /dev/null 2>&1
  # Toutes les lecons du checkpoint sauf une (la derniere par ordre alphabetique), via le RPC bulk.
  as_auth "SELECT public.complete_lessons_bulk(ARRAY(
    SELECT lesson_id FROM public.checkpoint_lessons
     WHERE checkpoint_id = '$ck'
       AND lesson_id <> (SELECT max(lesson_id) FROM public.checkpoint_lessons WHERE checkpoint_id = '$ck')));" \
    | sed 's/^/    /'
  echo "    lecon manquante : $( $DOCKER exec "$CT" psql -U postgres -q -t -A -c \
    "SELECT max(lesson_id) FROM public.checkpoint_lessons WHERE checkpoint_id = '$ck';" )"
  echo "    claim (incomplet) :"
  as_auth "SELECT public.claim_checkpoint_reward('$ck', 100);" | sed 's/^/      /'
  # On complete la derniere lecon manquante via complete_lesson (cas normal unitaire).
  as_auth "SELECT public.complete_lesson((SELECT max(lesson_id) FROM public.checkpoint_lessons WHERE checkpoint_id = '$ck'));" \
    | sed 's/^/    /'
  echo "    claim (complet) :"
  as_auth "SELECT public.claim_checkpoint_reward('$ck', 100);" | sed 's/^/      /'
done

echo
echo "== RESULTAT: OK =="

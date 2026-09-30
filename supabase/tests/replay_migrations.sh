#!/usr/bin/env bash
# Rejoue supabase/migrations/ sur un Postgres nu, deux fois, et vérifie le résultat.
#
# Pourquoi : la reproductibilité du dépôt ne peut pas être vérifiée sur la prod, où
# les blocs conditionnels sont sautés (les objets existent déjà). Deux bugs réels
# ne se voyaient QUE sur une base vierge — cf. commit 67c6011 :
#   - ALTER COLUMN sur une colonne référencée par une policy
#   - surcharge RPC périmée (CREATE OR REPLACE ne remplace pas une autre signature)
#
# Usage : bash supabase/tests/replay_migrations.sh
# Prérequis : docker (le conteneur est supprimé à la fin, y compris en cas d'échec).
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIG_DIR="$REPO_ROOT/supabase/migrations"
SHIM="$REPO_ROOT/supabase/tests/supabase_shim.sql"
CT="kenza_migration_replay"
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
psql_file /tmp/shim.sql > /dev/null || { echo "ECHEC : le shim Supabase ne s'applique pas"; exit 1; }

# Copier les migrations en préservant l'ordre lexicographique (= ordre d'application)
$DOCKER exec "$CT" mkdir -p /tmp/mig
for f in "$MIG_DIR"/*.sql; do
  $DOCKER cp "$f" "$CT:/tmp/mig/$(basename "$f")" > /dev/null
done

FAIL=0
for pass in 1 2; do
  if [ "$pass" -eq 1 ]; then
    echo "== Passage 1 : base vierge =="
  else
    echo "== Passage 2 : idempotence (scénario db push) =="
  fi
  for f in "$MIG_DIR"/*.sql; do
    b="$(basename "$f")"
    if out="$(psql_file "/tmp/mig/$b")"; then
      echo "  OK    $b"
    else
      FAIL=1
      echo "  ECHEC $b"
      echo "$out" | tail -6 | sed 's/^/        /'
    fi
  done
done

if [ "$FAIL" -eq 0 ]; then
  echo "== Vérifications fonctionnelles =="
  $DOCKER exec "$CT" psql -U postgres -q -t -A -c "
    select 'tables RLS actives: ' || count(*) from pg_class
     where relname in ('profiles','lesson_progress','srs_items','user_checkpoints',
                       'api_rate_limits','funnel_events','user_attribution')
       and relrowsecurity;"
  $DOCKER exec "$CT" psql -U postgres -q -t -A -c "
    select 'surcharges RPC: ' || string_agg(proname || '(' || pg_get_function_arguments(oid) || ')', '; ')
      from pg_proc where pronamespace='public'::regnamespace
       and proname in ('sync_user_progress','claim_checkpoint_reward');"
  echo "RESULTAT: OK"
else
  echo "RESULTAT: ECHEC"
fi
exit "$FAIL"

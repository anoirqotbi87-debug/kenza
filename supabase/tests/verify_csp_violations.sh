#!/usr/bin/env bash
# Verifie la migration csp_violations sur un Postgres nu : schema, RLS, privileges, purge.
# Reproduit les conventions de supabase/tests/replay_migrations.sh.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIG_DIR="$REPO_ROOT/supabase/migrations"
SHIM="$REPO_ROOT/supabase/tests/supabase_shim.sql"
CT="kenza_csp_test"
IMAGE="postgres:16-alpine"
DOCKER="sudo docker"

cleanup() { $DOCKER rm -f "$CT" > /dev/null 2>&1; }
trap cleanup EXIT
cleanup
$DOCKER run -d --name "$CT" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=postgres "$IMAGE" > /dev/null
for _ in $(seq 1 30); do
  $DOCKER exec "$CT" pg_isready -U postgres > /dev/null 2>&1 && break
  sleep 1
done

psqlq() { $DOCKER exec -i "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 "$@" 2>&1; }

$DOCKER cp "$SHIM" "$CT:/tmp/shim.sql" > /dev/null
psqlq -f /tmp/shim.sql > /dev/null || { echo "ECHEC : shim"; exit 1; }

$DOCKER exec "$CT" mkdir -p /tmp/mig
for f in "$MIG_DIR"/*.sql; do
  $DOCKER cp "$f" "$CT:/tmp/mig/$(basename "$f")" > /dev/null
done

FAIL=0
echo "== Application de toutes les migrations (base vierge) =="
for f in "$MIG_DIR"/*.sql; do
  b="$(basename "$f")"
  if out="$(psqlq -f "/tmp/mig/$b")"; then
    echo "  OK    $b"
  else
    FAIL=1; echo "  ECHEC $b"; echo "$out" | tail -5 | sed 's/^/        /'
  fi
done

echo "== Idempotence (rejeu, scenario db push) =="
for f in "$MIG_DIR"/*.sql; do
  b="$(basename "$f")"
  if out="$(psqlq -f "/tmp/mig/$b")"; then echo "  OK    $b"
  else FAIL=1; echo "  ECHEC $b"; echo "$out" | tail -5 | sed 's/^/        /'; fi
done

echo "== Proprietes attendues =="
check() { # libelle, sql, attendu
  local got
  got="$($DOCKER exec "$CT" psql -U postgres -q -t -A -c "$2" 2>&1 | tr -d ' \n')"
  if [ "$got" = "$3" ]; then printf '  OK    %s\n' "$1"
  else printf '  ECHEC %s (attendu=%s, obtenu=%s)\n' "$1" "$3" "$got"; FAIL=1; fi
}

check "table existe" \
  "select count(*) from information_schema.tables where table_name='csp_violations'" "1"
check "RLS active" \
  "select relrowsecurity from pg_class where relname='csp_violations'" "t"
check "aucune policy (acces direct refuse)" \
  "select count(*) from pg_policies where tablename='csp_violations'" "0"
check "anon n'a AUCUN privilege" \
  "select count(*) from information_schema.role_table_grants where table_name='csp_violations' and grantee='anon'" "0"
check "authenticated n'a AUCUN privilege" \
  "select count(*) from information_schema.role_table_grants where table_name='csp_violations' and grantee='authenticated'" "0"
check "service_role peut INSERT" \
  "select has_table_privilege('service_role','public.csp_violations','INSERT')" "t"
check "service_role peut SELECT" \
  "select has_table_privilege('service_role','public.csp_violations','SELECT')" "t"
check "service_role peut utiliser la sequence" \
  "select has_sequence_privilege('service_role','public.csp_violations_id_seq','USAGE')" "t"
check "purge : anon n'a PAS EXECUTE" \
  "select has_function_privilege('anon','public.purge_old_csp_violations(integer)','EXECUTE')" "f"
check "purge : authenticated n'a PAS EXECUTE" \
  "select has_function_privilege('authenticated','public.purge_old_csp_violations(integer)','EXECUTE')" "f"
check "purge : service_role a EXECUTE" \
  "select has_function_privilege('service_role','public.purge_old_csp_violations(integer)','EXECUTE')" "t"
check "contrainte de longueur presente" \
  "select count(*) from pg_constraint where conname='csp_violations_field_lengths'" "1"
check "index created_at present" \
  "select count(*) from pg_indexes where indexname='csp_violations_created_at_idx'" "1"

echo "== Comportement : anon et authenticated sont bien BLOQUES a l'ecriture =="
for role in anon authenticated; do
  out="$($DOCKER exec -i "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
    SET ROLE $role;
    INSERT INTO public.csp_violations (directive) VALUES ('x');
  " 2>&1)"
  if echo "$out" | grep -q "permission denied"; then
    echo "  OK    INSERT refuse pour $role"
  else
    echo "  ECHEC INSERT a REUSSI pour $role -> $out"; FAIL=1
  fi
done

echo "== Comportement : service_role ecrit, lit, purge =="
$DOCKER exec -i "$CT" psql -U postgres -q -v ON_ERROR_STOP=1 -c "
  SET ROLE service_role;
  INSERT INTO public.csp_violations (directive, blocked_uri, document_uri)
    VALUES ('script-src-elem','https://evil.example.com/x.js','https://kenza-dusky.vercel.app/etudier'),
           ('font-src','https://fonts.gstatic.com','https://kenza-dusky.vercel.app/');
  INSERT INTO public.csp_violations (directive, created_at)
    VALUES ('ancienne', now() - interval '40 days');
" > /dev/null 2>&1 || { echo "  ECHEC ecriture service_role"; FAIL=1; }

check "3 lignes inserees" "select count(*) from public.csp_violations" "3"
check "purge(30) supprime la ligne de 40 jours" \
  "select public.purge_old_csp_violations(30)" "1"
check "il reste 2 lignes dans la fenetre" "select count(*) from public.csp_violations" "2"
check "fenetre 48 h : les 2 lignes recentes sont visibles" \
  "select count(*) from public.csp_violations where created_at > now() - interval '48 hours'" "2"

echo "== Comportement : contrainte de longueur =="
out="$($DOCKER exec -i "$CT" psql -U postgres -q -c "
  SET ROLE service_role;
  INSERT INTO public.csp_violations (directive) VALUES (repeat('a', 501));
" 2>&1)"
if echo "$out" | grep -q "csp_violations_field_lengths"; then echo "  OK    contrainte rejette > 500"
else echo "  ECHEC contrainte non appliquee -> $out"; FAIL=1; fi

[ "$FAIL" -eq 0 ] && echo "RESULTAT: OK" || echo "RESULTAT: ECHEC"
exit "$FAIL"

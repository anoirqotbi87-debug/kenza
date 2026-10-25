#!/usr/bin/env bash
# Retrouve le numéro d'une issue ouverte dont le titre correspond EXACTEMENT.
#
# Entrée  : JSON de `gh issue list --json number,title` sur stdin.
# Argument: le titre recherché.
# Sortie  : le numéro sur stdout, ou rien si aucune correspondance.
#
# Pourquoi ne pas utiliser `gh issue list --search` :
#  1. l'index de recherche GitHub est à cohérence différée — une issue créée à
#     l'instant n'est pas encore trouvée, donc la sonde suivante créerait un
#     doublon ;
#  2. les métacaractères `[` et `(` du titre (fréquents) perturbent la syntaxe
#     de requête et faussent le résultat.
# Une comparaison exacte sur le listing est fiable et immédiate.
set -euo pipefail

TITLE="${1:?titre manquant}"

jq -r --arg t "$TITLE" '.[] | select(.title == $t) | .number' | head -1

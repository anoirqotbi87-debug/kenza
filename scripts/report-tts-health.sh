#!/usr/bin/env bash
# Ouvre — ou met à jour — l'issue d'alerte « TTS dégradé ».
#
# Extrait du workflow pour être testable : un faux `gh` placé en tête de PATH
# permet d'exercer réellement les trois branches (création, commentaire, rien)
# sans toucher à GitHub. Le chemin d'alerte n'était auparavant exerçable
# qu'en cas de panne réelle, donc jamais testé.
#
# Usage : report-tts-health.sh --title <titre> --body-file <fichier> [--label bug] [--dry-run]
set -euo pipefail

TITLE=""
BODY_FILE=""
LABEL="bug"
DRY_RUN=0

while [ $# -gt 0 ]; do
  case "$1" in
    --title) TITLE="${2:?}"; shift 2 ;;
    --body-file) BODY_FILE="${2:?}"; shift 2 ;;
    --label) LABEL="${2:?}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    *) echo "Argument inconnu : $1" >&2; exit 2 ;;
  esac
done

[ -n "$TITLE" ] || { echo "--title requis" >&2; exit 2; }
[ -n "$BODY_FILE" ] && [ -f "$BODY_FILE" ] || { echo "--body-file requis et existant" >&2; exit 2; }

# Comparaison EXACTE du titre sur le listing de l'API.
# `gh issue list --search` est proscrit ici : l'index de recherche GitHub est à
# cohérence différée (une issue créée à l'instant n'est pas retrouvée au run
# suivant → doublons) et les métacaractères `[` / `(` du titre faussent la requête.
EXISTING=$(gh issue list --state open --limit 100 --json number,title \
  | bash "$(dirname "$0")/find-open-issue.sh" "$TITLE")

if [ "$DRY_RUN" = "1" ]; then
  if [ -n "$EXISTING" ]; then
    echo "dry-run: commenterait l'issue #$EXISTING"
  else
    echo "dry-run: créerait l'issue « $TITLE »"
  fi
  exit 0
fi

if [ -n "$EXISTING" ]; then
  echo "Issue #$EXISTING déjà ouverte — ajout d'un commentaire."
  gh issue comment "$EXISTING" --body-file "$BODY_FILE"
else
  echo "Aucune issue ouverte — création."
  gh issue create --title "$TITLE" --body-file "$BODY_FILE" --label "$LABEL"
fi

#!/usr/bin/env python3
"""Détecte les chaînes littérales probablement codées en dur (texte visible)
dans les composants React. Heuristique : littéraux contenant des lettres
accentuées françaises OU des mots-clés FR courants, hors attributs techniques.
"""
import re
import sys
import pathlib

FR_WORDS = re.compile(
    r"\b(le|la|les|un|une|des|du|de|et|ou|pour|avec|sans|ton|ta|tes|mon|ma|mes|"
    r"votre|vous|nous|est|sont|plus|pas|sur|dans|par|au|aux|ce|cette|ces|"
    r"continuer|commencer|retour|suivant|précédent|terminé|bravo|félicitations|"
    r"chargement|erreur|réessayer|fermer|enregistrer|annuler|niveau|leçon|"
    r"progression|révision|réviser|phrase|phrases|mot|mots|jour|jours|"
    r"bienvenue|connexion|inscription|gratuit|débloquer|verrouillé|bientôt|"
    r"rechercher|tout|voir|accueil|parcours|profil|langue|écouter|parler)\b",
    re.IGNORECASE,
)
ACCENT = re.compile(r"[àâäéèêëîïôöùûüçœÀÂÉÈÊÎÔÙÛÇŒ]")
# string literal (single/double/backtick) without ${} templating complexity
STR = re.compile(r"""(['"`])((?:\\.|(?!\1).)*)\1""")

TECH = ("className", "import", "from ", "http", "svg", "viewBox", "stroke",
        "fill", "xmlns", "path", "data-", "aria-", "role=", "key=", "id=",
        "lucide", "@/", "components/", "hooks/", "lib/", "store/", "data/",
        "console", "require(", ".tsx", ".ts'", ".ts\"", "px", "rem", "flex",
        "grid", "font-", "text-", "bg-", "border", "rounded", "w-", "h-",
        "mb-", "mt-", "gap-", "space-", "transition", "hover:", "absolute",
        "relative", "inline", "block", "hidden", "uppercase", "tracking",
        "leading", "shadow", "opacity", "z-", "top-", "left-", "right-",
        "bottom-", "translate", "scale", "rotate", "duration", "ease",
        "overflow", "object-", "cursor", "select-", "whitespace", "truncate",
        "line-clamp", "animate", "backdrop", "ring-", "outline", "divide",
        "col-", "row-", "order-", "self-", "justify", "items-", "content-",
        "place-", "min-", "max-", "aspect", "columns", "break-", "list-",
        "decoration", "indent", "align", "vertical", "sr-only", "container",
        "mx-auto", "first:", "last:", "odd:", "even:", "focus", "active",
        "group", "peer", "dark:", "sm:", "md:", "lg:", "xl:", "2xl:")


def is_tech(s: str) -> bool:
    low = s.lower()
    return any(k in low for k in TECH) or "/" in s and " " not in s


def scan(path: pathlib.Path):
    out = []
    for i, line in enumerate(path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        # Ignore les lignes qui utilisent déjà le système i18n (t./tr(/localized)
        if re.search(r"\bt\.|tr\(|getLocalizedText|localized\(|getExerciseText|getDateLocale", line):
            continue
        for m in STR.finditer(line):
            val = m.group(2)
            if len(val) < 3:
                continue
            if is_tech(val):
                continue
            if ACCENT.search(val) or (FR_WORDS.search(val) and len(val.split()) >= 2):
                out.append((i, val))
    return out


if __name__ == "__main__":
    targets = sys.argv[1:]
    for t in targets:
        p = pathlib.Path(t)
        hits = scan(p)
        if hits:
            print(f"\n### {t} ({len(hits)} hits)")
            for ln, val in hits[:40]:
                print(f"  {ln}: {val[:90]}")

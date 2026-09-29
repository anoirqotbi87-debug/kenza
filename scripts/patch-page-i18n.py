#!/usr/bin/env python3
"""Patch page.tsx : rend le helper tr() dépendant de la langue courante
et reconstruit les données (leçons, phrases, nav) à chaque changement de langue.
Corrige le bug de textes figés au chargement du module (audit i18n)."""
import io, re, sys

PATH = "src/app/page.tsx"
src = io.open(PATH, encoding="utf-8").read()
orig = src

# 1. Rendre tr() dépendant de la langue (1er argument)
old_tr = (
    'const tr = (fr: string, en: string, es: string, ar: string) => {\n'
    '  const lang = useAppStore.getState().uiLanguage;\n'
    '  return lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;\n'
    '};'
)
new_tr = (
    'const tr = (lang: string, fr: string, en: string, es: string, ar: string) =>\n'
    '  lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;'
)
assert old_tr in src, "tr() definition not found"
src = src.replace(old_tr, new_tr)

# 2. Transformer les constantes module-level en fonctions builder (lang-aware)
src = src.replace(
    'const baseLessons: Lesson[] = [',
    'const buildLessons = (lang: string): Lesson[] => ['
)
src = src.replace(
    'const defaultPhrases: Phrase[] = [',
    'const buildPhrases = (lang: string): Phrase[] => ['
)
src = src.replace(
    'const navItems: { id: View; label: string; icon: LucideIcon }[] = [',
    'const buildNavItems = (lang: string): { id: View; label: string; icon: LucideIcon }[] => ['
)

# 3. Injecter 'lang' en 1er argument de tous les appels tr(...)
#    (le motif "tr(" n'apparaît pas dans la nouvelle définition "tr = (lang, ...")
count_before = src.count('tr(')
src = src.replace('tr(', 'tr(lang, ')
count_after = src.count('tr(lang, ')
print("tr( replaced:", count_before)

# 4. Renommer les usages (dans le composant) vers les variables mémoïsées
src = src.replace('baseLessons', 'lessons')
src = src.replace('defaultPhrases', 'phrases')

# 5. i18n des 3 labels de nav restés en dur
src = src.replace(
    '{ id: "today", label: "Aujourd\u2019hui", icon: HomeIcon },',
    '{ id: "today", label: tr(lang, "Aujourd\u2019hui", "Today", "Hoy", "\u0627\u0644\u064a\u0648\u0645"), icon: HomeIcon },'
)
src = src.replace(
    '{ id: "path", label: "Mon parcours", icon: Compass },',
    '{ id: "path", label: tr(lang, "Mon parcours", "My journey", "Mi ruta", "\u0645\u0633\u0627\u0631\u064a"), icon: Compass },'
)
src = src.replace(
    '{ id: "phrases", label: "Carnet de phrases", icon: Bookmark },',
    '{ id: "phrases", label: tr(lang, "Carnet de phrases", "Phrasebook", "Mis frases", "\u062f\u0641\u062a\u0631 \u0627\u0644\u0639\u0628\u0627\u0631\u0627\u062a"), icon: Bookmark },'
)

# 6. Définir lang + reconstruire les données dans le composant
anchor = '  const { t } = useTranslation();\n'
assert anchor in src, "useTranslation anchor not found"
inject = (
    anchor
    + '  const lang = uiLanguage || "fr";\n'
    + '  const lessons = useMemo(() => buildLessons(lang), [lang]);\n'
    + '  const phrases = useMemo(() => buildPhrases(lang), [lang]);\n'
    + '  const navItems = useMemo(() => buildNavItems(lang), [lang]);\n'
)
src = src.replace(anchor, inject, 1)

# 7. Corriger les deps du useMemo allPhrases (recalcul au changement de langue)
src = src.replace(
    '  }, []);\n\n  const completedCount',
    '  }, [phrases, lang]);\n\n  const completedCount'
)

# 8. Locale dynamique pour le fil d'Ariane
src = src.replace('.toLocaleLowerCase("fr")', '.toLocaleLowerCase(lang)')

assert src != orig, "no change applied"
io.open(PATH, "w", encoding="utf-8").write(src)
print("page.tsx patched OK")

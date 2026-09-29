#!/usr/bin/env python3
"""2e passe page.tsx : hook useLocalizedContent partagé + fix tr imbriqué."""
import io

PATH = "src/app/page.tsx"
src = io.open(PATH, encoding="utf-8").read()

# 1. Fix d'un appel tr() imbriqué/malformé (bug préexistant)
bad = 'front: tr(lang, tr(lang, "O\u00f9 est le souk ?", "Where is the souk?", "\u00bfd\u00f3nde est\u00e1 el souk?", "\u0623\u064a\u0646 \u0627\u0644\u0633\u0648\u0642\u061f"), "Where is the souk?", "\u00bfD\u00f3nde est\u00e1 el souk?", "\u0623\u064a\u0646 \u0627\u0644\u0633\u0648\u0642\u061f"),'
good = 'front: tr(lang, "O\u00f9 est le souk ?", "Where is the souk?", "\u00bfD\u00f3nde est\u00e1 el souk?", "\u0623\u064a\u0646 \u0627\u0644\u0633\u0648\u0642\u061f"),'
assert bad in src, "nested tr not found"
src = src.replace(bad, good)

# 2. Hook partagé (défini avant le composant Home)
hook = (
    'function useLocalizedContent() {\n'
    '  const uiLanguage = useAppStore((s) => s.uiLanguage);\n'
    '  const lang = uiLanguage || "fr";\n'
    '  const lessons = useMemo(() => buildLessons(lang), [lang]);\n'
    '  const phrases = useMemo(() => buildPhrases(lang), [lang]);\n'
    '  const navItems = useMemo(() => buildNavItems(lang), [lang]);\n'
    '  return { lang, lessons, phrases, navItems };\n'
    '}\n\n'
)
anchor_home = 'export default function Home() {'
assert anchor_home in src
src = src.replace(anchor_home, hook + anchor_home, 1)

# 3. Home : remplacer l'injection par l'appel du hook
home_inject = (
    '  const { t } = useTranslation();\n'
    '  const lang = uiLanguage || "fr";\n'
    '  const lessons = useMemo(() => buildLessons(lang), [lang]);\n'
    '  const phrases = useMemo(() => buildPhrases(lang), [lang]);\n'
    '  const navItems = useMemo(() => buildNavItems(lang), [lang]);\n'
)
home_new = (
    '  const { t } = useTranslation();\n'
    '  const { lang, lessons, phrases, navItems } = useLocalizedContent();\n'
)
assert home_inject in src, "home inject not found"
src = src.replace(home_inject, home_new, 1)

# 4. Sous-composants : injecter le hook
subs = [
    ('}) {\n  const totalLessons = lessons.length;',
     '}) {\n  const { lang, lessons } = useLocalizedContent();\n  const totalLessons = lessons.length;'),
    ('}) {\n  const { hasPassedLevel } = useCheckpointProgress();',
     '}) {\n  const { lang, lessons } = useLocalizedContent();\n  const { hasPassedLevel } = useCheckpointProgress();'),
    ('}) {\n  const safeFavorites = Array.isArray(favorites) ? favorites : [];',
     '}) {\n  const { lang } = useLocalizedContent();\n  const safeFavorites = Array.isArray(favorites) ? favorites : [];'),
    ('}) {\n  const cards = [',
     '}) {\n  const { lang } = useLocalizedContent();\n  const cards = ['),
    ('}) {\n  const username =',
     '}) {\n  const { lang, lessons } = useLocalizedContent();\n  const username ='),
]
for old, new in subs:
    assert old in src, "sub anchor not found: " + old[:40]
    src = src.replace(old, new, 1)

io.open(PATH, "w", encoding="utf-8").write(src)
print("page.tsx second pass OK")

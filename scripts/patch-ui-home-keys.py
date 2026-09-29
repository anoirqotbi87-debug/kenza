#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Insert `ui` and `home` namespaces after `passport` in each language block."""
import io

PATH = "src/lib/i18n/translations.ts"
with io.open(PATH, encoding="utf-8") as f:
    lines = f.readlines()

fr = [
 '      ui: { navReview: "Réviser", offlineActive: "Mode Hors-Ligne actif — Modules et révisions SRS disponibles sans connexion", onlineRestored: "Connexion rétablie", voiceRetry: "À retravailler, écoutez à nouveau Jamal.", voiceUnderstandable: "Compréhensible, travaillez les sons ci-dessous.", readingSpeed: "Vitesse de lecture", addNewWord: "Ajouter un nouveau mot", notePlaceholder: "ex. Entendu au café, utile pour prendre congé.", addToReviews: "Ajouter à mes révisions", excellentAnswer: "Excellente réponse !", verify: "Vérifier", hideTranslation: "Masquer la traduction", showTranslation: "Voir la traduction", listeningNow: "Écoute en cours...", holdToTalk: "Maintenez ou touchez pour parler" },',
 '      home: { seeAll: "Tout voir", googleError: "Impossible d\'initier la connexion Google.", proActivated: "Félicitations ! Votre abonnement Kenza Pro est activé.", phrasesDesc: "Vocabulaire du quotidien avec audio naturel.", audioPronAria: "Prononciation audio de la phrase.", phraseCopied: "Phrase copiée dans le presse-papiers.", graded: "Noté : {grade}", gradeAgain: "à revoir", gradeHard: "difficile", gradeGood: "bon", gradeEasy: "facile", resetConfirm: "Effacer la progression locale sur cet appareil ?", resetDone: "Progression locale réinitialisée.", dailyGoal: "Objectif quotidien : 10 minutes de pratique chaque jour.", langSwitcher: "Sélecteur de langue", switchToFr: "Passer en français", openSpace: "Ouvrir mon espace", closeLesson: "Fermer la leçon", explorePath: "Explorer le parcours", lessonLocked: "{title}, verrouillée", startLesson: "Commencer {title}", catEssentials: "LES ESSENTIELS", catDaily: "AU QUOTIDIEN", catLocate: "SE REPÉRER", catAdvanced: "IMMERSION AVANCÉE", validated: "Validé ✓", removeFav: "Retirer des favoris", addFav: "Ajouter aux favoris" },',
]
en = [
 '      ui: { navReview: "Review", offlineActive: "Offline Mode active — Modules and SRS reviews available without connection", onlineRestored: "Connection restored", voiceRetry: "Needs work, listen to Jamal again.", voiceUnderstandable: "Understandable, work on the sounds below.", readingSpeed: "Reading speed", addNewWord: "Add a new word", notePlaceholder: "e.g. Heard at the café, useful to say goodbye.", addToReviews: "Add to my reviews", excellentAnswer: "Excellent answer!", verify: "Check", hideTranslation: "Hide translation", showTranslation: "Show translation", listeningNow: "Listening...", holdToTalk: "Hold or tap to speak" },',
 '      home: { seeAll: "See all", googleError: "Could not start Google sign-in.", proActivated: "Congratulations! Your Kenza Pro subscription is active.", phrasesDesc: "Everyday vocabulary with natural audio.", audioPronAria: "Audio pronunciation of the phrase.", phraseCopied: "Phrase copied to clipboard.", graded: "Graded: {grade}", gradeAgain: "to review", gradeHard: "hard", gradeGood: "good", gradeEasy: "easy", resetConfirm: "Clear local progress on this device?", resetDone: "Local progress reset.", dailyGoal: "Daily goal: 10 minutes of practice every day.", langSwitcher: "Language selector", switchToFr: "Switch to French", openSpace: "Open my space", closeLesson: "Close lesson", explorePath: "Explore the path", lessonLocked: "{title}, locked", startLesson: "Start {title}", catEssentials: "THE ESSENTIALS", catDaily: "EVERYDAY", catLocate: "GET AROUND", catAdvanced: "ADVANCED IMMERSION", validated: "Passed ✓", removeFav: "Remove from favorites", addFav: "Add to favorites" },',
]
es = [
 '      ui: { navReview: "Repasar", offlineActive: "Modo Sin Conexión activo — Módulos y repasos SRS disponibles sin conexión", onlineRestored: "Conexión restablecida", voiceRetry: "Por mejorar, escucha de nuevo a Jamal.", voiceUnderstandable: "Comprensible, trabaja los sonidos de abajo.", readingSpeed: "Velocidad de lectura", addNewWord: "Añadir una palabra nueva", notePlaceholder: "ej. Escuchado en el café, útil para despedirse.", addToReviews: "Añadir a mis repasos", excellentAnswer: "¡Excelente respuesta!", verify: "Comprobar", hideTranslation: "Ocultar la traducción", showTranslation: "Ver la traducción", listeningNow: "Escuchando...", holdToTalk: "Mantén o toca para hablar" },',
 '      home: { seeAll: "Ver todo", googleError: "No se pudo iniciar sesión con Google.", proActivated: "¡Felicidades! Tu suscripción a Kenza Pro está activa.", phrasesDesc: "Vocabulario cotidiano con audio natural.", audioPronAria: "Pronunciación en audio de la frase.", phraseCopied: "Frase copiada al portapapeles.", graded: "Valorado: {grade}", gradeAgain: "por repasar", gradeHard: "difícil", gradeGood: "bien", gradeEasy: "fácil", resetConfirm: "¿Borrar el progreso local en este dispositivo?", resetDone: "Progreso local restablecido.", dailyGoal: "Objetivo diario: 10 minutos de práctica cada día.", langSwitcher: "Selector de idioma", switchToFr: "Cambiar a francés", openSpace: "Abrir mi espacio", closeLesson: "Cerrar la lección", explorePath: "Explorar la ruta", lessonLocked: "{title}, bloqueada", startLesson: "Empezar {title}", catEssentials: "LO ESENCIAL", catDaily: "A DIARIO", catLocate: "ORIENTARSE", catAdvanced: "INMERSIÓN AVANZADA", validated: "Aprobado ✓", removeFav: "Quitar de favoritos", addFav: "Añadir a favoritos" },',
]
ar = [
 '      ui: { navReview: "راجع", offlineActive: "وضع عدم الاتصال مُفعّل — الوحدات ومراجعات SRS متاحة دون اتصال", onlineRestored: "تمت استعادة الاتصال", voiceRetry: "بحاجة إلى تحسين، استمع إلى جمال مرة أخرى.", voiceUnderstandable: "مفهوم، اعمل على الأصوات أدناه.", readingSpeed: "سرعة القراءة", addNewWord: "أضف كلمة جديدة", notePlaceholder: "مثال: سمعتها في المقهى، مفيدة للوداع.", addToReviews: "أضف إلى مراجعاتي", excellentAnswer: "إجابة ممتازة!", verify: "تحقّق", hideTranslation: "إخفاء الترجمة", showTranslation: "عرض الترجمة", listeningNow: "جارٍ الاستماع...", holdToTalk: "اضغط مطوّلاً أو انقر للتحدث" },',
 '      home: { seeAll: "عرض الكل", googleError: "تعذّر بدء تسجيل الدخول عبر Google.", proActivated: "تهانينا! اشتراكك في كنزة برو مُفعّل.", phrasesDesc: "مفردات يومية مع صوت طبيعي.", audioPronAria: "النطق الصوتي للعبارة.", phraseCopied: "تم نسخ العبارة إلى الحافظة.", graded: "التقييم: {grade}", gradeAgain: "للمراجعة", gradeHard: "صعب", gradeGood: "جيد", gradeEasy: "سهل", resetConfirm: "حذف التقدّم المحلي على هذا الجهاز؟", resetDone: "تمت إعادة تعيين التقدّم المحلي.", dailyGoal: "الهدف اليومي: 10 دقائق من التدريب كل يوم.", langSwitcher: "محدّد اللغة", switchToFr: "التبديل إلى الفرنسية", openSpace: "افتح مساحتي", closeLesson: "إغلاق الدرس", explorePath: "استكشف المسار", lessonLocked: "{title}، مقفلة", startLesson: "ابدأ {title}", catEssentials: "الأساسيات", catDaily: "في الحياة اليومية", catLocate: "التوجّه", catAdvanced: "انغماس متقدم", validated: "مجتاز ✓", removeFav: "إزالة من المفضلة", addFav: "إضافة إلى المفضلة" },',
]

# passport line indices (0-based) in fr/en/es/ar blocks
targets = [103, 205, 307, 409]
blocks = [fr, en, es, ar]

for idx, blk in zip(targets, blocks):
    assert lines[idx].lstrip().startswith("passport:"), "mismatch at %d: %r" % (idx, lines[idx][:30])
    # insert after the passport line
    lines[idx] = lines[idx].rstrip("\n") + "\n" + "\n".join(blk) + "\n"

with io.open(PATH, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("ui+home namespaces inserted for 4 languages")

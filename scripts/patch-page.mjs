// patch-page.mjs v19 — i18n audit: dedupe tr/trL, repair wrapped-tr, translate remaining FR literals
import fs from "node:fs";

const P = "src/app/page.tsx";
let s = fs.readFileSync(P, "utf8");
const BS = String.fromCharCode(92);
const report = [];
let applied = 0;

function fix(name, oldS, newS) {
  const n = s.split(oldS).length - 1;
  if (n > 0) {
    s = s.split(oldS).join(newS);
    report.push(name + ": OK" + (n > 1 ? " x" + n : ""));
    applied += 1;
  } else {
    report.push(name + ": MISSING");
  }
}

// A) Fix duplicate const tr (TS2451 breaks tsc/Vercel) — rename 5-arg (lang) variant to trL
fix("A1-rename-def",
  'const tr = (lang: string, fr: string, en: string, es: string, ar: string) =>',
  'const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>');
fix("A2-rename-calls", "tr(lang,", "trL(lang,");

// B) Repair corrupted first-arg literals like "{tr(\"FR\", ...)}" from manual commits
(function () {
  const marker = '"' + "{tr(" + BS + '"';
  let count = 0;
  let idx = s.indexOf(marker);
  while (idx !== -1) {
    let i = idx + 1, closed = -1;
    while (i < s.length) {
      if (s[i] === BS) { i += 2; continue; }
      if (s[i] === '"') { closed = i; break; }
      i += 1;
    }
    if (closed === -1) break;
    const content = s.slice(idx + 1, closed);
    const pre = "{tr(" + BS + '"';
    if (content.startsWith(pre)) {
      const rest = content.slice(pre.length);
      const endQ = rest.indexOf(BS + '"');
      if (endQ !== -1) {
        const fr = rest.slice(0, endQ).split(BS + '"').join('"').split(BS + BS).join(BS);
        const newLit = '"' + fr.split('"').join(BS + '"') + '"';
        s = s.slice(0, idx) + newLit + s.slice(closed + 1);
        count += 1;
        idx = s.indexOf(marker, idx + newLit.length);
        continue;
      }
    }
    idx = s.indexOf(marker, closed + 1);
  }
  report.push("B-repair-wrapped: " + count);
  if (count > 0) applied += 1;
})();

// C) Remaining FR hardcoded literals
const T = [
["C1-toast-audio",
 'showToast("Prononciation audio de la phrase.");',
 'showToast(tr("Prononciation audio de la phrase.", "Natural voice pronunciation of the phrase.", "Pronunciación de voz natural de la frase.", "نطق صوتي طبيعي للعبارة."));'],
["C2-toast-copied",
 'showToast("Phrase copiée dans le presse-papiers.");',
 'showToast(tr("Phrase copiée dans le presse-papiers.", "Phrase copied to clipboard.", "Frase copiada al portapapeles.", "تم نسخ العبارة إلى الحافظة."));'],
["C3-toast-copyfail",
 'showToast("Copie indisponible.");',
 'showToast(tr("Copie indisponible.", "Copy unavailable.", "Copia no disponible.", "النسخ غير متاح."));'],
["C4-aria-closemenu",
 'aria-label="Fermer le menu"',
 'aria-label={tr("Fermer le menu", "Close the menu", "Cerrar el menú", "إغلاق القائمة")}'],
["C5-aria-langswitch",
 'aria-label="Sélecteur de langue"',
 'aria-label={tr("Sélecteur de langue", "Language switcher", "Selector de idioma", "مبدل اللغة")}'],
["C6-aria-navmain",
 'aria-label="Navigation principale"',
 'aria-label={tr("Navigation principale", "Main navigation", "Navegación principal", "التنقل الرئيسي")}'],
["C7-aria-navmobile",
 'aria-label="Navigation mobile"',
 'aria-label={tr("Navigation mobile", "Mobile navigation", "Navegación móvil", "التنقل على الهاتف")}'],
["C8-aria-quitter",
 'aria-label="Quitter"',
 'aria-label={tr("Quitter", "Leave", "Salir", "خروج")}'],
["C9-aria-close",
 'aria-label="Fermer"',
 'aria-label={tr("Fermer", "Close", "Cerrar", "إغلاق")}'],
["C10-fallback-learn",
 '|| "APPRENDRE"',
 '|| tr("APPRENDRE", "LEARN", "APRENDER", "تعلّم")'],
["C11-fallback-oral",
 '|| "PRATIQUE ORALE & IA"',
 '|| tr("PRATIQUE ORALE & IA", "SPEAKING & AI", "PRÁCTICA ORAL E IA", "المحادثة والذكاء الاصطناعي")'],
["C12-fallback-space",
 '|| "TON ESPACE"',
 '|| tr("TON ESPACE", "YOUR SPACE", "TU ESPACIO", "فضاؤك")'],
["C13-alt-hero",
 'alt="Maroc médina"',
 'alt={tr("Maroc médina", "Moroccan medina", "Medina de Marruecos", "مدينة مغربية")}'],
["C14-plural-s",
 '{streak > 1 ? "s" : ""}',
 '{streak > 1 ? tr("s", "s", "s", "") : ""}'],
["C15-lecon-sur",
 'leçon{completedLessons.length > 1 ? "s" : ""} sur {lessons.length}',
 '{tr("leçon", "lesson", "lección", "درس")}{completedLessons.length > 1 ? tr("s", "s", "s", "") : ""}{tr(" sur ", " of ", " de ", " من ")}{lessons.length}'],
["C16-tag-essentiels",
 '? "LES ESSENTIELS"',
 '? tr("LES ESSENTIELS", "THE ESSENTIALS", "LO ESENCIAL", "الأساسيات")'],
["C17-tag-quotidien",
 '? "AU QUOTIDIEN"',
 '? tr("AU QUOTIDIEN", "EVERYDAY LIFE", "LO COTIDIANO", "الحياة اليومية")'],
["C18-tag-reperer",
 '? "SE REPÉRER"',
 '? tr("SE REPÉRER", "FINDING YOUR WAY", "ORIENTARSE", "الاستدلال")'],
["C19-tag-immersion",
 ': "IMMERSION AVANCÉE"',
 ': tr("IMMERSION AVANCÉE", "ADVANCED IMMERSION", "INMERSIÓN AVANZADA", "انغماس متقدم")'],
["C20-terminee",
 '<CheckCircle2 size={13} /> TERMINÉE',
 '<CheckCircle2 size={13} /> {tr("TERMINÉE", "COMPLETED", "COMPLETADA", "مكتملة")}'],
["C21-exercices",
 '{lesson.questions.length} exercices',
 '{lesson.questions.length} {tr("exercices", "exercises", "ejercicios", "تمارين")}'],
["C22-valide",
 '? "Validé ✓" : "En cours"',
 '? tr("Validé ✓", "Passed ✓", "Aprobado ✓", "ناجح ✓") : tr("En cours", "In progress", "En curso", "قيد التقدم")'],
["C23-aside-tip",
 '5 minutes par jour font plus qu’une heure de temps en temps. Reviens quand tu veux.',
 '{tr("5 minutes par jour font plus qu’une heure de temps en temps. Reviens quand tu veux.", "5 minutes a day beats an hour once in a while. Come back whenever you want.", "5 minutos al día hacen más que una hora de vez en cuando. Vuelve cuando quieras.", "5 دقائق يومياً تنفع أكثر من ساعة بين الحين والآخر. عُد متى شئت.")}'],
["C24-darija-note",
 'Le mot <strong>darija</strong> vient de l’arabe <span dir="rtl">الدارجة</span> — la\n            langue courante, celle de tous les jours.',
 '{tr("Le mot ", "The word ", "La palabra ", "كلمة ")}<strong>darija</strong>{tr(" vient de l’arabe ", " comes from Arabic ", " viene del árabe ", " أصله من العربية ")}<span dir="rtl">الدارجة</span>{tr(" — la langue courante, celle de tous les jours.", " — the everyday language.", " — la lengua corriente, la de todos los días.", " — اللغة الدارجة، لغة كل يوم.")}'],
["C25-phrase-count",
 '{safePhrases.length} expression{safePhrases.length === 1 ? "" : "s"}',
 '{safePhrases.length} {tr("expression", "expression", "expresión", "عبارة")}{safePhrases.length === 1 ? "" : tr("s", "s", "s", "")}'],
["C26-aria-fav",
 'isFav ? "Retirer des favoris" : "Ajouter aux favoris"',
 'isFav ? tr("Retirer des favoris", "Remove from favorites", "Quitar de favoritos", "إزالة من المفضلة") : tr("Ajouter aux favoris", "Add to favorites", "Añadir a favoritos", "أضف إلى المفضلة")'],
["C27-ecouter",
 '<Volume2 size={15} /> Écouter',
 '<Volume2 size={15} /> {tr("Écouter", "Listen", "Escuchar", "استمع")}'],
["C28-copier",
 '<Bookmark size={14} /> Copier',
 '<Bookmark size={14} /> {tr("Copier", "Copy", "Copiar", "نسخ")}'],
["C29-cat-all",
 ': category === "Tout voir"',
 ': (category === "Tout voir" || category === "__all__")'],
["C30-phrase-footnote",
 'Synthèse vocale naturelle haute fidélité (Edge TTS) avec\n        cache hors-ligne intégré.',
 '{tr("Synthèse vocale naturelle haute fidélité (Edge TTS) avec cache hors-ligne intégré.", "High-fidelity natural voice synthesis (Edge TTS) with built-in offline cache.", "Síntesis de voz natural de alta fidelidad (Edge TTS) con caché sin conexión integrada.", "تحويل نص إلى كلام طبيعي عالي الدقة (Edge TTS) مع تخزين مؤقت دون اتصال.")}'],
["C31-space-privacy",
 'La progression est sécurisée. Si tu te connectes, tes leçons, favoris et points se\n            synchronisent automatiquement sur tous tes appareils.',
 '{tr("La progression est sécurisée. Si tu te connectes, tes leçons, favoris et points se synchronisent automatiquement sur tous tes appareils.", "Your progress is secure. If you sign in, your lessons, favorites and points sync automatically across all your devices.", "Tu progreso está seguro. Si inicias sesión, tus lecciones, favoritos y puntos se sincronizan automáticamente en todos tus dispositivos.", "تقدمك محمي. عند تسجيل الدخول، تتزامن دروسك ومفضلاتك ونقاطك تلقائياً عبر جميع أجهزتك.")}'],
["C32-pwa-row",
 '<span>PWA Hors-Ligne · Sauvegarde Hybride Local & Supabase</span>',
 '<span>{tr("PWA Hors-Ligne · Sauvegarde Hybride Local & Supabase", "Offline PWA · Hybrid Local & Supabase Backup", "PWA sin conexión · Copia de seguridad híbrida local y Supabase", "تطبيق PWA دون اتصال · نسخ احتياطي هجين محلي وSupabase")}</span>'],
["C33-cert-para",
 'Valide les examens de palier pour obtenir tes visas officiels du Passeport Darija et les\n            télécharger en haute résolution.',
 '{tr("Valide les examens de palier pour obtenir tes visas officiels du Passeport Darija et les télécharger en haute résolution.", "Pass the level exams to earn your official Darija Passport visas and download them in high resolution.", "Supera los exámenes de nivel para obtener tus visados oficiales del Pasaporte Darija y descargarlos en alta resolución.", "اجتز اختبارات المستويات للحصول على تأشيرات جواز الدارجة الرسمية وتحميلها بدقة عالية.")}'],
["C34-erase-progress",
 'Effacer ma progression locale',
 '{tr("Effacer ma progression locale", "Erase my local progress", "Borrar mi progreso local", "حذف تقدمي المحلي")}'],
["C35-future-note",
 'Accède à l\'intégralité des modules B1 & B2, aux dialogues IA\n          illimités et aux visas de certification culturels.',
 '{tr("Accède à l\'intégralité des modules B1 & B2, aux dialogues IA illimités et aux visas de certification culturels.", "Get access to all B1 & B2 modules, unlimited AI dialogues and cultural certification visas.", "Accede a la totalidad de los módulos B1 y B2, diálogos IA ilimitados y visados de certificación culturales.", "احصل على وصول كامل لوحدات B1 وB2، وحوارات الذكاء الاصطناعي غير المحدودة، وتأشيرات الشهادات الثقافية.")}'],
["C36-note-bchhal",
 'note: "« Bchhal hada? » permet de demander le prix de n\'importe quel article.",',
 'note: tr("« Bchhal hada? » permet de demander le prix de n\'importe quel article.", "« Bchhal hada? » lets you ask the price of any item.", "« Bchhal hada? » permite preguntar el precio de cualquier artículo.", "«بشحال هادا؟» تمكنك من السؤال عن سعر أي سلعة."),'],
["C37-note-wahed",
 'note: "« Wahed » = un, « atay » = thé, « afak » = s’il te plaît."',
 'note: tr("« Wahed » = un, « atay » = thé, « afak » = s’il te plaît.", "« Wahed » = one, « atay » = tea, « afak » = please.", "« Wahed » = uno, « atay » = té, « afak » = por favor.", "«واحد» = واحد، «أتاي» = شاي، «عفاك» = من فضلك.")'],
["C38-meaning-bslama",
 'meaning: "Au revoir, à bientôt.",',
 'meaning: tr("Au revoir, à bientôt.", "Goodbye, see you soon.", "Adiós, hasta pronto.", "إلى اللقاء، أراك قريباً."),'],
["C39-expression-darija",
 '"Expression en darija"',
 'tr("Expression en darija", "Darija expression", "Expresión en darija", "عبارة بالدارجة")'],
["C40-note-vocab",
 '"Vocabulaire du quotidien avec audio naturel."',
 'tr("Vocabulaire du quotidien avec audio naturel.", "Everyday vocabulary with natural audio.", "Vocabulario cotidiano con audio natural.", "مفردات يومية بصوت طبيعي.")'],
];
for (const e of T) fix(e[0], e[1], e[2]);

// D) Sanity checks
report.push("D-tr-def-count: " + (s.split("const tr =").length - 1));
report.push("D-trL-def: " + (s.includes("const trL = (lang") ? "OK" : "MISSING"));
report.push("D-wrapped-left: " + (s.indexOf('"' + "{tr(" + BS + '"') === -1 ? "OK" : "FAIL"));
report.push("D-home-export: " + (s.includes("export default function Home") ? "OK" : "FAIL"));
report.push("D-trL-calls: " + (s.split("trL(lang,").length - 1));
report.push("D-tr4-calls: " + (s.split("tr(\"").length - 1));

// E) Write file + dumps (400-line chunks)
fs.writeFileSync(P, s);
const lines = s.split("\n");
const CH = 400;
for (let c = 0; c * CH < lines.length; c++) {
  const chunk = lines.slice(c * CH, (c + 1) * CH)
    .map((l, i) => String(c * CH + i + 1).padStart(4, "0") + "|" + l).join("\n");
  fs.writeFileSync("docs/dump-" + (c + 1) + ".txt", chunk);
}
fs.writeFileSync("docs/verify.json", report.join("\n"));
console.log("applied=" + applied);
console.log(report.join("\n"));

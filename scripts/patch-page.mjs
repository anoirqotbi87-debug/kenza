// patch-page.mjs v26 — fix typecheck errors: ttrack->track (SaveProgressCard), missing data destructure (AuthModal), implicit any (useAppStore) + v25 i18n fixes kept idempotent
import fs from "node:fs";
const report = [];
function fix(path, name, oldS, newS) {
  let s = fs.readFileSync(path, "utf8");
  if (!s.includes(oldS)) {
    report.push(s.includes(newS) ? name + ": OK (already)" : name + ": MISSING");
    return;
  }
  const n = s.split(oldS).length - 1;
  if (n !== 1) { report.push(name + ": AMBIGUOUS (" + n + ")"); return; }
  s = s.replace(oldS, newS);
  fs.writeFileSync(path, s);
  report.push(name + ": OK");
}

fix("src/components/auth/SaveProgressCard.tsx", "SPC-ttrack-viewed",
  "ttrack('save_prompt_viewed'",
  "track('save_prompt_viewed'")
;
fix("src/components/auth/SaveProgressCard.tsx", "SPC-ttrack-clicked",
  "ttrack('save_prompt_clicked'",
  "track('save_prompt_clicked'")
;
fix("src/components/auth/AuthModal.tsx", "AM-data-destructure",
  "const { error } = await signUpWithTracking(email, password, { username: email.split('@')[0] });",
  "const { data, error } = await signUpWithTracking(email, password, { username: email.split('@')[0] });")
;
fix("src/store/useAppStore.ts", "UAS-setUser",
  "setUser: (user) => set({ user }),",
  "setUser: (user: AppState['user']) => set({ user }),")
;
fix("src/store/useAppStore.ts", "UAS-completeOnboarding",
  "completeOnboarding: (goal, minutes) => set({",
  "completeOnboarding: (goal: AppState['userGoal'], minutes: AppState['dailyTargetMinutes']) => set({")
;
fix("src/store/useAppStore.ts", "UAS-setIsPremium",
  "setIsPremium: (isPremium) => set({ isPremium }),",
  "setIsPremium: (isPremium: boolean) => set({ isPremium }),")
;

// v25 i18n fixes (idempotent re-check)
fix("src/types/curriculum.ts", "TYPE-ExerciseOption",
  "text: string; // Keeps Darija in text",
  "text: MultiLangText | string; // Darija in text, or localized meaning (MultiLangText)")
;
fix("src/data/module3.ts", "M3-l1-chambre",
  "text: 'La chambre', isCorrect: false },",
  "text: { fr: 'La chambre', en: 'The bedroom', es: 'El dormitorio', ar: 'الغرفة' }, isCorrect: false },")
;
fix("src/data/module3.ts", "M3-l1-cle",
  "text: 'La clé', isCorrect: true },",
  "text: { fr: 'La clé', en: 'The key', es: 'La llave', ar: 'المفتاح' }, isCorrect: true },")
;
fix("src/data/module3.ts", "M3-l1-lit",
  "text: 'Le lit', isCorrect: false }",
  "text: { fr: 'Le lit', en: 'The bed', es: 'La cama', ar: 'السرير' }, isCorrect: false }")
;
fix("src/data/module3.ts", "M3-l3-medecin",
  "text: 'Médecin', isCorrect: false },",
  "text: { fr: 'Médecin', en: 'Doctor', es: 'Médico', ar: 'طبيب' }, isCorrect: false },")
;
fix("src/data/module3.ts", "M3-l3-medicament",
  "text: 'Médicament', isCorrect: true },",
  "text: { fr: 'Médicament', en: 'Medicine', es: 'Medicamento', ar: 'دواء' }, isCorrect: true },")
;
fix("src/data/module3.ts", "M3-l3-malade",
  "text: 'Malade', isCorrect: false }",
  "text: { fr: 'Malade', en: 'Sick', es: 'Enfermo', ar: 'مريض' }, isCorrect: false }")
;
fix("src/data/module5.ts", "M5-agree",
  "text: 'Je suis d\\'accord', isCorrect: false },",
  "text: { fr: 'Je suis d\\'accord', en: 'I agree', es: 'Estoy de acuerdo', ar: 'أنا موافق' }, isCorrect: false },")
;
fix("src/data/module5.ts", "M5-pasforce",
  "text: 'Pas forcément', isCorrect: true },",
  "text: { fr: 'Pas forcément', en: 'Not necessarily', es: 'No necesariamente', ar: 'ليس بالضرورة' }, isCorrect: true },")
;
fix("src/data/module5.ts", "M5-tort",
  "text: 'Tu as tort', isCorrect: false }",
  "text: { fr: 'Tu as tort', en: 'You are wrong', es: 'Estás equivocado', ar: 'أنت مخطئ' }, isCorrect: false }")
;
fix("src/data/module5.ts", "M5-employe",
  "text: 'Employé', isCorrect: false },",
  "text: { fr: 'Employé', en: 'Employee', es: 'Empleado', ar: 'موظف' }, isCorrect: false },")
;
fix("src/data/module5.ts", "M5-rdv",
  "text: 'Rendez-vous', isCorrect: false },",
  "text: { fr: 'Rendez-vous', en: 'Appointment', es: 'Cita', ar: 'موعد' }, isCorrect: false },")
;
fix("src/data/module5.ts", "M5-projet",
  "text: 'Projet', isCorrect: true }",
  "text: { fr: 'Projet', en: 'Project', es: 'Proyecto', ar: 'مشروع' }, isCorrect: true }")
;
fix("src/data/module5.ts", "M5-secret",
  "text: 'Garde le secret / N\\'en parle pas', isCorrect: true },",
  "text: { fr: 'Garde le secret / N\\'en parle pas', en: 'Keep it secret / Don\\'t talk about it', es: 'Guárdalo en secreto / No lo menciones', ar: 'احفظ السر / لا تتحدث عنه' }, isCorrect: true },")
;
fix("src/data/module5.ts", "M5-passe",
  "text: 'Ce qui est passé est passé', isCorrect: false },",
  "text: { fr: 'Ce qui est passé est passé', en: 'What\\'s done is done', es: 'Lo pasado, pasado está', ar: 'ما فات مات' }, isCorrect: false },")
;
fix("src/data/module5.ts", "M5-petit",
  "text: 'Petit à petit', isCorrect: false }",
  "text: { fr: 'Petit à petit', en: 'Little by little', es: 'Poco a poco', ar: 'شيئاً فشيئاً' }, isCorrect: false }")
;
fix("src/data/module7.ts", "M7-tourner",
  "right: { text: 'Tourner la page' }",
  "right: { text: { fr: 'Tourner la page', en: 'Turn the page', es: 'Pasar la página', ar: 'طوّي الصفحة' } }")
;
fix("src/data/module7.ts", "M7-patience",
  "right: { text: 'Patience et régularité' }",
  "right: { text: { fr: 'Patience et régularité', en: 'Patience and consistency', es: 'Paciencia y constancia', ar: 'الصبر والانتظام' } }")
;
fix("src/data/module7.ts", "M7-courir",
  "right: { text: 'Rien ne sert de courir' }",
  "right: { text: { fr: 'Rien ne sert de courir', en: 'No point in rushing', es: 'No sirve de nada correr', ar: 'لا فائدة من الاستعجال' } }")
;

const DUMP_MODE = (process.env.DUMP_MODE || "on") === "on";
report.push("DUMP_MODE: " + (DUMP_MODE ? "on" : "off"));
if (DUMP_MODE) {
  const tr = fs.readFileSync("src/lib/i18n/translations.ts", "utf8");
  const trLines = tr.split("\n");
  const TRC = 220;
  for (let c = 0; c * TRC < trLines.length; c++) {
    const chunk = trLines.slice(c * TRC, (c + 1) * TRC)
      .map((l, i) => String(c * TRC + i + 1).padStart(4, "0") + "|" + l).join("\n");
    fs.writeFileSync("docs/tr-dump-" + (c + 1) + ".txt", chunk);
  }
}
fs.writeFileSync("docs/verify.json", report.join("\n"));
console.log(report.join("\n"));
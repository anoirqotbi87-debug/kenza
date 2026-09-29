// patch-page.mjs v22 — i18n idempotents (v19-v21) + PR#1 funnel-tracking integration (gated) + dumps (DUMP_MODE)
import fs from "node:fs";

const report = [];
let applied = 0;
const P = "src/app/page.tsx";

function fixFile(path, name, oldS, newS) {
  let s = fs.readFileSync(path, "utf8");
  const n = s.split(oldS).length - 1;
  if (n > 0) {
    fs.writeFileSync(path, s.split(oldS).join(newS));
    report.push(name + ": OK" + (n > 1 ? " x" + n : ""));
    applied += 1;
    return true;
  }
  report.push(name + ": MISSING");
  return false;
}

// ---- PART 1: i18n idempotents (v19-v21) ----
fixFile(P, "A1-rename-def",
  'const tr = (lang: string, fr: string, en: string, es: string, ar: string) =>',
  'const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>');
(function () {
  let s = fs.readFileSync(P, "utf8");
  const n = s.split("tr(lang,").length - 1;
  if (n > 0) {
    fs.writeFileSync(P, s.split("tr(lang,").join("trL(lang,"));
    report.push("A2-rename-calls: OK x" + n);
    applied += 1;
  } else report.push("A2-rename-calls: MISSING");
})();
(function () {
  let s = fs.readFileSync(P, "utf8");
  const marker = '"' + "{tr(" + '"';
  let count = 0;
  let idx = s.indexOf(marker);
  while (idx !== -1) {
    const frStart = idx + marker.length;
    const frEnd = s.indexOf('"', frStart);
    if (frEnd === -1) break;
    const closeInner = s.indexOf(")}", frEnd);
    if (closeInner === -1) break;
    const endQuote = s.indexOf('"', closeInner + 2);
    if (endQuote === -1) break;
    const fr = s.slice(frStart, frEnd);
    const newLit = '"' + fr + '"';
    s = s.slice(0, idx) + newLit + s.slice(endQuote + 1);
    count += 1;
    idx = s.indexOf(marker, idx + newLit.length);
  }
  if (count > 0) { fs.writeFileSync(P, s); applied += 1; }
  report.push("B-repair-wrapped: " + count);
})();
fixFile(P, "E2-category-sentinel-init", 'useState("Tout voir")', 'useState("__all__")');
fixFile(P, "E3-category-sentinel-reset", 'setCategory("Tout voir")', 'setCategory("__all__")');

// ---- PART 2: PR#1 funnel-tracking integration (only when the tracking lib is present) ----
const TRACKING_READY = fs.existsSync("src/lib/tracking.ts");
report.push("GATE-tracking: " + (TRACKING_READY ? "ON" : "OFF (src/lib/tracking.ts absent)"));
if (TRACKING_READY) {
  // --- page.tsx : suivi funnel + invitation a sauvegarder ---
  fixFile(P, "F1-tr-imports",
    'import { srsVocabulary } from "@/data/srs-deck";',
    'import { srsVocabulary } from "@/data/srs-deck";\nimport { track } from "@/lib/tracking";\nimport { useAuthUser } from "@/lib/useAuthUser";\nimport { dismissSavePrompt, getSavePromptVariant } from "@/lib/savePrompt";\nimport AuthModal from "@/components/auth/AuthModal";\nimport SaveProgressCard from "@/components/auth/SaveProgressCard";');
  fixFile(P, "F2-tr-states",
    'const [search, setSearch] = useState("");',
    'const [search, setSearch] = useState("");\n  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);\n  const [savePromptHidden, setSavePromptHidden] = useState(false);\n  const [lessonJustDone, setLessonJustDone] = useState(false);');
  fixFile(P, "F3-tr-isguest",
    'const { t } = useTranslation();\n  const { lang, lessons, phrases, navItems } = useLocalizedContent();',
    'const { t } = useTranslation();\n  const { isGuest } = useAuthUser();\n  const { lang, lessons, phrases, navItems } = useLocalizedContent();');
  fixFile(P, "F4-tr-pageview",
    'useEffect(() => {\n    setMobileMenuOpen(false);\n    window.scrollTo({ top: 0, behavior: "smooth" });\n  }, [view]);',
    'useEffect(() => {\n    setMobileMenuOpen(false);\n    window.scrollTo({ top: 0, behavior: "smooth" });\n  }, [view]);\n\n  // Chaque vue est suivie comme une page virtuelle (funnel)\n  useEffect(() => {\n    track("page_view", { view }, `/${view}`);\n  }, [view]);');
  fixFile(P, "F5-tr-lesson-started",
    'setLessonId(id);\n    setQuestionIndex(0);\n    setSelectedAnswer(null);\n  };',
    'track("lesson_started", { lesson_id: id, is_first_lesson: completedLessons.length === 0 }, "/lesson");\n    setSavePromptHidden(false);\n    setLessonJustDone(false);\n    setLessonId(id);\n    setQuestionIndex(0);\n    setSelectedAnswer(null);\n  };');
  fixFile(P, "F6-tr-lesson-completed",
    'const firstCompletion = !completedLessons.includes(activeLesson.id);\n    if (firstCompletion) {\n      completeLesson(activeLesson.id);\n      addXp(activeLesson.questions.length * 10);\n    }',
    'const firstCompletion = !completedLessons.includes(activeLesson.id);\n    if (firstCompletion) {\n      track("lesson_completed", { lesson_id: activeLesson.id, lessons_completed_total: completedLessons.length + 1 }, "/lesson");\n      setLessonJustDone(true);\n      completeLesson(activeLesson.id);\n      addXp(activeLesson.questions.length * 10);\n    }');
  fixFile(P, "F7-tr-saveprompt-variant",
    'const currentHeader = headerTitle[view];',
    'const currentHeader = headerTitle[view];\n\n  // Invitation a sauvegarder la progression (invites uniquement) apres une lecon\n  const savePromptVariant = isGuest && lessonJustDone && !savePromptHidden\n    ? getSavePromptVariant(completedCount, streakDays)\n    : null;');
  fixFile(P, "F8-tr-render",
    '      <InstallPwaBanner />',
    '      {savePromptVariant && (\n        <div className="fixed inset-x-0 bottom-24 sm:bottom-8 z-40 flex justify-center px-4">\n          <div className="w-full max-w-sm">\n            <SaveProgressCard\n              variant={savePromptVariant}\n              lessonsCompleted={completedCount}\n              onSave={() => {\n                track("cta_click", { cta: "save_progress" }, `/${view}`);\n                setAuthMode("signup");\n                setSavePromptHidden(true);\n              }}\n              onLater={() => {\n                dismissSavePrompt(completedCount);\n                setSavePromptHidden(true);\n              }}\n            />\n          </div>\n        </div>\n      )}\n\n      {authMode && (\n        <AuthModal\n          key={authMode}\n          isOpen\n          initialMode={authMode}\n          onClose={() => setAuthMode(null)}\n          onSuccess={() => setAuthMode(null)}\n        />\n      )}\n\n      <InstallPwaBanner />');

  // --- layout.tsx : TrackingProvider ---
  fixFile("src/app/layout.tsx", "L1-import",
    "import DirSync from '../components/DirSync';",
    "import DirSync from '../components/DirSync';\nimport TrackingProvider from '../components/TrackingProvider';");
  fixFile("src/app/layout.tsx", "L2-wrap",
    "<I18nProvider>\n          <NetworkStatus />\n          {children}\n        </I18nProvider>",
    "<I18nProvider>\n          <NetworkStatus />\n          <TrackingProvider>\n            {children}\n          </TrackingProvider>\n        </I18nProvider>");

  // --- syncService.ts : ne pas ecraser la progression d'un invite lors d'une nouvelle inscription ---
  fixFile("src/lib/syncService.ts", "S1-cloud-empty",
    "async syncCloudToLocal(userId: string | null) {\n    if (!userId) return false;",
    "async syncCloudToLocal(userId: string | null) {\n    if (!userId) return false;\n\n    // Compte cloud encore vide (nouvelle inscription) alors que l'invite a deja progresse :\n    // on envoie la progression locale au lieu de l'ecraser.\n    const { count: cloudLessons } = await supabase\n      .from('lesson_progress')\n      .select('lesson_id', { count: 'exact', head: true })\n      .eq('user_id', userId)\n      .eq('completed', true);\n    if ((cloudLessons ?? 0) === 0 && useAppStore.getState().completedLessons.length > 0) {\n      await this.migrateGuestDataToCloud(userId);\n      return true;\n    }");

  // --- useAppStore.ts : devUnlockAll piloté par variable d'environnement ---
  fixFile("src/store/useAppStore.ts", "U1-devunlock",
    "devUnlockAll: false, // Prod: locked progression",
    "devUnlockAll: process.env.NEXT_PUBLIC_DEV_UNLOCK_ALL === 'true', // Prod : verrouille ; en local : NEXT_PUBLIC_DEV_UNLOCK_ALL=true");
  fixFile("src/store/useAppStore.ts", "U2-persist-v3",
    "name: 'darija-quest-storage',\n      version: 2,",
    "name: 'darija-quest-storage',\n      version: 3,\n      // devUnlockAll n'est plus sauvegarde : il depend uniquement de la variable d'environnement\n      partialize: (state: any) => {\n        // eslint-disable-next-line @typescript-eslint/no-unused-vars\n        const { devUnlockAll, ...rest } = state;\n        return rest;\n      },");
  fixFile("src/store/useAppStore.ts", "U3-migrate-v3",
    "        return persistedState;",
    "        if (version < 3 && persistedState) {\n          // Les navigateurs ayant recu devUnlockAll: true ne gardent pas les lecons debloquees\n          delete persistedState.devUnlockAll;\n        }\n        return persistedState;");

  // --- ExerciseRunner.tsx : tracking + finishExtra ---
  fixFile("src/components/ExerciseRunner.tsx", "X1-import",
    "import { playAudio } from '../lib/audio';",
    "import { playAudio } from '../lib/audio';\nimport { track } from '../lib/tracking';");
  fixFile("src/components/ExerciseRunner.tsx", "X2-props",
    "interface ExerciseRunnerProps {\n  lesson: Lesson;\n  onComplete: () => void;\n  onClose: () => void;\n}",
    "interface ExerciseRunnerProps {\n  lesson: Lesson;\n  onComplete: () => void;\n  onClose: () => void;\n  /** Contenu optionnel affiche sur l'ecran de felicitations (ex. invitation a sauvegarder). */\n  finishExtra?: React.ReactNode;\n}");
  fixFile("src/components/ExerciseRunner.tsx", "X3-signature",
    "export default function ExerciseRunner({ lesson, onComplete, onClose }: ExerciseRunnerProps) {",
    "export default function ExerciseRunner({ lesson, onComplete, onClose, finishExtra }: ExerciseRunnerProps) {");
  fixFile("src/components/ExerciseRunner.tsx", "X4-exercise-answered",
    "setIsCorrect(correct);\n    setIsAnswerChecked(true);",
    "setIsCorrect(correct);\n    setIsAnswerChecked(true);\n\n    track('exercise_answered', {\n      lesson_id: lesson.id,\n      step: currentStepIndex,\n      total_steps: lesson.steps.length,\n      exercise_type: type,\n      correct,\n    }, '/lesson');\n    if (!correct && lives === 1) {\n      track('lesson_failed', { lesson_id: lesson.id, step: currentStepIndex, total_steps: lesson.steps.length }, '/lesson');\n    }");
  fixFile("src/components/ExerciseRunner.tsx", "X5-congrats-spacing",
    '<div className="flex gap-8 mb-12">',
    '<div className={`flex gap-8 ${finishExtra ? \'mb-6\' : \'mb-12\'}`}>');
  fixFile("src/components/ExerciseRunner.tsx", "X6-finishextra-render",
    '        <button onClick={onComplete} className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 w-full max-w-sm">',
    '        {finishExtra}\n\n        <button onClick={onComplete} className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 w-full max-w-sm">');
  fixFile("src/components/ExerciseRunner.tsx", "X7-abandoned",
    '        <button onClick={onClose} className="p-2 text-[#7A7670] hover:text-[#1B2A4A] rounded-full hover:bg-[#E8E2D5]/50 transition-colors">',
    '        <button\n          onClick={() => {\n            track(\'lesson_abandoned\', {\n              lesson_id: lesson.id,\n              step: currentStepIndex,\n              total_steps: lesson.steps.length,\n              lives,\n            }, \'/lesson\');\n            onClose();\n          }}\n          className="p-2 text-[#7A7670] hover:text-[#1B2A4A] rounded-full hover:bg-[#E8E2D5]/50 transition-colors">');

  // --- AuthModal.tsx : tracking + initialMode + z-index ---
  fixFile("src/components/auth/AuthModal.tsx", "A1-react-import",
    "import React, { useState } from 'react';",
    "import React, { useEffect, useState } from 'react';");
  fixFile("src/components/auth/AuthModal.tsx", "A2-track-import",
    "import { syncService } from '../../lib/syncService';",
    "import { syncService } from '../../lib/syncService';\nimport { signUpWithTracking, track } from '../../lib/tracking';");
  fixFile("src/components/auth/AuthModal.tsx", "A3-props",
    "interface AuthModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  onSuccess: () => void;\n}",
    "interface AuthModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  onSuccess: () => void;\n  initialMode?: 'login' | 'signup';\n}");
  fixFile("src/components/auth/AuthModal.tsx", "A4-signature",
    "export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {",
    "export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {");
  fixFile("src/components/auth/AuthModal.tsx", "A5-islogin",
    "const [isLogin, setIsLogin] = useState(true);",
    "const [isLogin, setIsLogin] = useState(initialMode === 'login');");
  fixFile("src/components/auth/AuthModal.tsx", "A6-viewed",
    "const { t } = useTranslation();",
    "const { t } = useTranslation();\n\n  useEffect(() => {\n    if (isOpen) track('auth_modal_viewed', { mode: initialMode }, '/auth');\n  }, [isOpen, initialMode]);");
  fixFile("src/components/auth/AuthModal.tsx", "A7-signup-tracking",
    "const { data, error } = await supabase.auth.signUp({\n        email,\n        password,\n        options: {\n          data: {\n            username: email.split('@')[0],\n          },\n        },\n      });",
    "track('signup_started', { method: 'email' }, '/auth');\n      const { data, error } = await signUpWithTracking(email, password, { username: email.split('@')[0] });\n      if (error) {\n        track('signup_failed', { method: 'email', error: error.message?.slice(0, 200) }, '/auth');\n        throw error;\n      }");
  fixFile("src/components/auth/AuthModal.tsx", "A8-oauth-tracking",
    "const { error } = await supabase.auth.signInWithOAuth({",
    "track(isLogin ? 'login_started' : 'signup_started', { method: provider }, '/auth');\n      const { error } = await supabase.auth.signInWithOAuth({");
  fixFile("src/components/auth/AuthModal.tsx", "A9-zindex",
    "fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B2A4A]/60",
    "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1B2A4A]/60");

  // --- translations.ts : headerLogin/checkEmail + savePrompt (fr/en/es/ar) ---
  const TRF = "src/lib/i18n/translations.ts";
  fixFile(TRF, "T1-fr-saveprompt",
    'continueGuest: "Continuer en mode invité", google: "Continuer avec Google"\n    },',
    'continueGuest: "Continuer en mode invité", google: "Continuer avec Google",\n      headerLogin: "Se connecter", checkEmail: "Compte créé. Confirmez votre adresse via l\'e-mail que nous venons d\'envoyer, puis revenez ici : votre progression sera sauvegardée."\n    },\n    savePrompt: {\n      title: "Ne perdez pas vos progrès",\n      body: "Créez votre compte gratuit pour garder vos XP, votre série et reprendre sur n\'importe quel appareil.",\n      reminderTitle: "Vos progrès ne sont pas encore sauvegardés",\n      reminderBody: "Vous avez déjà {xp} XP et {lessons} leçons terminées. Ils ne sont enregistrés que sur cet appareil : créez un compte gratuit pour ne rien perdre.",\n      cta: "Sauvegarder ma progression",\n      later: "Plus tard",\n      reassurance: "Gratuit · 30 secondes · Avec Google ou e-mail"\n    },');
  fixFile(TRF, "T2-en-saveprompt",
    'continueGuest: "Continue as guest", google: "Continue with Google"\n    },',
    'continueGuest: "Continue as guest", google: "Continue with Google",\n      headerLogin: "Log in", checkEmail: "Account created. Confirm your address using the email we just sent, then come back here: your progress will be saved."\n    },\n    savePrompt: {\n      title: "Don\'t lose your progress",\n      body: "Create your free account to keep your XP and streak, and pick up on any device.",\n      reminderTitle: "Your progress isn\'t saved yet",\n      reminderBody: "You already have {xp} XP and {lessons} lessons completed. They\'re only stored on this device: create a free account so you don\'t lose anything.",\n      cta: "Save my progress",\n      later: "Later",\n      reassurance: "Free · 30 seconds · With Google or email"\n    },');
  fixFile(TRF, "T3-es-saveprompt",
    'continueGuest: "Continuar como invitado", google: "Continuar con Google"\n    },',
    'continueGuest: "Continuar como invitado", google: "Continuar con Google",\n      headerLogin: "Iniciar sesión", checkEmail: "Cuenta creada. Confirma tu dirección con el correo que te acabamos de enviar y vuelve aquí: tu progreso se guardará."\n    },\n    savePrompt: {\n      title: "No pierdas tu progreso",\n      body: "Crea tu cuenta gratuita para conservar tus XP y tu racha, y continuar en cualquier dispositivo.",\n      reminderTitle: "Tu progreso aún no está guardado",\n      reminderBody: "Ya tienes {xp} XP y {lessons} lecciones completadas. Solo están guardados en este dispositivo: crea una cuenta gratuita para no perder nada.",\n      cta: "Guardar mi progreso",\n      later: "Más tarde",\n      reassurance: "Gratis · 30 segundos · Con Google o correo"\n    },');
  fixFile(TRF, "T4-ar-saveprompt",
    'continueGuest: "الاستمرار كضيف", google: "الاستمرار مع جوجل"\n    },',
    'continueGuest: "الاستمرار كضيف", google: "الاستمرار مع جوجل",\n      headerLogin: "تسجيل الدخول", checkEmail: "تم إنشاء الحساب. أكّد بريدك الإلكتروني عبر الرسالة التي أرسلناها للتو، ثم عد إلى هنا: سيتم حفظ تقدّمك."\n    },\n    savePrompt: {\n      title: "لا تفقد تقدّمك",\n      body: "أنشئ حسابك المجاني للاحتفاظ بنقاط XP وسلسلة أيامك، والمتابعة على أي جهاز.",\n      reminderTitle: "تقدّمك غير محفوظ بعد",\n      reminderBody: "لديك بالفعل {xp} XP و{lessons} دروس مكتملة. إنها محفوظة على هذا الجهاز فقط: أنشئ حسابًا مجانيًا حتى لا تفقد شيئًا.",\n      cta: "احفظ تقدّمي",\n      later: "لاحقًا",\n      reassurance: "مجاني · 30 ثانية · عبر جوجل أو البريد الإلكتروني"\n    },');
}

// ---- PART 3: dumps + verify (only when DUMP_MODE=on, i.e. main runs) ----
const DUMP_MODE = (process.env.DUMP_MODE || "on") === "on";
report.push("DUMP_MODE: " + (DUMP_MODE ? "on" : "off"));
if (DUMP_MODE) {
  const s2 = fs.readFileSync(P, "utf8");
  const lines = s2.split("\n");
  const CH = 400;
  for (let c = 0; c * CH < lines.length; c++) {
    const chunk = lines.slice(c * CH, (c + 1) * CH)
      .map((l, i) => String(c * CH + i + 1).padStart(4, "0") + "|" + l).join("\n");
    fs.writeFileSync("docs/dump-" + (c + 1) + ".txt", chunk);
  }
  fs.writeFileSync("docs/verify.json", report.join("\n"));
}
console.log("applied=" + applied);
console.log(report.join("\n"));

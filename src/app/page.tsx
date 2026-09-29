'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  Flame,
  Globe,
  Headphones,
  Heart,
  Home as HomeIcon,
  Languages,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircle,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Volume2,
  X,
  Crown,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppStore, useTranslation } from "@/store/useAppStore";

const tr = (fr: string, en: string, es: string, ar: string) => {
  const lang = useAppStore.getState().uiLanguage;
  return lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;
};

const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>
  lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;
import { playAudio } from "@/lib/audio";
import { getDateLocale } from "@/lib/i18n/utils";
import { supabase } from "@/lib/supabase";
import { syncService } from "@/lib/syncService";
import { useCheckpointProgress } from "@/hooks/useCheckpointProgress";
import CheckpointModal from "@/components/checkpoint/CheckpointModal";
import ScenarioSelectorModal from "@/components/dialogue/ScenarioSelectorModal";
import AiRoleplayView from "@/components/dialogue/AiRoleplayView";
import PaywallModal from "@/components/monetization/PaywallModal";
import InstallPwaBanner from "@/components/pwa/InstallPwaBanner";
import DarijaPassportCard from "@/components/certificate/DarijaPassportCard";
import { PersonaId } from "@/lib/ai/prompts";
import { srsVocabulary } from "@/data/srs-deck";
import { track } from "@/lib/tracking";
import { useAuthUser } from "@/lib/useAuthUser";
import { dismissSavePrompt, getSavePromptVariant } from "@/lib/savePrompt";
import AuthModal from "@/components/auth/AuthModal";
import SaveProgressCard from "@/components/auth/SaveProgressCard";

export type View = "today" | "path" | "phrases" | "review" | "space";

export type Question = {
  prompt: string;
  helper: string;
  options: string[];
  answer: string;
  note: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  length: string;
  status: "done" | "current" | "locked";
  isPremium?: boolean;
  questions: Question[];
};

export type Phrase = {
  id: string;
  category: string;
  darija: string;
  arabic: string;
  meaning: string;
  note: string;
};

const buildLessons = (lang: string): Lesson[] => [
  {
    id: "hello",
    title: trL(lang, tr("Les premiers bonjours", "The first hellos", "Los primeros saludos", "أول التحيات"), "The first hellos", "Los primeros saludos", "أول التحيات"),
    subtitle: trL(lang, tr("Saluer, se présenter, créer le lien", "Greet, introduce yourself, connect", "Saludar, presentarse, crear el vínculo", "التحية والتعاريف وبناء الرابط"), "Greet, introduce yourself, connect", "Saludar, presentarse, crear el vínculo", "التحية والتعاريف وبناء الرابط"),
    length: "6 min",
    status: "current",
    questions: [
      {
        prompt: trL(lang, tr("Comment dit-on « bonjour » en darija ?", "How do you say « hello » in darija?", "¿Cómo se dice «hola» en darija?", "كيف نقول «مرحبا» بالدارجة؟"), "How do you say « hello » in darija?", "¿Cómo se dice «hola» en darija?", "كيف نقول «مرحبا» بالدارجة؟"),
        helper: trL(lang, tr("Choisis la formule la plus naturelle.", "Choose the most natural phrase.", "Elige la fórmula más natural.", "اختر الصيغة الأكثر طبيعية."), "Choose the most natural phrase.", "Elige la fórmula más natural.", "اختر الصيغة الأكثر طبيعية."),
        options: ["Salam", "Shukran", "Bslama"],
        answer: "Salam",
        note: trL(lang, tr("« Salam » veut dire paix. C’est le bonjour simple, chaleureux et passe-partout.", "« Salam » means peace. The simple, warm, all-purpose hello.", "« Salam » significa paz. Es el saludo simple, cálido y universal.", "«سلام» تعني السلام. تحية بسيطة دافئة تصلح لكل مناسبة."), "« Salam » means peace. The simple, warm, all-purpose hello.", "« Salam » significa paz. Es el saludo simple, cálido y universal.", "«سلام» تعني السلام. تحية بسيطة دافئة تصلح لكل مناسبة."),
      },
      {
        prompt: trL(lang, tr("Tu rencontres quelqu’un pour la première fois. Que dis-tu ?", "You meet someone for the first time. What do you say?", "Conoces a alguien por primera vez. ¿Qué dices?", "تقابل شخصاً لأول مرة. ماذا تقول؟"), "You meet someone for the first time. What do you say?", "Conoces a alguien por primera vez. ¿Qué dices?", "تقابل شخصاً لأول مرة. ماذا تقول؟"),
        helper: trL(lang, tr("Pense à une formule de bienvenue.", "Think of a welcoming phrase.", "Piensa en una fórmula de bienvenida.", "فكر في صيغة ترحيب."), "Think of a welcoming phrase.", "Piensa en una fórmula de bienvenida.", "فكر في صيغة ترحيب."),
        options: ["Labas?", "Tsharrafna", "Afak"],
        answer: "Tsharrafna",
        note: trL(lang, tr("« Tsharrafna » signifie littéralement « enchanté·e ». Une belle façon de faire connaissance.", "« Tsharrafna » literally means « delighted to meet you ». A lovely way to connect.", "« Tsharrafna » significa literalmente «encantado». Una bonita forma de conocerse.", "«تشرفنا» تعني حرفياً «تشرّفت بلقائك». طريقة جميلة للتعارف."), "« Tsharrafna » literally means « delighted to meet you ». A lovely way to connect.", "« Tsharrafna » significa literalmente «encantado». Una bonita forma de conocerse.", "«تشرفنا» تعني حرفياً «تشرّفت بلقائك». طريقة جميلة للتعارف."),
      },
      {
        prompt: trL(lang, tr("Que signifie « labas? »", "What does « labas? » mean?", "¿Qué significa « labas? »?", "ماذا تعني «لاباس؟»"), "What does « labas? » mean?", "¿Qué significa « labas? »?", "ماذا تعني «لاباس؟»"),
        helper: trL(lang, tr("Une question qu’on entend partout.", "A question you hear everywhere.", "Una pregunta que se oye por todas partes.", "سؤال تسمعه في كل مكان."), "A question you hear everywhere.", "Una pregunta que se oye por todas partes.", "سؤال تسمعه في كل مكان."),
        options: [trL(lang, tr("Où vas-tu ?", "Where are you going?", "¿Adónde vas?", "إلى أين تذهب؟"), "Where are you going?", "¿Adónde vas?", "إلى أين تذهب؟")],
        answer: trL(lang, tr("Ça va ?", "How are you?", "¿Qué tal?", "كيف حالك؟"), "How are you?", "¿Qué tal?", "كيف حالك؟"),
        note: trL(lang, tr("« Labas? » est le petit « ça va ? » du quotidien. On répond souvent « labas, hamdullah ».", "« Labas? » is the everyday « how are you? ». People often reply « labas, hamdullah ».", "« Labas? » es el «¿qué tal?» del día a día. Suele responderse «labas, hamdullah».", "«لاباس؟» هي «كيف حالك؟» اليومية. غالباً يُجاب «لاباس، الحمد لله»."), "« Labas? » is the everyday « how are you? ». People often reply « labas, hamdullah ».", "« Labas? » es el «¿qué tal?» del día a día. Suele responderse «labas, hamdullah».", "«لاباس؟» هي «كيف حالك؟» اليومية. غالباً يُجاب «لاباس، الحمد لله»."),
      },
    ],
  },
  {
    id: "cafe",
    title: trL(lang, tr("Au café du coin", "At the corner café", "En el café de la esquina", "في مقهى الحي"), "At the corner café", "En el café de la esquina", "في مقهى الحي"),
    subtitle: trL(lang, tr("Commander un thé à la menthe", "Ordering a mint tea", "Pedir un té a la menta", "طلب شاي بالنعناع"), "Ordering a mint tea", "Pedir un té a la menta", "طلب شاي بالنعناع"),
    length: "8 min",
    status: "locked",
    questions: [
      {
        prompt: trL(lang, tr("Comment demander un thé, s’il vous plaît ?", "How do you ask for a tea, please?", "¿Cómo pedir un té, por favor?", "كيف تطلب شاياً، من فضلك؟"), "How do you ask for a tea, please?", "¿Cómo pedir un té, por favor?", "كيف تطلب شاياً، من فضلك؟"),
        helper: trL(lang, tr("Une formule utile au café.", "A handy phrase at the café.", "Una fórmula útil en el café.", "صيغة مفيدة في المقهى."), "A handy phrase at the café.", "Una fórmula útil en el café.", "صيغة مفيدة في المقهى."),
        options: ["Atay, afak", "Fin ghadi?", "Smah liya"],
        answer: "Atay, afak",
        note: trL(lang, tr("« Atay, afak » : un thé, s’il vous plaît. « Afak » ajoute la politesse.", "« Atay, afak »: a tea, please. « Afak » adds politeness.", "« Atay, afak »: un té, por favor. « Afak » añade cortesía.", "«أتاي، عفاك»: شاي من فضلك. «عفاك» تضيف اللطف."), "« Atay, afak »: a tea, please. « Afak » adds politeness.", "« Atay, afak »: un té, por favor. « Afak » añade cortesía.", "«أتاي، عفاك»: شاي من فضلك. «عفاك» تضيف اللطف."),
      },
      {
        prompt: trL(lang, tr("Qu’est-ce que « bghit » veut dire ?", "What does « bghit » mean?", "¿Qué significa « bghit »?", "ماذا تعني «بغيت»؟"), "What does « bghit » mean?", "¿Qué significa « bghit »?", "ماذا تعني «بغيت»؟"),
        helper: trL(lang, tr("Un mot très pratique pour commander.", "A very handy word for ordering.", "Una palabra muy práctica para pedir.", "كلمة عملية جداً للطلب."), "A very handy word for ordering.", "Una palabra muy práctica para pedir.", "كلمة عملية جداً للطلب."),
        options: [trL(lang, tr("Je voudrais", "I would like", "Quisiera", "أريد"), "I would like", "Quisiera", "أريد")],
        answer: trL(lang, tr("Je voudrais", "I would like", "Quisiera", "أريد"), "I would like", "Quisiera", "أريد"),
        note: trL(lang, tr("« Bghit » veut dire « je veux » ou « je voudrais », selon le contexte.", "« Bghit » means « I want » or « I would like », depending on context.", "« Bghit » significa «quiero» o «quisiera», según el contexto.", "«بغيت» تعني «أريد» حسب السياق."), "« Bghit » means « I want » or « I would like », depending on context.", "« Bghit » significa «quiero» o «quisiera», según el contexto.", "«بغيت» تعني «أريد» حسب السياق."),
      },
    ],
  },
  {
    id: "medina",
    title: trL(lang, tr("Se repérer dans la médina", "Finding your way in the medina", "Orientarse en la medina", "التعرف على طريقك في المدينة القديمة"), "Finding your way in the medina", "Orientarse en la medina", "التعرف على طريقك في المدينة القديمة"),
    subtitle: trL(lang, tr("Demander son chemin sans stress", "Asking for directions, stress-free", "Preguntar el camino sin estrés", "اسأل عن الطريق بلا توتر"), "Asking for directions, stress-free", "Preguntar el camino sin estrés", "اسأل عن الطريق بلا توتر"),
    length: "7 min",
    status: "locked",
    questions: [
      {
        prompt: trL(lang, tr("Comment demander « où est… ? »", "How to ask « where is…? »", "Cómo preguntar «¿dónde está…?»", "كيف تسأل «أين يوجد…؟»"), "How to ask « where is…? »", "Cómo preguntar «¿dónde está…?»", "كيف تسأل «أين يوجد…؟»"),
        helper: trL(lang, tr("La phrase qui débloque une promenade.", "The phrase that unlocks a stroll.", "La frase que desbloquea un paseo.", "العبارة التي تفتح لك التنزه."), "The phrase that unlocks a stroll.", "La frase que desbloquea un paseo.", "العبارة التي تفتح لك التنزه."),
        options: ["Fin kayn…?", "Chhal hadi?", "Mumkin…?"],
        answer: "Fin kayn…?",
        note: trL(lang, tr("« Fin kayn…? » signifie « où se trouve… ? ». Ajoute le lieu que tu cherches.", "« Fin kayn…? » means « where is…? ». Add the place you’re looking for.", "« Fin kayn…? » significa «¿dónde está…?». Añade el lugar que buscas.", "«فين كاين…؟» تعني «أين يوجد…؟». أضف المكان الذي تبحث عنه."), "« Fin kayn…? » means « where is…? ». Add the place you’re looking for.", "« Fin kayn…? » significa «¿dónde está…?». Añade el lugar que buscas.", "«فين كاين…؟» تعني «أين يوجد…؟». أضف المكان الذي تبحث عنه."),
      },
      {
        prompt: trL(lang, tr("Que signifie « yallah » ?", "What does « yallah » mean?", "¿Qué significa « yallah »?", "ماذا تعني «يللاه»؟"), "What does « yallah » mean?", "¿Qué significa « yallah »?", "ماذا تعني «يللاه»؟"),
        helper: trL(lang, tr("Un mot qu’on entend souvent.", "A word you hear often.", "Una palabra que se oye a menudo.", "كلمة تُسمع كثيراً."), "A word you hear often.", "Una palabra que se oye a menudo.", "كلمة تُسمع كثيراً."),
        options: [trL(lang, tr("Allons-y", "Let’s go", "Vamos", "هيا بنا"), "Let’s go", "Vamos", "هيا بنا"), "Merci beaucoup"],
        answer: trL(lang, tr("Allons-y", "Let’s go", "Vamos", "هيا بنا"), "Let’s go", "Vamos", "هيا بنا"),
        note: trL(lang, tr("« Yallah » invite à partir, à avancer, ou simplement à se lancer.", "« Yallah » invites you to leave, move, or simply dive in.", "« Yallah » invita a partir, avanzar o simplemente lanzarse.", "«يللاه» دعوة للانطلاق والتقدم أو البدء."), "« Yallah » invites you to leave, move, or simply dive in.", "« Yallah » invita a partir, avanzar o simplemente lanzarse.", "«يللاه» دعوة للانطلاق والتقدم أو البدء."),
      },
    ],
  },
  {
    id: "marrakech",
    title: trL(lang, tr("Négocier au souk de Marrakech", "Bargaining at the Marrakech souk", "Regatear en el souk de Marrakech", "المفاوضة في سوق مراكش"), "Bargaining at the Marrakech souk", "Regatear en el souk de Marrakech", "المفاوضة في سوق مراكش"),
    subtitle: trL(lang, tr("Les nombres et les prix (Niveau A2)", "Numbers and prices (Level A2)", "Números y precios (Nivel A2)", "الأرقام والأسعار (مستوى A2)"), "Numbers and prices (Level A2)", "Números y precios (Nivel A2)", "الأرقام والأسعار (مستوى A2)"),
    length: "9 min",
    status: "locked",
    isPremium: true,
    questions: [
      {
        prompt: trL(lang, tr("Comment demander « Combien coûte ceci ? »", "How to ask « How much is this? »", "Cómo preguntar «¿Cuánto cuesta esto?»", "كيف تسأل «بشحال هادا؟»"), "How to ask « How much is this? »", "Cómo preguntar «¿Cuánto cuesta esto?»", "كيف تسأل «بشحال هادا؟»"),
        helper: trL(lang, tr("Expression clé pour entamer la discussion.", "Key phrase to start the conversation.", "Expresión clave para entablar la conversación.", "عبارة مفتاحية لبدء الحوار."), "Key phrase to start the conversation.", "Expresión clave para entablar la conversación.", "عبارة مفتاحية لبدء الحوار."),
        options: ["Bchhal hada?", "Fin mchiti?", "Labas 3lik?"],
        answer: "Bchhal hada?",
        note: tr("« Bchhal hada? » permet de demander le prix de n'importe quel article.", "« Bchhal hada? » lets you ask the price of any item.", "« Bchhal hada? » permite preguntar el precio de cualquier artículo.", "«بشحال هادا؟» تمكنك من السؤال عن سعر أي سلعة."),
      },
      {
        prompt: trL(lang, tr("Que veut dire « Naqas chwiya 3afak » ?", "What does « Naqas chwiya 3afak » mean?", "¿Qué significa « Naqas chwiya 3afak »?", "ماذا تعني «نقّص شوية عفاك»؟"), "What does « Naqas chwiya 3afak » mean?", "¿Qué significa « Naqas chwiya 3afak »?", "ماذا تعني «نقّص شوية عفاك»؟"),
        helper: trL(lang, tr("La formule cordiale de marchandage.", "The friendly way to bargain.", "La fórmula cordial del regateo.", "الصيغة الودية للمساومة."), "The friendly way to bargain.", "La fórmula cordial del regateo.", "الصيغة الودية للمساومة."),
        options: [trL(lang, tr("Baisse un peu s'il te plaît", "Lower it a bit, please", "Baja un poco, por favor", "خفّض قليلاً من فضلك"), "Lower it a bit, please", "Baja un poco, por favor", "خفّض قليلاً من فضلك")],
        answer: trL(lang, tr("Baisse un peu s'il te plaît", "Lower it a bit, please", "Baja un poco, por favor", "خفّض قليلاً من فضلك"), "Lower it a bit, please", "Baja un poco, por favor", "خفّض قليلاً من فضلك"),
        note: trL(lang, tr("« Naqas chwiya » = réduis un peu. Utilisé avec le sourire !", "« Naqas chwiya » = cut it down a bit. Used with a smile!", "« Naqas chwiya » = reduce un poco. ¡Se usa con una sonrisa!", "«نقّص شوية» = خفّض قليلاً. تُقال بابتسامة!"), "« Naqas chwiya » = cut it down a bit. Used with a smile!", "« Naqas chwiya » = reduce un poco. ¡Se usa con una sonrisa!", "«نقّص شوية» = خفّض قليلاً. تُقال بابتسامة!"),
      },
    ],
  },
  {
    id: "tanger",
    title: trL(lang, tr("Voyage à Tanger (Chamali)", "Trip to Tangier (Chamali)", "Viaje a Tánger (Chamali)", "رحلة إلى طنجة (الشمالي)"), "Trip to Tangier (Chamali)", "Viaje a Tánger (Chamali)", "رحلة إلى طنجة (الشمالي)"),
    subtitle: trL(lang, tr("Les subtilités régionales (Niveau B2)", "Regional subtleties (Level B2)", "Sutilezas regionales (Nivel B2)", "الفروق الإقليمية (مستوى B2)"), "Regional subtleties (Level B2)", "Sutilezas regionales (Nivel B2)", "الفروق الإقليمية (مستوى B2)"),
    length: "10 min",
    status: "locked",
    isPremium: true,
    questions: [
      {
        prompt: trL(lang, tr("À Tanger, comment dit-on « Qu'est-ce que tu veux ? »", "In Tangier, how do you say « What do you want? »", "En Tánger, ¿cómo se dice «¿Qué quieres?»", "في طنجة، كيف تقول «ماذا تريد؟»"), "In Tangier, how do you say « What do you want? »", "En Tánger, ¿cómo se dice «¿Qué quieres?»", "في طنجة، كيف تقول «ماذا تريد؟»"),
        helper: trL(lang, tr("Remplace le standard « Chno bghiti ».", "Replaces the standard « Chno bghiti ».", "Sustituye al estándar « Chno bghiti ».", "تعوض الصيغة القياسية «شنو بغيتي»."), "Replaces the standard « Chno bghiti ».", "Sustituye al estándar « Chno bghiti ».", "تعوض الصيغة القياسية «شنو بغيتي»."),
        options: ["Chni katchof?", "Chni katsaksi?", "Chni khassek?"],
        answer: "Chni khassek?",
        note: trL(lang, tr("Dans le nord (Chamali), on utilise « Chni » au lieu de « Chno ».", "In the north (Chamali), people use « Chni » instead of « Chno ».", "En el norte (Chamali), se usa « Chni » en lugar de « Chno ».", "في الشمال (الشمالي) يُستخدم «شني» بدل «شنو»."), "In the north (Chamali), people use « Chni » instead of « Chno ».", "En el norte (Chamali), se usa « Chni » en lugar de « Chno ».", "في الشمال (الشمالي) يُستخدم «شني» بدل «شنو»."),
      },
    ],
  },
];

const buildPhrases = (lang: string): Phrase[] => [
  { id: "salam", category: trL(lang, tr("Saluer", "Greeting", "Saludar", "التحية"), "Greeting", "Saludar", "التحية"), darija: "Salam, labas?", arabic: "سلام، لاباس؟", meaning: trL(lang, tr("Salut, ça va ?", "Hi, how are you?", "Hola, ¿qué tal?", "مرحبا، كيف حالك؟"), "Hi, how are you?", "Hola, ¿qué tal?", "مرحبا، كيف حالك؟"), note: trL(lang, tr("La formule la plus simple pour ouvrir une conversation.", "The simplest way to open a conversation.", "La fórmula más simple para abrir una conversación.", "أبسط صيغة لبدء أي حديث."), "The simplest way to open a conversation.", "La fórmula más simple para abrir una conversación.", "أبسط صيغة لبدء أي حديث.") },
  { id: "bikhir", category: trL(lang, tr("Saluer", "Greeting", "Saludar", "التحية"), "Greeting", "Saludar", "التحية"), darija: "Labas, hamdullah.", arabic: "لاباس، الحمد لله.", meaning: trL(lang, tr("Ça va, merci / Dieu merci.", "Fine, thanks / Thank God.", "Bien, gracias / Gracias a Dios.", "بخير، الحمد لله."), "Fine, thanks / Thank God.", "Bien, gracias / Gracias a Dios.", "بخير، الحمد لله."), note: trL(lang, tr("La réponse classique à « labas? ».", "The classic reply to « labas? ».", "La respuesta clásica a « labas? ».", "الرد المألوف على «لاباس؟»."), "The classic reply to « labas? ».", "La respuesta clásica a « labas? ».", "الرد المألوف على «لاباس؟».") },
  { id: "afak", category: trL(lang, tr("Au café", "At the café", "En el café", "في المقهى"), "At the café", "En el café", "في المقهى"), darija: "Wahed atay, afak.", arabic: "واحد أتاي، عفاك.", meaning: trL(lang, tr("Un thé, s’il vous plaît.", "A tea, please.", "Un té, por favor.", "شاي من فضلك."), "A tea, please.", "Un té, por favor.", "شاي من فضلك."), note: tr("« Wahed » = un, « atay » = thé, « afak » = s’il te plaît.", "« Wahed » = one, « atay » = tea, « afak » = please.", "« Wahed » = uno, « atay » = té, « afak » = por favor.", "«واحد» = واحد، «أتاي» = شاي، «عفاك» = من فضلك.") },
  { id: "bghit", category: trL(lang, tr("Au café", "At the café", "En el café", "في المقهى"), "At the café", "En el café", "في المقهى"), darija: "Bghit lma, afak.", arabic: "بغيت الما، عفاك.", meaning: trL(lang, tr("Je voudrais de l’eau, s’il vous plaît.", "I’d like some water, please.", "Quisiera agua, por favor.", "أريد ماءً، من فضلك."), "I’d like some water, please.", "Quisiera agua, por favor.", "أريد ماءً، من فضلك."), note: trL(lang, tr("Remplace « lma » par ce que tu aimerais commander.", "Replace « lma » with whatever you’d like to order.", "Sustituye « lma » por lo que quieras pedir.", "استبدل «لما» بما تود طلبه."), "Replace « lma » with whatever you’d like to order.", "Sustituye « lma » por lo que quieras pedir.", "استبدل «لما» بما تود طلبه.") },
  { id: "fin", category: trL(lang, tr("Se déplacer", "Getting around", "Desplazarse", "التنقل"), "Getting around", "Desplazarse", "التنقل"), darija: "Fin kayn souk?", arabic: "فين كاين السوق؟", meaning: trL(lang, tr("Où est le souk ?", "Where is the souk?", "¿dónde está el souk?", "أين السوق؟"), "Where is the souk?", "¿dónde está el souk?", "أين السوق؟"), note: trL(lang, tr("Utilise cette structure pour demander un lieu.", "Use this structure to ask for a place.", "Usa esta estructura para preguntar por un lugar.", "استخدم هذه الصيغة لسؤال عن مكان."), "Use this structure to ask for a place.", "Usa esta estructura para preguntar por un lugar.", "استخدم هذه الصيغة لسؤال عن مكان.") },
  { id: "shukran", category: trL(lang, tr("Les essentiels", "Essentials", "Lo esencial", "الأساسيات"), "Essentials", "Lo esencial", "الأساسيات"), darija: "Shukran bzaf!", arabic: "شكرا بزاف!", meaning: trL(lang, tr("Merci beaucoup !", "Thank you very much!", "¡Muchas gracias!", "شكراً جزيلاً!"), "Thank you very much!", "¡Muchas gracias!", "شكراً جزيلاً!"), note: trL(lang, tr("« Bzaf » signifie beaucoup — un mot qui sert partout.", "« Bzaf » means a lot — a word useful everywhere.", "« Bzaf » significa mucho — una palabra útil en todo.", "«بزاف» تعني كثيراً — كلمة تفيد في كل مكان."), "« Bzaf » means a lot — a word useful everywhere.", "« Bzaf » significa mucho — una palabra útil en todo.", "«بزاف» تعني كثيراً — كلمة تفيد في كل مكان.") },
  { id: "smah", category: trL(lang, tr("Les essentiels", "Essentials", "Lo esencial", "الأساسيات"), "Essentials", "Lo esencial", "الأساسيات"), darija: "Smah liya.", arabic: "سمح ليا.", meaning: trL(lang, tr("Excuse-moi / pardon.", "Excuse me / sorry.", "Disculpa / perdón.", "المامعة / عفواً."), "Excuse me / sorry.", "Disculpa / perdón.", "المامعة / عفواً."), note: trL(lang, tr("Pour attirer l’attention ou demander pardon, avec douceur.", "To catch attention or apologize, gently.", "Para llamar la atención o pedir perdón, con dulzura.", "للتنبيه أو طلب العفو، بلطف."), "To catch attention or apologize, gently.", "Para llamar la atención o pedir perdón, con dulzura.", "للتنبيه أو طلب العفو، بلطف.") },
  { id: "bslama", category: trL(lang, tr("Saluer", "Greeting", "Saludar", "التحية"), "Greeting", "Saludar", "التحية"), darija: "Bslama, nshawfek.", arabic: "بسلامة، نشوفك.", meaning: tr("Au revoir, à bientôt.", "Goodbye, see you soon.", "Adiós, hasta pronto.", "إلى اللقاء، أراك قريباً."), note: trL(lang, tr("Une façon amicale de prendre congé.", "A friendly way to say goodbye.", "Una manera amable de despedirse.", "طريقة ودية للوداع."), "A friendly way to say goodbye.", "Una manera amable de despedirse.", "طريقة ودية للوداع.") },
];

const buildNavItems = (lang: string): { id: View; label: string; icon: LucideIcon }[] => [
  { id: "today", label: trL(lang, "Aujourd’hui", "Today", "Hoy", "اليوم"), icon: HomeIcon },
  { id: "path", label: trL(lang, "Mon parcours", "My journey", "Mi ruta", "مساري"), icon: Compass },
  { id: "phrases", label: trL(lang, "Carnet de phrases", "Phrasebook", "Mis frases", "دفتر العبارات"), icon: Bookmark },
  { id: "review", label: trL(lang, tr("Révision du jour", "Today’s review", "Revisión del día", "مراجعة اليوم"), "Today’s review", "Revisión del día", "مراجعة اليوم"), icon: Sparkles },
];

function useLocalizedContent() {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const lang = uiLanguage || "fr";
  const lessons = useMemo(() => buildLessons(lang), [lang]);
  const phrases = useMemo(() => buildPhrases(lang), [lang]);
  const navItems = useMemo(() => buildNavItems(lang), [lang]);
  return { lang, lessons, phrases, navItems };
}

export default function Home() {
  const [view, setView] = useState<View>("today");
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [savePromptHidden, setSavePromptHidden] = useState(false);
  const [lessonJustDone, setLessonJustDone] = useState(false);
  const [category, setCategory] = useState("__all__");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("kenza_favorites");
      const parsed = stored ? JSON.parse(stored) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [reviewIndex, setReviewIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (message: string) => setToast(message);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevView, setPrevView] = useState<View>(view);
  if (prevView !== view) {
    setPrevView(view);
    setMobileMenuOpen(false);
  }
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Zustand Store Integration
  const {
    xp,
    streakDays,
    completedLessons,
    addXp,
    completeLesson,
    user,
    setUser,
    resetData,
    soundEnabled,
    toggleSound,
    isPremium,
    setIsPremium,
    uiLanguage,
    setLanguage,
  } = useAppStore();

  const { t } = useTranslation();
  const { isGuest } = useAuthUser();
  const { lang, lessons, phrases, navItems } = useLocalizedContent();
  const navLabel = (id: string) => {
    const key =
      id === "today" ? "home"
      : id === "path" ? "parcours"
      : id === "phrases" ? "phrasebook"
      : id === "review" ? "review"
      : null;
    return key ? ((t as any).side?.[key] as string | undefined) : undefined;
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch {
      showToast(t.modules.home.googleError);
    }
  };

  const [checkpointOpen, setCheckpointOpen] = useState<{ id: string; name: string } | null>(null);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(null);
  const [pricingSource, setPricingSource] = useState<string | null>(null);

  const saveFavorites = (next: string[]) => {
    const safeNext = Array.isArray(next) ? next : [];
    setFavorites(safeNext);
    try {
      localStorage.setItem("kenza_favorites", JSON.stringify(safeNext));
    } catch {}
  };

  const safeFavorites = useMemo(() => {
    return Array.isArray(favorites) ? favorites : [];
  }, [favorites]);

  // Auth sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await syncService.syncCloudToLocal(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        resetData();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, resetData]);

  // Check URL params (e.g. Stripe callback)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("upgrade") !== "success") return;
    const timer = window.setTimeout(() => {
      setIsPremium(true);
      showToast(t.modules.home.proActivated);
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [setIsPremium, showToast, t]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setView("phrases");
        window.setTimeout(() => searchInputRef.current?.focus(), 60);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Chaque vue est suivie comme une page virtuelle (funnel)
  useEffect(() => {
    track("page_view", { view }, `/${view}`);
  }, [view]);

  // 2. Adaptateur universel pour les phrases (Format Manus ↔ Format KENZA)
  const allPhrases: Phrase[] = useMemo(() => {
    const rawVocabulary = (srsVocabulary || []).slice(0, 40).map((w, idx) => {
      let meaningText = tr("Expression en darija", "Darija expression", "Expresión en darija", "عبارة بالدارجة");
      if (typeof (w as any).translation === "string") {
        meaningText = (w as any).translation;
      } else if ((w as any).translation && typeof (w as any).translation === "object") {
        meaningText = (w as any).translation.fr || (w as any).translation.en || tr("Expression en darija", "Darija expression", "Expresión en darija", "عبارة بالدارجة");
      } else if ((w as any).translations?.fr) {
        meaningText = (w as any).translations.fr;
      } else if (typeof (w as any).back === "string") {
        meaningText = (w as any).back;
      }

      let cat = trL(lang, tr("Les essentiels", "Essentials", "Lo esencial", "الأساسيات"), "Essentials", "Lo esencial", "الأساسيات");
      if (w.category === "polite_social") cat = trL(lang, tr("Saluer", "Greeting", "Saludar", "التحية"), "Greeting", "Saludar", "التحية");
      else if (w.category === "food_drink") cat = trL(lang, tr("Au café", "At the café", "En el café", "في المقهى"), "At the café", "En el café", "في المقهى");
      else if (w.category === "directions") cat = trL(lang, tr("Se déplacer", "Getting around", "Desplazarse", "التنقل"), "Getting around", "Desplazarse", "التنقل");
      else if (w.category) cat = w.category;

      return {
        id: w.id || `vocab_${idx}`,
        category: cat,
        darija: w.arabizi || (w as any).front || "",
        arabic: w.arabic || "",
        meaning: meaningText,
        note: (w.example?.arabizi ? `Ex: ${w.example.arabizi}` : "") || tr("Vocabulaire du quotidien avec audio naturel.", "Everyday vocabulary with natural audio.", "Vocabulario cotidiano con audio natural.", "مفردات يومية بصوت طبيعي."),
      };
    });

    const combined: any[] = [...phrases];
    for (const v of rawVocabulary) {
      if (v.darija && !combined.some((p) => (p.darija || p.front || "").toLowerCase() === (v.darija || "").toLowerCase())) {
        combined.push(v);
      }
    }

    return combined.map((p, idx) => {
      let meaningStr = tr("Expression en darija", "Darija expression", "Expresión en darija", "عبارة بالدارجة");
      if (typeof p.meaning === "string") {
        meaningStr = p.meaning;
      } else if (p.meaning && typeof p.meaning === "object") {
        meaningStr = p.meaning.fr || p.meaning.en || "";
      } else if (typeof p.back === "string") {
        meaningStr = p.back;
      } else if (p.back && typeof p.back === "object") {
        meaningStr = p.back.fr || p.back.en || "";
      } else if (p.translation) {
        meaningStr = typeof p.translation === "string" ? p.translation : p.translation.fr || p.translation.en || "";
      }

      return {
        id: String(p.id || `phrase_${idx}`),
        category: String(p.category || trL(lang, tr("Les essentiels", "Essentials", "Lo esencial", "الأساسيات"), "Essentials", "Lo esencial", "الأساسيات")),
        darija: String(p.darija || p.front || p.arabizi || ""),
        arabic: String(p.arabic || ""),
        meaning: String(meaningStr || tr("Expression en darija", "Darija expression", "Expresión en darija", "عبارة بالدارجة")),
        note: String(p.note || p.notes || ""),
      };
    });
  }, [phrases, lang]);

  const completedCount = completedLessons.length;
  const nextLesson =
    lessons.find((lesson) => !completedLessons.includes(lesson.id)) ??
    lessons[lessons.length - 1];
  const activeLesson = lessons.find((lesson) => lesson.id === lessonId) ?? null;
  const activeQuestion = activeLesson?.questions[questionIndex] ?? null;

  // 4. Sécurisation de la liste des catégories
  const categories = useMemo(() => {
    return ["__all__", ...Array.from(new Set(allPhrases.map((phrase) => phrase.category).filter(Boolean)))];
  }, [allPhrases]);

  // 3. Sécurisation de la recherche textuelle
  const filteredPhrases = useMemo(() => {
    const searchLower = (search || "").toLowerCase().trim();
    return allPhrases.filter((phrase) => {
      const matchesCategory = category === "__all__" || phrase.category === category;
      const searchTarget = `${phrase.darija || ""} ${phrase.arabic || ""} ${phrase.meaning || ""} ${phrase.category || ""}`.toLowerCase();
      const matchesSearch = !searchLower || searchTarget.includes(searchLower);
      const matchesFavorite = !favoritesOnly || safeFavorites.includes(phrase.id);
      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [category, search, favoritesOnly, safeFavorites, allPhrases]);


  const startLesson = (id: string) => {
    const lesson = lessons.find((item) => item.id === id);
    if (!lesson) return;

    // Premium gating check
    if (lesson.isPremium && !isPremium) {
      setPricingSource("module_locked");
      return;
    }

    const index = lessons.findIndex((item) => item.id === id);
    const canStart =
      index === 0 ||
      completedLessons.includes(lessons[index - 1].id) ||
      completedLessons.includes(id);

    if (!canStart) {
      showToast(trL(lang, "Termine la leçon précédente pour continuer ton parcours.", "Finish the previous lesson to continue your path.", "Termina la lección anterior para continuar tu recorrido.", "أكمل الدرس السابق لمواصلة مسارك."));
      return;
    }

    track("lesson_started", { lesson_id: id, is_first_lesson: completedLessons.length === 0 }, "/lesson");
    setSavePromptHidden(false);
    setLessonJustDone(false);
    setLessonId(id);
    setQuestionIndex(0);
    setSelectedAnswer(null);
  };

  const advanceQuestion = () => {
    if (!activeLesson || !activeQuestion || !selectedAnswer) return;
    if (questionIndex < activeLesson.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
      return;
    }

    const firstCompletion = !completedLessons.includes(activeLesson.id);
    if (firstCompletion) {
      track("lesson_completed", { lesson_id: activeLesson.id, lessons_completed_total: completedLessons.length + 1 }, "/lesson");
      setLessonJustDone(true);
      completeLesson(activeLesson.id);
      addXp(activeLesson.questions.length * 10);
    }

    setLessonId(null);
    setSelectedAnswer(null);
    showToast(
      firstCompletion
        ? trL(lang, `Bravo ! Leçon terminée · +${activeLesson.questions.length * 10} XP`, `Well done! Lesson complete · +${activeLesson.questions.length * 10} XP`, `¡Bravo! Lección completada · +${activeLesson.questions.length * 10} XP`, `أحسنت! أكملت الدرس · +${activeLesson.questions.length * 10} XP`)
        : trL(lang, "Leçon revue avec succès.", "Lesson reviewed successfully.", "Lección repasada con éxito.", "تمت مراجعة الدرس بنجاح.")
    );
  };

  const toggleFavorite = (id: string) => {
    const current = Array.isArray(favorites) ? favorites : [];
    const updated = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    saveFavorites(updated);
  };

  const playPhrase = (darija: string, arabic: string) => {
    if (!darija && !arabic) return;
    playAudio(darija || "", arabic || "", true);
    showToast(tr("Prononciation audio de la phrase.", "Natural voice pronunciation of the phrase.", "Pronunciación de voz natural de la frase.", "نطق صوتي طبيعي للعبارة."));
  };

  const copyPhrase = async (phrase: Phrase) => {
    try {
      const text = `${phrase.darija || ""} ${phrase.arabic ? `(${phrase.arabic})` : ""} — ${phrase.meaning || ""}`.trim();
      await navigator.clipboard.writeText(text);
      showToast(tr("Phrase copiée dans le presse-papiers.", "Phrase copied to clipboard.", "Frase copiada al portapapeles.", "تم نسخ العبارة إلى الحافظة."));
    } catch {
      showToast(tr("Copie indisponible.", "Copy unavailable.", "Copia no disponible.", "النسخ غير متاح."));
    }
  };

  const gradeReview = (grade: "again" | "hard" | "good" | "easy") => {
    const award = grade === "easy" ? 5 : grade === "good" ? 3 : grade === "hard" ? 2 : 1;
    addXp(award);
    setCardFlipped(false);
    setReviewIndex((current) => current + 1);
    showToast(
      `${t.modules.home.graded.replace("{grade}", grade === "again" ? t.modules.home.gradeAgain : grade === "hard" ? t.modules.home.gradeHard : grade === "good" ? t.modules.home.gradeGood : t.modules.home.gradeEasy)} · +${award} XP`
    );
  };

  const resetProgress = () => {
    const confirmed = window.confirm(t.modules.home.resetConfirm);
    if (!confirmed) return;
    resetData();
    localStorage.removeItem("kenza_favorites");
    setFavorites([]);
    showToast(t.modules.home.resetDone);
  };

  const switchView = (next: View) => {
    setView(next);
    setMobileMenuOpen(false);
  };

  const headerTitle: Record<View, { eyebrow: string; title: string; description: string }> = {
    today: {
      eyebrow: trL(lang, tr("TON ESPACE D’APPRENTISSAGE", "YOUR LEARNING SPACE", "TU ESPACIO DE APRENDIZAJE", "فضاء تعلمك"), "YOUR LEARNING SPACE", "TU ESPACIO DE APRENDIZAJE", "فضاء تعلمك"),
      title: trL(lang, tr("Salam, on s’y remet ?", "Salam, shall we get going?", "Salam, ¿retomamos?", "سلام، نكمل؟"), "Salam, shall we get going?", "Salam, ¿retomamos?", "سلام، نكمل؟"),
      description: trL(lang, tr("Un petit pas en darija aujourd’hui, une grande porte ouverte demain.", "A small step in darija today, a big door open tomorrow.", "Un pequeño paso en darija hoy, una gran puerta abierta mañana.", "خطوة صغيرة في الدارجة اليوم، وباب كبير مفتوح غداً."), "A small step in darija today, a big door open tomorrow.", "Un pequeño paso en darija hoy, una gran puerta abierta mañana.", "خطوة صغيرة في الدارجة اليوم، وباب كبير مفتوح غداً."),
    },
    path: {
      eyebrow: trL(lang, tr("LE CHEMIN SE FAIT EN PARLANT", "THE PATH IS MADE BY SPEAKING", "EL CAMINO SE HACE HABLANDO", "الطريق يُصنع بالكلام"), "THE PATH IS MADE BY SPEAKING", "EL CAMINO SE HACE HABLANDO", "الطريق يُصنع بالكلام"),
      title: trL(lang, tr("Ton parcours", "Your journey", "Tu recorrido", "مسارك"), "Your journey", "Tu recorrido", "مسارك"),
      description: trL(lang, tr("Des premiers mots aux conversations qui te ressemblent.", "From first words to conversations that feel like you.", "De las primeras palabras a conversaciones que te representen.", "من الكلمات الأولى إلى أحاديث تشبهك."), "From first words to conversations that feel like you.", "De las primeras palabras a conversaciones que te representen.", "من الكلمات الأولى إلى أحاديث تشبهك."),
    },
    phrases: {
      eyebrow: trL(lang, tr("LES MOTS QUI RAPPROCHENT", "WORDS THAT BRING US CLOSER", "PALABRAS QUE ACERCAN", "كلمات تُقرّب"), "WORDS THAT BRING US CLOSER", "PALABRAS QUE ACERCAN", "كلمات تُقرّب"),
      title: trL(lang, tr("Ton carnet de phrases", "Your phrase book", "Tu cuaderno de frases", "دفتر عباراتك"), "Your phrase book", "Tu cuaderno de frases", "دفتر عباراتك"),
      description: trL(lang, tr("Des expressions utiles, vivantes, prêtes à t’accompagner.", "Useful, lively expressions, ready to go with you.", "Expresiones útiles y vivas, listas para acompañarte.", "عبارات مفيدة حيّة، جاهزة لمرافقتك."), "Useful, lively expressions, ready to go with you.", "Expresiones útiles y vivas, listas para acompañarte.", "عبارات مفيدة حيّة، جاهزة لمرافقتك."),
    },
    review: {
      eyebrow: trL(lang, tr("ANCRER, SANS SE PRESSER", "ANCHOR IN, NO RUSH", "ANCLAR, SIN PRISA", "ترسيخ، بلا استعجال"), "ANCHOR IN, NO RUSH", "ANCLAR, SIN PRISA", "ترسيخ، بلا استعجال"),
      title: trL(lang, tr("Révision du jour", "Today’s review", "Revisión del día", "مراجعة اليوم"), "Today’s review", "Revisión del día", "مراجعة اليوم"),
      description: trL(lang, tr("Quelques cartes bien choisies pour laisser les mots s’installer.", "A few well-chosen cards to let the words settle.", "Algunas cartas bien elegidas para que las palabras se asienten.", "بعض البطاقات المنتقاة لتستقر الكلمات."), "A few well-chosen cards to let the words settle.", "Algunas cartas bien elegidas para que las palabras se asienten.", "بعض البطاقات المنتقاة لتستقر الكلمات."),
    },
    space: {
      eyebrow: trL(lang, tr("UN ESPACE À TOI", "A SPACE OF YOUR OWN", "UN ESPACIO PARA TI", "فضاء لك"), "A SPACE OF YOUR OWN", "UN ESPACIO PARA TI", "فضاء لك"),
      title: trL(lang, "Mon espace & Passeport", "My space & Passport", "Mi espacio y Pasaporte", "مساحتي وجواز السفر"),
      description: trL(lang, "Ta progression et tes visas officiels, sous ton contrôle.", "Your progress and official visas, under your control.", "Tu progreso y tus visados oficiales, bajo tu control.", "تقدمك وتأشيراتك الرسمية، تحت سيطرتك."),
    },
  };

  const currentHeader = headerTitle[view];

  // Invitation a sauvegarder la progression (invites uniquement) apres une lecon
  const savePromptVariant = isGuest && lessonJustDone && !savePromptHidden
    ? getSavePromptVariant(completedCount, streakDays)
    : null;

  return (
    <div className="app-shell">
      {/* Sidebar Desktop & Mobile Slideout */}
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <span>ك</span>
            <i />
          </div>
          <div>
            <span className="brand-name">KENZA</span>
            <span className="brand-tagline">{trL(lang, "la darija, en chemin", "darija, one step at a time", "la darija, paso a paso", "الدارجة، على الطريق")}</span>
          </div>
          <button
            className="icon-button mobile-close"
            aria-label={tr("Fermer le menu", "Close the menu", "Cerrar el menú", "إغلاق القائمة")}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-label">{(t as any).side?.learn || tr("APPRENDRE", "LEARN", "APRENDER", "تعلّم")}</div>
        <nav className="side-nav" aria-label={tr("Navigation principale", "Main navigation", "Navegación principal", "التنقل الرئيسي")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => switchView(item.id)}
                className={`nav-item ${view === item.id ? "nav-item-active" : ""}`}
                aria-current={view === item.id ? "page" : undefined}
              >
                <Icon size={19} strokeWidth={1.8} /> <span>{navLabel(item.id) || item.label}</span>
                {item.id === "review" && <span className="nav-count">4</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-label">{trL(lang, "EXPLORER", "EXPLORE", "EXPLORAR", "استكشف")}</div>
        <nav className="side-nav" aria-label={trL(lang, "Ressources d'étude", "Study resources", "Recursos de estudio", "موارد الدراسة")}>
          <a href="/etudier" className="nav-item">
            <span>{trL(lang, "Étudier — Modules complets", "Study — Full modules", "Estudiar — Módulos completos", "الدراسة — الوحدات الكاملة")}</span>
          </a>
          <a href="/grammaire" className="nav-item">
            <span>{trL(lang, "Grammaire active", "Active grammar", "Gramática activa", "القواعد النشطة")}</span>
          </a>
          <a href="/parler" className="nav-item">
            <span>{trL(lang, "Pratique orale", "Speaking practice", "Práctica oral", "تدريب النطق")}</span>
          </a>
          <a href="/revisions" className="nav-item">
            <span>{trL(lang, "Révisions SRS", "SRS review", "Repaso SRS", "مراجعة SRS")}</span>
          </a>
        </nav>

        <div className="sidebar-label sidebar-label-spaced">{(t as any).side?.oral || tr("PRATIQUE ORALE & IA", "SPEAKING & AI", "PRÁCTICA ORAL E IA", "المحادثة والذكاء الاصطناعي")}</div>
        <button
          onClick={() => setShowScenarioSelector(true)}
          className="nav-item"
        >
          <MessageCircle size={19} strokeWidth={1.8} />
          <span>{trL(lang, "Roleplay IA", "AI roleplay", "Roleplay IA", "حوار مع الذكاء الاصطناعي")}</span>
        </button>

        <div className="sidebar-label sidebar-label-spaced">{(t as any).side?.space || tr("TON ESPACE", "YOUR SPACE", "TU ESPACIO", "فضاؤك")}</div>
        <button
          onClick={() => switchView("space")}
          className={`nav-item ${view === "space" ? "nav-item-active" : ""}`}
          aria-current={view === "space" ? "page" : undefined}
        >
          <Award size={19} strokeWidth={1.8} />
          <span>{trL(lang, "Mon Passeport", "My passport", "Mi pasaporte", "جوازي")}</span>
        </button>

        <div className="sidebar-spacer" />

        <div className="daily-goal-card">
          <div className="goal-orbit">
            <Target size={17} />
          </div>
          <div className="goal-topline">
            <span>{trL(lang, "TON RYTHME", "YOUR PACE", "TU RITMO", "إيقاعك")}</span>
            <span>{Math.min(100, Math.round(((completedCount * 3) / 10) * 100))}%</span>
          </div>
          <strong>{trL(lang, "10 minutes par jour", "10 minutes a day", "10 minutos al día", "10 دقائق يومياً")}</strong>
          <div className="goal-track">
            <span style={{ width: `${Math.min(100, ((completedCount * 3) / 10) * 100)}%` }} />
          </div>
          <button
            onClick={() => showToast(t.modules.home.dailyGoal)}
            className="goal-link"
          >
            {trL(lang, tr("Ajuster l’objectif", "Adjust goal", "Ajustar objetivo", "عدّل الهدف"), "Adjust goal", "Ajustar objetivo", "عدّل الهدف")} <ArrowRight size={14} />
          </button>
        </div>

        <div className="sidebar-footer">
          <span className="privacy-dot" />
          <span>{user ? user.email?.split("@")[0] : trL(lang, "Mode Invité actif", "Guest mode active", "Modo invitado activo", "وضع الضيف مُفعّل")}</span>
          <button
            aria-label={trL(lang, "En savoir plus sur les données", "Learn more about data", "Más información sobre los datos", "اعرف المزيد عن البيانات")}
            onClick={() => switchView("space")}
          >
            <CircleHelp size={14} />
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="mobile-scrim"
          aria-label={tr("Fermer le menu", "Close the menu", "Cerrar el menú", "إغلاق القائمة")}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Area */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-trigger"
            aria-label={t.modules.home.langSwitcher}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>KENZA</span>
            <ChevronRight size={14} />
            <span>{currentHeader.eyebrow.toLocaleLowerCase(lang)}</span>
          </div>
          <div className="topbar-actions">
            {/* Sélecteur de langue bilingue */}
            <div className="lang-switcher" role="group" aria-label={tr("Sélecteur de langue", "Language switcher", "Selector de idioma", "مبدل اللغة")}>
              <Globe size={13} className="lang-icon" />
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`lang-btn ${uiLanguage === "fr" ? "lang-btn-active" : ""}`}
                aria-label={t.modules.home.switchToFr}
              >
                FR
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`lang-btn ${uiLanguage === "en" ? "lang-btn-active" : ""}`}
                aria-label={t.modules.home.switchToEn}
              >
                EN
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`lang-btn ${uiLanguage === "es" ? "lang-btn-active" : ""}`}
                aria-label={t.modules.home.switchToEs}
              >
                ES
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={`lang-btn ${uiLanguage === "ar" ? "lang-btn-active" : ""}`}
                aria-label={t.modules.home.switchToAr}
              >
                AR
              </button>
            </div>

            {/* Toggle Son */}
            <button
              className="sound-toggle"
              onClick={toggleSound}
              title={soundEnabled ? trL(lang, "Audio activé", "Audio on", "Audio activado", "الصوت مُفعّل") : trL(lang, "Audio muet", "Audio muted", "Audio silenciado", "الصوت مكتوم")}
              aria-label={soundEnabled ? trL(lang, "Couper le son", "Mute sound", "Silenciar", "كتم الصوت") : trL(lang, "Activer le son", "Enable sound", "Activar sonido", "تفعيل الصوت")}
            >
              <Headphones size={15} />
              <span>{soundEnabled ? trL(lang, "Son actif", "Sound on", "Sonido activo", "الصوت مُفعّل") : trL(lang, "Son coupé", "Sound off", "Sonido apagado", "الصوت مُغلق")}</span>
            </button>

            {/* Connexion Google & Profil */}
            {user ? (
              <button
                className="top-avatar"
                aria-label={t.modules.home.openSpace}
                onClick={() => switchView("space")}
                title={user.email || t.nav.profile}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || trL(lang, "Profil", "Profile", "Perfil", "الملف الشخصي")}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : user.user_metadata?.full_name ? (
                  user.user_metadata.full_name[0].toUpperCase()
                ) : user.email ? (
                  user.email[0].toUpperCase()
                ) : (
                  "K"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="google-login-btn"
                aria-label={trL(lang, "Se connecter avec Google", "Sign in with Google", "Iniciar sesión con Google", "تسجيل الدخول عبر Google")}
                title={trL(lang, "Se connecter avec Google", "Sign in with Google", "Iniciar sesión con Google", "تسجيل الدخول عبر Google")}
              >
                <svg className="google-icon" width="13" height="13" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 10.02 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{trL(lang, "Se connecter", "Sign in", "Iniciar sesión", "تسجيل الدخول")}</span>
              </button>
            )}
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                {currentHeader.eyebrow}
              </div>
              <h1>{currentHeader.title}</h1>
              <p>{currentHeader.description}</p>
            </div>
            <div className="date-chip">
              <span className="date-sun">☼</span>
              <span>
                {new Intl.DateTimeFormat(getDateLocale(lang), {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).format(new Date())}
              </span>
            </div>
          </section>

          {/* VUE 1 : AUJOURD'HUI */}
          {view === "today" && (
            <TodayView
              completedCount={completedCount}
              xp={xp}
              streak={streakDays}
              nextLesson={nextLesson}
              onStart={startLesson}
              onNavigate={switchView}
              onOpenRoleplay={() => setShowScenarioSelector(true)}
            />
          )}

          {/* VUE 2 : MON PARCOURS */}
          {view === "path" && (
            <PathView
              completedLessons={completedLessons}
              onStart={startLesson}
              onOpenCheckpoint={(id, name) => setCheckpointOpen({ id, name })}
              onOpenPaywall={() => setPricingSource("module_locked")}
              isPremium={isPremium}
            />
          )}

          {/* VUE 3 : CARNET DE PHRASES */}
          {view === "phrases" && (
            <PhrasesView
              search={search}
              searchInputRef={searchInputRef}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              phrases={filteredPhrases}
              favorites={safeFavorites}
              favoritesOnly={favoritesOnly}
              setFavoritesOnly={setFavoritesOnly}
              onFavorite={toggleFavorite}
              onPlay={playPhrase}
              onCopy={copyPhrase}
            />
          )}

          {/* VUE 4 : RÉVISION SRS */}
          {view === "review" && (
            <ReviewView
              reviewIndex={reviewIndex}
              cardFlipped={cardFlipped}
              setCardFlipped={setCardFlipped}
              onGrade={gradeReview}
            />
          )}

          {/* VUE 5 : MON ESPACE / PASSEPORT */}
          {view === "space" && (
            <SpaceView
              completedCount={completedCount}
              xp={xp}
              streak={streakDays}
              user={user}
              isPremium={isPremium}
              onReset={resetProgress}
              onOpenPaywall={() => setPricingSource("profile_upgrade")}
              onToast={showToast}
            />
          )}

          <footer className="page-footer">
            <span>
              KENZA <span className="footer-arabic">كنزة</span>
            </span>
            <span>{trL(lang, "Apprendre une langue, c’est rencontrer des gens.", "Learning a language is meeting people.", "Aprender un idioma es conocer gente.", "تعلم اللغة لقاءٌ بالناس.")}</span>
            <button onClick={() => switchView("space")}>
              {trL(lang, "Passeport Culturel & Données", "Cultural passport & data", "Pasaporte cultural y datos", "الجواز الثقافي والبيانات")} <ArrowRight size={13} />
            </button>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible sous 900px) */}
      <nav className="mobile-bottom-nav" aria-label={tr("Navigation mobile", "Mobile navigation", "Navegación móvil", "التنقل على الهاتف")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => switchView(item.id)}
              className={view === item.id ? "mobile-nav-active" : ""}
              aria-label={navLabel(item.id) || item.label}
              aria-current={view === item.id ? "page" : undefined}
            >
              <Icon size={19} />
              <span>
                {item.id === "today"
                  ? trL(lang, "Accueil", "Home", "Inicio", "الرئيسية")
                  : item.id === "path"
                  ? trL(lang, "Parcours", "Journey", "Recorrido", "المسار")
                  : item.id === "phrases"
                  ? trL(lang, "Phrases", "Phrases", "Frases", "العبارات")
                  : trL(lang, "Réviser", "Review", "Repasar", "مراجعة")}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Modale d'Exercice Manus */}
      {lessonId && activeLesson && activeQuestion && (
        <div
          className="modal-scrim"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLessonId(null);
          }}
        >
          <section className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
            <div className="lesson-modal-top">
              <button onClick={() => setLessonId(null)} className="icon-button" aria-label={t.modules.home.closeLesson}>
                <ArrowLeft size={19} />
              </button>
              <div className="lesson-progress-label">
                <span>{trL(lang, "LEÇON", "LESSON", "LECCIÓN", "درس")} · {activeLesson.length.toUpperCase()}</span>
                <span>
                  {questionIndex + 1} / {activeLesson.questions.length}
                </span>
              </div>
              <button onClick={() => setLessonId(null)} className="icon-button" aria-label={tr("Quitter", "Leave", "Salir", "خروج")}>
                <X size={18} />
              </button>
            </div>
            <div className="lesson-progress-track">
              <span style={{ width: `${((questionIndex + 1) / activeLesson.questions.length) * 100}%` }} />
            </div>
            <div className="lesson-modal-body">
              <div className="lesson-kicker">
                <span className="lesson-kicker-icon">
                  <Languages size={16} />
                </span>{" "}
                {activeLesson.title}
              </div>
              <h2 id="lesson-title">{activeQuestion.prompt}</h2>
              <p className="lesson-helper">{activeQuestion.helper}</p>
              <div className="answer-list">
                {activeQuestion.options.map((option, index) => {
                  const isCorrect = selectedAnswer !== null && option === activeQuestion.answer;
                  const isWrong = selectedAnswer === option && !isCorrect;
                  const letter = String.fromCharCode(65 + index);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (!selectedAnswer) setSelectedAnswer(option);
                      }}
                      disabled={Boolean(selectedAnswer)}
                      className={`answer-option ${selectedAnswer === option ? "answer-selected" : ""} ${
                        isCorrect ? "answer-correct" : ""
                      } ${isWrong ? "answer-wrong" : ""}`}
                    >
                      <span className="answer-letter">{isCorrect ? <Check size={17} /> : letter}</span>
                      <span>{option}</span>
                      {isCorrect && <CheckCircle2 className="answer-check" size={19} />}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer && (
                <div
                  className={`answer-feedback ${
                    selectedAnswer === activeQuestion.answer ? "feedback-good" : "feedback-try"
                  }`}
                >
                  <strong>
                    {selectedAnswer === activeQuestion.answer ? trL(lang, "Bien joué !", "Well done!", "¡Bien hecho!", "أحسنت!") : trL(lang, "Presque — retiens ceci.", "Almost — remember this.", "Casi — recuerda esto.", "تقريبًا — تذكر هذا.")}
                  </strong>
                  <span>{activeQuestion.note}</span>
                </div>
              )}
              <button
                className="primary-button lesson-next"
                onClick={advanceQuestion}
                disabled={!selectedAnswer}
              >
                {questionIndex === activeLesson.questions.length - 1 ? trL(lang, tr("Terminer la leçon", "Finish the lesson", "Terminar la lección", "أنهِ الدرس"), "Finish the lesson", "Terminar la lección", "أنهِ الدرس") : trL(lang, tr("Continuer", "Continue", "Continuar", "متابعة"), "Continue", "Continuar", "متابعة")}
                <ArrowRight size={17} />
              </button>
              <div className="local-note">
                <LockKeyhole size={13} /> {trL(lang, tr("Progression enregistrée en direct sur ton profil.", "Progress saved live to your profile.", "Progreso guardado en directo en tu perfil.", "تقدمك يُحفظ مباشرة في ملفك."), "Progress saved live to your profile.", "Progreso guardado en directo en tu perfil.", "تقدمك يُحفظ مباشرة في ملفك.")}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Roleplay Scenario Selector */}
      {showScenarioSelector && (
        <ScenarioSelectorModal
          onClose={() => setShowScenarioSelector(false)}
          onSelectAi={(personaId) => {
            setActivePersonaId(personaId);
            setShowScenarioSelector(false);
          }}
          onRequirePremium={() => setPricingSource("roleplay_locked")}
          onStartSrs={() => {
            setShowScenarioSelector(false);
            setView("review");
          }}
        />
      )}

      {/* Fullscreen Roleplay IA Persona View */}
      {activePersonaId && (
        <div className="fixed inset-0 z-50 bg-[#FDFCF8] flex flex-col">
          <AiRoleplayView
            personaId={activePersonaId}
            onClose={() => setActivePersonaId(null)}
          />
        </div>
      )}

      {/* Checkpoint Modal */}
      {checkpointOpen && (
        <CheckpointModal
          levelId={checkpointOpen.id}
          levelName={checkpointOpen.name}
          onClose={() => setCheckpointOpen(null)}
        />
      )}

      {/* Paywall Modal */}
      {pricingSource && (
        <PaywallModal
          onClose={() => setPricingSource(null)}
          source={pricingSource}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-message" role="status" aria-live="polite">
          <span className="toast-check">
            <Check size={15} />
          </span>
          {toast}
          <button aria-label={tr("Fermer", "Close", "Cerrar", "إغلاق")} onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {savePromptVariant && (
        <div className="fixed inset-x-0 bottom-24 sm:bottom-8 z-40 flex justify-center px-4">
          <div className="w-full max-w-sm">
            <SaveProgressCard
              variant={savePromptVariant}
              lessonsCompleted={completedCount}
              onSave={() => {
                track("cta_click", { cta: "save_progress" }, `/${view}`);
                setAuthMode("signup");
                setSavePromptHidden(true);
              }}
              onLater={() => {
                dismissSavePrompt(completedCount);
                setSavePromptHidden(true);
              }}
            />
          </div>
        </div>
      )}

      {authMode && (
        <AuthModal
          key={authMode}
          isOpen
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={() => setAuthMode(null)}
        />
      )}

      <InstallPwaBanner />
    </div>
  );
}

// -------------------------------------------------------------
// Composant 1 : TodayView
// -------------------------------------------------------------
function TodayView({
  completedCount,
  xp,
  streak,
  nextLesson,
  onStart,
  onNavigate,
  onOpenRoleplay,
}: {
  completedCount: number;
  xp: number;
  streak: number;
  nextLesson: Lesson;
  onStart: (id: string) => void;
  onNavigate: (view: View) => void;
  onOpenRoleplay: () => void;
}) {
  const { t } = useTranslation();
  const { lang, lessons } = useLocalizedContent();
  const totalLessons = lessons.length;

  return (
    <>
      <div className="today-grid">
        <article className="hero-panel">
          <div className="hero-texture" />
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} /> {trL(lang, "TON PETIT MOMENT DARIJA", "YOUR LITTLE DARIJA MOMENT", "TU MOMENTO DARIJA", "لحظتك مع الدارجة")}
            </span>
            <h2>
              {trL(lang, "La darija", "Darija", "La darija", "الدارجة")}
              <br />
              {trL(lang, "s’ouvre à toi.", "opens up to you.", "se abre a ti.", "تنفتح عليك.")}
            </h2>
            <p>{trL(lang, "Une phrase, une rencontre, une autre façon de voir le Maroc.", "A phrase, an encounter, another way to see Morocco.", "Una frase, un encuentro, otra forma de ver Marruecos.", "عبارة، لقاء، وطريقة أخرى لرؤية المغرب.")}</p>
            <button className="hero-button" onClick={() => onStart(nextLesson.id)}>
              {trL(lang, "Continuer à apprendre", "Keep learning", "Seguir aprendiendo", "واصل التعلم")} <ArrowRight size={16} />
            </button>
            <div className="hero-footnote">
              <span className="hero-foot-line" /> {trL(lang, "À ton rythme, toujours.", "At your pace, always.", "A tu ritmo, siempre.", "على إيقاعك، دائماً.")}
            </div>
          </div>
          <div className="hero-image-wrap" aria-hidden="true">
            <img
              className="hero-image"
              src="/manus-storage/kenza-hero_99e35384.jpg"
              alt={tr("Maroc médina", "Moroccan medina", "Medina de Marruecos", "مدينة مغربية")}
            />
            <div className="hero-image-wash" />
            <div className="hero-image-caption">
              <span>دَارِيجة</span>
              <small>{trL(lang, "darija, la langue du lien", "darija, the language of connection", "darija, la lengua del vínculo", "الدارجة، لغة التواصل")}</small>
            </div>
          </div>
          <div className="hero-medallion" aria-hidden="true">
            <span>مرحبا</span>
            <small>marhba</small>
          </div>
        </article>

        <article className="next-card">
          <div className="next-card-head">
            <span className="mini-kicker">{trL(lang, "TA PROCHAINE ÉTAPE", "YOUR NEXT STEP", "TU PRÓXIMO PASO", "خطوتك التالية")}</span>
            <span className="next-icon">
              <ArrowDownRight size={17} />
            </span>
          </div>
          <div className="lesson-number">
            0{Math.min(completedCount + 1, totalLessons)}{" "}
            <span>/ 0{totalLessons}</span>
          </div>
          <div className="next-illustration">
            <img
              className="next-photo"
              src="/manus-storage/kenza-market_a0db8277.jpg"
              alt={t.modules.home.imgMintTea}
            />
            <div className="cup-shadow" />
            <div className="tea-cup">
              <span />
              <i />
            </div>
            <div className="tea-steam steam-one" />
            <div className="tea-steam steam-two" />
            <div className="tea-leaf leaf-one" />
            <div className="tea-leaf leaf-two" />
          </div>
          <div className="next-card-copy">
            <span className="lesson-pill">{trL(lang, "LEÇON SUIVANTE", "NEXT LESSON", "PRÓXIMA LECCIÓN", "الدرس التالي")} · {nextLesson.length}</span>
            <h3>{nextLesson.title}</h3>
            <p>{nextLesson.subtitle}</p>
          </div>
          <button className="text-link" onClick={() => onStart(nextLesson.id)}>
            {trL(lang, "C’est parti", "Let’s go", "¡Vamos!", "هيا بنا")} <ArrowRight size={15} />
          </button>
        </article>
      </div>

      <div className="stat-strip">
        <div className="stat-item">
          <span className="stat-icon stat-blue">
            <BookOpen size={17} />
          </span>
          <div>
            <strong>
              {completedCount}
              <small>/{totalLessons}</small>
            </strong>
            <span>{trL(lang, "leçons terminées", "lessons completed", "lecciones completadas", "دروس مكتملة")}</span>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-icon stat-gold">
            <Star size={17} />
          </span>
          <div>
            <strong>
              {xp}
              <small> XP</small>
            </strong>
            <span>{trL(lang, "points de pratique", "practice points", "puntos de práctica", "نقاط التدريب")}</span>
          </div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-icon stat-orange">
            <Flame size={17} />
          </span>
          <div>
            <strong>
              {streak}
              <small> {trL(lang, "jour", "day", "día", "يوم")}{streak > 1 ? tr("s", "s", "s", "") : ""}</small>
            </strong>
            <span>{trL(lang, "rythme régulier", "steady rhythm", "ritmo constante", "إيقاع منتظم")}</span>
          </div>
        </div>
        <button className="stat-action" onClick={() => onNavigate("space")}>
          {trL(lang, "Voir mon espace", "See my space", "Ver mi espacio", "فضائي")} <ArrowRight size={14} />
        </button>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {trL(lang, "POUR AUJOURD’HUI", "FOR TODAY", "PARA HOY", "لهذا اليوم")}
          </span>
          <h2>{trL(lang, "À toi de choisir ton pas.", "Your pace, your choice.", "Tú eliges tu paso.", "اختر خطوتك.")}</h2>
        </div>
        <button className="plain-link" onClick={() => onNavigate("path")}>
          {trL(lang, "Voir le parcours", "View the journey", "Ver la ruta", "المسار")} <ArrowRight size={15} />
        </button>
      </div>

      <div className="quick-grid">
        <button className="quick-card quick-card-phrases" onClick={() => onNavigate("phrases")}>
          <span className="quick-icon">
            <Bookmark size={18} />
          </span>
          <span className="quick-label">{trL(lang, "UN MOT À EMPORTER", "A WORD TO GO", "UNA PALABRA PARA LLEVAR", "كلمة معك")}</span>
          <strong>
            {trL(lang, "Ton carnet", "Your phrase", "Tu cuaderno", "دفترك")}
            <br />
            {trL(lang, "de phrases", " book", " de frases", " للعبارات")}
          </strong>
          <span className="quick-bottom">
            {trL(lang, "Vocabulaire essentiel", "Essential vocabulary", "Vocabulario esencial", "مفردات أساسية")} <ArrowRight size={14} />
          </span>
        </button>

        <button className="quick-card quick-card-review" onClick={() => onNavigate("review")}>
          <span className="quick-icon">
            <Sparkles size={18} />
          </span>
          <span className="quick-label">{trL(lang, "5 MINUTES, PAS PLUS", "5 MINUTES, NO MORE", "5 MINUTOS, NO MÁS", "5 دقائق فقط")}</span>
          <strong>
            {trL(lang, "Faire une", "Do a quick", "Haz una", "قم بمراجعة")}
            <br />
            {trL(lang, "petite révision", "review", "revisión rápida", "سريعة")}
          </strong>
          <span className="quick-bottom">
            {trL(lang, "Cartes du jour", "Cards of the day", "Cartas del día", "بطاقات اليوم")} <ArrowRight size={14} />
          </span>
        </button>

        <button className="quick-card quick-card-listen" onClick={onOpenRoleplay}>
          <span className="quick-icon">
            <MessageCircle size={18} />
          </span>
          <span className="quick-label">{trL(lang, "IMMERSION IA", "AI IMMERSION", "INMERSIÓN IA", "انغماس مع الذكاء")}</span>
          <strong>
            {trL(lang, "Mises en", "Real-life", "Situaciones", "مواقف")}
            <br />
            {trL(lang, "situation", "scenarios", "de la vida real", "من الحياة")}
          </strong>
          <span className="quick-bottom">
            {trL(lang, "Au café, en taxi", "At the café, in a taxi", "En el café, en taxi", "في المقهى وفي التاكسي")} <ArrowRight size={14} />
          </span>
        </button>
      </div>

      <div className="bottom-callout">
        <div className="callout-art">
          <div className="callout-sun" />
          <div className="callout-arch">
            <span>مرحبا</span>
          </div>
          <span className="callout-spark spark-a">✳</span>
          <span className="callout-spark spark-b">✳</span>
        </div>
        <div className="callout-copy">
          <span className="mini-kicker">{trL(lang, "UNE LANGUE, DES RENCONTRES", "A LANGUAGE, ENCOUNTERS", "UN IDIOMA, ENCUENTROS", "لغةٌ ولقاءات")}</span>
          <h3>
            {trL(lang, "Pas besoin d’être parfait·e.", "No need to be perfect.", "No hace falta ser perfecto.", "لا داعي للكمال.")}
            <br />
            <em>{trL(lang, "Il suffit de commencer.", "Just start.", "Solo empieza.", "ابدأ فقط.")}</em>
          </h3>
          <p>{trL(lang, "Chaque expression est une petite invitation à aller vers l’autre.", "Every phrase is a small invitation to reach out to others.", "Cada expresión es una pequeña invitación a acercarse al otro.", "كل عبارة دعوة صغيرة للتقرب من الآخر.")}</p>
        </div>
        <button onClick={() => onNavigate("path")} aria-label={t.modules.home.explorePath}>
          <ArrowRight size={20} />
        </button>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// Composant 2 : PathView
// -------------------------------------------------------------
function PathView({
  completedLessons,
  onStart,
  onOpenCheckpoint,
  onOpenPaywall,
  isPremium,
}: {
  completedLessons: string[];
  onStart: (id: string) => void;
  onOpenCheckpoint: (id: string, name: string) => void;
  onOpenPaywall: () => void;
  isPremium: boolean;
}) {
  const { t } = useTranslation();
  const { lang, lessons } = useLocalizedContent();
  const { hasPassedLevel } = useCheckpointProgress();

  return (
    <div className="path-layout">
      <section className="path-main-card">
        <div className="path-banner">
          <div>
            <span className="hero-kicker">
              <Compass size={14} /> {trL(lang, "PARCOURS DÉCOUVERTE", "DISCOVERY JOURNEY", "RUTA DE DESCUBRIMIENTO", "مسار الاستكشاف")}
            </span>
            <h2>
              {trL(lang, "Les premiers pas", "The first steps", "Los primeros pasos", "الخطوات الأولى")}
              <br />
              {trL(lang, "en darija.", "in darija.", "en darija.", "في الدارجة.")}
            </h2>
            <p>{trL(lang, "Trois escales pour oser dire les premiers mots.", "Three stops to dare your first words.", "Tres paradas para atreverte a hablar.", "ثلاث محطات لتبدأ كلماتك الأولى.")}</p>
          </div>
          <div className="path-stamp">
            <span>المغرب</span>
            <small>Maroc</small>
          </div>
          <div className="path-doodle" />
        </div>

        <div className="path-progress-row">
          <div>
            <span className="mini-kicker">{trL(lang, "TON AVANCÉE", "YOUR PROGRESS", "TU AVANCE", "تقدّمك")}</span>
            <strong>
              {completedLessons.length}{" "}
              <small>
                {tr("leçon", "lesson", "lección", "درس")}{completedLessons.length > 1 ? tr("s", "s", "s", "") : ""}{tr(" sur ", " of ", " de ", " من ")}{lessons.length}
              </small>
            </strong>
          </div>
          <div className="path-overall-track">
            <span
              style={{
                width: `${Math.round((completedLessons.length / lessons.length) * 100)}%`,
              }}
            />
          </div>
          <span className="path-percent">
            {Math.round((completedLessons.length / lessons.length) * 100)}%
          </span>
        </div>

        <div className="lesson-roadmap">
          {lessons.map((lesson, index) => {
            const done = completedLessons.includes(lesson.id);
            const unlocked =
              index === 0 || completedLessons.includes(lessons[index - 1].id) || done;
            const isGated = lesson.isPremium && !isPremium;
            const locked = !unlocked && !isGated;

            return (
              <div
                className={`roadmap-row ${done ? "roadmap-done" : ""} ${locked ? "roadmap-locked" : ""}`}
                key={lesson.id}
              >
                <div className="roadmap-track">
                  <div className="roadmap-line" />
                  <button
                    className={`roadmap-node ${done ? "node-done" : ""} ${
                      !locked && !done ? "node-current" : ""
                    }`}
                    disabled={locked}
                    onClick={() => (isGated ? onOpenPaywall() : onStart(lesson.id))}
                    aria-label={
                      done
                        ? t.modules.home.reviewLesson.replace("{title}", lesson.title)
                        : locked
                        ? t.modules.home.lessonLocked.replace("{title}", lesson.title)
                        : t.modules.home.startLesson.replace("{title}", lesson.title)
                    }
                  >
                    {done ? (
                      <Check size={16} />
                    ) : isGated ? (
                      <Crown size={14} className="text-[#C9A05C]" />
                    ) : locked ? (
                      <LockKeyhole size={14} />
                    ) : (
                      <span>0{index + 1}</span>
                    )}
                  </button>
                </div>
                <div className="roadmap-content">
                  <div className="roadmap-meta">
                    <span>
                      {lesson.length.toUpperCase()} ·{" "}
                      {index === 0
                        ? tr("LES ESSENTIELS", "THE ESSENTIALS", "LO ESENCIAL", "الأساسيات")
                        : index === 1
                        ? tr("AU QUOTIDIEN", "EVERYDAY LIFE", "LO COTIDIANO", "الحياة اليومية")
                        : index === 2
                        ? tr("SE REPÉRER", "FINDING YOUR WAY", "ORIENTARSE", "الاستدلال")
                        : tr("IMMERSION AVANCÉE", "ADVANCED IMMERSION", "INMERSIÓN AVANZADA", "انغماس متقدم")}
                    </span>
                    {done && (
                      <span className="done-tag">
                        <CheckCircle2 size={13} /> {tr("TERMINÉE", "COMPLETED", "COMPLETADA", "مكتملة")}
                      </span>
                    )}
                    {!done && !locked && !isGated && (
                      <span className="current-tag">{trL(lang, "À SUIVRE", "TO CONTINUE", "A CONTINUAR", "للمتابعة")}</span>
                    )}
                    {isGated && (
                      <span className="current-tag" style={{ background: "#fef3c7", color: "#b45309" }}>
                        PRO
                      </span>
                    )}
                  </div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subtitle}</p>
                  <div className="roadmap-footer">
                    <span>
                      <BookOpen size={14} /> {lesson.questions.length} {tr("exercices", "exercises", "ejercicios", "تمارين")}
                    </span>
                    {isGated ? (
                      <button onClick={onOpenPaywall} style={{ color: "#d69b47" }}>
                        {trL(lang, "Débloquer avec Pro", "Unlock with Pro", "Desbloquear con Pro", "افتح مع برو")} <ArrowRight size={14} />
                      </button>
                    ) : unlocked ? (
                      <button onClick={() => onStart(lesson.id)}>
                        {done ? trL(lang, "Revoir", "Review", "Repasar", "مراجعة") : trL(lang, "Commencer", "Start", "Empezar", "ابدأ")}
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="locked-copy">
                        <LockKeyhole size={13} /> {trL(lang, "Finis l’étape avant", "Finish the previous step first", "Termina el paso anterior primero", "أكمل الخطوة السابقة أولاً")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="path-aside">
        <div className="path-aside-card">
          <span className="aside-icon">
            <Leaf size={18} />
          </span>
          <span className="mini-kicker">{trL(lang, "PETIT CONSEIL", "QUICK TIP", "PEQUEÑO CONSEJO", "نصيحة صغيرة")}</span>
          <h3>{trL(lang, "La régularité avant la perfection.", "Consistency beats perfection.", "La constancia antes que la perfección.", "الاستمرارية قبل الإتقان.")}</h3>
          <p>
            {tr("5 minutes par jour font plus qu’une heure de temps en temps. Reviens quand tu veux.", "5 minutes a day beats an hour once in a while. Come back whenever you want.", "5 minutos al día hacen más que una hora de vez en cuando. Vuelve cuando quieras.", "5 دقائق يومياً تنفع أكثر من ساعة بين الحين والآخر. عُد متى شئت.")}
          </p>
          <div className="aside-divider" />
          <div className="aside-stat">
            <span>{trL(lang, "Palier A1 (Fondations)", "Level A1 (Foundations)", "Nivel A1 (Fundamentos)", "المستوى A1 (الأساسيات)")}</span>
            <strong>{hasPassedLevel("1") ? tr("Validé ✓", "Passed ✓", "Aprobado ✓", "ناجح ✓") : tr("En cours", "In progress", "En curso", "قيد التقدم")}</strong>
          </div>
          <button
            onClick={() => onOpenCheckpoint("1", trL(lang, tr("Palier A1 — Fondations", "Level A1 — Foundations", "Nivel A1 — Fundamentos", "المستوى A1 — الأساسيات"), "Level A1 — Foundations", "Nivel A1 — Fundamentos", "المستوى A1 — الأساسيات"))}
          >
            {trL(lang, "Passer le Checkpoint A1", "Take Checkpoint A1", "Pasar el Checkpoint A1", "اجتز نقطة A1")} <ArrowRight size={14} />
          </button>
        </div>

        <div className="path-aside-note">
          <span className="note-symbol">✳</span>
          <p>
            {tr("Le mot ", "The word ", "La palabra ", "كلمة ")}<strong>darija</strong>{tr(" vient de l’arabe ", " comes from Arabic ", " viene del árabe ", " أصله من العربية ")}<span dir="rtl">الدارجة</span>{tr(" — la langue courante, celle de tous les jours.", " — the everyday language.", " — la lengua corriente, la de todos los días.", " — اللغة الدارجة، لغة كل يوم.")}
          </p>
        </div>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// Composant 3 : PhrasesView
// -------------------------------------------------------------
function PhrasesView({
  search,
  searchInputRef,
  setSearch,
  category,
  setCategory,
  categories,
  phrases: visiblePhrases,
  favorites = [],
  favoritesOnly,
  setFavoritesOnly,
  onFavorite,
  onPlay,
  onCopy,
}: {
  search: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  phrases: Phrase[];
  favorites?: string[];
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  onFavorite: (id: string) => void;
  onPlay: (darija: string, arabic: string) => void;
  onCopy: (phrase: Phrase) => void;
}) {
  const { lang } = useLocalizedContent();
  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  const safePhrases = Array.isArray(visiblePhrases) ? visiblePhrases : [];

  return (
    <>
      <section className="phrase-toolbar">
        <label className="phrase-search">
          <Search size={17} />
          <input
            ref={searchInputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={trL(lang, "Chercher une expression…", "Search a phrase…", "Buscar una frase…", "ابحث عن عبارة…")}
            aria-label={trL(lang, "Chercher une expression", "Search a phrase", "Buscar una frase", "ابحث عن عبارة")}
          />
          <kbd>⌘ K</kbd>
        </label>
        <button
          className={`favorites-filter ${favoritesOnly ? "filter-active" : ""}`}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} /> {trL(lang, "Mes favoris", "My favorites", "Mis favoritos", "مفضلاتي")}{" "}
          <span>{safeFavorites.length}</span>
        </button>
      </section>

      <div className="category-tabs" role="tablist" aria-label={trL(lang, "Catégories de phrases", "Phrase categories", "Categorías de frases", "فئات العبارات")}>
        {(categories || []).map((item) => (
          <button
            role="tab"
            aria-selected={category === item}
            key={item}
            className={category === item ? "category-active" : ""}
            onClick={() => setCategory(item)}
          >
            {item === "__all__" ? trL(lang, "Tout voir", "See all", "Ver todo", "عرض الكل") : item}
          </button>
        ))}
      </div>

      <div className="phrase-section-top">
        <div>
          <span className="mini-kicker">{trL(lang, "À PORTÉE DE MAIN", "AT HAND", "A MANO", "في متناول اليد")}</span>
          <h2>
            {favoritesOnly
              ? trL(lang, "Tes phrases favorites", "Your favorite phrases", "Tus frases favoritas", "عباراتك المفضلة")
              : (category === "Tout voir" || category === "__all__")
              ? trL(lang, "Les expressions du quotidien", "Everyday expressions", "Expresiones cotidianas", "التعابير اليومية")
              : category}
          </h2>
        </div>
        <span className="phrase-count">
          {safePhrases.length} {tr("expression", "expression", "expresión", "عبارة")}{safePhrases.length === 1 ? "" : tr("s", "s", "s", "")}
        </span>
      </div>

      {safePhrases.length > 0 ? (
        <div className="phrase-grid">
          {safePhrases.map((phrase, index) => {
            const isFav = safeFavorites.includes(phrase.id);
            const darijaText = phrase.darija || "";
            const arabicText = phrase.arabic || "";
            const meaningText = phrase.meaning || "";
            const categoryText = phrase.category || trL(lang, tr("Les essentiels", "Essentials", "Lo esencial", "الأساسيات"), "Essentials", "Lo esencial", "الأساسيات");

            return (
              <article className="phrase-card" key={phrase.id}>
                <div className="phrase-card-top">
                  <span className="phrase-category">{categoryText}</span>
                  <button
                    className={`heart-button ${isFav ? "heart-active" : ""}`}
                    onClick={() => onFavorite(phrase.id)}
                    aria-label={
                      isFav ? tr("Retirer des favoris", "Remove from favorites", "Quitar de favoritos", "إزالة من المفضلة") : tr("Ajouter aux favoris", "Add to favorites", "Añadir a favoritos", "أضف إلى المفضلة")
                    }
                  >
                    <Heart size={17} fill={isFav ? "currentColor" : "none"} />
                  </button>
                </div>
                <span className="phrase-index">0{index + 1}</span>
                <h3>{darijaText}</h3>
                {arabicText ? (
                  <span className="phrase-arabic" dir="rtl">
                    {arabicText}
                  </span>
                ) : null}
                <div className="phrase-divider" />
                <p className="phrase-meaning">{meaningText}</p>
                {phrase.note ? <p className="phrase-note">{phrase.note}</p> : null}
                <div className="phrase-actions">
                  <button onClick={() => onPlay(darijaText, arabicText)}>
                    <Volume2 size={15} /> {tr("Écouter", "Listen", "Escuchar", "استمع")}
                  </button>
                  <button onClick={() => onCopy(phrase)}>
                    <Bookmark size={14} /> {tr("Copier", "Copy", "Copiar", "نسخ")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-symbol">
            <Search size={22} />
          </span>
          <h3>{trL(lang, "Aucune phrase trouvée", "No phrase found", "Ninguna frase encontrada", "لا توجد عبارات")}</h3>
          <p>{trL(lang, "Essaie un autre mot ou change de catégorie.", "Try another word or category.", "Prueba otra palabra o categoría.", "جرّب كلمة أو فئة أخرى.")}</p>
          <button
            className="plain-link"
            onClick={() => {
              setSearch("");
              setCategory("__all__");
              setFavoritesOnly(false);
            }}
          >
            {trL(lang, "Effacer les filtres", "Clear filters", "Borrar filtros", "مسح المرشحات")} <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="phrase-footnote">
        <span className="privacy-dot" /> {tr("Synthèse vocale naturelle haute fidélité (Edge TTS) avec cache hors-ligne intégré.", "High-fidelity natural voice synthesis (Edge TTS) with built-in offline cache.", "Síntesis de voz natural de alta fidelidad (Edge TTS) con caché sin conexión integrada.", "تحويل نص إلى كلام طبيعي عالي الدقة (Edge TTS) مع تخزين مؤقت دون اتصال.")}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// Composant 4 : ReviewView (Flashcards SRS)
// -------------------------------------------------------------
function ReviewView({
  reviewIndex,
  cardFlipped,
  setCardFlipped,
  onGrade,
}: {
  reviewIndex: number;
  cardFlipped: boolean;
  setCardFlipped: (value: boolean) => void;
  onGrade: (grade: "again" | "hard" | "good" | "easy") => void;
}) {
  const { lang } = useLocalizedContent();
  const cards = [
    {
      front: trL(lang, "Merci beaucoup", "Thank you so much", "Muchas gracias", "شكراً جزيلاً"),
      back: "Shukran bzaf",
      arabic: "شكرا بزاف!",
      hint: trL(lang, "Un petit mot chaleureux qui ouvre toutes les portes.", "A warm little word that opens every door.", "Una palabra cálida que abre todas las puertas.", "كلمة دافئة تفتح كل الأبواب."),
    },
    {
      front: trL(lang, tr("Où est le souk ?", "Where is the souk?", "¿dónde está el souk?", "أين السوق؟"), "Where is the souk?", "¿dónde está el souk?", "أين السوق؟"),
      back: "Fin kayn souk?",
      arabic: "فين كاين السوق؟",
      hint: trL(lang, "Pour trouver ton chemin dans la médina.", "To find your way in the medina.", "Para encontrar tu camino en la medina.", "لتجد طريقك في المدينة القديمة."),
    },
    {
      front: trL(lang, "S’il vous plaît", "Please", "Por favor", "من فضلك"),
      back: "Afak",
      arabic: "عفاك",
      hint: trL(lang, "Un mot simple pour rendre tes demandes plus douces.", "A simple word that softens your requests.", "Una palabra simple para suavizar tus peticiones.", "كلمة بسيطة تجعل طلباتك ألطف."),
    },
    {
      front: trL(lang, "Au revoir, à bientôt", "Goodbye, see you soon", "Adiós, hasta pronto", "إلى اللقاء، أراك قريباً"),
      back: "Bslama, nshawfek",
      arabic: "بسلامة، نشوفك",
      hint: trL(lang, "Une manière chaleureuse de se dire à bientôt.", "A warm way to say see you soon.", "Una manera cálida de decir hasta pronto.", "طريقة دافئة للقول أراك قريباً."),
    },
    {
      front: trL(lang, "Je voudrais un thé", "I’d like a tea", "Quisiera un té", "أريد شاياً"),
      back: "Bghit wahed atay, afak",
      arabic: "بغيت واحد أتاي، عفاك",
      hint: trL(lang, "Pour savourer un moment au café.", "To savor a moment at the café.", "Para saborear un momento en el café.", "للاستمتاع بلحظة في المقهى."),
    },
  ];

  const card = cards[reviewIndex % cards.length];

  return (
    <div className="review-layout">
      <section className="review-main">
        <div className="review-card-top">
          <span className="mini-kicker">
            {trL(lang, "CARTE", "CARD", "TARJETA", "بطاقة")} {String((reviewIndex % cards.length) + 1).padStart(2, "0")} <i>/</i> 0{cards.length}
          </span>
          <span className="review-session">
            <Sparkles size={14} /> {trL(lang, "Session tranquille", "Quiet session", "Sesión tranquila", "جلسة هادئة")}
          </span>
        </div>
        <button
          className={`flashcard ${cardFlipped ? "flashcard-flipped" : ""}`}
          onClick={() => setCardFlipped(!cardFlipped)}
          aria-label={cardFlipped ? trL(lang, "Voir la question", "See the question", "Ver la pregunta", "شاهد السؤال") : trL(lang, "Retourner la carte", "Flip the card", "Girar la tarjeta", "اقلب البطاقة")}
        >
          <span className="flashcard-decoration decor-top">✳</span>
          <span className="flashcard-label">{cardFlipped ? trL(lang, "EN DARIJA", "IN DARIJA", "EN DARIJA", "بالدارجة") : trL(lang, "EN FRANÇAIS", "IN ENGLISH", "EN ESPAÑOL", "بالعربية")}</span>
          {cardFlipped ? (
            <>
              <strong className="flashcard-answer">{card.back}</strong>
              <span className="flashcard-arabic" dir="rtl">
                {card.arabic}
              </span>
              <p>{card.hint}</p>
            </>
          ) : (
            <>
              <strong className="flashcard-question">{card.front}</strong>
              <span className="flashcard-tap">
                <span className="rotate-symbol">↻</span> {trL(lang, "Touche pour révéler", "Tap to reveal", "Toca para revelar", "المس للكشف")}
              </span>
            </>
          )}
          <span className="flashcard-decoration decor-bottom">✳</span>
        </button>

        <div className="review-hint">
          <CircleHelp size={15} />
          <span>{trL(lang, "Réponds dans ta tête, puis retourne la carte pour vérifier.", "Answer in your head, then flip the card.", "Responde en tu mente y gira la tarjeta.", "أجب في ذهنك ثم اقلب البطاقة.")}</span>
        </div>

        <div className="review-ratings">
          <button className="rate-again" onClick={() => onGrade("again")}>
            <span>{trL(lang, "Encore", "Again", "Otra vez", "مرة أخرى")}</span>
            <small>+1 XP</small>
          </button>
          <button className="rate-hard" onClick={() => onGrade("hard")}>
            <span>{trL(lang, "Difficile", "Hard", "Difícil", "صعب")}</span>
            <small>+2 XP</small>
          </button>
          <button className="rate-good" onClick={() => onGrade("good")}>
            <span>{trL(lang, "Bien", "Good", "Bien", "جيد")}</span>
            <small>+3 XP</small>
          </button>
          <button className="rate-easy" onClick={() => onGrade("easy")}>
            <span>{trL(lang, "Facile", "Easy", "Fácil", "سهل")}</span>
            <small>+5 XP</small>
          </button>
        </div>
      </section>

      <aside className="review-aside">
        <div className="review-aside-card">
          <span className="aside-icon">
            <Sparkles size={18} />
          </span>
          <span className="mini-kicker">{trL(lang, "SANS PRESSION", "NO PRESSURE", "SIN PRESIÓN", "بدون ضغط")}</span>
          <h3>{trL(lang, "Le bon rythme, c’est le tien.", "The right pace is yours.", "El buen ritmo es el tuyo.", "الإيقاع المناسب هو إيقاعك.")}</h3>
          <p>
            {trL(lang, "L'algorithme de répétition espacée (SRS) consolide ta mémoire à long terme. Chaque point d'XP nourrit ton passeport.", "The spaced-repetition (SRS) algorithm consolidates your long-term memory. Every XP point feeds your passport.", "El algoritmo de repetición espaciada (SRS) consolida tu memoria a largo plazo. Cada punto de XP alimenta tu pasaporte.", "خوارزمية التكرار المتباعد (SRS) ترسّخ ذاكرتك طويلة المدى. كل نقطة XP تغذي جوازك.")}
          </p>
          <div className="aside-divider" />
          <div className="review-method">
            <span className="method-dot" />
            <p>
              <strong>{trL(lang, "Petit conseil", "Quick tip", "Pequeño consejo", "نصيحة")}</strong>
              <br />
              {trL(lang, "Dis la phrase à voix haute. La mémoire aime la répétition.", "Say the phrase out loud. Memory loves repetition.", "Di la frase en voz alta. La memoria ama la repetición.", "قل العبارة بصوت عالٍ. الذاكرة تحب التكرار.")} les histoires qu’on raconte.
            </p>
          </div>
        </div>
        <div className="review-alphabet">
          <span>أ ب ت</span>
          <p>{trL(lang, "Écoute · Répète · Reviens", "Listen · Repeat · Come back", "Escucha · Repite · Vuelve", "استمع · كرر · عد")}</p>
        </div>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// Composant 5 : SpaceView (Mon Espace & Passeport)
// -------------------------------------------------------------
function SpaceView({
  completedCount,
  xp,
  streak,
  user,
  isPremium,
  onReset,
  onOpenPaywall,
  onToast,
}: {
  completedCount: number;
  xp: number;
  streak: number;
  user: any;
  isPremium: boolean;
  onReset: () => void;
  onOpenPaywall: () => void;
  onToast: (message: string) => void;
}) {
  const { t } = useTranslation();
  const { lang, lessons } = useLocalizedContent();
  const username =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || t.common.guest;

  const passportData = {
    userName: username,
    levelName: xp >= 300
      ? trL(lang, "Niveau A2 — Essentiels", "Level A2 — Essentials", "Nivel A2 — Esenciales", "المستوى A2 — الأساسيات")
      : trL(lang, "Niveau A1 — Premiers Pas", "Level A1 — First Steps", "Nivel A1 — Primeros Pasos", "المستوى A1 — الخطوات الأولى"),
    score: Math.min(100, Math.round((xp / 500) * 100)),
    date: new Date().toLocaleDateString(getDateLocale(lang)),
    passportId: `KNZ-${user ? "PRO" : "DEMO"}-7421`,
  };

  return (
    <div className="space-layout">
      <section className="space-card space-profile">
        <div className="profile-avatar">
          {username[0]?.toUpperCase() || "ك"}
        </div>
        <div className="profile-intro">
          <span className="mini-kicker">{trL(lang, "MON COIN KENZA", "MY KENZA CORNER", "MI RINCÓN KENZA", "ركني في كنزة")}</span>
          <h2>Salam, {username} !</h2>
          <p>
            {user
              ? trL(lang, `Connecté en tant que ${user.email}. Données sauvegardées dans le cloud.`, `Signed in as ${user.email}. Data saved to the cloud.`, `Conectado como ${user.email}. Datos guardados en la nube.`, `متصل بصفة ${user.email}. البيانات محفوظة في السحابة.`)
              : trL(lang, "Mode Invité actif. Ta progression est préservée localement sur cet appareil.", "Guest mode active. Your progress is kept locally on this device.", "Modo invitado activo. Tu progreso se guarda localmente en este dispositivo.", "وضع الضيف مُفعّل. يتم حفظ تقدمك محليًا على هذا الجهاز.")}
          </p>
        </div>
        <span className="local-badge">
          <span className="privacy-dot" /> {isPremium ? trL(lang, "MEMBRE KENZA PRO", "KENZA PRO MEMBER", "MIEMBRO KENZA PRO", "عضو كَنزة برو") : trL(lang, "VERSION GRATUITE", "FREE VERSION", "VERSIÓN GRATUITA", "النسخة المجانية")}
        </span>
      </section>

      <div className="space-stats">
        <article>
          <span className="space-stat-icon stat-blue">
            <BookOpen size={18} />
          </span>
          <span className="mini-kicker">{trL(lang, "LEÇONS", "LESSONS", "LECCIONES", "الدروس")}</span>
          <strong>
            {completedCount}
            <small> / {lessons.length}</small>
          </strong>
          <p>{trL(lang, "Chaque pas compte.", "Every step counts.", "Cada paso cuenta.", "كل خطوة تُحسب.")}</p>
        </article>
        <article>
          <span className="space-stat-icon stat-gold">
            <Star size={18} />
          </span>
          <span className="mini-kicker">{trL(lang, "POINTS", "POINTS", "PUNTOS", "النقاط")}</span>
          <strong>
            {xp}
            <small> XP</small>
          </strong>
          <p>{trL(lang, "Gagnés en pratiquant.", "Earned by practicing.", "Ganados practicando.", "تُكتسب بالتدريب.")}</p>
        </article>
        <article>
          <span className="space-stat-icon stat-orange">
            <Flame size={18} />
          </span>
          <span className="mini-kicker">{trL(lang, "RYTHME", "PACE", "RITMO", "الإيقاع")}</span>
          <strong>
            {streak}
            <small> {trL(lang, "jour", "day", "día", "يوم")}{streak > 1 ? tr("s", "s", "s", "") : ""}</small>
          </strong>
          <p>{trL(lang, "La régularité avant tout.", "Consistency above all.", "La constancia ante todo.", "الاستمرارية أولاً.")}</p>
        </article>
      </div>

      <div className="space-data-grid">
        <article className="data-card">
          <div className="data-card-heading">
            <span className="data-icon">
              <LockKeyhole size={18} />
            </span>
            <div>
              <span className="mini-kicker">{trL(lang, "TES DONNÉES", "YOUR DATA", "TUS DATOS", "بياناتك")}</span>
              <h3>{trL(lang, "Progression & Confidentialité", "Progress & Privacy", "Progreso y privacidad", "التقدم والخصوصية")}</h3>
            </div>
          </div>
          <p>
            {tr("La progression est sécurisée. Si tu te connectes, tes leçons, favoris et points se synchronisent automatiquement sur tous tes appareils.", "Your progress is secure. If you sign in, your lessons, favorites and points sync automatically across all your devices.", "Tu progreso está seguro. Si inicias sesión, tus lecciones, favoritos y puntos se sincronizan automáticamente en todos tus dispositivos.", "تقدمك محمي. عند تسجيل الدخول، تتزامن دروسك ومفضلاتك ونقاطك تلقائياً عبر جميع أجهزتك.")}
          </p>
          <div className="data-safe-row">
            <CheckCircle2 size={15} />
            <span>{tr("PWA Hors-Ligne · Sauvegarde Hybride Local & Supabase", "Offline PWA · Hybrid Local & Supabase Backup", "PWA sin conexión · Copia de seguridad híbrida local y Supabase", "تطبيق PWA دون اتصال · نسخ احتياطي هجين محلي وSupabase")}</span>
          </div>
          {!isPremium && (
            <button className="outline-button" onClick={onOpenPaywall}>
              {trL(lang, "Passer à Kenza Pro", "Go Kenza Pro", "Pasar a Kenza Pro", "انتقل إلى كنزة برو")} <ArrowRight size={14} />
            </button>
          )}
        </article>

        <article className="data-card data-card-cert">
          <div className="data-card-heading">
            <span className="data-icon certificate-icon">
              <Award size={18} />
            </span>
            <div>
              <span className="mini-kicker">{trL(lang, "CERTIFICATS", "CERTIFICATES", "CERTIFICADOS", "الشهادات")}</span>
              <h3>{trL(lang, "Passeport Culturel", "Cultural passport", "Pasaporte cultural", "الجواز الثقافي")}</h3>
            </div>
          </div>
          <p>
            {tr("Valide les examens de palier pour obtenir tes visas officiels du Passeport Darija et les télécharger en haute résolution.", "Pass the level exams to earn your official Darija Passport visas and download them in high resolution.", "Supera los exámenes de nivel para obtener tus visados oficiales del Pasaporte Darija y descargarlos en alta resolución.", "اجتز اختبارات المستويات للحصول على تأشيرات جواز الدارجة الرسمية وتحميلها بدقة عالية.")}
          </p>
          <div className="py-2">
            <DarijaPassportCard data={passportData} />
          </div>
        </article>
      </div>

      <div className="space-settings">
        <div>
          <span className="mini-kicker">{trL(lang, "GESTION DU COMPTE", "ACCOUNT", "GESTIÓN DE CUENTA", "إدارة الحساب")}</span>
          <h3>{trL(lang, "Repartir de zéro", "Start over", "Empezar de cero", "البدء من جديد")}</h3>
          <p>{trL(lang, "Réinitialise les leçons, points et favoris sur cet appareil.", "Reset lessons, points and favorites on this device.", "Reinicia lecciones, puntos y favoritos en este dispositivo.", "صفّر الدروس والنقاط والمفضلة على هذا الجهاز.")}</p>
        </div>
        <button className="outline-button danger-outline" onClick={onReset}>
          {tr("Effacer ma progression locale", "Erase my local progress", "Borrar mi progreso local", "حذف تقدمي المحلي")}
        </button>
      </div>

      <div className="future-note">
        <span>
          <Sparkles size={16} />
        </span>
        <p>
          <strong>Kenza Pro :</strong> {tr("Accède à l'intégralité des modules B1 & B2, aux dialogues IA illimités et aux visas de certification culturels.", "Get access to all B1 & B2 modules, unlimited AI dialogues and cultural certification visas.", "Accede a la totalidad de los módulos B1 y B2, diálogos IA ilimitados y visados de certificación culturales.", "احصل على وصول كامل لوحدات B1 وB2، وحوارات الذكاء الاصطناعي غير المحدودة، وتأشيرات الشهادات الثقافية.")}
        </p>
      </div>
    </div>
  );
}

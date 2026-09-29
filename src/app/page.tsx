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
import { playAudio } from "@/lib/audio";
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

const baseLessons: Lesson[] = [
  {
    id: "hello",
    title: tr("Les premiers bonjours", "The first hellos", "Los primeros saludos", "أول التحيات"),
    subtitle: tr("Saluer, se présenter, créer le lien", "Greet, introduce yourself, connect", "Saludar, presentarse, crear el vínculo", "التحية والتعاريف وبناء الرابط"),
    length: "6 min",
    status: "current",
    questions: [
      {
        prompt: "Comment dit-on « bonjour » en darija ?",
        helper: "Choisis la formule la plus naturelle.",
        options: ["Salam", "Shukran", "Bslama"],
        answer: "Salam",
        note: "« Salam » veut dire paix. C’est le bonjour simple, chaleureux et passe-partout.",
      },
      {
        prompt: "Tu rencontres quelqu’un pour la première fois. Que dis-tu ?",
        helper: "Pense à une formule de bienvenue.",
        options: ["Labas?", "Tsharrafna", "Afak"],
        answer: "Tsharrafna",
        note: "« Tsharrafna » signifie littéralement « enchanté·e ». Une belle façon de faire connaissance.",
      },
      {
        prompt: "Que signifie « labas? »",
        helper: "Une question qu’on entend partout.",
        options: ["Où vas-tu ?", "Ça va ?", "À demain"],
        answer: "Ça va ?",
        note: "« Labas? » est le petit « ça va ? » du quotidien. On répond souvent « labas, hamdullah ».",
      },
    ],
  },
  {
    id: "cafe",
    title: "Au café du coin",
    subtitle: "Commander un thé à la menthe",
    length: "8 min",
    status: "locked",
    questions: [
      {
        prompt: "Comment demander un thé, s’il vous plaît ?",
        helper: "Une formule utile au café.",
        options: ["Atay, afak", "Fin ghadi?", "Smah liya"],
        answer: "Atay, afak",
        note: "« Atay, afak » : un thé, s’il vous plaît. « Afak » ajoute la politesse.",
      },
      {
        prompt: "Qu’est-ce que « bghit » veut dire ?",
        helper: "Un mot très pratique pour commander.",
        options: ["Je voudrais", "J’ai faim", "C’est loin"],
        answer: "Je voudrais",
        note: "« Bghit » veut dire « je veux » ou « je voudrais », selon le contexte.",
      },
    ],
  },
  {
    id: "medina",
    title: "Se repérer dans la médina",
    subtitle: "Demander son chemin sans stress",
    length: "7 min",
    status: "locked",
    questions: [
      {
        prompt: "Comment demander « où est… ? »",
        helper: "La phrase qui débloque une promenade.",
        options: ["Fin kayn…?", "Chhal hadi?", "Mumkin…?"],
        answer: "Fin kayn…?",
        note: "« Fin kayn…? » signifie « où se trouve… ? ». Ajoute le lieu que tu cherches.",
      },
      {
        prompt: "Que signifie « yallah » ?",
        helper: "Un mot qu’on entend souvent.",
        options: ["Allons-y", "Peut-être", "Merci beaucoup"],
        answer: "Allons-y",
        note: "« Yallah » invite à partir, à avancer, ou simplement à se lancer.",
      },
    ],
  },
  {
    id: "marrakech",
    title: "Négocier au souk de Marrakech",
    subtitle: "Les nombres et les prix (Niveau A2)",
    length: "9 min",
    status: "locked",
    isPremium: true,
    questions: [
      {
        prompt: "Comment demander « Combien coûte ceci ? »",
        helper: "Expression clé pour entamer la discussion.",
        options: ["Bchhal hada?", "Fin mchiti?", "Labas 3lik?"],
        answer: "Bchhal hada?",
        note: "« Bchhal hada? » permet de demander le prix de n'importe quel article.",
      },
      {
        prompt: "Que veut dire « Naqas chwiya 3afak » ?",
        helper: "La formule cordiale de marchandage.",
        options: ["Baisse un peu s'il te plaît", "Donne-moi deux verres", "C'est trop beau"],
        answer: "Baisse un peu s'il te plaît",
        note: "« Naqas chwiya » = réduis un peu. Utilisé avec le sourire !",
      },
    ],
  },
  {
    id: "tanger",
    title: "Voyage à Tanger (Chamali)",
    subtitle: "Les subtilités régionales (Niveau B2)",
    length: "10 min",
    status: "locked",
    isPremium: true,
    questions: [
      {
        prompt: "À Tanger, comment dit-on « Qu'est-ce que tu veux ? »",
        helper: "Remplace le standard « Chno bghiti ».",
        options: ["Chni katchof?", "Chni katsaksi?", "Chni khassek?"],
        answer: "Chni khassek?",
        note: "Dans le nord (Chamali), on utilise « Chni » au lieu de « Chno ».",
      },
    ],
  },
];

const defaultPhrases: Phrase[] = [
  { id: "salam", category: "Saluer", darija: "Salam, labas?", arabic: "سلام، لاباس؟", meaning: "Salut, ça va ?", note: "La formule la plus simple pour ouvrir une conversation." },
  { id: "bikhir", category: "Saluer", darija: "Labas, hamdullah.", arabic: "لاباس، الحمد لله.", meaning: "Ça va, merci / Dieu merci.", note: "La réponse classique à « labas? »." },
  { id: "afak", category: "Au café", darija: "Wahed atay, afak.", arabic: "واحد أتاي، عفاك.", meaning: "Un thé, s’il vous plaît.", note: "« Wahed » = un, « atay » = thé, « afak » = s’il te plaît." },
  { id: "bghit", category: "Au café", darija: "Bghit lma, afak.", arabic: "بغيت الما، عفاك.", meaning: "Je voudrais de l’eau, s’il vous plaît.", note: "Remplace « lma » par ce que tu aimerais commander." },
  { id: "fin", category: "Se déplacer", darija: "Fin kayn souk?", arabic: "فين كاين السوق؟", meaning: "Où est le souk ?", note: "Utilise cette structure pour demander un lieu." },
  { id: "shukran", category: "Les essentiels", darija: "Shukran bzaf!", arabic: "شكرا بزاف!", meaning: "Merci beaucoup !", note: "« Bzaf » signifie beaucoup — un mot qui sert partout." },
  { id: "smah", category: "Les essentiels", darija: "Smah liya.", arabic: "سمح ليا.", meaning: "Excuse-moi / pardon.", note: "Pour attirer l’attention ou demander pardon, avec douceur." },
  { id: "bslama", category: "Saluer", darija: "Bslama, nshawfek.", arabic: "بسلامة، نشوفك.", meaning: "Au revoir, à bientôt.", note: "Une façon amicale de prendre congé." },
];

const navItems: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "today", label: "Aujourd’hui", icon: HomeIcon },
  { id: "path", label: "Mon parcours", icon: Compass },
  { id: "phrases", label: "Carnet de phrases", icon: Bookmark },
  { id: "review", label: tr("Révision du jour", "Today’s review", "Revisión del día", "مراجعة اليوم"), icon: Sparkles },
];

export default function Home() {
  const [view, setView] = useState<View>("today");
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tout voir");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      showToast("Impossible d'initier la connexion Google.");
    }
  };

  const [checkpointOpen, setCheckpointOpen] = useState<{ id: string; name: string } | null>(null);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(null);
  const [pricingSource, setPricingSource] = useState<string | null>(null);

  // 1. Sécurisation absolue de favorites (Null-Safety)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kenza_favorites");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          return;
        }
      }
    } catch {}
    setFavorites([]);
  }, []);

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
    const upgradeStatus = searchParams.get("upgrade");
    if (upgradeStatus === "success") {
      setIsPremium(true);
      showToast("Félicitations ! Votre abonnement Kenza Pro est activé.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setIsPremium]);

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
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // 2. Adaptateur universel pour les phrases (Format Manus ↔ Format KENZA)
  const allPhrases: Phrase[] = useMemo(() => {
    const rawVocabulary = (srsVocabulary || []).slice(0, 40).map((w, idx) => {
      let meaningText = "Expression en darija";
      if (typeof (w as any).translation === "string") {
        meaningText = (w as any).translation;
      } else if ((w as any).translation && typeof (w as any).translation === "object") {
        meaningText = (w as any).translation.fr || (w as any).translation.en || "Expression en darija";
      } else if ((w as any).translations?.fr) {
        meaningText = (w as any).translations.fr;
      } else if (typeof (w as any).back === "string") {
        meaningText = (w as any).back;
      }

      let cat = "Les essentiels";
      if (w.category === "polite_social") cat = "Saluer";
      else if (w.category === "food_drink") cat = "Au café";
      else if (w.category === "directions") cat = "Se déplacer";
      else if (w.category) cat = w.category;

      return {
        id: w.id || `vocab_${idx}`,
        category: cat,
        darija: w.arabizi || (w as any).front || "",
        arabic: w.arabic || "",
        meaning: meaningText,
        note: (w.example?.arabizi ? `Ex: ${w.example.arabizi}` : "") || "Vocabulaire du quotidien avec audio naturel.",
      };
    });

    const combined: any[] = [...defaultPhrases];
    for (const v of rawVocabulary) {
      if (v.darija && !combined.some((p) => (p.darija || p.front || "").toLowerCase() === (v.darija || "").toLowerCase())) {
        combined.push(v);
      }
    }

    return combined.map((p) => {
      let meaningStr = "Expression en darija";
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
        id: String(p.id || Math.random()),
        category: String(p.category || "Les essentiels"),
        darija: String(p.darija || p.front || p.arabizi || ""),
        arabic: String(p.arabic || ""),
        meaning: String(meaningStr || "Expression en darija"),
        note: String(p.note || p.notes || ""),
      };
    });
  }, []);

  const completedCount = completedLessons.length;
  const nextLesson =
    baseLessons.find((lesson) => !completedLessons.includes(lesson.id)) ??
    baseLessons[baseLessons.length - 1];
  const activeLesson = baseLessons.find((lesson) => lesson.id === lessonId) ?? null;
  const activeQuestion = activeLesson?.questions[questionIndex] ?? null;

  // 4. Sécurisation de la liste des catégories
  const categories = useMemo(() => {
    return ["Tout voir", ...Array.from(new Set(allPhrases.map((phrase) => phrase.category).filter(Boolean)))];
  }, [allPhrases]);

  // 3. Sécurisation de la recherche textuelle
  const filteredPhrases = useMemo(() => {
    const searchLower = (search || "").toLowerCase().trim();
    return allPhrases.filter((phrase) => {
      const matchesCategory = category === "Tout voir" || phrase.category === category;
      const searchTarget = `${phrase.darija || ""} ${phrase.arabic || ""} ${phrase.meaning || ""} ${phrase.category || ""}`.toLowerCase();
      const matchesSearch = !searchLower || searchTarget.includes(searchLower);
      const matchesFavorite = !favoritesOnly || safeFavorites.includes(phrase.id);
      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [category, search, favoritesOnly, safeFavorites, allPhrases]);

  const showToast = (message: string) => setToast(message);

  const startLesson = (id: string) => {
    const lesson = baseLessons.find((item) => item.id === id);
    if (!lesson) return;

    // Premium gating check
    if (lesson.isPremium && !isPremium) {
      setPricingSource("module_locked");
      return;
    }

    const index = baseLessons.findIndex((item) => item.id === id);
    const canStart =
      index === 0 ||
      completedLessons.includes(baseLessons[index - 1].id) ||
      completedLessons.includes(id);

    if (!canStart) {
      showToast("Termine la leçon précédente pour continuer ton parcours.");
      return;
    }

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
      completeLesson(activeLesson.id);
      addXp(activeLesson.questions.length * 10);
    }

    setLessonId(null);
    setSelectedAnswer(null);
    showToast(
      firstCompletion
        ? `Bravo ! Leçon terminée · +${activeLesson.questions.length * 10} XP`
        : "Leçon revue avec succès."
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
    showToast("Prononciation audio de la phrase.");
  };

  const copyPhrase = async (phrase: Phrase) => {
    try {
      const text = `${phrase.darija || ""} ${phrase.arabic ? `(${phrase.arabic})` : ""} — ${phrase.meaning || ""}`.trim();
      await navigator.clipboard.writeText(text);
      showToast("Phrase copiée dans le presse-papiers.");
    } catch {
      showToast("Copie indisponible.");
    }
  };

  const gradeReview = (grade: "again" | "hard" | "good" | "easy") => {
    const award = grade === "easy" ? 5 : grade === "good" ? 3 : grade === "hard" ? 2 : 1;
    addXp(award);
    setCardFlipped(false);
    setReviewIndex((current) => current + 1);
    showToast(
      `Noté : ${grade === "again" ? "à revoir" : grade === "hard" ? "difficile" : grade === "good" ? "bien" : "facile"} · +${award} XP`
    );
  };

  const resetProgress = () => {
    const confirmed = window.confirm("Effacer la progression locale sur cet appareil ?");
    if (!confirmed) return;
    resetData();
    localStorage.removeItem("kenza_favorites");
    setFavorites([]);
    showToast("Progression locale réinitialisée.");
  };

  const switchView = (next: View) => {
    setView(next);
    setMobileMenuOpen(false);
  };

  const headerTitle: Record<View, { eyebrow: string; title: string; description: string }> = {
    today: {
      eyebrow: tr("TON ESPACE D’APPRENTISSAGE", "YOUR LEARNING SPACE", "TU ESPACIO DE APRENDIZAJE", "فضاء تعلمك"),
      title: tr("Salam, on s’y remet ?", "Salam, shall we get going?", "Salam, ¿retomamos?", "سلام، نكمل؟"),
      description: tr("Un petit pas en darija aujourd’hui, une grande porte ouverte demain.", "A small step in darija today, a big door open tomorrow.", "Un pequeño paso en darija hoy, una gran puerta abierta mañana.", "خطوة صغيرة في الدارجة اليوم، وباب كبير مفتوح غداً."),
    },
    path: {
      eyebrow: tr("LE CHEMIN SE FAIT EN PARLANT", "THE PATH IS MADE BY SPEAKING", "EL CAMINO SE HACE HABLANDO", "الطريق يُصنع بالكلام"),
      title: tr("Ton parcours", "Your journey", "Tu recorrido", "مسارك"),
      description: tr("Des premiers mots aux conversations qui te ressemblent.", "From first words to conversations that feel like you.", "De las primeras palabras a conversaciones que te representen.", "من الكلمات الأولى إلى أحاديث تشبهك."),
    },
    phrases: {
      eyebrow: tr("LES MOTS QUI RAPPROCHENT", "WORDS THAT BRING US CLOSER", "PALABRAS QUE ACERCAN", "كلمات تُقرّب"),
      title: tr("Ton carnet de phrases", "Your phrase book", "Tu cuaderno de frases", "دفتر عباراتك"),
      description: tr("Des expressions utiles, vivantes, prêtes à t’accompagner.", "Useful, lively expressions, ready to go with you.", "Expresiones útiles y vivas, listas para acompañarte.", "عبارات مفيدة حيّة، جاهزة لمرافقتك."),
    },
    review: {
      eyebrow: tr("ANCRER, SANS SE PRESSER", "ANCHOR IN, NO RUSH", "ANCLAR, SIN PRISA", "ترسيخ، بلا استعجال"),
      title: tr("Révision du jour", "Today’s review", "Revisión del día", "مراجعة اليوم"),
      description: tr("Quelques cartes bien choisies pour laisser les mots s’installer.", "A few well-chosen cards to let the words settle.", "Algunas cartas bien elegidas para que las palabras se asienten.", "بعض البطاقات المنتقاة لتستقر الكلمات."),
    },
    space: {
      eyebrow: tr("UN ESPACE À TOI", "A SPACE OF YOUR OWN", "UN ESPACIO PARA TI", "فضاء لك"),
      title: "Mon espace & Passeport",
      description: "Ta progression et tes visas officiels, sous ton contrôle.",
    },
  };

  const currentHeader = headerTitle[view];

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
            <span className="brand-tagline">{tr("la darija, en chemin", "darija, one step at a time", "la darija, paso a paso", "الدارجة، على الطريق")}</span>
          </div>
          <button
            className="icon-button mobile-close"
            aria-label="Fermer le menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-label">{(t as any).side?.learn || "APPRENDRE"}</div>
        <nav className="side-nav" aria-label="Navigation principale">
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

        <div className="sidebar-label">{tr("EXPLORER", "EXPLORE", "EXPLORAR", "استكشف")}</div>
        <nav className="side-nav" aria-label="Ressources d'étude">
          <a href="/etudier" className="nav-item">
            <span>Étudier — Modules complets</span>
          </a>
          <a href="/grammaire" className="nav-item">
            <span>{tr("Grammaire active", "Active grammar", "Gramática activa", "القواعد النشطة")}</span>
          </a>
          <a href="/parler" className="nav-item">
            <span>{tr("Pratique orale", "Speaking practice", "Práctica oral", "تدريب النطق")}</span>
          </a>
          <a href="/revisions" className="nav-item">
            <span>{tr("Révisions SRS", "SRS review", "Repaso SRS", "مراجعة SRS")}</span>
          </a>
        </nav>

        <div className="sidebar-label sidebar-label-spaced">{(t as any).side?.oral || "PRATIQUE ORALE & IA"}</div>
        <button
          onClick={() => setShowScenarioSelector(true)}
          className="nav-item"
        >
          <MessageCircle size={19} strokeWidth={1.8} />
          <span>{tr("Roleplay IA", "AI roleplay", "Roleplay IA", "حوار مع الذكاء الاصطناعي")}</span>
        </button>

        <div className="sidebar-label sidebar-label-spaced">{(t as any).side?.space || "TON ESPACE"}</div>
        <button
          onClick={() => switchView("space")}
          className={`nav-item ${view === "space" ? "nav-item-active" : ""}`}
          aria-current={view === "space" ? "page" : undefined}
        >
          <Award size={19} strokeWidth={1.8} />
          <span>{tr("Mon Passeport", "My passport", "Mi pasaporte", "جوازي")}</span>
        </button>

        <div className="sidebar-spacer" />

        <div className="daily-goal-card">
          <div className="goal-orbit">
            <Target size={17} />
          </div>
          <div className="goal-topline">
            <span>{tr("TON RYTHME", "YOUR PACE", "TU RITMO", "إيقاعك")}</span>
            <span>{Math.min(100, Math.round(((completedCount * 3) / 10) * 100))}%</span>
          </div>
          <strong>{tr("10 minutes par jour", "10 minutes a day", "10 minutos al día", "10 دقائق يومياً")}</strong>
          <div className="goal-track">
            <span style={{ width: `${Math.min(100, ((completedCount * 3) / 10) * 100)}%` }} />
          </div>
          <button
            onClick={() => showToast("Objectif quotidien : 10 minutes de pratique chaque jour.")}
            className="goal-link"
          >
            {tr("Ajuster l’objectif", "Adjust goal", "Ajustar objetivo", "عدّل الهدف")} <ArrowRight size={14} />
          </button>
        </div>

        <div className="sidebar-footer">
          <span className="privacy-dot" />
          <span>{user ? user.email?.split("@")[0] : "Mode Invité actif"}</span>
          <button
            aria-label="En savoir plus sur les données"
            onClick={() => switchView("space")}
          >
            <CircleHelp size={14} />
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="mobile-scrim"
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Area */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-trigger"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>KENZA</span>
            <ChevronRight size={14} />
            <span>{currentHeader.eyebrow.toLocaleLowerCase("fr")}</span>
          </div>
          <div className="topbar-actions">
            {/* Sélecteur de langue bilingue */}
            <div className="lang-switcher" role="group" aria-label="Sélecteur de langue">
              <Globe size={13} className="lang-icon" />
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`lang-btn ${uiLanguage === "fr" ? "lang-btn-active" : ""}`}
                aria-label="Passer en français"
              >
                FR
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`lang-btn ${uiLanguage === "en" ? "lang-btn-active" : ""}`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`lang-btn ${uiLanguage === "es" ? "lang-btn-active" : ""}`}
                aria-label="Cambiar a español"
              >
                ES
              </button>
              <span className="lang-sep">|</span>
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={`lang-btn ${uiLanguage === "ar" ? "lang-btn-active" : ""}`}
                aria-label="Passer en arabe"
              >
                AR
              </button>
            </div>

            {/* Toggle Son */}
            <button
              className="sound-toggle"
              onClick={toggleSound}
              title={soundEnabled ? "Audio activé" : "Audio muet"}
              aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
            >
              <Headphones size={15} />
              <span>{soundEnabled ? "Son actif" : "Son coupé"}</span>
            </button>

            {/* Connexion Google & Profil */}
            {user ? (
              <button
                className="top-avatar"
                aria-label="Ouvrir mon espace"
                onClick={() => switchView("space")}
                title={user.email || "Mon profil"}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || "Profil"}
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
                aria-label="Se connecter avec Google"
                title="Se connecter avec Google"
              >
                <svg className="google-icon" width="13" height="13" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 10.02 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{tr("Se connecter", "Sign in", "Iniciar sesión", "تسجيل الدخول")}</span>
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
                {new Intl.DateTimeFormat("fr-FR", {
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
            <span>{tr("Apprendre une langue, c’est rencontrer des gens.", "Learning a language is meeting people.", "Aprender un idioma es conocer gente.", "تعلم اللغة لقاءٌ بالناس.")}</span>
            <button onClick={() => switchView("space")}>
              Passeport Culturel & Données <ArrowRight size={13} />
            </button>
          </footer>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Visible sous 900px) */}
      <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
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
                  ? "Accueil"
                  : item.id === "path"
                  ? "Parcours"
                  : item.id === "phrases"
                  ? "Phrases"
                  : "Réviser"}
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
              <button onClick={() => setLessonId(null)} className="icon-button" aria-label="Fermer la leçon">
                <ArrowLeft size={19} />
              </button>
              <div className="lesson-progress-label">
                <span>LEÇON · {activeLesson.length.toUpperCase()}</span>
                <span>
                  {questionIndex + 1} / {activeLesson.questions.length}
                </span>
              </div>
              <button onClick={() => setLessonId(null)} className="icon-button" aria-label="Quitter">
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
                    {selectedAnswer === activeQuestion.answer ? "Bien joué !" : "Presque — retiens ceci."}
                  </strong>
                  <span>{activeQuestion.note}</span>
                </div>
              )}
              <button
                className="primary-button lesson-next"
                onClick={advanceQuestion}
                disabled={!selectedAnswer}
              >
                {questionIndex === activeLesson.questions.length - 1 ? tr("Terminer la leçon", "Finish the lesson", "Terminar la lección", "أنهِ الدرس") : tr("Continuer", "Continue", "Continuar", "متابعة")}
                <ArrowRight size={17} />
              </button>
              <div className="local-note">
                <LockKeyhole size={13} /> Progression enregistrée en direct sur ton profil.
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
          <button aria-label="Fermer" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
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
  const totalLessons = baseLessons.length;

  return (
    <>
      <div className="today-grid">
        <article className="hero-panel">
          <div className="hero-texture" />
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} /> {tr("TON PETIT MOMENT DARIJA", "YOUR LITTLE DARIJA MOMENT", "TU MOMENTO DARIJA", "لحظتك مع الدارجة")}
            </span>
            <h2>
              {tr("La darija", "Darija", "La darija", "الدارجة")}
              <br />
              {tr("s’ouvre à toi.", "opens up to you.", "se abre a ti.", "تنفتح عليك.")}
            </h2>
            <p>{tr("Une phrase, une rencontre, une autre façon de voir le Maroc.", "A phrase, an encounter, another way to see Morocco.", "Una frase, un encuentro, otra forma de ver Marruecos.", "عبارة، لقاء، وطريقة أخرى لرؤية المغرب.")}</p>
            <button className="hero-button" onClick={() => onStart(nextLesson.id)}>
              {tr("Continuer à apprendre", "Keep learning", "Seguir aprendiendo", "واصل التعلم")} <ArrowRight size={16} />
            </button>
            <div className="hero-footnote">
              <span className="hero-foot-line" /> {tr("À ton rythme, toujours.", "At your pace, always.", "A tu ritmo, siempre.", "على إيقاعك، دائماً.")}
            </div>
          </div>
          <div className="hero-image-wrap" aria-hidden="true">
            <img
              className="hero-image"
              src="/manus-storage/kenza-hero_99e35384.jpg"
              alt="Maroc médina"
            />
            <div className="hero-image-wash" />
            <div className="hero-image-caption">
              <span>دَارِيجة</span>
              <small>{tr("darija, la langue du lien", "darija, the language of connection", "darija, la lengua del vínculo", "الدارجة، لغة التواصل")}</small>
            </div>
          </div>
          <div className="hero-medallion" aria-hidden="true">
            <span>مرحبا</span>
            <small>marhba</small>
          </div>
        </article>

        <article className="next-card">
          <div className="next-card-head">
            <span className="mini-kicker">{tr("TA PROCHAINE ÉTAPE", "YOUR NEXT STEP", "TU PRÓXIMO PASO", "خطوتك التالية")}</span>
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
              alt="Thé à la menthe"
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
            <span className="lesson-pill">{tr("LEÇON SUIVANTE", "NEXT LESSON", "PRÓXIMA LECCIÓN", "الدرس التالي")} · {nextLesson.length}</span>
            <h3>{nextLesson.title}</h3>
            <p>{nextLesson.subtitle}</p>
          </div>
          <button className="text-link" onClick={() => onStart(nextLesson.id)}>
            {tr("C’est parti", "Let’s go", "¡Vamos!", "هيا بنا")} <ArrowRight size={15} />
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
            <span>{tr("leçons terminées", "lessons completed", "lecciones completadas", "دروس مكتملة")}</span>
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
            <span>{tr("points de pratique", "practice points", "puntos de práctica", "نقاط التدريب")}</span>
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
              <small> {tr("jour", "day", "día", "يوم")}{streak > 1 ? "s" : ""}</small>
            </strong>
            <span>{tr("rythme régulier", "steady rhythm", "ritmo constante", "إيقاع منتظم")}</span>
          </div>
        </div>
        <button className="stat-action" onClick={() => onNavigate("space")}>
          {tr("Voir mon espace", "See my space", "Ver mi espacio", "فضائي")} <ArrowRight size={14} />
        </button>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {tr("POUR AUJOURD’HUI", "FOR TODAY", "PARA HOY", "لهذا اليوم")}
          </span>
          <h2>{tr("À toi de choisir ton pas.", "Your pace, your choice.", "Tú eliges tu paso.", "اختر خطوتك.")}</h2>
        </div>
        <button className="plain-link" onClick={() => onNavigate("path")}>
          {tr("Voir le parcours", "View the journey", "Ver la ruta", "المسار")} <ArrowRight size={15} />
        </button>
      </div>

      <div className="quick-grid">
        <button className="quick-card quick-card-phrases" onClick={() => onNavigate("phrases")}>
          <span className="quick-icon">
            <Bookmark size={18} />
          </span>
          <span className="quick-label">{tr("UN MOT À EMPORTER", "A WORD TO GO", "UNA PALABRA PARA LLEVAR", "كلمة معك")}</span>
          <strong>
            {tr("Ton carnet", "Your phrase", "Tu cuaderno", "دفترك")}
            <br />
            {tr("de phrases", " book", " de frases", " للعبارات")}
          </strong>
          <span className="quick-bottom">
            {tr("Vocabulaire essentiel", "Essential vocabulary", "Vocabulario esencial", "مفردات أساسية")} <ArrowRight size={14} />
          </span>
        </button>

        <button className="quick-card quick-card-review" onClick={() => onNavigate("review")}>
          <span className="quick-icon">
            <Sparkles size={18} />
          </span>
          <span className="quick-label">{tr("5 MINUTES, PAS PLUS", "5 MINUTES, NO MORE", "5 MINUTOS, NO MÁS", "5 دقائق فقط")}</span>
          <strong>
            {tr("Faire une", "Do a quick", "Haz una", "قم بمراجعة")}
            <br />
            {tr("petite révision", "review", "revisión rápida", "سريعة")}
          </strong>
          <span className="quick-bottom">
            {tr("Cartes du jour", "Cards of the day", "Cartas del día", "بطاقات اليوم")} <ArrowRight size={14} />
          </span>
        </button>

        <button className="quick-card quick-card-listen" onClick={onOpenRoleplay}>
          <span className="quick-icon">
            <MessageCircle size={18} />
          </span>
          <span className="quick-label">{tr("IMMERSION IA", "AI IMMERSION", "INMERSIÓN IA", "انغماس مع الذكاء")}</span>
          <strong>
            {tr("Mises en", "Real-life", "Situaciones", "مواقف")}
            <br />
            {tr("situation", "scenarios", "de la vida real", "من الحياة")}
          </strong>
          <span className="quick-bottom">
            {tr("Au café, en taxi", "At the café, in a taxi", "En el café, en taxi", "في المقهى وفي التاكسي")} <ArrowRight size={14} />
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
          <span className="mini-kicker">{tr("UNE LANGUE, DES RENCONTRES", "A LANGUAGE, ENCOUNTERS", "UN IDIOMA, ENCUENTROS", "لغةٌ ولقاءات")}</span>
          <h3>
            Pas besoin d’être parfait·e.
            <br />
            <em>{tr("Il suffit de commencer.", "Just start.", "Solo empieza.", "ابدأ فقط.")}</em>
          </h3>
          <p>Chaque expression est une petite invitation à aller vers l’autre.</p>
        </div>
        <button onClick={() => onNavigate("path")} aria-label="Explorer le parcours">
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
  const { hasPassedLevel } = useCheckpointProgress();

  return (
    <div className="path-layout">
      <section className="path-main-card">
        <div className="path-banner">
          <div>
            <span className="hero-kicker">
              <Compass size={14} /> PARCOURS DÉCOUVERTE
            </span>
            <h2>
              Les premiers pas
              <br />
              en darija.
            </h2>
            <p>{tr("Trois escales pour oser dire les premiers mots.", "Three stops to dare your first words.", "Tres paradas para atreverte a hablar.", "ثلاث محطات لتبدأ كلماتك الأولى.")}</p>
          </div>
          <div className="path-stamp">
            <span>المغرب</span>
            <small>Maroc</small>
          </div>
          <div className="path-doodle" />
        </div>

        <div className="path-progress-row">
          <div>
            <span className="mini-kicker">{tr("TON AVANCÉE", "YOUR PROGRESS", "TU AVANCE", "تقدّمك")}</span>
            <strong>
              {completedLessons.length}{" "}
              <small>
                leçon{completedLessons.length > 1 ? "s" : ""} sur {baseLessons.length}
              </small>
            </strong>
          </div>
          <div className="path-overall-track">
            <span
              style={{
                width: `${Math.round((completedLessons.length / baseLessons.length) * 100)}%`,
              }}
            />
          </div>
          <span className="path-percent">
            {Math.round((completedLessons.length / baseLessons.length) * 100)}%
          </span>
        </div>

        <div className="lesson-roadmap">
          {baseLessons.map((lesson, index) => {
            const done = completedLessons.includes(lesson.id);
            const unlocked =
              index === 0 || completedLessons.includes(baseLessons[index - 1].id) || done;
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
                        ? `Revoir ${lesson.title}`
                        : locked
                        ? `${lesson.title}, verrouillée`
                        : `Commencer ${lesson.title}`
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
                        ? "LES ESSENTIELS"
                        : index === 1
                        ? "AU QUOTIDIEN"
                        : index === 2
                        ? "SE REPÉRER"
                        : "IMMERSION AVANCÉE"}
                    </span>
                    {done && (
                      <span className="done-tag">
                        <CheckCircle2 size={13} /> TERMINÉE
                      </span>
                    )}
                    {!done && !locked && !isGated && (
                      <span className="current-tag">{tr("À SUIVRE", "TO CONTINUE", "A CONTINUAR", "للمتابعة")}</span>
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
                      <BookOpen size={14} /> {lesson.questions.length} exercices
                    </span>
                    {isGated ? (
                      <button onClick={onOpenPaywall} style={{ color: "#d69b47" }}>
                        Débloquer avec Pro <ArrowRight size={14} />
                      </button>
                    ) : unlocked ? (
                      <button onClick={() => onStart(lesson.id)}>
                        {done ? "Revoir" : "Commencer"}
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="locked-copy">
                        <LockKeyhole size={13} /> Finis l’étape avant
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
          <span className="mini-kicker">{tr("PETIT CONSEIL", "QUICK TIP", "PEQUEÑO CONSEJO", "نصيحة صغيرة")}</span>
          <h3>{tr("La régularité avant la perfection.", "Consistency beats perfection.", "La constancia antes que la perfección.", "الاستمرارية قبل الإتقان.")}</h3>
          <p>
            5 minutes par jour font plus qu’une heure de temps en temps. Reviens quand tu veux.
          </p>
          <div className="aside-divider" />
          <div className="aside-stat">
            <span>{tr("Palier A1 (Fondations)", "Level A1 (Foundations)", "Nivel A1 (Fundamentos)", "المستوى A1 (الأساسيات)")}</span>
            <strong>{hasPassedLevel("1") ? "Validé ✓" : "En cours"}</strong>
          </div>
          <button
            onClick={() => onOpenCheckpoint("1", "Palier A1 — Fondations")}
          >
            Passer le Checkpoint A1 <ArrowRight size={14} />
          </button>
        </div>

        <div className="path-aside-note">
          <span className="note-symbol">✳</span>
          <p>
            Le mot <strong>darija</strong> vient de l’arabe <span dir="rtl">الدارجة</span> — la
            langue courante, celle de tous les jours.
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
            placeholder="Chercher une expression…"
            aria-label="Chercher une expression"
          />
          <kbd>⌘ K</kbd>
        </label>
        <button
          className={`favorites-filter ${favoritesOnly ? "filter-active" : ""}`}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} /> Mes favoris{" "}
          <span>{safeFavorites.length}</span>
        </button>
      </section>

      <div className="category-tabs" role="tablist" aria-label="Catégories de phrases">
        {(categories || []).map((item) => (
          <button
            role="tab"
            aria-selected={category === item}
            key={item}
            className={category === item ? "category-active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="phrase-section-top">
        <div>
          <span className="mini-kicker">{tr("À PORTÉE DE MAIN", "AT HAND", "A MANO", "في متناول اليد")}</span>
          <h2>
            {favoritesOnly
              ? "Tes phrases favorites"
              : category === "Tout voir"
              ? "Les expressions du quotidien"
              : category}
          </h2>
        </div>
        <span className="phrase-count">
          {safePhrases.length} expression{safePhrases.length === 1 ? "" : "s"}
        </span>
      </div>

      {safePhrases.length > 0 ? (
        <div className="phrase-grid">
          {safePhrases.map((phrase, index) => {
            const isFav = safeFavorites.includes(phrase.id);
            const darijaText = phrase.darija || "";
            const arabicText = phrase.arabic || "";
            const meaningText = phrase.meaning || "";
            const categoryText = phrase.category || "Les essentiels";

            return (
              <article className="phrase-card" key={phrase.id}>
                <div className="phrase-card-top">
                  <span className="phrase-category">{categoryText}</span>
                  <button
                    className={`heart-button ${isFav ? "heart-active" : ""}`}
                    onClick={() => onFavorite(phrase.id)}
                    aria-label={
                      isFav ? "Retirer des favoris" : "Ajouter aux favoris"
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
                    <Volume2 size={15} /> Écouter
                  </button>
                  <button onClick={() => onCopy(phrase)}>
                    <Bookmark size={14} /> Copier
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
          <h3>{tr("Aucune phrase trouvée", "No phrase found", "Ninguna frase encontrada", "لا توجد عبارات")}</h3>
          <p>{tr("Essaie un autre mot ou change de catégorie.", "Try another word or category.", "Prueba otra palabra o categoría.", "جرّب كلمة أو فئة أخرى.")}</p>
          <button
            className="plain-link"
            onClick={() => {
              setSearch("");
              setCategory("Tout voir");
              setFavoritesOnly(false);
            }}
          >
            Effacer les filtres <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="phrase-footnote">
        <span className="privacy-dot" /> Synthèse vocale naturelle haute fidélité (Edge TTS) avec
        cache hors-ligne intégré.
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
  const cards = [
    {
      front: "Merci beaucoup",
      back: "Shukran bzaf",
      arabic: "شكرا بزاف!",
      hint: "Un petit mot chaleureux qui ouvre toutes les portes.",
    },
    {
      front: "Où est le souk ?",
      back: "Fin kayn souk?",
      arabic: "فين كاين السوق؟",
      hint: "Pour trouver ton chemin dans la médina.",
    },
    {
      front: "S’il vous plaît",
      back: "Afak",
      arabic: "عفاك",
      hint: "Un mot simple pour rendre tes demandes plus douces.",
    },
    {
      front: "Au revoir, à bientôt",
      back: "Bslama, nshawfek",
      arabic: "بسلامة، نشوفك",
      hint: "Une manière chaleureuse de se dire à bientôt.",
    },
    {
      front: "Je voudrais un thé",
      back: "Bghit wahed atay, afak",
      arabic: "بغيت واحد أتاي، عفاك",
      hint: "Pour savourer un moment au café.",
    },
  ];

  const card = cards[reviewIndex % cards.length];

  return (
    <div className="review-layout">
      <section className="review-main">
        <div className="review-card-top">
          <span className="mini-kicker">
            CARTE {String((reviewIndex % cards.length) + 1).padStart(2, "0")} <i>/</i> 0{cards.length}
          </span>
          <span className="review-session">
            <Sparkles size={14} /> Session tranquille
          </span>
        </div>
        <button
          className={`flashcard ${cardFlipped ? "flashcard-flipped" : ""}`}
          onClick={() => setCardFlipped(!cardFlipped)}
          aria-label={cardFlipped ? "Voir la question" : "Retourner la carte"}
        >
          <span className="flashcard-decoration decor-top">✳</span>
          <span className="flashcard-label">{cardFlipped ? "EN DARIJA" : "EN FRANÇAIS"}</span>
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
                <span className="rotate-symbol">↻</span> Touche pour révéler
              </span>
            </>
          )}
          <span className="flashcard-decoration decor-bottom">✳</span>
        </button>

        <div className="review-hint">
          <CircleHelp size={15} />
          <span>{tr("Réponds dans ta tête, puis retourne la carte pour vérifier.", "Answer in your head, then flip the card.", "Responde en tu mente y gira la tarjeta.", "أجب في ذهنك ثم اقلب البطاقة.")}</span>
        </div>

        <div className="review-ratings">
          <button className="rate-again" onClick={() => onGrade("again")}>
            <span>{tr("Encore", "Again", "Otra vez", "مرة أخرى")}</span>
            <small>+1 XP</small>
          </button>
          <button className="rate-hard" onClick={() => onGrade("hard")}>
            <span>{tr("Difficile", "Hard", "Difícil", "صعب")}</span>
            <small>+2 XP</small>
          </button>
          <button className="rate-good" onClick={() => onGrade("good")}>
            <span>{tr("Bien", "Good", "Bien", "جيد")}</span>
            <small>+3 XP</small>
          </button>
          <button className="rate-easy" onClick={() => onGrade("easy")}>
            <span>{tr("Facile", "Easy", "Fácil", "سهل")}</span>
            <small>+5 XP</small>
          </button>
        </div>
      </section>

      <aside className="review-aside">
        <div className="review-aside-card">
          <span className="aside-icon">
            <Sparkles size={18} />
          </span>
          <span className="mini-kicker">{tr("SANS PRESSION", "NO PRESSURE", "SIN PRESIÓN", "بدون ضغط")}</span>
          <h3>{tr("Le bon rythme, c’est le tien.", "The right pace is yours.", "El buen ritmo es el tuyo.", "الإيقاع المناسب هو إيقاعك.")}</h3>
          <p>
            L'algorithme de répétition espacée (SRS) consolide ta mémoire à long terme. Chaque point
            d'XP nourrit ton passeport.
          </p>
          <div className="aside-divider" />
          <div className="review-method">
            <span className="method-dot" />
            <p>
              <strong>{tr("Petit conseil", "Quick tip", "Pequeño consejo", "نصيحة")}</strong>
              <br />
              Dis la phrase à voix haute. La mémoire aime les histoires qu’on raconte.
            </p>
          </div>
        </div>
        <div className="review-alphabet">
          <span>أ ب ت</span>
          <p>Écoute · Répète · Reviens</p>
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
  const username =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Invité(e)";

  const passportData = {
    userName: username,
    levelName: xp >= 300 ? "Niveau A2 — Essentiels" : "Niveau A1 — Premiers Pas",
    score: Math.min(100, Math.round((xp / 500) * 100)),
    date: new Date().toLocaleDateString("fr-FR"),
    passportId: `KNZ-${user ? "PRO" : "DEMO"}-7421`,
  };

  return (
    <div className="space-layout">
      <section className="space-card space-profile">
        <div className="profile-avatar">
          {username[0]?.toUpperCase() || "ك"}
        </div>
        <div className="profile-intro">
          <span className="mini-kicker">{tr("MON COIN KENZA", "MY KENZA CORNER", "MI RINCÓN KENZA", "ركني في كنزة")}</span>
          <h2>Salam, {username} !</h2>
          <p>
            {user
              ? `Connecté en tant que ${user.email}. Données sauvegardées dans le cloud.`
              : "Mode Invité actif. Ta progression est préservée localement sur cet appareil."}
          </p>
        </div>
        <span className="local-badge">
          <span className="privacy-dot" /> {isPremium ? "MEMBRE KENZA PRO" : "VERSION GRATUITE"}
        </span>
      </section>

      <div className="space-stats">
        <article>
          <span className="space-stat-icon stat-blue">
            <BookOpen size={18} />
          </span>
          <span className="mini-kicker">{tr("LEÇONS", "LESSONS", "LECCIONES", "الدروس")}</span>
          <strong>
            {completedCount}
            <small> / {baseLessons.length}</small>
          </strong>
          <p>{tr("Chaque pas compte.", "Every step counts.", "Cada paso cuenta.", "كل خطوة تُحسب.")}</p>
        </article>
        <article>
          <span className="space-stat-icon stat-gold">
            <Star size={18} />
          </span>
          <span className="mini-kicker">{tr("POINTS", "POINTS", "PUNTOS", "النقاط")}</span>
          <strong>
            {xp}
            <small> XP</small>
          </strong>
          <p>{tr("Gagnés en pratiquant.", "Earned by practicing.", "Ganados practicando.", "تُكتسب بالتدريب.")}</p>
        </article>
        <article>
          <span className="space-stat-icon stat-orange">
            <Flame size={18} />
          </span>
          <span className="mini-kicker">{tr("RYTHME", "PACE", "RITMO", "الإيقاع")}</span>
          <strong>
            {streak}
            <small> {tr("jour", "day", "día", "يوم")}{streak > 1 ? "s" : ""}</small>
          </strong>
          <p>{tr("La régularité avant tout.", "Consistency above all.", "La constancia ante todo.", "الاستمرارية أولاً.")}</p>
        </article>
      </div>

      <div className="space-data-grid">
        <article className="data-card">
          <div className="data-card-heading">
            <span className="data-icon">
              <LockKeyhole size={18} />
            </span>
            <div>
              <span className="mini-kicker">{tr("TES DONNÉES", "YOUR DATA", "TUS DATOS", "بياناتك")}</span>
              <h3>{tr("Progression & Confidentialité", "Progress & Privacy", "Progreso y privacidad", "التقدم والخصوصية")}</h3>
            </div>
          </div>
          <p>
            La progression est sécurisée. Si tu te connectes, tes leçons, favoris et points se
            synchronisent automatiquement sur tous tes appareils.
          </p>
          <div className="data-safe-row">
            <CheckCircle2 size={15} />
            <span>PWA Hors-Ligne · Sauvegarde Hybride Local & Supabase</span>
          </div>
          {!isPremium && (
            <button className="outline-button" onClick={onOpenPaywall}>
              Passer à Kenza Pro <ArrowRight size={14} />
            </button>
          )}
        </article>

        <article className="data-card data-card-cert">
          <div className="data-card-heading">
            <span className="data-icon certificate-icon">
              <Award size={18} />
            </span>
            <div>
              <span className="mini-kicker">{tr("CERTIFICATS", "CERTIFICATES", "CERTIFICADOS", "الشهادات")}</span>
              <h3>{tr("Passeport Culturel", "Cultural passport", "Pasaporte cultural", "الجواز الثقافي")}</h3>
            </div>
          </div>
          <p>
            Valide les examens de palier pour obtenir tes visas officiels du Passeport Darija et les
            télécharger en haute résolution.
          </p>
          <div className="py-2">
            <DarijaPassportCard data={passportData} />
          </div>
        </article>
      </div>

      <div className="space-settings">
        <div>
          <span className="mini-kicker">{tr("GESTION DU COMPTE", "ACCOUNT", "GESTIÓN DE CUENTA", "إدارة الحساب")}</span>
          <h3>{tr("Repartir de zéro", "Start over", "Empezar de cero", "البدء من جديد")}</h3>
          <p>{tr("Réinitialise les leçons, points et favoris sur cet appareil.", "Reset lessons, points and favorites on this device.", "Reinicia lecciones, puntos y favoritos en este dispositivo.", "صفّر الدروس والنقاط والمفضلة على هذا الجهاز.")}</p>
        </div>
        <button className="outline-button danger-outline" onClick={onReset}>
          Effacer ma progression locale
        </button>
      </div>

      <div className="future-note">
        <span>
          <Sparkles size={16} />
        </span>
        <p>
          <strong>Kenza Pro :</strong> Accède à l'intégralité des modules B1 & B2, aux dialogues IA
          illimités et aux visas de certification culturels.
        </p>
      </div>
    </div>
  );
}

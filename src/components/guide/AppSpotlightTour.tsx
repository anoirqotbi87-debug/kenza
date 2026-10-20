'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  HelpCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Bookmark,
  Sparkles,
  Award,
  Home,
  MessageCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface AppSpotlightTourProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export type SpotlightStep = {
  id: string;
  tabKey: 'today' | 'path' | 'phrases' | 'review' | 'space';
  targetSelector: string; // fallback if element not found: central modal
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  badge: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  title: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  tagline: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  explanation: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  actionAdvice: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  screenshot: string;
};

export const SPOTLIGHT_STEPS: SpotlightStep[] = [
  {
    id: 'spotlight-today',
    tabKey: 'today',
    targetSelector: '[data-tour="today-tab"]',
    icon: Home,
    iconBg: 'bg-amber-100 text-amber-800',
    badge: {
      fr: 'Onglet 1 / 5 · Tableau de Bord',
      en: 'Tab 1 / 5 · Daily Dashboard',
      es: 'Pestaña 1 / 5 · Tablero Diario',
      ar: 'التبويب 1 / 5 · لوحة القيادة',
    },
    title: {
      fr: '🏠 Aujourd’hui : Votre Point de Départ',
      en: '🏠 Today: Your Daily Starting Point',
      es: '🏠 Hoy: Tu Punto de Partida',
      ar: '🏠 اليوم: نقطة انطلاقك اليومية',
    },
    tagline: {
      fr: 'La phrase du jour, votre série et le saut rapide vers la leçon en cours.',
      en: 'Daily sentence, streak tracker, and quick resume to your lesson.',
      es: 'La frase del día, tu racha y acceso rápido a tu lección actual.',
      ar: 'عبارة اليوم، عداد الالتزام، والوصول الفوري إلى درسك الحالي.',
    },
    explanation: {
      fr: 'Chaque jour en ouvrant Kenza, retrouvez votre progression, votre flamme de régularité et une phrase authentique prête à écouter à vitesse normale ou ralentie (0.75x). C\'est ici que vous démarrez vos 10 minutes quotidiennes.',
      en: 'Every day you open Kenza, find your progress, streak counter, and an authentic Moroccan phrase with native audio (1.0x & 0.75x). This is your home base for your daily 10-minute routine.',
      es: 'Cada día al abrir Kenza, consulta tu progreso, racha y una frase marroquí auténtica con audio nativo (1.0x y 0.75x). Aquí comienzas tus 10 minutos diarios.',
      ar: 'كل يوم عند فتح كنزة، تجد تقدمك وعداد التزامك وعبارة مغربية حية يمكنك الاستماع إليها بالسرعة العادية أو البطيئة (0.75x). هنا تبدأ روتينك اليومي في 10 دقائق.',
    },
    actionAdvice: {
      fr: '💡 Astuce : Écoutez la phrase 3 fois et répétez-la à haute voix pour délier votre langue.',
      en: '💡 Tip: Listen 3 times and repeat out loud to build mouth muscle memory.',
      es: '💡 Consejo: Escucha 3 veces y repite en voz alta para soltar la lengua.',
      ar: '💡 نصيحة: استمع للعبارة 3 مرات وكررها بصوت مسموع لتعويد لسانك على النطق.',
    },
    screenshot: '/guide/screen-today.png',
  },
  {
    id: 'spotlight-path',
    tabKey: 'path',
    targetSelector: '[data-tour="path-tab"]',
    icon: Compass,
    iconBg: 'bg-blue-100 text-blue-800',
    badge: {
      fr: 'Onglet 2 / 5 · Le Curriculum',
      en: 'Tab 2 / 5 · Learning Curriculum',
      es: 'Pestaña 2 / 5 · El Currículo',
      ar: 'التبويب 2 / 5 · المسار التعليمي',
    },
    title: {
      fr: '🗺️ Mon Parcours : Les Modules 1 à 7',
      en: '🗺️ My Journey: Step-by-Step Modules',
      es: '🗺️ Mi Ruta: Módulos del 1 al 7',
      ar: '🗺️ مساري: الوحدات من 1 إلى 7',
    },
    tagline: {
      fr: 'Progression linéaire et guidée du niveau grand débutant (A1) jusqu\'à l\'aisance orale.',
      en: 'Guided linear path from absolute beginner (A1) to conversational fluency.',
      es: 'Progresión guiada desde principiante absoluto (A1) hasta fluidez oral.',
      ar: 'تدرج تعليمي واضح من مستوى المبتدئ تماماً (A1) حتى الطلاقة الشفوية.',
    },
    explanation: {
      fr: 'C\'est le cœur pédagogique de Kenza. Chaque module se découpe en leçons courtes : dialogue audio réel, transcription arabe voyellée (chakl), écriture phonétique latine (Arabizi) et exercices interactifs de validation. Les Modules 1 & 2 sont 100% gratuits.',
      en: 'This is the learning engine of Kenza. Each module is split into bite-sized lessons: authentic audio dialogue, fully vocalized Arabic script, Latin phonetics (Arabizi), and interactive quizzes. Modules 1 & 2 are completely free.',
      es: 'El corazón pedagógico de Kenza. Cada módulo se divide en lecciones cortas con audio real, árabe con diacríticos, fonética latina (Arabizi) y ejercicios interactivos. Los módulos 1 y 2 son 100% gratuitos.',
      ar: 'جوهر التعلم في كنزة. تنقسم كل وحدة إلى دروس قصيرة وممتعة: حوارات صوتية حقيقية، نصوص عربية مشكولة، كتابة صوتية لاتينية (عربيزي)، وتمارين تفاعلية للتثبيت. الوحدتان 1 و2 مجانيتان للجميع.',
    },
    actionAdvice: {
      fr: '🚀 Commencez par la Leçon 01 : « Premiers contacts & Salutations » pour poser les bases.',
      en: '🚀 Start with Lesson 01: "First Contacts & Greetings" to build your foundation.',
      es: '🚀 Empieza con la Lección 01: «Primeros contactos y saludos» para afianzar la base.',
      ar: '🚀 ابدأ بالدرس 01: «التعارف والتحيات» لبناء أساس قوي وصحيح.',
    },
    screenshot: '/guide/screen-path.png',
  },
  {
    id: 'spotlight-phrases',
    tabKey: 'phrases',
    targetSelector: '[data-tour="phrases-tab"]',
    icon: Bookmark,
    iconBg: 'bg-emerald-100 text-emerald-800',
    badge: {
      fr: 'Onglet 3 / 5 · Carnet Pratique',
      en: 'Tab 3 / 5 · Phrasebook',
      es: 'Pestaña 3 / 5 · Cuaderno de Frases',
      ar: 'التبويب 3 / 5 · دفتر العبارات',
    },
    title: {
      fr: '📖 Carnet de Phrases : Vos Expressions Prêtes à l’Emploi',
      en: '📖 Phrasebook: Ready-to-Use Moroccan Expressions',
      es: '📖 Cuaderno: Expresiones Marroquíes Listas para Usar',
      ar: '📖 دفتر العبارات: تعابير مغربية جاهزة للاستخدام',
    },
    tagline: {
      fr: 'Recherche instantanée par thème : Taxi, Café, Négociation au Souk, Urgences.',
      en: 'Instant search by category: Taxi, Café, Souk Bargaining, Essentials.',
      es: 'Búsqueda instantánea por tema: Taxi, Café, Regateo en el Zoco, Urgencias.',
      ar: 'بحث سريع حسب الموضوع: التاكسي، المقهى، التسوق في السوق، والضروريات.',
    },
    explanation: {
      fr: 'Besoin de commander un thé sans sucre au café ou de demander le prix au souk ? Ouvrez le carnet de phrases ! Vous pouvez rechercher en français ou en phonétique, écouter la prononciation exacte et ajouter des phrases en favoris pour les réviser.',
      en: 'Need to order mint tea or ask for a price at the souk? Open the phrasebook! Search in English or phonetics, listen to clear audio, and star your favorites for quick review.',
      es: '¿Necesitas pedir un té o preguntar el precio en el zoco? Abre el cuaderno de frases. Busca en español o fonética, escucha el audio nativo y guarda tus favoritas.',
      ar: 'هل تريد طلب شاي في المقهى أو السؤال عن الأسعار في السوق؟ افتح دفتر العبارات! ابحث بكل سهولة، استمع للنطق الدقيق، وأضف عباراتك المفضلة للمراجعة لاحقاً.',
    },
    actionAdvice: {
      fr: '⭐ Cliquez sur l\'étoile d\'une phrase pour la retrouver instantanément hors-ligne.',
      en: '⭐ Tap the star on any sentence to access it instantly even offline.',
      es: '⭐ Pulsa la estrella en cualquier frase para acceder a ella incluso sin conexión.',
      ar: '⭐ اضغط على نجمة أي عبارة لحفظها والرجوع إليها دون اتصال بالإنترنت.',
    },
    screenshot: '/guide/screen-phrases.png',
  },
  {
    id: 'spotlight-review',
    tabKey: 'review',
    targetSelector: '[data-tour="review-tab"]',
    icon: Sparkles,
    iconBg: 'bg-purple-100 text-purple-800',
    badge: {
      fr: 'Onglet 4 / 5 · Répétition Espacée',
      en: 'Tab 4 / 5 · Spaced Repetition',
      es: 'Pestaña 4 / 5 · Repetición Espaciada',
      ar: 'التبويب 4 / 5 · التكرار المتباعد',
    },
    title: {
      fr: '🧠 Révision du Jour : La Mémoire Long Terme (SRS)',
      en: '🧠 Today’s Review: Long-Term Memory (SRS)',
      es: '🧠 Revisión del Día: Memoria a Largo Plazo (SRS)',
      ar: '🧠 مراجعة اليوم: الذاكرة طويلة المدى (SRS)',
    },
    tagline: {
      fr: 'Ne perdez jamais ce que vous apprenez grâce aux cartes mémoire intelligentes.',
      en: 'Never forget what you learn thanks to intelligent flashcards.',
      es: 'Nunca olvides lo aprendido gracias a las tarjetas inteligentes.',
      ar: 'لا تنسَ أبداً ما تعلمته بفضل بطاقات الذاكرة الذكية.',
    },
    explanation: {
      fr: 'L\'algorithme SRS vous présente les mots au moment précis où votre cerveau commence à les oublier. Cliquez sur une carte pour la retourner en 3D, écoutez le son et notez votre facilité (Facile / Moyen / Difficile). 5 minutes par jour suffisent.',
      en: 'The SRS algorithm shows you words right before you forget them. Tap any card to flip it in 3D, listen to audio, and rate your recall (Easy / Good / Hard). Just 5 minutes a day guarantees high retention.',
      es: 'El algoritmo SRS te muestra las palabras justo antes de olvidarlas. Voltea la tarjeta en 3D, escucha el audio y califica tu recuerdo. Con 5 minutos al día es suficiente.',
      ar: 'يقدم لك خوارزم SRS الكلمات في التوقيت الدقيق قبل أن تنساها. اقلب البطاقة بشكل ثلاثي الأبعاد، استمع للنطق وقيّم سهولة التذكر (سهل / متوسط / صعب). 5 دقائق يومياً تكفي لتثبيت المئات من الكلمات.',
    },
    actionAdvice: {
      fr: '🎯 Faites votre session de révision chaque matin pour garder 90% du vocabulaire actif.',
      en: '🎯 Complete your quick deck every morning to maintain 90%+ word retention.',
      es: '🎯 Haz tu sesión cada mañana para mantener el 90% del vocabulario activo.',
      ar: '🎯 راجع بطاقاتك كل صباح للحفاظ على نشاط 90% من حصيلتك اللغوية.',
    },
    screenshot: '/guide/screen-review.png',
  },
  {
    id: 'spotlight-space',
    tabKey: 'space',
    targetSelector: '[data-tour="space-tab"]',
    icon: Award,
    iconBg: 'bg-emerald-100 text-emerald-800',
    badge: {
      fr: 'Onglet 5 / 5 · Passeport & VIP',
      en: 'Tab 5 / 5 · Passport & VIP',
      es: 'Pestaña 5 / 5 · Pasaporte y VIP',
      ar: 'التبويب 5 / 5 · جواز السفر وVIP',
    },
    title: {
      fr: '👑 Mon Espace : Passeport Culturel & Code VIP',
      en: '👑 My Space: Cultural Passport & VIP Code',
      es: '👑 Mi Espacio: Pasaporte Cultural y Código VIP',
      ar: '👑 مساحتي: الجواز الثقافي والرمز الخاص VIP',
    },
    tagline: {
      fr: 'Suivi de vos badges, téléchargement du passeport et activation des codes promotionnels.',
      en: 'Track your badges, download your passport, and activate promo codes.',
      es: 'Sigue tus insignias, descarga tu pasaporte y activa códigos promocionales.',
      ar: 'متابعة أوسمتك، تحميل جوازك الثقافي، وتفعيل الرموز الترويجية.',
    },
    explanation: {
      fr: 'Votre espace personnel regroupe vos visas officiels de niveau (A1, A2, etc.), le téléchargement haute résolution de votre Passeport Darija, le mode hors-ligne, ainsi que l\'encart pour activer votre code VIP (ex: VIPEIDER) et débloquer Kenza Pro sans carte bancaire.',
      en: 'Your space gathers your official level visas (A1, A2), high-res Darija Passport export, offline mode, and the promo box to enter your VIP code (e.g., VIPEIDER) to unlock Kenza Pro with no credit card.',
      es: 'Tu espacio personal reúne tus visados de nivel (A1, A2), exportación en alta resolución del Pasaporte Darija, modo sin conexión y el campo para activar tu código VIP (ej: VIPEIDER) gratis.',
      ar: 'فضاؤك الشخصي يجمع تأشيراتك الرسمية (A1, A2)، وتحميل جواز الدارجة بدقة عالية، والوضع دون اتصال، وحقل تفعيل الرمز الخاص (مثل VIPEIDER) لفتح جميع ميزات كنزة برو مجاناً دون بطاقة بنكية.',
    },
    actionAdvice: {
      fr: '🎟️ Si vous avez un code d\'accès VIP, activez-le ici pour un accès illimité.',
      en: '🎟️ If you hold a VIP access code, redeem it here for full unlimited access.',
      es: '🎟️ Si tienes un código de acceso VIP, actívalo aquí para acceso ilimitado.',
      ar: '🎟️ إذا كان لديك رمز VIP، فعّله هنا للتمتع بوصول كامل وغير محدود.',
    },
    screenshot: '/guide/screen-space.png',
  },
];

const UI_LABELS = {
  fr: {
    prev: 'Précédent',
    next: 'Suivant',
    finish: 'J\'ai tout compris ! 🚀',
    skip: 'Passer la visite',
    badgeTour: 'Visite guidée interactive',
    openTabBtn: 'Aller sur cet onglet',
  },
  en: {
    prev: 'Previous',
    next: 'Next',
    finish: 'Got it, let’s go! 🚀',
    skip: 'Skip tour',
    badgeTour: 'Interactive Feature Tour',
    openTabBtn: 'Go to this tab',
  },
  es: {
    prev: 'Anterior',
    next: 'Siguiente',
    finish: '¡Entendido, vamos! 🚀',
    skip: 'Saltar visita',
    badgeTour: 'Visita guiada interactiva',
    openTabBtn: 'Ir a esta pestaña',
  },
  ar: {
    prev: 'السابق',
    next: 'التالي',
    finish: 'فهمت كل شيء، لنبدأ! 🚀',
    skip: 'تخطي الجولة',
    badgeTour: 'جولة استكشافية تفاعلية',
    openTabBtn: 'الانتقال إلى هذا التبويب',
  },
};

export default function AppSpotlightTour({ isOpen, onClose }: AppSpotlightTourProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as 'fr' | 'en' | 'es' | 'ar';
  const isRtl = langKey === 'ar';
  const labels = UI_LABELS[langKey];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [internalOpen, setInternalOpen] = useState(false);

  // Auto-déclenchement à la première connexion si la visite n'a pas encore été vue
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const completed = localStorage.getItem('kenza_spotlight_completed');
      if (!completed) {
        const timer = window.setTimeout(() => {
          setInternalOpen(true);
        }, 600);
        return () => window.clearTimeout(timer);
      }
    } catch {}
  }, []);

  const active = isOpen !== undefined ? isOpen : internalOpen;

  const handleClose = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kenza_spotlight_completed', 'true');
        localStorage.setItem('kenza_onboarding_completed', 'true');
      }
    } catch {}
    setInternalOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  // Fermeture touche Échap
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, handleClose]);

  const step = SPOTLIGHT_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === SPOTLIGHT_STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStepIndex((prev) => Math.min(SPOTLIGHT_STEPS.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#FFFEFC] border-2 border-amber-300/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barre supérieure avec Stepper et bouton Fermer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-100/70 via-amber-50 to-[#FFFEFC] border-b border-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/90 text-amber-950">
              <Sparkles size={13} className="text-amber-800" />
              <span>{labels.badgeTour}</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {currentStepIndex + 1} / {SPOTLIGHT_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              {labels.skip}
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Corps défilable */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          {/* En-tête de l'étape */}
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${step.iconBg}`}
            >
              <Icon size={24} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                {step.badge[langKey]}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#142943] leading-snug">
                {step.title[langKey]}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                {step.tagline[langKey]}
              </p>
            </div>
          </div>

          {/* Explication concrète */}
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>{step.explanation[langKey]}</p>
            <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-xs font-semibold text-amber-950">
              {step.actionAdvice[langKey]}
            </div>
          </div>

          {/* Capture d'écran ou aperçu visuel de l'onglet */}
          <div className="relative rounded-2xl border-2 border-amber-200/80 overflow-hidden shadow-inner bg-slate-100">
            <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-bold text-white flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Aperçu réel de l&apos;onglet</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.screenshot}
              alt={step.title[langKey]}
              className="w-full h-auto max-h-[260px] sm:max-h-[300px] object-cover object-top hover:scale-[1.02] transition-transform duration-300"
              onError={(e) => {
                // Fallback visuel élégant si l'image locale est en cours de rendu
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Barre de navigation inférieure avec Dots et Boutons Suivant/Précédent */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {SPOTLIGHT_STEPS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                aria-label={`Étape ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? 'w-7 bg-[#142943]'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Boutons Action */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                {isRtl ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                <span>{labels.prev}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
                isLast
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-[#142943] hover:bg-[#1b3557] shadow-[#142943]/20'
              }`}
            >
              <span>{isLast ? labels.finish : labels.next}</span>
              {isLast ? (
                <Check size={16} />
              ) : isRtl ? (
                <ArrowLeft size={15} />
              ) : (
                <ArrowRight size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

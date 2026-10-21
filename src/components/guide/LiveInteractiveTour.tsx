'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Globe,
  Compass,
  Bookmark,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Target,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export type TourStepKey =
  | 'header-lang'
  | 'today-resume'
  | 'drawer-explorer'
  | 'drawer-roleplay'
  | 'path-curriculum'
  | 'phrases-heading'
  | 'space-vip';

export interface TourStepConfig {
  key: TourStepKey;
  targetView: 'today' | 'path' | 'phrases' | 'review' | 'space';
  targetSelector: string;
  openDrawer?: boolean;
  closeDrawerAfter?: boolean;
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
}

export const TOUR_STEPS: TourStepConfig[] = [
  // Étape 1 : Header & Langues
  {
    key: 'header-lang',
    targetView: 'today',
    targetSelector: '#tour-header-lang',
    icon: Globe,
    iconBg: 'bg-amber-100 text-amber-900',
    badge: {
      fr: 'Étape 1 / 7 · En-tête & Réglages',
      en: 'Step 1 / 7 · Header & Settings',
      es: 'Paso 1 / 7 · Encabezado y Ajustes',
      ar: 'الخطوة 1 / 7 · الشريط العلوي والإعدادات',
    },
    title: {
      fr: '🌐 Choisissez votre langue à tout moment',
      en: '🌐 Choose your language anytime',
      es: '🌐 Elige tu idioma en cualquier momento',
      ar: '🌐 اختر لغتك المفضلة في أي وقت',
    },
    explanation: {
      fr: 'Basculez facilement entre Français (FR), Anglais (EN), Espagnol (ES) et Arabe (AR). L\'ensemble des explications, transcriptions et l\'orientation de lecture (RTL) s\'adaptent instantanément.',
      en: 'Easily switch between French (FR), English (EN), Spanish (ES), and Arabic (AR). All explanations, transcriptions, and layout direction (RTL) adapt in real time.',
      es: 'Cambia fácilmente entre francés (FR), inglés (EN), español (ES) y árabe (AR). Todas las explicaciones, transcripciones y la orientación (RTL) se adaptan al instante.',
      ar: 'بدّل بسهولة بين الفرنسية (FR)، الإنجليزية (EN)، الإسبانية (ES)، والعربية (AR). تتكيف جميع الشروحات والنصوص واتجاه القراءة (RTL) في الحال.',
    },
    actionAdvice: {
      fr: '💡 Vous pouvez également couper ou activer l\'audio ou réouvrir ce guide avec l\'icône ❓ juste à côté.',
      en: '💡 You can also mute audio or reopen this guide using the ❓ icon right next to it.',
      es: '💡 También puedes silenciar el audio o reabrir esta guía con el icono ❓ contiguo.',
      ar: '💡 يمكنك أيضاً كتم الصوت أو إعادة فتح هذا الدليل من أيقونة ❓ المجاورة.',
    },
  },

  // Étape 2 : Accueil & Reprise
  {
    key: 'today-resume',
    targetView: 'today',
    targetSelector: '#tour-today-hero',
    icon: Target,
    iconBg: 'bg-orange-100 text-orange-900',
    badge: {
      fr: 'Étape 2 / 7 · Tableau de Bord Quotidien',
      en: 'Step 2 / 7 · Daily Dashboard',
      es: 'Paso 2 / 7 · Tablero Diario',
      ar: 'الخطوة 2 / 7 · لوحة الانطلاق اليومية',
    },
    title: {
      fr: '🎯 Salam, on s’y remet ? Votre point de reprise',
      en: '🎯 Welcome back! Your daily launchpad',
      es: '🎯 ¡Bienvenido de nuevo! Tu punto de partida',
      ar: '🎯 مرحباً بك من جديد! نقطة انطلاقك اليومية',
    },
    explanation: {
      fr: 'Votre raccourci quotidien : un seul clic suffit pour reprendre exactement là où vous vous étiez arrêté, suivre votre série de jours et écouter la phrase du jour à vitesse normale ou ralentie (0.75x).',
      en: 'Your daily shortcut: a single click resumes exactly where you left off, tracks your streak, and lets you listen to the daily phrase at normal or slowed (0.75x) speed.',
      es: 'Tu acceso rápido diario: un solo clic para retomar donde lo dejaste, seguir tu racha y escuchar la frase del día a velocidad normal o pausada (0.75x).',
      ar: 'اختصارك اليومي: نقرة واحدة تكفي لمتابعة التعلم من حيث توقفت، متابعة عداد الالتزام، والاستماع لعبارة اليوم بالسرعة العادية أو البطيئة (0.75x).',
    },
    actionAdvice: {
      fr: '🚀 Visez 10 minutes par jour pour ancrer le dialecte sans effort.',
      en: '🚀 Aim for 10 minutes a day to naturally anchor vocabulary.',
      es: '🚀 Dedica 10 minutos al día para afianzar el dialecto.',
      ar: '🚀 خصص 10 دقائق يومياً لترسيخ الكلمات بسلاسة ومتعة.',
    },
  },

  // Étape 3 : Menu Latéral — Grammaire & Ateliers
  {
    key: 'drawer-explorer',
    targetView: 'today',
    targetSelector: '#tour-sidebar-explorer',
    openDrawer: true,
    icon: BookOpen,
    iconBg: 'bg-indigo-100 text-indigo-900',
    badge: {
      fr: 'Étape 3 / 7 · Menu Latéral — Explorer',
      en: 'Step 3 / 7 · Sidebar Menu — Explore',
      es: 'Paso 3 / 7 · Menú Lateral — Explorar',
      ar: 'الخطوة 3 / 7 · القائمة الجانبية — استكشف',
    },
    title: {
      fr: '📚 Grammaire active & Ateliers de prononciation',
      en: '📚 Active Grammar & Speech Workshops',
      es: '📚 Gramática Activa y Talleres de Pronunciación',
      ar: '📚 القواعد النشطة وورشات النطق الصوتي',
    },
    explanation: {
      fr: 'Retrouvez ici la grammaire simplifiée et les ateliers audio pour travailler votre prononciation à vitesse ralentie (0.75x). Une immersion complète pour comprendre la structure de la Darija.',
      en: 'Discover simplified grammar rules and audio workshops to train your pronunciation at slowed speed (0.75x). A complete toolkit to grasp Darija structures.',
      es: 'Encuentra aquí gramática simplificada y talleres de audio para perfeccionar tu pronunciación a velocidad pausada (0.75x).',
      ar: 'اكتشف هنا قواعد الدارجة المبسطة والورشات الصوتية لصقل نطقك بالسرعة البطيئة (0.75x). بيئة تدريبية شاملة لفهم تراكيب اللغة.',
    },
    actionAdvice: {
      fr: '💡 Accessible à tout moment via l\'icône menu ☰ en haut à gauche.',
      en: '💡 Always accessible via the ☰ menu icon at the top left.',
      es: '💡 Accesible en todo momento mediante el icono de menú ☰ arriba a la izquierda.',
      ar: '💡 متاح دائماً عبر زر القائمة ☰ أعلى يمين/يسار الشاشة.',
    },
  },

  // Étape 4 : Menu Latéral — Roleplay IA Karim
  {
    key: 'drawer-roleplay',
    targetView: 'today',
    targetSelector: '#tour-sidebar-roleplay',
    openDrawer: true,
    closeDrawerAfter: true,
    icon: MessageCircle,
    iconBg: 'bg-amber-100 text-amber-900',
    badge: {
      fr: 'Étape 4 / 7 · Menu Latéral — Coach IA',
      en: 'Step 4 / 7 · Sidebar Menu — AI Coach',
      es: 'Paso 4 / 7 · Menú Lateral — Coach IA',
      ar: 'الخطوة 4 / 7 · القائمة الجانبية — المدرب الذكي',
    },
    title: {
      fr: '🚕 Karim le Chauffeur de Taxi : Roleplay IA',
      en: '🚕 Karim the Taxi Driver: Interactive AI Roleplay',
      es: '🚕 Karim el Taxista: Roleplay con Inteligencia Artificial',
      ar: '🚕 كريم سائق التاكسي: محاكاة حوارية ذكية',
    },
    explanation: {
      fr: 'Montez à bord du petit taxi à Casablanca : échangez en direct avec Karim par la voix ou par texte avec traduction immédiate ! Le meilleur moyen de vaincre la peur de parler.',
      en: 'Hop into a Casablanca red taxi: talk directly with Karim via voice or text with instant translation! The ultimate way to speak Darija with zero stress.',
      es: 'Sube al taxi en Casablanca: ¡conversa en directo con Karim por voz o texto con traducción inmediata! La mejor forma de soltarte a hablar sin miedo.',
      ar: 'اركب في التاكسي الصغير بالدار البيضاء: تحدث مباشرة مع كريم بالصوت أو النص مع ترجمة فورية تحت كل رد! أفضل وسيلة لكسر حاجز الخوف والتحدث بطلاقة.',
    },
    actionAdvice: {
      fr: '🎙️ Activez le microphone pour lui répondre directement en parlant.',
      en: '🎙️ Tap the microphone button to practice speaking out loud.',
      es: '🎙️ Activa el micrófono para responderle hablando en directo.',
      ar: '🎙️ فعّل الميكروفون للرد عليه بصوتك والتمرن على النطق.',
    },
  },

  // Étape 5 : Mon Parcours (Modules 1 à 7)
  {
    key: 'path-curriculum',
    targetView: 'path',
    targetSelector: '#tour-path-modules',
    icon: Compass,
    iconBg: 'bg-blue-100 text-blue-900',
    badge: {
      fr: 'Étape 5 / 7 · Le Cœur du Curriculum',
      en: 'Step 5 / 7 · The Curriculum Core',
      es: 'Paso 5 / 7 · El Núcleo del Currículo',
      ar: 'الخطوة 5 / 7 · جوهر المسار التعليمي',
    },
    title: {
      fr: '🗺️ Mon Parcours : 7 Modules Progressifs',
      en: '🗺️ My Journey: 7 Guided Progressive Modules',
      es: '🗺️ Mi Ruta: 7 Módulos Progresivos Guiados',
      ar: '🗺️ مساري: 7 وحدات تعليمية متدرجة',
    },
    explanation: {
      fr: 'Le cœur de votre apprentissage : 7 modules guidés du grand débutant à la conversation fluide, avec écoute normale (1.0x) et ralentie (0.75x), arabe vocalisé (chakl) et phonétique latine (Arabizi).',
      en: 'The core of your learning: 7 guided modules from absolute beginner to conversational fluency, with normal and slowed audio, fully vocalized Arabic, and Arabizi phonetics.',
      es: 'El corazón del aprendizaje: 7 módulos guiados desde principiante hasta conversación fluida, con audio normal y pausado, árabe vocalizado y fonética latina.',
      ar: 'قلب مسارك التعليمي: 7 وحدات تدريبية متدرجة، مع استماع عادي وبطيء، وتشكيل عربي دقيق وكتابة صوتية بحروف لاتينية (عربيزي).',
    },
    actionAdvice: {
      fr: '📖 Les modules 1 et 2 sont entièrement gratuits pour tous les apprenants.',
      en: '📖 Modules 1 and 2 are 100% free for all learners.',
      es: '📖 Los módulos 1 y 2 son completamente gratuitos para todos.',
      ar: '📖 الوحدتان 1 و2 متاحتان بالكامل مجاناً لجميع المتعلمين.',
    },
  },

  // Étape 6 : Carnet de Phrases
  {
    key: 'phrases-heading',
    targetView: 'phrases',
    targetSelector: '#tour-heading-phrases',
    icon: Bookmark,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 6 / 7 · Carnet Pratique',
      en: 'Step 6 / 7 · Practical Phrasebook',
      es: 'Paso 6 / 7 · Cuaderno de Frases',
      ar: 'الخطوة 6 / 7 · دفتر العبارات',
    },
    title: {
      fr: '📖 Carnet de Phrases : Vos Expressions au Maroc',
      en: '📖 Phrasebook: Ready Expressions for Morocco',
      es: '📖 Cuaderno: Expresiones Útiles para Marruecos',
      ar: '📖 دفتر العبارات: تعابيرك الجاهزة لكل المواقف',
    },
    explanation: {
      fr: 'Des phrases prêtes à l\'emploi avec audio authentique et transcription vocalisée pour toutes les situations au Maroc : Taxi, Souk, Café, Salutations et Urgences.',
      en: 'Ready-to-use phrases with authentic native audio and vocalized script for everyday situations in Morocco: Taxi, Souk, Café, Greetings, and Emergencies.',
      es: 'Frases listas para usar con audio nativo y transcripción con diacríticos para situaciones cotidianas en Marruecos: Taxi, Zoco, Café, Saludos y Urgencias.',
      ar: 'تعابير جاهزة للاستخدام الفوري بنطق أصيل وتشكيل كامل لجميع مواقف الحياة اليومية في المغرب: التاكسي، السوق، المقهى، التحيات، وحالات الطوارئ.',
    },
    actionAdvice: {
      fr: '⭐ Cliquez sur le cœur d\'une phrase pour la retrouver instantanément même hors-ligne.',
      en: '⭐ Tap the heart on any phrase to save it and access it even offline.',
      es: '⭐ Pulsa el corazón en cualquier frase para guardarla y acceder incluso sin conexión.',
      ar: '⭐ اضغط على رمز القلب لحفظ أي عبارة في المفضلة والرجوع إليها دون إنترنت.',
    },
  },

  // Étape 7 : Mon Espace & Code VIP
  {
    key: 'space-vip',
    targetView: 'space',
    targetSelector: '#tour-space-vip',
    icon: Award,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 7 / 7 · Passeport & Accès VIP',
      en: 'Step 7 / 7 · Passport & VIP Access',
      es: 'Paso 7 / 7 · Pasaporte y Acceso VIP',
      ar: 'الخطوة 7 / 7 · جواز السفر وتفعيل VIP',
    },
    title: {
      fr: '👑 Mon Espace : Passeport & Code VIP',
      en: '👑 My Space: Cultural Passport & VIP Code',
      es: '👑 Mi Espacio: Pasaporte Cultural y Código VIP',
      ar: '👑 مساحتي: الجواز الثقافي ورمز VIP',
    },
    explanation: {
      fr: 'Retrouvez votre passeport officiel de certification culturelle et saisissez votre code promotionnel VIP (ex: VIPEIDER) pour débloquer l\'accès complet et illimité sans carte bancaire !',
      en: 'Find your official cultural certification passport and enter your VIP promo code (e.g., VIPEIDER) to unlock 100% full unlimited access with no credit card required!',
      es: 'Consulta tu pasaporte oficial de certificación cultural e introduce tu código promocional VIP (ej: VIPEIDER) para desbloquear acceso ilimitado sin tarjeta.',
      ar: 'تابع جوازك الثقافي الرسمي وشهاداتك، وأدخل رمزك الخاص (مثل VIPEIDER) لفتح جميع ميزات التطبيق بلا حدود ودون الحاجة لبطاقة بنكية!',
    },
    actionAdvice: {
      fr: '🎉 Félicitations, vous connaissez maintenant les fonctionnalités majeures de Kenza pour réussir !',
      en: '🎉 Congratulations, you now know all major features of Kenza to succeed!',
      es: '🎉 ¡Enhorabuena! Ya conoces las funciones principales de Kenza para triunfar.',
      ar: '🎉 تهانينا! أنت الآن على دراية كاملة بأهم ميزات كنزة للانطلاق بثقة.',
    },
  },
];

interface LiveInteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'today' | 'path' | 'phrases' | 'review' | 'space') => void;
  onToggleMenu?: (open: boolean) => void;
}

export default function LiveInteractiveTour({
  isOpen,
  onClose,
  onNavigateTab,
  onToggleMenu,
}: LiveInteractiveTourProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as 'fr' | 'en' | 'es' | 'ar';
  const isRtl = langKey === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'center'>('bottom');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStep = TOUR_STEPS[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOUR_STEPS.length - 1;

  // Calcul fluide des coordonnées de l'élément cible
  const updateTargetBounds = useCallback(() => {
    if (!isOpen) return;

    const selector = currentStep.targetSelector;
    const element = document.querySelector(selector) as HTMLElement | null;

    if (element) {
      // Scroll doux vers l'élément
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= 270) {
        setPlacement('bottom');
      } else if (spaceAbove >= 270) {
        setPlacement('top');
      } else {
        setPlacement('center');
      }
    } else {
      setTargetRect(null);
      setPlacement('center');
    }
  }, [isOpen, currentStep.targetSelector]);

  // Synchronisation temporelle parfaite : masquer simultanément (120ms), basculer l'état (150ms), mesurer et réafficher
  const executeStepTransition = useCallback(
    (targetIndex: number) => {
      setIsTransitioning(true);

      const nextConfig = TOUR_STEPS[targetIndex];

      // Gérer l'ouverture/fermeture du tiroir
      if (onToggleMenu) {
        if (nextConfig.openDrawer) {
          onToggleMenu(true);
        } else {
          onToggleMenu(false);
        }
      }

      // Basculer l'onglet cible
      onNavigateTab(nextConfig.targetView);

      // Laisser le DOM et les animations d'ouverture se stabiliser avant de remesurer
      window.setTimeout(() => {
        setCurrentIndex(targetIndex);

        window.setTimeout(() => {
          updateTargetBounds();
          setIsTransitioning(false);
        }, 150);
      }, 120);
    },
    [onNavigateTab, onToggleMenu, updateTargetBounds]
  );

  // Initialisation à l'ouverture
  useEffect(() => {
    if (!isOpen) return;
    executeStepTransition(0);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mise à jour sur resize / scroll
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updateTargetBounds);
    window.addEventListener('scroll', updateTargetBounds, true);

    return () => {
      window.removeEventListener('resize', updateTargetBounds);
      window.removeEventListener('scroll', updateTargetBounds, true);
    };
  }, [isOpen, updateTargetBounds]);

  const handleFinish = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kenza_live_tour_completed', 'true');
        localStorage.setItem('kenza_onboarding_completed', 'true');
      }
    } catch {}
    if (onToggleMenu) {
      onToggleMenu(false);
    }
    onClose();
  }, [onClose, onToggleMenu]);

  // Gestion Échap
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleFinish]);

  if (!isOpen) return null;

  const labels = {
    fr: { prev: 'Précédent', next: 'Suivant', finish: 'Terminer', skip: 'Passer la visite' },
    en: { prev: 'Previous', next: 'Next', finish: 'Finish', skip: 'Skip tour' },
    es: { prev: 'Anterior', next: 'Siguiente', finish: 'Finalizar', skip: 'Saltar visita' },
    ar: { prev: 'السابق', next: 'التالي', finish: 'إنهاء', skip: 'تخطي الجولة' },
  }[langKey];

  const Icon = currentStep.icon;

  // Calcul précis du positionnement de la bulle
  let cardStyle: React.CSSProperties = {};
  const PADDING = 14;

  if (targetRect && placement === 'bottom') {
    cardStyle = {
      position: 'fixed',
      top: `${Math.min(window.innerHeight - 320, targetRect.bottom + 18)}px`,
      left: `${Math.max(16, Math.min(window.innerWidth - 410, targetRect.left + targetRect.width / 2 - 200))}px`,
      maxWidth: '400px',
      width: 'calc(100vw - 32px)',
    };
  } else if (targetRect && placement === 'top') {
    cardStyle = {
      position: 'fixed',
      bottom: `${Math.min(window.innerHeight - 80, window.innerHeight - targetRect.top + 18)}px`,
      left: `${Math.max(16, Math.min(window.innerWidth - 410, targetRect.left + targetRect.width / 2 - 200))}px`,
      maxWidth: '400px',
      width: 'calc(100vw - 32px)',
    };
  } else {
    cardStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '420px',
      width: 'calc(100vw - 32px)',
    };
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[150] overflow-hidden pointer-events-auto"
    >
      {/* 1. Backdrop assombrissant */}
      <div
        className="fixed inset-0 bg-black/65 transition-opacity duration-200"
        onClick={handleFinish}
      />

      {/* 2. Spotlight physique entourant l'élément exact */}
      {targetRect && (
        <div
          className={`fixed pointer-events-none rounded-2xl transition-all duration-250 ease-out z-[151] ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{
            top: `${Math.max(0, targetRect.top - PADDING)}px`,
            left: `${Math.max(0, targetRect.left - PADDING)}px`,
            width: `${targetRect.width + PADDING * 2}px`,
            height: `${targetRect.height + PADDING * 2}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 30px 6px rgba(245, 158, 11, 0.95)',
            border: '3px solid #f59e0b',
          }}
        />
      )}

      {/* 3. Bulle explicative avec flèche directionnelle (Zéro texte tronqué) */}
      <div
        style={cardStyle}
        className={`z-[155] bg-[#FFFEFC] border-2 border-amber-300 rounded-3xl shadow-2xl p-5 text-[#142943] transition-all duration-250 ease-out ${
          isTransitioning
            ? 'opacity-0 translate-y-2 pointer-events-none'
            : 'opacity-100 translate-y-0 pointer-events-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flèche fine pointant vers l'élément */}
        {targetRect && placement === 'bottom' && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-amber-300"
            aria-hidden="true"
          />
        )}
        {targetRect && placement === 'top' && (
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300"
            aria-hidden="true"
          />
        )}

        {/* En-tête de la bulle (sans aucun truncate) */}
        <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-amber-100">
          <div className="flex items-start gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${currentStep.iconBg}`}
            >
              <Icon size={19} />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                {currentStep.badge[langKey]}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#142943] leading-snug">
                {currentStep.title[langKey]}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            aria-label={labels.skip}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Corps descriptif complet */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
          {currentStep.explanation[langKey]}
        </p>

        {/* Conseil / Astuce */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] font-medium text-amber-950 mb-4">
          {currentStep.actionAdvice[langKey]}
        </div>

        {/* Stepper Dots & Navigation Précédent / Suivant */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.key}
                type="button"
                onClick={() => executeStepTransition(idx)}
                aria-label={`Étape ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'w-6 bg-[#142943]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => executeStepTransition(Math.max(0, currentIndex - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                <span>{labels.prev}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  handleFinish();
                } else {
                  executeStepTransition(Math.min(TOUR_STEPS.length - 1, currentIndex + 1));
                }
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
                isLast
                  ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/50'
                  : 'bg-[#142943] hover:bg-[#1b3557]'
              }`}
            >
              <span>{isLast ? labels.finish : labels.next}</span>
              {isLast ? (
                <Check size={14} />
              ) : isRtl ? (
                <ArrowLeft size={13} />
              ) : (
                <ArrowRight size={13} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

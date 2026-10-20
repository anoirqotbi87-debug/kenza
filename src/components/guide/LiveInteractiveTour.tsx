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
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export type TourStepKey =
  | 'header-lang'
  | 'today-next-step'
  | 'path-modules'
  | 'phrases-categories'
  | 'review-flashcard'
  | 'space-vip';

export interface TourStepConfig {
  key: TourStepKey;
  targetView: 'today' | 'path' | 'phrases' | 'review' | 'space';
  targetSelector: string;
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
  {
    key: 'header-lang',
    targetView: 'today',
    targetSelector: '#tour-header-lang',
    icon: Globe,
    iconBg: 'bg-amber-100 text-amber-900',
    badge: {
      fr: 'Étape 1 / 6 · En-tête & Réglages',
      en: 'Step 1 / 6 · Header & Settings',
      es: 'Paso 1 / 6 · Encabezado y Ajustes',
      ar: 'الخطوة 1 / 6 · الشريط العلوي والإعدادات',
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
      fr: '💡 Vous pouvez également couper ou activer l\'audio avec le bouton haut-parleur situé juste à côté.',
      en: '💡 You can also mute or enable audio with the speaker button right next to it.',
      es: '💡 También puedes silenciar o activar el audio con el botón de altavoz contiguo.',
      ar: '💡 يمكنك أيضاً كتم أو تشغيل الصوت من زر السماعة المجاور مباشرة.',
    },
  },
  {
    key: 'today-next-step',
    targetView: 'today',
    targetSelector: '#tour-today-next-step',
    icon: Target,
    iconBg: 'bg-orange-100 text-orange-900',
    badge: {
      fr: 'Étape 2 / 6 · Raccourci Quotidien',
      en: 'Step 2 / 6 · Daily Shortcut',
      es: 'Paso 2 / 6 · Acceso Diario',
      ar: 'الخطوة 2 / 6 · الانطلاق اليومي',
    },
    title: {
      fr: '🎯 Ta Prochaine Étape : Votre point d\'action',
      en: '🎯 Your Next Step: Your action point',
      es: '🎯 Tu Próximo Paso: Tu punto de acción',
      ar: '🎯 خطوتك التالية: نقطة انطلاقك الفورية',
    },
    explanation: {
      fr: 'Votre raccourci quotidien : un seul clic suffit pour reprendre exactement là où vous vous étiez arrêté, sans chercher dans les menus.',
      en: 'Your daily shortcut: a single tap is all it takes to resume exactly where you left off, without searching through menus.',
      es: 'Tu acceso rápido diario: un solo clic basta para reanudar exactamente donde lo dejaste, sin buscar en menús.',
      ar: 'اختصارك اليومي: نقرة واحدة تكفي لمتابعة التعلم من حيث توقفت تماماً دون الحاجة للبحث في القوائم.',
    },
    actionAdvice: {
      fr: '🚀 Visez 10 minutes par jour pour maintenir votre série active !',
      en: '🚀 Aim for 10 minutes a day to keep your streak glowing!',
      es: '🚀 ¡Apunta a 10 minutos al día para mantener tu racha encendida!',
      ar: '🚀 خصص 10 دقائق يومياً للحفاظ على شعلة الالتزام متقدة!',
    },
  },
  {
    key: 'path-modules',
    targetView: 'path',
    targetSelector: '#tour-path-modules',
    icon: Compass,
    iconBg: 'bg-blue-100 text-blue-900',
    badge: {
      fr: 'Étape 3 / 6 · Le Cœur du Curriculum',
      en: 'Step 3 / 6 · The Curriculum Core',
      es: 'Paso 3 / 6 · El Núcleo del Currículo',
      ar: 'الخطوة 3 / 6 · جوهر المسار التعليمي',
    },
    title: {
      fr: '🗺️ Mon Parcours : 7 Modules de A à Z',
      en: '🗺️ My Journey: 7 Step-by-Step Modules',
      es: '🗺️ Mi Ruta: 7 Módulos de la A a la Z',
      ar: '🗺️ مساري: 7 وحدات تعليمية متكاملة',
    },
    explanation: {
      fr: 'Le cœur de votre apprentissage : 7 modules guidés du grand débutant à la conversation fluide, avec écoute normale (1.0x) et ralentie (0.75x), arabe vocalisé et phonétique latine (Arabizi).',
      en: 'The core of your learning: 7 guided modules from complete beginner to conversational fluency, featuring normal (1.0x) and slowed (0.75x) speech, vocalized Arabic, and phonetics (Arabizi).',
      es: 'El corazón de tu aprendizaje: 7 módulos guiados desde principiante hasta fluidez oral, con audio normal (1.0x) y pausado (0.75x), árabe con diacríticos y fonética latina (Arabizi).',
      ar: 'عماد تعلمك في كنزة: 7 وحدات موجهة من المبتدئ إلى الطلاقة في المحادثة، مع نطق عادي (1.0x) وبطيء (0.75x)، وتشكيل عربي كامل وكتابة صوتية (عربيزي).',
    },
    actionAdvice: {
      fr: '📖 Les modules 1 et 2 sont entièrement gratuits pour tous les apprenants.',
      en: '📖 Modules 1 and 2 are 100% free for all learners.',
      es: '📖 Los módulos 1 y 2 son completamente gratuitos para todos los alumnos.',
      ar: '📖 الوحدتان 1 و2 مجانيتان بالكامل لجميع المتعلمين.',
    },
  },
  {
    key: 'phrases-categories',
    targetView: 'phrases',
    targetSelector: '#tour-phrases-categories',
    icon: Bookmark,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 4 / 6 · Carnet Pratique',
      en: 'Step 4 / 6 · Practical Phrasebook',
      es: 'Paso 4 / 6 · Cuaderno Práctico',
      ar: 'الخطوة 4 / 6 · دفتر العبارات',
    },
    title: {
      fr: '📖 Carnet de Phrases : Vos Expressions au Maroc',
      en: '📖 Phrasebook: Ready Expressions for Morocco',
      es: '📖 Cuaderno: Expresiones Prácticas para Marruecos',
      ar: '📖 دفتر العبارات: تعابيرك الجاهزة لكل المواقف',
    },
    explanation: {
      fr: 'Des phrases prêtes à l\'emploi avec audio authentique et transcription vocalisée pour toutes les situations de la vie courante au Maroc : Taxi, Souk, Café, Salutations et Urgences.',
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
  {
    key: 'review-flashcard',
    targetView: 'review',
    targetSelector: '#tour-review-flashcard',
    icon: Sparkles,
    iconBg: 'bg-purple-100 text-purple-900',
    badge: {
      fr: 'Étape 5 / 6 · Répétition Espacée',
      en: 'Step 5 / 6 · Spaced Repetition',
      es: 'Paso 5 / 6 · Repetición Espaciada',
      ar: 'الخطوة 5 / 6 · التكرار المتباعد الذكي',
    },
    title: {
      fr: '🧠 Révision Quotidienne : Mémoire Long Terme',
      en: '🧠 Daily Review: Long-Term Retention',
      es: '🧠 Repaso Diario: Memoria a Largo Plazo',
      ar: '🧠 المراجعة اليومية: تثبيت الذاكرة طويلة المدى',
    },
    explanation: {
      fr: '5 minutes par jour suffisent pour ancrer durablement le vocabulaire grâce à notre algorithme de répétition espacée (SRS) et ses cartes mémoires interactives en 3D.',
      en: 'Just 5 minutes a day is enough to permanently cement vocabulary using our Spaced Repetition System (SRS) and interactive 3D flashcards.',
      es: '5 minutos al día bastan para fijar el vocabulario a largo plazo con nuestro algoritmo de repetición espaciada (SRS) y tarjetas interactivas 3D.',
      ar: 'تكفي 5 دقائق يومياً لتثبيت المفردات في الذاكرة طويلة المدى بفضل خوارزم التكرار المتباعد (SRS) وبطاقات الذاكرة ثلاثية الأبعاد.',
    },
    actionAdvice: {
      fr: '🔄 Touchez la carte pour la retourner, écoutez l\'audio et notez votre facilité.',
      en: '🔄 Tap the card to flip it, listen to pronunciation, and grade your recall.',
      es: '🔄 Toca la tarjeta para voltearla, escucha el audio y califica tu facilidad.',
      ar: '🔄 المس البطاقة لقلبها، استمع للنطق وقيّم مستوى تذكرك.',
    },
  },
  {
    key: 'space-vip',
    targetView: 'space',
    targetSelector: '#tour-space-vip',
    icon: Award,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 6 / 6 · Passeport & Accès VIP',
      en: 'Step 6 / 6 · Passport & VIP Access',
      es: 'Paso 6 / 6 · Pasaporte y Acceso VIP',
      ar: 'الخطوة 6 / 6 · جواز السفر وتفعيل VIP',
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
      fr: '🎉 Félicitations, vous connaissez maintenant les 5 piliers de Kenza pour réussir !',
      en: '🎉 Congratulations, you now know all 5 pillars of Kenza to succeed!',
      es: '🎉 ¡Enhorabuena! Ya conoces los 5 pilares de Kenza para triunfar.',
      ar: '🎉 تهانينا! أنت الآن على دراية كاملة بأركان كنزة الأساسية للانطلاق بثقة.',
    },
  },
];

interface LiveInteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'today' | 'path' | 'phrases' | 'review' | 'space') => void;
}

export default function LiveInteractiveTour({
  isOpen,
  onClose,
  onNavigateTab,
}: LiveInteractiveTourProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as 'fr' | 'en' | 'es' | 'ar';
  const isRtl = langKey === 'ar';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'center'>('bottom');

  const currentStep = TOUR_STEPS[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOUR_STEPS.length - 1;

  // 1. Navigation automatique vers le bon onglet
  useEffect(() => {
    if (!isOpen) return;
    onNavigateTab(currentStep.targetView);
  }, [isOpen, currentIndex, currentStep.targetView, onNavigateTab]);

  // 2. Détection de l'élément cible et calcul du rectangle spotlight
  const updateTargetBounds = useCallback(() => {
    if (!isOpen) return;

    // Délai pour laisser le DOM et la vue s'afficher
    const selector = currentStep.targetSelector;
    const element = document.querySelector(selector) as HTMLElement | null;

    if (element) {
      // Scroll doux vers l'élément si nécessaire
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Calcul de la position de la bulle (au-dessus ou en-dessous)
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= 260) {
        setPlacement('bottom');
      } else if (spaceAbove >= 260) {
        setPlacement('top');
      } else {
        setPlacement('center');
      }
    } else {
      setTargetRect(null);
      setPlacement('center');
    }
  }, [isOpen, currentStep.targetSelector]);

  useEffect(() => {
    if (!isOpen) return;

    // Deux passes pour assurer la synchronisation avec les transitions d'onglets
    const timer1 = window.setTimeout(updateTargetBounds, 80);
    const timer2 = window.setTimeout(updateTargetBounds, 250);

    window.addEventListener('resize', updateTargetBounds);
    window.addEventListener('scroll', updateTargetBounds, true);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.removeEventListener('resize', updateTargetBounds);
      window.removeEventListener('scroll', updateTargetBounds, true);
    };
  }, [isOpen, currentIndex, updateTargetBounds]);

  const handleFinish = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kenza_live_tour_completed', 'true');
        localStorage.setItem('kenza_onboarding_completed', 'true');
      }
    } catch {}
    onClose();
  }, [onClose]);

  // Gestion de la touche Échap
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

  // Calcul du style de la bulle d'explication
  let cardStyle: React.CSSProperties = {};
  const PADDING = 12;

  if (targetRect && placement === 'bottom') {
    cardStyle = {
      position: 'fixed',
      top: `${Math.min(window.innerHeight - 300, targetRect.bottom + 16)}px`,
      left: `${Math.max(16, Math.min(window.innerWidth - 380, targetRect.left + targetRect.width / 2 - 180))}px`,
      maxWidth: '380px',
      width: 'calc(100vw - 32px)',
    };
  } else if (targetRect && placement === 'top') {
    cardStyle = {
      position: 'fixed',
      bottom: `${Math.min(window.innerHeight - 80, window.innerHeight - targetRect.top + 16)}px`,
      left: `${Math.max(16, Math.min(window.innerWidth - 380, targetRect.left + targetRect.width / 2 - 180))}px`,
      maxWidth: '380px',
      width: 'calc(100vw - 32px)',
    };
  } else {
    // Centré au milieu si cible hors champ
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
      {/* 1. Backdrop assombrissant avec trou découpé ou halo spotlight */}
      <div
        className="fixed inset-0 bg-black/65 transition-opacity duration-300"
        onClick={handleFinish}
      />

      {/* 2. Spotlight physique entourant l'élément direct */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl transition-all duration-300 ease-out z-[151]"
          style={{
            top: `${Math.max(0, targetRect.top - PADDING)}px`,
            left: `${Math.max(0, targetRect.left - PADDING)}px`,
            width: `${targetRect.width + PADDING * 2}px`,
            height: `${targetRect.height + PADDING * 2}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 25px 4px rgba(245, 158, 11, 0.9)',
            border: '3px solid #f59e0b',
          }}
        />
      )}

      {/* 3. Bulle explicative avec flèche directionnelle */}
      <div
        style={cardStyle}
        className="z-[155] bg-[#FFFEFC] border-2 border-amber-300 rounded-3xl shadow-2xl p-5 text-[#142943] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flèche pointant vers l'élément */}
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

        {/* Header de la bulle */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-100">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${currentStep.iconBg}`}
            >
              <Icon size={19} />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-amber-800 truncate">
                {currentStep.badge[langKey]}
              </span>
              <h3 className="text-sm font-bold text-[#142943] truncate">
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

        {/* Corps descriptif */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
          {currentStep.explanation[langKey]}
        </p>

        {/* Conseil / Astuce */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] font-medium text-amber-950 mb-4">
          {currentStep.actionAdvice[langKey]}
        </div>

        {/* Stepper Dots & Boutons d'action */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Étape ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'w-6 bg-[#142943]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Précédent / Suivant */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
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
                  setCurrentIndex((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1));
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

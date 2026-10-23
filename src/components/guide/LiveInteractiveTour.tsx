'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Globe,
  Menu,
  Target,
  Compass,
  Bookmark,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export type TourStepKey =
  | 'header-lang'
  | 'header-menu'
  | 'today-resume'
  | 'path-curriculum'
  | 'phrases-heading'
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
      fr: 'Étape 1 / 6 · En-tête & Réglages',
      en: 'Step 1 / 6 · Header & Settings',
      es: 'Paso 1 / 6 · Encabezado y Ajustes',
      ar: 'الخطوة 1 / 6 · الشريط العلوي والإعدادات',
    },
    title: {
      fr: '🌐 Choisissez votre langue',
      en: '🌐 Choose your language',
      es: '🌐 Elige tu idioma',
      ar: '🌐 اختر لغتك المفضلة',
    },
    explanation: {
      fr: 'Basculez facilement entre Français (FR), Anglais (EN), Espagnol (ES) et Arabe (AR). L’application s’adapte instantanément.',
      en: 'Easily switch between French, English, Spanish, and Arabic. All explanations and transcriptions adapt instantly.',
      es: 'Cambia fácilmente entre francés, inglés, español y árabe. La app se adapta al instante.',
      ar: 'بدّل بسهولة بين الفرنسية، الإنجليزية، الإسبانية، والعربية. تتكيف جميع الشروحات والنصوص في الحال.',
    },
  },

  // Étape 2 : Menu Latéral Pro (Ciblage de l'icône ☰ dans le Header)
  {
    key: 'header-menu',
    targetView: 'today',
    targetSelector: '#tour-hamburger-btn',
    icon: Menu,
    iconBg: 'bg-indigo-100 text-indigo-900',
    badge: {
      fr: 'Étape 2 / 6 · Menu Latéral',
      en: 'Step 2 / 6 · Side Menu',
      es: 'Paso 2 / 6 · Menú Lateral',
      ar: 'الخطوة 2 / 6 · القائمة الجانبية',
    },
    title: {
      fr: '☰ Menu complet',
      en: '☰ Full Menu',
      es: '☰ Menú completo',
      ar: '☰ القائمة الكاملة',
    },
    explanation: {
      fr: 'Retrouvez ici la Grammaire active, les ateliers audio et le Roleplay avec Karim !',
      en: 'Access Active Grammar, audio workshops, and AI Roleplay with Karim right here!',
      es: '¡Encuentra aquí la Gramática activa, talleres de audio y el Roleplay con Karim!',
      ar: 'ستجد هنا القواعد التفاعلية، ورشات الصوت والمحادثة مع كريم!',
    },
  },

  // Étape 3 : Accueil & Reprise
  {
    key: 'today-resume',
    targetView: 'today',
    targetSelector: '#tour-today-hero',
    icon: Target,
    iconBg: 'bg-orange-100 text-orange-900',
    badge: {
      fr: 'Étape 3 / 6 · Tableau de Bord',
      en: 'Step 3 / 6 · Daily Launchpad',
      es: 'Paso 3 / 6 · Tablero Diario',
      ar: 'الخطوة 3 / 6 · لوحة الانطلاق',
    },
    title: {
      fr: '🎯 Salam, on s’y remet ?',
      en: '🎯 Welcome back!',
      es: '🎯 ¡Bienvenido de nuevo!',
      ar: '🎯 مرحباً بك من جديد!',
    },
    explanation: {
      fr: 'Un seul clic pour reprendre exactement où vous en étiez, suivre votre série et écouter la phrase du jour.',
      en: 'One click resumes exactly where you left off, tracks your streak, and plays the daily phrase.',
      es: 'Un solo clic para retomar donde lo dejaste, seguir tu racha y escuchar la frase del día.',
      ar: 'نقرة واحدة لمتابعة التعلم من حيث توقفت، متابعة التزامك، والاستماع لعبارة اليوم.',
    },
  },

  // Étape 4 : Mon Parcours (Modules 1 à 7)
  {
    key: 'path-curriculum',
    targetView: 'path',
    targetSelector: '#tour-path-module-1',
    icon: Compass,
    iconBg: 'bg-blue-100 text-blue-900',
    badge: {
      fr: 'Étape 4 / 6 · Mon Parcours',
      en: 'Step 4 / 6 · Curriculum Path',
      es: 'Paso 4 / 6 · Mi Recorrido',
      ar: 'الخطوة 4 / 6 · مسار التعلم',
    },
    title: {
      fr: '🗺️ 7 Modules Progressifs',
      en: '🗺️ 7 Guided Modules',
      es: '🗺️ 7 Módulos Progresivos',
      ar: '🗺️ 7 وحدات تعليمية',
    },
    explanation: {
      fr: 'Du grand débutant à la conversation fluide : audio normal et ralenti (0.75x), arabe vocalisé et phonétique Arabizi.',
      en: 'From absolute beginner to conversational fluency: normal and slowed audio, vocalized Arabic, and Arabizi phonetics.',
      es: 'De principiante a conversación fluida: audio normal y pausado, árabe vocalizado y transcripción fonética.',
      ar: 'من البداية إلى الطلاقة: استماع عادي وبطيء (0.75x)، وتشكيل عربي دقيق وكتابة صوتية عربيزي.',
    },
  },

  // Étape 5 : Carnet de Phrases
  {
    key: 'phrases-heading',
    targetView: 'phrases',
    targetSelector: '#tour-heading-phrases',
    icon: Bookmark,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 5 / 6 · Carnet de Phrases',
      en: 'Step 5 / 6 · Practical Phrasebook',
      es: 'Paso 5 / 6 · Cuaderno de Frases',
      ar: 'الخطوة 5 / 6 · دفتر العبارات',
    },
    title: {
      fr: '📖 Vos Expressions au Maroc',
      en: '📖 Expressions for Morocco',
      es: '📖 Frases para Marruecos',
      ar: '📖 تعابيرك الجاهزة',
    },
    explanation: {
      fr: 'Phrases prêtes à l’emploi pour toutes les situations : Taxi, Souk, Café, Salutations et Urgences avec audio natif.',
      en: 'Ready expressions for everyday situations: Taxi, Souk, Café, Greetings, and Emergencies with native audio.',
      es: 'Frases listas para usar en cualquier situación: Taxi, Zoco, Café, Saludos y Urgencias con audio nativo.',
      ar: 'تعابير جاهزة لكل مواقف الحياة اليومية: التاكسي، السوق، المقهى، التحيات، وحالات الطوارئ مع صوت أصيل.',
    },
  },

  // Étape 6 : Mon Espace & Code VIP
  {
    key: 'space-vip',
    targetView: 'space',
    targetSelector: '#tour-space-vip',
    icon: Award,
    iconBg: 'bg-emerald-100 text-emerald-900',
    badge: {
      fr: 'Étape 6 / 6 · Passeport & VIP',
      en: 'Step 6 / 6 · Passport & VIP',
      es: 'Paso 6 / 6 · Pasaporte y VIP',
      ar: 'الخطوة 6 / 6 · جواز السفر وVIP',
    },
    title: {
      fr: '👑 Passeport & Code VIP',
      en: '👑 Passport & VIP Code',
      es: '👑 Pasaporte y Código VIP',
      ar: '👑 الجواز ورمز VIP',
    },
    explanation: {
      fr: 'Consultez votre passeport officiel et activez votre code VIP (ex: VIPEIDER) pour débloquer l’accès complet sans carte bancaire.',
      en: 'Check your official passport and enter your VIP code (e.g. VIPEIDER) to unlock full access with no credit card.',
      es: 'Consulta tu pasaporte oficial e introduce tu código VIP (ej: VIPEIDER) para desbloquear acceso ilimitado sin tarjeta.',
      ar: 'تابع جوازك الثقافي وأدخل رمزك الخاص (مثل VIPEIDER) لفتح جميع ميزات التطبيق بلا حدود ودون بطاقة بنكية.',
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

  const setIsLiveTourActive = useAppStore((s) => s.setIsLiveTourActive);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronisation du statut global du Tour dans le Store
  useEffect(() => {
    setIsLiveTourActive(isOpen);
    return () => setIsLiveTourActive(false);
  }, [isOpen, setIsLiveTourActive]);

  const currentStep = TOUR_STEPS[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOUR_STEPS.length - 1;

  // Mesure et calcul fluide des coordonnées finales de l'élément cible
  const measureElement = useCallback(
    (selector: string) => {
      if (!isOpen || typeof document === 'undefined') return false;
      const element = (document.querySelector(selector) ||
        (selector.includes('vip')
          ? document.querySelector('#tour-space-vip, [data-tour="space-vip"], .vip-promo-card')
          : null)) as HTMLElement | null;

      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        return true;
      }

      setTargetRect(null);
      return false;
    },
    [isOpen]
  );

  // Recalcul en temps réel (resize, orientation, scroll manuel) uniquement hors transition
  const updateTargetBounds = useCallback(() => {
    if (!isOpen || isTransitioning) return;
    const step = TOUR_STEPS[currentIndex];
    if (step) {
      const element = (document.querySelector(step.targetSelector) ||
        (step.key === 'space-vip'
          ? document.querySelector('#tour-space-vip, [data-tour="space-vip"], .vip-promo-card')
          : null)) as HTMLElement | null;
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    }
  }, [isOpen, isTransitioning, currentIndex]);

  // Synchronisation temporelle fluide et sans saccade :
  // 1. Masquage immédiat simultané halo + bulle (opacity: 0, pointer-events: none)
  // 2. Navigation d'onglet
  // 3. Défilement garanti vers la cible (conteneur parent ou window)
  // 4. Attente de 350-400ms : défilement achevé et page immobile
  // 5. Mesure directe des coordonnées finales getBoundingClientRect()
  // 6. Réaffichage en un fondu doux (opacity: 1, transition 150ms) SANS jamais bouger
  const executeStepTransition = useCallback(
    (targetIndex: number) => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

      // Masque immédiatement bulle et halo
      setIsTransitioning(true);

      const nextConfig = TOUR_STEPS[targetIndex];
      if (!nextConfig) return;

      setCurrentIndex(targetIndex);

      // Bascule l'onglet cible
      onNavigateTab(nextConfig.targetView);

      // Lance le défilement orienté vers la cible
      const triggerScroll = () => {
        if (typeof document === 'undefined') return;

        // Étape 6 : Mon Espace / Code VIP (défilement garanti du conteneur parent scrollable)
        if (nextConfig.key === 'space-vip') {
          const vipSection = document.querySelector(
            '#tour-space-vip, [data-tour="space-vip"], .vip-promo-card'
          ) as HTMLElement | null;

          if (vipSection) {
            // 1. Défilement direct du conteneur parent scrollable
            const scrollParent =
              vipSection.closest('.overflow-y-auto') ||
              document.querySelector('main') ||
              window;

            if (scrollParent instanceof HTMLElement) {
              scrollParent.scrollTo({
                top: vipSection.offsetTop - 80,
                behavior: 'smooth',
              });
            } else if (typeof window !== 'undefined' && scrollParent === window) {
              const rect = vipSection.getBoundingClientRect();
              window.scrollTo({
                top: window.scrollY + rect.top - 80,
                behavior: 'smooth',
              });
            }

            // 2. Défilement complémentaire sécurisé
            vipSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        const isHeader = nextConfig.targetSelector.includes('header');
        if (isHeader) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const elem = document.querySelector(nextConfig.targetSelector) as HTMLElement | null;
        if (elem) {
          // Éléments du haut / milieu : scroll vers le haut sous le header fixe (76px)
          elem.style.scrollMarginTop = '76px';
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      triggerScroll();

      // Si transition vers space-vip, ré-exécuter le défilement après un micro-délai pour s'assurer
      // que le composant SpaceView est monté dans le DOM par React
      if (nextConfig.key === 'space-vip') {
        setTimeout(triggerScroll, 80);
      }

      // Attends 400ms (le temps que le défilement jusqu'au bas de page soit complètement achevé)
      const scrollWaitTime = nextConfig.key === 'space-vip' ? 400 : 350;
      transitionTimerRef.current = setTimeout(() => {
        const selectorToMeasure =
          nextConfig.key === 'space-vip'
            ? '#tour-space-vip, [data-tour="space-vip"], .vip-promo-card'
            : nextConfig.targetSelector;

        const found = measureElement(selectorToMeasure);
        if (!found) {
          retryTimerRef.current = setTimeout(() => {
            measureElement(selectorToMeasure);
            setIsTransitioning(false);
          }, 150);
        } else {
          setIsTransitioning(false);
        }
      }, scrollWaitTime);
    },
    [onNavigateTab, measureElement]
  );

  // Nettoyage des timers
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // Initialisation à l'ouverture
  useEffect(() => {
    if (!isOpen) return;
    const initTimer = window.setTimeout(() => {
      executeStepTransition(0);
    }, 0);
    return () => window.clearTimeout(initTimer);
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

    setIsLiveTourActive(false);
    if (onToggleMenu) {
      onToggleMenu(false);
    }
    onClose();
  }, [onClose, onToggleMenu, setIsLiveTourActive]);

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

  // Calcul précis du positionnement ultra-compact de la bulle (Ne JAMAIS recouvrir la cible)
  const PADDING = 10;
  const tooltipHeight = 125;
  const tooltipWidth = typeof window !== 'undefined' ? Math.min(360, window.innerWidth - 32) : 328;

  let calculatedTop = typeof window !== 'undefined' ? window.innerHeight / 2 - tooltipHeight / 2 : 100;
  let calculatedLeft = typeof window !== 'undefined' ? window.innerWidth / 2 - tooltipWidth / 2 : 16;
  let effectivePlacement: 'top' | 'bottom' = 'bottom';

  if (targetRect && typeof window !== 'undefined') {
    calculatedLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Étape 6 (space-vip) : la bulle doit impérativement se placer au-dessus de la carte VIP
    // pour ne pas mordre sur la barre de navigation du bas.
    if (currentStep.key === 'space-vip' || targetCenterY >= window.innerHeight / 2) {
      effectivePlacement = 'top';
      calculatedTop = targetRect.top - PADDING - 20 - tooltipHeight;
    } else {
      effectivePlacement = 'bottom';
      calculatedTop = targetRect.bottom + PADDING + 20;
    }
  }

  // Clamping strict : la bulle ne doit JAMAIS recouvrir la cible, même sur petit écran
  let safeTop = calculatedTop;
  if (targetRect && typeof window !== 'undefined') {
    if (effectivePlacement === 'bottom') {
      const minTop = targetRect.bottom + PADDING + 16;
      const maxTop = window.innerHeight - tooltipHeight - 12;
      safeTop = Math.max(minTop, Math.min(maxTop, calculatedTop));
    } else {
      const minTop = 12;
      const maxTop = targetRect.top - PADDING - 16 - tooltipHeight;
      safeTop = Math.max(minTop, Math.min(maxTop, calculatedTop));
    }
  } else if (typeof window !== 'undefined') {
    safeTop = Math.max(12, Math.min(window.innerHeight - tooltipHeight - 12, calculatedTop));
  }

  const safeLeft = typeof window !== 'undefined'
    ? Math.max(12, Math.min(window.innerWidth - tooltipWidth - 12, calculatedLeft))
    : 12;

  const cardStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${safeTop}px`,
    left: `${safeLeft}px`,
    maxWidth: '360px',
    width: 'calc(100vw - 24px)',
    maxHeight: '130px',
  };

  const arrowLeft = targetRect
    ? Math.max(20, Math.min(tooltipWidth - 20, targetRect.left + targetRect.width / 2 - safeLeft))
    : tooltipWidth / 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[10000] overflow-hidden pointer-events-none"
    >
      {/* 1. Backdrop assombrissant */}
      <div
        className="fixed inset-0 z-[10000] bg-black/65 transition-opacity duration-200 pointer-events-auto"
        onClick={handleFinish}
      />

      {/* 2. Spotlight physique entourant l'élément exact (transition opacité uniquement, zéro effet d'ascenseur) */}
      {targetRect && (
        <div
          className={`fixed pointer-events-none rounded-2xl transition-opacity duration-150 ease-out z-[10002] ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
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

      {/* 3. Bulle explicative compacte & décalée (Ne JAMAIS recouvrir la cible, transition opacité uniquement) */}
      <div
        style={cardStyle}
        className={`z-[10005] bg-[#FFFEFC] border-2 border-amber-300 rounded-2xl shadow-xl p-3 text-[#142943] transition-opacity duration-150 ease-out pointer-events-auto flex flex-col justify-between overflow-hidden ${
          isTransitioning
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flèche fine pointant dynamiquement vers l'élément exact */}
        {targetRect && effectivePlacement === 'bottom' && (
          <div
            className="absolute -top-2 w-0 h-0 border-x-[6px] border-x-transparent border-b-[8px] border-b-amber-300 pointer-events-none"
            style={{
              left: `${arrowLeft}px`,
              transform: 'translateX(-50%)',
            }}
            aria-hidden="true"
          />
        )}
        {targetRect && effectivePlacement === 'top' && (
          <div
            className="absolute -bottom-2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-amber-300 pointer-events-none"
            style={{
              left: `${arrowLeft}px`,
              transform: 'translateX(-50%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* En-tête compact sur 1 ligne */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${currentStep.iconBg}`}
            >
              <Icon size={14} />
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] font-extrabold uppercase tracking-wider text-amber-800 leading-none">
                {currentStep.badge[langKey]}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#142943] truncate leading-tight mt-0.5">
                {currentStep.title[langKey]}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            aria-label={labels.skip}
            className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Corps descriptif condensé en 2 lignes max */}
        <p className="text-[11px] sm:text-xs text-slate-700 leading-snug line-clamp-2 mb-1.5">
          {currentStep.explanation[langKey]}
        </p>

        {/* Stepper Dots & Navigation Précédent / Suivant compacte */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.key}
                type="button"
                onClick={() => executeStepTransition(idx)}
                aria-label={`Étape ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? 'w-5 bg-[#142943]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {!isFirst && (
              <button
                type="button"
                onClick={() => executeStepTransition(Math.max(0, currentIndex - 1))}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {isRtl ? <ArrowRight size={11} /> : <ArrowLeft size={11} />}
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
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold text-white shadow-xs transition-all active:scale-95 ${
                isLast
                  ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400/50'
                  : 'bg-[#142943] hover:bg-[#1b3557]'
              }`}
            >
              <span>{isLast ? labels.finish : labels.next}</span>
              {isLast ? (
                <Check size={11} />
              ) : isRtl ? (
                <ArrowLeft size={11} />
              ) : (
                <ArrowRight size={11} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, ArrowLeft, Compass, MessageSquare, Sparkles, Crown, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface UserGuideModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const GUIDE_SLIDES = {
  fr: [
    {
      step: 1,
      badge: 'ÉTAPE 1 / 4',
      title: '🗺️ Le Parcours Pas à Pas (Modules 1 à 7)',
      description:
        'Apprenez la Darija du débutant à la conversation fluide. Écoutez chaque phrase à vitesse normale (1.0x) ou ralentie (0.75x) avec vocalisation complète (chakl) et phonétique.',
      icon: Compass,
      gradient: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-sky-600 bg-sky-100',
    },
    {
      step: 2,
      badge: 'ÉTAPE 2 / 4',
      title: '🚕 Karim, Votre Coach IA Conversationnel',
      description:
        'Pratiquez l\'oral en immersion réelle dans un petit taxi à Casablanca. Envoyez "Salam" ou utilisez le micro pour discuter. Karim vous répond vocalement en vraie Darija avec traduction sous chaque bulle.',
      icon: MessageSquare,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      step: 3,
      badge: 'ÉTAPE 3 / 4',
      title: '🧠 Répétition Espacée & Cartes Mémoire (SRS)',
      description:
        'Ancrez le vocabulaire dans votre mémoire à long terme en seulement 5 minutes par jour. Cliquez sur la carte pour la retourner (flip 3D) et validez votre niveau de maîtrise.',
      icon: Sparkles,
      gradient: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      step: 4,
      badge: 'ÉTAPE 4 / 4',
      title: '👑 Mon Espace & Code VIP',
      description:
        'Suivez votre passeport d\'apprentissage, vos statistiques et gérez votre abonnement. Si vous avez un code d\'accès (ex: VIPEIDER), activez-le ici pour débloquer 100% de l\'application sans frais !',
      icon: Crown,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ],
  en: [
    {
      step: 1,
      badge: 'STEP 1 / 4',
      title: '🗺️ Step-by-Step Path (Modules 1 to 7)',
      description:
        'Learn Darija step-by-step from zero to fluency. Listen at normal (1.0x) or slow (0.75x) speed with full Arabic vocalization and phonetics.',
      icon: Compass,
      gradient: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-sky-600 bg-sky-100',
    },
    {
      step: 2,
      badge: 'STEP 2 / 4',
      title: '🚕 Karim, Your AI Conversation Coach',
      description:
        'Practice speaking in real-life immersion in a Casablanca taxi. Send "Salam" or use your mic. Karim replies with natural voice and instant translations.',
      icon: MessageSquare,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      step: 3,
      badge: 'STEP 3 / 4',
      title: '🧠 Spaced Repetition & Flashcards (SRS)',
      description:
        'Retain vocabulary in your long-term memory in just 5 minutes a day. Tap cards to flip them in 3D and test your recall.',
      icon: Sparkles,
      gradient: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      step: 4,
      badge: 'STEP 4 / 4',
      title: '👑 My Space & VIP Code',
      description:
        'Track your learning passport and manage your profile. If you have a VIP code (e.g. VIPEIDER), enter it here to unlock everything for free!',
      icon: Crown,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ],
  es: [
    {
      step: 1,
      badge: 'PASO 1 / 4',
      title: '🗺️ La Ruta Paso a Paso (Módulos 1 a 7)',
      description:
        'Aprende Darija paso a paso desde cero. Escucha a velocidad normal (1.0x) o lenta (0.75x) con vocalización completa y fonética.',
      icon: Compass,
      gradient: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-sky-600 bg-sky-100',
    },
    {
      step: 2,
      badge: 'PASO 2 / 4',
      title: '🚕 Karim, Tu Coach IA de Conversación',
      description:
        'Practica hablando en una inmersión real en un taxi en Casablanca. Di "Salam" o usa tu micrófono. Karim te responderá con voz natural y traducción.',
      icon: MessageSquare,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      step: 3,
      badge: 'PASO 3 / 4',
      title: '🧠 Repetición Espaciada y Tarjetas de Memoria (SRS)',
      description:
        'Memoriza vocabulario a largo plazo en solo 5 minutos al día. Toca las tarjetas para voltearlas en 3D y califica tu nivel.',
      icon: Sparkles,
      gradient: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      step: 4,
      badge: 'PASO 4 / 4',
      title: '👑 Mi Espacio y Código VIP',
      description:
        'Sigue tu pasaporte de progreso y perfil. Si tienes un código VIP (ej: VIPEIDER), actívalo aquí para desbloquear todo gratis.',
      icon: Crown,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ],
  ar: [
    {
      step: 1,
      badge: 'الخطوة 1 / 4',
      title: '🗺️ المسار خطوة بخطوة (الوحدات 1 إلى 7)',
      description:
        'تعلم الدارجة المغربية خطوة بخطوة من الصفر. استمع للنطق بالسرعة العادية (1.0x) أو البطيئة (0.75x) مع التشكيل الكامل والكتابة الصوتية.',
      icon: Compass,
      gradient: 'from-blue-500/20 to-sky-500/10',
      iconColor: 'text-sky-600 bg-sky-100',
    },
    {
      step: 2,
      badge: 'الخطوة 2 / 4',
      title: '🚕 كريم، مدربك بالذكاء الاصطناعي للمحادثة',
      description:
        'مارس المحادثة الشفوية في محاكاة واقعية داخل تاكسي بالدار البيضاء. أرسل "سلام" أو استعمل الميكروفون. كريم كيجاوْبك بصوت طبيعي مع الترجمة.',
      icon: MessageSquare,
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-600 bg-amber-100',
    },
    {
      step: 3,
      badge: 'الخطوة 3 / 4',
      title: '🧠 التكرار المتباعد وبطاقات الذاكرة (SRS)',
      description:
        'رسخ الكلمات في ذاكرتك على المدى الطويل في 5 دقائق يومياً. اضغط على البطاقة لقلبها بشكل ثلاثي الأبعاد وقيّم حفظك.',
      icon: Sparkles,
      gradient: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-600 bg-purple-100',
    },
    {
      step: 4,
      badge: 'الخطوة 4 / 4',
      title: '👑 مساحتي والرمز الخاص VIP',
      description:
        'تابع جواز تعلمك وإحصائياتك. إذا كان لديك رمز خاص (مثل VIPEIDER)، فعّله هنا لفتح جميع ميزات التطبيق مجاناً!',
      icon: Crown,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-600 bg-emerald-100',
    },
  ],
};

const UI_TEXTS = {
  fr: {
    prev: 'Précédent',
    next: 'Suivant',
    finish: 'C\'est parti !',
    close: 'Fermer',
    guideTitle: 'Guide d\'utilisation Kenza',
  },
  en: {
    prev: 'Previous',
    next: 'Next',
    finish: 'Let\'s go!',
    close: 'Close',
    guideTitle: 'Kenza User Guide',
  },
  es: {
    prev: 'Anterior',
    next: 'Siguiente',
    finish: '¡Empezar!',
    close: 'Cerrar',
    guideTitle: 'Guía de uso de Kenza',
  },
  ar: {
    prev: 'السابق',
    next: 'التالي',
    finish: 'لنبدأ !',
    close: 'إغلاق',
    guideTitle: 'دليل استخدام كنزة',
  },
};

export default function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const userGuideOpen = useAppStore((s) => s.userGuideOpen);
  const setUserGuideOpen = useAppStore((s) => s.setUserGuideOpen);
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as keyof typeof GUIDE_SLIDES;
  const slides = GUIDE_SLIDES[langKey];
  const ui = UI_TEXTS[langKey];
  const isRtl = langKey === 'ar';

  const [currentStep, setCurrentStep] = useState(0);

  // 1. Déclenchement automatique lors de la première visite
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const completed = localStorage.getItem('kenza_onboarding_completed');
      if (!completed) {
        const timer = window.setTimeout(() => {
          setUserGuideOpen(true);
        }, 800);
        return () => window.clearTimeout(timer);
      }
    } catch {}
  }, [setUserGuideOpen]);

  const active = isOpen !== undefined ? isOpen : userGuideOpen;

  const handleClose = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kenza_onboarding_completed', 'true');
      }
    } catch {}
    if (onClose) {
      onClose();
    }
    setUserGuideOpen(false);
  }, [onClose, setUserGuideOpen]);

  // Fermeture sur Échap
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

  if (!active) return null;

  const slide = slides[currentStep];
  const Icon = slide.icon;
  const isLast = currentStep === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep((prev) => Math.min(slides.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-guide-title"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFEFA] border border-amber-200/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={ui.close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header de la slide */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${slide.iconColor}`}>
            <Icon size={24} />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-800">
              {slide.badge}
            </span>
            <h2 id="user-guide-title" className="text-lg font-bold text-[#142943] leading-snug">
              {slide.title}
            </h2>
          </div>
        </div>

        {/* Corps descriptif */}
        <div className="min-h-[110px] sm:min-h-[120px] flex items-center">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {slide.description}
          </p>
        </div>

        {/* Indicateur Stepper (Dots) */}
        <div className="flex items-center justify-center gap-2.5 my-6">
          {slides.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(idx)}
              aria-label={`Étape ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-[#142943]' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span>{ui.prev}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
              isLast
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-[#142943] hover:bg-[#1a3556] shadow-[#142943]/20'
            }`}
          >
            <span>{isLast ? ui.finish : ui.next}</span>
            {isLast ? (
              <Check size={16} />
            ) : isRtl ? (
              <ArrowLeft size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

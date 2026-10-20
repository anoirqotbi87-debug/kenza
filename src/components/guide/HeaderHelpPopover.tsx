'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CircleHelp, Sparkles, BookOpen, Ticket, ChevronRight, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface HeaderHelpPopoverProps {
  onStartLiveTour: () => void;
  onOpenFaq: () => void;
  onOpenVipPromo: () => void;
}

export default function HeaderHelpPopover({
  onStartLiveTour,
  onOpenFaq,
  onOpenVipPromo,
}: HeaderHelpPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const strings = {
    fr: {
      helpBtn: 'Aide & Démarrage',
      title: 'Besoin d\'un coup de pouce ?',
      tourTitle: 'Visite guidée en direct',
      tourDesc: 'Découvrez les 5 onglets en direct avec le spotlight fléché.',
      faqTitle: 'Questions fréquentes (FAQ)',
      faqDesc: 'Ralentir le son, parler à Karim, SRS, etc.',
      vipTitle: 'Activer un code VIP',
      vipDesc: 'Débloquer l\'accès complet avec votre code (ex: VIPEIDER).',
      close: 'Fermer',
    },
    en: {
      helpBtn: 'Help & Quick Start',
      title: 'Need a helping hand?',
      tourTitle: 'Live Interactive Tour',
      tourDesc: 'Spotlight walkthrough across all key features in real time.',
      faqTitle: 'Frequently Asked Questions',
      faqDesc: 'Slowing down audio, AI Karim coach, SRS, etc.',
      vipTitle: 'Redeem VIP Code',
      vipDesc: 'Unlock full access with your promo code (e.g. VIPEIDER).',
      close: 'Close',
    },
    es: {
      helpBtn: 'Ayuda y Primeros Pasos',
      title: '¿Necesitas ayuda?',
      tourTitle: 'Visita guiada en vivo',
      tourDesc: 'Descubre las pestañas en tiempo real con foco interactivo.',
      faqTitle: 'Preguntas Frecuentes (FAQ)',
      faqDesc: 'Ralentizar audio, hablar con Karim, repasos SRS, etc.',
      vipTitle: 'Activar código VIP',
      vipDesc: 'Desbloquea el acceso completo con tu código (ej: VIPEIDER).',
      close: 'Cerrar',
    },
    ar: {
      helpBtn: 'المساعدة والبداية',
      title: 'هل تحتاج إلى إرشاد سريع؟',
      tourTitle: 'جولة توجيهية تفاعلية حية',
      tourDesc: 'استكشف التبويبات مباشرة مع تسليط الضوء والإشارات التوجيهية.',
      faqTitle: 'الأسئلة الشائعة (FAQ)',
      faqDesc: 'إبطاء الصوت، التحدث مع كريم، بطاقات الذاكرة، وغيرها.',
      vipTitle: 'تفعيل رمز VIP خاص',
      vipDesc: 'فتح الوصول الكامل والشامل برمزك الخاص (مثل VIPEIDER).',
      close: 'إغلاق',
    },
  };

  const t = strings[lang] || strings.fr;

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Bouton '?' dans l'en-tête */}
      <button
        type="button"
        id="tour-header-help-button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all shadow-2xs ${
          isOpen
            ? 'bg-amber-200 border-amber-400 text-[#142943] ring-2 ring-amber-300'
            : 'border-amber-200/80 bg-amber-50/80 text-[#142943] hover:bg-amber-100/80'
        }`}
        title={t.helpBtn}
        aria-label={t.helpBtn}
        aria-expanded={isOpen}
      >
        <CircleHelp size={16} />
      </button>

      {/* Popover discret et soigné */}
      {isOpen && (
        <div
          className={`absolute ${
            isAr ? 'left-0' : 'right-0'
          } mt-2 w-76 sm:w-80 bg-[#FFFEFC] border-2 border-amber-200/90 rounded-3xl shadow-2xl p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
            <h4 className="text-xs font-bold text-[#142943] flex items-center gap-1.5">
              <span>💡</span>
              <span>{t.title}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* 3 Options Principales */}
          <div className="space-y-1.5">
            {/* Option 1 : Visite guidée en direct */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onStartLiveTour();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 hover:from-amber-100 hover:to-amber-200/80 border border-amber-200/80 text-start transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#142943] group-hover:text-amber-950">
                    {t.tourTitle}
                  </h5>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {t.tourDesc}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-[#142943] shrink-0" />
            </button>

            {/* Option 2 : Questions fréquentes (FAQ) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenFaq();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-start transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#142943]">
                    {t.faqTitle}
                  </h5>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {t.faqDesc}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-[#142943] shrink-0" />
            </button>

            {/* Option 3 : Activer un code VIP */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenVipPromo();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 text-start transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Ticket size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#142943]">
                    {t.vipTitle}
                  </h5>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {t.vipDesc}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-[#142943] shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

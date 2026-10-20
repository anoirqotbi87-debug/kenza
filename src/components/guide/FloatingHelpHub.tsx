'use client';

import React, { useState } from 'react';
import { HelpCircle, BookOpen, Compass, ChevronRight, X, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import HelpCenterView from '@/components/guide/HelpCenterView';
import AppSpotlightTour from '@/components/guide/AppSpotlightTour';

export default function FloatingHelpHub() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const setUserGuideOpen = useAppStore((s) => s.setUserGuideOpen);

  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const strings = {
    fr: {
      fabTitle: 'Besoin d\'aide ?',
      hubHeader: 'Centre d\'Assistance Kenza',
      tourTitle: 'Visite guidée des 5 onglets',
      tourDesc: 'Comprendre l\'application en 1 minute avec captures d\'écran.',
      guideTitle: 'Guide de démarrage (4 étapes)',
      guideDesc: 'Méthode d\'apprentissage pas à pas.',
      faqTitle: 'Questions fréquentes & FAQ',
      faqDesc: 'Ralentir le son, parler à Karim, etc.',
      close: 'Fermer',
    },
    en: {
      fabTitle: 'Need help?',
      hubHeader: 'Kenza Support Hub',
      tourTitle: '5-Tab Interactive Tour',
      tourDesc: 'Understand the app in 1 minute with screenshots.',
      guideTitle: 'Quick Start Guide (4 steps)',
      guideDesc: 'Step-by-step learning method.',
      faqTitle: 'Frequently Asked Questions',
      faqDesc: 'Slow audio down, speak to Karim, etc.',
      close: 'Close',
    },
    es: {
      fabTitle: '¿Necesitas ayuda?',
      hubHeader: 'Centro de Ayuda Kenza',
      tourTitle: 'Visita guiada de las 5 pestañas',
      tourDesc: 'Entiende la app en 1 minuto con capturas de pantalla.',
      guideTitle: 'Guía de inicio (4 pasos)',
      guideDesc: 'Método de aprendizaje paso a paso.',
      faqTitle: 'Preguntas Frecuentes y FAQ',
      faqDesc: 'Ralentizar audio, hablar con Karim, etc.',
      close: 'Cerrar',
    },
    ar: {
      fabTitle: 'هل تحتاج إلى مساعدة؟',
      hubHeader: 'مركز مساعدة كنزة',
      tourTitle: 'جولة استكشاف التبويبات الـ 5',
      tourDesc: 'افهم التطبيق في دقيقة واحدة مع لقطات شاشة واضحة.',
      guideTitle: 'دليل البداية (4 خطوات)',
      guideDesc: 'منهجية التعلم خطوة بخطوة.',
      faqTitle: 'الأسئلة الشائعة والدعم',
      faqDesc: 'إبطاء الصوت، التحدث مع كريم، وغيرها.',
      close: 'إغلاق',
    },
  };

  const t = strings[lang] || strings.fr;

  return (
    <>
      {/* Bouton Flottant Circulaire (Floating Action Button) */}
      <div
        className={`fixed z-40 bottom-20 md:bottom-8 ${
          isAr ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={t.fabTitle}
          title={t.fabTitle}
          className="group relative flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-[#142943] via-[#1c385b] to-[#142943] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-amber-300/80 focus:outline-none focus:ring-4 focus:ring-amber-300/40"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 text-[#142943] flex items-center justify-center font-bold text-xs shadow-xs group-hover:rotate-12 transition-transform">
            ❓
          </div>
          <span className="hidden sm:inline-block text-xs font-bold tracking-wide text-amber-200 group-hover:text-white transition-colors">
            {t.fabTitle}
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
        </button>

        {/* Menu Popover Flottant */}
        {menuOpen && (
          <div
            className={`absolute bottom-16 ${
              isAr ? 'left-0' : 'right-0'
            } w-80 sm:w-88 bg-[#FFFEFC] border-2 border-amber-200/90 rounded-3xl shadow-2xl p-4 space-y-2 animate-in zoom-in-95 fade-in duration-150 z-50`}
          >
            {/* Header du Hub */}
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#142943]">
                  {t.hubHeader}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.close}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Option 1 : Visite Guidée des 5 onglets avec captures */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSpotlightOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-start transition-all group"
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

            {/* Option 2 : Guide de démarrage (4 étapes interactives) */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setUserGuideOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-start transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Compass size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#142943]">
                    {t.guideTitle}
                  </h5>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {t.guideDesc}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-[#142943] shrink-0" />
            </button>

            {/* Option 3 : Centre d'Aide & FAQ Complète */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setHelpCenterOpen(true);
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
          </div>
        )}
      </div>

      {/* Modale de la Visite Guidée des 5 onglets */}
      {spotlightOpen && (
        <AppSpotlightTour isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      )}

      {/* Modale du Centre d'Aide & FAQ */}
      {helpCenterOpen && (
        <HelpCenterView isOpen={helpCenterOpen} onClose={() => setHelpCenterOpen(false)} />
      )}
    </>
  );
}

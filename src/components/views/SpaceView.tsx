'use client';

import React, { useState } from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import VipPromoCard from '@/components/promo/VipPromoCard';
import { useAppStore } from '@/store/useAppStore';
import HelpCenterView from '@/components/guide/HelpCenterView';

/**
 * Re-export pour l'intégration de la carte VIP promotionnelle
 * et compatibilité avec l'architecture modulaire de Mon Espace.
 */
export { default as VipPromoCard } from '@/components/promo/VipPromoCard';

export function SpaceGuideButton({ onOpenGuide }: { onOpenGuide?: () => void }) {
  const setUserGuideOpen = useAppStore((s) => s.setUserGuideOpen);
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const handleOpen = onOpenGuide || (() => setUserGuideOpen(true));

  const labels = {
    fr: "❓ Guide d'utilisation & Démarrage",
    en: "❓ User Guide & Getting Started",
    es: "❓ Guía de uso y Primeros pasos",
    ar: "❓ دليل الاستخدام والبداية",
  };

  const label = labels[uiLanguage] || labels.fr;

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#142943] bg-amber-100/80 hover:bg-amber-200 border border-amber-300/80 rounded-lg transition-colors shadow-2xs"
    >
      <span>{label}</span>
    </button>
  );
}

export function SpaceHelpCenterCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  const texts = {
    fr: {
      kicker: 'AIDE & SUPPORT',
      title: 'Centre d\'Aide & FAQ',
      desc: 'Des réponses claires à vos questions : comment débuter, ralentir l\'audio, discuter avec Karim et réviser avec le SRS.',
      btn: 'Ouvrir le Centre d\'Aide',
    },
    en: {
      kicker: 'HELP & SUPPORT',
      title: 'Help Center & FAQ',
      desc: 'Clear answers to your questions: how to start, slowing down audio, chatting with Karim, and spaced repetition reviews.',
      btn: 'Open Help Center',
    },
    es: {
      kicker: 'AYUDA Y SOPORTE',
      title: 'Centro de Ayuda y Preguntas Frecuentes',
      desc: 'Respuestas claras: cómo empezar, ralentizar audio, hablar con Karim y repasar con el sistema SRS.',
      btn: 'Abrir Centro de Ayuda',
    },
    ar: {
      kicker: 'المساعدة والدعم',
      title: 'مركز المساعدة والأسئلة الشائعة',
      desc: 'إجابات واضحة: كيف تبدأ، إبطاء الصوت، التحدث مع كريم، والمراجعة الذكية ببطاقات الذاكرة.',
      btn: 'فتح مركز المساعدة',
    },
  };

  const t = texts[uiLanguage] || texts.fr;

  return (
    <>
      <article className="data-card bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 border border-amber-200/90 shadow-xs">
        <div className="data-card-heading">
          <span className="data-icon bg-amber-100 text-amber-900 border border-amber-200/60">
            <HelpCircle size={18} />
          </span>
          <div>
            <span className="mini-kicker">{t.kicker}</span>
            <h3>{t.title}</h3>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t.desc}
        </p>
        <div className="pt-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#142943] bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shadow-xs active:scale-95"
          >
            <BookOpen size={15} />
            <span>{t.btn}</span>
          </button>
        </div>
      </article>

      {modalOpen && (
        <HelpCenterView isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export default VipPromoCard;

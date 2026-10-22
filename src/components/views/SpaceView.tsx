'use client';

import React from 'react';
import VipPromoCard from '@/components/promo/VipPromoCard';
import { useAppStore } from '@/store/useAppStore';

/**
 * Re-export pour l'intégration de la carte VIP promotionnelle
 * et compatibilité avec l'architecture modulaire de Mon Espace.
 */
export { default as VipPromoCard } from '@/components/promo/VipPromoCard';

export function SpaceGuideButton({ onOpenGuide }: { onOpenGuide?: () => void }) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  const labels = {
    fr: "🧭 Visite guidée interactive",
    en: "🧭 Interactive Guided Tour",
    es: "🧭 Visita guiada interactiva",
    ar: "🧭 جولة إرشادية تفاعلية",
  };

  const label = labels[uiLanguage] || labels.fr;

  return (
    <button
      type="button"
      onClick={onOpenGuide}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#142943] bg-amber-100/80 hover:bg-amber-200 border border-amber-300/80 rounded-lg transition-colors shadow-2xs"
    >
      <span>{label}</span>
    </button>
  );
}

export default VipPromoCard;

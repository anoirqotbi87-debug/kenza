'use client';

import { Crown, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

/**
 * Badge d'état d'abonnement persistant (Trigger 4).
 *
 * Utilisateur gratuit : « Kenza Gratuit » + bouton « Passer Pro » qui ouvre le paywall.
 * Abonné : badge « Kenza Pro » avec couronne, sans incitation.
 */
export default function SubscriptionBadge({ onUpgrade }: { onUpgrade: () => void }) {
  const { t } = useTranslation();
  const isPremium = useAppStore((s) => s.isPremium);
  const h = t.header;

  if (isPremium) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A05C]/20 border border-[#C9A05C]/40 text-[#C9A05C] text-[11px] font-bold whitespace-nowrap"
        title={h.proBadge}
      >
        <Crown size={12} />
        <span className="hidden sm:inline">{h.proBadge}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#FDFCF8]/70 text-[11px] font-semibold">
        <Sparkles size={12} />
        {h.freeBadge}
      </span>
      <button
        type="button"
        onClick={onUpgrade}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] text-[11px] font-bold shadow-sm transition-colors"
      >
        <Crown size={12} />
        {h.upgradeCta} ⭐
      </button>
    </span>
  );
}

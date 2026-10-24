'use client';

import { BadgeCheck, CloudDownload, TriangleAlert } from 'lucide-react';
import { useOfflineReadiness } from '@/lib/offline/readiness';
import { useNetwork } from '@/hooks/useNetwork';
import { useTranslation } from '@/store/useAppStore';

interface OfflineReadyBadgeProps {
  /** `dark` pour un en-tête navy, `light` pour un fond crème. */
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Indicateur discret de disponibilité hors-ligne.
 *
 * Il ne s'affiche que lorsque le Service Worker est actif : sur un navigateur
 * sans support (ou en développement, worker désactivé) il reste invisible
 * plutôt que d'annoncer un mode qui n'existe pas.
 */
export default function OfflineReadyBadge({ variant = 'light', className = '' }: OfflineReadyBadgeProps) {
  const { status, cached, total } = useOfflineReadiness();
  const isOnline = useNetwork();
  const { t } = useTranslation();

  if (status === 'idle' || status === 'unsupported') return null;

  const labels = t.offline;
  const isReady = status === 'ready';
  const isPartial = status === 'partial';
  const text = isReady
    ? labels.badgeReady
    : isPartial
      ? labels.badgePartial.replace('{cached}', String(cached)).replace('{total}', String(total))
      : labels.badgePreparing;

  const tone = isReady
    ? variant === 'dark'
      ? 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : isPartial
      ? variant === 'dark'
        ? 'bg-amber-400/15 text-amber-200 border-amber-400/30'
        : 'bg-amber-50 text-amber-800 border-amber-200'
      : variant === 'dark'
        ? 'bg-white/10 text-white/70 border-white/20'
        : 'bg-[#F3EDDF] text-[#7A7670] border-[#E8E2D5]';

  const Icon = isReady ? BadgeCheck : isPartial ? TriangleAlert : CloudDownload;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${tone} ${className}`}
      title={
        isReady
          ? `${labels.badgeTitle}${isOnline ? '' : ` · ${labels.badgeOfflineHint}`}`
          : `${labels.badgePreparing} ${cached}/${total}`
      }
      aria-live="polite"
    >
      <Icon size={13} className={status === 'preparing' ? 'animate-pulse' : ''} aria-hidden="true" />
      <span className="hidden sm:inline">{text}</span>
      <span className="sr-only sm:hidden">{text}</span>
    </span>
  );
}

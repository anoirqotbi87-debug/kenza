'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import LanguageSelector from './LanguageSelector';
import { KenzaLogo } from './KenzaLogo';
import OfflineReadyBadge from '../OfflineReadyBadge';

interface PageHeaderProps {
  /** Small uppercase eyebrow text (already localized). */
  badge: string;
  /** Main page title (already localized). */
  title: string;
  /** Where the back arrow points. Defaults to home. */
  backHref?: string;
  /** Optional right-side slot rendered before the language selector. */
  actions?: React.ReactNode;
}

/**
 * En-tête de page réutilisable.
 * Intègre systématiquement le sélecteur de langue afin que la langue
 * choisie soit visible sur chaque page et chaque module (objectif d'audit).
 */
export default function PageHeader({ badge, title, backHref = '/', actions }: PageHeaderProps) {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const isAr = uiLanguage === 'ar';
  const backLabel = t.common.back || 'Retour';

  return (
    <header
      dir={isAr ? 'rtl' : 'ltr'}
      className="bg-[#1B2A4A] text-[#FDFCF8] px-3 sm:px-6 py-3.5 sm:py-5 border-b border-[#253961]"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
        {/* Côté gauche : Bouton retour + Titre de la page (avec logo masqué sur mobile pour laisser 100% de place au titre) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            href={backHref}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors shrink-0 text-[#f8f5ec]"
            aria-label={backLabel}
            title={backLabel}
          >
            <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </Link>

          {/* Logo visible uniquement sur écran sm+ pour ne pas écraser le titre sur mobile */}
          <div className="hidden sm:block shrink-0">
            <KenzaLogo size="sm" showWordmark={false} />
          </div>

          <div className="min-w-0 flex-1">
            {badge && (
              <p className="text-[#C9A05C] text-[9px] sm:text-xs font-bold tracking-[0.2em] uppercase truncate">
                {badge}
              </p>
            )}
            <h1 className="font-display text-sm sm:text-xl md:text-2xl font-bold leading-tight truncate text-[#FDFCF8]">
              {title}
            </h1>
          </div>
        </div>

        {/* Côté droit : Actions optionnelles + Sélecteur de langue compact */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <OfflineReadyBadge variant="dark" />
          {actions}
          <LanguageSelector variant="dark" compact={true} className="px-2 py-1" />
        </div>
      </div>
    </header>
  );
}

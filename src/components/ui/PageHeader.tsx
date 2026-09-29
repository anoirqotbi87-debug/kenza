'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import LanguageSelector from './LanguageSelector';

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
  const backLabel = (t as any).common?.back || 'Retour';

  return (
    <header
      dir={isAr ? 'rtl' : 'ltr'}
      className="bg-[#1B2A4A] text-[#FDFCF8] px-4 sm:px-6 py-5"
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
        <Link
          href={backHref}
          className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
          aria-label={backLabel}
          title={backLabel}
        >
          <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="text-[#C9A05C] text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase truncate">
            {badge}
          </p>
          <h1 className="font-serif text-xl sm:text-2xl font-bold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {actions}
          <LanguageSelector variant="dark" />
        </div>
      </div>
    </header>
  );
}

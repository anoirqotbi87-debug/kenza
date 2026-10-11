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
  const backLabel = t.common.back || 'Retour';

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

        {/* Logo Kenza permanent sanctuarisé à gauche */}
        <Link href="/" className="shrink-0 flex items-center gap-2.5" aria-label="Accueil Kenza">
          {/* Carré asymétrique bleu nuit avec lettre arabe et losange doré */}
          <div 
            className="w-9 h-9 relative grid place-items-center overflow-hidden bg-[#142943] text-[#f8f5ec] shadow-xs shrink-0"
            style={{ borderRadius: '13px 13px 13px 5px' }}
            aria-hidden="true"
          >
            <span className="font-['Noto_Sans_Arabic',sans-serif] text-[20px] leading-none -translate-y-px text-[#f8f5ec]">
              ك
            </span>
            <i 
              className="absolute w-2 h-2 border border-[#ddb578] rounded-[2px] right-[5px] bottom-[5px] rotate-45 pointer-events-none" 
            />
          </div>

          {/* Wordmark KENZA en DM Serif Display et signature */}
          <div className="flex flex-col text-left">
            <span className="font-['DM_Serif_Display',serif] text-[18px] tracking-[0.17em] leading-tight text-[#f8f5ec] block">
              KENZA
            </span>
            <span className="text-[9px] tracking-[0.045em] text-[#C9A05C] block -mt-0.5">
              la darija, en chemin
            </span>
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <p className="text-[#C9A05C] text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase truncate">
            {badge}
          </p>
          <h1 className="font-display text-base sm:text-2xl font-bold leading-snug line-clamp-2">{title}</h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {actions}
          <LanguageSelector variant="dark" />
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { CloudOff, RotateCw } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';

/**
 * Page de repli servie par le Service Worker quand une navigation échoue
 * (page jamais visitée) — elle est précachée, donc toujours disponible.
 */
export default function OfflinePage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const isAr = uiLanguage === 'ar';
  const copy = t.offline;

  return (
    <main
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#F7F3EA] flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md text-center">
        <CloudOff size={48} className="mx-auto text-[#C9A05C]" aria-hidden="true" />
        <h1 className="mt-5 font-display text-2xl font-bold text-[#142943]">{copy.fallbackTitle}</h1>
        <p className="mt-3 text-sm text-[#7A7670] leading-relaxed">{copy.fallbackBody}</p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-[#142943] px-5 py-2.5 text-sm font-semibold text-[#FDFCF8] hover:bg-[#1B2A4A] transition-colors"
          >
            <RotateCw size={15} aria-hidden="true" />
            {copy.retry}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E8E2D5] bg-[#FDFCF8] px-5 py-2.5 text-sm font-semibold text-[#142943] hover:border-[#C9A05C] transition-colors"
          >
            {copy.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}

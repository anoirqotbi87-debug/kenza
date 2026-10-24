'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { playAudio } from '@/lib/audio';
import { CULTURAL_GEMS } from '@/data/culturalGems';
import { getGemExplanation, getGemOfTheDay, getHeadlinePhrase, localize } from '@/lib/culture/engine';
import { useHydrated } from '@/lib/culture/clientStore';

type WidgetI18n = {
  widgetKicker?: string;
  widgetCta?: string;
  listen?: string;
};

/**
 * Perle culturelle du jour. Le tirage est calculé après montage : il dépend de
 * la date locale du navigateur, la calculer au rendu serveur provoquerait une
 * divergence d'hydratation au passage de minuit.
 */
export default function GemOfTheDayCard() {
  const { uiLanguage } = useAppStore();
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const labels = (t.pages?.culture ?? {}) as WidgetI18n;
  const hydrated = useHydrated();
  const gem = hydrated ? getGemOfTheDay(CULTURAL_GEMS) : null;

  if (!gem) return null;

  const headline = getHeadlinePhrase(gem);

  return (
    <article className="mt-6 rounded-2xl border border-[#E3D6B8] bg-gradient-to-br from-[#FBF6E9] to-[#FDFCF8] p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#A9843F]">
          <Sparkles size={13} />
          {labels.widgetKicker ?? 'PERLE CULTURELLE DU JOUR'}
        </span>
        <button
          type="button"
          onClick={() => void playAudio(headline.arabizi, undefined, soundEnabled, 1)}
          className="w-9 h-9 grid place-items-center rounded-full bg-[#142943] text-[#FDFCF8] hover:bg-[#1B2A4A] transition-colors shrink-0"
          aria-label={labels.listen ?? 'Écouter'}
          title={labels.listen ?? 'Écouter'}
        >
          <Volume2 size={16} />
        </button>
      </div>

      <p className="mt-3 font-display text-xl sm:text-2xl font-bold text-[#142943] leading-snug" dir="ltr">
        {headline.arabizi}
      </p>
      <p className="text-base text-[#142943]/70" dir="rtl" lang="ar">
        {headline.arabic}
      </p>
      <p className="mt-1 text-sm text-[#6B7280]" dir={isAr ? 'rtl' : 'ltr'}>
        {localize(headline.translation, lang)}
      </p>
      <p className="mt-2 text-sm text-[#7A7670] leading-relaxed" dir={isAr ? 'rtl' : 'ltr'}>
        {getGemExplanation(gem, lang)}
      </p>

      <Link
        href="/culture"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A9843F] hover:text-[#142943] transition-colors"
      >
        {labels.widgetCta ?? 'Voir toutes les perles'}
        <ArrowRight size={15} className={isAr ? 'rotate-180' : ''} />
      </Link>
    </article>
  );
}

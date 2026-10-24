'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  Heart,
  MessagesSquare,
  Plus,
  ScrollText,
  Turtle,
  Volume2,
  WifiOff,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { playAudio } from '@/lib/audio';
import {
  CULTURAL_GEMS,
  CULTURAL_GEMS_BY_CATEGORY,
  type CulturalGem,
  type GemCategory,
} from '@/data/culturalGems';
import {
  filterGems,
  getGemExplanation,
  getGemStreetExample,
  getHeadlinePhrase,
  getSecondaryPhrase,
  localize,
  toSrsCard,
} from '@/lib/culture/engine';
import { toggleCultureFavorite, useCultureFavorites } from '@/lib/culture/clientStore';

const SLOW_SPEED = 0.75;

type CultureI18n = {
  badge?: string;
  title?: string;
  subtitle?: string;
  offlineBadge?: string;
  tabPoliteness?: string;
  tabWisdom?: string;
  heard?: string;
  answer?: string;
  literal?: string;
  meaning?: string;
  inTheStreet?: string;
  listen?: string;
  slowListen?: string;
  addToSrs?: string;
  addedToSrs?: string;
  favorite?: string;
  unfavorite?: string;
  onlyFavorites?: string;
  emptyFavorites?: string;
  gemsLabel?: string;
  widgetKicker?: string;
  widgetCta?: string;
};

function GemCard({
  gem,
  lang,
  labels,
  isFavorite,
  onToggleFavorite,
}: {
  gem: CulturalGem;
  lang: string;
  labels: CultureI18n;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const addCustomWordToSRS = useAppStore((s) => s.addCustomWordToSRS);
  const [added, setAdded] = useState(false);

  const headline = getHeadlinePhrase(gem);
  const secondary = getSecondaryPhrase(gem);
  const example = getGemStreetExample(gem);
  const isAr = lang === 'ar';

  const play = (slow: boolean) => {
    void playAudio(headline.arabizi, undefined, soundEnabled, slow ? SLOW_SPEED : 1);
  };

  const handleAddToSrs = () => {
    addCustomWordToSRS(toSrsCard(gem, lang));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <article className="bg-[#FDFCF8] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-[#C9A05C]">
          {gem.category === 'pingpong' ? <MessagesSquare size={13} /> : <ScrollText size={13} />}
          {gem.category === 'pingpong' ? labels.tabPoliteness : labels.tabWisdom}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavorite(gem.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? labels.unfavorite : labels.favorite}
          title={isFavorite ? labels.unfavorite : labels.favorite}
          className={`w-8 h-8 grid place-items-center rounded-full transition-colors ${
            isFavorite
              ? 'bg-[#C9A05C] text-white'
              : 'bg-[#F3EDDF] text-[#7A7670] hover:text-[#C9A05C]'
          }`}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {gem.category === 'pingpong' ? (
        <div className="mt-3">
          <p className="text-xs text-[#7A7670]" dir={isAr ? 'rtl' : 'ltr'}>
            {localize(gem.situation, lang)}
          </p>

          <div className="mt-3 rounded-xl bg-[#F7F3EA] border border-[#EDE6D8] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9C9490]">
              {labels.heard}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-[#142943]" dir="ltr">
              {secondary?.arabizi}
            </p>
            <p className="text-sm text-[#142943]/60" dir="rtl" lang="ar">
              {secondary?.arabic}
            </p>
            <p className="text-xs text-[#7A7670]" dir={isAr ? 'rtl' : 'ltr'}>
              {secondary ? localize(secondary.translation, lang) : ''}
            </p>
          </div>

          <div className="flex items-center justify-center my-2 text-[#C9A05C]" aria-hidden="true">
            <ArrowRight size={16} className={isAr ? 'rotate-180' : 'rotate-90'} />
          </div>

          <div className="rounded-xl bg-[#E7F0E4] border border-[#CFE0C8] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#2E6B41]">
              {labels.answer}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-[#142943]" dir="ltr">
              {headline.arabizi}
            </p>
            <p className="text-base text-[#142943]/75" dir="rtl" lang="ar">
              {headline.arabic}
            </p>
            <p className="text-sm text-[#3F5F49]" dir={isAr ? 'rtl' : 'ltr'}>
              {localize(headline.translation, lang)}
            </p>
          </div>

          <p className="mt-3 text-xs text-[#7A7670] leading-relaxed" dir={isAr ? 'rtl' : 'ltr'}>
            {getGemExplanation(gem, lang)}
          </p>
        </div>
      ) : (
        <div className="mt-3">
          <p className="font-display text-xl font-bold text-[#142943] leading-snug" dir="ltr">
            {headline.arabizi}
          </p>
          <p className="text-base text-[#142943]/70" dir="rtl" lang="ar">
            {headline.arabic}
          </p>
          <p className="mt-1 text-sm text-[#6B7280]" dir={isAr ? 'rtl' : 'ltr'}>
            {localize(headline.translation, lang)}
          </p>

          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9C9490]">
                {labels.literal}
              </dt>
              <dd className="text-[#7A7670]" dir={isAr ? 'rtl' : 'ltr'}>
                {localize(gem.literal, lang)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9C9490]">
                {labels.meaning}
              </dt>
              <dd className="text-[#142943]" dir={isAr ? 'rtl' : 'ltr'}>
                {getGemExplanation(gem, lang)}
              </dd>
            </div>
          </dl>

          {example && (
            <div className="mt-3 rounded-xl bg-[#F7F3EA] border border-[#EDE6D8] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9C9490]">
                {labels.inTheStreet}
              </p>
              <p className="mt-1 text-sm text-[#142943]" dir="ltr">
                {example.arabizi}
              </p>
              <p className="text-sm text-[#7A7670]" dir={isAr ? 'rtl' : 'ltr'}>
                {localize(example.translation, lang)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => play(false)}
          className="w-9 h-9 grid place-items-center rounded-full bg-[#142943] text-[#FDFCF8] hover:bg-[#1B2A4A] transition-colors"
          aria-label={labels.listen}
          title={labels.listen}
        >
          <Volume2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => play(true)}
          className="w-9 h-9 grid place-items-center rounded-full bg-[#F3EDDF] text-[#142943] hover:bg-[#E8E2D5] transition-colors"
          aria-label={labels.slowListen}
          title={labels.slowListen}
        >
          <Turtle size={16} />
        </button>
        <button
          type="button"
          onClick={handleAddToSrs}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
            added
              ? 'bg-[#2E6B41] text-white'
              : 'bg-[#F3EDDF] text-[#142943] hover:bg-[#E8E2D5]'
          }`}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
          {added ? labels.addedToSrs : labels.addToSrs}
        </button>
      </div>
    </article>
  );
}

export default function CulturePage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const labels = (t.pages?.culture ?? {}) as CultureI18n;

  const [tab, setTab] = useState<GemCategory>('pingpong');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const favorites = useCultureFavorites();

  const gems = useMemo(() => {
    const forTab = filterGems(CULTURAL_GEMS, tab);
    return onlyFavorites ? forTab.filter((gem) => favorites.includes(gem.id)) : forTab;
  }, [tab, onlyFavorites, favorites]);

  const tabs: { id: GemCategory; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'pingpong',
      label: labels.tabPoliteness ?? 'Politesse & Rituels',
      icon: <MessagesSquare size={15} />,
      count: CULTURAL_GEMS_BY_CATEGORY.pingpong.length,
    },
    {
      id: 'proverb',
      label: labels.tabWisdom ?? 'Sagesse de la Rue',
      icon: <ScrollText size={15} />,
      count: CULTURAL_GEMS_BY_CATEGORY.proverb.length,
    },
  ];

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={labels.badge ?? 'Sagesse & Street Darija'}
        title={labels.title ?? 'Perles culturelles de Darija'}
        backHref="/?view=space"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        <p className="text-sm text-[#7A7670] leading-relaxed max-w-2xl" dir={isAr ? 'rtl' : 'ltr'}>
          {labels.subtitle ??
            'Les formules qu’on te tend et les proverbes qu’on te lance : apprends la bonne réplique et la sagesse qui va avec.'}
        </p>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E7F0E4] text-[#2E6B41] text-xs font-semibold">
            <WifiOff size={14} />
            <span>{labels.offlineBadge ?? '100% hors-ligne'}</span>
            <BadgeCheck size={14} />
          </div>
          <span className="text-xs text-[#9C9490]">
            {CULTURAL_GEMS.length} {labels.gemsLabel ?? 'perles'}
          </span>
          <button
            type="button"
            onClick={() => setOnlyFavorites((v) => !v)}
            aria-pressed={onlyFavorites}
            className={`ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-colors ${
              onlyFavorites
                ? 'bg-[#C9A05C] text-white border-[#C9A05C]'
                : 'bg-[#FDFCF8] text-[#7A7670] border-[#E8E2D5] hover:border-[#C9A05C]'
            }`}
          >
            <Heart size={14} fill={onlyFavorites ? 'currentColor' : 'none'} />
            {labels.onlyFavorites ?? 'Mes favoris'} ({favorites.length})
          </button>
        </div>

        <div
          role="tablist"
          aria-label={labels.title ?? 'Catégories culturelles'}
          className="mt-5 grid grid-cols-2 gap-2 p-1 bg-[#F3EDDF] rounded-2xl"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === item.id
                  ? 'bg-[#142943] text-[#FDFCF8] shadow-sm'
                  : 'text-[#7A7670] hover:text-[#142943]'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              <span
                className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                  tab === item.id ? 'bg-white/15' : 'bg-[#E8E2D5]'
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {gems.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto text-[#C9A05C]" />
            <p className="mt-4 text-sm text-[#7A7670]">
              {labels.emptyFavorites ?? 'Aucune perle dans tes favoris pour cet onglet.'}
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {gems.map((gem) => (
              <GemCard
                key={gem.id}
                gem={gem}
                lang={lang}
                labels={labels}
                isFavorite={favorites.includes(gem.id)}
                onToggleFavorite={toggleCultureFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

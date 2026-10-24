'use client';

import React, { useMemo, useRef, useState } from 'react';
import { Search, Volume2, BookOpen, BadgeCheck, WifiOff } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { searchDictionary, DictionaryEntry } from '@/lib/dictionary/dictionarySearch';
import { playAudio } from '@/lib/audio';
import type { MultiLangText } from '@/types/curriculum';

const SLOW_SPEED = 0.75;

/** Saisit une traduction localisée, avec repli sur le français. */
function localize(m: MultiLangText | string, lang: keyof MultiLangText): string {
  return typeof m === 'string' ? m : m[lang] ?? m.fr ?? '';
}

/** Catégories du corpus (ordre d'affichage stable pour les filtres). */
const CATEGORY_ORDER = [
  'polite_social', 'cafe_resto', 'urgencies_health', 'taxi_transport', 'souk_shopping',
  'housing_riad', 'travel_directions', 'numbers_time', 'grammar_basics', 'shopping', 'food_drink',
];

function CategoryChips({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const { t } = useTranslation();
  const cats = t.pages?.dictionnaire?.categories as Record<string, string> | undefined;
  const allLabel = cats?.all ?? 'Toutes';
  const slugs = CATEGORY_ORDER.filter((c) => cats && cats[c]);

  return (
    <div className="flex flex-wrap gap-1.5 mt-3" role="group" aria-label="Filtrer par catégorie">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
          value === null
            ? 'bg-[#142943] text-white border-[#142943]'
            : 'bg-[#FDFCF8] text-[#7A7670] border-[#E8E2D5] hover:border-[#C9A05C]'
        }`}
      >
        {allLabel}
      </button>
      {slugs.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(value === cat ? null : cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            value === cat
              ? 'bg-[#C9A05C] text-white border-[#C9A05C]'
              : 'bg-[#FDFCF8] text-[#7A7670] border-[#E8E2D5] hover:border-[#C9A05C]'
          }`}
        >
          {cats?.[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}

function DictCard({ entry, lang }: { entry: DictionaryEntry; lang: string }) {
  const { t } = useTranslation();
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const dict = t.pages?.dictionnaire as {
    listen?: string;
    slowListen?: string;
    categories?: Record<string, string>;
  } | undefined;

  const tr = entry.translation;
  const tKey = (lang === 'fr' || lang === 'en' || lang === 'es' || lang === 'ar' ? lang : 'fr') as keyof MultiLangText;
  const trText = localize(tr, tKey);
  const example = entry.example;
  const exampleText = example ? localize(example.translation, tKey) : '';

  const handlePlay = (e: React.MouseEvent, slow = false) => {
    e.stopPropagation();
    const speed = slow ? SLOW_SPEED : 1;
    void playAudio(entry.arabizi || entry.arabic, entry.audioUrl, soundEnabled, speed);
  };

  const catLabel = dict?.categories?.[entry.category ?? ''] ?? entry.category ?? '';

  return (
    <article className="bg-[#FDFCF8] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#C9A05C]">
            {catLabel || '—'}
          </p>
          <div className="mt-1.5 flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-2xl font-bold text-[#142943]" dir="ltr">
              {entry.arabizi}
            </h2>
            <span className="text-xl text-[#142943]/70 leading-relaxed" dir="rtl" lang="ar">
              {entry.arabic}
            </span>
          </div>
          {trText && (
            <p className="mt-1 text-sm text-[#6B7280]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              {trText}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => handlePlay(e, false)}
            className="w-9 h-9 grid place-items-center rounded-full bg-[#142943] text-[#FDFCF8] hover:bg-[#1B2A4A] transition-colors"
            aria-label={dict?.listen ?? 'Écouter'}
            title={dict?.listen ?? 'Écouter'}
          >
            <Volume2 size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => handlePlay(e, true)}
            className="w-9 h-9 grid place-items-center rounded-full bg-[#F3EDDF] text-[#142943] hover:bg-[#E8E2D5] transition-colors"
            aria-label={dict?.slowListen ?? 'Écoute lente'}
            title={dict?.slowListen ?? 'Écoute lente'}
          >
            🐢
          </button>
        </div>
      </div>

      {example && (
        <div className="mt-3 pt-3 border-t border-[#F0EAE0] text-sm">
          <p className="text-[#142943]" dir="ltr">
            {example.arabizi}
          </p>
          <p className="text-[#7A7670]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {exampleText || trText}
          </p>
        </div>
      )}
    </article>
  );
}

export default function DictionnairePage() {
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dict = t.pages?.dictionnaire as
    | {
        badge?: string;
        title?: string;
        searchPlaceholder?: string;
        noResults?: string;
        offlineBadge?: string;
      }
    | undefined;

  const results = useMemo(() => {
    const q = query.trim();
    if (!q && !category) return [];
    const found = q ? searchDictionary(q, 24) : [];
    if (!category) return found;
    return found.filter((w) => w.category === category);
  }, [query, category]);

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F3EA]">
      <PageHeader
        badge={dict?.badge ?? 'Dictionnaire de Survie'}
        title={dict?.title ?? 'Dictionnaire de Darija hors-ligne'}
        backHref="/?view=space"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Barre de recherche + badge hors-ligne */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict?.searchPlaceholder ?? 'Rechercher un mot…'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FDFCF8] border border-[#E8E2D5] text-sm text-[#142943] placeholder:text-[#B0A998] focus:outline-none focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent"
              aria-label={dict?.searchPlaceholder ?? 'Rechercher'}
            />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E7F0E4] text-[#2E6B41] text-xs font-semibold">
            <WifiOff size={14} />
            <span>{dict?.offlineBadge ?? '100% hors-ligne'}</span>
            <BadgeCheck size={14} className="text-[#2E6B41]" />
          </div>
        </div>

        {/* Filtres par catégorie — affichés dès qu'une requête est saisie */}
        {(query.trim() || category) && <CategoryChips value={category} onChange={setCategory} />}

        {/* Contenu : résultats ou état vide */}
        <div className="mt-5">
          {!query.trim() && !category && (
            <div className="text-center py-16">
              <BookOpen size={44} className="mx-auto text-[#C9A05C]" />
              <p className="mt-4 text-sm text-[#7A7670] max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'اكتب كلمة بالعربية أو بالحروف اللاتينية (مثلاً chhal أو pain) للبحث في القاموس.'
                  : 'Tapez un mot en Arabizi, en arabe ou en français (ex. « chhal », « pain ») — la recherche ignore les variantes d\u2019orthographe.'}
              </p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="text-center py-16">
              <Search size={36} className="mx-auto text-[#C9A05C]/70" />
              <p className="mt-3 text-sm text-[#7A7670]">{dict?.noResults ?? 'Aucun résultat'}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((entry) => (
                <DictCard key={entry.id} entry={entry} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
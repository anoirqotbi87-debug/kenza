'use client';

import React from 'react';
import { Volume2, Bookmark, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>
  lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;

export interface PhraseItem {
  id: string;
  darija: string;
  arabic?: string;
  meaning: string;
  category?: string;
  note?: string;
}

interface PhraseCardProps {
  phrase: PhraseItem;
  index: number;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
  onPlay: (darija: string, arabic?: string, id?: string) => void;
  onCopy: (phrase: PhraseItem) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  index,
  isFavorite,
  onFavorite,
  onPlay,
  onCopy,
}) => {
  const lang = useAppStore((state) => state.uiLanguage);
  const darijaText = phrase.darija || '';
  const arabicText = phrase.arabic || '';
  const meaningText = phrase.meaning || '';
  const categoryText = phrase.category || trL(lang, "Les essentiels", "Essentials", "Lo esencial", "الأساسيات");

  return (
    <article className="phrase-card">
      <div className="phrase-card-top">
        <span className="phrase-category">{categoryText}</span>
        <button
          className={`heart-button ${isFavorite ? "heart-active" : ""}`}
          onClick={() => onFavorite(phrase.id)}
          aria-label={
            isFavorite
              ? trL(lang, "Retirer des favoris", "Remove from favorites", "Quitar de favoritos", "إزالة من المفضلة")
              : trL(lang, "Ajouter aux favoris", "Add to favorites", "Añadir a favoritos", "أضف إلى المفضلة")
          }
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <span className="phrase-index">{String(index + 1).padStart(2, '0')}</span>
      <h3>{darijaText}</h3>
      {arabicText ? (
        <span className="phrase-arabic" dir="rtl">
          {arabicText}
        </span>
      ) : null}
      <div className="phrase-divider" />
      <p className="phrase-meaning">{meaningText}</p>
      {phrase.note ? <p className="phrase-note">{phrase.note}</p> : null}
      <div className="phrase-actions">
        <button onClick={() => onPlay(darijaText, arabicText, phrase.id)}>
          <Volume2 size={15} /> {trL(lang, "Écouter", "Listen", "Escuchar", "استمع")}
        </button>
        <button onClick={() => onCopy(phrase)}>
          <Bookmark size={14} /> {trL(lang, "Copier", "Copy", "Copiar", "نسخ")}
        </button>
      </div>
    </article>
  );
};

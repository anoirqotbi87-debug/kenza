'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Heart, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PhraseCard, PhraseItem } from '@/components/phrases/PhraseCard';
import { srsVocabulary } from '@/data/srs-deck';

const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>
  lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;

export default function PhrasesPage() {
  const lang = useAppStore((state) => state.uiLanguage);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('__all__');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('kenza_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allPhrases = useMemo<PhraseItem[]>(() => {
    const base: PhraseItem[] = [
      { id: "salam", darija: "Salam, labas?", arabic: "سَلَامْ، لَابَاسْ ؟", meaning: trL(lang, "Bonjour, comment ça va ?", "Hello, how are you?", "Hola, ¿cómo estás?", "مرحباً، كيف حالك؟"), category: trL(lang, "Salutations", "Greetings", "Saludos", "التحيات") },
      { id: "bikhir", darija: "Labas, hamdullah.", arabic: "لَابَاسْ، الْحَمْدُ لِلَّهْ.", meaning: trL(lang, "Ça va bien, merci.", "I'm fine, thank God.", "Bien, gracias a Dios.", "بخير، والحمد لله."), category: trL(lang, "Salutations", "Greetings", "Saludos", "التحيات") },
      { id: "afak", darija: "Wahed atay, afak.", arabic: "وَاحِدْ أَتَايْ، عَافَاكْ.", meaning: trL(lang, "Un thé, s'il vous plaît.", "A tea, please.", "Un té, por favor.", "شاي من فضلك."), category: trL(lang, "Café & Repas", "Cafe & Food", "Café y Comida", "المقهى والوجبات") },
      { id: "bghit", darija: "Bghit lma, afak.", arabic: "بْغِيتْ الْمَا، عَافَاكْ.", meaning: trL(lang, "Je veux de l'eau, s'il vous plaît.", "I want water, please.", "Quiero agua, por favor.", "أريد ماءً من فضلك."), category: trL(lang, "Café & Repas", "Cafe & Food", "Café y Comida", "المقهى والوجبات") },
      { id: "fin", darija: "Fin kayn souk?", arabic: "فِينْ كَايْنْ السُّوقْ ؟", meaning: trL(lang, "Où se trouve le souk ?", "Where is the souk?", "¿Dónde está el zoco?", "أين السوق؟"), category: trL(lang, "Orientation", "Orientation", "Orientación", "الاتجاهات") },
      { id: "shukran", darija: "Shukran bzaf!", arabic: "شُكْرَانْ بْزَّافْ !", meaning: trL(lang, "Merci beaucoup !", "Thank you very much!", "¡Muchas gracias!", "شكراً جزيلاً!"), category: trL(lang, "Politesse", "Politeness", "Cortesía", "اللياقة") },
      { id: "smah", darija: "Smah liya.", arabic: "سْمَحْ لِيَّا.", meaning: trL(lang, "Excusez-moi / pardon.", "Excuse me / sorry.", "Disculpe / perdón.", "اسمح لي / عذراً."), category: trL(lang, "Politesse", "Politeness", "Cortesía", "اللياقة") },
      { id: "bslama", darija: "Bslama, nshawfek.", arabic: "بْسْلَامَةْ، نْشُوفْكْ.", meaning: trL(lang, "Au revoir, à bientôt.", "Goodbye, see you.", "Adiós, nos vemos.", "مع السلامة، أراك لاحقاً."), category: trL(lang, "Salutations", "Greetings", "Saludos", "التحيات") },
    ];

    const srsItems: PhraseItem[] = srsVocabulary.slice(0, 40).map((v) => {
      let translationStr = '';
      if (typeof v.translation === 'string') {
        translationStr = v.translation;
      } else if (v.translation && typeof v.translation === 'object') {
        const trans = v.translation as unknown as Record<string, string>;
        translationStr = trans[lang] || trans.fr || trans.en || '';
      }
      return {
        id: v.id,
        darija: v.arabizi,
        arabic: v.arabic,
        meaning: translationStr,
        category: trL(lang, "Les essentiels", "Essentials", "Lo esencial", "الأساسيات")
      };
    });

    const result = [...base];
    for (const item of srsItems) {
      if (item.darija && !result.some(p => p.darija.toLowerCase() === item.darija.toLowerCase())) {
        result.push(item);
      }
    }
    return result;
  }, [lang]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allPhrases.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['__all__', ...Array.from(set)];
  }, [allPhrases]);

  const filteredPhrases = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allPhrases.filter((p) => {
      const matchCat = category === '__all__' || p.category === category;
      const matchFav = !favoritesOnly || favorites.includes(p.id);
      const matchSearch = !q || `${p.darija} ${p.arabic || ''} ${p.meaning}`.toLowerCase().includes(q);
      return matchCat && matchFav && matchSearch;
    });
  }, [allPhrases, search, category, favoritesOnly, favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('kenza_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const playPhrase = (darija: string, arabic?: string, phraseId?: string) => {
    if (phraseId) {
      const audio = new Audio(`/audio/phrases/${phraseId}.mp3`);
      audio.play().catch(() => {
        // Fallback direct vers streaming tts
        const text = arabic?.trim() || darija?.trim();
        if (text) {
          const fallback = new Audio(`/api/tts?text=${encodeURIComponent(text)}&speed=normal&gender=male`);
          fallback.play().catch(console.error);
        }
      });
      showToast(trL(lang, "Prononciation audio de la phrase.", "Natural voice pronunciation of the phrase.", "Pronunciación de voz natural de la frase.", "نطق صوتي طبيعي للعبارة."));
      return;
    }

    const text = arabic?.trim() || darija?.trim();
    if (text) {
      const fallback = new Audio(`/api/tts?text=${encodeURIComponent(text)}&speed=normal&gender=male`);
      fallback.play().catch(console.error);
      showToast(trL(lang, "Prononciation audio de la phrase.", "Natural voice pronunciation of the phrase.", "Pronunciación de voz natural de la frase.", "نطق صوتي طبيعي للعبارة."));
    }
  };

  const copyPhrase = async (phrase: PhraseItem) => {
    try {
      const text = `${phrase.darija} ${phrase.arabic ? `(${phrase.arabic})` : ''} — ${phrase.meaning}`.trim();
      await navigator.clipboard.writeText(text);
      showToast(trL(lang, "Phrase copiée dans le presse-papiers.", "Phrase copied to clipboard.", "Frase copiada al portapapeles.", "تم نسخ العبارة إلى الحافظة."));
    } catch {
      showToast(trL(lang, "Copie indisponible.", "Copy unavailable.", "Copia no disponible.", "النسخ غير متاح."));
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#142943] pb-24">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#142943] text-white px-4 py-2.5 rounded-xl shadow-lg text-sm animate-fade-in">
          {toastMessage}
        </div>
      )}

      <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E2D9] px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#142943] hover:text-[#D69B47] transition-colors"
          >
            <ArrowLeft size={18} />
            <span>{trL(lang, "Retour à l'accueil", "Back to home", "Volver al inicio", "العودة للرئيسية")}</span>
          </Link>
          <h1 className="text-base font-serif font-bold text-[#142943] tracking-wide">
            {trL(lang, "Carnet de Phrases", "Phrasebook", "Cuaderno de Frases", "دفتر العبارات")}
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <section className="phrase-toolbar mb-6">
          <label className="phrase-search">
            <Search size={17} />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={trL(lang, "Chercher une expression…", "Search a phrase…", "Buscar una frase…", "ابحث عن عبارة…")}
              aria-label={trL(lang, "Chercher une expression", "Search a phrase", "Buscar una frase", "ابحث عن عبارة")}
            />
          </label>
          <button
            className={`favorites-filter ${favoritesOnly ? "filter-active" : ""}`}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} /> {trL(lang, "Mes favoris", "My favorites", "Mis favoritos", "مفضلاتي")}{" "}
            <span>{favorites.length}</span>
          </button>
        </section>

        <div className="category-tabs mb-6" role="tablist">
          {categories.map((item) => (
            <button
              role="tab"
              aria-selected={category === item}
              key={item}
              className={category === item ? "category-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item === "__all__" ? trL(lang, "Tout voir", "See all", "Ver todo", "عرض الكل") : item}
            </button>
          ))}
        </div>

        <div className="phrase-section-top mb-4">
          <div>
            <span className="mini-kicker">{trL(lang, "À PORTÉE DE MAIN", "AT HAND", "A MANO", "في متناول اليد")}</span>
            <h2 className="text-xl font-bold font-serif">
              {favoritesOnly
                ? trL(lang, "Tes phrases favorites", "Your favorite phrases", "Tus frases favoritas", "عباراتك المفضلة")
                : (category === "__all__")
                ? trL(lang, "Les expressions du quotidien", "Everyday expressions", "Expresiones cotidianas", "التعابير اليومية")
                : category}
            </h2>
          </div>
          <span className="phrase-count">
            {filteredPhrases.length} {trL(lang, "expression", "expression", "expresión", "عبارة")}{filteredPhrases.length === 1 ? "" : trL(lang, "s", "s", "s", "")}
          </span>
        </div>

        {filteredPhrases.length > 0 ? (
          <div className="phrase-grid">
            {filteredPhrases.map((phrase, index) => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                index={index}
                isFavorite={favorites.includes(phrase.id)}
                onFavorite={toggleFavorite}
                onPlay={playPhrase}
                onCopy={copyPhrase}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-symbol">
              <Search size={22} />
            </span>
            <h3>{trL(lang, "Aucune phrase trouvée", "No phrase found", "Ninguna frase encontrada", "لا توجد عبارات")}</h3>
            <p>{trL(lang, "Essaie un autre mot ou change de catégorie.", "Try another word or category.", "Prueba otra palabra o categoría.", "جرّب كلمة أو فئة أخرى.")}</p>
            <button
              className="plain-link"
              onClick={() => {
                setSearch("");
                setCategory("__all__");
                setFavoritesOnly(false);
              }}
            >
              {trL(lang, "Effacer les filtres", "Clear filters", "Borrar filtros", "مسح المرشحات")} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

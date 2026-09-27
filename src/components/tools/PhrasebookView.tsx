'use client';

import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, Coffee, Car, ShoppingBag, Heart, Home, Stethoscope, Copy, Check, Sparkles } from 'lucide-react';
import { srsVocabulary, SRSDictionaryItem } from '../../data/srs-deck';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { playAudio } from '../../lib/audio';
import { getVariantForWord } from '../../data/regionalVariants';
import AudioWalkModal from '../audio/AudioWalkModal';
import { AudioWalkItem } from '../../hooks/useAudioWalkPlayer';

type CategoryType = SRSDictionaryItem['category'] | 'all';

export default function PhrasebookView() {
  const { lang, t } = useTranslation();
  const { soundEnabled, regionalVariant } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [activeTab, setActiveTab] = useState<'dictionary' | 'grammar'>('dictionary');
  const [isAudioWalkOpen, setIsAudioWalkOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kenza_favorites');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleFavorite = (wordId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('kenza_favorites', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleCopy = (wordId: string, text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(wordId);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const categories: { id: CategoryType; label: string; icon: React.FC<any> }[] = [
    { id: 'all', label: 'Toutes les expressions', icon: BookOpen },
    { id: 'polite_social', label: 'Politesse & Salutations', icon: Heart },
    { id: 'cafe_resto', label: 'Café & Restaurant', icon: Coffee },
    { id: 'taxi_transport', label: 'Transports & Direction', icon: Car },
    { id: 'souk_shopping', label: 'Souk & Négociation', icon: ShoppingBag },
    { id: 'housing_riad', label: 'Riad & Hébergement', icon: Home },
    { id: 'urgencies_health', label: 'Santé & Urgences', icon: Stethoscope },
  ];

  const getCategoryLabel = (catId?: string) => {
    switch (catId) {
      case 'polite_social': return 'Politesse';
      case 'cafe_resto': return 'Café & Resto';
      case 'taxi_transport': return 'Transport';
      case 'souk_shopping': return 'Souk';
      case 'housing_riad': return 'Logement';
      case 'urgencies_health': return 'Santé';
      default: return 'Vocabulaire';
    }
  };

  const filteredWords = useMemo(() => {
    return srsVocabulary.filter((word) => {
      const matchesCategory = activeCategory === 'all' || word.category === activeCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        word.arabizi.toLowerCase().includes(term) ||
        word.arabic.includes(term) ||
        (typeof word.translation === 'string'
          ? (word.translation as string).toLowerCase().includes(term)
          : Object.values(word.translation).some((tr) => (tr as string).toLowerCase().includes(term)));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const audioWalkItems: AudioWalkItem[] = useMemo(() => {
    return filteredWords.map((word) => {
      const variant = getVariantForWord(word.arabizi, regionalVariant);
      const displayArabizi = variant ? variant.variant : word.arabizi;
      const displayArabic = variant ? variant.variantArabic : word.arabic;
      const tMap: any = (word as any).translations || (word as any).translation || { fr: '' };
      const translated = typeof tMap === 'string' ? tMap : tMap[lang] || tMap.fr;
      return {
        id: word.id,
        phraseSource: translated,
        phraseDarijaArabizi: displayArabizi,
        phraseDarijaArabe: displayArabic,
      };
    });
  }, [filteredWords, regionalVariant, lang]);

  const renderDictionary = () => (
    <div className="space-y-6">
      
      {/* Search Bar & Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7670] w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une expression (ex: chokran, café, salam)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FDFCF8] border border-[#E8E2D5] rounded-full py-3.5 pl-12 pr-4 font-sans text-sm text-[#1B2A4A] placeholder:text-[#7A7670]/60 focus:outline-none focus:border-[#C9A05C] focus:ring-2 focus:ring-[#C9A05C]/20 transition-all shadow-xs"
          />
        </div>
        <button
          onClick={() => setIsAudioWalkOpen(true)}
          className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-[#FDFCF8] rounded-full px-5 py-3.5 flex items-center justify-center gap-2 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-95 shrink-0"
        >
          <Volume2 className="w-4 h-4 text-[#C9A05C]" />
          <span>Mode Mains-Libres</span>
        </button>
      </div>

      {/* Categories Horizontal Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
                  : 'bg-[#FDFCF8] text-[#7A7670] border border-[#E8E2D5] hover:text-[#1B2A4A] hover:bg-[#F7F3EA]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#7A7670] px-1">
        <span>{filteredWords.length} expression{filteredWords.length > 1 ? 's' : ''} répertoriée{filteredWords.length > 1 ? 's' : ''}</span>
        {regionalVariant !== 'casablanca' && (
          <span className="text-[#C9A05C] font-semibold">Variante active : {regionalVariant === 'chamal' ? 'Chamal (Nord)' : 'Fès (Traditionnel)'}</span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => {
            const variant = getVariantForWord(word.arabizi, regionalVariant);
            const displayArabizi = variant ? variant.variant : word.arabizi;
            const displayArabic = variant ? variant.variantArabic : word.arabic;

            const tMap: any = (word as any).translations || (word as any).translation || { fr: '' };
            const translated = typeof tMap === 'string' ? tMap : tMap[lang] || tMap.fr;
            const isFav = favorites.includes(word.id);
            const isCopied = copiedId === word.id;

            return (
              <div
                key={word.id}
                className="bg-[#FDFCF8] rounded-3xl p-6 shadow-xs border border-[#E8E2D5] flex flex-col justify-between hover:border-[#C9A05C]/50 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  {/* Kicker supérieur : Petit tiret horizontal "—" suivi du label en capitales dorées */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
                      <span>—</span>
                      <span>{getCategoryLabel(word.category)}</span>
                    </div>

                    {variant && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#C9A05C]/15 text-[#C9A05C] border border-[#C9A05C]/30">
                        {regionalVariant === 'chamal' ? '🌊 Nord' : '🏺 Fès'}
                      </span>
                    )}
                  </div>

                  {/* Expression principale en serif marine + traduction en gras en dessous + écriture arabe alignée à droite */}
                  <div className="flex items-start justify-between gap-4 mt-2">
                    <div className="space-y-1">
                      {/* Expression principale en serif marine */}
                      <h3 className="font-serif text-2xl font-bold text-[#1B2A4A] tracking-tight group-hover:text-[#1B2A4A] transition-colors">
                        {displayArabizi}
                      </h3>
                      {/* Traduction en gras en dessous */}
                      <p className="font-bold text-sm text-[#1B2A4A]/80 leading-snug">
                        {translated}
                      </p>
                    </div>

                    {/* Écriture arabe alignée à droite */}
                    <div className="text-right shrink-0">
                      <span className="font-arabic text-2xl font-bold text-[#1B2A4A] block leading-tight">
                        {displayArabic}
                      </span>
                    </div>
                  </div>

                  {/* Contexte optionnel */}
                  {((word as any).exampleSentence || word.example) && (
                    <div className="mt-3 pt-3 border-t border-[#E8E2D5]/50">
                      <p className="text-xs text-[#7A7670] italic font-serif">
                        Ex : « {((word as any).exampleSentence || word.example).arabizi} »
                      </p>
                    </div>
                  )}
                </div>

                {/* Boutons d'action minimalistes en bas : "Écouter" (icône son), "Copier", et icône cœur pour les favoris */}
                <div className="mt-5 pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Écouter */}
                    <button
                      onClick={() => playAudio(displayArabizi, displayArabic, soundEnabled)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F3EA] hover:bg-[#E8E2D5]/70 text-[#1B2A4A] text-xs font-semibold border border-[#E8E2D5] transition-colors"
                      title="Écouter la prononciation"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C9A05C]" />
                      <span>Écouter</span>
                    </button>

                    {/* Copier */}
                    <button
                      onClick={() => handleCopy(word.id, `${displayArabizi} (${displayArabic}) - ${translated}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F3EA] hover:bg-[#E8E2D5]/70 text-[#7A7670] hover:text-[#1B2A4A] text-xs font-semibold border border-[#E8E2D5] transition-colors"
                      title="Copier l'expression"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#7A9174]" />
                          <span className="text-[#7A9174]">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Favoris */}
                  <button
                    onClick={() => toggleFavorite(word.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isFav 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-[#7A7670] hover:text-red-500 hover:bg-[#F7F3EA]'
                    }`}
                    title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 bg-[#FDFCF8] rounded-3xl border border-[#E8E2D5] p-8">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#C9A05C]/40" />
            <h3 className="font-serif text-lg text-[#1B2A4A] font-bold">Aucune expression trouvée</h3>
            <p className="text-xs text-[#7A7670] mt-1">Essayez un autre mot-clé ou sélectionnez une catégorie différente.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderGrammar = () => (
    <div className="space-y-6">
      
      {/* Fiche 1 : Le Présent */}
      <div className="bg-[#1B2A4A] rounded-3xl p-6 sm:p-8 text-[#FDFCF8] shadow-md border border-[#1B2A4A] relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
            <span>—</span>
            <span>Règle fondamentale</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FDFCF8]">
            Le Présent (Préfixe ka-)
          </h3>
          <p className="text-sm text-[#E8E2D5]/80 leading-relaxed max-w-xl">
            En Darija, on ajoute le préfixe <strong className="text-[#C9A05C]">ka-</strong> (ou <em>ta-</em> selon les régions) au verbe conjugué pour marquer une action habituelle ou en cours.
          </p>
          <div className="bg-[#FDFCF8]/10 rounded-2xl p-4 font-mono text-xs sm:text-sm space-y-2 border border-white/10">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-[#E8E2D5]">Je bois</span>
              <span className="font-bold text-[#FDFCF8]">Ka-n-chreb</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-[#E8E2D5]">Tu bois</span>
              <span className="font-bold text-[#FDFCF8]">Ka-t-chreb</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#E8E2D5]">Il boit</span>
              <span className="font-bold text-[#FDFCF8]">Ka-y-chreb</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fiche 2 : La Négation */}
      <div className="bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 text-[#1B2A4A] shadow-xs border border-[#E8E2D5] space-y-4">
        <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
          <span>—</span>
          <span>Syntaxe</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
          La Négation (ma-...-ch)
        </h3>
        <p className="text-sm text-[#7A7670] leading-relaxed max-w-xl">
          Pour former une phrase négative, encadrez le verbe conjugué avec <strong className="text-[#1B2A4A]">ma-</strong> au début et <strong className="text-[#1B2A4A]">-ch</strong> à la fin.
        </p>
        <div className="bg-[#F7F3EA] rounded-2xl p-4 font-mono text-xs sm:text-sm space-y-2 border border-[#E8E2D5]">
          <div className="flex justify-between border-b border-[#E8E2D5] pb-2">
            <span className="text-[#7A7670]">Je ne sais pas</span>
            <span className="font-bold text-[#1B2A4A]">Ma-n-3ref-ch</span>
          </div>
          <div className="flex justify-between border-b border-[#E8E2D5] pb-2">
            <span className="text-[#7A7670]">Je ne veux pas</span>
            <span className="font-bold text-[#1B2A4A]">Ma-bghit-ch</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A7670]">Ce n'est pas bon</span>
            <span className="font-bold text-[#1B2A4A]">Ma-zwin-ch</span>
          </div>
        </div>
      </div>

      {/* Fiche 3 : Le Futur */}
      <div className="bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 text-[#1B2A4A] shadow-xs border border-[#E8E2D5] space-y-4">
        <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase">
          <span>—</span>
          <span>Conjugaison</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B2A4A]">
          Le Futur (Ghadi)
        </h3>
        <p className="text-sm text-[#7A7670] leading-relaxed max-w-xl">
          Utilisez le marqueur <strong className="text-[#1B2A4A]">ghadi</strong> (ou <em>gha-</em>) suivi directement du verbe conjugué au présent, <strong>sans</strong> le préfixe ka-.
        </p>
        <div className="bg-[#F7F3EA] rounded-2xl p-4 font-mono text-xs sm:text-sm space-y-2 border border-[#E8E2D5]">
          <div className="flex justify-between border-b border-[#E8E2D5] pb-2">
            <span className="text-[#7A7670]">Je vais partir</span>
            <span className="font-bold text-[#1B2A4A]">Ghadi n-mchi</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A7670]">Nous allons voir</span>
            <span className="font-bold text-[#1B2A4A]">Ghadi n-choufo</span>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 pb-28">
      
      {/* Header section with Editorial Serif title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase">
          <span>—</span>
          <span>Dictionnaire & Expressions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1B2A4A] font-normal">
          Le répertoire de la Darija
        </h1>
        <p className="text-sm text-[#7A7670] max-w-xl">
          Explorez le vocabulaire usuel, les expressions du quotidien et les fiches grammaticales indispensables.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-[#FDFCF8] p-1.5 rounded-full border border-[#E8E2D5] max-w-md shadow-xs">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
            activeTab === 'dictionary'
              ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
              : 'text-[#7A7670] hover:text-[#1B2A4A]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Dictionnaire</span>
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 ${
            activeTab === 'grammar'
              ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
              : 'text-[#7A7670] hover:text-[#1B2A4A]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fiches Grammaire</span>
        </button>
      </div>

      {activeTab === 'dictionary' ? renderDictionary() : renderGrammar()}

      <AudioWalkModal
        isOpen={isAudioWalkOpen}
        onClose={() => setIsAudioWalkOpen(false)}
        items={audioWalkItems}
        moduleName="Lexique Global"
      />
    </div>
  );
}

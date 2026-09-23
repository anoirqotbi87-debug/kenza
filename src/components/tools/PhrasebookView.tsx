import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, Coffee, Car, ShoppingBag, Heart, Home, Stethoscope } from 'lucide-react';
import { srsVocabulary, SRSDictionaryItem } from '../../data/srs-deck';
import { useTranslation } from '../../store/useAppStore';

type CategoryType = SRSDictionaryItem['category'] | 'all';

export default function PhrasebookView() {
  const { lang } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [activeTab, setActiveTab] = useState<'dictionary' | 'grammar'>('dictionary');

  const categories: { id: CategoryType; label: string; icon: React.FC<any> }[] = [
    { id: 'all', label: 'Tout', icon: BookOpen },
    { id: 'polite_social', label: 'Politesse', icon: Heart },
    { id: 'cafe_resto', label: 'Café & Resto', icon: Coffee },
    { id: 'taxi_transport', label: 'Transport', icon: Car },
    { id: 'souk_shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'housing_riad', label: 'Logement', icon: Home },
    { id: 'urgencies_health', label: 'Santé', icon: Stethoscope },
  ];

  const filteredWords = useMemo(() => {
    return srsVocabulary.filter(word => {
      const matchesCategory = activeCategory === 'all' || word.category === activeCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        word.arabizi.toLowerCase().includes(term) ||
        word.arabic.includes(term) ||
        (typeof word.translation === 'string' 
          ? word.translation.toLowerCase().includes(term)
          : Object.values(word.translation).some(t => (t as string).toLowerCase().includes(term)));
      
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; // Fallback to MSA if Moroccan not available
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const renderDictionary = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un mot (ex: café, chokran)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-700 focus:outline-none focus:border-blue-400 transition-colors shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.length > 0 ? (
          filteredWords.map(word => (
            <div key={word.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-baseline gap-2">
                  {word.arabizi}
                  <span className="text-sm font-arabic text-slate-400 font-normal">{word.arabic}</span>
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  {typeof word.translation === 'string' ? word.translation : (word.translation as any)[lang] || word.translation.fr}
                </p>
                {word.example && (
                  <p className="text-slate-400 text-xs mt-2 italic">
                    Ex: "{word.example.arabizi}"
                  </p>
                )}
              </div>
              <button 
                onClick={() => playAudio(word.arabic)}
                className="w-10 h-10 rounded-full bg-slate-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucun mot ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderGrammar = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span className="bg-white/20 p-2 rounded-xl">🔄</span>
          Le Présent (Préfixe ka-)
        </h3>
        <p className="text-blue-100 mb-4 text-sm leading-relaxed">
          En Darija, on ajoute le préfixe <strong>ka-</strong> (ou ta-) au verbe pour exprimer une action présente ou habituelle.
        </p>
        <div className="bg-white/10 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Je bois</span> <span>Ka-n-chreb</span></div>
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Tu bois</span> <span>Ka-t-chreb</span></div>
          <div className="flex justify-between"><span>Il boit</span> <span>Ka-y-chreb</span></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span className="bg-white/20 p-2 rounded-xl">🛑</span>
          La Négation (ma-...-ch)
        </h3>
        <p className="text-rose-100 mb-4 text-sm leading-relaxed">
          Pour dire "ne pas", on encadre le verbe conjugué avec <strong>ma</strong> au début et <strong>ch</strong> à la fin.
        </p>
        <div className="bg-white/10 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Je ne sais pas</span> <span>Ma-n-3ref-ch</span></div>
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Je ne veux pas</span> <span>Ma-bghit-ch</span></div>
          <div className="flex justify-between"><span>Ce n'est pas bon</span> <span>Ma-zwin-ch</span></div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span className="bg-white/20 p-2 rounded-xl">🔮</span>
          Le Futur (Ghadi)
        </h3>
        <p className="text-amber-100 mb-4 text-sm leading-relaxed">
          Utilisez le mot <strong>ghadi</strong> suivi du verbe conjugué au présent (SANS le préfixe ka-).
        </p>
        <div className="bg-white/10 rounded-xl p-4 font-mono text-sm space-y-2">
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Je vais partir</span> <span>Ghadi n-mchi</span></div>
          <div className="flex justify-between"><span>Nous allons voir</span> <span>Ghadi n-choufo</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      {/* Tabs */}
      <div className="flex bg-slate-200 p-1 rounded-xl mb-8">
        <button 
          onClick={() => setActiveTab('dictionary')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'dictionary' ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen className="w-4 h-4" />
          Dictionnaire
        </button>
        <button 
          onClick={() => setActiveTab('grammar')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'grammar' ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen className="w-4 h-4" />
          Fiches Grammaire
        </button>
      </div>

      {activeTab === 'dictionary' ? renderDictionary() : renderGrammar()}
    </div>
  );
}

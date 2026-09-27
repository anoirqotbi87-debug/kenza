'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getWordFromDictionary } from '../../data/srs-deck';
import { getLocalizedText } from '../../lib/i18n/utils';
import { Search, Plus, BookOpen, BrainCircuit, CheckCircle, Trash2, Edit2, Play, Mic, MessageCircle, Book } from 'lucide-react';
import { playAudio } from '../../lib/audio';
import CustomCardEditor from './CustomCardEditor';

export default function DeckManagerView() {
  const { srsDeck, customVocabulary, deleteCustomWord, uiLanguage } = useAppStore();
  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'learning' | 'mastered'>('all');
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<any | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Combine and format deck cards with their vocabulary data
  const processedCards = useMemo(() => {
    const now = new Date();
    
    return Object.values(srsDeck).map(card => {
      const dictWord = getWordFromDictionary(card.wordId) || customVocabulary?.[card.wordId];
      const translation = dictWord ? getLocalizedText(dictWord.translation, lang) : card.wordId;
      const arabizi = dictWord?.arabizi || '';
      const arabic = dictWord?.arabic || '';
      
      // Determine source
      let source: 'roleplay' | 'module' | 'manual' = 'module';
      if (customVocabulary?.[card.wordId]) {
        source = customVocabulary[card.wordId].source || 'roleplay';
      }

      const isDue = new Date(card.dueDate) <= now;
      const isMastered = card.interval >= 3; // Basic definition of mastered in this context
      
      // Determine status for filtering
      let filterStatus = 'learning';
      if (isDue) filterStatus = 'due';
      if (isMastered) filterStatus = 'mastered';

      return {
        ...card,
        dictWord,
        translation,
        arabizi,
        arabic,
        source,
        isDue,
        isMastered,
        filterStatus
      };
    });
  }, [srsDeck, customVocabulary, lang]);

  // Filter and search
  const filteredCards = useMemo(() => {
    return processedCards.filter(card => {
      // 1. Apply category filter
      if (activeFilter === 'due' && !card.isDue) return false;
      if (activeFilter === 'learning' && card.isMastered) return false;
      if (activeFilter === 'mastered' && !card.isMastered) return false;
      
      // 2. Apply search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesFront = card.arabizi.toLowerCase().includes(query) || card.arabic.includes(query);
        const matchesBack = card.translation.toLowerCase().includes(query);
        return matchesFront || matchesBack;
      }
      
      return true;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [processedCards, activeFilter, searchQuery]);

  const handleDelete = (wordId: string) => {
    if (confirm(isAr ? 'هل أنت متأكد أنك تريد حذف هذه البطاقة؟' : 'Voulez-vous vraiment supprimer cette carte ?')) {
      deleteCustomWord(wordId);
    }
  };

  const handlePlayTTS = async (card: any) => {
    if (playingId) return;
    
    // Check if offline and attempt to verify if cached (we'll just try to play it, but we can pre-warn if needed)
    // For now we just let fetch fail gracefully if not cached.
    
    try {
      setPlayingId(card.id);
      // Priority: 1. dictWord.audioUrl (for official modules), 2. Arabic, 3. Arabizi
      if (card.dictWord?.audioUrl) {
        await playAudio('', card.dictWord.audioUrl);
      } else {
        const textToSpeak = card.arabic || card.arabizi;
        await playAudio(card.arabizi, card.arabic); // playAudio handles (text, arabicText as audioUrl if not ending with .mp3)
      }
    } catch (e) {
      console.error("Failed to play TTS:", e);
    } finally {
      setPlayingId(null);
    }
  };

  const SourceIcon = ({ source }: { source: string }) => {
    switch (source) {
      case 'roleplay': return <MessageCircle className="w-3 h-3" />;
      case 'manual': return <Plus className="w-3 h-3" />;
      default: return <Book className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'roleplay': return isAr ? 'محادثة' : 'Roleplay';
      case 'manual': return isAr ? 'يدوي' : 'Manuel';
      default: return isAr ? 'المنهج' : 'Module';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Search */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {isAr ? 'مدير البطاقات' : 'Gestionnaire de Decks'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {processedCards.length} {isAr ? 'بطاقة في مجموعتك' : 'cartes dans votre collection'}
              </p>
            </div>
            <button 
              onClick={() => {
                setCardToEdit(null);
                setIsEditorOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {isAr ? 'كلمة جديدة' : 'Nouveau mot'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={isAr ? 'ابحث عن كلمة...' : 'Rechercher un mot, une traduction...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-2 gap-2 hide-scrollbar">
          {[
            { id: 'all', label: isAr ? 'الكل' : 'Tous', icon: BookOpen },
            { id: 'due', label: isAr ? 'للمراجعة اليوم' : 'À réviser', icon: Clock },
            { id: 'learning', label: isAr ? 'في طور التعلم' : 'En apprentissage', icon: BrainCircuit },
            { id: 'mastered', label: isAr ? 'مكتسب' : 'Acquis', icon: CheckCircle }
          ].map(filter => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map(card => (
              <div key={card.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
                
                {/* Source Badge */}
                <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1
                  ${card.source === 'roleplay' ? 'bg-purple-100 text-purple-700' : 
                    card.source === 'manual' ? 'bg-emerald-100 text-emerald-700' : 
                    'bg-slate-100 text-slate-600'}
                `}>
                  <SourceIcon source={card.source} />
                  {getSourceLabel(card.source)}
                </div>

                {/* Vocabulary Content */}
                <div className="flex-1 mt-2">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{card.arabizi}</h3>
                  {card.arabic && <p className="text-lg text-slate-600 font-arabic mb-2" dir="rtl">{card.arabic}</p>}
                  <p className="text-sm text-slate-500 font-medium">{card.translation}</p>
                </div>

                {/* Footer Stats & Actions */}
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full ${card.isMastered ? 'bg-emerald-400' : card.isDue ? 'bg-amber-400' : 'bg-blue-400'}`} title="Status"></div>
                    <span className="text-xs text-slate-400 font-medium">Niv. {card.interval}</span>
                  </div>
                  
                  {/* Actions - visible on hover/focus */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handlePlayTTS(card)}
                      disabled={playingId === card.id || (isOffline && !card.dictWord?.audioUrl)} // In a real app we'd check if TTS is specifically cached, but for now we disable if offline and no static audioUrl
                      className={`p-1.5 rounded-lg transition-colors ${
                        playingId === card.id 
                          ? 'text-blue-600 bg-blue-50 animate-pulse' 
                          : isOffline && !card.dictWord?.audioUrl
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      title={isOffline && !card.dictWord?.audioUrl ? (isAr ? 'الصوت غير متوفر بدون إنترنت' : 'Audio non disponible hors-ligne') : ''}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setCardToEdit(card.dictWord || { 
                          id: card.wordId, 
                          arabizi: card.arabizi, 
                          arabic: card.arabic, 
                          translation: card.translation,
                          source: card.source
                        });
                        setIsEditorOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {/* Only allow deleting custom vocabulary */}
                    {customVocabulary?.[card.wordId] && (
                      <button 
                        onClick={() => handleDelete(card.wordId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm mt-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              {isAr ? 'لم يتم العثور على أي بطاقة' : 'Aucune carte trouvée'}
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
              {isAr 
                ? 'جرب البحث بكلمة أخرى أو قم بتغيير الفلاتر.' 
                : 'Essayez un autre mot-clé ou modifiez vos filtres de recherche.'}
            </p>
          </div>
        )}

      </div>
      
      <CustomCardEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        cardToEdit={cardToEdit} 
      />
    </div>
  );
}

// Minimal stub for Clock since it wasn't imported from lucide-react in my top imports
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

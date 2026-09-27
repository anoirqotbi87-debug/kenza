'use client';

import React from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { srsService } from '../../services/srsService';
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DailyReviewCardProps {
  onStartReview: () => void;
}

export default function DailyReviewCard({ onStartReview }: DailyReviewCardProps) {
  const srsDeck = useAppStore((state) => state.srsDeck);
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  
  const dueCards = srsService.getDueCards(srsDeck);
  const count = dueCards.length;
  
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const titleText = isAr ? 'المراجعة اليومية' : lang === 'en' ? 'Daily Review' : 'Répétition Espacée';
  
  if (count === 0) {
    const allCaughtUpTitle = isAr ? 'كل شيء محدّث!' : lang === 'en' ? 'All caught up!' : 'Mémoire à jour !';
    const allCaughtUpDesc = isAr ? 'لا توجد مراجعات اليوم.' : lang === 'en' ? 'No reviews due today.' : 'Aucune expression en attente pour le moment.';
    
    return (
      <div 
        className="bg-[#FDFCF8] border border-[#E8E2D5] rounded-3xl p-6 flex items-center justify-between shadow-xs" 
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#7A9174]/15 border border-[#7A9174]/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#7A9174]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">{allCaughtUpTitle}</h3>
            <p className="text-xs text-[#7A7670] mt-0.5">{allCaughtUpDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  const reviewToday = isAr ? 'للمراجعة اليوم' : lang === 'en' ? 'to review today' : 'à consolider aujourd\'hui';
  const wordCountStr = isAr ? `${count} كلمات` : lang === 'en' ? `${count} words` : `${count} expressions`;

  return (
    <div 
      onClick={onStartReview}
      className="bg-[#1B2A4A] text-[#FDFCF8] rounded-3xl p-6 sm:p-7 flex items-center justify-between shadow-md border border-[#1B2A4A] cursor-pointer hover:border-[#C9A05C]/50 transition-all duration-200 group relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Subtle overlay accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A05C]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-13 h-13 rounded-2xl bg-[#C9A05C]/20 border border-[#C9A05C]/40 flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-[#C9A05C]" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-[#C9A05C] text-[11px] font-bold tracking-[0.2em] uppercase mb-1">
            <span>—</span>
            <span>Rappel quotidien</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#FDFCF8]">{titleText}</h3>
          <p className="text-xs text-[#E8E2D5]/80 flex items-center gap-2 mt-1">
            <span className="bg-[#C9A05C] text-[#1B2A4A] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              {wordCountStr}
            </span> 
            <span>{reviewToday}</span>
          </p>
        </div>
      </div>

      <div className={`w-11 h-11 rounded-full bg-[#C9A05C] text-[#1B2A4A] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0 relative z-10 ${isAr ? 'mr-auto' : 'ml-4'}`}>
        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
      </div>
    </div>
  );
}

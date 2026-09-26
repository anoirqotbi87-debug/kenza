import React from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { srsService } from '../../services/srsService';
import { BookOpen, Play } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

interface DailyReviewCardProps {
  onStartReview: () => void;
}

export default function DailyReviewCard({ onStartReview }: DailyReviewCardProps) {
  const srsDeck = useAppStore((state) => state.srsDeck);
  const lang = useAppStore((state) => state.uiLanguage);
  const dueCards = srsService.getDueCards(srsDeck);
  const count = dueCards.length;
  
  const isAr = lang === 'ar';
  
  const titleText = isAr ? 'المراجعة اليومية' : lang === 'en' ? 'Spaced Repetition' : 'Répétition Espacée';
  
  if (count === 0) {
    const allCaughtUpTitle = isAr ? 'كل شيء محدّث!' : lang === 'en' ? 'All caught up!' : 'Tout est à jour !';
    const allCaughtUpDesc = isAr ? 'لا توجد مراجعات اليوم.' : lang === 'en' ? 'No reviews due today.' : 'Aucune révision requise aujourd\'hui.';
    
    return (
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-between shadow-sm opacity-80" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{allCaughtUpTitle}</h3>
            <p className="text-sm text-slate-500">{allCaughtUpDesc}</p>
          </div>
        </div>
      </div>
    );
  }

  const reviewToday = isAr ? 'للمراجعة اليوم' : lang === 'en' ? 'to review today' : 'à réviser aujourd\'hui';
  const wordCountStr = isAr ? `${count} كلمات` : lang === 'en' ? `${count} words` : `${count} mots`;

  return (
    <div 
      onClick={onStartReview}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 flex items-center justify-between shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform text-white group"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-black text-xl mb-1">{titleText}</h3>
          <p className="font-medium text-indigo-100 flex items-center gap-2">
            <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {wordCountStr}
            </span> 
            {reviewToday}
          </p>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-indigo-600 flex items-center justify-center transition-colors shrink-0 ${isAr ? 'mr-auto' : ''}`}>
        <Play className={`w-5 h-5 ${isAr ? 'mr-1' : 'ml-1'}`} fill="currentColor" />
      </div>
    </div>
  );
}

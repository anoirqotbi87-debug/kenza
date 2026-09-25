import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { srsService } from '../../services/srsService';
import { BookOpen, Play } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Or call a prop

interface DailyReviewCardProps {
  onStartReview: () => void;
}

export default function DailyReviewCard({ onStartReview }: DailyReviewCardProps) {
  const { srsDeck } = useAppStore();
  const dueCards = srsService.getDueCards(srsDeck);
  const count = dueCards.length;

  if (count === 0) {
    return (
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-between shadow-sm opacity-80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Tout est à jour !</h3>
            <p className="text-sm text-slate-500">Aucune révision requise aujourd'hui.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onStartReview}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 flex items-center justify-between shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform text-white group"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-black text-xl mb-1">Répétition Espacée</h3>
          <p className="font-medium text-indigo-100 flex items-center gap-2">
            <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {count} mots
            </span> 
            à réviser aujourd'hui
          </p>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-indigo-600 flex items-center justify-center transition-colors shrink-0">
        <Play className="w-5 h-5 ml-1" fill="currentColor" />
      </div>
    </div>
  );
}

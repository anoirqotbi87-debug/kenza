import React from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { Flame, Snowflake } from 'lucide-react';

export default function StreakHeatmap() {
  const { activityDates, streakDays, streakFreezes } = useAppStore();
  const { t } = useTranslation();

  // Generate last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">
          <Flame className="w-8 h-8 fill-orange-500" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">
            {/* Translations could be added for these specific strings if needed */}
            Série Actuelle
          </div>
          <div className="text-2xl font-black text-slate-800">
            {streakDays} Jours
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {last7Days.map(dateStr => {
          const isActive = activityDates.includes(dateStr);
          const isToday = dateStr === today.toISOString().split('T')[0];
          
          return (
            <div 
              key={dateStr}
              title={dateStr}
              className={`w-8 h-10 rounded-md flex items-center justify-center transition-colors
                ${isActive ? 'bg-orange-500 shadow-sm' : 'bg-slate-100'}
                ${isToday && !isActive ? 'border-2 border-dashed border-slate-300' : ''}
              `}
            >
              {isActive && <div className="w-2 h-2 rounded-full bg-white opacity-80" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold">
        <Snowflake className="w-5 h-5" />
        <span>{streakFreezes} Gel{streakFreezes > 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

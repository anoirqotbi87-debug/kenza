import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Coffee, CarFront, Store, Globe2 } from 'lucide-react';

const availableBadges = [
  { id: 'cafe_master', name: 'Maître du Café', description: 'Terminer la leçon du café', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'taxi_ace', name: 'As du Taxi', description: 'Gérer le petit taxi avec succès', icon: CarFront, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'souk_nego', name: 'Négociateur du Souk', description: 'Maîtriser le marchandage', icon: Store, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'polyglot', name: 'Polyglotte de l\'Atlas', description: 'Gagner 500 XP', icon: Globe2, color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function BadgesList() {
  const { unlockedBadges } = useAppStore();

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        🏆 Vos Trophées
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableBadges.map(badge => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = badge.icon;
          
          return (
            <div 
              key={badge.id}
              className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all ${isUnlocked ? 'border-slate-200 bg-slate-50' : 'border-dashed border-slate-200 opacity-50 grayscale'}`}
              title={badge.description}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${isUnlocked ? badge.bg : 'bg-slate-100'}`}>
                <Icon className={`w-8 h-8 ${isUnlocked ? badge.color : 'text-slate-400'}`} />
              </div>
              <div className="font-bold text-sm text-slate-700">{badge.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

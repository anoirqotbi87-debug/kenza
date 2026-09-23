import React from 'react';
import { Home, BookOpen, Mic, User } from 'lucide-react';
import { useTranslation } from '@/store/useAppStore';

interface NavigationProps {
  currentTab: 'learn' | 'phrasebook' | 'speech' | 'profile';
  onTabChange: (tab: 'learn' | 'phrasebook' | 'speech' | 'profile') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'learn', label: t.nav?.learn || 'Apprendre', icon: Home },
    { id: 'phrasebook', label: t.nav?.phrasebook || 'Lexique', icon: BookOpen },
    { id: 'speech', label: t.nav?.speech || 'Pratique Orale', icon: Mic },
    { id: 'profile', label: t.nav?.profile || 'Profil', icon: User },
  ] as const;

  return (
    <>
      {/* Navigation Desktop (Header) */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Navigation Mobile (Bottom Bar fixe en bas) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

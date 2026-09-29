import React from 'react';
import { Home, Compass, BookOpen, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/store/useAppStore';

export type MainTab = 'home' | 'parcours' | 'phrasebook' | 'review' | 'learn' | 'speech' | 'profile';

interface NavigationProps {
  currentTab: MainTab;
  onTabChange: (tab: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { t } = useTranslation();

  const tabs = [
    { 
      id: 'home', 
      aliases: ['home', 'learn'],
      label: (t as any).nav?.home || 'Accueil', 
      icon: Home 
    },
    { 
      id: 'parcours', 
      aliases: ['parcours'],
      label: (t as any).nav?.parcours || 'Parcours', 
      icon: Compass 
    },
    { 
      id: 'phrasebook', 
      aliases: ['phrasebook'],
      label: (t as any).nav?.phrasebook || 'Phrases', 
      icon: BookOpen 
    },
    { 
      id: 'review', 
      aliases: ['review'],
      label: (t as any).nav?.review || (t as any).modules?.ui?.navReview || 'Review', 
      icon: RotateCcw 
    },
  ] as const;

  return (
    <>
      {/* Navigation Desktop (Header Pill) */}
      <nav className="hidden md:flex items-center gap-1.5 bg-[#FDFCF8] p-1.5 rounded-full border border-[#E8E2D5] shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.aliases.some((a: string) => a === currentTab);
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#E8E2D5]/70 text-[#1B2A4A] font-bold shadow-xs'
                  : 'text-[#7A7670] hover:text-[#1B2A4A] hover:bg-[#E8E2D5]/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Navigation Mobile (Bottom Bar fixe en bas) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FDFCF8]/95 backdrop-blur-md border-t border-[#E8E2D5] px-2 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(27,42,74,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.aliases.some((a: string) => a === currentTab);
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`transition-all duration-200 ${
                isActive
                  ? 'flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#E8E2D5]/70 text-[#1B2A4A] font-bold text-xs shadow-xs'
                  : 'flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-full text-[#7A7670] hover:text-[#1B2A4A]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className={isActive ? 'text-xs' : 'text-[10px] font-medium'}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

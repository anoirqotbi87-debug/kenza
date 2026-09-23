import React from 'react';
import { Home, BookOpen, Mic, User } from 'lucide-react';
import { useTranslation } from '../lib/i18n/TranslationsProvider';

export type AppTab = 'learn' | 'phrasebook' | 'speech' | 'profile';

interface NavigationProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

export default function Navigation({ activeTab, onChange }: NavigationProps) {
  const { t } = useTranslation();

  const navItems: { id: AppTab; label: string; icon: React.FC<any> }[] = [
    { id: 'learn', label: t.dashboard?.trackA || 'Apprendre', icon: Home },
    { id: 'phrasebook', label: 'Lexique', icon: BookOpen },
    { id: 'speech', label: 'Pratique', icon: Mic },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Desktop Header Navigation */}
      <div className="hidden lg:flex w-full bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto w-full px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐪</span>
            <span className="font-bold text-xl text-blue-600">KENZA</span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-semibold text-sm ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce-short' : ''}`} />
                <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}

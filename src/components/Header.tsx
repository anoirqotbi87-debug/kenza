'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import { Flame, Star, Settings, User, LogOut } from 'lucide-react';
import { Notation } from '../types/curriculum';
import AuthModal from './auth/AuthModal';
import LanguageSelector from './ui/LanguageSelector';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Navigation } from './Navigation';

interface HeaderProps {
  currentTab: 'learn' | 'phrasebook' | 'speech' | 'profile';
  onTabChange: (tab: 'learn' | 'phrasebook' | 'speech' | 'profile') => void;
}

export default function Header({ currentTab, onTabChange }: HeaderProps) {
  const { xp, streakDays, preferredNotation, setNotation, toggleSound, soundEnabled, regionalVariant, setRegionalVariant, user } = useAppStore();
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleNotationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotation(e.target.value as Notation);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />
      <header className="flex flex-col xl:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-blue-100 gap-4 max-w-7xl mx-auto mt-6 overflow-visible">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2 w-full xl:w-auto shrink-0">
          <span className="text-3xl">🐪</span> KENZA <span className="text-sm font-medium text-slate-400 font-arabic ml-1 hidden xl:inline">كنزة</span>
        </h1>
        
        <div className="w-full xl:w-auto flex-grow flex justify-center">
          <Navigation currentTab={currentTab} onTabChange={onTabChange} />
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center justify-between w-full xl:w-auto shrink-0">
          {user ? (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold text-sm">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[100px]">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="ml-2 hover:text-red-500 transition-colors" title={t.header?.logout || "Déconnexion"}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full font-bold text-sm transition-colors"
            >
              <User className="w-4 h-4" />
              {t.header?.guestMode || "Invité"}
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 text-amber-500 font-bold">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span>{streakDays}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-500 font-bold">
            <Star className="w-5 h-5 fill-blue-500" />
            <span>{xp}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 border-l pl-2 sm:pl-4 border-slate-200">
            <select 
              value={preferredNotation} 
              onChange={handleNotationChange}
              className="bg-slate-100 text-slate-700 text-xs rounded-lg py-1 px-2 outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-colors"
            >
              <option value="arabizi">{t.header?.arabizi || "Arabizi"}</option>
              <option value="arabic">{t.header?.arabic || "Arabic"}</option>
              <option value="duo">Duo (Bilingue)</option>
            </select>
            <select 
              value={regionalVariant} 
              onChange={(e) => setRegionalVariant(e.target.value as any)}
              className="bg-slate-100 text-slate-700 text-xs rounded-lg py-1 px-2 outline-none cursor-pointer border border-transparent hover:border-slate-300 transition-colors"
              title="Variante Régionale"
            >
              <option value="casablanca">🏙️ Casa/Std</option>
              <option value="chamal">🌊 Chamal</option>
              <option value="fes">🏺 Fès</option>
            </select>
            
            <LanguageSelector />
            <button 
              onClick={toggleSound}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title={soundEnabled ? "Mute" : "Sound"}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

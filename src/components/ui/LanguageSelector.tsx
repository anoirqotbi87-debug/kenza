'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UILanguage } from '../../lib/i18n/translations';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { uiLanguage, setLanguage } = useAppStore();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as UILanguage);
  };

  return (
    <div className="relative inline-flex items-center z-50 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg px-2 py-1.5 border border-transparent hover:border-slate-300">
      <span className="pointer-events-none absolute left-2 flex items-center justify-center">
        <Globe className="w-4 h-4 text-slate-500" />
      </span>
      <select 
        value={uiLanguage} 
        onChange={handleLanguageChange}
        className="bg-transparent font-bold text-slate-700 cursor-pointer text-sm outline-none pl-6 pr-1 w-full h-full"
        style={{ WebkitAppearance: 'none', appearance: 'none' }}
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
}

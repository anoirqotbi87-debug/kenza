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
    <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 transition-colors px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-300">
      <Globe className="w-4 h-4 text-slate-500" />
      <select 
        value={uiLanguage} 
        onChange={handleLanguageChange}
        className="bg-transparent text-slate-700 font-bold text-sm outline-none cursor-pointer"
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
}

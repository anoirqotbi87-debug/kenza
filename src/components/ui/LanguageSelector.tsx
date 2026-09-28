'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UILanguage } from '../../lib/i18n/translations';
import { Globe } from 'lucide-react';

const LANGUAGES: { value: UILanguage; label: string; flag: string }[] = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'ar', label: 'العربية', flag: '🇲🇦' },
];

export default function LanguageSelector() {
  const { uiLanguage, setLanguage } = useAppStore();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as UILanguage);
  };

  return (
    <label
      aria-label="Langue de l'interface"
      className="relative flex items-center bg-slate-100 hover:bg-slate-200 active:bg-slate-200 transition-colors rounded-lg px-2 py-1 border border-transparent hover:border-slate-300 cursor-pointer select-none"
      style={{ touchAction: 'manipulation' }}
    >
      <span className="pointer-events-none flex items-center justify-center mr-1.5">
        <Globe className="w-4 h-4 text-slate-500" />
      </span>
      <select
        aria-label="Langue de l'interface"
        value={uiLanguage}
        onChange={handleLanguageChange}
        className="bg-transparent font-bold text-slate-700 cursor-pointer text-sm outline-none border-0 p-0 m-0 h-8 min-w-[5rem]"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}

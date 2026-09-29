'use client';

import React from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { UILanguage } from '../../lib/i18n/translations';
import { Globe } from 'lucide-react';

const LANGUAGES: { value: UILanguage; label: string; flag: string }[] = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'ar', label: 'العربية', flag: '🇲🇦' },
];

interface LanguageSelectorProps {
  /** Visual style. 'light' for light backgrounds, 'dark' for dark/brand headers. */
  variant?: 'light' | 'dark';
  /** Optional extra class names for the wrapper. */
  className?: string;
  /** Show the globe icon. Defaults to true. */
  showIcon?: boolean;
}

/**
 * Sélecteur de langue universel.
 * Visible sur chaque page et chaque module (objectif d'audit i18n).
 */
export default function LanguageSelector({ variant = 'light', className = '', showIcon = true }: LanguageSelectorProps) {
  const { uiLanguage, setLanguage } = useAppStore();
  const { t } = useTranslation();

  const ariaLabel = (t as any).common?.interfaceLanguage || "Langue de l'interface";

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as UILanguage);
  };

  const wrapperBase =
    'relative flex items-center rounded-lg px-2 py-1 border cursor-pointer select-none transition-colors';
  const wrapperTheme =
    variant === 'dark'
      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
      : 'bg-slate-100 hover:bg-slate-200 border-transparent hover:border-slate-300 text-slate-700';

  const selectTheme = variant === 'dark' ? 'text-white' : 'text-slate-700';

  return (
    <label
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`${wrapperBase} ${wrapperTheme} ${className}`}
      style={{ touchAction: 'manipulation' }}
    >
      {showIcon && (
        <span className="pointer-events-none flex items-center justify-center mr-1.5">
          <Globe className={`w-4 h-4 ${variant === 'dark' ? 'text-white/80' : 'text-slate-500'}`} />
        </span>
      )}
      <select
        aria-label={ariaLabel}
        value={uiLanguage}
        onChange={handleLanguageChange}
        className={`bg-transparent font-bold cursor-pointer text-sm outline-none border-0 p-0 m-0 h-8 min-w-[5rem] ${selectTheme}`}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value} className="text-slate-800">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}

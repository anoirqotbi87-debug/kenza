'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { Menu, Globe, Volume2, VolumeX, ChevronDown, LogOut } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { UILanguage } from '@/lib/i18n/translations';
import { KenzaLogo } from '@/components/ui/KenzaLogo';

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  onOpenMenu?: () => void;
  title?: string;
  children?: React.ReactNode;
}

const LANGUAGES: { code: UILanguage; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
];

/**
 * Header unifié sur UNE SEULE LIGNE (h-14 / 56px, flex-nowrap)
 * Intègre :
 * - KenzaLogo unifié
 * - Sélecteur de langue compact (dropdown popover)
 * - Toggle audio compact
 * - Avatar utilisateur avec popover de déconnexion & profil (au lieu du bouton rouge encombrant)
 */
export function Header({
  user,
  onSignOut,
  onSignIn,
  onOpenMenu,
  title,
  children,
}: HeaderProps) {
  const { uiLanguage, setLanguage, soundEnabled, toggleSound } = useAppStore();
  const { t } = useTranslation();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fermer les menus en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFEFA]/95 backdrop-blur-md border-b border-amber-200/50 h-14 sm:h-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between flex-nowrap gap-2">
        {/* 1. Bloc Gauche : Navigation & Marque Unifiée */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2.5">
          {onOpenMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="p-1.5 sm:p-2 text-[#142943] hover:bg-amber-100/50 rounded-lg shrink-0 transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          )}

          <KenzaLogo size="sm" showWordmark={true} />
        </div>

        {/* 2. Titre optionnel centré si fourni */}
        {title && (
          <div className="min-w-0 flex-1 truncate text-center text-xs sm:text-sm font-semibold text-[#142943] px-2 hidden md:block">
            <span className="truncate">{title}</span>
          </div>
        )}

        {/* 3. Bloc Droit : Contrôles compacts strictly flex-nowrap */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          {children}

          {/* Sélecteur de langue compact (Dropdown popover) */}
          <div ref={langRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setLangMenuOpen((prev) => !prev);
                setProfileMenuOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 text-[#142943] transition-colors shadow-2xs"
              aria-label={t.common.interfaceLanguage || "Changer de langue"}
              aria-expanded={langMenuOpen}
            >
              <Globe size={13} className="text-[#142943]/80" />
              <span>{uiLanguage.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-[#FFFEFA] border border-amber-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      uiLanguage === item.code
                        ? 'bg-amber-100/70 font-bold text-[#142943]'
                        : 'text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.label}</span>
                    </span>
                    {uiLanguage === item.code && <span className="text-[#C9A05C]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton Sound Toggle compact */}
          <button
            type="button"
            onClick={toggleSound}
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
              soundEnabled
                ? 'bg-amber-50/80 border-amber-200/80 text-[#142943] hover:bg-amber-100/80'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Son activé' : 'Son coupé'}
            aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Profil / Avatar avec Popover déporté (pas de bouton déconnexion direct rouge) */}
          {user ? (
            <div ref={profileRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setLangMenuOpen(false);
                }}
                className="w-8 h-8 rounded-full border border-amber-200/80 overflow-hidden shrink-0 flex items-center justify-center bg-[#f1e6d0] text-[#775a34] font-serif text-sm transition-transform hover:scale-105 shadow-2xs focus:outline-none"
                aria-label="Menu profil utilisateur"
                aria-expanded={profileMenuOpen}
              >
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'Profil'}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  (user.user_metadata?.full_name?.[0] || user.email?.[0] || 'K').toUpperCase()
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-[#FFFEFA] border border-amber-200/80 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-[#142943] truncate">
                      {user.user_metadata?.full_name || 'Utilisateur Kenza'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {user.email || ''}
                    </p>
                  </div>

                  {onSignOut && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Se déconnecter</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            onSignIn && (
              <button
                type="button"
                onClick={onSignIn}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold text-[#142943] bg-amber-50 hover:bg-amber-100 border border-amber-200/90 rounded-full transition-colors shrink-0 shadow-2xs"
              >
                Connexion
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
  onSignIn?: () => void;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Composant Header réutilisable sanctuarisant le logo Kenza à gauche (shrink-0)
 * et compactant l'avatar utilisateur à droite (32px/36px).
 */
export function Header({
  user,
  onSignOut,
  onSignIn,
  title,
  children,
}: HeaderProps) {
  return (
    <header className="w-full h-16 px-4 sm:px-6 bg-[#FFFEFA] border-b border-[#E8E2D5] flex items-center justify-between gap-3">
      {/* 1. Logo Kenza sanctuarisé à gauche — permanent et shrink-0 */}
      <div className="shrink-0 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Accueil Kenza">
          {/* Carré asymétrique bleu nuit avec lettre arabe et losange doré */}
          <div 
            className="w-9 h-9 relative grid place-items-center overflow-hidden bg-[#142943] text-[#f8f5ec] shadow-xs shrink-0"
            style={{ borderRadius: '13px 13px 13px 5px' }}
            aria-hidden="true"
          >
            <span className="font-['Noto_Sans_Arabic',sans-serif] text-[20px] leading-none -translate-y-px text-[#f8f5ec]">
              ك
            </span>
            <i 
              className="absolute w-2 h-2 border border-[#ddb578] rounded-[2px] right-[5px] bottom-[5px] rotate-45 pointer-events-none" 
            />
          </div>

          {/* Wordmark KENZA en DM Serif Display et signature */}
          <div className="flex flex-col text-left">
            <span className="font-['DM_Serif_Display',serif] text-[18px] tracking-[0.17em] leading-tight text-[#142943] block">
              KENZA
            </span>
            <span className="text-[9px] tracking-[0.045em] text-[#8a8b83] block -mt-0.5">
              la darija, en chemin
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Conteneur central (titre ou fil d'ariane) avec min-w-0 truncate */}
      {title && (
        <div className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-[#142943]">
          <span className="truncate">{title}</span>
        </div>
      )}

      {/* 3. Actions et profil utilisateur compactés à droite */}
      <div className="shrink-0 flex items-center gap-2">
        {children}

        {user ? (
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center bg-[#f1e6d0] text-[#775a34] font-serif text-sm">
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
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-full transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        ) : (
          onSignIn && (
            <button
              type="button"
              onClick={onSignIn}
              className="px-3 py-1.5 text-xs font-semibold text-[#142943] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
            >
              Se connecter
            </button>
          )
        )}
      </div>
    </header>
  );
}

export default Header;

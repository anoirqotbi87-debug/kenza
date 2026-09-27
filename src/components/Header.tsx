'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../store/useAppStore';
import { Flame, Star, Settings, User, LogOut, Menu, X, Headphones, ChevronRight, Volume2, VolumeX, Globe, Sliders } from 'lucide-react';
import { Notation } from '../types/curriculum';
import AuthModal from './auth/AuthModal';
import LanguageSelector from './ui/LanguageSelector';
import { supabase } from '../lib/supabase';
import { Navigation } from './Navigation';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Wifi, WifiOff } from 'lucide-react';

function NetworkStatusIndicator() {
  const { isOnline, swRegistered } = useNetworkStatus();
  
  if (!isOnline) {
    return (
      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold" title="Mode Hors-Ligne">
        <WifiOff className="w-3.5 h-3.5 text-amber-700" />
        <span>Hors-ligne</span>
      </div>
    );
  }

  if (swRegistered) {
    return (
      <div className="flex items-center gap-1 bg-[#7A9174]/15 text-[#7A9174] border border-[#7A9174]/30 px-2.5 py-1 rounded-full text-xs font-semibold" title="Mode Hors-Ligne Prêt">
        <Wifi className="w-3.5 h-3.5 text-[#7A9174]" />
        <span>Prêt hors-ligne</span>
      </div>
    );
  }

  return null;
}

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: any) => void;
}

export default function Header({ currentTab, onTabChange }: HeaderProps) {
  const { 
    xp, 
    streakDays, 
    preferredNotation, 
    setNotation, 
    toggleSound, 
    soundEnabled, 
    regionalVariant, 
    setRegionalVariant, 
    user 
  } = useAppStore();
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNotationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNotation(e.target.value as Notation);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getSectionTitle = (tab: string) => {
    switch (tab) {
      case 'home':
      case 'learn':
        return (t as any).nav?.home || 'Accueil';
      case 'parcours':
        return (t as any).nav?.parcours || 'Parcours';
      case 'phrasebook':
        return (t as any).nav?.phrasebook || 'Phrases';
      case 'review':
        return (t as any).nav?.review || 'Réviser';
      case 'speech':
        return (t as any).nav?.speech || 'Pratique Orale';
      case 'profile':
        return (t as any).nav?.profile || 'Profil';
      default:
        return 'Accueil';
    }
  };

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />

      <header className="sticky top-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E8E2D5] px-4 py-3 shadow-[0_2px_12px_rgba(27,42,74,0.03)] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Gauche : Hamburger + KENZA (petites capitales avec espacement) + chevron discret + nom de la section en gris */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="p-1.5 rounded-full hover:bg-[#E8E2D5]/50 text-[#1B2A4A] transition-colors flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button 
              onClick={() => onTabChange('home')}
              className="flex items-center gap-1.5 group text-left"
            >
              <span className="font-serif tracking-[0.22em] text-sm sm:text-base font-extrabold text-[#1B2A4A] uppercase">
                KENZA
              </span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#7A7670]/60 shrink-0" />

            <span className="text-xs sm:text-sm font-medium text-[#7A7670] truncate max-w-[120px] sm:max-w-none">
              {getSectionTitle(currentTab)}
            </span>
          </div>

          {/* Centre (Desktop) : Navigation tabs */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-lg">
            <Navigation currentTab={currentTab as any} onTabChange={onTabChange} />
          </div>

          {/* Droite : Bouton audio (icône écouteurs ronde) + streak/xp + avatar circulaire */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Gamification Stats (discrètes & élégantes) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#F7F3EA] px-2.5 py-1 rounded-full border border-[#E8E2D5] text-[#1B2A4A] text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-[#C9A05C] text-[#C9A05C]" />
              <span>{streakDays}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-[#F7F3EA] px-2.5 py-1 rounded-full border border-[#E8E2D5] text-[#1B2A4A] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#C9A05C] text-[#C9A05C]" />
              <span>{xp}</span>
            </div>

            {/* Bouton Audio : écouteurs ronds */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
              title={soundEnabled ? "Audio actif (cliquez pour couper)" : "Audio muet (cliquez pour activer)"}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                soundEnabled 
                  ? 'bg-[#1B2A4A] text-[#FDFCF8] border-[#1B2A4A] shadow-xs hover:bg-[#1B2A4A]/90' 
                  : 'bg-[#F7F3EA] text-[#7A7670] border-[#E8E2D5] hover:text-[#1B2A4A]'
              }`}
            >
              <Headphones className="w-4 h-4" />
            </button>

            {/* Avatar Circulaire */}
            <button
              onClick={() => {
                if (user) {
                  onTabChange('profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              title={user ? (user.user_metadata?.full_name || user.email) : "Se connecter"}
              className="w-9 h-9 rounded-full bg-[#C9A05C]/15 border border-[#C9A05C] text-[#1B2A4A] flex items-center justify-center hover:ring-2 hover:ring-[#C9A05C]/40 transition-all overflow-hidden"
            >
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-4 h-4 text-[#1B2A4A]" />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Menu / Drawer latéral éditorial */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#1B2A4A]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-[#FDFCF8] h-full shadow-2xl border-r border-[#E8E2D5] p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐪</span>
                  <div>
                    <span className="font-serif tracking-[0.2em] text-sm font-extrabold text-[#1B2A4A] uppercase block">
                      KENZA
                    </span>
                    <span className="text-[10px] text-[#7A7670] tracking-wider uppercase">
                      La darija, en chemin
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full text-[#7A7670] hover:text-[#1B2A4A] hover:bg-[#E8E2D5]/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account / Status */}
              <div className="bg-[#F7F3EA] rounded-2xl p-4 border border-[#E8E2D5]">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B2A4A] text-[#FDFCF8] flex items-center justify-center font-serif font-bold text-sm">
                        {(user.user_metadata?.full_name || user.email || 'K')[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#1B2A4A] truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-[#7A7670] truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D5]">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onTabChange('profile');
                        }}
                        className="text-xs font-semibold text-[#1B2A4A] hover:underline"
                      >
                        Voir profil
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 space-y-2">
                    <p className="text-xs text-[#7A7670]">Mode Invité actif</p>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-2 px-3 bg-[#1B2A4A] text-[#FDFCF8] text-xs font-bold rounded-xl hover:bg-[#1B2A4A]/90 transition-colors shadow-xs"
                    >
                      Se connecter / S'inscrire
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Counters in Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F7F3EA] rounded-2xl p-3 border border-[#E8E2D5] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A05C]/20 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 fill-[#C9A05C] text-[#C9A05C]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#7A7670] block">Série</span>
                    <span className="text-sm font-bold text-[#1B2A4A]">{streakDays} jours</span>
                  </div>
                </div>

                <div className="bg-[#F7F3EA] rounded-2xl p-3 border border-[#E8E2D5] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1B2A4A]/10 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-[#C9A05C] text-[#C9A05C]" />
                  </div>
                  <div>
                    <span className="text-xs text-[#7A7670] block">Points XP</span>
                    <span className="text-sm font-bold text-[#1B2A4A]">{xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Navigation Links inside Drawer */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold tracking-wider text-[#7A7670] uppercase px-1 block mb-2">
                  Navigation
                </span>
                
                {[
                  { id: 'home', label: 'Accueil' },
                  { id: 'parcours', label: 'Parcours' },
                  { id: 'phrasebook', label: 'Phrases & Vocabulaire' },
                  { id: 'review', label: 'Révision SRS' },
                  { id: 'speech', label: 'Pratique Orale' },
                  { id: 'profile', label: 'Passeport & Profil' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      currentTab === item.id 
                        ? 'bg-[#E8E2D5]/70 text-[#1B2A4A] font-bold' 
                        : 'text-[#7A7670] hover:text-[#1B2A4A] hover:bg-[#F7F3EA]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </div>

              {/* Settings & Preferences */}
              <div className="space-y-3 pt-3 border-t border-[#E8E2D5]">
                <span className="text-[11px] font-bold tracking-wider text-[#7A7670] uppercase px-1 block">
                  Préférences linguistiques
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-[#F7F3EA] p-2.5 rounded-xl border border-[#E8E2D5]">
                    <span className="text-[#7A7670]">Notation :</span>
                    <select
                      value={preferredNotation}
                      onChange={handleNotationChange}
                      className="bg-transparent font-bold text-[#1B2A4A] outline-none cursor-pointer text-xs"
                    >
                      <option value="arabizi">Arabizi (3, 7, 9)</option>
                      <option value="arabic">Arabe (عربي)</option>
                      <option value="duo">Duo (Bilingue)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-[#F7F3EA] p-2.5 rounded-xl border border-[#E8E2D5]">
                    <span className="text-[#7A7670]">Dialecte :</span>
                    <select
                      value={regionalVariant}
                      onChange={(e) => setRegionalVariant(e.target.value as any)}
                      className="bg-transparent font-bold text-[#1B2A4A] outline-none cursor-pointer text-xs"
                    >
                      <option value="casablanca">🏙️ Casa / Standard</option>
                      <option value="chamal">🌊 Chamal (Nord)</option>
                      <option value="fes">🏺 Fès (Traditionnel)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-[#F7F3EA] p-2.5 rounded-xl border border-[#E8E2D5]">
                    <span className="text-[#7A7670]">Langue UI :</span>
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer with Network Status */}
            <div className="pt-6 border-t border-[#E8E2D5] flex items-center justify-between">
              <NetworkStatusIndicator />
              <span className="text-[10px] text-[#7A7670]/60">v0.1.0 • Kenza</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import Leaderboard from '../gamification/Leaderboard';
import BadgesList from '../gamification/BadgesList';
import StreakHeatmap from '../gamification/StreakHeatmap';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, Trophy, Flame, Star, Crown, Headphones, Clock, BookOpen, Lock, Sparkles, Smartphone } from 'lucide-react';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import DarijaPassportCard from '../certificate/DarijaPassportCard';
import ProfilePassportView from './ProfilePassportView';
import NotificationSettings from './NotificationSettings';
import PlacementTestModal from '../onboarding/PlacementTestModal';
import { Zap } from 'lucide-react';
import PaywallModal from '../monetization/PaywallModal';

export default function ProfileView() {
  const { xp, streakDays, srsDeck, isPremium } = useAppStore();
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  
  const { results, hasPassedLevel } = useCheckpointProgress();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    import('../../lib/offlineStorage').then((m) => {
      m.checkOfflineStatus().then(percent => setDownloadProgress(percent));
    });
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDownloadOfflinePack = async () => {
    setIsDownloading(true);
    const { downloadFullOfflinePack } = await import('../../lib/offlineStorage');
    await downloadFullOfflinePack((percent) => {
      setDownloadProgress(percent);
    });
    setIsDownloading(false);
  };

  const getLevelName = (xp: number) => {
    if (xp < 100) return "Débutant Atlas — Niveau A1";
    if (xp < 500) return "Explorateur Saharien — Niveau A2";
    if (xp < 1000) return "Apprenti Fassi — Niveau B1";
    if (xp < 3000) return "Voyageur Marrakchi — Niveau B2";
    return "Maître de la Medina — Niveau C1";
  };

  const username = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Invité";

  const handleOpenCustomerPortal = async () => {
    setIsPortalLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      if (!token) {
        alert("Veuillez vous connecter pour gérer votre abonnement.");
        return;
      }
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.simulated) {
        alert("Portail de facturation en mode démo.");
      } else {
        alert(data.error || "Impossible d'accéder au portail de facturation.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Erreur lors de l'accès au portail de facturation.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Profil Header */}
      <div className="bg-[#FDFCF8] rounded-3xl p-8 shadow-xs border border-[#E8E2D5] flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-20 h-20 bg-[#1B2A4A] rounded-full flex items-center justify-center shadow-md border-2 border-[#C9A05C] shrink-0 text-[#C9A05C]">
          <User className="w-10 h-10" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.2em] uppercase">
            <span>—</span>
            <span>Profil Apprenant</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1B2A4A]">{username}</h2>
          <div className="inline-flex items-center gap-2 bg-[#C9A05C]/15 border border-[#C9A05C]/30 text-[#1B2A4A] px-4 py-1.5 rounded-full font-bold text-xs">
            <Crown className="w-3.5 h-3.5 text-[#C9A05C]" />
            <span>{getLevelName(xp)}</span>
          </div>
        </div>
      </div>

      {/* Carte Statut Abonnement Kenza Pro */}
      <div className={`p-6 sm:p-8 rounded-3xl shadow-xs border transition-all ${
        isPremium
          ? 'bg-[#1B2A4A] text-[#FDFCF8] border-[#1B2A4A]'
          : 'bg-[#FDFCF8] text-[#1B2A4A] border-[#E8E2D5]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.2em] uppercase">
              <Crown className="w-4 h-4" />
              <span>{isPremium ? 'Membre Kenza Pro' : 'Version Gratuite'}</span>
            </div>
            <h3 className={`font-serif text-2xl font-bold ${isPremium ? 'text-[#FDFCF8]' : 'text-[#1B2A4A]'}`}>
              {isPremium ? 'Votre Passeport Culturel est actif' : 'Débloquez tout le potentiel de la Darija'}
            </h3>
            <p className={`text-xs sm:text-sm max-w-xl ${isPremium ? 'text-[#E8E2D5]/80' : 'text-[#7A7670]'}`}>
              {isPremium
                ? 'Accès illimité aux modules avancés B1/B2, roleplay IA sans quota quotidien et synthèse vocale haute fidélité.'
                : 'Passez à Kenza Pro pour accéder aux Modules 3, 4 et 5, aux dialogues IA illimités et aux visas de certification.'}
            </p>
          </div>

          <div className="shrink-0">
            {isPremium ? (
              <button
                onClick={handleOpenCustomerPortal}
                disabled={isPortalLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <span>{isPortalLoading ? 'Chargement...' : 'Gérer mon abonnement'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <Crown className="w-4 h-4" />
                <span>Passer à Kenza Pro</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grille Stats & Passeport Culturel */}
      <ProfilePassportView />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Leaderboard />
        <BadgesList />
      </div>

      {/* Notifications & Reminders */}
      <div className="mt-8">
        <NotificationSettings />
      </div>

      {/* Test de positionnement */}
      <div className="bg-[#FDFCF8] rounded-3xl p-8 shadow-xs border border-[#E8E2D5] mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#C9A05C]/15 text-[#C9A05C] rounded-2xl flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">Test de Positionnement</h3>
            <p className="text-xs text-[#7A7670]">Réévaluez votre niveau pour ajuster votre parcours.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsPlacementTestOpen(true)}
          className="w-full py-3 px-4 bg-[#F7F3EA] hover:bg-[#E8E2D5]/60 text-[#1B2A4A] border border-[#E8E2D5] rounded-full font-bold text-xs transition-colors"
        >
          Re-passer le test
        </button>
      </div>

      <PlacementTestModal 
        isOpen={isPlacementTestOpen} 
        onClose={() => setIsPlacementTestOpen(false)} 
        onComplete={() => {
          setIsPlacementTestOpen(false);
        }} 
      />

      {/* Mode Hors-Ligne */}
      <div className="bg-[#FDFCF8] rounded-3xl p-8 shadow-xs border border-[#E8E2D5] mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#7A9174]/15 text-[#7A9174] flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1B2A4A]">Mode Hors-Ligne PWA</h3>
            <p className="text-xs text-[#7A7670]">Téléchargez les audios et fiches pour pratiquer sans connexion internet.</p>
          </div>
        </div>
        
        <div className="bg-[#F7F3EA] rounded-2xl p-5 border border-[#E8E2D5]">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-[#7A7670]">Données préchargées</span>
            <span className={downloadProgress === 100 ? "text-[#7A9174] font-bold" : "text-[#1B2A4A]"}>
              {downloadProgress}%
            </span>
          </div>
          <div className="h-2 bg-[#E8E2D5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7A9174] rounded-full transition-all duration-300" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          
          <button 
            onClick={handleDownloadOfflinePack}
            disabled={isDownloading || downloadProgress === 100}
            className="w-full mt-4 bg-[#FDFCF8] border border-[#E8E2D5] hover:border-[#C9A05C] text-[#1B2A4A] font-bold py-2.5 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-xs"
          >
            {isDownloading ? 'Téléchargement en cours...' : downloadProgress === 100 ? '✓ Pack Complet Prêt' : 'Télécharger le pack complet'}
          </button>
        </div>
      </div>

      {isPaywallOpen && (
        <PaywallModal source="profile_view" onClose={() => setIsPaywallOpen(false)} />
      )}
    </div>
  );
}

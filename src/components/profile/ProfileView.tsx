'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import Leaderboard from '../gamification/Leaderboard';
import BadgesList from '../gamification/BadgesList';
import StreakHeatmap from '../gamification/StreakHeatmap';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, Trophy, Flame, Star, Crown } from 'lucide-react';

export default function ProfileView() {
  const { xp, streakDays } = useAppStore();
  const { t } = useTranslation();
  const [session, setSession] = useState<Session | null>(null);
  
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profil Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white shrink-0">
          <User className="w-12 h-12 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <h2 className="text-3xl font-bold text-slate-800">{username}</h2>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-bold text-sm">
            <Crown className="w-4 h-4" />
            {getLevelName(xp)}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-50 px-4 py-2 rounded-2xl">
              <Flame className="w-6 h-6 fill-amber-500" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xl">{streakDays}</span>
                <span className="text-xs text-amber-600/70">Jours</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-500 font-bold bg-blue-50 px-4 py-2 rounded-2xl">
              <Star className="w-6 h-6 fill-blue-500" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xl">{xp}</span>
                <span className="text-xs text-blue-600/70">Total XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StreakHeatmap />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Leaderboard />
        <BadgesList />
      </div>

      {/* Mode Hors-Ligne */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Mode Hors-Ligne (Pack Voyage & Médina)</h3>
            <p className="text-slate-500 text-sm">Réviser la Darija sans internet dans l'avion ou le désert.</p>
          </div>
        </div>
        
        {downloadProgress === 100 ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 font-bold border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Pack Hors-Ligne Actif — Prêt pour le mode avion
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleDownloadOfflinePack}
              disabled={isDownloading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isDownloading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
            >
              {isDownloading 
                ? 'Téléchargement en cours...' 
                : downloadProgress > 0 && downloadProgress < 100
                  ? 'Restaurer le pack audio hors-ligne (fichiers manquants)'
                  : 'Télécharger le pack complet (100 sons ~ 4 Mo)'}
            </button>
            
            {isDownloading && (
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="pt-12 pb-6 flex justify-center">
        <button 
          onClick={() => {
            if (confirm("Voulez-vous vraiment vider le cache local ? Vous perdrez votre progression (XP, leçons) si vous n'êtes pas connecté.")) {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors bg-transparent border border-slate-200 hover:border-red-200 px-4 py-2 rounded-lg"
        >
          Vider le cache local / Réinitialiser
        </button>
      </footer>
    </div>
  );
}

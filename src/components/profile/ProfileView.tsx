'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import Leaderboard from '../gamification/Leaderboard';
import BadgesList from '../gamification/BadgesList';
import StreakHeatmap from '../gamification/StreakHeatmap';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, Trophy, Flame, Star, Crown, Headphones, Clock, BookOpen, Lock } from 'lucide-react';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import DarijaPassportCard from '../certificate/DarijaPassportCard';

export default function ProfileView() {
  const { xp, streakDays, srsDeck } = useAppStore();
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

  const totalSrsCards = Object.keys(srsDeck).length;
  const learnedCards = Object.values(srsDeck).filter(c => c.repetition > 0).length;

  // Passeports (A1 = level 2, A2 = level 3, B1 = level 4)
  const passports = [
    { id: '2', name: 'A1 - Survie & Souk', title: 'Palier A1' },
    { id: '3', name: 'A2 - Autonomie & Riad', title: 'Palier A2' },
    { id: '4', name: 'B1 - Maîtrise Verbale', title: 'Palier B1' }
  ];

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
        </div>
      </div>

      {/* Statistiques d'Engagement */}
      <h3 className="text-xl font-bold text-slate-800 px-2 mt-8 mb-4">Statistiques d'Engagement</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col items-center justify-center text-center">
          <Flame className="w-8 h-8 fill-amber-500 text-amber-500 mb-2" />
          <div className="text-2xl font-black text-slate-800">{streakDays}</div>
          <div className="text-sm font-medium text-amber-700">Jours de suite</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col items-center justify-center text-center">
          <Star className="w-8 h-8 fill-blue-500 text-blue-500 mb-2" />
          <div className="text-2xl font-black text-slate-800">{xp}</div>
          <div className="text-sm font-medium text-blue-700">Total XP</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex flex-col items-center justify-center text-center">
          <BookOpen className="w-8 h-8 fill-emerald-500 text-emerald-500 mb-2" />
          <div className="text-2xl font-black text-slate-800">{learnedCards} / {totalSrsCards}</div>
          <div className="text-sm font-medium text-emerald-700">Mots appris</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 flex flex-col items-center justify-center text-center">
          <Headphones className="w-8 h-8 fill-purple-500 text-purple-500 mb-2" />
          <div className="text-2xl font-black text-slate-800">--</div>
          <div className="text-sm font-medium text-purple-700">Minutes Audio</div>
        </div>
      </div>

      <StreakHeatmap />

      {/* Galerie des Passeports */}
      <h3 className="text-xl font-bold text-slate-800 px-2 mt-12 mb-4">Galerie des Passeports</h3>
      <div className="grid grid-cols-1 gap-8">
        {passports.map(p => {
          const isUnlocked = hasPassedLevel(p.id);
          const result = results[p.id];
          
          if (isUnlocked && result) {
            return (
              <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-200">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-800">{p.name}</h4>
                  <p className="text-slate-500 text-sm">Obtenu le {result.date}</p>
                </div>
                <DarijaPassportCard 
                  data={{
                    userName: username,
                    levelName: result.levelName,
                    score: result.score,
                    date: result.date,
                    passportId: result.passportId
                  }}
                />
              </div>
            );
          }

          return (
            <div key={p.id} className="bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-600 mb-1">{p.name}</h4>
              <p className="text-slate-500 text-sm max-w-sm">
                Terminez le {p.title} pour débloquer ce passeport et certifier votre niveau.
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Leaderboard />
        <BadgesList />
      </div>

      {/* Mode Hors-Ligne */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-xl">📱</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Mode Hors-Ligne</h3>
            <p className="text-sm text-slate-500">Téléchargez le contenu pour réviser sans internet</p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-slate-600">Stockage local</span>
            <span className={downloadProgress === 100 ? "text-green-600 font-bold" : "text-blue-600"}>
              {downloadProgress}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          
          <button 
            onClick={handleDownloadOfflinePack}
            disabled={isDownloading || downloadProgress === 100}
            className="w-full mt-4 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isDownloading ? 'Téléchargement...' : downloadProgress === 100 ? 'Pack Complet Prêt' : 'Télécharger le pack complet'}
          </button>
        </div>
      </div>

    </div>
  );
}

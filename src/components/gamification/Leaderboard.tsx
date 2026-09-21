import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Medal, Trophy, Star } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

interface Profile {
  username: string;
  xp: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const { xp: localXp } = useAppStore(); // To show user their own XP locally if not logged in
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, xp')
          .order('xp', { ascending: false })
          .limit(10);
        
        if (data) {
          setLeaders(data);
        }
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      }
    }
    fetchLeaders();
  }, []);

  const getLeague = (xp: number) => {
    if (xp >= 1500) return { name: (t as any).leagues?.diamond || 'Diamant', color: 'text-cyan-400', bg: 'bg-cyan-50' };
    if (xp >= 500) return { name: (t as any).leagues?.gold || 'Or', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (xp >= 150) return { name: (t as any).leagues?.silver || 'Argent', color: 'text-slate-400', bg: 'bg-slate-50' };
    return { name: (t as any).leagues?.bronze || 'Bronze', color: 'text-orange-400', bg: 'bg-orange-50' };
  };

  // Mock some data if no DB connection or empty
  const displayLeaders = leaders.length > 0 ? leaders : [
    { username: t.dashboard.youGuest, xp: localXp },
    { username: 'Laila99', xp: 450 },
    { username: 'Karim_Casa', xp: 230 },
    { username: 'Sarah.M', xp: 120 }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        {t.dashboard.weeklyLeagues}
      </h3>
      
      <div className="flex flex-col gap-3">
        {displayLeaders.map((leader, idx) => {
          const league = getLeague(leader.xp);
          return (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border border-slate-100 ${idx === 0 ? 'bg-gradient-to-r from-yellow-50 to-white' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400">
                  {idx === 0 ? <Medal className="w-6 h-6 text-yellow-500" /> : idx + 1}
                </div>
                <div className="font-bold text-slate-700">{leader.username || (t.dashboard as any).anonymous || 'Anonyme'}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-2 py-1 rounded-md text-xs font-bold ${league.bg} ${league.color}`}>
                  {league.name}
                </div>
                <div className="text-sm font-bold text-blue-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-blue-500" />
                  {leader.xp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

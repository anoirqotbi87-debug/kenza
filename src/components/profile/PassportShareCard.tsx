import React from 'react';
import { BookOpen, Flame, BrainCircuit, Star } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface PassportShareCardProps {
  username: string;
  stamps: any[];
  isAr: boolean;
  lang: string;
}

export default function PassportShareCard({ username, stamps, isAr, lang }: PassportShareCardProps) {
  const { streakDays, srsDeck, xp } = useAppStore();
  const totalSrsCards = Object.keys(srsDeck).length;
  const cardsAcquired = Object.values(srsDeck).filter(c => c.interval >= 3).length;
  
  // Filter only unlocked stamps for the share card
  const unlockedStamps = stamps.filter(s => s.passed);

  return (
    <div 
      className="bg-emerald-900 text-emerald-50 w-[800px] h-[1000px] flex flex-col p-12 overflow-hidden shadow-2xl relative"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        background: 'linear-gradient(to bottom, #064e3b, #065f46)'
      }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-950 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mt-8 relative z-10">
        <div className="w-28 h-28 bg-emerald-800 rounded-full border-4 border-emerald-400 flex items-center justify-center mb-6 shadow-inner">
          <BookOpen className="w-14 h-14 text-emerald-300" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-widest text-emerald-100 mb-2">
          {isAr ? 'جواز السفر الثقافي' : 'Passeport Culturel'}
        </h1>
        <p className="text-xl text-emerald-300 font-medium tracking-widest uppercase">
          {isAr ? 'المملكة المغربية' : 'Royaume du Maroc'}
        </p>
      </div>

      <div className="mt-12 mb-8 text-center relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">{username}</h2>
        <p className="text-emerald-200 text-lg uppercase tracking-wider">{isAr ? 'متعلم معتمد' : 'Apprenant Certifié'}</p>
      </div>

      {/* Stats row */}
      <div className="flex justify-center gap-8 mb-16 relative z-10">
        <div className="bg-emerald-800/80 backdrop-blur border border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center w-40 shadow-lg">
          <Flame className="w-10 h-10 text-orange-400 mb-3" />
          <div className="text-3xl font-black text-white">{streakDays}</div>
          <div className="text-emerald-300 text-sm font-bold uppercase tracking-wider mt-1">{isAr ? 'أيام' : 'Jours'}</div>
        </div>
        <div className="bg-emerald-800/80 backdrop-blur border border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center w-40 shadow-lg">
          <BrainCircuit className="w-10 h-10 text-emerald-400 mb-3" />
          <div className="text-3xl font-black text-white">{cardsAcquired}</div>
          <div className="text-emerald-300 text-sm font-bold uppercase tracking-wider mt-1">{isAr ? 'مكتسب' : 'Mots acquis'}</div>
        </div>
        <div className="bg-emerald-800/80 backdrop-blur border border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center w-40 shadow-lg">
          <Star className="w-10 h-10 text-yellow-400 mb-3" />
          <div className="text-3xl font-black text-white">{xp}</div>
          <div className="text-emerald-300 text-sm font-bold uppercase tracking-wider mt-1">XP</div>
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 relative z-10">
        <h3 className="text-xl font-bold text-emerald-100 mb-6 text-center uppercase tracking-widest">
          {isAr ? 'تأشيرات المعرفة المكتسبة' : 'Visas de Compétence Obtenus'}
        </h3>
        
        {unlockedStamps.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-10">
            {unlockedStamps.map((stamp, i) => (
              <div key={stamp.id} className="flex flex-col items-center">
                <div className={`
                  w-40 h-40 rounded-full border-dashed border-4 flex flex-col items-center justify-center p-3
                  transform ${stamp.rotation} ${stamp.color.replace('border-', 'border-').replace('text-', 'text-')}
                  bg-white/90 shadow-xl
                `}>
                  <div className="text-xs font-black uppercase tracking-[0.2em] mb-1">Visa</div>
                  <div className="text-3xl font-black uppercase text-center leading-tight">
                    {stamp.level}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest mt-2 border-t-4 border-current pt-2 text-center w-3/4">
                    Maroc
                  </div>
                </div>
                <div className="mt-4 font-bold text-emerald-100 text-sm bg-emerald-950/50 px-3 py-1.5 rounded-lg border border-emerald-800 backdrop-blur">
                  {stamp.title.split('—')[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-60">
            <div className="w-24 h-24 rounded-full border-dashed border-4 border-emerald-400/50 mb-4 flex items-center justify-center">
              ?
            </div>
            <p className="text-emerald-200">{isAr ? 'لا توجد تأشيرات بعد' : 'Aucun visa obtenu pour le moment'}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-emerald-700/50 flex justify-between items-center text-emerald-400 relative z-10">
        <div className="font-bold tracking-widest text-lg">KENZA</div>
        <div className="text-sm font-medium">apprendre-la-darija.kenza.ma</div>
      </div>
    </div>
  );
}

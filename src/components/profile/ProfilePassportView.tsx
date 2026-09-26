'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import { Flame, BrainCircuit, Star, MessageCircle, Lock, BookOpen } from 'lucide-react';

export default function ProfilePassportView() {
  const { xp, streakDays, srsDeck, customVocabulary, uiLanguage } = useAppStore();
  const { hasPassedLevel } = useCheckpointProgress();

  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  // Stats derivations
  const totalSrsCards = Object.keys(srsDeck).length;
  // SRS mastery stats
  const cardsLearning = Object.values(srsDeck).filter(c => c.interval < 3).length;
  const cardsAcquired = Object.values(srsDeck).filter(c => c.interval >= 3).length;
  
  const roleplaysCompleted = Object.keys(customVocabulary).length;

  // Stamp configurations
  const stamps = [
    {
      id: 'a1',
      title: isAr ? 'باب بوجلود — فاس' : 'Bab Boujloud — Fès',
      level: 'A1',
      passed: hasPassedLevel('1') || hasPassedLevel('2'),
      reqLabel: isAr ? 'مطلوب إتمام A1' : 'Checkpoint A1 requis',
      color: 'border-red-600 text-red-600',
      rotation: '-rotate-3',
    },
    {
      id: 'a2',
      title: isAr ? 'جامع الفنا — مراكش' : 'Jemaa el-Fna — Marrakech',
      level: 'A2',
      passed: hasPassedLevel('3'),
      reqLabel: isAr ? 'مطلوب إتمام A2' : 'Checkpoint A2 requis',
      color: 'border-blue-700 text-blue-700',
      rotation: 'rotate-2',
    },
    {
      id: 'b1',
      title: isAr ? 'قصبة الوداية — الرباط' : 'Kasbah des Oudayas — Rabat',
      level: 'B1',
      passed: hasPassedLevel('4'), // Module 4
      reqLabel: isAr ? 'مطلوب إتمام B1' : 'Checkpoint B1 requis',
      color: 'border-emerald-700 text-emerald-700',
      rotation: '-rotate-6',
    },
    {
      id: 'b2',
      title: isAr ? 'السوق الكبير — طنجة' : 'Grand Socco — Tanger',
      level: 'B2',
      passed: hasPassedLevel('6'), // Future module
      reqLabel: isAr ? 'مطلوب إتمام B2' : 'Checkpoint B2 requis',
      color: 'border-purple-700 text-purple-700',
      rotation: 'rotate-3',
    }
  ];

  const currentDestinationIndex = stamps.findIndex(s => !s.passed);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Passeport Header */}
      <div className="relative overflow-hidden bg-emerald-900 rounded-3xl p-8 shadow-2xl text-emerald-50 border-4 border-emerald-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none"></div>
        {/* Motif Zellige minimaliste (via SVG ou CSS) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-emerald-800 rounded-full border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-inner">
            <BookOpen className="w-10 h-10 text-emerald-300" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-emerald-100 mb-1">
            {isAr ? 'جواز السفر الثقافي' : 'Passeport Culturel'}
          </h1>
          <p className="text-emerald-300/80 font-medium tracking-wider">
            {isAr ? 'المملكة المغربية' : 'Royaume du Maroc'}
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
            <Flame className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{streakDays} {isAr ? 'أيام' : 'Jours'}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{isAr ? 'سلسلة التعلم' : 'Série Active'}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalSrsCards}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">{isAr ? 'بطاقات SRS' : 'Volume SRS'}</p>
          <div className="flex gap-2 text-[10px] w-full px-2">
            <div className="flex-1 bg-amber-100 text-amber-700 rounded py-0.5" title={isAr ? 'قيد التعلم' : 'En apprentissage'}>{cardsLearning}</div>
            <div className="flex-1 bg-emerald-100 text-emerald-700 rounded py-0.5" title={isAr ? 'مكتسب' : 'Acquis'}>{cardsAcquired}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3">
            <Star className="w-6 h-6 fill-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{xp}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{isAr ? 'خبرة (XP)' : 'Capital XP'}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{roleplaysCompleted}</p>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{isAr ? 'مهام الذكاء الاصطناعي' : 'Missions IA'}</p>
        </div>
      </div>

      {/* Visas / Stamps Gallery */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          {isAr ? 'تأشيرات المعرفة' : 'Visas de Compétence'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {stamps.map((stamp, index) => {
            const isCurrentDestination = index === currentDestinationIndex;
            
            return (
              <div 
                key={stamp.id} 
                className={`
                  relative aspect-[4/3] rounded-2xl flex flex-col items-center justify-center p-6 border-2 transition-all
                  ${stamp.passed 
                    ? 'bg-slate-50 border-slate-100' 
                    : isCurrentDestination
                      ? 'bg-amber-50/50 border-amber-200 border-dashed' 
                      : 'bg-slate-50 border-slate-100 opacity-60'}
                `}
              >
                {/* Stamp Icon */}
                <div className={`
                  w-36 h-36 rounded-full border-dashed border-4 flex flex-col items-center justify-center p-2
                  transform ${stamp.passed ? stamp.rotation : 'rotate-0'} transition-transform
                  ${stamp.passed ? stamp.color : 'border-slate-300 text-slate-400 opacity-40'}
                `}>
                  {stamp.passed ? (
                    <>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Visa</div>
                      <div className="text-lg font-black uppercase text-center leading-tight">
                        {stamp.level}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest mt-1 border-t-2 border-current pt-1 text-center w-3/4">
                        Maroc
                      </div>
                    </>
                  ) : (
                    <Lock className="w-8 h-8 opacity-50 mb-2" />
                  )}
                </div>

                {/* Info Text */}
                <div className="mt-6 text-center z-10 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-xl shadow-sm border border-slate-100">
                  <h3 className={`font-bold text-sm ${stamp.passed ? 'text-slate-800' : 'text-slate-600'}`}>
                    {stamp.title}
                  </h3>
                  {!stamp.passed && (
                    <p className={`text-xs mt-1 font-medium ${isCurrentDestination ? 'text-amber-600' : 'text-slate-400'}`}>
                      {isCurrentDestination ? (isAr ? 'الوجهة الحالية' : 'Destination en cours') : stamp.reqLabel}
                    </p>
                  )}
                </div>
                
                {/* Progress bar for current destination */}
                {isCurrentDestination && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-100 rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-amber-400 w-1/4 animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

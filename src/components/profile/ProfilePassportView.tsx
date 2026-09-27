'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import { Flame, BrainCircuit, Star, MessageCircle, Lock, BookOpen, Share2 } from 'lucide-react';
import { usePassportShare } from '../../hooks/usePassportShare';
import PassportShareCard from './PassportShareCard';
import { useRef } from 'react';

export default function ProfilePassportView() {
  const { xp, streakDays, srsDeck, customVocabulary, uiLanguage, user } = useAppStore();
  const { hasPassedLevel } = useCheckpointProgress();

  const { sharePassport, isSharing, shareSuccess } = usePassportShare();
  const shareCardRef = useRef<HTMLDivElement>(null);
  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Apprenti';

  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  // Stats derivations
  const totalSrsCards = Object.keys(srsDeck).length;
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
      color: 'border-[#C9A05C] text-[#C9A05C]',
      rotation: '-rotate-3',
    },
    {
      id: 'a2',
      title: isAr ? 'جامع الفنا — مراكش' : 'Jemaa el-Fna — Marrakech',
      level: 'A2',
      passed: hasPassedLevel('3'),
      reqLabel: isAr ? 'مطلوب إتمام A2' : 'Checkpoint A2 requis',
      color: 'border-[#1B2A4A] text-[#1B2A4A]',
      rotation: 'rotate-2',
    },
    {
      id: 'b1',
      title: isAr ? 'قصبة الوداية — الرباط' : 'Kasbah des Oudayas — Rabat',
      level: 'B1',
      passed: hasPassedLevel('4'),
      reqLabel: isAr ? 'مطلوب إتمام B1' : 'Checkpoint B1 requis',
      color: 'border-[#7A9174] text-[#7A9174]',
      rotation: '-rotate-6',
    },
    {
      id: 'b2',
      title: isAr ? 'السوق الكبير — طنجة' : 'Grand Socco — Tanger',
      level: 'B2',
      passed: hasPassedLevel('6'),
      reqLabel: isAr ? 'مطلوب إتمام B2' : 'Checkpoint B2 requis',
      color: 'border-[#C9A05C] text-[#C9A05C]',
      rotation: 'rotate-3',
    }
  ];

  const currentDestinationIndex = stamps.findIndex(s => !s.passed);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Passeport Header */}
      <div className="relative overflow-hidden bg-[#1B2A4A] rounded-3xl p-8 sm:p-10 shadow-lg text-[#FDFCF8] border border-[#1B2A4A]">
        {/* Subtle Moroccan geometric overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 12px 12px, #C9A05C 1.5px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C9A05C]/15 rounded-full border-2 border-[#C9A05C] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(201,160,92,0.25)]">
            <span className="font-arabic text-2xl sm:text-3xl font-bold text-[#C9A05C]">🇲🇦</span>
          </div>
          <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase mb-1">
            <span>—</span>
            <span>Royaume du Maroc</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#FDFCF8] tracking-tight mb-1">
            {isAr ? 'جواز السفر الثقافي' : 'Passeport Culturel'}
          </h1>
          <p className="text-xs text-[#E8E2D5]/70 tracking-widest uppercase">
            {isAr ? 'المملكة المغربية' : 'Certificat d\'apprentissage authentique'}
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#C9A05C]/15 text-[#C9A05C] rounded-full flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1B2A4A]">{streakDays} {isAr ? 'أيام' : 'Jours'}</p>
          <p className="text-[11px] text-[#7A7670] font-bold uppercase tracking-wider">{isAr ? 'سلسلة التعلم' : 'Série Active'}</p>
        </div>

        <div className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#1B2A4A]/10 text-[#1B2A4A] rounded-full flex items-center justify-center mb-2">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1B2A4A]">{totalSrsCards}</p>
          <p className="text-[11px] text-[#7A7670] font-bold uppercase tracking-wider mb-2">{isAr ? 'بطاقات SRS' : 'Volume SRS'}</p>
          <div className="flex gap-1.5 text-[10px] w-full px-1">
            <div className="flex-1 bg-[#C9A05C]/15 text-[#C9A05C] font-bold rounded py-0.5" title="En apprentissage">{cardsLearning}</div>
            <div className="flex-1 bg-[#7A9174]/20 text-[#7A9174] font-bold rounded py-0.5" title="Acquis">{cardsAcquired}</div>
          </div>
        </div>

        <div className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#C9A05C]/15 text-[#C9A05C] rounded-full flex items-center justify-center mb-2">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1B2A4A]">{xp}</p>
          <p className="text-[11px] text-[#7A7670] font-bold uppercase tracking-wider">{isAr ? 'خبرة (XP)' : 'Capital XP'}</p>
        </div>

        <div className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#7A9174]/15 text-[#7A9174] rounded-full flex items-center justify-center mb-2">
            <MessageCircle className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1B2A4A]">{roleplaysCompleted}</p>
          <p className="text-[11px] text-[#7A7670] font-bold uppercase tracking-wider">{isAr ? 'مهام الذكاء الاصطناعي' : 'Missions IA'}</p>
        </div>
      </div>

      {/* Visas / Stamps Gallery */}
      <div className="bg-[#FDFCF8] rounded-3xl p-6 md:p-10 shadow-xs border border-[#E8E2D5]">
        <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.22em] uppercase mb-1">
          <span>—</span>
          <span>Sceaux Officiels</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1B2A4A] mb-8">
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
                    ? 'bg-[#F7F3EA] border-[#E8E2D5] shadow-xs' 
                    : isCurrentDestination
                      ? 'bg-[#C9A05C]/5 border-[#C9A05C] border-dashed' 
                      : 'bg-[#F7F3EA]/50 border-[#E8E2D5] opacity-50'}
                `}
              >
                {/* Stamp Icon */}
                <div className={`
                  w-36 h-36 rounded-full border-dashed border-4 flex flex-col items-center justify-center p-2
                  transform ${stamp.passed ? stamp.rotation : 'rotate-0'} transition-transform
                  ${stamp.passed ? stamp.color : 'border-[#E8E2D5] text-[#7A7670]/40'}
                `}>
                  {stamp.passed ? (
                    <>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Visa</div>
                      <div className="font-serif text-xl font-black uppercase text-center leading-tight">
                        {stamp.level}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 border-t-2 border-current pt-1 text-center w-3/4">
                        Maroc
                      </div>
                    </>
                  ) : (
                    <Lock className="w-8 h-8 opacity-40 mb-2" />
                  )}
                </div>

                {/* Info Text */}
                <div className="mt-6 text-center z-10 bg-[#FDFCF8]/90 backdrop-blur-xs py-2 px-4 rounded-xl shadow-xs border border-[#E8E2D5]">
                  <h3 className={`font-serif font-bold text-sm ${stamp.passed ? 'text-[#1B2A4A]' : 'text-[#7A7670]'}`}>
                    {stamp.title}
                  </h3>
                  {!stamp.passed && (
                    <p className={`text-xs mt-0.5 font-medium ${isCurrentDestination ? 'text-[#C9A05C]' : 'text-[#7A7670]/70'}`}>
                      {isCurrentDestination ? (isAr ? 'الوجهة الحالية' : 'Destination en cours') : stamp.reqLabel}
                    </p>
                  )}
                </div>
                
                {/* Progress bar for current destination */}
                {isCurrentDestination && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C9A05C]/20 rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-[#C9A05C] w-1/4 animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Share Button */}
        {stamps.some(s => s.passed) && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => sharePassport(shareCardRef)}
              disabled={isSharing}
              className="bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold py-3.5 px-8 rounded-full flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 text-sm"
            >
              <Share2 className="w-5 h-5" />
              <span>
                {isSharing 
                  ? (isAr ? 'جاري الإنشاء...' : 'Génération en cours...') 
                  : shareSuccess 
                    ? (isAr ? 'تم النسخ/الحفظ!' : 'Partage prêt !')
                    : (isAr ? 'مشاركة جواز السفر' : 'Partager mon Passeport')}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden Share Card */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none">
        <div ref={shareCardRef}>
          <PassportShareCard 
            username={username}
            stamps={stamps}
            isAr={isAr}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}

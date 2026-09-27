'use client';

import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Compass } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';
import { allLessonsList } from '@/data/curriculum';

interface HeroBannerProps {
  onPrimaryAction: () => void;
  primaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export default function HeroBanner({
  onPrimaryAction,
  primaryActionLabel,
  onSecondaryAction,
  secondaryActionLabel,
}: HeroBannerProps) {
  const { completedLessons, streakDays, xp } = useAppStore();
  const { t } = useTranslation();

  // Find next uncompleted lesson
  const nextLesson = allLessonsList.find((l) => !completedLessons.includes(l.id)) || allLessonsList[0];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / allLessonsList.length) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#1B2A4A] text-[#FDFCF8] shadow-lg border border-[#1B2A4A] p-6 sm:p-10 lg:p-12 mb-8">
      
      {/* Subtle Moroccan Geometric Overlay Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 12px 12px, #C9A05C 1.5px, transparent 0), radial-gradient(circle at 36px 36px, #C9A05C 1.5px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />
      
      {/* Decorative Gold Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C9A05C]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#7A9174]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Content */}
        <div className="max-w-2xl space-y-4">
          
          {/* Header kicker & circular gold badge */}
          <div className="flex items-center gap-3">
            {/* Badge circulaire doré avec texte arabe stylisé */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#C9A05C] bg-[#C9A05C]/15 flex items-center justify-center shadow-[0_0_15px_rgba(201,160,92,0.25)] shrink-0">
              <span className="font-arabic text-xl sm:text-2xl font-bold text-[#C9A05C]">
                كنزة
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase">
                <span>—</span>
                <span>La darija, en chemin</span>
              </div>
              <p className="text-xs text-[#E8E2D5]/70">L'élégance du dialecte marocain</p>
            </div>
          </div>

          {/* Titre en Serif blanc contrasté */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FDFCF8] tracking-tight leading-tight">
            Maîtrisez la Darija avec authenticité et fluidité
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#E8E2D5]/85 font-normal max-w-xl leading-relaxed">
            Un apprentissage immersif conçu pour vous connecter aux conversations réelles, aux subtilités régionales et à l'esprit du Maroc.
          </p>

          {/* Actions : Bouton d'action principal en Pill arrondie dorée */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onPrimaryAction}
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 group"
            >
              <span>{primaryActionLabel || `Continuer : ${nextLesson?.title?.fr || 'Leçon suivante'}`}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {onSecondaryAction && (
              <button
                onClick={onSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FDFCF8]/10 hover:bg-[#FDFCF8]/15 text-[#FDFCF8] border border-[#E8E2D5]/30 font-medium text-sm transition-all duration-200"
              >
                <span>{secondaryActionLabel || 'Découvrir le parcours'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progression Summary Badge on Hero */}
        <div className="w-full lg:w-auto shrink-0 bg-[#FDFCF8]/5 backdrop-blur-md rounded-2xl p-5 border border-[#E8E2D5]/15 space-y-4 min-w-[240px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A05C]">
              Progression globale
            </span>
            <span className="text-xs font-bold text-[#FDFCF8]">
              {completedLessons.length} / {allLessonsList.length} leçons
            </span>
          </div>

          {/* Progress bar with Sage green fill */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-[#7A9174] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-center">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[11px] text-[#E8E2D5]/70 block">Série actuelle</span>
              <span className="font-serif text-lg font-bold text-[#C9A05C]">🔥 {streakDays} j</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
              <span className="text-[11px] text-[#E8E2D5]/70 block">Expérience</span>
              <span className="font-serif text-lg font-bold text-[#FDFCF8]">⭐ {xp} XP</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

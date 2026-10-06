'use client';

import React, { useState } from 'react';
import { X, Volume2, Turtle, Sparkles } from 'lucide-react';
import { ARABIZI_GUIDE } from '@/data/arabiziGuide';
import { playAudio } from '@/lib/audio';
import { useAppStore } from '@/store/useAppStore';
import { useDialog } from '@/hooks/useDialog';

interface ArabiziGuideModalProps {
  onClose: () => void;
}

/**
 * « La Clé des Chiffres Arabizi » : mini-guide phonétique interactif.
 *
 * Chaque chiffre est présenté avec son explication anatomique et ses exemples
 * vocalisés, écoutables à vitesse normale (1.0x) ou ralentie (🐢 0.75x,
 * mode tortue) pour décomposer les consonnes gutturales du darija.
 */
export default function ArabiziGuideModal({ onClose }: ArabiziGuideModalProps) {
  const { soundEnabled } = useAppStore();
  const { dialogRef } = useDialog(true, onClose);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow'>('normal');

  const sound = ARABIZI_GUIDE[activeIndex];
  const isRtl = /[\u0600-\u06FF]/.test(sound.arabicLetter);

  const handleListen = (arabicWithTashkeel: string, speed: 'normal' | 'slow') => {
    setActiveSpeed(speed);
    playAudio(
      '',
      arabicWithTashkeel,
      soundEnabled,
      speed === 'slow' ? 0.75 : 1.0,
      { speed, voice: 'female' }
    );
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="arabizi-guide-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-[#FDFCF8] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-4 border-[#C9A05C]/60">
        {/* Header */}
        <div className="bg-[#1B2A4A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C9A05C]" />
            <div>
              <h3 id="arabizi-guide-title" className="font-display font-bold text-[#FDFCF8] text-lg">
                La Clé des Chiffres Arabizi
              </h3>
              <p className="text-[10px] text-[#FDFCF8]/70 font-semibold uppercase tracking-wide">
                Mini-guide phonétique · 5 sons
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#FDFCF8]/80 hover:text-[#FDFCF8] hover:bg-white/10 transition-colors"
            aria-label="Fermer le guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sound tabs */}
        <div className="flex border-b border-[#E8E2D5] bg-[#F7F3EA] overflow-x-auto">
          {ARABIZI_GUIDE.map((s, i) => (
            <button
              key={s.number}
              onClick={() => {
                setActiveIndex(i);
                setActiveSpeed('normal');
              }}
              className={`
                flex-1 min-w-[64px] px-3 py-3 text-center border-b-2 transition-colors
                ${i === activeIndex ? 'border-[#C9A05C] bg-white text-[#1B2A4A]' : 'border-transparent text-[#7A7670] hover:text-[#1B2A4A]'}
              `}
            >
              <div className={`text-lg font-display font-extrabold ${i === activeIndex ? 'text-[#C9A05C]' : ''}`}>
                {s.number}
              </div>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center gap-3">
            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-12 h-12 rounded-2xl bg-[#C9A05C]/15 border border-[#C9A05C]/30 flex items-center justify-center font-arabic text-2xl font-bold text-[#1B2A4A]"
            >
              {sound.arabicLetter}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9A05C]">
                Chiffre {sound.number} · {sound.name}
              </p>
              <p className="text-sm text-[#7A7670] mt-1">{sound.anatomicalTip}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1B2A4A]">
              Écoutez et répétez
            </p>
            {sound.examples.map((ex) => (
              <div key={ex.arabizi} className="bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-arabic text-xl font-bold text-[#1B2A4A] leading-relaxed">
                      {ex.arabicWithTashkeel}
                    </p>
                    <p className="font-display font-bold text-[#1B2A4A] text-sm mt-1">
                      {ex.arabizi}
                    </p>
                    <p className="text-xs text-[#7A7670] italic mt-0.5">{ex.french}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleListen(ex.arabicWithTashkeel, 'normal')}
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-[#1B2A4A] text-[#FDFCF8] hover:bg-[#1B2A4A]/90 transition-colors"
                      title="Écouter à vitesse normale"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C9A05C]" />
                      1.0x
                    </button>
                    <button
                      type="button"
                      onClick={() => handleListen(ex.arabicWithTashkeel, 'slow')}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors border ${
                        activeSpeed === 'slow'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-[#FDFCF8] text-[#1B2A4A] border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
                      }`}
                      title="Mode Tortue ralenti (0.75x) pour décomposer les phonèmes"
                    >
                      <Turtle className="w-3.5 h-3.5 text-[#C9A05C]" />
                      🐢 0.75x
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#C9A05C]/10 border border-[#C9A05C]/20 rounded-2xl p-4 text-xs text-[#7A7670]">
            💡 Astuce : au Maroc, les chiffres servent d'orthographe sonore —
            mémorisez les gestes de gorge plutôt que les lettres, et la prononciation devient naturelle. Un son en boucle ralentie vous entraînera plus vite.

            {activeSpeed === 'slow' ? (
              <span className="text-red-600 font-semibold"> Mode tortue 🐢 actif : chaque son est ralenti à 0.75x.</span>
            ) : undefined}
          </div>
        </div>
      </div>
    </div>
  );
}
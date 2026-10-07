'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Turtle,
} from 'lucide-react';
import { playAudio } from '@/lib/audio';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import {
  evaluatePronunciation,
  PronunciationEvaluation,
} from '@/lib/phonemeMatcher';
import { useAppStore } from '@/store/useAppStore';

export interface PronunciationExercise {
  id: string;
  arabizi: string;
  arabic: string;
  translation: string;
  focusPhoneme?: '3' | '7' | '9' | 'kh' | 'gh';
}

const DEFAULT_EXERCISES: PronunciationExercise[] = [
  {
    id: 'p1',
    arabizi: '3afak, bch7al hada ?',
    arabic: 'عَافَاكْ، بْشْحَالْ هَادَا ؟',
    translation: "S'il vous plaît, combien ça coûte ?",
    focusPhoneme: '3',
  },
  {
    id: 'p2',
    arabizi: 'Sba7 l-khir a khoya',
    arabic: 'صْبَاحْ الْخِيرْ أ خُويَا',
    translation: 'Bonjour mon frère',
    focusPhoneme: '7',
  },
  {
    id: 'p3',
    arabizi: 'Bghit 9hwa nss-nss',
    arabic: 'بْغِيتْ قَهْوَة نْصّْ نْصّْ',
    translation: 'Je voudrais un café moitié lait',
    focusPhoneme: '9',
  },
  {
    id: 'p4',
    arabizi: 'L-khobz skhoun bzzaf',
    arabic: 'الْخُبْزْ سْخُونْ بْزَّافْ',
    translation: 'Le pain est très chaud',
    focusPhoneme: 'kh',
  },
  {
    id: 'p5',
    arabizi: 'Ghadi nemchi daba',
    arabic: 'غَادِي نْمْشِي دَابَا',
    translation: 'Je vais partir maintenant',
    focusPhoneme: 'gh',
  },
];

interface PronunciationTrainerProps {
  exercises?: PronunciationExercise[];
  onCompleteExercise?: (score: number) => void;
  className?: string;
}

export default function PronunciationTrainer({
  exercises = DEFAULT_EXERCISES,
  onCompleteExercise,
  className = '',
}: PronunciationTrainerProps) {
  const { soundEnabled, addXp } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow'>('normal');

  const currentExercise = exercises[currentIndex] || exercises[0];

  const {
    isSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition('ar-MA', 6000);

  const evalRef = useRef<(spoken: string) => void>(() => {});

  const handleEvaluate = (spokenText: string) => {
    if (!spokenText.trim()) return;
    const res = evaluatePronunciation(
      spokenText,
      currentExercise.arabizi,
      currentExercise.arabic
    );
    setEvaluation(res);

    if (res.score >= 60) {
      addXp(15);
    }
    if (onCompleteExercise) {
      onCompleteExercise(res.score);
    }
  };

  useEffect(() => {
    evalRef.current = handleEvaluate;
  });

  useEffect(() => {
    if (transcript && !isListening) {
      evalRef.current(transcript);
    }
  }, [transcript, isListening]);

  const handleListen = (speed: 'normal' | 'slow') => {
    setActiveSpeed(speed);
    playAudio(
      currentExercise.arabizi,
      currentExercise.arabic,
      soundEnabled,
      speed === 'slow' ? 0.75 : 1.0,
      { speed, voice: 'female' }
    );
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setEvaluation(null);
      resetTranscript();
      startListening();
    }
  };

  const handleNext = () => {
    if (isListening) stopListening();
    setEvaluation(null);
    resetTranscript();
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
  };

  return (
    <div className={`bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6 ${className}`}>
      
      {/* Exercise progress & header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A05C]" />
          <span className="text-xs font-bold text-[#1B2A4A] tracking-wider uppercase">
            Atelier de Prononciation
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-[#F7F3EA] rounded-full text-[#7A7670] border border-[#E8E2D5]">
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Target Phrase Display */}
      <div className="bg-[#F7F3EA] rounded-2xl p-6 text-center border border-[#E8E2D5] space-y-3 relative overflow-hidden">
        {currentExercise.focusPhoneme && (
          <div className="inline-block px-3 py-1 bg-[#C9A05C]/15 border border-[#C9A05C]/30 rounded-full text-xs font-bold text-[#1B2A4A] mb-1">
            Son ciblé : &apos;{currentExercise.focusPhoneme}&apos;
          </div>
        )}
        <div className="text-3xl sm:text-4xl font-arabic text-[#1B2A4A] leading-relaxed select-all">
          {currentExercise.arabic}
        </div>
        <div className="font-display text-xl sm:text-2xl font-bold text-[#1B2A4A]">
          {currentExercise.arabizi}
        </div>
        <div className="text-xs sm:text-sm text-[#7A7670] italic">
          {currentExercise.translation}
        </div>

        {/* Dual-speed listen buttons */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleListen('normal')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              activeSpeed === 'normal'
                ? 'bg-[#1B2A4A] !text-white shadow-xs'
                : 'bg-[#FDFCF8] text-[#1B2A4A] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
            }`}
            title="Écouter à vitesse normale"
          >
            <Volume2 className="w-4 h-4 text-[#C9A05C]" />
            <span className={activeSpeed === 'normal' ? '!text-white' : ''}>Normal (1.0x)</span>
          </button>

          <button
            type="button"
            onClick={() => handleListen('slow')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              activeSpeed === 'slow'
                ? 'bg-[#1B2A4A] !text-white shadow-xs'
                : 'bg-[#FDFCF8] text-[#1B2A4A] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
            }`}
            title="Mode Tortue ralenti (0.75x) pour décomposer les phonèmes"
          >
            <Turtle className="w-4 h-4 text-[#C9A05C]" />
            <span className={activeSpeed === 'slow' ? '!text-white' : ''}>Tortue 🐢 (0.75x)</span>
          </button>
        </div>
      </div>

      {/* Voice Recording Interaction Area */}
      <div className="flex flex-col items-center gap-4 pt-2">
        {isSupported ? (
          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isListening
                ? 'bg-red-500 !text-white animate-pulse scale-110 ring-4 ring-red-200'
                : 'bg-[#1B2A4A] !text-white hover:bg-[#1B2A4A]/90 hover:scale-105 active:scale-95'
            }`}
            aria-label={isListening ? 'Arrêter l’enregistrement' : 'Commencer à parler'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 !text-white" />
            ) : (
              <Mic className="w-8 h-8 text-[#C9A05C]" />
            )}
          </button>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center max-w-sm">
            Reconnaissance vocale non disponible sur ce navigateur. Mode écoute uniquement activé.
          </div>
        )}

        <div className="text-xs font-bold text-[#7A7670]">
          {isListening
            ? 'Écoute en cours... Répétez la phrase à voix haute'
            : isSupported
            ? 'Appuyez sur le micro pour tester votre prononciation'
            : 'Écoutez le modèle audio ci-dessus'}
        </div>

        {/* Live captured transcript */}
        {transcript && (
          <div className="w-full max-w-md p-3.5 bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7A7670] tracking-wider">
              Ce que le micro a capté
            </span>
            <p className="font-arabic text-lg text-[#1B2A4A]">{transcript}</p>
          </div>
        )}

        {/* Non-blocking permission/mic error */}
        {voiceError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 max-w-md text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{voiceError} (Vous pouvez continuer en mode écoute).</span>
          </div>
        )}

        {/* Visual Evaluation Results Card */}
        {evaluation && !isListening && (
          <div className="w-full max-w-md space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Score & Badge Banner */}
            <div
              className="p-4 rounded-2xl border flex items-center justify-between shadow-xs"
              style={{
                backgroundColor:
                  evaluation.tier === 'excellent'
                    ? 'rgba(34, 197, 94, 0.08)'
                    : evaluation.tier === 'good'
                    ? 'rgba(234, 179, 8, 0.08)'
                    : 'rgba(239, 68, 68, 0.08)',
                borderColor:
                  evaluation.tier === 'excellent'
                    ? '#86efac'
                    : evaluation.tier === 'good'
                    ? '#fde047'
                    : '#fca5a5',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{evaluation.badge.icon}</span>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#1B2A4A]">
                    {evaluation.badge.text}
                  </div>
                  <div className="text-[11px] text-[#7A7670]">
                    Précision acoustique : {evaluation.score}%
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold font-display text-[#1B2A4A]">
                {evaluation.score}%
              </div>
            </div>

            {/* Targeted Phonemes Diagnostics */}
            {evaluation.targetPhonemes.length > 0 && (
              <div className="p-3.5 bg-[#FDFCF8] border border-[#E8E2D5] rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-[#7A7670] uppercase tracking-wider block">
                  Diagnostic des consonnes difficiles :
                </span>
                <div className="grid gap-1.5">
                  {evaluation.targetPhonemes.map((ph) => (
                    <div
                      key={ph.char}
                      className={`p-2 rounded-xl border text-xs flex items-center justify-between ${
                        ph.detected
                          ? 'bg-green-50/60 border-green-200 text-green-900'
                          : 'bg-red-50/60 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-arabic text-sm">
                          {ph.char} ({ph.arabicChar})
                        </span>
                        <span className="text-[11px] opacity-80">
                          {ph.detected ? 'Bien articulé !' : ph.tip}
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        {ph.detected ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          {evaluation && (
            <button
              type="button"
              onClick={() => {
                setEvaluation(null);
                resetTranscript();
                startListening();
              }}
              className="px-4 py-2.5 rounded-full bg-[#F7F3EA] border border-[#E8E2D5] text-[#1B2A4A] text-xs font-bold flex items-center gap-1.5 hover:bg-[#E8E2D5]/50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réessayer</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-[#FDFCF8] text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <span>Phrase suivante</span>
            <ChevronRight className="w-4 h-4 text-[#C9A05C]" />
          </button>
        </div>

      </div>

    </div>
  );
}

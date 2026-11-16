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
  Info,
} from 'lucide-react';
import { playAudio } from '@/lib/audio';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import {
  evaluatePronunciation,
  PronunciationEvaluation,
  MULTI_PHONEME_TIPS,
  ARABIZI_TO_ARABIC,
} from '@/lib/phonemeMatcher';
import { useAppStore } from '@/store/useAppStore';

export interface PronunciationExercise {
  id: string;
  arabizi: string;
  arabic: string;
  translation: string | Record<string, string>;
  focusPhoneme?: '3' | '7' | '9' | 'kh' | 'gh';
  srsWordId?: string;
}

const DEFAULT_EXERCISES: PronunciationExercise[] = [
  {
    id: 'p1',
    arabizi: '3afak, bch7al hada ?',
    arabic: 'عَافَاكْ، بْشْحَالْ هَادَا ؟',
    translation: {
      fr: "S'il vous plaît, combien ça coûte ?",
      ar: 'من فضلك، كم ثمن هذا؟',
      en: 'Please, how much is this?',
      es: 'Por favor, ¿cuánto cuesta esto?',
    },
    focusPhoneme: '3',
    srsWordId: 'srs_chhal',
  },
  {
    id: 'p2',
    arabizi: 'Sba7 l-khir a khoya',
    arabic: 'صْبَاحْ الْخِيرْ أ خُويَا',
    translation: {
      fr: 'Bonjour mon frère',
      ar: 'صباح الخير يا أخي',
      en: 'Good morning my brother',
      es: 'Buenos días mi hermano',
    },
    focusPhoneme: '7',
    srsWordId: 'srs_khouya',
  },
  {
    id: 'p3',
    arabizi: 'Bghit 9hwa nss-nss',
    arabic: 'بْغِيتْ قَهْوَة نْصّْ نْصّْ',
    translation: {
      fr: 'Je voudrais un café moitié lait',
      ar: 'أريد قهوة نصف حليب ونصف قهوة',
      en: 'I would like a half-and-half coffee',
      es: 'Quisiera un café mitad leche',
    },
    focusPhoneme: '9',
    srsWordId: 'srs_9hwa',
  },
  {
    id: 'p4',
    arabizi: 'L-khobz skhoun bzzaf',
    arabic: 'الْخُبْزْ سْخُونْ بْزَّافْ',
    translation: {
      fr: 'Le pain est très chaud',
      ar: 'الخبز ساخن جداً',
      en: 'The bread is very hot',
      es: 'El pan está muy caliente',
    },
    focusPhoneme: 'kh',
    srsWordId: 'srs_khobz',
  },
  {
    id: 'p5',
    arabizi: 'Ghadi nemchi daba',
    arabic: 'غَادِي نْمْشِي دَابَا',
    translation: {
      fr: 'Je vais partir maintenant',
      ar: 'سأذهب الآن',
      en: 'I am going to leave now',
      es: 'Me voy a ir ahora',
    },
    focusPhoneme: 'gh',
    srsWordId: 'srs_daba',
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
  const { soundEnabled, addXp, uiLanguage, recordVocalFailure } = useAppStore();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const isEs = lang === 'es';
  const isEn = lang === 'en';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow'>('normal');
  const [showPhonemeTip, setShowPhonemeTip] = useState(false);

  const currentExercise = exercises[currentIndex] || exercises[0];

  const getTranslationText = (trans: string | Record<string, string>): string => {
    if (typeof trans === 'string') return trans;
    return trans[lang] || trans.fr || trans.en || '';
  };

  const {
    isSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition('ar-MA', 6000, lang);

  const evalRef = useRef<(spoken: string) => void>(() => {});

  const handleEvaluate = (spokenText: string) => {
    if (!spokenText.trim()) return;
    const res = evaluatePronunciation(
      spokenText,
      currentExercise.arabizi,
      currentExercise.arabic,
      lang
    );
    setEvaluation(res);

    if (res.score >= 60) {
      addXp(15);
    } else {
      // Synchronisation multimodale : enregistrement de l'échec phonétique dans le deck SRS
      const targetWordId = currentExercise.srsWordId || currentExercise.id;
      recordVocalFailure(targetWordId);
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
      { voice: 'female' }
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
    setShowPhonemeTip(false);
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
  };

  const activePhoneme = currentExercise.focusPhoneme;
  const phonemeTipInfo = activePhoneme
    ? MULTI_PHONEME_TIPS[activePhoneme]?.[lang] ||
      MULTI_PHONEME_TIPS[activePhoneme]?.fr
    : null;

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6 ${className}`}
    >
      {/* Exercise progress & header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C9A05C]" />
          <span className="text-xs font-bold text-[#1B2A4A] tracking-wider uppercase">
            {isAr
              ? 'ورشة النطق الصوتي'
              : isEs
              ? 'Taller de Pronunciación'
              : isEn
              ? 'Pronunciation Workshop'
              : 'Atelier de Prononciation'}
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-[#F7F3EA] rounded-full text-[#7A7670] border border-[#E8E2D5]">
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Target Phrase Display */}
      <div className="bg-[#F7F3EA] rounded-2xl p-6 text-center border border-[#E8E2D5] space-y-3 relative overflow-hidden">
        {activePhoneme && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPhonemeTip(!showPhonemeTip)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A05C]/15 hover:bg-[#C9A05C]/25 border border-[#C9A05C]/30 rounded-full text-xs font-bold text-[#1B2A4A] transition-colors"
              title={
                isAr
                  ? 'انقر لمعرفة طريقة نطق هذا الحرف'
                  : isEs
                  ? 'Haz clic para ver cómo articular este sonido'
                  : isEn
                  ? 'Click to see how to articulate this sound'
                  : 'Cliquez pour voir comment articuler ce son'
              }
            >
              <Info className="w-3.5 h-3.5 text-[#C9A05C]" />
              <span>
                {isAr
                  ? `الصوت المستهدف : '${activePhoneme}' (${ARABIZI_TO_ARABIC[activePhoneme] || ''})`
                  : isEs
                  ? `Sonido objetivo: '${activePhoneme}' (${ARABIZI_TO_ARABIC[activePhoneme] || ''})`
                  : isEn
                  ? `Target sound: '${activePhoneme}' (${ARABIZI_TO_ARABIC[activePhoneme] || ''})`
                  : `Son ciblé : '${activePhoneme}' (${ARABIZI_TO_ARABIC[activePhoneme] || ''})`}
              </span>
            </button>

            {showPhonemeTip && phonemeTipInfo && (
              <div className="p-3 bg-white/90 border border-[#C9A05C]/40 rounded-xl text-xs text-[#1B2A4A] text-left rtl:text-right max-w-md animate-in fade-in duration-200">
                <p className="font-semibold text-[#8B6B23] mb-0.5">
                  💡 {isAr ? 'نصيحة النطق' : isEs ? 'Consejo de pronunciación' : isEn ? 'Pronunciation tip' : 'Conseil d’articulation'} :
                </p>
                <p>{phonemeTipInfo}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-3xl sm:text-4xl font-arabic text-[#1B2A4A] leading-relaxed select-all" dir="rtl">
          {currentExercise.arabic}
        </div>
        <div className="font-display text-xl sm:text-2xl font-bold text-[#1B2A4A]" dir="ltr">
          {currentExercise.arabizi}
        </div>
        <div className="text-xs sm:text-sm text-[#7A7670] italic">
          {getTranslationText(currentExercise.translation)}
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
            title={
              isAr
                ? 'عادي (1.0x)'
                : isEs
                ? 'Escuchar a velocidad normal'
                : isEn
                ? 'Listen at normal speed'
                : 'Écouter à vitesse normale'
            }
          >
            <Volume2 className="w-4 h-4 text-[#C9A05C]" />
            <span className={activeSpeed === 'normal' ? '!text-white' : ''}>
              {isAr ? 'عادي (1.0x)' : 'Normal (1.0x)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleListen('slow')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              activeSpeed === 'slow'
                ? 'bg-[#1B2A4A] !text-white shadow-xs'
                : 'bg-[#FDFCF8] text-[#1B2A4A] border border-[#E8E2D5] hover:bg-[#E8E2D5]/50'
            }`}
            title={
              isAr
                ? 'سلحفاة 🐢 (0.75x)'
                : isEs
                ? 'Modo tortuga lento (0.75x)'
                : isEn
                ? 'Slow Turtle mode (0.75x)'
                : 'Mode Tortue ralenti (0.75x)'
            }
          >
            <Turtle className="w-4 h-4 text-[#C9A05C]" />
            <span className={activeSpeed === 'slow' ? '!text-white' : ''}>
              {isAr ? 'سلحفاة 🐢 (0.75x)' : isEs ? 'Tortuga (0.75x)' : isEn ? 'Turtle (0.75x)' : 'Tortue (0.75x)'}
            </span>
          </button>
        </div>
      </div>

      {/* Voice Recording Interaction Area */}
      <div className="flex flex-col items-center gap-4 pt-2">
        {isSupported === false ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center max-w-sm">
            {isAr
              ? 'التعرف الصوتي غير مدعوم على هذا المتصفح. تم تفعيل وضع الاستماع فقط.'
              : isEs
              ? 'Reconocimiento de voz no compatible en este navegador. Modo de solo escucha activado.'
              : isEn
              ? 'Voice recognition unavailable in this browser. Listening mode activated.'
              : 'Reconnaissance vocale non disponible sur ce navigateur. Mode écoute uniquement activé.'}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isListening
                ? 'bg-red-500 !text-white animate-pulse scale-110 ring-4 ring-red-200'
                : 'bg-[#1B2A4A] !text-white hover:bg-[#1B2A4A]/90 hover:scale-105 active:scale-95'
            }`}
            aria-label={
              isListening
                ? isAr
                  ? 'إيقاف التسجيل'
                  : isEs
                  ? 'Detener grabación'
                  : isEn
                  ? 'Stop recording'
                  : 'Arrêter l’enregistrement'
                : isAr
                ? 'بدء التحدث'
                : isEs
                ? 'Comenzar a hablar'
                : isEn
                ? 'Start speaking'
                : 'Commencer à parler'
            }
          >
            {isListening ? (
              <MicOff className="w-8 h-8 !text-white" />
            ) : (
              <Mic className="w-8 h-8 text-[#C9A05C]" />
            )}
          </button>
        )}

        {/* Real-time sound wave bars when mic is active */}
        {isListening && (
          <div className="flex items-center justify-center gap-1.5 h-8 my-1" aria-hidden="true">
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-3" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-6" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-8" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-5" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-7" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-4" />
            <span className="w-1 bg-[#C9A05C] rounded-full animate-pulse h-2" />
          </div>
        )}

        <div className="text-xs font-bold text-[#7A7670] text-center">
          {isListening
            ? isAr
              ? 'جاري الاستماع... كرر الجملة بصوت واضح'
              : isEs
              ? 'Escuchando... Repita la frase en voz alta'
              : isEn
              ? 'Listening... Speak the phrase clearly'
              : 'Écoute en cours... Répétez la phrase à voix haute'
            : isSupported === false
            ? isAr
              ? 'استمع إلى النموذج الصوتي أعلاه'
              : isEs
              ? 'Escucha el modelo de audio arriba'
              : isEn
              ? 'Listen to the audio model above'
              : 'Écoutez le modèle audio ci-dessus'
            : isAr
            ? 'اضغط على الميكروفون لاختبار نطقك'
            : isEs
            ? 'Pulse el micrófono para probar su pronunciación'
            : isEn
            ? 'Press the microphone to test your pronunciation'
            : 'Appuyez sur le micro pour tester votre prononciation'}
        </div>

        {/* Live captured transcript */}
        {transcript && (
          <div className="w-full max-w-md p-3.5 bg-[#F7F3EA] border border-[#E8E2D5] rounded-2xl text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7A7670] tracking-wider">
              {isAr
                ? 'ما التقطه الميكروفون'
                : isEs
                ? 'Lo que captó el micrófono'
                : isEn
                ? 'What the microphone captured'
                : 'Ce que le micro a capté'}
            </span>
            <p className="font-arabic text-lg text-[#1B2A4A]">{transcript}</p>
          </div>
        )}

        {/* Non-blocking permission/mic error */}
        {voiceError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 max-w-md text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {voiceError}{' '}
              {isAr
                ? '(يمكنك المتابعة في وضع الاستماع).'
                : isEs
                ? '(Puede continuar en modo de escucha).'
                : isEn
                ? '(You can continue in listening mode).'
                : '(Vous pouvez continuer en mode écoute).'}
            </span>
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
                    {isAr
                      ? 'الدقة الصوتية :'
                      : isEs
                      ? 'Precisión acústica:'
                      : isEn
                      ? 'Acoustic accuracy:'
                      : 'Précision acoustique :'} {evaluation.score}%
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
                  {isAr
                    ? 'تشخيص الأصوات المستهدفة :'
                    : isEs
                    ? 'Diagnóstico de consonantes difíciles:'
                    : isEn
                    ? 'Difficult consonants diagnosis:'
                    : 'Diagnostic des consonnes difficiles :'}
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
                          {ph.detected
                            ? isAr
                              ? 'نطق ممتاز !'
                              : isEs
                              ? '¡Bien articulado!'
                              : isEn
                              ? 'Well articulated!'
                              : 'Bien articulé !'
                            : ph.tip}
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

            {/* Notification de synchronisation SRS prioritaire en cas d'échec phonétique */}
            {evaluation.score < 60 && (
              <div className="p-3.5 bg-[#C9A05C]/15 border border-[#C9A05C]/35 rounded-2xl flex items-center gap-3 text-xs text-[#1B2A4A] animate-in fade-in duration-300">
                <Sparkles className="w-4 h-4 text-[#C9A05C] shrink-0" />
                <span className="font-medium">
                  {isAr
                    ? 'تمت إضافة هذه العبارة إلى مراجعاتك ذات الأولوية في نظام التكرار المتباعد (SRS) لترسيخ النطق.'
                    : isEs
                    ? 'Frase añadida a tus repasos prioritarios (SRS) para afianzar la pronunciación.'
                    : isEn
                    ? 'Phrase added to your high-priority SRS reviews to strengthen pronunciation.'
                    : 'Expression ajoutée à vos révisions prioritaires (SRS) pour consolider la prononciation.'}
                </span>
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
              <span>
                {isAr
                  ? 'إعادة المحاولة'
                  : isEs
                  ? 'Reintentar'
                  : isEn
                  ? 'Retry'
                  : 'Réessayer'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-[#FDFCF8] text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <span>
              {isAr
                ? 'الجملة التالية'
                : isEs
                ? 'Siguiente frase'
                : isEn
                ? 'Next phrase'
                : 'Phrase suivante'}
            </span>
            <ChevronRight className="w-4 h-4 text-[#C9A05C] rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

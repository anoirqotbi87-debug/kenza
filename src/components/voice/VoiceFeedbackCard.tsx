'use client';

import React from 'react';
import { VoiceEvaluationResult } from '../../utils/phonemeMatcher';
import { Trophy, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

interface VoiceFeedbackCardProps {
  evaluation: VoiceEvaluationResult | null;
  onRetry: () => void;
  onListenModel: () => void;
}

export default function VoiceFeedbackCard({
  evaluation,
  onRetry,
  onListenModel,
}: VoiceFeedbackCardProps) {
  const { t } = useTranslation();
  const { uiLanguage } = useAppStore();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';
  const isEs = lang === 'es';
  const isEn = lang === 'en';

  if (!evaluation) return null;

  const { score, targetPhonemes } = evaluation;

  let headerColor = 'text-green-600';
  let headerBg = 'bg-green-50 border-green-200';
  let message = isAr
    ? 'نطق ممتاز ودقيق !'
    : isEs
    ? '¡Excelente pronunciación!'
    : isEn
    ? 'Excellent pronunciation!'
    : 'Excellente prononciation !';
  let Icon = Trophy;

  if (score < 50) {
    headerColor = 'text-red-600';
    headerBg = 'bg-red-50 border-red-200';
    message = isAr
      ? 'يحتاج إلى مراجعة، استمع مرة أخرى.'
      : isEs
      ? 'A mejorar, escucha de nuevo.'
      : isEn
      ? 'Needs work, listen again.'
      : 'À retravailler, écoutez à nouveau.';
    Icon = AlertCircle;
  } else if (score < 80) {
    headerColor = 'text-amber-600';
    headerBg = 'bg-amber-50 border-amber-200';
    message = isAr
      ? 'مفهوم، ركّز على الأصوات أدناه.'
      : isEs
      ? 'Comprensible, practica los sonidos abajo.'
      : isEn
      ? 'Understandable, practice the sounds below.'
      : 'Compréhensible, travaillez les sons ci-dessous.';
    Icon = AlertCircle;
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="w-full max-w-md mx-auto mt-6 animate-in slide-in-from-bottom-2 fade-in duration-300"
    >
      {/* Score Header */}
      <div
        className={`p-4 rounded-xl flex items-center justify-between border ${headerBg} ${headerColor} mb-4`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 shrink-0" />
          <div>
            <div className="font-bold">{message}</div>
            <div className="text-sm opacity-80">
              {t.modules.ui.accuracy} : {score}%
            </div>
          </div>
        </div>
        <div className="relative w-12 h-12">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-black/10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-current drop-shadow-sm transition-all duration-1000 ease-out"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>

      {/* Phoneme Feedback */}
      {targetPhonemes.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 text-left rtl:text-right space-y-3">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            {isAr
              ? 'تشخيص الأصوات المستهدفة'
              : isEs
              ? 'Diagnóstico de sonidos objetivo'
              : isEn
              ? 'Target sounds diagnostic'
              : 'Diagnostic des sons cibles'}
          </h4>
          <div className="space-y-2">
            {targetPhonemes.map((ph) => (
              <div
                key={ph.char}
                className={`p-3 rounded-xl border flex flex-col gap-1 ${
                  ph.detected
                    ? 'bg-green-50 border-green-100'
                    : 'bg-red-50 border-red-100'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800">
                    {isAr
                      ? `صوت ${ph.char} (${ph.name})`
                      : isEs
                      ? `Sonido ${ph.char} (${ph.name})`
                      : isEn
                      ? `Sound ${ph.char} (${ph.name})`
                      : `Son ${ph.char} (${ph.name})`}
                  </span>
                  {ph.detected ? (
                    <span className="text-green-600 flex items-center gap-1 text-sm">
                      <span className="text-lg">✅</span>{' '}
                      {isAr ? 'تم رصده' : isEs ? 'Detectado' : isEn ? 'Detected' : 'Détecté'}
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1 text-sm">
                      <span className="text-lg">⚠️</span>{' '}
                      {isAr ? 'غير مسموع' : isEs ? 'No percibido' : isEn ? 'Not heard' : 'Non perçu'}
                    </span>
                  )}
                </div>
                {!ph.detected && (
                  <p className="text-xs text-slate-600">{ph.tip}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onListenModel}
          className="flex-1 py-3 bg-white border-2 border-blue-100 hover:border-blue-300 text-blue-600 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
        >
          <Volume2 className="w-5 h-5" />
          {isAr
            ? 'إعادة الاستماع'
            : isEs
            ? 'Volver a escuchar'
            : isEn
            ? 'Listen again'
            : 'Réécouter'}
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-md"
        >
          <RefreshCw className="w-5 h-5" />
          {isAr
            ? 'إعادة المحاولة'
            : isEs
            ? 'Reintentar'
            : isEn
            ? 'Retry'
            : 'Réessayer'}
        </button>
      </div>
    </div>
  );
}

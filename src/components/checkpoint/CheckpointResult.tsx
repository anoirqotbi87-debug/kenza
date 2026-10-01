'use client';

import React, { useEffect, useMemo } from 'react';
import { X, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import DarijaPassportCard from '../certificate/DarijaPassportCard';
import { PassportData } from '../../utils/certificateGenerator';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import { useAppStore } from '../../store/useAppStore';
import { trackEvent } from '../../utils/analytics';
import { getDateLocale } from '../../lib/i18n/utils';

interface CheckpointResultProps {
  levelId: string;
  levelName: string;
  score: number;
  totalQuestions: number;
  onClose: () => void;
  onRetry: () => void;
}

export default function CheckpointResult({ levelId, levelName, score, totalQuestions, onClose, onRetry }: CheckpointResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80;
  
  const { user, uiLanguage } = useAppStore();
  const { saveResult } = useCheckpointProgress();

  const levelCodeMap: Record<string, string> = {
    '1': 'A1.1',
    '2': 'A1.2',
    '3': 'A2',
    '4': 'B1',
    '5': 'B2',
    '6': 'B2+',
    '7': 'C1'
  };
  const codeLevel = levelCodeMap[levelId] || levelId.toUpperCase();
  const passportId = useMemo(() => {
    const seed = `${codeLevel}-${score}-${totalQuestions}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 9000;
    return `KNZ-${codeLevel}-${String(1000 + hash)}`;
  }, [codeLevel, score, totalQuestions]);
  const dateStr = useMemo(() => new Date().toLocaleDateString(getDateLocale(uiLanguage)), [uiLanguage]);

  const passportData: PassportData = {
    userName: user?.user_metadata?.username || user?.email?.split('@')[0] || 'INVITÉ',
    levelName,
    score: percentage,
    date: dateStr,
    passportId
  };

  useEffect(() => {
    trackEvent('checkpoint_attempted', { levelId, score: percentage, passed });

    if (passed) {
      saveResult({
        levelId,
        levelName,
        score: percentage,
        passed,
        date: dateStr,
        passportId
      });
    }
  }, [levelId, levelName, percentage, passed, dateStr, passportId, saveResult]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#1B2A4A]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FDFCF8] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bouton Fermer */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F3EA] hover:bg-[#E8E2D5] text-[#1B2A4A] transition-colors border border-[#E8E2D5] z-30 shadow-xs"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-10 text-center">
          {passed ? (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#C9A05C]/20 border-2 border-[#C9A05C]/40 text-[#C9A05C] mb-1 shadow-sm">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase mb-1">
                  <span>—</span>
                  <span>Palier Officiel Validé</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1B2A4A]">Félicitations !</h2>
                <p className="text-xs sm:text-sm text-[#7A7670] mt-1.5 max-w-md mx-auto">
                  Vous avez validé le <strong className="text-[#1B2A4A] font-display">{levelName}</strong> avec un score remarquable de <strong className="text-[#1B2A4A]">{percentage}%</strong>.
                </p>
              </div>
              
              <div className="py-2">
                <DarijaPassportCard data={passportData} />
              </div>
              
              <p className="text-[11px] text-[#7A7670] pt-1">
                Ce visa officiel a été enregistré dans votre Passeport Culturel.
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 text-red-600 mb-1">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-[#7A7670] text-xs font-bold tracking-[0.25em] uppercase mb-1">
                  <span>—</span>
                  <span>Résultat du Palier</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#1B2A4A]">Presque au but !</h2>
                <p className="text-xs sm:text-sm text-[#7A7670] mt-1.5 max-w-md mx-auto">
                  Vous avez obtenu <strong className="text-[#1B2A4A]">{percentage}%</strong>. Un score de <strong>80%</strong> minimum est requis pour certifier ce palier.
                </p>
              </div>
              
              <div className="bg-[#F7F3EA] rounded-2xl p-5 sm:p-6 text-left border border-[#E8E2D5] max-w-md mx-auto">
                <h4 className="font-display font-bold text-sm text-[#1B2A4A] mb-2">Recommandations de révision :</h4>
                <ul className="list-disc list-inside text-[#7A7670] space-y-1.5 text-xs">
                  <li>Révisez les cartes de vocabulaire dans l'onglet <strong>Réviser</strong>.</li>
                  <li>Écoutez les phrases avec l'audio natif pour affiner votre oreille.</li>
                  <li>Faites quelques simulations orales avec le <strong>Roleplay IA</strong>.</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 max-w-md mx-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-[#F7F3EA] hover:bg-[#E8E2D5] text-[#1B2A4A] border border-[#E8E2D5] font-bold rounded-full text-xs sm:text-sm transition-colors shadow-xs"
                >
                  Réviser d'abord
                </button>
                <button 
                  onClick={onRetry}
                  className="flex-1 px-6 py-3 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retenter l'examen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

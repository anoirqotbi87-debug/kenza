'use client';

import React, { useEffect } from 'react';
import { X, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import DarijaPassportCard from '../certificate/DarijaPassportCard';
import { PassportData } from '../../utils/certificateGenerator';
import { useCheckpointProgress } from '../../hooks/useCheckpointProgress';
import { useAppStore } from '../../store/useAppStore';

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
  
  const { user } = useAppStore();
  const { saveResult } = useCheckpointProgress();

  const passportId = `KNZ-${levelId.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
  const dateStr = new Date().toLocaleDateString('fr-FR');

  const passportData: PassportData = {
    userName: user?.user_metadata?.username || user?.email?.split('@')[0] || 'INVITÉ',
    levelName,
    score: percentage,
    date: dateStr,
    passportId
  };

  useEffect(() => {
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
  }, [passed]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>

        <div className="p-8 text-center">
          {passed ? (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 mb-2">
                <Award className="w-12 h-12 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800">Félicitations !</h2>
                <p className="text-slate-500 mt-2 text-lg">Vous avez validé le {levelName} avec brio.</p>
              </div>
              
              <div className="py-6">
                <DarijaPassportCard data={passportData} />
              </div>
              
              <p className="text-sm text-slate-400">Ce passeport a été ajouté à votre profil.</p>
            </div>
          ) : (
            <div className="space-y-8 py-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-2">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800">Presque !</h2>
                <p className="text-slate-500 mt-2 text-lg">
                  Vous avez obtenu <strong>{percentage}%</strong>. Il faut 80% pour valider ce palier.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 inline-block">
                <h4 className="font-bold text-slate-700 mb-2">Conseils de révision :</h4>
                <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
                  <li>Revoyez le vocabulaire essentiel dans l'onglet Lexique.</li>
                  <li>Entraînez-vous à l'écoute avec le mode Mains-Libres.</li>
                  <li>Prenez votre temps pour lire les translittérations.</li>
                </ul>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Réviser d'abord
                </button>
                <button 
                  onClick={onRetry}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retenter l'examen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

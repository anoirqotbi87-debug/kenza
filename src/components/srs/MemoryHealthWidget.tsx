'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Brain, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export function MemoryHealthWidget() {
  const srsDeck = useAppStore((state) => state.srsDeck);
  const getDueCards = useAppStore((state) => state.getDueCards);

  // Mémorisation des cartes SRS pour éviter les re-renders inutiles
  const srsCards = React.useMemo(() => {
    return Object.values(srsDeck || {});
  }, [srsDeck]);

  const dueCards = React.useMemo(() => {
    if (srsCards.length === 0 || !getDueCards) return [];
    return getDueCards();
  }, [getDueCards, srsCards]);

  // 1. Calculs statistiques globaux de la mémoire
  const totalCards = srsCards.length;
  const dueCount = dueCards.length;

  if (totalCards === 0) {
    return (
      <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#C9A05C]/15 text-[#C9A05C] rounded-xl border border-[#C9A05C]/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A] dark:text-zinc-100">Santé de la Mémoire</h3>
            <p className="text-xs text-[#7A7670] dark:text-zinc-400">Aucune carte SRS active pour le moment</p>
          </div>
        </div>
        <p className="text-sm text-[#7A7670] dark:text-zinc-300">
          Commencez à explorer le carnet de phrases ou les modules pour alimenter votre espace de répétition espacée (SRS).
        </p>
      </div>
    );
  }

  // Distribution des états
  const reviewCards = srsCards.filter((c) => c.state === 'review').length;
  const learningCards = srsCards.filter((c) => c.state === 'learning').length;

  // Facteur d'aisance moyen (Ease Factor, initialisé à 2.5)
  const avgEaseFactor = srsCards.reduce((acc, c) => acc + (c.easeFactor || 2.5), 0) / totalCards;

  // Calcul du Score de Rétention global (basé sur le pourcentage de cartes consolidées et le taux d'échec vocal inverse)
  const totalVocalFailures = srsCards.reduce((acc, c) => acc + (c.vocalFailureCount || 0), 0);
  const consolidationRatio = reviewCards / totalCards;
  const vocalPenalty = Math.min(0.2, (totalVocalFailures / (totalCards * 2)) * 0.2);
  const retentionScore = Math.round(Math.min(99, Math.max(15, (consolidationRatio * 0.8 + (avgEaseFactor / 3.0) * 0.2 - vocalPenalty) * 100)));

  // Temps de réponse moyen global en secondes
  const cardsWithTime = srsCards.filter((c) => c.averageResponseTimeMs && c.averageResponseTimeMs > 0);
  const avgResponseTimeSec = cardsWithTime.length > 0
    ? (cardsWithTime.reduce((acc, c) => acc + (c.averageResponseTimeMs || 0), 0) / cardsWithTime.length / 1000).toFixed(1)
    : '2.4';

  // Détermination du statut qualitatif de santé
  let healthStatus = { label: 'Excellente', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
  if (retentionScore < 50) {
    healthStatus = { label: 'À consolider', color: 'text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
  } else if (retentionScore < 75) {
    healthStatus = { label: 'Stable', color: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
  }

  return (
    <div className="bg-[#FDFCF8] dark:bg-zinc-900 border border-[#E8E2D5] dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* En-tête du Widget */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C9A05C]/15 text-[#C9A05C] rounded-xl border border-[#C9A05C]/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A] dark:text-zinc-100 text-base">Santé de la Mémoire</h3>
            <p className="text-xs text-[#7A7670] dark:text-zinc-400">Algorithme adaptatif SM-2 & Télémétrie vocale</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium border ${healthStatus.color}`}>
          {healthStatus.label}
        </span>
      </div>

      {/* Indicateur Principal : Score de Rétention & Barre de Jauge */}
      <div className="bg-[#F7F3EA] dark:bg-zinc-800/50 rounded-xl p-4 border border-[#E8E2D5] dark:border-zinc-800">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-xs font-medium text-[#7A7670] dark:text-zinc-400 uppercase tracking-wider">Score de Rétention Estimé</span>
            <div className="text-3xl font-bold text-[#1B2A4A] dark:text-zinc-100 mt-0.5">
              {retentionScore}%
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#7A7670] dark:text-zinc-400">Cartes dues aujourd'hui</span>
            <div className="text-lg font-semibold text-[#C9A05C] dark:text-[#C9A05C]">
              {dueCount} / {totalCards}
            </div>
          </div>
        </div>
        
        {/* Barre de progression visuelle */}
        <div className="w-full bg-[#E8E2D5] dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#C9A05C] dark:bg-[#C9A05C] h-full rounded-full transition-all duration-500"
            style={{ width: `${retentionScore}%` }}
          />
        </div>
      </div>

      {/* Grille des Métriques Détaillées */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Consolidées */}
        <div className="p-3 bg-[#F7F3EA] dark:bg-zinc-800/50 rounded-xl border border-[#E8E2D5] dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7A7670] dark:text-zinc-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consolidées</span>
          </div>
          <span className="text-lg font-semibold text-[#1B2A4A] dark:text-zinc-100">{reviewCards}</span>
        </div>

        {/* En Apprentissage */}
        <div className="p-3 bg-[#F7F3EA] dark:bg-zinc-800/50 rounded-xl border border-[#E8E2D5] dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7A7670] dark:text-zinc-400 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>En cours</span>
          </div>
          <span className="text-lg font-semibold text-[#1B2A4A] dark:text-zinc-100">{learningCards}</span>
        </div>

        {/* Vitesse de Réponse Moyenne */}
        <div className="p-3 bg-[#F7F3EA] dark:bg-zinc-800/50 rounded-xl border border-[#E8E2D5] dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7A7670] dark:text-zinc-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Latence moy.</span>
          </div>
          <span className="text-lg font-semibold text-[#1B2A4A] dark:text-zinc-100">{avgResponseTimeSec}s</span>
        </div>

        {/* Échecs Vocaux / Phonétiques */}
        <div className="p-3 bg-[#F7F3EA] dark:bg-zinc-800/50 rounded-xl border border-[#E8E2D5] dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7A7670] dark:text-zinc-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Reprise vocale</span>
          </div>
          <span className="text-lg font-semibold text-[#1B2A4A] dark:text-zinc-100">{totalVocalFailures}</span>
        </div>
      </div>

      {/* Conseil Adaptatif Intelligent */}
      <div className="flex items-start gap-3 p-3.5 bg-[#C9A05C]/10 dark:bg-zinc-800/70 border border-[#C9A05C]/30 dark:border-zinc-700 rounded-xl">
        <Sparkles className="w-5 h-5 text-[#C9A05C] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1B2A4A] dark:text-zinc-200 space-y-1">
          <span className="font-semibold block text-[#C9A05C]">Recommandation Smart Queue :</span>
          {dueCount > 0 ? (
            <p>
              Vous avez <strong className="font-semibold text-[#1B2A4A] dark:text-zinc-100">{dueCount} cartes prioritaires</strong> triées selon votre urgence mnésique et vos échecs vocaux dans l'atelier <span className="underline">/parler</span>.
            </p>
          ) : (
            <p>
              Toutes vos révisions sont à jour ! Vos intervalles s'adaptent automatiquement à votre vitesse de réponse et à votre précision phonétique.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryHealthWidget;

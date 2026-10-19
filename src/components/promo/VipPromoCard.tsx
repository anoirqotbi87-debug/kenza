'use client';

import React, { useState } from 'react';
import { Ticket, Crown, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useAppStore } from '@/store/useAppStore';

interface VipPromoCardProps {
  user: User | null;
  isPremium: boolean;
  onToast?: (message: string) => void;
}

export default function VipPromoCard({ user, isPremium, onToast }: VipPromoCardProps) {
  const setIsPremium = useAppStore((s) => s.setIsPremium);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage('Veuillez renseigner un code promotionnel.');
      return;
    }

    if (!user || !user.id) {
      setErrorMessage('Connectez-vous à votre compte pour débloquer votre accès VIP.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: trimmedCode,
          userId: user.id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || 'Code promotionnel invalide ou expiré.');
        setIsLoading(false);
        return;
      }

      // Succès : Mise à jour immédiate du store local Zustand
      setIsPremium(true);
      const successMsg = data.message || 'Code VIP activé ! Votre accès Premium est débloqué.';
      setSuccessMessage(successMsg);
      setCode('');
      if (onToast) {
        onToast('👑 Accès VIP débloqué avec succès !');
      }
    } catch (err: unknown) {
      console.error('[VipPromoCard Error]:', err);
      setErrorMessage('Une erreur de connexion est survenue. Veuillez vérifier votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. État déjà Premium : Badge valorisant VIP
  if (isPremium) {
    return (
      <article className="data-card bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40">
        <div className="data-card-heading">
          <span className="data-icon bg-amber-500 text-white shadow-sm">
            <Crown size={18} />
          </span>
          <div>
            <span className="mini-kicker text-amber-800 font-bold">PRIVILÈGE EXCLUSIF</span>
            <h3 className="text-amber-900 flex items-center gap-2">
              <span>👑 Compte VIP Actif</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                PRO ILLIMITÉ
              </span>
            </h3>
          </div>
        </div>
        <p className="text-amber-900/90 text-sm mt-1">
          Votre compte bénéficie de l&apos;accès Premium intégral à vie : modules B1 &amp; B2 complets, pratique orale et IA illimitée, audio haute fidélité et passeport culturel certifié.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-800">
          <Sparkles size={15} className="text-amber-600" />
          <span>Accès Premium débloqué à vie sans renouvellement.</span>
        </div>
      </article>
    );
  }

  // 2. Formulaire de saisie du Code VIP
  return (
    <article className="data-card border border-amber-200/60 hover:border-amber-300/80 transition-colors">
      <div className="data-card-heading">
        <span className="data-icon bg-[#142943] text-amber-400">
          <Ticket size={18} />
        </span>
        <div>
          <span className="mini-kicker text-amber-700">ACCÈS PRIVILÈGE</span>
          <h3 className="text-[#142943]">🎟️ Code d&apos;accès VIP / Promotionnel</h3>
        </div>
      </div>

      <p className="text-slate-600 text-sm mt-1">
        Saisissez votre code pour débloquer l&apos;accès Premium sans frais.
      </p>

      {/* Bannière de Succès */}
      {successMessage && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-sm animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Bannière d'Erreur */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: VIPEIDER"
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 uppercase font-mono tracking-wider text-sm font-semibold text-[#142943] placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal transition-all outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#142943] hover:bg-[#1a3556] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Activation...</span>
              </>
            ) : (
              <span>Activer mon accès</span>
            )}
          </button>
        </div>

        {!user && (
          <p className="text-xs text-amber-700/90 flex items-center gap-1.5 mt-1">
            <AlertCircle size={13} className="shrink-0" />
            <span>Connectez-vous avant d&apos;activer votre code pour lier le compte VIP.</span>
          </p>
        )}
      </form>
    </article>
  );
}

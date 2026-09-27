import React, { useState } from 'react';
import { X, CheckCircle2, Crown, Star, BookOpen, Headphones, Award } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface PaywallModalProps {
  onClose: () => void;
  source: string;
}

export default function PaywallModal({ onClose, source }: PaywallModalProps) {
  const { setIsPremium } = useAppStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  
  const handleSubscribe = () => {
    // Dans une vraie app, rediriger vers Stripe Checkout
    alert(`Redirection Stripe (Cycle: ${billingCycle} - Origine: ${source})...`);
    setIsPremium(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-[#FDFCF8] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-white/50 backdrop-blur-md rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Colonne de Gauche : Visuel & Valeur (Inspiré du passeport) */}
        <div className="bg-[#1B2A4A] p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            {/* Pattern stylisé */}
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <pattern id="motif" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" />
                <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#motif)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A05C]/20 text-[#C9A05C] rounded-full text-sm font-bold tracking-wide mb-6">
              <Crown className="w-4 h-4" />
              KENZA PRO
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-4 leading-tight text-white">
              Débloquez votre<br />Passeport Culturel.
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Maîtrisez la Darija sans limites avec l'immersion IA complète et les modules de conversation avancés.
            </p>

            <ul className="space-y-4">
              {[
                { icon: BookOpen, text: 'Accès total aux Modules 3, 4 et 5 (Niveaux B1 & B2)' },
                { icon: Star, text: 'Roleplay IA illimité (Tous les personas & scénarios)' },
                { icon: Headphones, text: 'Synthèse Vocale (TTS) illimitée et 100% hors-ligne' },
                { icon: Award, text: 'Certificats officiels et visas du Passeport Culturel' }
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-[#C9A05C]/20 rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A05C]" />
                  </div>
                  <span className="text-slate-200">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne de Droite : Tarifs & CTA */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Choisissez votre plan</h3>
            <p className="text-slate-500">Investissez dans votre fluidité. Annulable à tout moment.</p>
          </div>

          <div className="space-y-4 mb-8 flex-grow">
            {/* Plan Annuel */}
            <label 
              className={`block relative p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                billingCycle === 'yearly' 
                  ? 'border-[#C9A05C] bg-[#C9A05C]/5 shadow-[0_0_20px_rgba(201,160,92,0.15)]' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="absolute -top-3 right-4 bg-[#C9A05C] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                -40% — Le plus populaire
              </div>
              <input 
                type="radio" 
                name="billing" 
                value="yearly" 
                checked={billingCycle === 'yearly'}
                onChange={() => setBillingCycle('yearly')}
                className="sr-only" 
              />
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800 text-lg">Annuel</div>
                  <div className="text-sm text-slate-500">Facturé 59€ / an</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl text-slate-800">4,90€</div>
                  <div className="text-xs text-slate-500">/ mois</div>
                </div>
              </div>
            </label>

            {/* Plan Mensuel */}
            <label 
              className={`block p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                billingCycle === 'monthly' 
                  ? 'border-[#C9A05C] bg-[#C9A05C]/5' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input 
                type="radio" 
                name="billing" 
                value="monthly" 
                checked={billingCycle === 'monthly'}
                onChange={() => setBillingCycle('monthly')}
                className="sr-only" 
              />
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800 text-lg">Mensuel</div>
                  <div className="text-sm text-slate-500">Sans engagement</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl text-slate-800">9,00€</div>
                  <div className="text-xs text-slate-500">/ mois</div>
                </div>
              </div>
            </label>
          </div>

          <div className="space-y-4 text-center">
            <button 
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-[#C9A05C] to-[#B8860B] hover:from-[#B8860B] hover:to-[#996515] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-[#C9A05C]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
            >
              <Crown className="w-5 h-5" />
              Débloquer Kenza Pro
            </button>
            <p className="text-xs text-slate-400">
              Paiement sécurisé. Annulable à tout moment en 1 clic depuis vos paramètres.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, CheckCircle2, Crown, Zap, BookOpen, Headphones } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
}

export default function PricingModal({ onClose }: PricingModalProps) {
  const { setSubscriptionTier } = useAppStore();

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // In real app, redirect to Stripe
    // Here we just unlock for demo
    setSubscriptionTier('premium');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full z-10 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 md:w-2/5 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 pattern-dots" />
          <div className="relative z-10">
            <Crown className="w-16 h-16 mb-4 text-amber-100 drop-shadow-lg" />
            <h2 className="text-3xl font-black mb-2 leading-tight">Passez à KENZA Pro</h2>
            <p className="text-amber-50 font-medium">Libérez tout votre potentiel d'apprentissage.</p>
          </div>
        </div>

        {/* Pricing & Features Section */}
        <div className="p-8 md:w-3/5 bg-slate-50 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">Tout ce qui est inclus :</h3>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 text-sm"><strong>Audio Pack Hors-Ligne</strong> illimité</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 text-sm">Accès à <strong>tous les scénarios Roleplay</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 text-sm">Passage des <strong>Passeports Darija</strong> officiels</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 text-sm">Moteur de <strong>Répétition Espacée</strong> complet</span>
            </li>
          </ul>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSubscribe('monthly')}
              className="bg-white border-2 border-slate-200 hover:border-amber-400 p-4 rounded-2xl text-center transition-all group"
            >
              <div className="text-sm font-bold text-slate-500 group-hover:text-amber-600">Mensuel</div>
              <div className="text-2xl font-black text-slate-800">9€<span className="text-sm font-normal text-slate-500">/mois</span></div>
            </button>
            <button 
              onClick={() => handleSubscribe('yearly')}
              className="bg-amber-50 border-2 border-amber-500 p-4 rounded-2xl text-center transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                -35%
              </div>
              <div className="text-sm font-bold text-amber-700">Annuel</div>
              <div className="text-2xl font-black text-slate-800">59€<span className="text-sm font-normal text-slate-500">/an</span></div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface DialogueSummaryModalProps {
  score: number;
  onClose: () => void;
  scenarioId: string;
}

export default function DialogueSummaryModal({ score, onClose, scenarioId }: DialogueSummaryModalProps) {
  
  React.useEffect(() => {
    trackEvent('dialogue_completed', { scenarioId, score });
  }, [scenarioId, score]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        <div className="p-8 text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800">
            Dialogue Terminé !
          </h2>
          
          <p className="text-slate-500 text-lg">
            Vous avez très bien géré cette situation. Votre prononciation s'améliore !
          </p>

          <div className="bg-amber-50 rounded-2xl p-6 flex items-center justify-center gap-4">
            <Award className="w-10 h-10 text-amber-500" />
            <div className="text-left">
              <div className="text-sm font-bold text-amber-600 uppercase tracking-wider">XP Gagnés</div>
              <div className="text-4xl font-black text-amber-500">+25</div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
          >
            Continuer <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

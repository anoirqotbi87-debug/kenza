import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Award, SkipForward, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { checkpointService } from '../../services/checkpointService'; // Assumes this exists for unlocking

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (level: 'A1' | 'A2' | 'B1') => void;
}

const PLACEMENT_QUESTIONS = [
  // Niveau A1
  {
    q: 'Comment dit-on "Bonjour, ça va ?" en Darija ?',
    options: ['Labas, bikhir ?', 'Bslama, ki dayer ?', 'Salam, labas ?', 'Choukrane bzzaf ?'],
    correct: 2,
    level: 'A1'
  },
  {
    q: 'Comment traduiriez-vous : "Bghit kas d atay 3afak" ?',
    options: ['Je bois du café s\'il te plaît', 'Je veux un verre de thé s\'il te plaît', 'Apporte-moi de l\'eau', 'Le thé est chaud'],
    correct: 1,
    level: 'A1'
  },
  // Niveau A2
  {
    q: 'Choisissez la bonne traduction pour : "C\'est mon ami" (à propos d\'un homme).',
    options: ['Hada sahbi', 'Hadi sahebti', 'Hada diali', 'Hada khouya'],
    correct: 0,
    level: 'A2'
  },
  {
    q: 'Au marché, pour négocier le prix, vous dites :',
    options: ['Fin kayn l-banka ?', 'Bchhal hada ? Naqas chwiya.', 'Zidni chwiya 3afak.', 'Ma-bghit-ch.'],
    correct: 1,
    level: 'A2'
  },
  // Niveau B1
  {
    q: 'Quelle phrase exprime une action passée ("Hier, je suis allé à Fès") ?',
    options: ['L-bareh mchit l Fès.', 'Ghedda gha-nmchi l Fès.', 'Daba ka-nmchi l Fès.', 'L-bareh mcha l Fès.'],
    correct: 0,
    level: 'B1'
  },
  {
    q: 'Quelle phrase exprime une habitude ("Chaque matin, je bois du café") ?',
    options: ['Koll sba7 gha-nchreb qahwa.', 'Koll sba7 chrebt qahwa.', 'Koll sba7 ka-nchreb qahwa.', 'Koll sba7 bghit qahwa.'],
    correct: 2,
    level: 'B1'
  },
  {
    q: 'Comment dire "Je n\'ai pas compris" ?',
    options: ['Ma-fhemt-ch.', 'Ma-bghit-ch.', 'Ma-3reft-ch.', 'Ma-mchit-ch.'],
    correct: 0,
    level: 'B1'
  },
  {
    q: 'Pour exprimer une obligation ("Nous devons partir maintenant") :',
    options: ['Khasna nemchiw daba.', 'Bghina nemchiw daba.', 'Gha-nemchiw daba.', 'Ymken nemchiw daba.'],
    correct: 0,
    level: 'B1'
  }
];

export default function PlacementTestModal({ isOpen, onClose, onComplete }: PlacementTestModalProps) {
  const { addXp, completeLesson, user } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    const isCorrect = index === PLACEMENT_QUESTIONS[currentQ].correct;
    
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQ < PLACEMENT_QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
      } else {
        finishTest(score + (isCorrect ? 1 : 0));
      }
    }, 400); // Short delay for visual feedback
  };

  const finishTest = async (finalScore: number) => {
    setShowResult(true);
    let level: 'A1' | 'A2' | 'B1' = 'A1';
    
    if (finalScore >= 6) {
      level = 'B1';
    } else if (finalScore >= 3) {
      level = 'A2';
    }

    // Apply rewards
    if (level === 'A2') {
      addXp(150);
      // Validate Checkpoint A1 (mock)
      if (user?.id) {
        await checkpointService.syncResultToCloud(user.id, {
          levelId: 'A1',
          levelName: 'Fondations',
          score: 90,
          passed: true,
          date: new Date().toISOString(),
          passportId: 'FES-A1-AUTO'
        });
      }
    } else if (level === 'B1') {
      addXp(350);
      if (user?.id) {
        await checkpointService.syncResultToCloud(user.id, {
          levelId: 'A1',
          levelName: 'Fondations',
          score: 100,
          passed: true,
          date: new Date().toISOString(),
          passportId: 'FES-A1-AUTO'
        });
        await checkpointService.syncResultToCloud(user.id, {
          levelId: 'A2',
          levelName: 'Essentiel',
          score: 90,
          passed: true,
          date: new Date().toISOString(),
          passportId: 'RAK-A2-AUTO'
        });
      }
    }
    
    if (onComplete) onComplete(level);
  };

  const handleClose = () => {
    // Reset state and close
    setTimeout(() => {
      setCurrentQ(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
    }, 300);
    onClose();
  };

  let levelAssigned = 'Débutant (A1)';
  let recommendation = 'Commencer au Module 1';
  let levelColor = 'bg-slate-100 text-slate-800';
  let badgeIcon = Award;

  if (score >= 6) {
    levelAssigned = 'Intermédiaire (B1)';
    recommendation = 'Commencer au Module 4';
    levelColor = 'bg-blue-100 text-blue-800';
  } else if (score >= 3) {
    levelAssigned = 'Élémentaire (A2)';
    recommendation = 'Commencer au Module 3';
    levelColor = 'bg-emerald-100 text-emerald-800';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 relative">
        
        {!showResult && (
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Progress */}
        {!showResult && (
          <div className="flex h-1.5 bg-slate-100">
            <div className="bg-blue-500 transition-all duration-300" style={{ width: `${((currentQ) / PLACEMENT_QUESTIONS.length) * 100}%` }} />
          </div>
        )}

        <div className="p-6 md:p-8 flex-1">
          
          {!showResult ? (
            <div className="space-y-6">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  Question {currentQ + 1} / {PLACEMENT_QUESTIONS.length}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  {PLACEMENT_QUESTIONS[currentQ].q}
                </h3>
              </div>
              
              <div className="space-y-3">
                {PLACEMENT_QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                      selectedOption === i 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => finishTest(score)}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-slate-600 font-medium transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Passer et commencer à zéro
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${levelColor}`}>
                <Award className="w-10 h-10" />
              </div>
              
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Test terminé !</h2>
                <p className="text-slate-500">
                  Vous avez obtenu un score de <strong className="text-slate-800">{score} / {PLACEMENT_QUESTIONS.length}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Niveau attribué</p>
                <p className="text-xl font-bold text-slate-800">{levelAssigned}</p>
                {score >= 3 && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    +{score >= 6 ? '350' : '150'} XP et visas débloqués !
                  </p>
                )}
              </div>

              <button 
                onClick={handleClose}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-colors mt-8"
              >
                {recommendation} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

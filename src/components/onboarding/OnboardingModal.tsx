import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Compass, Briefcase, Heart, Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const GOALS = [
  { id: 'travel', title: 'Voyage & Découverte', desc: 'Souk, taxi, politesse', icon: Compass, color: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 'expat', title: 'Installation & Expatriation', desc: 'Administratif, logement', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'family', title: 'Famille & Conjoint', desc: 'Vocabulaire chaleureux', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-100' },
];

const TEMPOS = [
  { id: 5, title: 'Tranquille', desc: '5 min / jour', icon: Clock },
  { id: 10, title: 'Régulier', desc: '10 min / jour', icon: CheckCircle2 },
  { id: 15, title: 'Intensif', desc: '15 min / jour', icon: Zap },
];

export default function OnboardingModal() {
  const { completeOnboarding, completeLesson } = useAppStore();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);

  // Mini quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    { q: 'Comment dit-on "Bonjour" ?', options: ['Salam', 'Bslama', 'Chokran'], correct: 0 },
    { q: 'Comment dit-on "Non" ?', options: ['Wakha', 'Iyeh', 'La'], correct: 2 },
    { q: 'Combien font Wahd + Jouj ?', options: ['Tleta', 'Rba3a', 'Khamsa'], correct: 0 },
  ];

  const handleGoalSelect = (gId: string) => {
    setGoal(gId);
    setTimeout(() => setStep(2), 300);
  };

  const handleTempoSelect = (tId: number) => {
    setTempo(tId);
    setTimeout(() => setStep(3), 300);
  };

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setQuizScore(s => s + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      // Finished
      setStep(4);
    }
  };

  const handleFinish = () => {
    if (goal && tempo) {
      if (quizScore >= 2) {
        // Unlock Module 1 (module1_lesson1, module1_lesson2...)
        completeLesson('module1_lesson1');
        completeLesson('module1_lesson2');
        completeLesson('module1_lesson3');
        // Checkpoint might still be locked but module 2 will be accessible if we check for it.
        // Simplified: just mark as onboarded.
      }
      completeOnboarding(goal, tempo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="flex h-2 bg-slate-100">
          <div className="bg-blue-600 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Bienvenue sur KENZA 👋</h2>
                <p className="text-slate-500">Quel est votre objectif principal avec la Darija ?</p>
              </div>
              <div className="space-y-3">
                {GOALS.map(g => (
                  <button 
                    key={g.id}
                    onClick={() => handleGoalSelect(g.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
                      ${goal === g.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-full ${g.bg} ${g.color} flex items-center justify-center shrink-0`}>
                      <g.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{g.title}</h3>
                      <p className="text-sm text-slate-500">{g.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Votre rythme idéal ⏱️</h2>
                <p className="text-slate-500">Combien de temps souhaitez-vous y consacrer par jour ?</p>
              </div>
              <div className="space-y-3">
                {TEMPOS.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => handleTempoSelect(t.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
                      ${tempo === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0`}>
                      <t.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{t.title}</h3>
                      <p className="text-sm text-slate-500">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Test de niveau rapide 🧠</h2>
                <p className="text-slate-500">Voyons ce que vous savez déjà...</p>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                <h3 className="text-lg font-bold text-slate-800 mb-6">{questions[currentQuestion].q}</h3>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full py-3 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center animate-in zoom-in">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">
                Profil configuré !
              </h2>
              <p className="text-slate-500 text-lg">
                Vous avez eu {quizScore} / 3 au test.<br/>
                {quizScore >= 2 
                  ? "Bravo ! Vous semblez avoir les bases. Vous pourrez commencer direct au Module 2." 
                  : "Parfait ! Nous allons commencer par les fondations doucement."}
              </p>
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-colors mt-8"
              >
                Commencer l'aventure <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

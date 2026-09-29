import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import PlacementTestModal from './PlacementTestModal';
import { Compass, Briefcase, Heart, Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const OB_STR = {
  fr: { welcome: "Bienvenue sur KENZA 👋", goalQuestion: "Quel est votre objectif principal avec la Darija ?",
    goals: { travel: { title: "Voyage & Découverte", desc: "Souk, taxi, politesse" }, expat: { title: "Installation & Expatriation", desc: "Administratif, logement" }, family: { title: "Famille & Conjoint", desc: "Vocabulaire chaleureux" } },
    tempoTitle: "Votre rythme idéal ⏱️", tempoQuestion: "Combien de temps souhaitez-vous y consacrer par jour ?",
    tempos: { 5: { title: "Tranquille", desc: "5 min / jour" }, 10: { title: "Régulier", desc: "10 min / jour" }, 15: { title: "Intensif", desc: "15 min / jour" } },
    levelQuestion: "Quel est votre niveau ? 🇲🇦", levelHint: "Pour vous proposer le meilleur point de départ.",
    beginner: "Je débute complètement", beginnerHint: "Commencer depuis le Module 1",
    notions: "J'ai déjà des notions", notionsHint: "Test rapide de 2 min pour sauter des niveaux",
    done: "Profil configuré !", youScored: "Vous avez eu",
    bravo: "Bravo ! Vous semblez avoir les bases. Vous pourrez commencer direct au Module 2.",
    parfait: "Parfait ! Nous allons commencer par les fondations doucement.", start: "Commencer l'aventure" },
  en: { welcome: "Welcome to KENZA 👋", goalQuestion: "What is your main goal with Darija?",
    goals: { travel: { title: "Travel & Discovery", desc: "Souk, taxi, politeness" }, expat: { title: "Moving & Expat Life", desc: "Admin, housing" }, family: { title: "Family & Partner", desc: "Warm vocabulary" } },
    tempoTitle: "Your ideal pace ⏱️", tempoQuestion: "How much time do you want to spend per day?",
    tempos: { 5: { title: "Relaxed", desc: "5 min / day" }, 10: { title: "Regular", desc: "10 min / day" }, 15: { title: "Intensive", desc: "15 min / day" } },
    levelQuestion: "What's your level? 🇲🇦", levelHint: "So we can suggest the best starting point.",
    beginner: "I'm a complete beginner", beginnerHint: "Start from Module 1",
    notions: "I already know some", notionsHint: "Quick 2-min test to skip levels",
    done: "Profile set up!", youScored: "You scored",
    bravo: "Great! You seem to have the basics. You can start directly at Module 2.",
    parfait: "Perfect! We'll start gently with the foundations.", start: "Start the adventure" },
  es: { welcome: "¡Bienvenido a KENZA 👋!", goalQuestion: "¿Cuál es tu principal objetivo con la Darija?",
    goals: { travel: { title: "Viaje y Descubrimiento", desc: "Souk, taxi, cortesía" }, expat: { title: "Instalación y Expatriación", desc: "Trámites, vivienda" }, family: { title: "Familia y Pareja", desc: "Vocabulario cercano" } },
    tempoTitle: "Tu ritmo ideal ⏱️", tempoQuestion: "¿Cuánto tiempo quieres dedicarle al día?",
    tempos: { 5: { title: "Tranquilo", desc: "5 min / día" }, 10: { title: "Constante", desc: "10 min / día" }, 15: { title: "Intensivo", desc: "15 min / día" } },
    levelQuestion: "¿Cuál es tu nivel? 🇲🇦", levelHint: "Para ofrecerte el mejor punto de partida.",
    beginner: "Empiezo de cero", beginnerHint: "Comenzar desde el Módulo 1",
    notions: "Ya tengo nociones", notionsHint: "Test rápido de 2 min para saltar niveles",
    done: "¡Perfil configurado!", youScored: "Has obtenido",
    bravo: "¡Bravo! Parece que tienes las bases. Podrás empezar directamente en el Módulo 2.",
    parfait: "¡Perfecto! Empezaremos poco a poco por los fundamentos.", start: "Empezar la aventura" },
  ar: { welcome: "مرحبا بك في كينزا 👋", goalQuestion: "ما هدفك الأساسي مع الدارجة؟",
    goals: { travel: { title: "سفر واستكشاف", desc: "سوق، طاكسي، أدب" }, expat: { title: "الاستقرار والهجرة", desc: "إدارة، سكن" }, family: { title: "العائلة والشريك", desc: "مفردات دافئة" } },
    tempoTitle: "إيقاعك المثالي ⏱️", tempoQuestion: "كم من الوقت تريد أن تخصص يومياً؟",
    tempos: { 5: { title: "هادئ", desc: "5 دقائق / يوم" }, 10: { title: "منتظم", desc: "10 دقائق / يوم" }, 15: { title: "مكثف", desc: "15 دقيقة / يوم" } },
    levelQuestion: "ما مستواك؟ 🇲🇦", levelHint: "لنقترح عليك أفضل نقطة انطلاق.",
    beginner: "أبدأ من الصفر", beginnerHint: "ابدأ من الوحدة 1",
    notions: "لدي بعض المفاهيم", notionsHint: "اختبار سريع لدقيقتين لتجاوز مستويات",
    done: "تم إعداد حسابك!", youScored: "حصلت على",
    bravo: "أحسنت! يبدو أنك تملك الأساسيات. يمكنك البدء مباشرة بالوحدة 2.",
    parfait: "ممتاز! سنبدأ بهدوء من الأساسيات.", start: "ابدأ المغامرة" }
};
function obS(lang: string) {
  const k = (lang === 'en' || lang === 'es' || lang === 'ar') ? lang : 'fr';
  return (OB_STR as Record<string, typeof OB_STR.fr>)[k];
}

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
  const { uiLanguage } = useAppStore();
  const S = obS(String(uiLanguage || 'fr').toLowerCase());
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);

  const [quizScore, setQuizScore] = useState(0);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  

  

  const handleGoalSelect = (gId: string) => {
    setGoal(gId);
    setTimeout(() => setStep(2), 300);
  };

  const handleTempoSelect = (tId: number) => {
    setTempo(tId);
    setTimeout(() => setStep(3), 300);
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
                <h2 className="text-2xl font-black text-slate-800 mb-2">{S.welcome}</h2>
                <p className="text-slate-500">{S.goalQuestion}</p>
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
                      <h3 className="font-bold text-slate-800">{(S.goals as Record<string, { title: string; desc: string }>)[g.id]?.title || g.title}</h3>
                      <p className="text-sm text-slate-500">{(S.goals as Record<string, { title: string; desc: string }>)[g.id]?.desc || g.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">{S.tempoTitle}</h2>
                <p className="text-slate-500">{S.tempoQuestion}</p>
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
                      <h3 className="font-bold text-slate-800">{(S.tempos as Record<number, { title: string; desc: string }>)[t.id]?.title || t.title}</h3>
                      <p className="text-sm text-slate-500">{(S.tempos as Record<number, { title: string; desc: string }>)[t.id]?.desc || t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-2">{S.levelQuestion}</h2>
                <p className="text-slate-500">{S.levelHint}</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setQuizScore(0);
                    setStep(4);
                  }}
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="text-emerald-600 mb-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      {S.beginner}
                    </div>
                    <div className="text-sm font-normal text-slate-500">{S.beginnerHint}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </button>

                <button
                  onClick={() => setIsPlacementTestOpen(true)}
                  className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="text-blue-600 mb-1 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {S.notions}
                    </div>
                    <div className="text-sm font-normal text-slate-500">{S.notionsHint}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center animate-in zoom-in">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">
                {S.done}
              </h2>
              <p className="text-slate-500 text-lg">
                {S.youScored} {quizScore} / 3.<br/>
                {quizScore >= 2 
                  ? S.bravo 
                  : S.parfait}
              </p>
              <button 
                onClick={handleFinish}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-colors mt-8"
              >
                {S.start} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>

      <PlacementTestModal 
        isOpen={isPlacementTestOpen} 
        onClose={() => setIsPlacementTestOpen(false)} 
        onComplete={(lvl) => {
          setIsPlacementTestOpen(false);
          setQuizScore(lvl === 'B1' ? 3 : lvl === 'A2' ? 2 : 0);
          setStep(4);
        }} 
      />
    </div>
  );
}

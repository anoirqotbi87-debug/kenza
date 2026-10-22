'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Compass,
  Heart,
  Plane,
  Sparkles,
  GraduationCap,
  Award,
  RotateCcw,
  Rocket,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { useDialog } from '../../hooks/useDialog';

interface OnboardingModalProps {
  onComplete: () => void;
  onSelectIntermediate?: () => void;
}

export default function OnboardingModal({
  onComplete,
  onSelectIntermediate,
}: OnboardingModalProps) {
  const { dialogRef } = useDialog(true, () => {});
  const { t } = useTranslation();
  const onb = t.onboarding;

  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as 'fr' | 'en' | 'es' | 'ar';
  const isRtl = langKey === 'ar';

  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setCompletedModules = useAppStore((s) => s.setCompletedModules);
  const addXp = useAppStore((s) => s.addXp);

  // Étape du flux :
  // 0 : Objectif d'apprentissage
  // 1 : Rythme quotidien (minutes)
  // 2 : Choix du profil (Grand débutant VS J'ai des bases)
  // 3 : Quiz Q1 (Kidayr / Kidayra)
  // 4 : Quiz Q2 (S'il vous plaît / 3afak)
  // 5 : Quiz Q3 (Bghit nchrob atay)
  // 6 : Écran de résultat et recommandation personnalisée
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  // Réponses au quiz (questionIndex -> optionIndex)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const goals = [
    { id: 'travel', label: onb.goal1, icon: Plane },
    { id: 'family', label: onb.goal2, icon: Heart },
    { id: 'work', label: onb.goal3, icon: Compass },
    { id: 'culture', label: onb.goal4, icon: Sparkles },
  ];
  const durations = [5, 10, 20];

  const content = {
    fr: {
      kicker: 'PERSONNALISATION DU PARCOURS',
      title: 'Bienvenue ! Créons ton plan',
      skip: 'Passer',
      stepIndicator: 'Étape {current} sur {total}',
      levelQuestion: 'Quel est ton niveau actuel en Darija ?',
      levelDesc: 'Nous adapterons le début de ton parcours pour un apprentissage sur mesure.',
      levelBeginnerTitle: 'Grand débutant : je pars de zéro',
      levelBeginnerDesc: 'Apprends les salutations, l’alphabet, les sons arabes et les mots essentiels du quotidien.',
      levelBasicsTitle: 'J’ai déjà quelques bases',
      levelBasicsDesc: 'Évalue ton niveau en 3 questions rapides (1 minute) pour démarrer au bon endroit.',
      quizTitle: 'Mini-Quiz Express',
      quizSubtitle: 'Question {current} / 3',
      resultTitle: 'Recommandation personnalisée',
      resultScore: 'Ton score : {score} / 3',
      resultLowDesc: 'Nous te recommandons de démarrer par le Module 1 (Les Fondations) pour maîtriser les sons arabes essentiels (7, 3, 9, kh) et les bases.',
      resultHighDesc: 'Bravo ! Tu as déjà de bonnes bases en Darija.',
      btnStartMod1: 'Démarrer au Module 1 (Les Fondations)',
      btnStartMod3: '🚀 Commencer au Niveau Intermédiaire (Module 3)',
      btnRestartMod1: '🔄 Recommencer depuis le début (Module 1)',
      q1: 'Que signifie « Kidayr / Kidayra » ?',
      q1_opts: ['Comment vas-tu ?', 'Combien ça coûte ?', 'Où vas-tu ?'],
      q2: 'Comment dit-on « S’il vous plaît » en Darija ?',
      q2_opts: ['Choukran', '3afak', 'Bslama'],
      q3: 'Que signifie « Bghit nchrob atay » ?',
      q3_opts: ['Je veux boire du thé', 'Je cherche un taxi', 'L’addition s’il vous plaît'],
    },
    en: {
      kicker: 'LEARNING PATH PERSONALIZATION',
      title: 'Welcome! Let’s build your plan',
      skip: 'Skip',
      stepIndicator: 'Step {current} of {total}',
      levelQuestion: 'What is your current Darija level?',
      levelDesc: 'We will tailor your starting point for optimal learning.',
      levelBeginnerTitle: 'Absolute beginner: starting from zero',
      levelBeginnerDesc: 'Learn greetings, the Arabic sounds, and essential daily vocabulary.',
      levelBasicsTitle: 'I already have some basics',
      levelBasicsDesc: 'Test your level in 3 quick questions (1 minute) to jump in at the right spot.',
      quizTitle: 'Express Level Quiz',
      quizSubtitle: 'Question {current} / 3',
      resultTitle: 'Personalized Recommendation',
      resultScore: 'Your score: {score} / 3',
      resultLowDesc: 'We recommend starting with Module 1 (Foundations) to master essential Arabic sounds (7, 3, 9, kh) and core vocabulary.',
      resultHighDesc: 'Well done! You already have solid basics in Darija. You can start directly at Module 3 or review foundations from the start.',
      btnStartMod1: 'Start at Module 1 (Foundations)',
      btnStartMod3: '🚀 Start at Intermediate Level (Module 3)',
      btnRestartMod1: '🔄 Start from the beginning (Module 1)',
      q1: 'What does “Kidayr / Kidayra” mean?',
      q1_opts: ['How are you?', 'How much is it?', 'Where are you going?'],
      q2: 'How do you say “Please” in Darija?',
      q2_opts: ['Choukran', '3afak', 'Bslama'],
      q3: 'What does “Bghit nchrob atay” mean?',
      q3_opts: ['I want to drink tea', 'I’m looking for a taxi', 'The bill please'],
    },
    es: {
      kicker: 'PERSONALIZACIÓN DE LA RUTA',
      title: '¡Bienvenido! Diseñemos tu plan',
      skip: 'Saltar',
      stepIndicator: 'Paso {current} de {total}',
      levelQuestion: '¿Cuál es tu nivel actual en Darija?',
      levelDesc: 'Adaptaremos tu inicio para un aprendizaje hecho a medida.',
      levelBeginnerTitle: 'Principiante absoluto: empiezo de cero',
      levelBeginnerDesc: 'Aprende saludos, sonidos árabes y vocabulario diario esencial.',
      levelBasicsTitle: 'Ya tengo algunas bases',
      levelBasicsDesc: 'Evalúa tu nivel en 3 preguntas rápidas (1 minuto) para comenzar en el punto ideal.',
      quizTitle: 'Mini-Quiz Express',
      quizSubtitle: 'Pregunta {current} / 3',
      resultTitle: 'Recomendación personalizada',
      resultScore: 'Tu puntuación: {score} / 3',
      resultLowDesc: 'Te recomendamos comenzar por el Módulo 1 (Fundamentos) para dominar los sonidos árabes esenciales (7, 3, 9, kh) y las bases.',
      resultHighDesc: '¡Enhorabuena! Tienes buenas bases en Darija. Puedes empezar directamente en el Módulo 3 o repasar las bases desde el principio.',
      btnStartMod1: 'Comenzar en el Módulo 1 (Fundamentos)',
      btnStartMod3: '🚀 Comenzar en Nivel Intermedio (Módulo 3)',
      btnRestartMod1: '🔄 Empezar desde el principio (Módulo 1)',
      q1: '¿Qué significa «Kidayr / Kidayra»?',
      q1_opts: ['¿Cómo estás?', '¿Cuánto cuesta?', '¿A dónde vas?'],
      q2: '¿Cómo se dice «Por favor» en Darija?',
      q2_opts: ['Choukran', '3afak', 'Bslama'],
      q3: '¿Qué significa «Bghit nchrob atay»?',
      q3_opts: ['Quiero beber té', 'Busco un taxi', 'La cuenta, por favor'],
    },
    ar: {
      kicker: 'تخصيص المسار التعليمي',
      title: 'مرحباً بك! لنصمم خطتك معاً',
      skip: 'تخطي',
      stepIndicator: 'الخطوة {current} من {total}',
      levelQuestion: 'ما هو مستواك الحالي في الدارجة المغربية؟',
      levelDesc: 'سنحدد نقطة انطلاقك المناسبة لتحقيق أفضل استفادة ممكنة.',
      levelBeginnerTitle: 'مبتدئ تماماً: أبدأ من الصفر',
      levelBeginnerDesc: 'تعلّم التحيات ومخارج الحروف والكلمات الأساسية في الحياة اليومية.',
      levelBasicsTitle: 'لديّ بعض المعرفة الأساسية',
      levelBasicsDesc: 'اختبر مستواك عبر 3 أسئلة سريعة (دقيقة واحدة) للبدء في المستوى المناسب.',
      quizTitle: 'اختبار المستوى السريع',
      quizSubtitle: 'السؤال {current} / 3',
      resultTitle: 'توصية مخصصة لمسارك',
      resultScore: 'نتيجتك: {score} / 3',
      resultLowDesc: 'ننصحك بالبدء من الوحدة 1 (الأساسيات) لإتقان مخارج الحروف الخاصة (7، 3، 9، خ) وبناء قاعدة لغوية متينة.',
      resultHighDesc: 'أحسنت! لديك بالفعل معرفة جيدة بالدارجة. يمكنك الانتقال مباشرة للوحدة 3 أو البدء من البداية للمراجعة.',
      btnStartMod1: 'البدء من الوحدة 1 (الأساسيات)',
      btnStartMod3: '🚀 البدء من المستوى المتوسط (الوحدة 3)',
      btnRestartMod1: '🔄 البدء من البداية (الوحدة 1)',
      q1: 'ما معنى «كيداير / كيدايرة» (Kidayr / Kidayra)؟',
      q1_opts: ['كيف حالك؟', 'كم ثمن هذا؟', 'إلى أين أنت ذاهب؟'],
      q2: 'كيف نقول «من فضلك» بالدارجة المغربية؟',
      q2_opts: ['شكراً (Choukran)', 'عفاك (3afak)', 'بسلامة (Bslama)'],
      q3: 'ما معنى «بغيت نشرب أتاي» (Bghit nchrob atay)؟',
      q3_opts: ['أريد شرب الشاي', 'أبحث عن تاكسي', 'الحساب من فضلك'],
    },
  }[langKey];

  const quizQuestions = [
    {
      question: content.q1,
      options: content.q1_opts,
      correctIndex: 0,
    },
    {
      question: content.q2,
      options: content.q2_opts,
      correctIndex: 1,
    },
    {
      question: content.q3,
      options: content.q3_opts,
      correctIndex: 0,
    },
  ];

  // Calcul du score final du quiz
  const calculateFinalScore = (lastAnswerIndex?: number) => {
    let score = 0;
    const finalAnswers: Record<number, number> = { ...quizAnswers };
    if (lastAnswerIndex !== undefined) {
      finalAnswers[2] = lastAnswerIndex;
    }
    quizQuestions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleFinishBeginner = () => {
    completeOnboarding(goal ?? 'travel', minutes ?? 10);
    try {
      localStorage.setItem('kenza_plan_completed', 'true');
      localStorage.setItem('kenza_active_tab', 'today');
    } catch {}
    onComplete();
  };

  const handleFinishIntermediate = () => {
    // Débloque et marque les modules 1 et 2 comme complétés
    setCompletedModules(['1', '2']);
    addXp(60);
    completeOnboarding(goal ?? 'travel', minutes ?? 10);

    try {
      localStorage.setItem('kenza_plan_completed', 'true');
      localStorage.setItem('kenza_active_tab', 'path');
    } catch {}

    if (onSelectIntermediate) {
      onSelectIntermediate();
    }
    onComplete();
  };

  const handleQuizAnswer = (qIndex: number, optIndex: number) => {
    setSelectedOption(optIndex);
    const updatedAnswers = { ...quizAnswers, [qIndex]: optIndex };
    setQuizAnswers(updatedAnswers);

    // Défilement automatique fluide vers la question suivante ou le résultat
    window.setTimeout(() => {
      setSelectedOption(null);
      if (qIndex < 2) {
        setStep((qIndex + 4) as 4 | 5);
      } else {
        setStep(6);
      }
    }, 380);
  };

  const handleSkip = () => {
    handleFinishBeginner();
  };

  const currentScore = calculateFinalScore();

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[110] bg-[#142943]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
    >
      <div
        ref={dialogRef}
        className="bg-[#FDFCF8] rounded-3xl w-full max-w-lg shadow-2xl border border-[#E8E2D5] p-6 sm:p-8 my-auto relative text-[#142943]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        tabIndex={-1}
      >
        {/* Bouton Passer (Skip) en haut à droite */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D5]/70">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A05C]">
            — {content.kicker}
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-500 hover:text-[#142943] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {content.skip}
          </button>
        </div>

        {/* ÉTAPE 0 : OBJECTIF D'APPRENTISSAGE */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 id="onboarding-modal-title" className="font-display text-2xl sm:text-3xl text-[#142943] leading-snug">
              {content.title}
            </h2>
            <p className="text-xs text-[#7A7670]">
              {content.stepIndicator.replace('{current}', '1').replace('{total}', '3')}
            </p>

            <h3 className="font-display text-base sm:text-lg text-[#142943] pt-1">
              {onb.goalQuestion}
            </h3>

            <div className="space-y-2.5">
              {goals.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setGoal(id);
                    setStep(1);
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    goal === id
                      ? 'bg-[#C9A05C]/15 border-2 border-[#C9A05C]'
                      : 'bg-[#F7F3EA]/70 border-[#E8E2D5] hover:border-[#C9A05C]/60 hover:bg-[#F7F3EA]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 text-[#C9A05C]">
                    <Icon size={17} />
                  </div>
                  <span className="text-sm font-semibold text-[#142943]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 1 : RYTHME QUOTIDIEN */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                aria-label="Retour"
              >
                {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              </button>
              <h2 id="onboarding-modal-title" className="font-display text-2xl sm:text-3xl text-[#142943]">
                {content.title}
              </h2>
            </div>
            <p className="text-xs text-[#7A7670]">
              {content.stepIndicator.replace('{current}', '2').replace('{total}', '3')}
            </p>

            <h3 className="font-display text-base sm:text-lg text-[#142943] pt-1">
              {onb.timeQuestion}
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {durations.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setMinutes(value);
                    setStep(2);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all ${
                    minutes === value
                      ? 'bg-[#C9A05C]/15 border-2 border-[#C9A05C]'
                      : 'bg-[#F7F3EA]/70 border-[#E8E2D5] hover:border-[#C9A05C]/60 hover:bg-[#F7F3EA]'
                  }`}
                >
                  <Clock size={18} className="text-[#C9A05C]" />
                  <span className="font-display text-2xl text-[#142943] font-bold">{value}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A7670]">min / jour</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : DIAGNOSTIC DE NIVEAU */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                aria-label="Retour"
              >
                {isRtl ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              </button>
              <h2 id="onboarding-modal-title" className="font-display text-2xl sm:text-3xl text-[#142943]">
                {content.levelQuestion}
              </h2>
            </div>
            <p className="text-xs text-[#7A7670] leading-relaxed">
              {content.levelDesc}
            </p>

            <div className="space-y-3 pt-2">
              {/* Option 1 : Grand débutant */}
              <button
                type="button"
                onClick={handleFinishBeginner}
                className="w-full text-left p-4 rounded-2xl border-2 border-[#E8E2D5] bg-[#F7F3EA]/70 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-[#142943] group-hover:text-emerald-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    {content.levelBeginnerTitle}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600 pl-4.5">
                  {content.levelBeginnerDesc}
                </p>
              </button>

              {/* Option 2 : J'ai déjà des bases (Mini-Quiz) */}
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full text-left p-4 rounded-2xl border-2 border-[#E8E2D5] bg-[#F7F3EA]/70 hover:border-amber-500 hover:bg-amber-50/50 transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-[#142943] group-hover:text-amber-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    {content.levelBasicsTitle}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600 pl-4.5">
                  {content.levelBasicsDesc}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPES 3, 4, 5 : MINI-QUIZ EXPRESS (3 QUESTIONS) */}
        {(step === 3 || step === 4 || step === 5) && (
          <div className="space-y-4">
            {/* Header du Quiz */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  <GraduationCap size={16} />
                </div>
                <span className="font-display text-lg sm:text-xl font-bold text-[#142943]">
                  {content.quizTitle}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full">
                {content.quizSubtitle.replace('{current}', String(step - 2))}
              </span>
            </div>

            {/* Stepper Dots du quiz */}
            <div className="flex items-center gap-1.5 py-1">
              {[0, 1, 2].map((qIdx) => (
                <div
                  key={qIdx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    qIdx === step - 3 ? 'w-8 bg-[#142943]' : qIdx < step - 3 ? 'w-4 bg-emerald-500' : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Question active */}
            <div className="p-4 rounded-2xl bg-[#142943] text-white shadow-md my-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                Question {step - 2} / 3
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold mt-1 text-white leading-snug">
                {quizQuestions[step - 3].question}
              </h3>
            </div>

            {/* Options de réponse */}
            <div className="space-y-2.5 pt-1">
              {quizQuestions[step - 3].options.map((optText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === quizQuestions[step - 3].correctIndex;

                let btnStyle = 'bg-[#F7F3EA]/70 border-[#E8E2D5] text-[#142943] hover:border-[#142943]';
                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-bold'
                    : 'bg-rose-100 border-2 border-rose-500 text-rose-950 font-bold';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleQuizAnswer(step - 3, optIdx)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all ${btnStyle}`}
                  >
                    <span className="text-sm font-medium">{optText}</span>
                    {isSelected && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-600" />
                        ) : (
                          <XCircle size={18} className="text-rose-600" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : ÉCRAN DE RÉSULTAT & RECOMMANDATION */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                currentScore >= 2 ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}>
                {currentScore >= 2 ? <Award size={24} /> : <Compass size={24} />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                  {content.resultTitle}
                </span>
                <h2 id="onboarding-modal-title" className="font-display text-xl sm:text-2xl font-bold text-[#142943]">
                  {content.resultScore.replace('{score}', String(currentScore))}
                </h2>
              </div>
            </div>

            {/* Message personnalisé */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {currentScore >= 2 ? content.resultHighDesc : content.resultLowDesc}
            </div>

            {/* Boutons d'action selon le score */}
            <div className="space-y-2.5 pt-2">
              {currentScore >= 2 ? (
                <>
                  <button
                    type="button"
                    onClick={handleFinishIntermediate}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#142943] hover:bg-[#1e3c63] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Rocket size={17} className="text-amber-300" />
                    <span>{content.btnStartMod3}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishBeginner}
                    className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} />
                    <span>{content.btnRestartMod1}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishBeginner}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#142943] hover:bg-[#1e3c63] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check size={16} className="text-emerald-300" />
                  <span>{content.btnStartMod1}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

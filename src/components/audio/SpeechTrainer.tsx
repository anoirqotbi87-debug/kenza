'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Trophy, AlertCircle, RefreshCw, MessageSquare, CarFront, Coffee, ShoppingBag, Globe, ArrowRight, Turtle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { playAudio } from '../../lib/audio';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { calculateSimilarity } from '../../utils/phonemeMatcher';
import type { VoiceEvaluationResult } from '../../utils/phonemeMatcher';
import VoiceFeedbackCard from '../voice/VoiceFeedbackCard';
import { trackEvent } from '../../utils/analytics';

// ---------------------------
// DONNÉES : MODE ÉLOCUTION
// ---------------------------
const speechExercises = [
  { id: '1', arabizi: 'Sba7 l-khir', arabic: 'صْبَاحْ الخِيرْ', translation: { fr: 'Bonjour', en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' } },
  { id: '2', arabizi: 'Fin ghadi a khoya', arabic: 'فِينْ غَادِي ا خُويَا', translation: { fr: 'Où vas-tu mon frère ?', en: 'Where are you going brother?', es: '¿A dónde vas hermano?', ar: 'إلى أين أنت ذاهب يا أخي؟' } },
  { id: '3', arabizi: 'Bch7al hada 3afak', arabic: 'بْشْحَالْ هَادَا عَفَاكْ', translation: { fr: 'Combien ça coûte s\'il vous plaît ?', en: 'How much is this please?', es: '¿Cuánto cuesta esto por favor?', ar: 'بكم هذا من فضلك؟' } },
  { id: '4', arabizi: 'Bghit atay b n3na3', arabic: 'بْغِيتْ أَتَايْ بْ نْنَعْنَاعْ', translation: { fr: 'Je voudrais un thé à la menthe', en: 'I would like mint tea', es: 'Quisiera un té con menta', ar: 'أريد شاي بالنعناع' } },
];

// ---------------------------
// DONNÉES : MODE ROLEPLAY
// ---------------------------
type RPScenario = {
  id: string;
  name: string;
  icon: LucideIcon;
  context: string;
  npcFirstLine: { arabizi: string; arabic: string; translation: string };
  userChoices: { id: string; arabizi: string; arabic: string; translation: string; nextNpcLine?: { arabizi: string; arabic: string; translation: string } }[];
};

const rpScenarios: RPScenario[] = [
  {
    id: 'taxi',
    name: 'Karim (Petit Taxi)',
    icon: CarFront,
    context: 'Vous montez dans un taxi à Casablanca.',
    npcFirstLine: { arabizi: 'Salam a khoya, fin ghadi ?', arabic: 'سَلَامْ ا خُويَا، فِينْ غَادِي؟', translation: 'Bonjour mon frère, où vas-tu ?' },
    userChoices: [
      { id: 'c1', arabizi: 'Bghit nemchi l medina', arabic: 'بْغِيتْ نِمْشِي ل لْمْدِينَة', translation: 'Je veux aller à la médina', nextNpcLine: { arabizi: 'Wakha, yallah', arabic: 'وَاخَا، يَالَاهْ', translation: 'D\'accord, allons-y' } },
      { id: 'c2', arabizi: 'Dor 3la limen 3afak', arabic: 'دُورْ عْلَى لِيمَنْ عَفَاكْ', translation: 'Tournez à droite s\'il vous plaît', nextNpcLine: { arabizi: 'Mzyan, hna ?', arabic: 'مْزِيَانْ، هْنَا؟', translation: 'Bien, ici ?' } }
    ]
  },
  {
    id: 'cafe',
    name: 'Driss (Serveur de Café)',
    icon: Coffee,
    context: 'Vous vous asseyez en terrasse.',
    npcFirstLine: { arabizi: 'Merhba bik ! Shnu n-jib lik tchrob ?', arabic: 'مْرْحَبَا بِيكْ! شْنُو نْجِيبْ لِيكْ تِشْرَبْ؟', translation: 'Bienvenue ! Qu\'est-ce que je vous sers à boire ?' },
    userChoices: [
      { id: 'c1', arabizi: 'Qhwa kahla bla sukkar', arabic: 'قْهوَة كَحْلَة بْلَا سُكَّرْ', translation: 'Un café noir sans sucre', nextNpcLine: { arabizi: 'Mojouda a sidi', arabic: 'مَوْجُودَة ا سِيدِي', translation: 'Tout de suite monsieur' } },
      { id: 'c2', arabizi: 'Atay b n3na3 3afak', arabic: 'أَتَايْ بْ نْنَعْنَاعْ عَفَاكْ', translation: 'Un thé à la menthe s\'il vous plaît', nextNpcLine: { arabizi: 'Atay mcha77ar, wesh bghiti m3ah chi 7alwa ?', arabic: 'أَتَايْ مْشَحْحَرْ، وَاشْ بْغِيتِي مْعَاهْ شِي حْلُوَة؟', translation: 'Un thé bien infusé, vous voulez une pâtisserie avec ?' } }
    ]
  },
  {
    id: 'souk',
    name: 'Hassan (Marchand du Souk)',
    icon: ShoppingBag,
    context: 'Vous négociez au souk.',
    npcFirstLine: { arabizi: 'Salam ! Kif dayr ? Chof had zrabi zwinin !', arabic: 'سَلَامْ! كِيفْ دَايْرْ؟ شُوفْ هَادْ زْرَابِي زْوِينِينْ!', translation: 'Bonjour ! Comment ça va ? Regarde ces beaux tapis !' },
    userChoices: [
      { id: 'c1', arabizi: 'Bch7al hadi a sidi ?', arabic: 'بْشْحَالْ هَادِي ا سِيدِي؟', translation: 'Combien pour celui-ci monsieur ?', nextNpcLine: { arabizi: 'Hadi b myatayn derham', arabic: 'هَادِي بْ مْيَاتَيْنْ دِرْهَمْ', translation: 'Celui-ci est à deux cents dirhams' } },
      { id: 'c2', arabizi: 'Ghalia chwiya, nqess lia', arabic: 'غَالْيَة شْوِيَّة، نْقَسْ لِيَا', translation: 'C\'est un peu cher, baissez le prix', nextNpcLine: { arabizi: 'Wakha, 3tini mya w khamsin', arabic: 'وَاخَا، عْطِينِي مْيَة وْ خَمْسِينْ', translation: 'D\'accord, donnez-moi cent cinquante' } }
    ]
  }
];

export default function SpeechTrainer() {
  const { lang, t } = useTranslation();
  const { soundEnabled, addXp } = useAppStore();

  const [activeTab, setActiveTab] = useState<'elocution' | 'roleplay'>('elocution');

  // STATE ÉLOCUTION
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<VoiceEvaluationResult | null>(null);
  const currentExercise = speechExercises[exerciseIndex];

  // Voice recognition
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    startListening, 
    stopListening 
  } = useVoiceRecognition('ar-MA');

  const evaluateSpeechRef = useRef<(text: string) => void>(() => {});

  const evaluateSpeech = (spokenText: string) => {
    const evalResult = calculateSimilarity(spokenText, currentExercise.arabizi, currentExercise.arabic);
    const score = evalResult.score;
    
    setEvaluation(evalResult);

    if (score >= 60) {
      addXp(10);
      trackEvent('speech_practice_success', { score });
    }
  };

  useEffect(() => {
    evaluateSpeechRef.current = evaluateSpeech;
  });

  useEffect(() => {
    if (transcript && !isListening) {
      evaluateSpeechRef.current(transcript);
    }
  }, [transcript, isListening]);

  // STATE ROLEPLAY
  const [activeScenarioId, setActiveScenarioId] = useState<string>('taxi');
  const activeScenario = rpScenarios.find(s => s.id === activeScenarioId) || rpScenarios[0];
  const [chatHistory, setChatHistory] = useState<{ sender: 'npc' | 'user'; textArabizi: string; textArabic: string; translation: string }[]>(() => [
    {
      sender: 'npc',
      textArabizi: activeScenario.npcFirstLine.arabizi,
      textArabic: activeScenario.npcFirstLine.arabic,
      translation: activeScenario.npcFirstLine.translation
    }
  ]);
  const [showTranslations, setShowTranslations] = useState<Record<number, boolean>>({});
  const [roleplayComplete, setRoleplayComplete] = useState(false);

  // Init Roleplay — reset during render when the scenario changes.
  const [prevScenarioId, setPrevScenarioId] = useState(activeScenarioId);
  if (prevScenarioId !== activeScenarioId) {
    setPrevScenarioId(activeScenarioId);
    setChatHistory([
      {
        sender: 'npc',
        textArabizi: activeScenario.npcFirstLine.arabizi,
        textArabic: activeScenario.npcFirstLine.arabic,
        translation: activeScenario.npcFirstLine.translation
      }
    ]);
    setShowTranslations({});
    setRoleplayComplete(false);
  }

  // ÉLOCUTION METHODS
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setEvaluation(null);
      startListening();
    }
  };

  const nextExercise = () => {
    setExerciseIndex((prev) => (prev + 1) % speechExercises.length);
    setEvaluation(null);
    if (isListening) stopListening();
  };

  // ROLEPLAY METHODS
  const handleUserRPChoice = (choice: typeof rpScenarios[0]['userChoices'][0]) => {
    if (roleplayComplete) return;
    
    setChatHistory(prev => [...prev, { sender: 'user', textArabizi: choice.arabizi, textArabic: choice.arabic, translation: choice.translation }]);
    
    setTimeout(() => {
      if (choice.nextNpcLine) {
        setChatHistory(prev => [...prev, { sender: 'npc', textArabizi: choice.nextNpcLine!.arabizi, textArabic: choice.nextNpcLine!.arabic, translation: choice.nextNpcLine!.translation }]);
        playAudio(choice.nextNpcLine.arabizi, choice.nextNpcLine.arabic, soundEnabled, 1.0, { voice: 'male' });
        setRoleplayComplete(true);
      } else {
        setRoleplayComplete(true);
      }
    }, 1000);
  };

  const toggleTranslation = (index: number) => {
    setShowTranslations(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      
      {/* Header section with Editorial Serif title */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-[#C9A05C] text-xs font-bold tracking-[0.25em] uppercase">
          <span>—</span>
          <span>Pratique Orale</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-[#1B2A4A] font-normal">
          Perfectionnez votre accent
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7670]">
          Entraînez-vous avec la reconnaissance vocale ou simulez un échange quotidien.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-[#FDFCF8] rounded-full p-1.5 shadow-xs border border-[#E8E2D5] max-w-xs mx-auto">
        <button 
          onClick={() => setActiveTab('elocution')}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'elocution' ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' : 'text-[#7A7670] hover:text-[#1B2A4A]'}`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Élocution</span>
        </button>
        <button 
          onClick={() => setActiveTab('roleplay')}
          className={`flex-1 py-2 px-4 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'roleplay' ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' : 'text-[#7A7670] hover:text-[#1B2A4A]'}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Dialogue</span>
        </button>
      </div>

      {activeTab === 'elocution' && (
        <div className="bg-[#FDFCF8] rounded-3xl p-6 sm:p-10 shadow-xs border border-[#E8E2D5]">
          <div className="text-center space-y-8 max-w-lg mx-auto">
            
            <div className="bg-[#F7F3EA] rounded-3xl p-8 border border-[#E8E2D5] shadow-inner relative">
              <div className="flex items-center justify-center gap-2 text-[#C9A05C] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                <span>—</span>
                <span>Lisez à voix haute</span>
              </div>
              <div className="text-4xl sm:text-5xl font-arabic text-[#1B2A4A] mb-3 leading-tight">{currentExercise.arabic}</div>
              <div className="font-display text-2xl font-bold text-[#1B2A4A]">{currentExercise.arabizi}</div>
              <div className="text-[#7A7670] text-sm mt-1">{currentExercise.translation[lang as keyof typeof currentExercise.translation] || currentExercise.translation.fr}</div>
              
              <div className="mt-6 flex items-center justify-center gap-3">
                <button 
                  type="button"
                  onClick={() => playAudio(currentExercise.arabizi, currentExercise.arabic, soundEnabled, 1.0, { speed: 'normal' })}
                  className="px-4 py-2 bg-[#1B2A4A] text-[#FDFCF8] rounded-full flex items-center gap-2 shadow-xs hover:bg-[#1B2A4A]/90 hover:scale-105 transition-all text-xs font-bold"
                  title="Écouter à vitesse normale"
                >
                  <Volume2 className="w-4 h-4 text-[#C9A05C]" />
                  <span>Normal</span>
                </button>
                <button 
                  type="button"
                  onClick={() => playAudio(currentExercise.arabizi, currentExercise.arabic, soundEnabled, 0.75, { speed: 'slow' })}
                  className="px-4 py-2 bg-[#FDFCF8] border border-[#E8E2D5] text-[#1B2A4A] rounded-full flex items-center gap-2 shadow-xs hover:bg-[#E8E2D5]/50 hover:scale-105 transition-all text-xs font-bold"
                  title="Écouter au ralenti (mode tortue)"
                >
                  <Turtle className="w-4 h-4 text-[#C9A05C]" />
                  <span>Tortue 🐢</span>
                </button>
              </div>
            </div>

            {/* Zone d'enregistrement */}
            <div className="flex flex-col items-center gap-3">
              <button
              aria-label={isListening ? t.modules.speech.listening : t.modules.speech.pressMic}
                onClick={toggleListening}
                className={`
                  w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                  ${isListening ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-[#1B2A4A] text-[#FDFCF8] hover:bg-[#1B2A4A]/90 hover:scale-105'}
                `}
              >
                <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce' : 'text-[#C9A05C]'}`} />
              </button>
              
              <div className="text-xs font-bold text-[#7A7670]">
                {isListening ? t.modules.speech.listening : t.modules.speech.pressMic}
              </div>

              {transcript && (
                <div className="mt-3 p-4 bg-[#F7F3EA] rounded-2xl max-w-md w-full text-center border border-[#E8E2D5]">
                  <div className="text-xs text-[#7A7670] mb-1">{t.modules.speech.speechRecognition}</div>
                  <div className="font-arabic text-xl text-[#1B2A4A]">{transcript}</div>
                </div>
              )}

              {voiceError && (
                <div className="mt-2 p-3.5 rounded-2xl flex items-center gap-3 max-w-md w-full bg-red-50 text-red-700 border border-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{voiceError}</span>
                </div>
              )}

              {evaluation && !isListening && (
                <VoiceFeedbackCard
                  evaluation={evaluation}
                  onRetry={() => { setEvaluation(null); startListening(); }}
                  onListenModel={() => playAudio(currentExercise.arabizi, currentExercise.arabic, soundEnabled)}
                />
              )}
            </div>

            <button 
              onClick={nextExercise}
              className="mx-auto inline-flex items-center gap-2 px-6 py-3 bg-[#F7F3EA] hover:bg-[#E8E2D5]/70 text-[#1B2A4A] font-bold rounded-full text-xs transition-colors border border-[#E8E2D5]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Phrase suivante</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'roleplay' && (
        <div className="bg-[#FDFCF8] rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] flex flex-col h-[600px]">
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 hide-scrollbar">
            {rpScenarios.map(sc => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-colors shrink-0 ${activeScenarioId === sc.id ? 'bg-[#1B2A4A] text-[#FDFCF8]' : 'bg-[#F7F3EA] text-[#7A7670] border border-[#E8E2D5] hover:text-[#1B2A4A]'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sc.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="bg-[#C9A05C]/15 border border-[#C9A05C]/30 text-[#1B2A4A] text-xs font-semibold p-3 rounded-2xl text-center mb-4">
            Contexte : {activeScenario.context}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#F7F3EA] rounded-2xl border border-[#E8E2D5]">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-[#1B2A4A] text-[#FDFCF8] rounded-br-none' : 'bg-[#FDFCF8] border border-[#E8E2D5] shadow-xs text-[#1B2A4A] rounded-bl-none'}`}>
                  <div className="flex items-start gap-3">
                    {msg.sender === 'npc' && (
                      <button onClick={() => playAudio(msg.textArabizi, msg.textArabic, soundEnabled, 1.0, { voice: 'male' })} className="text-[#C9A05C] hover:text-[#b88f4b] shrink-0 mt-1">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    <div>
                      <p className="font-display font-bold text-base">{msg.textArabizi}</p>
                      <p className={`font-arabic text-lg mt-0.5 ${msg.sender === 'user' ? 'text-[#E8E2D5]' : 'text-[#7A7670]'}`}>{msg.textArabic}</p>
                    </div>
                  </div>
                  {showTranslations[idx] && (
                    <div className={`mt-2 pt-2 border-t text-xs ${msg.sender === 'user' ? 'border-white/10 text-[#E8E2D5]' : 'border-[#E8E2D5] text-[#7A7670]'}`}>
                      {msg.translation}
                    </div>
                  )}
                </div>
                <button onClick={() => toggleTranslation(idx)} className="text-[11px] text-[#7A7670] mt-1 flex items-center gap-1 hover:text-[#1B2A4A] mx-2">
                  <Globe className="w-3 h-3" /> Traduire
                </button>
              </div>
            ))}
          </div>

          {!roleplayComplete ? (
            <div className="mt-4 pt-4 border-t border-[#E8E2D5] space-y-3">
              <p className="text-xs font-bold text-[#7A7670] uppercase tracking-wider text-center mb-1">Choisissez votre réponse :</p>
              <div className="grid gap-2">
                {activeScenario.userChoices.map(choice => (
                  <button 
                    key={choice.id}
                    onClick={() => handleUserRPChoice(choice)}
                    className="p-3 bg-[#F7F3EA] hover:bg-[#E8E2D5]/70 border border-[#E8E2D5] rounded-2xl text-left transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-display font-bold text-sm text-[#1B2A4A]">{choice.arabizi}</div>
                      <div className="text-xs text-[#7A7670]">{choice.translation}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C9A05C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-[#7A9174]/15 text-[#1B2A4A] border border-[#7A9174]/40 rounded-2xl text-center font-bold text-xs">
              <Trophy className="w-5 h-5 inline-block mb-1 mr-2 text-[#7A9174]" />
              Conversation terminée avec succès !
              <button onClick={() => { setChatHistory([{ sender: 'npc', textArabizi: activeScenario.npcFirstLine.arabizi, textArabic: activeScenario.npcFirstLine.arabic, translation: activeScenario.npcFirstLine.translation }]); setRoleplayComplete(false); }} className="block mx-auto mt-2 px-5 py-2 bg-[#1B2A4A] text-[#FDFCF8] rounded-full text-xs font-bold">
                Recommencer
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

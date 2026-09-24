'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Trophy, AlertCircle, RefreshCw, MessageSquare, CarFront, Coffee, ShoppingBag, Globe } from 'lucide-react';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { playAudio } from '../../lib/audio';

// ---------------------------
// DONNÉES : MODE ÉLOCUTION
// ---------------------------
const speechExercises = [
  { id: '1', arabizi: 'Sba7 l-khir', arabic: 'صباح الخير', translation: { fr: 'Bonjour', en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' } },
  { id: '2', arabizi: 'Fin ghadi a khoya', arabic: 'فين غادي ا خويا', translation: { fr: 'Où vas-tu mon frère ?', en: 'Where are you going brother?', es: '¿A dónde vas hermano?', ar: 'إلى أين أنت ذاهب يا أخي؟' } },
  { id: '3', arabizi: 'Bch7al hada 3afak', arabic: 'بشحال هادا عفاك', translation: { fr: 'Combien ça coûte s\'il vous plaît ?', en: 'How much is this please?', es: '¿Cuánto cuesta esto por favor?', ar: 'بكم هذا من فضلك؟' } },
  { id: '4', arabizi: 'Bghit atay b n3na3', arabic: 'بغيت اتاي ب النعناع', translation: { fr: 'Je voudrais un thé à la menthe', en: 'I would like mint tea', es: 'Quisiera un té con menta', ar: 'أريد شاي بالنعناع' } },
];

// ---------------------------
// DONNÉES : MODE ROLEPLAY
// ---------------------------
type RPScenario = {
  id: string;
  name: string;
  icon: any;
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
    npcFirstLine: { arabizi: 'Salam a khoya, fin ghadi ?', arabic: 'سلام ا خويا، فين غادي؟', translation: 'Bonjour mon frère, où vas-tu ?' },
    userChoices: [
      { id: 'c1', arabizi: 'Bghit nemchi l medina', arabic: 'بغيت نمشي ل لمدينة', translation: 'Je veux aller à la médina', nextNpcLine: { arabizi: 'Wakha, yallah', arabic: 'واخا، يالاه', translation: 'D\'accord, allons-y' } },
      { id: 'c2', arabizi: 'Dor 3la limen 3afak', arabic: 'دور على ليمن عفاك', translation: 'Tournez à droite s\'il vous plaît', nextNpcLine: { arabizi: 'Mzyan, hna ?', arabic: 'مزيان، هنا؟', translation: 'Bien, ici ?' } }
    ]
  },
  {
    id: 'cafe',
    name: 'Driss (Serveur de Café)',
    icon: Coffee,
    context: 'Vous vous asseyez en terrasse.',
    npcFirstLine: { arabizi: 'Merhba bik ! Shnu n-jib lik tchrob ?', arabic: 'مرحبا بيك! شنو نجيب ليك تشرب؟', translation: 'Bienvenue ! Qu\'est-ce que je vous sers à boire ?' },
    userChoices: [
      { id: 'c1', arabizi: 'Qhwa kahla bla sukkar', arabic: 'قهوة كحلة بلا سكر', translation: 'Un café noir sans sucre', nextNpcLine: { arabizi: 'Mojouda a sidi', arabic: 'موجودة ا سيدي', translation: 'Tout de suite monsieur' } },
      { id: 'c2', arabizi: 'Atay b n3na3 3afak', arabic: 'اتاي ب النعناع عفاك', translation: 'Un thé à la menthe s\'il vous plaît', nextNpcLine: { arabizi: 'Atay mcha77ar, wesh bghiti m3ah chi 7alwa ?', arabic: 'اتاي مشحر، واش بغيتي معاه شي حلوة؟', translation: 'Un thé bien infusé, vous voulez une pâtisserie avec ?' } }
    ]
  },
  {
    id: 'souk',
    name: 'Hassan (Marchand du Souk)',
    icon: ShoppingBag,
    context: 'Vous regardez des tapis dans la médina.',
    npcFirstLine: { arabizi: 'Tfeddel a sidi, chouf had z-zrabi zwinin ! Sh7al bghiti ?', arabic: 'تفضل ا سيدي، شوف هاد الزرابي زوينين! شحال بغيتي؟', translation: 'Entrez monsieur, regardez ces beaux tapis ! Combien en voulez-vous ?' },
    userChoices: [
      { id: 'c1', arabizi: 'Ghali bzzaf, nqess shwiya', arabic: 'غالي بزاف، نقص شوية', translation: 'C\'est très cher, baissez un peu le prix', nextNpcLine: { arabizi: 'Gha nsayb m3ak', arabic: 'غا نصايب معاك', translation: 'Je vais te faire un bon prix' } },
      { id: 'c2', arabizi: 'Wakhan nchouf hadak l-zreq ?', arabic: 'واخا نشوف هاداك لزرق؟', translation: 'Puis-je voir le bleu ?', nextNpcLine: { arabizi: 'Hada d-zreq sghir awla l-kbir ?', arabic: 'هادا دزرق صغير اولا لكبير؟', translation: 'Le petit bleu ou le grand ?' } }
    ]
  }
];

export default function SpeechTrainer() {
  const { lang } = useTranslation();
  const { soundEnabled } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'elocution' | 'roleplay'>('elocution');

  // ELOCUTION STATE
  const [currentExercise, setCurrentExercise] = useState(speechExercises[0]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  
  // ROLEPLAY STATE
  const [activeScenarioId, setActiveScenarioId] = useState<string>('taxi');
  const activeScenario = rpScenarios.find(s => s.id === activeScenarioId)!;
  const [chatHistory, setChatHistory] = useState<{ sender: 'npc' | 'user', textArabizi: string, textArabic: string, translation: string }[]>([]);
  const [showTranslations, setShowTranslations] = useState<Record<number, boolean>>({});
  const [roleplayComplete, setRoleplayComplete] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialiser le chat Roleplay avec la première phrase du NPC
    if (activeTab === 'roleplay') {
      setChatHistory([{ sender: 'npc', textArabizi: activeScenario.npcFirstLine.arabizi, textArabic: activeScenario.npcFirstLine.arabic, translation: activeScenario.npcFirstLine.translation }]);
      setRoleplayComplete(false);
      setShowTranslations({});
    }
  }, [activeScenarioId, activeTab]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-MA';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setFeedback(null);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        evaluatePronunciation(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setFeedback({ type: 'error', message: 'Accès au microphone refusé.' });
        } else if (event.error === 'no-speech') {
          setFeedback({ type: 'warning', message: 'Aucune voix détectée, réessayez.' });
        } else {
          setFeedback({ type: 'error', message: `Erreur: ${event.error}` });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      if (activeTab === 'elocution') {
        setFeedback({ type: 'error', message: 'Microphone non supporté sur ce navigateur (utilisez Chrome/Edge).' });
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [currentExercise, activeTab]);

  // ELOCUTION METHODS
  const evaluatePronunciation = (spokenText: string) => {
    const normalizedSpoken = spokenText.trim().replace(/[.,!?؟]/g, '');
    const normalizedTarget = currentExercise.arabic.trim().replace(/[.,!?؟]/g, '');
    
    if (normalizedSpoken === normalizedTarget || normalizedSpoken.includes(normalizedTarget) || normalizedTarget.includes(normalizedSpoken)) {
      setFeedback({ type: 'success', message: 'Excellente prononciation !' });
    } else {
      setFeedback({ type: 'warning', message: 'Presque ! Essayez d\'articuler un peu plus.' });
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const nextExercise = () => {
    const currentIndex = speechExercises.findIndex(e => e.id === currentExercise.id);
    const nextIndex = (currentIndex + 1) % speechExercises.length;
    setCurrentExercise(speechExercises[nextIndex]);
    setTranscript('');
    setFeedback(null);
  };

  // ROLEPLAY METHODS
  const handleUserRPChoice = (choice: typeof rpScenarios[0]['userChoices'][0]) => {
    if (roleplayComplete) return;
    
    // Ajouter réponse utilisateur
    setChatHistory(prev => [...prev, { sender: 'user', textArabizi: choice.arabizi, textArabic: choice.arabic, translation: choice.translation }]);
    
    // Jouer audio user (optionnel, on peut le lire si on veut)
    
    // Réponse NPC
    setTimeout(() => {
      if (choice.nextNpcLine) {
        setChatHistory(prev => [...prev, { sender: 'npc', textArabizi: choice.nextNpcLine!.arabizi, textArabic: choice.nextNpcLine!.arabic, translation: choice.nextNpcLine!.translation }]);
        playAudio(choice.nextNpcLine.arabizi, choice.nextNpcLine.arabic, soundEnabled);
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
      {/* Tabs */}
      <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100 max-w-sm mx-auto">
        <button 
          onClick={() => setActiveTab('elocution')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-colors ${activeTab === 'elocution' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Mic className="w-4 h-4 inline-block mr-2" />
          Élocution
        </button>
        <button 
          onClick={() => setActiveTab('roleplay')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-colors ${activeTab === 'roleplay' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <MessageSquare className="w-4 h-4 inline-block mr-2" />
          Roleplay IA
        </button>
      </div>

      {activeTab === 'elocution' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Entraînement de la Voix</h2>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Lisez à voix haute</p>
              <div className="text-4xl font-arabic text-blue-900 mb-4">{currentExercise.arabic}</div>
              <div className="text-2xl font-bold text-slate-700">{currentExercise.arabizi}</div>
              <div className="text-slate-500 mt-2">{currentExercise.translation[lang as keyof typeof currentExercise.translation] || currentExercise.translation.fr}</div>
              
              <button 
                onClick={() => playAudio(currentExercise.arabizi, currentExercise.arabic, soundEnabled)}
                className="mt-6 mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-md hover:bg-blue-50 hover:scale-105 transition-all"
                title="Écouter le modèle"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Zone d'enregistrement */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={toggleListening}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                  ${isListening ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}
                `}
              >
                <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
              </button>
              
              <div className="text-sm font-bold text-slate-500">
                {isListening ? 'Écoute en cours...' : 'Appuyez pour parler'}
              </div>

              {transcript && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl max-w-md w-full text-center">
                  <div className="text-xs text-slate-400 mb-1">J'ai entendu :</div>
                  <div className="font-arabic text-xl">{transcript}</div>
                </div>
              )}

              {feedback && (
                <div className={`mt-2 p-4 rounded-xl flex items-center gap-3 max-w-md w-full
                  ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                  ${feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                  ${feedback.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                `}>
                  {feedback.type === 'success' && <Trophy className="w-5 h-5 shrink-0" />}
                  {feedback.type !== 'success' && <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              )}
            </div>

            <button 
              onClick={nextExercise}
              className="mx-auto flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Phrase Suivante
            </button>
          </div>
        </div>
      )}

      {activeTab === 'roleplay' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[600px]">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 hide-scrollbar">
            {rpScenarios.map(sc => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioId(sc.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex-shrink-0 ${activeScenarioId === sc.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <Icon className="w-4 h-4" />
                  {sc.name}
                </button>
              );
            })}
          </div>
          
          <div className="bg-orange-50 text-orange-800 text-sm font-bold p-3 rounded-xl text-center mb-4">
            Context: {activeScenario.context}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 shadow-sm text-slate-800 rounded-bl-none'}`}>
                  <div className="flex items-start gap-3">
                    {msg.sender === 'npc' && (
                      <button onClick={() => playAudio(msg.textArabizi, msg.textArabic, soundEnabled)} className="text-blue-500 hover:text-blue-700 shrink-0 mt-1">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    )}
                    <div>
                      <p className="font-bold text-lg">{msg.textArabizi}</p>
                      <p className={`font-arabic text-xl mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>{msg.textArabic}</p>
                    </div>
                  </div>
                  {showTranslations[idx] && (
                    <div className={`mt-3 pt-3 border-t text-sm ${msg.sender === 'user' ? 'border-blue-500 text-blue-100' : 'border-slate-100 text-slate-500'}`}>
                      {msg.translation}
                    </div>
                  )}
                </div>
                <button onClick={() => toggleTranslation(idx)} className="text-xs text-slate-400 mt-1 flex items-center gap-1 hover:text-blue-500 mx-2">
                  <Globe className="w-3 h-3" /> Traduire
                </button>
              </div>
            ))}
          </div>

          {!roleplayComplete ? (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <p className="text-sm font-bold text-slate-400 uppercase text-center mb-2">Choisissez votre réponse :</p>
              <div className="grid gap-2">
                {activeScenario.userChoices.map(choice => (
                  <button 
                    key={choice.id}
                    onClick={() => handleUserRPChoice(choice)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-colors group"
                  >
                    <div className="font-bold text-slate-800 group-hover:text-blue-700">{choice.arabizi}</div>
                    <div className="text-sm text-slate-500">{choice.translation}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center font-bold">
              <Trophy className="w-6 h-6 inline-block mb-1 mr-2" />
              Conversation terminée avec succès !
              <button onClick={() => { setChatHistory([{ sender: 'npc', textArabizi: activeScenario.npcFirstLine.arabizi, textArabic: activeScenario.npcFirstLine.arabic, translation: activeScenario.npcFirstLine.translation }]); setRoleplayComplete(false); }} className="block mx-auto mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                Recommencer
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

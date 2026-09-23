import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/TranslationsProvider';

// Dictionnaire de phrases d'entraînement
const speechExercises = [
  { id: '1', arabizi: 'Sba7 l-khir', arabic: 'صباح الخير', translation: { fr: 'Bonjour', en: 'Good morning', es: 'Buenos días', ar: 'صباح الخير' } },
  { id: '2', arabizi: 'Fin ghadi a khoya', arabic: 'فين غادي ا خويا', translation: { fr: 'Où vas-tu mon frère ?', en: 'Where are you going brother?', es: '¿A dónde vas hermano?', ar: 'إلى أين أنت ذاهب يا أخي؟' } },
  { id: '3', arabizi: 'Bch7al hada 3afak', arabic: 'بشحال هادا عفاك', translation: { fr: 'Combien ça coûte s\'il vous plaît ?', en: 'How much is this please?', es: '¿Cuánto cuesta esto por favor?', ar: 'بكم هذا من فضلك؟' } },
  { id: '4', arabizi: 'Bghit atay b n3na3', arabic: 'بغيت اتاي ب النعناع', translation: { fr: 'Je voudrais un thé à la menthe', en: 'I would like mint tea', es: 'Quisiera un té con menta', ar: 'أريد شاي بالنعناع' } },
];

export default function SpeechTrainer() {
  const { lang } = useTranslation();
  const [currentExercise, setCurrentExercise] = useState(speechExercises[0]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Vérifier le support de l'API Web Speech
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-MA'; // Priorité Maroc, fallback ar-SA dans certains cas

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
          setFeedback({ type: 'error', message: `Erreur de reconnaissance: ${event.error}` });
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setFeedback({ type: 'error', message: 'Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Google Chrome.' });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentExercise]);

  const evaluatePronunciation = (spokenText: string) => {
    // Algorithme de comparaison simpliste (en production, on utiliserait une métrique de similarité)
    const normalizedSpoken = spokenText.trim().replace(/[.,!?؟]/g, '');
    const normalizedTarget = currentExercise.arabic.trim().replace(/[.,!?؟]/g, '');
    
    // Si c'est exact ou que le navigateur reconnaît une grande partie
    if (normalizedSpoken === normalizedTarget || normalizedSpoken.includes(normalizedTarget) || normalizedTarget.includes(normalizedSpoken)) {
      setFeedback({ type: 'success', message: 'Excellente prononciation !' });
    } else {
      setFeedback({ type: 'warning', message: 'Presque ! Essayez d\'articuler un peu plus.' });
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const playAudio = () => {
    // Audio hybride: On utilise SpeechSynthesis en fallback ar-SA pour simuler l'arabe (puisque ar-MA n'est souvent pas synthétisé)
    const utterance = new SpeechSynthesisUtterance(currentExercise.arabic);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85; // Un peu plus lent pour l'apprentissage
    window.speechSynthesis.speak(utterance);
  };

  const nextExercise = () => {
    const currentIndex = speechExercises.findIndex(e => e.id === currentExercise.id);
    const nextIndex = (currentIndex + 1) % speechExercises.length;
    setCurrentExercise(speechExercises[nextIndex]);
    setTranscript('');
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Pratique Orale</h2>
        <p className="text-slate-600">Améliorez votre accent marocain avec l'intelligence artificielle.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-blue-100 flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 rounded-tr-full -z-10"></div>

        {/* Cible */}
        <div className="text-center space-y-4 w-full">
          <button 
            onClick={playAudio}
            className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-200 hover:scale-105 transition-all shadow-sm mb-6"
            title="Écouter la prononciation"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          
          <h3 className="text-4xl font-bold text-slate-800">{currentExercise.arabizi}</h3>
          <p className="text-2xl font-arabic text-slate-500">{currentExercise.arabic}</p>
          <p className="text-slate-500 font-medium italic mt-2">
            « {typeof currentExercise.translation === 'string' ? currentExercise.translation : currentExercise.translation[lang] || currentExercise.translation.fr} »
          </p>
        </div>

        {/* Contrôles d'enregistrement */}
        <div className="flex flex-col items-center gap-4 mt-4 w-full">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-200' 
                : 'bg-slate-800 text-white hover:bg-slate-700 hover:scale-105 shadow-slate-300'
            }`}
          >
            <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce-short' : ''}`} />
          </button>
          
          <p className={`font-medium ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
            {isListening ? "Écoute en cours..." : "Appuyez pour parler"}
          </p>
        </div>

        {/* Feedback Area */}
        <div className="w-full min-h-[100px] flex flex-col items-center justify-center text-center">
          {transcript && (
            <div className="mb-4 text-lg text-slate-700">
              <span className="font-bold text-slate-400 text-sm block mb-1">Vous avez dit :</span>
              {transcript}
            </div>
          )}
          
          {feedback && (
            <div className={`flex items-center gap-2 p-4 rounded-xl font-bold ${
              feedback.type === 'success' ? 'bg-green-100 text-green-700' :
              feedback.type === 'warning' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {feedback.type === 'success' && <Trophy className="w-5 h-5" />}
              {feedback.type === 'warning' && <RefreshCw className="w-5 h-5" />}
              {feedback.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-center">
        <button 
          onClick={nextExercise}
          className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          Phrase suivante
        </button>
      </div>
    </div>
  );
}

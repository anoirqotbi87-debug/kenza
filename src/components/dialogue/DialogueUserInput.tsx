import React, { useState } from 'react';
import { DialogueTurn } from '../../types/dialogue';
import { Mic, Square, MessageSquareText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DialogueUserInputProps {
  turn: DialogueTurn;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  skipTurn: () => void;
  validationError: string | null;
}

export default function DialogueUserInput({ 
  turn, 
  isListening, 
  startListening, 
  stopListening, 
  skipTurn, 
  validationError 
}: DialogueUserInputProps) {
  const { preferredNotation } = useAppStore();
  const [showHelper, setShowHelper] = useState(false);

  return (
    <div className="bg-white border-t border-slate-200 p-4 md:p-6 pb-safe animate-in slide-in-from-bottom-8">
      
      {validationError && (
        <div className="text-center text-red-500 font-medium text-sm mb-4 animate-bounce">
          {validationError}
        </div>
      )}

      {/* Suggestion Bubble */}
      <div className="max-w-xl mx-auto mb-6 text-center space-y-2">
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Ce que vous devez dire :</p>
        {preferredNotation === 'arabic' || preferredNotation === 'duo' ? (
          <div className="text-3xl font-arabic font-bold text-slate-800">
            {turn.expectedPhrases?.primaryArabic}
          </div>
        ) : null}
        
        {preferredNotation === 'arabizi' || preferredNotation === 'duo' ? (
          <div className="text-xl font-bold text-blue-600">
            {turn.expectedPhrases?.primaryArabizi}
          </div>
        ) : null}
        
        <p className="text-sm text-slate-400 italic">"{turn.translationFr}"</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }
          `}
        >
          {isListening ? (
            <Square className="w-8 h-8 text-white" fill="currentColor" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        <p className={`text-sm font-medium ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
          {isListening ? 'Écoute en cours...' : 'Maintenez ou touchez pour parler'}
        </p>

        <button 
          onClick={() => setShowHelper(true)}
          className="mt-2 text-sm text-slate-400 hover:text-slate-600 underline decoration-dotted flex items-center gap-2"
        >
          <MessageSquareText className="w-4 h-4" />
          Je ne peux pas parler
        </button>
      </div>

      {showHelper && (
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col items-center">
          <p className="text-sm text-slate-500 mb-3">Mode secours : Cliquez sur la phrase pour valider</p>
          <button 
            onClick={skipTurn}
            className="w-full max-w-md py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
          >
            {preferredNotation === 'arabic' ? turn.expectedPhrases?.primaryArabic : turn.expectedPhrases?.primaryArabizi}
          </button>
        </div>
      )}
    </div>
  );
}

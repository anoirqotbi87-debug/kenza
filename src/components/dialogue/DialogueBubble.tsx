import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { DialogueTurn } from '../../types/dialogue';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { playAudio } from '../../lib/audio';

interface DialogueBubbleProps {
  turn: DialogueTurn;
}

export default function DialogueBubble({ turn }: DialogueBubbleProps) {
  const { t } = useTranslation();
  const isBot = turn.speaker === 'bot';
  const { preferredNotation, soundEnabled } = useAppStore();
  const [showTranslation, setShowTranslation] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(turn.arabiziText || turn.arabicText, turn.arabicText, soundEnabled);
  };

  return (
    <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center border-2 border-amber-300 mr-3 mt-1">
          <span className="text-xl">🚕</span>
        </div>
      )}

      <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
        isBot 
          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
          : 'bg-blue-600 text-white rounded-tr-none'
      }`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className={`text-xs font-bold ${isBot ? 'text-amber-600' : 'text-blue-200'}`}>
            {turn.speakerRole}
          </div>
          {isBot && (
            <button
              type="button"
              onClick={handlePlay}
              className="p-1 text-slate-400 hover:text-amber-600 rounded-full transition-colors flex items-center gap-1"
              title="Réécouter la réplique"
              aria-label="Réécouter la réplique"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {preferredNotation === 'arabic' || preferredNotation === 'duo' ? (
          <div className={`text-2xl font-arabic font-bold mb-2 ${isBot ? 'text-slate-800' : 'text-white'}`}>
            {turn.arabicText}
          </div>
        ) : null}

        {preferredNotation === 'arabizi' || preferredNotation === 'duo' ? (
          <div className="text-lg font-bold">
            {turn.arabiziText}
          </div>
        ) : null}

        <button 
          onClick={() => setShowTranslation(!showTranslation)}
          className={`text-xs mt-3 underline decoration-dotted transition-opacity ${isBot ? 'text-slate-400 hover:text-slate-600' : 'text-blue-300 hover:text-white'}`}
        >
          {showTranslation ? t.modules.ui.hideTranslation : t.modules.ui.showTranslation}
        </button>

        {showTranslation && (
          <div className={`mt-2 text-sm italic border-t pt-2 ${isBot ? 'border-slate-100 text-slate-600' : 'border-blue-500/50 text-blue-100'}`}>
            {turn.translationFr}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center border-2 border-blue-300 ml-3 mt-1">
          <span className="text-xl">👤</span>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { DialogueScenario } from '../../types/dialogue';
import { useDialogueRunner } from '../../hooks/useDialogueRunner';
import { useAppStore } from '../../store/useAppStore';
import DialogueBubble from './DialogueBubble';
import DialogueUserInput from './DialogueUserInput';
import DialogueSummaryModal from './DialogueSummaryModal';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DialogueViewProps {
  scenario: DialogueScenario;
  onExit: () => void;
}

export default function DialogueView({ scenario, onExit }: DialogueViewProps) {
  const { soundEnabled, toggleSound, addXp } = useAppStore();
  const {
    state,
    currentTurn,
    isListening,
    transcript,
    startListening,
    stopListening,
    skipUserTurn
  } = useDialogueRunner(scenario, soundEnabled);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.history, state.userWaiting, isListening]);

  const handleCloseSummary = () => {
    addXp(25);
    onExit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">{scenario.title}</h1>
            <p className="text-xs text-slate-500 font-medium">Roleplay • {scenario.location}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleSound}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
        <div className="max-w-2xl mx-auto flex flex-col">
          {/* Introduction Message */}
          <div className="text-center mb-8">
            <span className="bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Début du scénario
            </span>
          </div>

          {state.history.map((turn, index) => (
            <DialogueBubble key={`${turn.id}-${index}`} turn={turn} />
          ))}

          {state.isBotSpeaking && (
            <div className="flex w-full mb-6 justify-start animate-in fade-in">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center border-2 border-amber-300 mr-3 mt-1">
                <span className="text-xl">🚕</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Spacer for bottom input */}
          <div className="h-10" />
        </div>
      </div>

      {/* User Input Area */}
      {state.userWaiting && currentTurn && currentTurn.speaker === 'user' && (
        <DialogueUserInput 
          turn={currentTurn}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          skipTurn={skipUserTurn}
          validationError={state.validationError}
        />
      )}

      {/* Summary Modal */}
      {state.isCompleted && (
        <DialogueSummaryModal 
          score={state.score} 
          scenarioId={scenario.id}
          onClose={handleCloseSummary} 
        />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Exercise, Notation, DialogueChoice } from '../../types/curriculum';
import { Volume2, User, CarFront } from 'lucide-react';
import { playAudio } from '../../lib/audio';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { getLocalizedText } from '../../lib/i18n/utils';

interface ScenarioDialogueProps {
  exercise: Exercise;
  preferredNotation: Notation;
  onComplete: (isOptimal: boolean) => void;
  isAnswerChecked: boolean;
}

export default function ScenarioDialogue({ exercise, preferredNotation, onComplete, isAnswerChecked }: ScenarioDialogueProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const { soundEnabled } = useAppStore();
  const { lang, t } = useTranslation();

  const handleSelect = (choice: DialogueChoice) => {
    if (isAnswerChecked) return;
    setSelectedChoiceId(choice.id);
    onComplete(choice.isOptimal);
  };

  const getTextForNotation = (item: any) => {
    if (preferredNotation === 'arabizi') return item.arabizi;
    if (preferredNotation === 'arabic') return item.arabic;
    if (preferredNotation === 'duo') return `${item.arabizi} / ${item.arabic}`;
    return getLocalizedText(item.translation, lang); // fallback
  };

  const selectedChoice = exercise.dialogueChoices?.find(c => c.id === selectedChoiceId);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-full bg-slate-50 p-6 rounded-3xl border border-slate-200">
      
      {/* Context Bar */}
      <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide flex justify-center items-center gap-2 mb-8">
        <CarFront className="w-5 h-5" />
        {exercise.dialogueContext ? getLocalizedText(exercise.dialogueContext, lang) : "Scenario"}
      </div>

      {/* NPC Bubble */}
      <div className="flex gap-4 mb-8 items-end">
        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
          <User className="w-6 h-6" />
        </div>
        <div className="bg-white p-5 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 relative group max-w-[80%]">
          <p className="text-xl font-bold text-slate-800 mb-1">
            {exercise.npcStartLine ? getTextForNotation(exercise.npcStartLine) : ""}
          </p>
          <p className="text-slate-500 text-sm">
            {exercise.npcStartLine ? getLocalizedText(exercise.npcStartLine.translation, lang) : ""}
          </p>
          <button 
            onClick={() => playAudio(exercise.npcStartLine?.arabic || '', exercise.npcStartLine?.audioUrl, soundEnabled)}
            className="absolute -right-4 -top-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Response Area */}
      {!isAnswerChecked ? (
        <div className="flex flex-col gap-3 mt-auto">
          <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide px-2">{t.lessons.chooseAnswer}</div>
          {exercise.dialogueChoices?.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              className="text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-2xl transition-colors active:scale-95 group"
            >
              <div className="font-bold text-blue-900 text-lg group-hover:text-blue-700 transition-colors">
                {getTextForNotation(choice.text)}
              </div>
              <div className="text-blue-600/70 text-sm mt-1">{getLocalizedText(choice.text.translation, lang)}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-auto animate-in slide-in-from-bottom-4 duration-300">
          {/* User Bubble */}
          <div className="flex gap-4 items-end justify-end">
            <div className={`p-5 rounded-2xl rounded-br-none shadow-sm border text-left max-w-[80%]
              ${selectedChoice?.isOptimal ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}
            `}>
              <p className={`text-lg font-bold mb-1 ${selectedChoice?.isOptimal ? 'text-green-800' : 'text-orange-800'}`}>
                {getTextForNotation(selectedChoice?.text)}
              </p>
              <p className={`text-sm ${selectedChoice?.isOptimal ? 'text-green-600' : 'text-orange-600'}`}>
                {selectedChoice ? getLocalizedText(selectedChoice.text.translation, lang) : ''}
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
              <User className="w-6 h-6" />
            </div>
          </div>

          {/* NPC Reaction & Feedback */}
          <div className="flex gap-4 items-end">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div className="bg-slate-800 text-white p-5 rounded-2xl rounded-bl-none shadow-lg max-w-[80%]">
              {selectedChoice?.nextNpcLine && (
                <div className="mb-3 pb-3 border-b border-slate-600">
                  <span className="italic">"{selectedChoice.nextNpcLine}"</span>
                </div>
              )}
              <div className="flex gap-3 items-start">
                <span className="text-2xl">{selectedChoice?.isOptimal ? '✅' : '⚠️'}</span>
                <p className="text-slate-200 font-medium leading-relaxed">{selectedChoice ? getLocalizedText(selectedChoice.feedback, lang) : ''}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

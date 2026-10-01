'use client';

import React from 'react';
import { Exercise, Notation, MultiLangText } from '../../../types/curriculum';

import { getExerciseText } from '../../../lib/i18n/utils';
import { getAcceptedAnswers } from '../../../lib/exerciseAnswers';
import { useTranslation } from '../../../store/useAppStore';
import { trackEvent } from '../../../utils/analytics';

type NotationItem = string | {
  id?: string;
  arabizi?: string;
  arabic?: string;
  text?: MultiLangText | string;
  isCorrect?: boolean;
  translation?: MultiLangText | string;
};

interface McqExerciseProps {
  exercise: Exercise;
  preferredNotation: Notation;
  selectedOptionId: string | null;
  onSelect: (id: string) => void;
  isAnswerChecked: boolean;
}

const getTextForNotation = (item: NotationItem, notation: Notation, lang: string): React.ReactNode => {
  if (typeof item === 'string') return item;
  if (notation === 'arabizi' && item.arabizi) return item.arabizi;
  if (notation === 'arabic' && item.arabic) return item.arabic;
  if (notation === 'duo' && item.arabizi && item.arabic) return (
    <div className="flex flex-col items-center">
      <span className="text-orange-600 font-bold">{item.arabizi}</span>
      <span className="text-slate-800 font-arabic text-xl">{item.arabic}</span>
    </div>
  );
  if (item.translation) return typeof item.translation === 'string' ? item.translation : getExerciseText(item.translation, lang); // fallback
  return getExerciseText(item, lang);
};

/**
 * Option individuelle. Extraite dans son propre composant afin que le hook
 * useState soit appelé une seule fois par instance (règles des Hooks React),
 * et non à l'intérieur d'un .map().
 */
function McqOption({
  option,
  exercise,
  preferredNotation,
  isSelected,
  isAnswerChecked,
  onSelect,
}: {
  option: NotationItem;
  exercise: Exercise;
  preferredNotation: Notation;
  isSelected: boolean;
  isAnswerChecked: boolean;
  onSelect: (id: string) => void;
}) {
  const { t, lang } = useTranslation();
  const [showExplanation, setShowExplanation] = React.useState(false);

  const optionId = typeof option === 'string' ? option : option.id;
  const accepted = getAcceptedAnswers(exercise);
  const isCorrectOption = isAnswerChecked && !!optionId && accepted.some((id) => id.toLowerCase() === optionId.toLowerCase());
  const isWrongSelection = isAnswerChecked && isSelected && !isCorrectOption;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => !isAnswerChecked && optionId && onSelect(optionId)}
        disabled={isAnswerChecked}
        className={`
          p-6 rounded-2xl border-2 text-center text-lg font-medium transition-all min-h-[100px] flex items-center justify-center
          ${isSelected && !isAnswerChecked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}
          ${isCorrectOption ? 'border-green-500 bg-green-50' : ''}
          ${isWrongSelection ? 'border-red-500 bg-red-50' : ''}
          ${isAnswerChecked && !isCorrectOption && !isWrongSelection ? 'opacity-50' : ''}
        `}
      >
        {getTextForNotation(option, preferredNotation, lang)}
      </button>

      {isWrongSelection && (
        <div className="mt-3 text-center animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => {
              if (!showExplanation) {
                trackEvent('explain_mistake_clicked', { exerciseId: exercise.id, explanation: exercise.explanation });
              }
              setShowExplanation(!showExplanation);
            }}
            className="text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors flex items-center gap-2 mx-auto"
          >
            💡 {t.lessons.whyWrong}
          </button>

          {showExplanation && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 text-left shadow-sm">
              {exercise.explanation
                ? getExerciseText(exercise.explanation, lang)
                : t.lessons.whyWrongDefault}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function McqExercise({ exercise, preferredNotation, selectedOptionId, onSelect, isAnswerChecked }: McqExerciseProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {exercise.options?.map((opt) => (
        <McqOption
          key={opt.id}
          option={opt}
          exercise={exercise}
          preferredNotation={preferredNotation}
          isSelected={selectedOptionId === opt.id}
          isAnswerChecked={isAnswerChecked}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

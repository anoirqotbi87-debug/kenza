'use client';

import { useEffect } from 'react';
import { CloudUpload } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { track } from '../../lib/tracking';
import type { SavePromptVariant } from '../../lib/savePrompt';

interface SaveProgressCardProps {
  variant: SavePromptVariant;
  lessonsCompleted: number;
  onSave: () => void;
  onLater: () => void;
}

/** Carte affichée sur l'écran de fin de leçon pour inviter l'invité à créer un compte. */
export default function SaveProgressCard({ variant, lessonsCompleted, onSave, onLater }: SaveProgressCardProps) {
  const { t } = useTranslation();
  const xp = useAppStore((s) => s.xp);

  useEffect(() => {
    track('save_prompt_viewed', { variant, lessons_completed: lessonsCompleted }, '/lesson');
  }, [variant, lessonsCompleted]);

  const title = variant === 'first' ? t.savePrompt.title : t.savePrompt.reminderTitle;
  const body =
    variant === 'first'
      ? t.savePrompt.body
      : t.savePrompt.reminderBody.replace('{xp}', String(xp)).replace('{lessons}', String(lessonsCompleted));

  return (
    <div className="w-full max-w-sm bg-blue-50 border-2 border-blue-200 rounded-3xl p-5 mb-6 text-left shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <CloudUpload className="w-6 h-6 text-blue-600 shrink-0" />
        <h3 className="font-extrabold text-blue-900 text-lg leading-tight">{title}</h3>
      </div>
      <p className="text-sm text-blue-800 mb-4">{body}</p>
      <button
        onClick={() => {
          track('save_prompt_clicked', { variant, lessons_completed: lessonsCompleted }, '/lesson');
          onSave();
        }}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md transition-colors"
      >
        {t.savePrompt.cta}
      </button>
      <p className="text-xs text-blue-700/80 text-center mt-2">{t.savePrompt.reassurance}</p>
      <button
        onClick={() => {
          track('save_prompt_dismissed', { variant, lessons_completed: lessonsCompleted }, '/lesson');
          onLater();
        }}
        className="w-full mt-2 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
      >
        {t.savePrompt.later}
      </button>
    </div>
  );
}

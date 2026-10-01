'use client';

import { useState } from 'react';
import { ArrowRight, Check, Clock, Compass, Heart, Plane, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

/**
 * Questionnaire d'entrée (2 étapes) menant à l'écran de fin qui déclenche le
 * paywall personnalisé. Les réponses alimentent `completeOnboarding`, dont
 * dépend le Trigger 1.
 */
export default function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const onb = t.onboarding;
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState<0 | 1>(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  const goals = [
    { id: 'travel', label: onb.goal1, icon: Plane },
    { id: 'family', label: onb.goal2, icon: Heart },
    { id: 'work', label: onb.goal3, icon: Compass },
    { id: 'culture', label: onb.goal4, icon: Sparkles },
  ];
  const durations = [5, 10, 20];

  const finish = () => {
    completeOnboarding(goal ?? 'travel', minutes ?? 10);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#1B2A4A]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="bg-[#FDFCF8] rounded-3xl w-full max-w-lg shadow-2xl border border-[#E8E2D5] p-6 sm:p-8 my-auto"
        role="dialog"
        aria-modal="true"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A05C]">
          — {onb.kicker}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-[#1B2A4A] mt-2 mb-1">{onb.title}</h2>
        <p className="text-[11px] text-[#7A7670] mb-6">
          {onb.step.replace('{current}', String(step + 1)).replace('{total}', '2')}
        </p>

        {step === 0 ? (
          <div className="space-y-3">
            <h3 className="font-display text-lg text-[#1B2A4A]">{onb.goalQuestion}</h3>
            {goals.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setGoal(id);
                  setStep(1);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  goal === id
                    ? 'bg-[#C9A05C]/10 border-2 border-[#C9A05C]'
                    : 'bg-[#F7F3EA]/60 border-[#E8E2D5] hover:border-[#C9A05C]/50'
                }`}
              >
                <Icon size={18} className="text-[#C9A05C] shrink-0" />
                <span className="text-sm font-medium text-[#1B2A4A]">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-display text-lg text-[#1B2A4A]">{onb.timeQuestion}</h3>
            <div className="grid grid-cols-3 gap-2">
              {durations.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMinutes(value)}
                  className={`flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all ${
                    minutes === value
                      ? 'bg-[#C9A05C]/10 border-2 border-[#C9A05C]'
                      : 'bg-[#F7F3EA]/60 border-[#E8E2D5] hover:border-[#C9A05C]/50'
                  }`}
                >
                  <Clock size={16} className="text-[#C9A05C]" />
                  <span className="font-display text-xl text-[#1B2A4A]">{value}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#7A7670]">min</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={finish}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {onb.start}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

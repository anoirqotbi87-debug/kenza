import re

with open('src/components/onboarding/OnboardingModal.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_step3 = """          {step === 3 && (
            <div className=\"space-y-6 animate-in slide-in-from-right\">
              <div className=\"text-center\">
                <h2 className=\"text-2xl font-black text-slate-800 mb-2\">Quel est votre niveau ? 🇲🇦</h2>
                <p className=\"text-slate-500\">Pour vous proposer le meilleur point de départ.</p>
              </div>
              
              <div className=\"space-y-4\">
                <button
                  onClick={() => {
                    setQuizScore(0);
                    setStep(4);
                  }}
                  className=\"w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-between\"
                >
                  <div className=\"text-left\">
                    <div className=\"text-emerald-600 mb-1 flex items-center gap-2\">
                      <div className=\"w-2 h-2 rounded-full bg-emerald-500\"></div>
                      Je débute complètement
                    </div>
                    <div className=\"text-sm font-normal text-slate-500\">Commencer depuis le Module 1</div>
                  </div>
                  <ArrowRight className=\"w-5 h-5 text-slate-400\" />
                </button>

                <button
                  onClick={() => {
                    document.dispatchEvent(new CustomEvent('open-placement-test'));
                  }}
                  className=\"w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between\"
                >
                  <div className=\"text-left\">
                    <div className=\"text-blue-600 mb-1 flex items-center gap-2\">
                      <Zap className=\"w-4 h-4\" />
                      J'ai déjà des notions
                    </div>
                    <div className=\"text-sm font-normal text-slate-500\">Test rapide de 2 min pour sauter des niveaux</div>
                  </div>
                  <ArrowRight className=\"w-5 h-5 text-slate-400\" />
                </button>
              </div>
            </div>
          )}
"""

new_lines = lines[:135] + [new_step3] + lines[158:]

with open('src/components/onboarding/OnboardingModal.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

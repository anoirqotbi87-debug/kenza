with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

content = content.replace("import PricingModal from '@/components/monetization/PricingModal';", "import PaywallModal from '@/components/monetization/PaywallModal';")
content = content.replace("const [pricingSource, setPricingSource] = useState<string | null>(null);", "const [paywallSource, setPaywallSource] = useState<string | null>(null);")

render_module_replacement = """
  const renderModule = (moduleId: string, moduleData: any, track: 'grammar' | 'conversation') => {
    const isLocked = !useAppStore.getState().isPremium && parseInt(moduleId) >= 3;
    
    return (
      <div key={moduleId} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">{getLocalizedText(moduleData.title, lang)}</h2>
          {isLocked && <div className="bg-slate-200 text-slate-500 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><span role="img" aria-label="locked">🔒</span> PRO</div>}
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {moduleData.lessons.map((lesson: any) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  if (isLocked) {
                    setPaywallSource('module_' + moduleId);
                  } else if (lesson.id.startsWith('chk_')) {
                    setCheckpointOpen({ id: lesson.id, name: getLocalizedText(lesson.title, lang) });
                  } else {
                    setActiveLessonId(lesson.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[100px] ${
                  isLocked ? 'border-slate-100 bg-slate-50 cursor-pointer opacity-70 hover:opacity-100' :
                  isCompleted 
                    ? 'border-green-200 bg-green-50 text-green-700' 
                    : 'border-slate-100 bg-white hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" /> : <Play className={`w-8 h-8 mb-2 ${isLocked ? 'text-slate-400' : 'text-slate-300'}`} />}
                <span className="text-sm font-semibold text-center leading-tight">
                  {getLocalizedText(lesson.title, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };
"""

content = re.sub(r'  const renderModule = \(moduleId: string.*? \{.*?return \(.*?\}\);\n  \};', render_module_replacement, content, flags=re.DOTALL)
content = content.replace("{pricingSource && <PricingModal source={pricingSource} onClose={() => setPricingSource(null)} />}", "{paywallSource && <PaywallModal source={paywallSource} onClose={() => setPaywallSource(null)} />}")

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

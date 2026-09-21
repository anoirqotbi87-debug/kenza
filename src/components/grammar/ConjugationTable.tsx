'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Volume2 } from 'lucide-react';
import { playAudio } from '../../lib/audio';

type GrammarRule = 'present' | 'negation' | 'future' | 'possession';

interface RuleExample {
  person: string;
  prefix: string;
  verb: string;
  suffix: string;
  arabic: string;
  translation?: string;
}

interface RuleData {
  title: string;
  description: string;
  examples: RuleExample[];
}

export default function ConjugationTable() {
  const [activeRule, setActiveRule] = useState<GrammarRule>('present');
  const { preferredNotation, soundEnabled } = useAppStore();

  const handlePlay = (text: string) => {
    playAudio(text, undefined, soundEnabled);
  };

  const rules: Record<GrammarRule, RuleData> = {
    present: {
      title: "Le présent (Habitude/Continu)",
      description: "On ajoute le préfixe 'ka-' suivi du marqueur de personne.",
      examples: [
        { person: "Ana (Je)", prefix: "ka-n", verb: "kteb", suffix: "", arabic: "كانكتب" },
        { person: "Nta (Tu m.)", prefix: "ka-t", verb: "kteb", suffix: "", arabic: "كاتكتب" },
        { person: "Nti (Tu f.)", prefix: "ka-t", verb: "ketb", suffix: "i", arabic: "كاتكتبي" },
        { person: "Houwa (Il)", prefix: "ka-y", verb: "kteb", suffix: "", arabic: "كايكتب" },
        { person: "Hiya (Elle)", prefix: "ka-t", verb: "kteb", suffix: "", arabic: "كاتكتب" },
      ]
    },
    negation: {
      title: "La négation",
      description: "On encadre le verbe avec 'ma-' avant et '-ch' après.",
      examples: [
        { person: "Positif", prefix: "fhem", verb: "t", suffix: "", arabic: "فهمت", translation: "J'ai compris" },
        { person: "Négatif", prefix: "ma-fhem-t", verb: "-ch", suffix: "", arabic: "مافهمتش", translation: "Je n'ai pas compris" },
        { person: "Positif", prefix: "ka-n", verb: "akol", suffix: "", arabic: "كاناكل", translation: "Je mange" },
        { person: "Négatif", prefix: "ma-ka-n", verb: "akol", suffix: "-ch", arabic: "ماكاناكلش", translation: "Je ne mange pas" },
      ]
    },
    future: {
      title: "Le futur",
      description: "On utilise la particule invariable 'ghadi' + le verbe sans 'ka-'.",
      examples: [
        { person: "Ana (Je)", prefix: "ghadi ", verb: "nmchi", suffix: "", arabic: "غادي نمشي", translation: "Je vais partir" },
        { person: "Nta (Tu m.)", prefix: "ghadi ", verb: "tmchi", suffix: "", arabic: "غادي تمشي", translation: "Tu vas partir" },
      ]
    },
    possession: {
      title: "La possession (dyal)",
      description: "Le mot 'dyal' (de) est souvent utilisé pour exprimer l'appartenance.",
      examples: [
        { person: "À moi", prefix: "dyal", verb: "i", suffix: "", arabic: "ديالي", translation: "L-ktab dyali (Mon livre)" },
        { person: "À toi", prefix: "dyal", verb: "ek", suffix: "", arabic: "ديالك", translation: "T-tonobil dyalek (Ta voiture)" },
        { person: "À lui", prefix: "dyal", verb: "o", suffix: "", arabic: "ديالو", translation: "D-dar dyalo (Sa maison)" },
      ]
    }
  };

  const currentRule = rules[activeRule];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full animate-in fade-in duration-300">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">Grammaire Active</h2>
        <p className="text-slate-600">Explorez les mécanismes de la langue.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 justify-center">
        {(Object.keys(rules) as GrammarRule[]).map(rule => (
          <button
            key={rule}
            onClick={() => setActiveRule(rule)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeRule === rule ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {rules[rule].title.split(' ')[1]}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-orange-100 shadow-sm">
        <h3 className="text-2xl font-bold text-orange-600 mb-2">{currentRule.title}</h3>
        <p className="text-slate-600 mb-8 font-medium">{currentRule.description}</p>

        <div className="space-y-4">
          {currentRule.examples.map((ex, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-400 mb-1">{ex.person}</div>
                <div className="flex flex-col">
                  {/* Arabizi logic with highlighting */}
                  {(preferredNotation === 'arabizi' || preferredNotation === 'duo') && (
                    <div className="text-xl font-bold text-slate-800">
                      <span className="text-orange-500">{ex.prefix}</span>
                      <span className="text-slate-800">{ex.verb}</span>
                      <span className="text-orange-500">{ex.suffix}</span>
                    </div>
                  )}
                  {/* Arabic */}
                  {(preferredNotation === 'arabic' || preferredNotation === 'duo') && (
                    <div className="text-2xl font-arabic font-bold text-slate-800 mt-1">
                      {ex.arabic}
                    </div>
                  )}
                  {ex.translation && (
                    <div className="text-slate-500 text-sm italic mt-1">{ex.translation}</div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handlePlay(ex.arabic)}
                className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

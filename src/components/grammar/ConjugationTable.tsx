'use client';

import React, { useState } from 'react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { Volume2 } from 'lucide-react';
import { playAudio } from '../../lib/audio';

type GrammarRule = 'present' | 'past' | 'future' | 'negation' | 'possession';

interface RuleExample {
  person: string;
  prefix: string;
  verb: string;
  suffix: string;
  arabic: string;
  translation?: string;
}

import { MultiLangText } from '../../types/curriculum';
import { getLocalizedText } from '../../lib/i18n/utils';

interface RuleData {
  title: MultiLangText;
  description: MultiLangText;
  examples: RuleExample[];
}

export default function ConjugationTable() {
  const [activeRule, setActiveRule] = useState<GrammarRule>('present');
  const { preferredNotation, soundEnabled } = useAppStore();
  const { t } = useTranslation();

  const handlePlay = (arabicText: string, arabiziText?: string) => {
    playAudio(arabiziText || arabicText, arabicText, soundEnabled);
  };

  const { lang } = useTranslation();

  const gm = t.modules.grammar;
  const localizePerson = (p: string) => {
    const map: Record<string, string> = {
      "Positif": gm.positive, "Négatif": gm.negative,
      "À moi": gm.toMe, "À toi": gm.toYou, "À lui": gm.toHim,
    };
    return map[p] || p;
  };
  const localizeTranslation = (tr: string) => {
    const map: Record<string, string> = {
      "J'ai compris": gm.understood, "Je n'ai pas compris": gm.notUnderstood,
      "Je mange": gm.iEat, "Je ne mange pas": gm.iDontEat,
      "Je vais partir": gm.iWillGo, "Tu vas partir": gm.youWillGo,
    };
    return map[tr] || tr;
  };

  const rules: Record<GrammarRule, RuleData> = {
    present: {
      title: { fr: "Le présent", en: "Present", es: "Presente", ar: "المضارع" },
      description: {
        fr: "On ajoute le préfixe 'ka-' suivi du marqueur de personne (n-, t-, y-).",
        en: "Add the prefix 'ka-' followed by the person marker (n-, t-, y-).",
        es: "Añadimos el prefijo 'ka-' seguido del marcador de persona (n-, t-, y-).",
        ar: "نضيف البادئة 'ka-' متبوعة بعلامة الشخص (n-, t-, y-)."
      },
      examples: [
        { person: "Ana", prefix: "ka-n", verb: "kteb", suffix: "", arabic: "كَانْكْتَبْ", translation: "J'écris" },
        { person: "Nta", prefix: "ka-t", verb: "kteb", suffix: "", arabic: "كَاتْكْتَبْ", translation: "Tu écris (m)" },
        { person: "Nti", prefix: "ka-t", verb: "ketb", suffix: "i", arabic: "كَاتْكْتْبِي", translation: "Tu écris (f)" },
        { person: "Houwa", prefix: "ka-y", verb: "kteb", suffix: "", arabic: "كَايْكْتَبْ", translation: "Il écrit" },
        { person: "Hiya", prefix: "ka-t", verb: "kteb", suffix: "", arabic: "كَاتْكْتَبْ", translation: "Elle écrit" },
        { person: "Hna", prefix: "ka-n", verb: "ketb", suffix: "ou", arabic: "كَانْكْتْبُو", translation: "Nous écrivons" },
        { person: "Ntoma", prefix: "ka-t", verb: "ketb", suffix: "ou", arabic: "كَاتْكْتْبُو", translation: "Vous écrivez" },
        { person: "Houma", prefix: "ka-y", verb: "ketb", suffix: "ou", arabic: "كَايْكْتْبُو", translation: "Ils écrivent" },
      ]
    },
    past: {
      title: { fr: "Le passé", en: "Past", es: "Pasado", ar: "الماضي" },
      description: {
        fr: "Le verbe au passé se conjugue en ajoutant des suffixes de personne (-t, -ti, -at, -na, -tou, -ou).",
        en: "The past tense is conjugated by adding person suffixes (-t, -ti, -at, -na, -tou, -ou).",
        es: "El pasado se conjuga añadiendo sufijos de persona (-t, -ti, -at, -na, -tou, -ou).",
        ar: "يُصرف الفعل في الماضي بإضافة لواحق الشخص (-t, -ti, -at, -na, -tou, -ou)."
      },
      examples: [
        { person: "Ana", prefix: "", verb: "kteb", suffix: "t", arabic: "كْتَبْتْ", translation: "J'ai écrit" },
        { person: "Nta", prefix: "", verb: "kteb", suffix: "ti", arabic: "كْتَبْتِي", translation: "Tu as écrit (m)" },
        { person: "Nti", prefix: "", verb: "kteb", suffix: "ti", arabic: "كْتَبْتِي", translation: "Tu as écrit (f)" },
        { person: "Houwa", prefix: "", verb: "kteb", suffix: "", arabic: "كْتَبْ", translation: "Il a écrit" },
        { person: "Hiya", prefix: "", verb: "ketb", suffix: "at", arabic: "كْتْبَاتْ", translation: "Elle a écrit" },
        { person: "Hna", prefix: "", verb: "kteb", suffix: "na", arabic: "كْتَبْنَا", translation: "Nous avons écrit" },
        { person: "Ntoma", prefix: "", verb: "kteb", suffix: "tou", arabic: "كْتَبْتُو", translation: "Vous avez écrit" },
        { person: "Houma", prefix: "", verb: "ketb", suffix: "ou", arabic: "كْتْبُو", translation: "Ils ont écrit" },
      ]
    },
    future: {
      title: { fr: "Le futur", en: "Future", es: "Futuro", ar: "المستقبل" },
      description: {
        fr: "On utilise la particule 'ghadi' + le verbe sans 'ka-'.",
        en: "Use the particle 'ghadi' + the verb without 'ka-'.",
        es: "Usamos la partícula 'ghadi' + el verbo sin 'ka-'.",
        ar: "نستخدم الأداة 'ghadi' + الفعل بدون 'ka-'."
      },
      examples: [
        { person: "Ana", prefix: "ghadi ", verb: "nkteb", suffix: "", arabic: "غَادِي نْكْتَبْ", translation: "Je vais écrire" },
        { person: "Nta", prefix: "ghadi ", verb: "tkteb", suffix: "", arabic: "غَادِي تْكْتَبْ", translation: "Tu vas écrire (m)" },
        { person: "Nti", prefix: "ghadya ", verb: "tketbi", suffix: "", arabic: "غَادْيَة تْكْتْبِي", translation: "Tu vas écrire (f)" },
        { person: "Houwa", prefix: "ghadi ", verb: "ykteb", suffix: "", arabic: "غَادِي يْكْتَبْ", translation: "Il va écrire" },
        { person: "Ana", prefix: "ghadi ", verb: "nmchi", suffix: "", arabic: "غَادِي نْمْشِي", translation: "Je vais partir" },
        { person: "Nta", prefix: "ghadi ", verb: "tmchi", suffix: "", arabic: "غَادِي تْمْشِي", translation: "Tu vas partir" },
      ]
    },
    negation: {
      title: { fr: "La négation", en: "Negation", es: "Negación", ar: "النفي" },
      description: {
        fr: "On encadre le verbe avec 'ma-' avant et '-ch' après.",
        en: "Frame the verb with 'ma-' before and '-ch' after.",
        es: "Enmarcamos el verbo con 'ma-' antes y '-ch' después.",
        ar: "نضع الفعل بين 'ma-' قبله و '-ch' بعده."
      },
      examples: [
        { person: "Positif", prefix: "", verb: "fhem", suffix: "t", arabic: "فْهَمْتْ", translation: "J'ai compris" },
        { person: "Négatif", prefix: "ma-", verb: "fhem-t", suffix: "-ch", arabic: "مَا فْهَمْتْشْ", translation: "Je n'ai pas compris" },
        { person: "Positif", prefix: "ka-n", verb: "kteb", suffix: "", arabic: "كَانْكْتَبْ", translation: "J'écris" },
        { person: "Négatif", prefix: "ma-ka-n", verb: "kteb", suffix: "-ch", arabic: "مَا كَانْكْتَبْشْ", translation: "Je n'écris pas" },
        { person: "Négatif", prefix: "ma-", verb: "kteb-t", suffix: "-ch", arabic: "مَا كْتَبْتْشْ", translation: "Je n'ai pas écrit" },
        { person: "Positif", prefix: "ka-n", verb: "akol", suffix: "", arabic: "كَا نَاكُلْ", translation: "Je mange" },
        { person: "Négatif", prefix: "ma-ka-n", verb: "akol", suffix: "-ch", arabic: "مَا كَا نَاكُلْشْ", translation: "Je ne mange pas" },
      ]
    },
    possession: {
      title: { fr: "La possession", en: "Possession", es: "Posesión", ar: "الملكية" },
      description: {
        fr: "Le mot 'dyal' (de) est souvent utilisé pour exprimer l'appartenance.",
        en: "The word 'dyal' (of) is often used to express belonging.",
        es: "La palabra 'dyal' (de) se usa a menudo para expresar pertenencia.",
        ar: "تُستخدم كلمة 'dyal' (لـ) غالباً للتعبير عن الانتماء."
      },
      examples: [
        { person: "À moi", prefix: "dyal", verb: "i", suffix: "", arabic: "دْيَالِي", translation: "L-ktab dyali" },
        { person: "À toi", prefix: "dyal", verb: "ek", suffix: "", arabic: "دْيَالَكْ", translation: "T-tonobil dyalek" },
        { person: "À lui", prefix: "dyal", verb: "o", suffix: "", arabic: "دْيَالُو", translation: "D-dar dyalo" },
        { person: "À elle", prefix: "dyal", verb: "ha", suffix: "", arabic: "دْيَالْهَا", translation: "D-dar dyalha" },
        { person: "À nous", prefix: "dyal", verb: "na", suffix: "", arabic: "دْيَالْنَا", translation: "D-dar dyalna" },
      ]
    }
  };

  const currentRule = rules[activeRule];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full animate-in fade-in duration-300">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 mb-2">{t.lessons.grammarTitle}</h2>
        <p className="text-slate-600">{t.lessons.grammarDesc}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 justify-start sm:justify-center">
        {(Object.keys(rules) as GrammarRule[]).map(rule => (
          <button
            key={rule}
            onClick={() => setActiveRule(rule)}
            className={`px-4 sm:px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeRule === rule ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {getLocalizedText(rules[rule].title, lang)}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-orange-100 shadow-sm">
        <h3 className="text-2xl font-bold text-orange-600 mb-2">{getLocalizedText(currentRule.title, lang)}</h3>
        <p className="text-slate-600 mb-8 font-medium">{getLocalizedText(currentRule.description, lang)}</p>

        <div className="space-y-4">
          {currentRule.examples.map((ex, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-400 mb-1">{localizePerson(ex.person)}</div>
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
                    <div className="text-slate-500 text-sm italic mt-1">{localizeTranslation(ex.translation)}</div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handlePlay(ex.arabic, `${ex.prefix}${ex.verb}${ex.suffix}`.trim())}
                className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-blue-500 hover:border-blue-200 shadow-sm transition-all"
                title="Écouter la prononciation"
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

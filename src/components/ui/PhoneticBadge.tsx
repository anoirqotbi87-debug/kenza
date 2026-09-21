import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface PhoneticBadgeProps {
  digit: string;
}

const phoneticExplanations: Record<string, string> = {
  '3': "Son pharyngé ('Ayn). Produit au fond de la gorge, comme si vous étiez chez le médecin et disiez 'Aaaah'.",
  '7': "Son 'H' expiré fortement du fond de la gorge, comme pour faire de la buée sur une vitre.",
  '9': "Son 'Q' guttural (Qaf). Produit très en arrière dans la gorge, plus profond qu'un 'K'.",
  'kh': "Son 'Kh' (Khaa). Comme la jota espagnole ou le 'ch' allemand dans 'Bach'.",
  'gh': "Son 'Gh' (Ghayn). Un 'R' grasseyé très prononcé, comme si vous vous gargarisez."
};

export default function PhoneticBadge({ digit }: PhoneticBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const explanation = phoneticExplanations[digit.toLowerCase()];

  if (!explanation) return <span>{digit}</span>;

  return (
    <span className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md font-bold mx-0.5 hover:bg-orange-200 transition-colors border border-orange-200"
      >
        {digit}
        <Info className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white p-3 rounded-xl shadow-xl text-sm font-medium leading-relaxed">
          {explanation}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
        </div>
      )}
    </span>
  );
}

export function renderArabiziWithBadges(text: string) {
  // Pattern to match 3, 7, 9, kh, gh (case insensitive)
  const regex = /(3|7|9|kh|gh)/gi;
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(regex)) {
          return <PhoneticBadge key={index} digit={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

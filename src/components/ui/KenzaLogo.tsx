'use client';

import React from 'react';

interface KenzaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

const SIZES = {
  xs: { box: 28, text: 'text-xs' },
  sm: { box: 36, text: 'text-sm' },
  md: { box: 44, text: 'text-base' },
  lg: { box: 56, text: 'text-lg' },
  xl: { box: 72, text: 'text-xl' },
};

export const KenzaLogo: React.FC<KenzaLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
}) => {
  const { box, text } = SIZES[size] || SIZES.md;

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Emblème Officiel Vectoriel Pixel-Perfect */}
      <svg
        width={box}
        height={box}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none shadow-sm"
        aria-label="Logo Kenza"
      >
        {/* Squircle Fond Bleu Nuit #142943 */}
        <rect width="100" height="100" rx="26" fill="#142943" />

        {/* Rosace Islamique Zellige 8 branches Dorée #ddb578 */}
        <g stroke="#ddb578" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
          {/* Étoile à 8 branches entrelacée */}
          <path d="M50 14 L62 26 L76 26 L76 40 L88 50 L76 60 L76 74 L62 74 L50 86 L38 74 L24 74 L24 60 L12 50 L24 40 L24 26 L38 26 Z" />
          <path d="M50 24 L68 42 L68 58 L50 76 L32 58 L32 42 Z" />
          <path d="M24 50 L42 32 L58 32 L76 50 L58 68 L42 68 Z" />
        </g>

        {/* Diamant Central Zellige Doré Plein */}
        <path d="M50 44 L56 50 L50 56 L44 50 Z" fill="#ddb578" />

        {/* Lettre Arabe Calligraphiée Dorée ك */}
        <path
          d="M65 39 C62 39 59.5 42 60.5 48 C61.5 53 62 58 60 63 C58 66 52 68 45 68 C35 68 28 64 28 58 C28 52 32 50 33.5 54 C34.5 56.5 37 60 44 60 C50 60 53 57 53 53 C53 45 49 43 49 39 C49 32 57 30 65 31 C67 31 68 33 67 35 C66 37 64 39 65 39 Z"
          fill="#ddb578"
        />
        {/* Courbe majestueuse du Kaf inférieur */}
        <path
          d="M62 61 C64 61 65 62.5 63 65 C58 72 48 74 39 74 C26 74 19 65 19 55 C19 46 25 43 28 47 C30 50 29 55 33 60 C37 64 45 66 54 66 C59 66 61 63 62 61 Z"
          fill="#ddb578"
        />
      </svg>

      {/* Wordmark Optionnel (Police DM Serif Display) */}
      {showWordmark && (
        <div className="flex flex-col text-start">
          <span className={`font-serif font-bold text-[#142943] tracking-[0.16em] leading-tight ${text}`}>
            KENZA
          </span>
          <span className="text-[10px] text-amber-700/80 font-medium tracking-wide">
            la darija, en chemin
          </span>
        </div>
      )}
    </div>
  );
};

export default KenzaLogo;

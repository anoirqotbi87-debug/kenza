'use client';

import React from 'react';
import Link from 'next/link';

interface KenzaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  href?: string;
  className?: string;
  textColor?: string;
  taglineColor?: string;
  hideWordmarkOnMobile?: boolean;
}

export function KenzaLogo({
  size = 'md',
  showWordmark = true,
  href = '/',
  className = '',
  textColor,
  taglineColor,
  hideWordmarkOnMobile = true,
}: KenzaLogoProps) {
  // Dimensions
  const sizeMap = {
    sm: {
      box: 'w-9 h-9',
      radius: 'rounded-[14px]',
      arabicText: 'text-[20px]',
      rosetteSize: 22,
      wordmarkText: 'text-[17px]',
      taglineText: 'text-[9px]',
    },
    md: {
      box: 'w-11 h-11',
      radius: 'rounded-[16px]',
      arabicText: 'text-[24px]',
      rosetteSize: 28,
      wordmarkText: 'text-[19px]',
      taglineText: 'text-[10px]',
    },
    lg: {
      box: 'w-14 h-14',
      radius: 'rounded-[20px]',
      arabicText: 'text-[30px]',
      rosetteSize: 36,
      wordmarkText: 'text-[24px]',
      taglineText: 'text-[12px]',
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Conteneur squircle bleu nuit (#142943) avec rosace dorée et lettre arabe ك */}
      <div
        className={`${currentSize.box} ${currentSize.radius} relative grid place-items-center overflow-hidden bg-[#142943] text-[#f8f5ec] shadow-sm shrink-0 border border-[#ddb578]/30`}
        aria-hidden="true"
      >
        {/* Rosace géométrique marocaine à 8 branches en filigrane doré (#ddb578) */}
        <svg
          className="absolute inset-0 m-auto pointer-events-none opacity-25"
          width={currentSize.rosetteSize}
          height={currentSize.rosetteSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Carré 1 tourné à 0° */}
          <rect x="7" y="7" width="26" height="26" stroke="#ddb578" strokeWidth="1.5" />
          {/* Carré 2 tourné à 45° pour former l'étoile à 8 branches (Khatam) */}
          <rect
            x="7"
            y="7"
            width="26"
            height="26"
            stroke="#ddb578"
            strokeWidth="1.5"
            transform="rotate(45 20 20)"
          />
          {/* Cercle central et diamant intérieur */}
          <circle cx="20" cy="20" r="4.5" stroke="#ddb578" strokeWidth="1.2" />
          <rect
            x="17"
            y="17"
            width="6"
            height="6"
            stroke="#ddb578"
            strokeWidth="1"
            transform="rotate(45 20 20)"
          />
        </svg>

        {/* Lettre arabe ك calligraphiée centrée dorée/ivoire */}
        <span
          className={`font-['Noto_Sans_Arabic',sans-serif] font-bold ${currentSize.arabicText} leading-none text-[#F8F5EC] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-10 -translate-y-[1px]`}
        >
          ك
        </span>

        {/* Losange doré d'accentuation en bas à droite */}
        <i
          className="absolute w-2 h-2 border border-[#ddb578] rounded-[2px] right-[4px] bottom-[4px] rotate-45 pointer-events-none bg-[#ddb578]/20 z-10"
        />
      </div>

      {/* Wordmark KENZA en DM Serif Display et signature */}
      {showWordmark && (
        <div className={`flex flex-col text-left ${hideWordmarkOnMobile ? 'hidden min-[380px]:flex' : 'flex'}`}>
          <span
            className={`font-['DM_Serif_Display',serif] ${currentSize.wordmarkText} tracking-[0.17em] leading-tight block`}
            style={{ color: textColor || '#142943' }}
          >
            KENZA
          </span>
          <span
            className={`${currentSize.taglineText} tracking-[0.045em] block -mt-0.5`}
            style={{ color: taglineColor || '#8a8b83' }}
          >
            la darija, en chemin
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0 flex items-center focus:outline-none" aria-label="Accueil Kenza">
        {content}
      </Link>
    );
  }

  return content;
}

export default KenzaLogo;

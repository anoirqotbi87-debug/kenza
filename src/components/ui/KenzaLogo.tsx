'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '../../store/useAppStore';

interface KenzaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

const SIZES = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
};

export const KenzaLogo: React.FC<KenzaLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
}) => {
  const dimension = SIZES[size] || SIZES.md;
  const { t } = useTranslation();
  const tagline = t.brand?.tagline ?? 'la darija, en chemin';

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <Image
        src="/icons/logo-official.png"
        alt="Kenza Logo"
        width={dimension}
        height={dimension}
        className="rounded-2xl shrink-0 select-none shadow-sm object-contain"
        priority
      />

      {showWordmark && (
        <div className="flex flex-col text-start">
          <span className="font-serif font-bold text-[#142943] tracking-[0.16em] leading-tight text-sm sm:text-base">
            KENZA
          </span>
          <span className="text-[10px] text-amber-700/80 font-medium tracking-wide">
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};

export default KenzaLogo;

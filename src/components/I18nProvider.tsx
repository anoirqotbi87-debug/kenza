'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const uiLanguage = useAppStore((state) => state.uiLanguage);

  useEffect(() => {
    // Apply RTL for Arabic
    if (uiLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = uiLanguage;
    }
  }, [uiLanguage]);

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Synchronise la direction (RTL/LTR) et l'attribut lang du document
 * avec la langue d'interface choisie par l'utilisateur.
 * (Phase 5 — audit UI : support RTL de l'arabe)
 */
export default function DirSync() {
  const uiLanguage = useAppStore((state) => state.uiLanguage);

  useEffect(() => {
    const lang = uiLanguage || 'fr';
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [uiLanguage]);

  return null;
}

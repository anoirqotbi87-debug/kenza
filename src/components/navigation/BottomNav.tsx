'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Compass, Bookmark, Sparkles } from 'lucide-react';
import { useAppStore, useTranslation } from '@/store/useAppStore';

interface BottomNavProps {
  currentView?: string;
  onSelectView?: (view: 'today' | 'path' | 'phrases' | 'review' | 'space') => void;
}

export default function BottomNav({ currentView, onSelectView }: BottomNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { uiLanguage } = useAppStore();
  const { t } = useTranslation();
  const lang = uiLanguage || 'fr';
  const isAr = lang === 'ar';

  const viewParam = searchParams?.get('view');
  const activeView = currentView || viewParam;

  const isHomeActive = pathname === '/' && (!activeView || activeView === 'today');
  const isParcoursActive = pathname === '/etudier' || (pathname === '/' && activeView === 'path');
  const isPhrasesActive = pathname === '/phrases' || (pathname === '/' && activeView === 'phrases');
  const isReviserActive = pathname.startsWith('/revisions') || (pathname === '/' && activeView === 'review');

  const navLabels = {
    home: lang === 'en' ? 'Home' : lang === 'es' ? 'Inicio' : lang === 'ar' ? 'الرئيسية' : 'Accueil',
    parcours: lang === 'en' ? 'Journey' : lang === 'es' ? 'Recorrido' : lang === 'ar' ? 'المسار' : 'Parcours',
    phrases: lang === 'en' ? 'Phrases' : lang === 'es' ? 'Frases' : lang === 'ar' ? 'العبارات' : 'Phrases',
    reviser: lang === 'en' ? 'Review' : lang === 'es' ? 'Repasar' : lang === 'ar' ? 'مراجعة' : 'Réviser',
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/' && onSelectView) {
      e.preventDefault();
      onSelectView('today');
    }
  };

  const handlePhrasesClick = (e: React.MouseEvent) => {
    if (pathname === '/' && onSelectView) {
      e.preventDefault();
      onSelectView('phrases');
    }
  };

  return (
    <nav
      className="mobile-bottom-nav"
      dir={isAr ? 'rtl' : 'ltr'}
      aria-label={t.common.back ? "Navigation principale" : "Main Navigation"}
    >
      <Link
        href="/"
        onClick={handleHomeClick}
        className={isHomeActive ? 'mobile-nav-active' : ''}
        aria-current={isHomeActive ? 'page' : undefined}
      >
        <Home size={19} />
        <span>{navLabels.home}</span>
      </Link>

      <Link
        href="/etudier"
        className={isParcoursActive ? 'mobile-nav-active' : ''}
        aria-current={isParcoursActive ? 'page' : undefined}
      >
        <Compass size={19} />
        <span>{navLabels.parcours}</span>
      </Link>

      <Link
        href="/?view=phrases"
        onClick={handlePhrasesClick}
        className={isPhrasesActive ? 'mobile-nav-active' : ''}
        aria-current={isPhrasesActive ? 'page' : undefined}
      >
        <Bookmark size={19} />
        <span>{navLabels.phrases}</span>
      </Link>

      <Link
        href="/revisions"
        className={isReviserActive ? 'mobile-nav-active' : ''}
        aria-current={isReviserActive ? 'page' : undefined}
      >
        <Sparkles size={19} />
        <span>{navLabels.reviser}</span>
      </Link>
    </nav>
  );
}

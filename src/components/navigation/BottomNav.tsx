'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MessageSquareText, Sparkles } from 'lucide-react';

export interface BottomNavProps {
  currentView?: string;
  onSelectView?: (view: 'today' | 'path' | 'phrases' | 'review' | 'space') => void;
}

export function BottomNav({ currentView, onSelectView }: BottomNavProps = {}) {
  const pathname = usePathname();

  // Masquer systématiquement la BottomNav pendant les leçons actives / parcours d'étude
  if (pathname.startsWith('/etudier')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/parler', label: 'Modules', icon: BookOpen },
    { href: '/phrases', label: 'Phrases', icon: MessageSquareText },
    { href: '/chat', label: 'Chat IA', icon: Sparkles },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' && (!currentView || currentView === 'today');
    }
    if (href === '/parler') {
      return pathname.startsWith('/parler') || (pathname === '/' && currentView === 'path');
    }
    if (href === '/phrases') {
      return pathname.startsWith('/phrases') || (pathname === '/' && currentView === 'phrases');
    }
    if (href === '/chat') {
      return pathname.startsWith('/chat');
    }
    return pathname === href;
  };

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    if (pathname === '/' && onSelectView) {
      if (href === '/') {
        e.preventDefault();
        onSelectView('today');
      } else if (href === '/parler') {
        e.preventDefault();
        onSelectView('path');
      } else if (href === '/phrases') {
        e.preventDefault();
        onSelectView('phrases');
      }
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-[#1C1816]/95 backdrop-blur-md border-t border-amber-200/70 dark:border-amber-900/30 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Navigation principale mobile"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full py-1 px-1 transition-all duration-150 select-none ${
                isActive
                  ? 'text-amber-700 dark:text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300'
              }`}
            >
              <div
                className={`flex items-center justify-center w-11 h-7 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-100/90 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 scale-105'
                    : 'bg-transparent text-stone-400'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'
                  }`}
                />
              </div>
              <span className="text-[11px] font-medium leading-none mt-1 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

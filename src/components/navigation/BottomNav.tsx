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
    { href: '/parler', label: 'Parcours', icon: BookOpen },
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
      } else if (href === '/phrases') {
        e.preventDefault();
        onSelectView('phrases');
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#26211E] border-t border-amber-100 dark:border-amber-900/30 pb-safe shadow-lg">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleItemClick(e, item.href)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

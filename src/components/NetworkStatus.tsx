'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetwork } from '../hooks/useNetwork';
import { useAppStore } from '../store/useAppStore';

export default function NetworkStatus() {
  const isOnline = useNetwork();
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      setShowOnlineAlert(true);
      const timer = setTimeout(() => {
        setShowOnlineAlert(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!hasMounted) return null;

  const offlineText = isAr 
    ? 'وضع عدم الاتصال نشط — الوحدات والمراجعات متاحة بدون اتصال'
    : lang === 'en' 
      ? 'Offline Mode Active — Modules and SRS reviews available offline'
      : 'Mode Hors-Ligne actif — Modules et révisions SRS disponibles sans connexion';

  const onlineText = isAr 
    ? 'تم استعادة الاتصال'
    : lang === 'en'
      ? 'Connection restored'
      : 'Connexion rétablie';

  if (!isOnline) {
    return (
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed top-0 left-0 right-0 z-50 bg-amber-950/90 border-b border-amber-500/30 text-amber-200 py-1.5 px-3 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm transition-all duration-300"
      >
        <WifiOff className="w-4 h-4 shrink-0" />
        <span className="font-medium text-center">{offlineText}</span>
      </div>
    );
  }

  if (showOnlineAlert) {
    return (
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed top-0 left-0 right-0 z-50 bg-emerald-900/90 border-b border-emerald-500/30 text-emerald-200 py-1.5 px-3 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm transition-all duration-300"
      >
        <Wifi className="w-4 h-4 shrink-0" />
        <span className="font-medium text-center">{onlineText}</span>
      </div>
    );
  }

  return null;
}

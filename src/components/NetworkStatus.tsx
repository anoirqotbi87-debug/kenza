'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetwork } from '../hooks/useNetwork';
import { useAppStore, useTranslation } from '../store/useAppStore';

export default function NetworkStatus() {
  const isOnline = useNetwork();
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);
  // True only after hydration, so the banner never renders during SSR.
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const wasOfflineRef = useRef(false);

  const { t } = useTranslation();
  const rawLang = useAppStore((state) => state.uiLanguage || 'fr');
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      return;
    }
    if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      const showTimer = setTimeout(() => setShowOnlineAlert(true), 0);
      const hideTimer = setTimeout(() => setShowOnlineAlert(false), 3000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isOnline]);

  if (!hasMounted) return null;

  const offlineText = t.modules.ui.offlineActive;
  const onlineText = t.modules.ui.onlineRestored;

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

'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useTranslation } from '../../store/useAppStore';

export default function InstallPwaBanner() {
  const { t } = useTranslation();
  const inst = t.modules.install;
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default true so it doesn't flash
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check local storage for dismissal
    const lastDismissed = localStorage.getItem('pwaBannerDismissed');
    if (lastDismissed) {
      const daysSince = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 14) {
        return; // Still dismissed
      }
    }
    setDismissed(false);

    // Detect iOS
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    setIsIOS(isIOSDevice && webkit && !ua.match(/CriOS/i));

    // Detect Standalone (installed)
    const isStand = window.matchMedia('(display-mode: standalone)').matches || 
                   (window.navigator as any).standalone === true;
    setIsStandalone(isStand);

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwaBannerDismissed', Date.now().toString());
    setDismissed(true);
  };

  if (dismissed || isStandalone) return null;
  if (!deferredPrompt && !isIOS) return null; // Can't install

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-800 text-white p-4 rounded-2xl shadow-2xl z-40 flex items-start gap-4 animate-in slide-in-from-bottom-10">
      <div className="bg-blue-500/20 p-2 rounded-xl shrink-0">
        <Download className="w-6 h-6 text-blue-400" />
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-bold text-sm mb-1">{inst.title}</h4>
        {isIOS ? (
          <p className="text-xs text-slate-300 leading-tight">
            {inst.iosHintA} <Share className="inline w-3 h-3 mx-1" /> {inst.iosHintB}
          </p>
        ) : (
          <p className="text-xs text-slate-300 leading-tight mb-3">
            {inst.androidHint}
          </p>
        )}
        
        {!isIOS && deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {inst.button}
          </button>
        )}
      </div>
      <button onClick={handleDismiss} className="p-1 hover:bg-slate-700 rounded-full shrink-0">
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
}

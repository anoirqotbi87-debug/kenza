'use client';

import React, { useEffect, useState } from 'react';
import { track } from '@/lib/tracking';

export function InstallApkModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'utilisateur a déjà fermé ou téléchargé
    try {
      const isDismissed = localStorage.getItem('kenza_apk_modal_dismissed');
      if (isDismissed) return;
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }

    // 2. Détecter Android et exclure le mode déjà installé (standalone)
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;

    const isAndroid = /android/i.test(navigator.userAgent || '');
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      Boolean((navigator as unknown as { standalone?: boolean }).standalone);

    if (isAndroid && !isStandalone) {
      // Délai d'apparition agréable de 2.5 secondes pour ne pas agresser
      const timer = setTimeout(() => setIsOpen(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('kenza_apk_modal_dismissed', 'true');
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    try {
      localStorage.setItem('kenza_apk_modal_dismissed', 'true');
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }
    track('apk_download_clicked', { source: 'floating_modal' });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apk-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm bg-[#FFFEFA] rounded-2xl p-5 shadow-2xl border border-amber-200/60 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0818 12 8.0818c-1.8533 0-3.5902.3298-5.1368.868L4.8409 5.4468a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
            </svg>
          </div>
          <div>
            <h3 id="apk-modal-title" className="text-sm font-bold text-[#142943]">
              Application Android Kenza
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Installez l&apos;application officielle pour un accès direct et une écoute audio plus fluide.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-center"
          >
            Annuler
          </button>
          <a
            href="/downloads/kenza-v1.0.apk"
            download="kenza-v1.0.apk"
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl bg-[#142943] text-white text-xs font-semibold hover:bg-[#1f3a5f] transition-colors text-center shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Télécharger</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default InstallApkModal;

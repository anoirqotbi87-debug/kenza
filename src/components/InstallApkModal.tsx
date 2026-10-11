'use client';

import React, { useEffect, useState } from 'react';
import { track } from '@/lib/tracking';
import { KenzaLogo } from '@/components/ui/KenzaLogo';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-sm bg-[#FFFEFA] rounded-2xl p-5 shadow-2xl border border-amber-200/70 max-h-[85vh] flex flex-col justify-between">
        {/* Bouton croix en haut à droite */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Contenu */}
        <div className="flex items-start gap-3.5 pr-6 mb-4">
          <KenzaLogo size="sm" showWordmark={false} href="" />
          <div>
            <h3 id="apk-modal-title" className="text-sm font-bold text-[#142943]">
              Application Android Kenza
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Installez l&apos;application officielle pour un accès direct et une écoute audio plus fluide.
            </p>
          </div>
        </div>

        {/* Boutons immédiatement visibles sans scroll */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
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

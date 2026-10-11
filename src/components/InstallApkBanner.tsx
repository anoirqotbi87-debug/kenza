'use client';

import React, { useEffect, useState } from 'react';
import { track } from '@/lib/tracking';
import { KenzaLogo } from '@/components/ui/KenzaLogo';

/**
 * Bannière flottante en bas pour Android invitant au téléchargement direct de l'APK officiel.
 * N'apparaît que sur Android hors mode PWA installée, sauf si l'utilisateur l'a fermée.
 */
export function InstallApkBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'utilisateur a déjà fermé la bannière dans localStorage
    try {
      const isDismissed = localStorage.getItem('kenza_apk_banner_dismissed');
      if (isDismissed) return;
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }

    // 2. Détecter Android et exclure le mode déjà installé (standalone)
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;

    const isAndroid = /Android/i.test(navigator.userAgent || '');
    const isStandalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      Boolean((navigator as unknown as { standalone?: boolean }).standalone);

    if (isAndroid && !isStandalone) {
      // Délai agréable de 2 secondes avant affichage
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('kenza_apk_banner_dismissed', Date.now().toString());
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }
    setIsOpen(false);
  };

  const handleDownload = () => {
    try {
      localStorage.setItem('kenza_apk_banner_dismissed', Date.now().toString());
    } catch {
      // Ignorer si localStorage n'est pas accessible
    }
    track('apk_download_clicked', { source: 'bottom_banner' });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      role="region"
      aria-label="Application Android Kenza"
      className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 bg-[#142943] text-white border border-amber-400/20 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        {/* En-tête : Logo officiel Kenza + Titre */}
        <div className="flex items-center gap-2.5">
          <KenzaLogo size="sm" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Application Android Kenza
          </h3>
        </div>

        {/* Bouton croix de fermeture */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-7 h-7 -mr-1 -mt-1 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
        Téléchargez l&apos;application officielle pour un accès direct et une écoute audio plus fluide.
      </p>

      {/* Bouton principal de téléchargement direct de l'APK */}
      <a
        href="/downloads/kenza-v1.0.apk"
        download="kenza-v1.0.apk"
        onClick={handleDownload}
        className="w-full mt-3 py-2.5 px-4 bg-[#ddb578] hover:bg-[#c9a265] text-[#142943] font-bold rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2"
      >
        <span>Télécharger l&apos;APK (v1.0)</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
      </a>
    </aside>
  );
}

export default InstallApkBanner;

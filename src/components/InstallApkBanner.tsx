'use client';

import React, { useEffect, useState } from 'react';
import { track } from '@/lib/tracking';

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
        {/* En-tête : Icône robot Android / téléchargement dorée + Titre */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ddb578]/15 border border-[#ddb578]/40 flex items-center justify-center text-[#ddb578] shrink-0">
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0818 12 8.0818c-1.8533 0-3.5902.3298-5.1368.868L4.8409 5.4468a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
            </svg>
          </div>
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

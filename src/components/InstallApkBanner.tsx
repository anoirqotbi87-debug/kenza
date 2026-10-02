'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { track } from '@/lib/tracking';

const emptySubscribe = () => () => {};

function subscribeDisplayMode(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia('(display-mode: standalone)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

export default function InstallApkBanner() {
  const isAndroid = useSyncExternalStore(
    emptySubscribe,
    () => (typeof navigator !== 'undefined' ? /android/i.test(navigator.userAgent || '') : false),
    () => false
  );

  const isStandalone = useSyncExternalStore(
    subscribeDisplayMode,
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(display-mode: standalone)').matches : false),
    () => false
  );

  const [showGuide, setShowGuide] = useState(false);

  // Ne pas afficher si l'utilisateur n'est pas sous Android ou s'il est déjà dans l'application installée
  if (!isAndroid || isStandalone) {
    return null;
  }

  const handleDownload = () => {
    track('apk_download_clicked', { source: 'web_banner' });
  };

  return (
    <div className="bg-[#0B2545] border-b border-[#C59B27]/30 text-white px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#134074] flex items-center justify-center text-[#C59B27] shrink-0 border border-[#C59B27]/40">
            {/* Icône Android */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0818 12 8.0818c-1.8533 0-3.5902.3298-5.1368.868L4.8409 5.4468a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Installer l&apos;application Android Kenza</p>
            <p className="text-xs text-gray-300">Expérience plein écran, audio natif et mode hors-ligne (2.8 Mo)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/downloads/kenza-v1.0.apk"
            download="kenza-v1.0.apk"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#C59B27] hover:bg-[#b0891f] text-[#0B2545] font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
          >
            Télécharger (.APK)
          </a>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-gray-300 hover:text-white underline px-2 py-1"
            aria-label="Aide à l'installation"
          >
            {showGuide ? 'Fermer aide' : 'Comment installer ?'}
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-200 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#134074] text-white flex items-center justify-center font-bold shrink-0">1</span>
            <span>Cliquez sur Télécharger ci-dessus.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#134074] text-white flex items-center justify-center font-bold shrink-0">2</span>
            <span>Si Android affiche une alerte de sécurité, choisissez <strong>« Télécharger quand même »</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#134074] text-white flex items-center justify-center font-bold shrink-0">3</span>
            <span>Ouvrez le fichier téléchargé et appuyez sur <strong>« Installer »</strong>.</span>
          </div>
        </div>
      )}
    </div>
  );
}

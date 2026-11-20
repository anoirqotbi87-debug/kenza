'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { track } from '@/lib/tracking';
import { useAppStore } from '@/store/useAppStore';

const I18N = {
  fr: {
    kicker: 'APPLICATION ANDROID',
    title: 'Application Officielle (APK v1.6)',
    desc: 'Installez directement Kenza sur votre appareil Android pour une expérience native plein écran, audio fluide et accès hors-ligne (2.6 Mo).',
    btn: "Télécharger l'APK (v1.6)",
  },
  en: {
    kicker: 'ANDROID APPLICATION',
    title: 'Official Application (APK v1.6)',
    desc: 'Install Kenza directly on your Android device for a native full-screen experience, smooth audio, and offline access (2.6 MB).',
    btn: 'Download APK (v1.6)',
  },
  es: {
    kicker: 'APLICACIÓN ANDROID',
    title: 'Aplicación Oficial (APK v1.6)',
    desc: 'Instala Kenza directamente en tu dispositivo Android para una experiencia nativa en pantalla completa, audio fluido y acceso sin conexión (2.6 MB).',
    btn: 'Descargar APK (v1.6)',
  },
  ar: {
    kicker: 'تطبيق أندرويد',
    title: 'التطبيق الرسمي (APK v1.6)',
    desc: 'قم بتثبيت كنزة مباشرة على جهاز الأندرويد الخاص بك لتجربة أصلية بشاشة كاملة، وصوت سلس، ووصول دون إنترنت (2.6 ميجابايت).',
    btn: 'تحميل ملف APK (v1.6)',
  },
};

export default function DownloadApkCard() {
  const uiLanguage = useAppStore((s) => s.uiLanguage || 'fr');
  const lang = (uiLanguage in I18N ? uiLanguage : 'fr') as keyof typeof I18N;
  const isAr = lang === 'ar';
  const text = I18N[lang];

  const handleDownload = () => {
    track('apk_download_clicked', { source: 'space_card' });
  };

  return (
    <article className="data-card" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="data-card-heading">
        <span className="data-icon" style={{ backgroundColor: '#134074', color: '#C59B27' }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0818 12 8.0818c-1.8533 0-3.5902.3298-5.1368.868L4.8409 5.4468a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.152.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
          </svg>
        </span>
        <div>
          <span className="mini-kicker">{text.kicker}</span>
          <h3>{text.title}</h3>
        </div>
      </div>
      <p>
        {text.desc}
      </p>
      <div className="pt-2">
        <a
          href="/downloads/kenza-v1.6.apk"
          download="kenza-v1.6.apk"
          onClick={handleDownload}
          className="outline-button inline-flex items-center gap-2"
        >
          <Download size={14} className={isAr ? 'rtl:rotate-180' : ''} />
          <span>{text.btn}</span>
        </a>
      </div>
    </article>
  );
}

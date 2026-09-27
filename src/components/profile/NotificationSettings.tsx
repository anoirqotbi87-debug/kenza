'use client';

import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAppStore } from '../../store/useAppStore';
import { Bell, BellOff, BellRing, Info, Share, PlusSquare } from 'lucide-react';

export default function NotificationSettings() {
  const { isSupported, permission, isIOS, isStandalone, requestPermission, sendTestNotification } = useNotifications();
  const { uiLanguage } = useAppStore();
  
  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');

  if (!isSupported) {
    return null;
  }

  // Handle iOS specific hurdle (requires PWA installation on iOS to enable Web Push)
  if (isIOS && !isStandalone) {
    return (
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              {isAr ? 'تفعيل الإشعارات' : 'Activer les notifications'}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {isAr 
                ? 'على iPhone، يجب إضافة KENZA إلى شاشتك الرئيسية لتلقي تذكيرات المراجعة.' 
                : 'Sur iPhone, ajoutez KENZA à votre écran d\'accueil pour activer les rappels.'}
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-2 text-sm text-slate-700">
              {isAr ? 'اضغط على' : 'Appuyez sur'} <Share className="w-4 h-4 mx-1 text-blue-600" /> 
              {isAr ? 'ثم' : 'puis'} <strong>{isAr ? '"على الشاشة الرئيسية"' : '"Sur l\'écran d\'accueil"'}</strong> <PlusSquare className="w-4 h-4 mx-1 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${permission === 'granted' ? 'bg-emerald-100 text-emerald-600' : permission === 'denied' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {permission === 'granted' ? <BellRing className="w-5 h-5" /> : permission === 'denied' ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">
            {isAr ? 'التذكيرات والإشعارات' : 'Rappels & Notifications'}
          </h3>
          <p className="text-sm text-slate-500">
            {isAr ? 'حافظ على سلسلة التعلم الخاصة بك' : 'Préservez votre série d\'apprentissage'}
          </p>
        </div>
      </div>

      {permission === 'default' && (
        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
          <p className="text-slate-700 text-sm mb-4 leading-relaxed">
            {isAr 
              ? 'احصل على تذكير يومي لحفظ سلسلتك 🔥 ومراجعة كلماتك في الوقت المناسب مع نظام SRS.'
              : 'Recevez un rappel quotidien pour préserver votre série 🔥 et réviser vos mots du jour avec le SRS.'}
          </p>
          <button
            onClick={requestPermission}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            {isAr ? 'تفعيل التذكيرات' : 'Activer les rappels'}
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            {isAr ? 'التذكيرات مفعلة' : 'Rappels actifs'}
          </div>
          <button
            onClick={sendTestNotification}
            className="w-full sm:w-auto bg-white border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm"
          >
            {isAr ? 'إرسال إشعار تجريبي' : 'Tester sur cet appareil'}
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-50/50 rounded-2xl p-5 border border-red-100">
          <p className="text-red-700 text-sm font-medium mb-1">
            {isAr ? 'الإشعارات محظورة' : 'Notifications bloquées'}
          </p>
          <p className="text-slate-600 text-sm">
            {isAr 
              ? 'لقد قمت بحظر الإشعارات. يرجى تفعيلها من إعدادات متصفحك إذا كنت ترغب في تلقي التذكيرات.'
              : 'Vous avez bloqué les notifications. Veuillez les réactiver dans les paramètres de votre navigateur si vous souhaitez recevoir des rappels.'}
          </p>
        </div>
      )}
    </div>
  );
}

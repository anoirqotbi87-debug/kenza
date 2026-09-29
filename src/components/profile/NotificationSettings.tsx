'use client';

import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAppStore } from '../../store/useAppStore';
import { Bell, BellOff, BellRing, Info, Share, PlusSquare } from 'lucide-react';

const NS_STR = {
  fr: { enableNotif: "Activer les notifications", iosHint: "Sur iPhone, ajoutez KENZA à votre écran d'accueil pour activer les rappels.",
    press: "Appuyez sur", then: "puis", homeScreen: "\"Sur l'écran d'accueil\"",
    remindersTitle: "Rappels & Notifications", keepStreak: "Préservez votre série d'apprentissage",
    dailyReminder: "Recevez un rappel quotidien pour préserver votre série 🔥 et réviser vos mots du jour avec le SRS.",
    enableReminders: "Activer les rappels", remindersActive: "Rappels actifs", testDevice: "Tester sur cet appareil",
    blocked: "Notifications bloquées",
    blockedHint: "Vous avez bloqué les notifications. Veuillez les réactiver dans les paramètres de votre navigateur si vous souhaitez recevoir des rappels." },
  en: { enableNotif: "Enable notifications", iosHint: "On iPhone, add KENZA to your home screen to enable reminders.",
    press: "Tap", then: "then", homeScreen: "\"Add to Home Screen\"",
    remindersTitle: "Reminders & Notifications", keepStreak: "Keep your learning streak alive",
    dailyReminder: "Get a daily reminder to protect your streak 🔥 and review your words on time with SRS.",
    enableReminders: "Enable reminders", remindersActive: "Reminders active", testDevice: "Test on this device",
    blocked: "Notifications blocked",
    blockedHint: "You have blocked notifications. Please re-enable them in your browser settings if you want to receive reminders." },
  es: { enableNotif: "Activar notificaciones", iosHint: "En iPhone, añade KENZA a tu pantalla de inicio para activar los recordatorios.",
    press: "Pulsa", then: "luego", homeScreen: "\"Añadir a pantalla de inicio\"",
    remindersTitle: "Recordatorios y Notificaciones", keepStreak: "Conserva tu racha de aprendizaje",
    dailyReminder: "Recibe un recordatorio diario para mantener tu racha 🔥 y repasar tus palabras con el SRS.",
    enableReminders: "Activar recordatorios", remindersActive: "Recordatorios activos", testDevice: "Probar en este dispositivo",
    blocked: "Notificaciones bloqueadas",
    blockedHint: "Has bloqueado las notificaciones. Reactívalas en los ajustes de tu navegador si quieres recibir recordatorios." },
  ar: { enableNotif: "تفعيل الإشعارات", iosHint: "على iPhone، أضف كينزا إلى شاشتك الرئيسية لتلقي التذكيرات.",
    press: "اضغط على", then: "ثم", homeScreen: "\"إلى الشاشة الرئيسية\"",
    remindersTitle: "التذكيرات والإشعارات", keepStreak: "حافظ على سلسلة التعلم",
    dailyReminder: "احصل على تذكير يومي للحفاظ على سلسلتك 🔥 ومراجعة كلماتك في وقتها مع نظام SRS.",
    enableReminders: "تفعيل التذكيرات", remindersActive: "التذكيرات مفعلة", testDevice: "تجربة على هذا الجهاز",
    blocked: "الإشعارات محظورة",
    blockedHint: "لقد قمت بحظر الإشعارات. يرجى تفعيلها من إعدادات متصفحك إذا كنت ترغب في تلقي التذكيرات." }
};
function nsS(lang: string) {
  const k = (lang === 'en' || lang === 'es' || lang === 'ar') ? lang : 'fr';
  return (NS_STR as Record<string, typeof NS_STR.fr>)[k];
}

export default function NotificationSettings() {
  const { isSupported, permission, isIOS, isStandalone, requestPermission, sendTestNotification } = useNotifications();
  const { uiLanguage } = useAppStore();
  
  const rawLang = uiLanguage || 'fr';
  const lang = String(rawLang).toLowerCase();
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const S = nsS(lang);

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
              {isAr ? 'تفعيل الإشعارات' : S.enableNotif}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {isAr 
                ? 'على iPhone، يجب إضافة KENZA إلى شاشتك الرئيسية لتلقي تذكيرات المراجعة.' 
                : 'S.iosHint'}
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-2 text-sm text-slate-700">
              {isAr ? 'اضغط على' : S.press} <Share className="w-4 h-4 mx-1 text-blue-600" /> 
              {isAr ? 'ثم' : S.then} <strong>{isAr ? '"على الشاشة الرئيسية"' : S.homeScreen}</strong> <PlusSquare className="w-4 h-4 mx-1 text-slate-400" />
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
            {isAr ? 'التذكيرات والإشعارات' : S.remindersTitle}
          </h3>
          <p className="text-sm text-slate-500">
            {isAr ? 'حافظ على سلسلة التعلم الخاصة بك' : 'S.keepStreak'}
          </p>
        </div>
      </div>

      {permission === 'default' && (
        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
          <p className="text-slate-700 text-sm mb-4 leading-relaxed">
            {isAr 
              ? 'احصل على تذكير يومي لحفظ سلسلتك 🔥 ومراجعة كلماتك في الوقت المناسب مع نظام SRS.'
              : S.dailyReminder}
          </p>
          <button
            onClick={requestPermission}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            {isAr ? 'تفعيل التذكيرات' : S.enableReminders}
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            {isAr ? 'التذكيرات مفعلة' : S.remindersActive}
          </div>
          <button
            onClick={sendTestNotification}
            className="w-full sm:w-auto bg-white border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm text-sm"
          >
            {isAr ? 'إرسال إشعار تجريبي' : S.testDevice}
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-red-50/50 rounded-2xl p-5 border border-red-100">
          <p className="text-red-700 text-sm font-medium mb-1">
            {isAr ? 'الإشعارات محظورة' : S.blocked}
          </p>
          <p className="text-slate-600 text-sm">
            {isAr 
              ? 'لقد قمت بحظر الإشعارات. يرجى تفعيلها من إعدادات متصفحك إذا كنت ترغب في تلقي التذكيرات.'
              : S.blockedHint}
          </p>
        </div>
      )}
    </div>
  );
}

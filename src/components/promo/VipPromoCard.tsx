'use client';

import React, { useState } from 'react';
import { Ticket, Crown, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useAppStore } from '@/store/useAppStore';
import { resetAudioQuota } from '@/lib/audioQuota';

interface VipPromoCardProps {
  user: User | null;
  isPremium: boolean;
  onToast?: (message: string) => void;
}

const I18N = {
  fr: {
    kicker: 'ACCÈS PRIVILÈGE',
    title: '🎟️ Code d\'accès VIP / Promotionnel',
    desc: 'Saisissez votre code pour débloquer l\'accès Premium sans frais.',
    placeholder: 'Ex: VIPEIDER',
    btnActivate: 'Activer',
    btnLoading: 'Activation...',
    vipKicker: 'PRIVILÈGE EXCLUSIF',
    vipTitle: '👑 Accès VIP Premium Actif',
    vipBadge: 'PRO ILLIMITÉ',
    vipDesc:
      'Votre compte bénéficie de l\'accès Premium intégral à vie : modules B1 & B2 complets, pratique orale et IA illimitée, audio haute fidélité et passeport culturel certifié.',
    vipFooter: 'Accès Premium débloqué à vie sans renouvellement.',
    errEmpty: 'Veuillez renseigner un code promotionnel.',
    errAuth: 'Connectez-vous à votre compte pour débloquer votre accès VIP.',
    errNetwork: 'Une erreur de connexion est survenue. Veuillez vérifier votre connexion.',
    errDefault: 'Code promotionnel invalide ou expiré.',
    successMsg: 'Code VIP activé ! Votre accès Premium est débloqué.',
    toastSuccess: '👑 Accès VIP débloqué avec succès !',
    loginHint: 'Connectez-vous avant d\'activer votre code pour lier le compte VIP.',
  },
  en: {
    kicker: 'EXCLUSIVE ACCESS',
    title: '🎟️ VIP / Promo Access Code',
    desc: 'Enter your code to unlock full Premium access for free.',
    placeholder: 'Ex: VIPEIDER',
    btnActivate: 'Activate',
    btnLoading: 'Activating...',
    vipKicker: 'EXCLUSIVE PRIVILEGE',
    vipTitle: '👑 VIP Premium Access Active',
    vipBadge: 'UNLIMITED PRO',
    vipDesc:
      'Your account enjoys full lifetime Premium access: complete B1 & B2 modules, unlimited speaking & AI practice, high-fidelity audio, and certified cultural passport.',
    vipFooter: 'Lifetime Premium access unlocked without renewal.',
    errEmpty: 'Please enter a promo code.',
    errAuth: 'Sign in to your account to unlock your VIP access.',
    errNetwork: 'A connection error occurred. Please check your connection.',
    errDefault: 'Invalid or expired promo code.',
    successMsg: 'VIP code activated! Your Premium access is unlocked.',
    toastSuccess: '👑 VIP access unlocked successfully!',
    loginHint: 'Sign in before activating your code to link your VIP account.',
  },
  es: {
    kicker: 'ACCESO EXCLUSIVO',
    title: '🎟️ Código de acceso VIP / Promocional',
    desc: 'Introduce tu código para desbloquear el acceso Premium gratis.',
    placeholder: 'Ex: VIPEIDER',
    btnActivate: 'Activar',
    btnLoading: 'Activando...',
    vipKicker: 'PRIVILEGIO EXCLUSIVO',
    vipTitle: '👑 Acceso VIP Premium Activo',
    vipBadge: 'PRO ILIMITADO',
    vipDesc:
      'Tu cuenta disfruta de acceso Premium completo de por vida: módulos B1 y B2 completos, práctica oral e IA ilimitada, audio de alta fidelidad y pasaporte cultural certificado.',
    vipFooter: 'Acceso Premium de por vida desbloqueado sin renovación.',
    errEmpty: 'Por favor introduce un código promocional.',
    errAuth: 'Inicia sesión en tu cuenta para desbloquear tu acceso VIP.',
    errNetwork: 'Ocurrió un error de conexión. Por favor comprueba tu conexión.',
    errDefault: 'Código promocional inválido o caducado.',
    successMsg: '¡Código VIP activado! Tu acceso Premium está desbloqueado.',
    toastSuccess: '👑 ¡Acceso VIP desbloqueado con éxito!',
    loginHint: 'Inicia sesión antes de activar tu código para vincular tu cuenta VIP.',
  },
  ar: {
    kicker: 'وصول حصري',
    title: '🎟️ رمز الوصول الخاص / الترويجي',
    desc: 'أدخل الرمز الخاص بك لتفعيل اشتراك بريميوم مجاناً.',
    placeholder: 'Ex: VIPEIDER',
    btnActivate: 'تفعيل',
    btnLoading: 'جاري التفعيل...',
    vipKicker: 'امتياز حصري',
    vipTitle: '👑 حساب VIP بريميوم مفعل',
    vipBadge: 'برو غير محدود',
    vipDesc:
      'يتمتع حسابك بوصول بريميوم كامل مدى الحياة: وحدات B1 وB2 كاملة، تدريب صوتي وذكاء اصطناعي غير محدود، صوت عالي الدقة وجواز سفر ثقافي معتمد.',
    vipFooter: 'تم تفعيل وصول بريميوم مدى الحياة بدون تجديد.',
    errEmpty: 'يرجى إدخال رمز ترويجي.',
    errAuth: 'سجّل الدخول إلى حسابك لتفعيل وصولك الخاص VIP.',
    errNetwork: 'حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.',
    errDefault: 'الرمز الترويجي غير صالح أو منتهي الصلاحية.',
    successMsg: 'تم تفعيل رمز VIP! تم فتح وصول بريميوم الخاص بك.',
    toastSuccess: '👑 تم تفعيل الوصول الخاص VIP بنجاح!',
    loginHint: 'سجّل الدخول قبل تفعيل الرمز لربطه بحسابك الخاص.',
  },
};

export default function VipPromoCard({ user, isPremium, onToast }: VipPromoCardProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);
  const setIsPremium = useAppStore((s) => s.setIsPremium);
  const setAudioQuotaExceeded = useAppStore((s) => s.setAudioQuotaExceeded);

  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as keyof typeof I18N;
  const strings = I18N[langKey];
  const isRtl = langKey === 'ar';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage(strings.errEmpty);
      return;
    }

    if (!user || !user.id) {
      setErrorMessage(strings.errAuth);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: trimmedCode,
          userId: user.id,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || strings.errDefault);
        setIsLoading(false);
        return;
      }

      // Succès : Mise à jour immédiate du store local Zustand et levée absolue de tout quota
      setIsPremium(true);
      setAudioQuotaExceeded(false);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kenza_vip_active', 'true');
          resetAudioQuota(localStorage, new Date());
        } catch {}
      }

      const successMsg = data.message || strings.successMsg;
      setSuccessMessage(successMsg);
      setCode('');
      if (onToast) {
        onToast(strings.toastSuccess);
      }
    } catch (err: unknown) {
      console.error('[VipPromoCard Error]:', err);
      setErrorMessage(strings.errNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. État déjà Premium : Badge valorisant VIP
  if (isPremium) {
    return (
      <article
        id="tour-space-vip-card"
        data-tour="space-vip"
        dir={isRtl ? 'rtl' : 'ltr'}
        className="vip-promo-card data-card bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40"
      >
        <div className="data-card-heading">
          <span className="data-icon bg-amber-500 text-white shadow-sm shrink-0">
            <Crown size={18} />
          </span>
          <div>
            <span className="mini-kicker text-amber-800 font-bold">{strings.vipKicker}</span>
            <h3 className="text-amber-900 flex items-center gap-2 flex-wrap">
              <span>{strings.vipTitle}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {strings.vipBadge}
              </span>
            </h3>
          </div>
        </div>
        <p className="text-amber-900/90 text-sm mt-1">
          {strings.vipDesc}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-800">
          <Sparkles size={15} className="text-amber-600 shrink-0" />
          <span>{strings.vipFooter}</span>
        </div>
      </article>
    );
  }

  // 2. Formulaire de saisie du Code VIP
  return (
    <article
      id="tour-space-vip-card"
      data-tour="space-vip"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="vip-promo-card data-card border border-amber-200/60 hover:border-amber-300/80 transition-colors"
    >
      <div className="data-card-heading">
        <span className="data-icon bg-[#142943] text-amber-400 shrink-0">
          <Ticket size={18} />
        </span>
        <div>
          <span className="mini-kicker text-amber-700">{strings.kicker}</span>
          <h3 className="text-[#142943]">{strings.title}</h3>
        </div>
      </div>

      <p className="text-slate-600 text-sm mt-1">
        {strings.desc}
      </p>

      {/* Bannière de Succès */}
      {successMessage && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-sm animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMessage}</div>
        </div>
      )}

      {/* Bannière d'Erreur */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={strings.placeholder}
              disabled={isLoading}
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 uppercase font-mono tracking-wider text-sm font-semibold text-[#142943] placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal transition-all outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#142943] hover:bg-[#1a3556] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{strings.btnLoading}</span>
              </>
            ) : (
              <span>{strings.btnActivate}</span>
            )}
          </button>
        </div>

        {!user && (
          <p className="text-xs text-amber-700/90 flex items-center gap-1.5 mt-1">
            <AlertCircle size={13} className="shrink-0" />
            <span>{strings.loginHint}</span>
          </p>
        )}
      </form>
    </article>
  );
}

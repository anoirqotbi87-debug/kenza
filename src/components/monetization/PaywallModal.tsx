'use client';

import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, BookOpen, Headphones, Award, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { trackEvent } from '../../utils/analytics';
import { supabase } from '../../lib/supabase';

interface PaywallModalProps {
  onClose: () => void;
  source?: string;
}

export default function PaywallModal({ onClose, source = 'direct' }: PaywallModalProps) {
  const { setIsPremium } = useAppStore();
  const { t } = useTranslation();
  const pw = t.modules.paywall;
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [currency, setCurrency] = useState<'EUR' | 'MAD'>('EUR');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    trackEvent('paywall_modal_opened', { source });
  }, [source]);

  const prices = {
    EUR: {
      yearlyPerMonth: '4,90 €',
      yearlyTotal: '59 € / an',
      monthlyPrice: '9,00 €',
      currencySymbol: '€',
    },
    MAD: {
      yearlyPerMonth: '49 DH',
      yearlyTotal: '590 DH / an',
      monthlyPrice: '90 DH',
      currencySymbol: 'DH',
    },
  };

  const currentPricing = prices[currency];

  const handleSubscribe = async () => {
    trackEvent('plan_subscribed', { billingCycle, currency, source });
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          billingCycle,
          currency,
          source,
          email: session?.user?.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || pw.errorInit);
      }

      if (data.url) {
        // Redirection sécurisée vers la page Stripe Checkout
        window.location.href = data.url;
        return;
      }

      if (data.simulated) {
        // Simulation en local ou sans clé secrète Stripe renseignée
        setIsPremium(true);
        alert(pw.upgradeSuccess);
        onClose();
      }
    } catch (err) {
      console.error('[Paywall Checkout Error]:', err);
      setErrorMessage(err instanceof Error ? err.message : pw.errorRetry);
    } finally {
      setLoading(false);
    }
  };

  // Titres et accroches contextuelles selon la provenance (source)
  const getContextualContent = () => {
    if (source.includes('module') || source === 'module_locked') {
      return {
        kicker: `— ${pw.advancedPath}`,
        title: pw.unlockB1B2,
        subtitle: pw.advancedDesc,
      };
    }
    if (source.includes('ai') || source.includes('roleplay') || source === 'ai_quota_exceeded') {
      return {
        kicker: `— ${pw.aiImmersion}`,
        title: pw.unlimitedAi,
        subtitle: pw.aiSubtitle,
      };
    }
    return {
      kicker: `— ${pw.culturalKicker}`,
      title: pw.masterDarija,
      subtitle: pw.culturalSubtitle,
    };
  };

  const headerInfo = getContextualContent();

  return (
    <div className="fixed inset-0 z-[100] bg-[#1B2A4A]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-[#FDFCF8] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] flex flex-col md:flex-row relative my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton Fermer - sticky sur mobile (<380px) pour rester toujours accessible */}
        <button 
          onClick={onClose}
          className="sticky top-3.5 right-3.5 z-50 self-end -mb-10 mr-3.5 p-2 rounded-full bg-[#F7F3EA] hover:bg-[#E8E2D5] text-[#1B2A4A] transition-colors border border-[#E8E2D5] shadow-md md:absolute md:top-3.5 md:right-3.5 md:m-0"
          aria-label={pw.closeLabel}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Volet Gauche : Identité éditoriale & Valeur (Inspiré du Passeport Culturel) */}
        <div className="bg-[#1B2A4A] text-[#FDFCF8] p-6 sm:p-8 md:p-10 md:w-1/2 flex flex-col justify-between relative overflow-hidden">
          {/* Motif géométrique discret */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 10px 10px, #C9A05C 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#C9A05C]/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Badge Kicker Or */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A05C]/20 border border-[#C9A05C]/40 text-[#C9A05C] text-xs font-bold tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>{headerInfo.kicker}</span>
            </div>

            {/* Titre Serif */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FDFCF8] leading-tight">
              {headerInfo.title}
            </h2>

            {/* Accroche */}
            <p className="text-xs sm:text-sm text-[#E8E2D5]/85 leading-relaxed">
              {headerInfo.subtitle}
            </p>

            {/* Avantages exclusifs */}
            <ul className="space-y-3 pt-2 text-xs sm:text-sm">
              {[
                { icon: BookOpen, text: pw.benefit1 },
                { icon: Sparkles, text: pw.benefit2 },
                { icon: Headphones, text: pw.benefit3 },
                { icon: Award, text: pw.benefit4 },
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#7A9174]/25 text-[#7A9174] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-[#E8E2D5] font-medium leading-snug">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Micro-badge de confiance en bas du volet gauche (desktop uniquement) */}
          <div className="relative z-10 hidden md:flex items-center gap-2 pt-6 text-[11px] text-[#E8E2D5]/60 border-t border-white/10 mt-6">
            <ShieldCheck className="w-4 h-4 text-[#C9A05C]" />
            <span>{pw.certified}</span>
          </div>
        </div>

        {/* Volet Droit : Sélecteur d'offres & CTA */}
        <div className="bg-[#FDFCF8] p-6 sm:p-8 md:p-10 md:w-1/2 flex flex-col justify-between space-y-6">
          
          {/* Header Volet Droit : Titre + Toggle EUR / MAD */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C9A05C]">
                — {pw.plansTitle}
              </span>

              {/* Toggle de devises EUR / MAD */}
              <div className="inline-flex items-center bg-[#F7F3EA] p-1 rounded-full border border-[#E8E2D5] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCurrency('EUR')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currency === 'EUR'
                      ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
                      : 'text-[#7A7670] hover:text-[#1B2A4A]'
                  }`}
                >
                  EUR (€)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('MAD')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currency === 'MAD'
                      ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs'
                      : 'text-[#7A7670] hover:text-[#1B2A4A]'
                  }`}
                >
                  MAD (DH)
                </button>
              </div>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
              {pw.chooseCadence}
            </h3>
            <p className="text-xs text-[#7A7670] mt-0.5">
              {pw.cadenceDesc}
            </p>
          </div>

          {/* Cartes d'abonnements */}
          <div className="space-y-3.5">
            {/* Offre Annuelle (-40%) */}
            <div
              onClick={() => setBillingCycle('yearly')}
              className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-[#C9A05C]/10 border-2 border-[#C9A05C] shadow-md ring-2 ring-[#C9A05C]/20'
                  : 'bg-[#F7F3EA]/60 border-[#E8E2D5] hover:border-[#C9A05C]/50'
              }`}
            >
              {/* Badge réduction dorée */}
              <div className="absolute -top-2.5 right-4 bg-[#C9A05C] text-[#1B2A4A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {pw.bestOffer}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    billingCycle === 'yearly' ? 'border-[#C9A05C] bg-[#C9A05C]' : 'border-[#E8E2D5]'
                  }`}>
                    {billingCycle === 'yearly' && <div className="w-2 h-2 rounded-full bg-[#1B2A4A]" />}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B2A4A]">{pw.yearly}</h4>
                    <p className="text-xs text-[#7A7670]">{pw.billed.replace('{total}', currentPricing.yearlyTotal)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                    {currentPricing.yearlyPerMonth}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#7A7670] font-semibold">{pw.perMonth}</div>
                </div>
              </div>
            </div>

            {/* Offre Mensuelle */}
            <div
              onClick={() => setBillingCycle('monthly')}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-[#C9A05C]/10 border-2 border-[#C9A05C] shadow-md ring-2 ring-[#C9A05C]/20'
                  : 'bg-[#F7F3EA]/60 border-[#E8E2D5] hover:border-[#C9A05C]/50'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    billingCycle === 'monthly' ? 'border-[#C9A05C] bg-[#C9A05C]' : 'border-[#E8E2D5]'
                  }`}>
                    {billingCycle === 'monthly' && <div className="w-2 h-2 rounded-full bg-[#1B2A4A]" />}
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1B2A4A]">{pw.monthly}</h4>
                    <p className="text-xs text-[#7A7670]">{pw.monthlyDesc}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A4A]">
                    {currentPricing.monthlyPrice}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[#7A7670] font-semibold">{pw.perMonth}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton d'action CTA & Réassurance */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#C9A05C] hover:bg-[#b88f4b] disabled:opacity-60 disabled:cursor-not-allowed text-[#1B2A4A] font-bold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{pw.preparing}</span>
                </>
              ) : (
                <>
                  <span>{pw.unlockCta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium text-center bg-red-50 p-2 rounded-lg border border-red-200">
                {errorMessage}
              </p>
            )}

            <p className="text-[11px] text-center text-[#7A7670] leading-snug">
              {pw.securePayment}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

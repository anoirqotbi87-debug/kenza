'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Mail, Lock, User, LogIn } from 'lucide-react';
import { syncService } from '../../lib/syncService';
import { signUpWithTracking, track } from '../../lib/tracking';
import { useTranslation } from '../../store/useAppStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) track('auth_modal_viewed', { mode: initialMode }, '/auth');
  }, [isOpen, initialMode]);

  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      
      if (data.user) {
        await syncService.syncCloudToLocal(data.user.id);
        onSuccess();
      }
    } catch (err: any) {
      if (err.message?.includes("Email not confirmed")) {
        setError("Email non confirmé. Vérifiez votre boîte de réception.");
      } else {
        setError(err.message || "Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      track('signup_started', { method: 'email' }, '/auth');
      const { error } = await signUpWithTracking(email, password, { username: email.split('@')[0] });
      if (error) {
        track('signup_failed', { method: 'email', error: error.message?.slice(0, 200) }, '/auth');
        throw error;
      }

      if (error) throw error;

      // Cas 1 : Supabase autorise la connexion immédiate (Confirm email désactivé)
      if (data.session && data.user) {
        // Synchronisation immédiate des données locales du mode invité
        await syncService.migrateGuestDataToCloud(data.user.id);
        setMessage("Compte créé avec succès ! Bienvenue sur KENZA.");
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
        return;
      }

      // Cas 2 : Si la confirmation email est encore requise par Supabase
      if (data.user && !data.session) {
        setMessage("Compte créé ! Si un email de confirmation est requis, veuillez vérifier votre boîte de réception et vos courriers indésirables (Spam).");
      }
    } catch (err: any) {
      console.error("Erreur Inscription :", err);
      // Traduction des erreurs Supabase courantes
      if (err.message?.includes("User already registered")) {
        setError("Cette adresse email est déjà enregistrée. Veuillez vous connecter.");
      } else if (err.message?.includes("Password should be")) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setError(err.message || "Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleSignUp(e);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    try {
      const redirectUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://kenza-dusky.vercel.app'
        : (typeof window !== 'undefined' ? window.location.origin : 'https://kenza-dusky.vercel.app');
        
      track(isLogin ? 'login_started' : 'signup_started', { method: provider }, '/auth');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        // Message explicatif si Google n'est pas encore configuré côté Supabase
        if (error.message?.includes("provider is not enabled") || error.message?.includes("unsupported")) {
          setError(`La connexion ${provider} nécessite l'activation du fournisseur dans le dashboard Supabase. Utilisez l'email en attendant.`);
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      console.error(`Erreur ${provider} OAuth :`, err);
      setError(err.message || `Impossible de se connecter avec ${provider} pour le moment.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1B2A4A]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FDFCF8] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#E8E2D5] relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A7670] hover:text-[#1B2A4A] bg-[#F7F3EA] hover:bg-[#E8E2D5] border border-[#E8E2D5] rounded-full transition-colors z-10 shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C9A05C]/20 border border-[#C9A05C]/40 text-[#C9A05C] text-2xl mb-3 shadow-xs">
              🐪
            </div>
            <h2 className="font-serif tracking-[0.2em] text-2xl font-extrabold text-[#1B2A4A] uppercase flex justify-center items-center gap-2">
              KENZA <span className="font-arabic text-base font-bold text-[#C9A05C] lowercase">كنزة</span>
            </h2>
            <p className="text-xs text-[#7A7670] mt-1 font-medium">
              La darija, en chemin
            </p>
          </div>

          <div className="flex bg-[#F7F3EA] p-1 rounded-full border border-[#E8E2D5] mb-6 text-xs font-bold">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-full transition-all ${isLogin ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' : 'text-[#7A7670] hover:text-[#1B2A4A]'}`}
            >
              {t.auth.login}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-full transition-all ${!isLogin ? 'bg-[#1B2A4A] text-[#FDFCF8] shadow-xs' : 'text-[#7A7670] hover:text-[#1B2A4A]'}`}
            >
              {t.auth.signup}
            </button>
          </div>

          {message && (
            <div className="bg-[#7A9174]/15 border border-[#7A9174]/30 text-[#7A9174] p-3 rounded-2xl text-xs font-semibold mb-4 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-semibold mb-4 text-center">
              {error}
              {error.includes("Email non confirmé") && (
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.resend({ type: 'signup', email });
                    setMessage("Un nouvel email de confirmation vient d'être envoyé.");
                    setError(null);
                  }}
                  className="text-xs text-[#1B2A4A] underline font-bold mt-2 block w-full text-center"
                >
                  Renvoyer le lien de confirmation
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7670]" />
                <input 
                  type="email" 
                  placeholder={t.auth.email} 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E8E2D5] text-[#1B2A4A] rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-[#C9A05C] focus:bg-[#FDFCF8] transition-colors text-xs sm:text-sm font-medium placeholder-[#7A7670]/60"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7670]" />
                <input 
                  type="password" 
                  placeholder={t.auth.password} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E8E2D5] text-[#1B2A4A] rounded-2xl pl-10 pr-4 py-3 outline-none focus:border-[#C9A05C] focus:bg-[#FDFCF8] transition-colors text-xs sm:text-sm font-medium placeholder-[#7A7670]/60"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold py-3.5 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60"
            >
              {loading ? '...' : (isLogin ? t.auth.login : t.auth.signup)}
              {!loading && <LogIn className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => handleOAuth('google')} 
              className="flex-1 bg-[#FDFCF8] border border-[#E8E2D5] hover:bg-[#F7F3EA] text-[#1B2A4A] font-bold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 text-xs shadow-xs"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>{t.auth.google}</span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button onClick={onClose} className="text-[#7A7670] hover:text-[#1B2A4A] text-xs font-semibold underline-offset-4 hover:underline">
              {t.auth.continueGuest}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

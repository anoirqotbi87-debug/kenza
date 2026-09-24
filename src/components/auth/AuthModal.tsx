'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Mail, Lock, User, LogIn } from 'lucide-react';
import { syncService } from '../../lib/syncService';
import { useTranslation } from '../../store/useAppStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0],
          },
        },
      });

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
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kenza-dusky.vercel.app';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 flex justify-center items-center gap-2">
              <span className="text-3xl">🐪</span> KENZA <span className="text-lg font-medium text-slate-400 font-arabic ml-1">كنزة</span>
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${isLogin ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.auth.login}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${!isLogin ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.auth.signup}
            </button>
          </div>

          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-4 text-center">
              {error}
              {error.includes("Email non confirmé") && (
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.resend({ type: 'signup', email });
                    setMessage("Un nouvel email de confirmation vient d'être envoyé.");
                    setError(null);
                  }}
                  className="text-xs text-blue-600 underline mt-2 block w-full text-center"
                >
                  Renvoyer le lien de confirmation
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder={t.auth.email} 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder={t.auth.password} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? '...' : (isLogin ? t.auth.login : t.auth.signup)}
              {!loading && <LogIn className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 flex gap-3">
            <button onClick={() => handleOAuth('google')} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              {t.auth.google}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-sm font-bold underline-offset-4 hover:underline">
              {t.auth.continueGuest}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Download,
  Loader2,
  Lock,
  RefreshCw,
  Trash2,
  AlertCircle,
  Wifi,
} from 'lucide-react';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import { canDownloadOffline } from '../../lib/monetizationGates';
import {
  precacheEssentialCorpus,
  getAudioCacheStats,
  clearAudioCache,
  AudioCacheStats,
  PrecacheProgress,
} from '../../lib/tts/offlineAudioCache';

/**
 * Téléchargement du pack audio hors-ligne PWA (Cache Storage 'kenza-tts-audio-v1').
 *
 * Réservé aux membres Kenza Pro : pour un utilisateur gratuit le bouton est
 * verrouillé et ouvre le paywall (aucun téléchargement n'est lancé).
 *
 * Connecté au moteur de cache canonique pour une lecture instantanée à 0ms
 * et une persistance déterministe même en mode avion.
 */
export default function OfflineDownloadCard({
  isPremium,
  onLocked,
}: {
  isPremium: boolean;
  onLocked: () => void;
}) {
  const { t } = useTranslation();
  const off = t.offline;
  const lang = useAppStore((state) => state.uiLanguage);
  const isAr = lang === 'ar';

  const [stats, setStats] = useState<AudioCacheStats | null>(null);
  const [progress, setProgress] = useState<PrecacheProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getAudioCacheStats().then((st) => {
      if (isMounted) setStats(st);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = async () => {
    if (!canDownloadOffline(isPremium)) {
      onLocked();
      return;
    }
    setError(null);
    setJustCompleted(false);

    try {
      await precacheEssentialCorpus((p) => {
        setProgress(p);
      });
      setJustCompleted(true);
      const updated = await getAudioCacheStats();
      setStats(updated);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Annulation volontaire
      } else {
        setError(off.downloadError || 'Erreur lors du téléchargement');
      }
    } finally {
      setProgress(null);
    }
  };

  const handleClear = async () => {
    await clearAudioCache();
    const updated = await getAudioCacheStats();
    setStats(updated);
    setJustCompleted(false);
  };

  const busy = progress !== null && progress.status === 'downloading';
  const isReady = (stats?.isReady || (stats?.count ?? 0) >= 15) && isPremium;

  const formattedCachedStatus = off.cachedStatus
    ? off.cachedStatus
        .replace('{count}', String(stats?.count ?? 0))
        .replace('{size}', String(stats?.sizeMb ?? 0))
    : `${stats?.count ?? 0} audios (${stats?.sizeMb ?? 0} Mo)`;

  return (
    <article className="data-card" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="data-card-heading">
        <span className={`data-icon ${isReady ? 'text-[#0C737E]' : ''}`}>
          {isReady ? <Wifi size={18} /> : <Download size={18} />}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mini-kicker">
              {!isPremium
                ? off.locked
                : isReady
                ? off.badgeReady
                : off.title}
            </span>
            {isReady && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#0C737E]/10 text-[#0C737E] px-2 py-0.5 rounded-full">
                <Check size={12} /> {off.activeBadge || '100% hors-ligne'}
              </span>
            )}
          </div>
          <h3>{off.title}</h3>
          {isPremium && stats && stats.count > 0 && (
            <p className="text-xs text-[#6F675B] mt-0.5">
              {formattedCachedStatus}
            </p>
          )}
        </div>
      </div>

      {busy && progress && (
        <div className="my-3 space-y-1.5" aria-live="polite">
          <div className="flex justify-between text-xs text-[#2A241E] font-medium">
            <span>
              {off.progress.replace('{percent}', String(progress.percent))}
            </span>
            <span>
              {progress.completed} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-[#E5D7C2]/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0C737E] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="my-2 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          type="button"
          className="outline-button flex-1 min-w-[140px]"
          onClick={handleDownload}
          disabled={busy}
          aria-disabled={!isPremium}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          {!busy && !isPremium ? <Lock size={14} /> : null}
          {!busy && isPremium && (isReady || justCompleted) ? (
            <RefreshCw size={14} />
          ) : null}
          {!busy && isPremium && !isReady && !justCompleted ? (
            <Download size={14} />
          ) : null}

          {busy
            ? off.progress.replace('{percent}', String(progress.percent))
            : isReady
            ? off.updatePack || 'Actualiser le pack'
            : off.download}
        </button>

        {isPremium && stats && stats.count > 0 && !busy && (
          <button
            type="button"
            className="text-xs text-[#8C827A] hover:text-red-600 transition-colors p-2 rounded-lg flex items-center gap-1"
            onClick={handleClear}
            title={off.clearCache || 'Vider le cache'}
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">
              {off.clearCache || 'Vider'}
            </span>
          </button>
        )}
      </div>
    </article>
  );
}

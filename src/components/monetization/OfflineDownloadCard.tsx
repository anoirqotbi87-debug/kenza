'use client';

import { useState } from 'react';
import { Check, Download, Loader2, Lock } from 'lucide-react';
import { useTranslation } from '../../store/useAppStore';
import { canDownloadOffline } from '../../lib/monetizationGates';
import { downloadFullOfflinePack } from '../../lib/offlineStorage';

/**
 * Téléchargement du pack audio hors-ligne.
 *
 * Réservé aux membres Kenza Pro : pour un utilisateur gratuit le bouton est
 * verrouillé et ouvre le paywall (aucun téléchargement n'est lancé).
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
  const [percent, setPercent] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    if (!canDownloadOffline(isPremium)) {
      onLocked();
      return;
    }
    setDone(false);
    setPercent(0);
    try {
      await downloadFullOfflinePack((p) => setPercent(p));
      setDone(true);
    } finally {
      setPercent(null);
    }
  };

  const busy = percent !== null;

  return (
    <article className="data-card">
      <div className="data-card-heading">
        <span className="data-icon">
          <Download size={18} />
        </span>
        <div>
          <span className="mini-kicker">
            {isPremium ? off.ready : off.locked}
          </span>
          <h3>{off.title}</h3>
        </div>
      </div>

      <button
        type="button"
        className="outline-button"
        onClick={handleDownload}
        disabled={busy}
        aria-disabled={!isPremium}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : null}
        {!busy && !isPremium ? <Lock size={14} /> : null}
        {!busy && isPremium && done ? <Check size={14} /> : null}
        {busy
          ? off.progress.replace('{percent}', String(percent))
          : off.download}
      </button>
    </article>
  );
}

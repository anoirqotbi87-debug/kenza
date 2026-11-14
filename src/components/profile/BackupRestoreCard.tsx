'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Copy,
  Check,
  AlertCircle,
  Archive,
  Smartphone,
  FileText,
  X,
} from 'lucide-react';
import { useTranslation, useAppStore } from '../../store/useAppStore';
import {
  createBackupEnvelope,
  generateBackupFilename,
  encodeBackupToBase64,
  decodeBackupFromBase64,
  verifyChecksum,
  applyProgressionRestore,
  ProgressionBackupEnvelope,
} from '../../lib/backup/progressionBackup';

export default function BackupRestoreCard() {
  const { t } = useTranslation();
  const b = t.backup;
  const lang = useAppStore((s) => s.uiLanguage);
  const isAr = lang === 'ar';

  const xp = useAppStore((s) => s.xp || 0);
  const completedLessons = useAppStore((s) => s.completedLessons || []);
  const srsDeck = useAppStore((s) => s.srsDeck || {});
  const cardsCount = Object.keys(srsDeck).length;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [base64Input, setBase64Input] = useState('');
  const [pendingEnvelope, setPendingEnvelope] = useState<ProgressionBackupEnvelope | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // Export JSON
  const handleExportJson = () => {
    try {
      const envelope = createBackupEnvelope();
      const jsonStr = JSON.stringify(envelope, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateBackupFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showFeedback('success', b.exportBtn);
    } catch {
      showFeedback('error', b.invalidFile);
    }
  };

  // Export Code Mobile Base64
  const handleCopyMobileCode = async () => {
    try {
      const envelope = createBackupEnvelope();
      const code = encodeBackupToBase64(envelope);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showFeedback('success', b.codeCopied);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showFeedback('error', b.invalidFile);
    }
  };

  // Traitement du fichier sélectionné
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target?.result || '');
        const parsed = JSON.parse(text);
        if (verifyChecksum(parsed)) {
          setPendingEnvelope(parsed);
        } else {
          showFeedback('error', b.invalidFile);
        }
      } catch {
        showFeedback('error', b.invalidFile);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Traitement du code Base64 collé
  const handleImportCode = () => {
    if (!base64Input.trim()) return;
    try {
      const envelope = decodeBackupFromBase64(base64Input);
      setPendingEnvelope(envelope);
      setShowCodeModal(false);
      setBase64Input('');
    } catch {
      showFeedback('error', b.invalidFile);
    }
  };

  // Exécution de la restauration (Fusion ou Remplacement)
  const handleConfirmRestore = (mode: 'merge' | 'overwrite') => {
    if (!pendingEnvelope) return;
    const result = applyProgressionRestore(pendingEnvelope, mode);
    if (result.success) {
      const msg = b.importSuccess
        .replace('{xp}', String(result.restoredXp || 0))
        .replace('{lessons}', String(result.restoredLessonsCount || 0));
      showFeedback('success', msg);
    } else {
      showFeedback('error', b.invalidFile);
    }
    setPendingEnvelope(null);
  };

  return (
    <article className="data-card" dir={isAr ? 'rtl' : 'ltr'}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="data-card-heading">
        <span className="data-icon" style={{ backgroundColor: '#134074', color: '#E5D7C2' }}>
          <Archive size={18} />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mini-kicker">{b.title}</span>
            <span className="inline-flex items-center text-[11px] font-semibold bg-[#134074]/10 text-[#134074] px-2 py-0.5 rounded-full">
              {b.stats
                .replace('{lessons}', String(completedLessons.length))
                .replace('{cards}', String(cardsCount))
                .replace('{xp}', String(xp))}
            </span>
          </div>
          <h3>{b.title}</h3>
          <p className="text-xs text-[#6F675B] mt-0.5">{b.subtitle}</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`my-2 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-red-50 text-red-700'
          }`}
          role="status"
        >
          {feedback.type === 'success' ? (
            <Check size={14} className="shrink-0" />
          ) : (
            <AlertCircle size={14} className="shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Confirmation de Restauration (Modal Inline) */}
      {pendingEnvelope && (
        <div className="my-3 p-3.5 bg-[#FAF6EE] border border-[#E5D7C2] rounded-xl space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#142943] uppercase tracking-wider">
                {b.confirmTitle}
              </h4>
              <p className="text-xs text-[#6F675B] mt-0.5">{b.confirmBody}</p>
              <div className="text-[11px] font-medium text-[#0C737E] mt-1">
                Sauvegarde : {pendingEnvelope.payload.completedLessons.length} leçons ·{' '}
                {Object.keys(pendingEnvelope.payload.srsDeck || {}).length} cartes ·{' '}
                {pendingEnvelope.payload.xp} XP
              </div>
            </div>
            <button
              type="button"
              className="text-[#8C827A] hover:text-red-500"
              onClick={() => setPendingEnvelope(null)}
              title={b.cancelBtn}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              className="outline-button flex-1 text-xs py-1.5 bg-[#0C737E] text-white hover:bg-[#09575f]"
              onClick={() => handleConfirmRestore('merge')}
            >
              <Check size={12} /> {b.mergeBtn}
            </button>
            <button
              type="button"
              className="outline-button flex-1 text-xs py-1.5"
              onClick={() => handleConfirmRestore('overwrite')}
            >
              {b.overwriteBtn}
            </button>
            <button
              type="button"
              className="text-xs text-[#8C827A] hover:text-black px-2 py-1.5"
              onClick={() => setPendingEnvelope(null)}
            >
              {b.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* Boutons d'Action Principaux */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          type="button"
          className="outline-button flex-1 min-w-[140px]"
          onClick={handleExportJson}
          title={b.exportBtn}
        >
          <Download size={14} className={isAr ? 'rotate-180' : ''} />
          <span>{b.exportBtn}</span>
        </button>

        <button
          type="button"
          className="outline-button flex-1 min-w-[140px]"
          onClick={() => fileInputRef.current?.click()}
          title={b.importBtn}
        >
          <Upload size={14} />
          <span>{b.importBtn}</span>
        </button>
      </div>

      {/* Code Mobile Base64 (Mobile friendly) */}
      <div className="flex items-center gap-2 mt-2 pt-1 text-xs flex-wrap">
        <button
          type="button"
          className="text-xs text-[#0C737E] hover:underline flex items-center gap-1 font-medium"
          onClick={handleCopyMobileCode}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? b.codeCopied : b.copyCode}</span>
        </button>

        <span className="text-[#8C827A]">•</span>

        <button
          type="button"
          className="text-xs text-[#0C737E] hover:underline flex items-center gap-1 font-medium"
          onClick={() => setShowCodeModal(true)}
        >
          <Smartphone size={12} />
          <span>{b.pasteCode}</span>
        </button>
      </div>

      {/* Dialogue Saisie Code Mobile */}
      {showCodeModal && (
        <div className="my-2 p-3 bg-white border border-[#E5D7C2] rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#142943] flex items-center gap-1.5">
              <FileText size={14} /> {b.pasteCode}
            </span>
            <button
              type="button"
              className="text-[#8C827A] hover:text-black"
              onClick={() => setShowCodeModal(false)}
            >
              <X size={14} />
            </button>
          </div>
          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Collez ici votre code de sauvegarde (Base64)..."
            className="w-full text-xs p-2 border border-[#E5D7C2] rounded-lg h-20 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#0C737E]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="text-xs px-2.5 py-1 text-[#8C827A] hover:text-black"
              onClick={() => setShowCodeModal(false)}
            >
              {b.cancelBtn}
            </button>
            <button
              type="button"
              className="outline-button text-xs py-1 px-3 bg-[#0C737E] text-white hover:bg-[#09575f]"
              onClick={handleImportCode}
            >
              <Check size={12} /> Valider
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

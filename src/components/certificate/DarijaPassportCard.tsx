'use client';

import React, { useState } from 'react';
import { Download, Share2, Check, Award } from 'lucide-react';
import { PassportData, exportPassportToBlob } from '../../utils/certificateGenerator';

interface DarijaPassportCardProps {
  data: PassportData;
}

export default function DarijaPassportCard({ data }: DarijaPassportCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const blob = await exportPassportToBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KENZA_Passeport_${data.levelName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      const blob = await exportPassportToBlob(data);
      const file = new File([blob], `Passeport_Darija.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Mon Passeport Darija',
          text: `J'ai validé mon ${data.levelName} de Darija marocaine sur KENZA avec un score de ${data.score}% !`,
          files: [file]
        });
      } else {
        // Fallback: Copy to clipboard and download
        await navigator.clipboard.writeText(`J'ai validé mon ${data.levelName} de Darija marocaine sur KENZA avec un score de ${data.score}% !`);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        await handleDownload(); // Auto download as fallback
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error("Share failed", e);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
      
      {/* Visual Preview built with Tailwind (mimicking the canvas style for UI rendering) */}
      <div className="relative w-full aspect-[1.9/1] bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-500/20 transform transition-transform hover:scale-[1.02]">
        
        {/* Inner border */}
        <div className="absolute inset-2 border-2 border-amber-500/40 rounded-lg pointer-events-none" />
        <div className="absolute inset-3 border border-amber-500/20 rounded pointer-events-none" />

        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="text-center">
            <h3 className="font-bold text-amber-500 tracking-widest text-xl drop-shadow-md">PASSEPORT DARIJA</h3>
            <div className="text-slate-400 text-sm font-arabic">جواز سفر الدارجة</div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Titulaire</div>
              <div className="font-bold text-2xl truncate max-w-[200px]">{data.userName || 'INVITÉ(E)'}</div>
              
              <div className="text-slate-400 text-xs mt-3 mb-1 uppercase tracking-wider">Niveau Validé</div>
              <div className="font-bold text-sky-400 text-lg">{data.levelName}</div>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-800/80 border-2 border-amber-500/50 rounded-full w-20 h-20 shadow-lg relative shrink-0">
              <Award className="absolute -top-3 text-amber-500 w-6 h-6" />
              <div className="font-bold text-amber-500 text-xl leading-none">{data.score}%</div>
              <div className="text-[10px] text-slate-400 mt-1">SCORE</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 pt-2 border-t border-amber-500/20">
            <div>ID: {data.passportId}</div>
            <div>{data.date}</div>
          </div>
        </div>
        
        {/* Red stamp overlay */}
        <div className="absolute -bottom-4 right-1/4 transform -rotate-12 pointer-events-none opacity-40 mix-blend-screen">
          <div className="border-4 border-red-500 text-red-500 font-bold text-3xl px-4 py-1 rounded-lg">VALIDÉ</div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          Enregistrer
        </button>
        
        <button
          onClick={handleShare}
          disabled={isExporting}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {shareSuccess ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          {shareSuccess ? 'Copié !' : 'Partager'}
        </button>
      </div>
    </div>
  );
}

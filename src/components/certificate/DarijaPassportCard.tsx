'use client';

import React, { useState } from 'react';
import { Download, Share2, Check, Award } from 'lucide-react';
import { PassportData, exportPassportToBlob } from '../../utils/certificateGenerator';
import { trackEvent } from '../../utils/analytics';
import { useTranslation } from '../../store/useAppStore';

interface DarijaPassportCardProps {
  data: PassportData;
}

export default function DarijaPassportCard({ data }: DarijaPassportCardProps) {
  const { t } = useTranslation();
  const pp = t.modules.passport;
  const [isExporting, setIsExporting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const shareMessage = pp.shareText
    .replace('{level}', data.levelName)
    .replace('{score}', String(data.score));

  const handleDownload = async () => {
    try {
      trackEvent('passport_shared', { method: 'download_only', levelName: data.levelName });
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
        trackEvent('passport_shared', { method: 'native_share', levelName: data.levelName });
        await navigator.share({
          title: pp.title,
          text: shareMessage,
          files: [file]
        });
      } else {
        // Fallback: Copy to clipboard and download
        trackEvent('passport_shared', { method: 'fallback_download', levelName: data.levelName });
        await navigator.clipboard.writeText(shareMessage);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
        await handleDownload(); // Auto download as fallback
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        console.error("Share failed", e);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-lg mx-auto">
      
      {/* Visual Preview (Passeport Culturel Haute Fidélité) */}
      <div className="relative w-full aspect-[1.9/1] bg-[#1B2A4A] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A05C] transform transition-transform hover:scale-[1.02]">
        
        {/* Motif géométrique discret */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 10px 10px, #C9A05C 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Double filet doré intérieur */}
        <div className="absolute inset-2 border-2 border-[#C9A05C]/40 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 border border-[#C9A05C]/20 rounded-lg pointer-events-none" />

        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-[#FDFCF8]">
          <div className="text-center">
            <h3 className="font-serif font-bold text-[#C9A05C] tracking-[0.25em] text-lg sm:text-xl drop-shadow-xs uppercase">
              {pp.passportTitle}
            </h3>
            <div className="text-[#E8E2D5]/70 text-xs sm:text-sm font-arabic mt-0.5">
              جواز سفر الدارجة المغربية
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-[#E8E2D5]/60 text-[10px] sm:text-xs mb-0.5 uppercase tracking-widest font-semibold">{pp.holder}</div>
              <div className="font-serif font-bold text-xl sm:text-2xl truncate max-w-[200px] text-[#FDFCF8]">
                {data.userName || pp.guest}
              </div>
              
              <div className="text-[#E8E2D5]/60 text-[10px] sm:text-xs mt-2.5 mb-0.5 uppercase tracking-widest font-semibold">{pp.levelValidated}</div>
              <div className="font-bold text-[#C9A05C] text-base sm:text-lg">{data.levelName}</div>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#1B2A4A] border-2 border-[#C9A05C] rounded-full w-18 h-18 sm:w-20 sm:h-20 shadow-lg relative shrink-0">
              <Award className="absolute -top-3 text-[#C9A05C] w-5 h-5 sm:w-6 sm:h-6" />
              <div className="font-serif font-bold text-[#C9A05C] text-lg sm:text-xl leading-none">{data.score}%</div>
              <div className="text-[9px] text-[#E8E2D5]/70 mt-1 font-bold tracking-wider">{pp.score}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-[#E8E2D5]/60 font-mono mt-3 pt-2 border-t border-[#C9A05C]/20">
            <div>ID: {data.passportId}</div>
            <div>{data.date}</div>
          </div>
        </div>
        
        {/* Visa tamponné vert sauge */}
        <div className="absolute -bottom-3 right-1/4 transform -rotate-12 pointer-events-none opacity-90">
          <div className="border-3 border-[#7A9174] text-[#7A9174] font-bold text-2xl sm:text-3xl px-4 py-0.5 rounded-lg tracking-widest uppercase bg-[#1B2A4A]/60 backdrop-blur-xs">
            {pp.validated}
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 bg-[#F7F3EA] hover:bg-[#E8E2D5] text-[#1B2A4A] border border-[#E8E2D5] font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-xs sm:text-sm shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>{pp.save}</span>
        </button>
        
        <button
          onClick={handleShare}
          disabled={isExporting}
          className="flex-1 bg-[#C9A05C] hover:bg-[#b88f4b] text-[#1B2A4A] font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 text-xs sm:text-sm"
        >
          {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>{shareSuccess ? pp.copied : pp.share}</span>
        </button>
      </div>
    </div>
  );
}

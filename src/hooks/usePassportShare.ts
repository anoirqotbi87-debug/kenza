import { useState, useCallback, RefObject } from 'react';
import { toBlob } from 'html-to-image';

interface ShareOptions {
  fileName?: string;
  shareTitle?: string;
  shareText?: string;
}

export function usePassportShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const sharePassport = useCallback(
    async (elementRef: RefObject<HTMLElement | null>, options?: ShareOptions) => {
      if (!elementRef.current) return;

      setIsSharing(true);
      setShareSuccess(false);
      
      const fileName = options?.fileName || 'kenza-passeport.png';
      const shareTitle = options?.shareTitle || 'Mon Passeport KENZA';
      const shareText = options?.shareText || "J'ai validé mon palier de Darija sur KENZA ! 🇲🇦 Découvre la plateforme : https://kenza-dusky.vercel.app";

      try {
        const blob = await toBlob(elementRef.current, { 
          cacheBust: true,
          pixelRatio: 2, // better quality
        });
        
        if (!blob) throw new Error('Failed to generate image');

        // Check if Web Share API with files is supported
        const file = new File([blob], fileName, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          // Mobile native share sheet
          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file],
          });
          setShareSuccess(true);
        } else {
          // Fallback for Desktop: Download image and copy text
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Copy text to clipboard
          try {
            await navigator.clipboard.writeText(shareText);
          } catch (e) {
            console.error('Clipboard write failed', e);
          }
          
          setShareSuccess(true);
          
          // Reset success state after a few seconds
          setTimeout(() => setShareSuccess(false), 3000);
        }
      } catch (err) {
        console.error('Error sharing passport:', err);
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  return { sharePassport, isSharing, shareSuccess };
}

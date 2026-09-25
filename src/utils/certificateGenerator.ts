export interface PassportData {
  userName: string;
  levelName: string; // e.g. "Palier A1 — Darija de Survie"
  score: number; // e.g. 92
  date: string; // formatted date
  passportId: string; // e.g. "KNZ-A1-8932"
}

export function generatePassportCanvas(data: PassportData): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      
      const targetWidth = 1200;
      const targetHeight = 630;
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2;
      
      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas 2D context not available");

      ctx.scale(dpr, dpr);

      // Draw Background (Deep Blue / Majorelle)
      ctx.fillStyle = '#0f172a'; // slate-900 base
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      const gradient = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
      gradient.addColorStop(0, '#1e3a8a'); // blue-900
      gradient.addColorStop(1, '#0f172a'); // slate-900
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw inner border (gold)
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, targetWidth - 80, targetHeight - 80);
      
      // Draw inner thin border
      ctx.lineWidth = 2;
      ctx.strokeRect(55, 55, targetWidth - 110, targetHeight - 110);

      // Title
      ctx.fillStyle = '#f59e0b'; // Gold
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PASSEPORT DARIJA', targetWidth / 2, 140);
      
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '32px sans-serif';
      ctx.fillText('جواز سفر الدارجة', targetWidth / 2, 190);

      // Separator line
      ctx.beginPath();
      ctx.moveTo(targetWidth / 2 - 200, 230);
      ctx.lineTo(targetWidth / 2 + 200, 230);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // User Info
      ctx.textAlign = 'left';
      
      // Label: Titulaire
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Titulaire / Holder :', 120, 320);
      // Value: Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(data.userName.toUpperCase() || 'INVITÉ(E)', 120, 370);

      // Label: Niveau validé
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Niveau validé / Level :', 120, 450);
      // Value: Level
      ctx.fillStyle = '#38bdf8'; // sky-400
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(data.levelName, 120, 495);

      // Score Ribbon/Badge (Right side)
      const badgeX = targetWidth - 250;
      const badgeY = 360;
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b'; // slate-800
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 75, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(`${data.score}%`, badgeX, badgeY + 10);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.fillText('SCORE', badgeX, badgeY + 45);

      // Bottom info
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '24px monospace';
      ctx.fillText(`ID: ${data.passportId}`, 120, targetHeight - 80);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Délivré le: ${data.date}`, targetWidth - 120, targetHeight - 80);

      // Stamp-like effect "VALIDÉ"
      ctx.save();
      ctx.translate(targetWidth / 2 + 100, targetHeight - 180);
      ctx.rotate(-Math.PI / 12);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // red-500 with opacity
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VALIDÉ', 0, 0);
      ctx.restore();

      resolve(canvas);
    } catch (e) {
      reject(e);
    }
  });
}

export async function exportPassportToBlob(data: PassportData): Promise<Blob> {
  const canvas = await generatePassportCanvas(data);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob from canvas"));
    }, 'image/png', 1.0);
  });
}

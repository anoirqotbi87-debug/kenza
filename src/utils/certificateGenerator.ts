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

      // Draw Background (Deep Navy)
      ctx.fillStyle = '#1B2A4A'; // Brand Navy
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw inner border (Brand Gold)
      ctx.strokeStyle = '#C9A05C'; // Gold
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, targetWidth - 80, targetHeight - 80);
      
      // Draw inner thin border
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(201, 160, 92, 0.4)';
      ctx.strokeRect(55, 55, targetWidth - 110, targetHeight - 110);

      // Title
      ctx.fillStyle = '#C9A05C'; // Gold
      ctx.font = 'bold 46px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('PASSEPORT DARIJA', targetWidth / 2, 140);
      
      ctx.fillStyle = '#E8E2D5'; // Warm Parchment
      ctx.font = '28px Georgia, serif';
      ctx.fillText('جواز سفر الدارجة المغربية', targetWidth / 2, 190);

      // Separator line
      ctx.beginPath();
      ctx.moveTo(targetWidth / 2 - 200, 225);
      ctx.lineTo(targetWidth / 2 + 200, 225);
      ctx.strokeStyle = '#C9A05C';
      ctx.lineWidth = 3;
      ctx.stroke();

      // User Info
      ctx.textAlign = 'left';
      
      // Label: Titulaire
      ctx.fillStyle = 'rgba(232, 226, 213, 0.7)';
      ctx.font = '20px Georgia, serif';
      ctx.fillText('TITULAIRE / HOLDER', 120, 315);
      // Value: Name
      ctx.fillStyle = '#FDFCF8';
      ctx.font = 'bold 38px Georgia, serif';
      ctx.fillText((data.userName || 'INVITÉ(E)').toUpperCase(), 120, 365);

      // Label: Niveau validé
      ctx.fillStyle = 'rgba(232, 226, 213, 0.7)';
      ctx.font = '20px Georgia, serif';
      ctx.fillText('NIVEAU VALIDÉ / LEVEL', 120, 440);
      // Value: Level
      ctx.fillStyle = '#C9A05C';
      ctx.font = 'bold 34px Georgia, serif';
      ctx.fillText(data.levelName, 120, 485);

      // Score Ribbon/Badge (Right side)
      const badgeX = targetWidth - 250;
      const badgeY = 360;
      
      // Draw outer circle
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#142038';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#C9A05C';
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 75, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(201, 160, 92, 0.5)';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#C9A05C';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.fillText(`${data.score}%`, badgeX, badgeY + 12);
      
      ctx.fillStyle = 'rgba(232, 226, 213, 0.8)';
      ctx.font = 'bold 18px Georgia, serif';
      ctx.fillText('SCORE', badgeX, badgeY + 45);

      // Bottom info
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(232, 226, 213, 0.6)';
      ctx.font = '20px monospace';
      ctx.fillText(`ID: ${data.passportId}`, 120, targetHeight - 80);
      
      ctx.textAlign = 'right';
      ctx.fillText(`Délivré le: ${data.date}`, targetWidth - 120, targetHeight - 80);

      // Stamp-like effect "VALIDÉ" (Sage green)
      ctx.save();
      ctx.translate(targetWidth / 2 + 100, targetHeight - 170);
      ctx.rotate(-Math.PI / 14);
      ctx.fillStyle = 'rgba(122, 145, 116, 0.85)'; // Sage green
      ctx.strokeStyle = 'rgba(122, 145, 116, 0.9)';
      ctx.lineWidth = 6;
      ctx.strokeRect(-120, -50, 240, 70);
      ctx.font = 'bold 44px Georgia, serif';
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

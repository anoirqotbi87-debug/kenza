import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('MemoryHealthWidget component', () => {
  const componentPath = resolve(__dirname, 'MemoryHealthWidget.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('se connecte au store SRS Zustand et aux cartes dues', () => {
    expect(source).toContain('useAppStore');
    expect(source).toContain('state.srsDeck');
    expect(source).toContain('state.getDueCards');
  });

  it('calcule les métriques adaptatives de rétention, latence et reprises vocales', () => {
    expect(source).toContain('retentionScore');
    expect(source).toContain('reviewCards');
    expect(source).toContain('learningCards');
    expect(source).toContain('avgEaseFactor');
    expect(source).toContain('totalVocalFailures');
    expect(source).toContain('avgResponseTimeSec');
  });

  it('expose les statuts qualitatifs de santé mnésique (Excellente, Stable, À consolider)', () => {
    expect(source).toContain('Excellente');
    expect(source).toContain('Stable');
    expect(source).toContain('À consolider');
  });

  it('affiche la recommandation contextuelle de la Smart Queue', () => {
    expect(source).toContain('Recommandation Smart Queue :');
    expect(source).toContain('cartes prioritaires');
  });

  it('gère l’état vide sans carte active de manière bienveillante', () => {
    expect(source).toContain('Aucune carte SRS active pour le moment');
  });
});

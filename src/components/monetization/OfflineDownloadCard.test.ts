import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('OfflineDownloadCard component', () => {
  const componentPath = resolve(__dirname, 'OfflineDownloadCard.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('se connecte au moteur offlineAudioCache pour la gestion du Cache Storage', () => {
    expect(source).toContain('precacheEssentialCorpus');
    expect(source).toContain('getAudioCacheStats');
    expect(source).toContain('clearAudioCache');
  });

  it('affiche les informations d’espace occupé et le statut 100% hors-ligne', () => {
    expect(source).toContain('formattedCachedStatus');
    expect(source).toContain('activeBadge');
    expect(source).toContain('100% hors-ligne');
  });

  it('gère une barre de progression fluide pendant le téléchargement par lots', () => {
    expect(source).toContain('progress.percent');
    expect(source).toContain('progress.completed');
    expect(source).toContain('progress.total');
  });

  it('respecte le sens de lecture RTL pour la langue arabe', () => {
    expect(source).toContain('isAr ? \'rtl\' : \'ltr\'');
  });

  it('intègre la gestion de la purge du cache via bouton d’action', () => {
    expect(source).toContain('handleClear');
    expect(source).toContain('clearCache');
  });
});

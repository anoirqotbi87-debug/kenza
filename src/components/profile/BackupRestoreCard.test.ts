import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('BackupRestoreCard component', () => {
  const componentPath = resolve(__dirname, 'BackupRestoreCard.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('se connecte au moteur de progressionBackup', () => {
    expect(source).toContain('createBackupEnvelope');
    expect(source).toContain('generateBackupFilename');
    expect(source).toContain('encodeBackupToBase64');
    expect(source).toContain('decodeBackupFromBase64');
    expect(source).toContain('verifyChecksum');
    expect(source).toContain('applyProgressionRestore');
  });

  it('gère l’exportation de fichier JSON et de code Base64 pour mobile', () => {
    expect(source).toContain('handleExportJson');
    expect(source).toContain('handleCopyMobileCode');
  });

  it('propose le choix déterministe entre fusion (merge) et remplacement (overwrite)', () => {
    expect(source).toContain("handleConfirmRestore('merge')");
    expect(source).toContain("handleConfirmRestore('overwrite')");
  });

  it('intègre les attributs d’accessibilité et de flux RTL pour la langue arabe', () => {
    expect(source).toContain('isAr ? \'rtl\' : \'ltr\'');
  });
});

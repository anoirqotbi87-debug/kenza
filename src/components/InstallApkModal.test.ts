import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('InstallApkModal component', () => {
  const componentPath = resolve(__dirname, 'InstallApkModal.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('gère la persistance de fermeture dans localStorage via kenza_apk_modal_dismissed', () => {
    expect(source).toContain("localStorage.getItem('kenza_apk_modal_dismissed')");
    expect(source).toContain("localStorage.setItem('kenza_apk_modal_dismissed', 'true')");
  });

  it('propose les deux boutons explicites Télécharger et Annuler', () => {
    expect(source).toContain('Annuler');
    expect(source).toContain('Télécharger');
    expect(source).toContain('/downloads/kenza-v1.0.apk');
  });

  it('applique le design modal clair (ivoire/blanc, bordure ambrée et coins arrondis)', () => {
    expect(source).toContain('bg-[#FFFEFA]');
    expect(source).toContain('border-amber-200');
    expect(source).toContain('rounded-2xl');
    expect(source).toContain('shadow-2xl');
  });

  it('intègre les attributs d’accessibilité pour le pattern dialogue modal', () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain('aria-labelledby="apk-modal-title"');
  });
});

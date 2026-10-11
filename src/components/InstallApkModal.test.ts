import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('InstallApkBanner component', () => {
  const componentPath = resolve(__dirname, 'InstallApkBanner.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  it('gère la persistance de fermeture dans localStorage via kenza_apk_banner_dismissed', () => {
    expect(source).toContain("localStorage.getItem('kenza_apk_banner_dismissed')");
    expect(source).toContain("localStorage.setItem('kenza_apk_banner_dismissed'");
  });

  it('propose le téléchargement direct de l’APK officiel', () => {
    expect(source).toContain('/downloads/kenza-v1.0.apk');
    expect(source).toContain('Télécharger');
  });

  it('applique le design bannière flottante bleu nuit (#142943) avec accent doré', () => {
    expect(source).toContain('bg-[#142943]');
    expect(source).toContain('bg-[#ddb578]');
    expect(source).toContain('rounded-2xl');
    expect(source).toContain('fixed bottom-20');
  });

  it('intègre les attributs d’accessibilité pour le pattern notification/banner', () => {
    expect(source).toContain('role="region"');
    expect(source).toContain('aria-label="Application Android Kenza"');
  });
});

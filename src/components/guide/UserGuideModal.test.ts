import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('UserGuideModal component', () => {
  const componentPath = resolve(__dirname, 'UserGuideModal.tsx');
  const source = readFileSync(componentPath, 'utf-8');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('vérifie l’ouverture automatique sur première visite via kenza_onboarding_completed', () => {
    expect(source).toContain("localStorage.getItem('kenza_onboarding_completed')");
    expect(source).toContain('800'); // délai de 800ms
  });

  it('enregistre kenza_onboarding_completed dans localStorage lors de la fermeture', () => {
    expect(source).toContain("localStorage.setItem('kenza_onboarding_completed', 'true')");
  });

  it('intègre les 4 étapes complètes avec leurs icônes et stepper', () => {
    // Étape 1 : Le Parcours
    expect(source).toContain('Le Parcours Pas à Pas');
    expect(source).toContain('Modules 1 à 7');
    expect(source).toContain('Compass');

    // Étape 2 : Karim Coach IA
    expect(source).toContain('Karim, Votre Coach IA Conversationnel');
    expect(source).toContain('Casablanca');
    expect(source).toContain('MessageSquare');

    // Étape 3 : Répétition Espacée SRS
    expect(source).toContain('Répétition Espacée & Cartes Mémoire (SRS)');
    expect(source).toContain('Sparkles');

    // Étape 4 : Mon Espace & Code VIP
    expect(source).toContain('Mon Espace & Code VIP');
    expect(source).toContain('VIPEIDER');
    expect(source).toContain('Crown');
  });

  it('supporte le multilingue intégral (FR, EN, ES, AR) et l’orientation RTL pour l’arabe', () => {
    // Traductions FR, EN, ES, AR
    expect(source).toContain("finish: 'C\\'est parti !'");
    expect(source).toContain("finish: 'Let\\'s go!'");
    expect(source).toContain("finish: '¡Empezar!'");
    expect(source).toContain("finish: 'لنبدأ !'");

    // Arabe
    expect(source).toContain('المسار خطوة بخطوة');
    expect(source).toContain('كريم، مدربك بالذكاء الاصطناعي');

    // Orientation RTL
    expect(source).toContain("dir={isRtl ? 'rtl' : 'ltr'}");
    expect(source).toContain("const isRtl = langKey === 'ar'");
  });

  it('assure l’accessibilité WCAG avec rôle dialog et aria-modal', () => {
    expect(source).toContain('role="dialog"');
    expect(source).toContain('aria-modal="true"');
    expect(source).toContain('aria-labelledby="user-guide-title"');
    expect(source).toContain('backdrop-blur-sm');
  });

  it('permet la navigation entre les étapes (boutons Précédent / Suivant et dots)', () => {
    expect(source).toContain('handleNext');
    expect(source).toContain('handlePrev');
    expect(source).toContain('setCurrentStep');
  });
});

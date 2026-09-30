import { describe, it, expect } from 'vitest';
import { HOME_LESSON_MODULES, isPremiumLesson } from './homeCurriculum';
import { fullCurriculum } from './curriculum';
import { PREMIUM_MODULES, isModuleLocked } from '@/lib/premiumModules';

describe('accueil — gating aligne sur la source unique', () => {
  it('chaque lecon de l accueil pointe un module reel du curriculum', () => {
    const knownModules = Object.keys(fullCurriculum);
    for (const [lessonId, moduleKey] of Object.entries(HOME_LESSON_MODULES)) {
      expect(knownModules, `« ${lessonId} » pointe le module inconnu « ${moduleKey} »`).toContain(moduleKey);
    }
  });

  it('le statut premium derive de @/lib/premiumModules, sans redeclaration', () => {
    for (const [lessonId, moduleKey] of Object.entries(HOME_LESSON_MODULES)) {
      const expected = PREMIUM_MODULES.includes(moduleKey);
      expect(isPremiumLesson(lessonId), `« ${lessonId} » (module ${moduleKey})`).toBe(expected);
    }
  });

  it('les modules gratuits 1 et 2 restent ouverts avant le paywall', () => {
    // Les deux seuls modules gratuits portent la conversion : leurs lecons ne
    // doivent jamais etre verrouillees.
    for (const lessonId of ['hello', 'cafe', 'medina']) {
      expect(isPremiumLesson(lessonId), `« ${lessonId} » devrait etre gratuit`).toBe(false);
    }
  });

  it('les lecons des modules avances sont reservees aux abonnes', () => {
    for (const lessonId of ['marrakech', 'tanger']) {
      expect(isPremiumLesson(lessonId), `« ${lessonId} » devrait etre premium`).toBe(true);
    }
  });

  it('une lecon inconnue n est pas consideree comme premium', () => {
    // Fail-open volontaire : une lecon non mappee ne doit pas bloquer
    // l'apprenant sur un ecran de paiement.
    expect(isPremiumLesson('lecon_inexistante')).toBe(false);
  });

  it('reste coherent avec isModuleLocked pour un abonne', () => {
    for (const [lessonId, moduleKey] of Object.entries(HOME_LESSON_MODULES)) {
      const lockedForPro = isModuleLocked(moduleKey, true);
      expect(lockedForPro, `module ${moduleKey} ne doit pas etre verrouille pour un abonne`).toBe(false);
      expect(isPremiumLesson(lessonId) && !lockedForPro).toBe(isPremiumLesson(lessonId));
    }
  });
});

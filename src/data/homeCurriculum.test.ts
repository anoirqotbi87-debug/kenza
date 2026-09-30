import { describe, it, expect } from 'vitest';
import {
  HOME_LESSON_MODULES,
  LEGACY_HOME_LESSON_IDS,
  isPremiumLesson,
  migrateLegacyLessonIds,
  getModuleSummaries,
  getPlayableLessons,
  getNextLesson,
} from './homeCurriculum';
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

describe('accueil vitrine — lecture du curriculum central', () => {
  it('expose les 7 modules avec un decoupage gratuit coherent', () => {
    const modules = getModuleSummaries();
    expect(modules.map((m) => m.key)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    expect(modules.filter((m) => m.free).map((m) => m.key)).toEqual(['1', '2']);
  });

  it('chaque module annonce au moins une lecon jouable', () => {
    for (const mod of getModuleSummaries()) {
      expect(mod.lessons, `module ${mod.key} sans lecon jouable`).toBeGreaterThan(0);
      expect(mod.steps, `module ${mod.key} sans etape`).toBeGreaterThan(0);
    }
  });

  it('expose les lecons du curriculum, sans placeholder vide', () => {
    const lessons = getPlayableLessons('fr');
    expect(lessons.length).toBeGreaterThan(0);
    for (const lesson of lessons) {
      expect(lesson.steps, `« ${lesson.id} » sans etape`).toBeGreaterThan(0);
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(lesson.description.length).toBeGreaterThan(0);
    }
  });

  it('rend le module 2 « Au Souk » visible depuis l accueil', () => {
    // La lecon livree en PR #11 doit apparaitre dans la vitrine, sinon elle
    // reste invisible pour un nouvel arrivant.
    const souk = getPlayableLessons('fr').find((l) => l.id === 'l_module2_souk_1');
    expect(souk, 'la lecon du souk doit etre exposee').toBeDefined();
    expect(souk?.moduleKey).toBe('2');
    expect(souk?.free).toBe(true);
  });

  it('propose une prochaine lecon gratuite non terminee', () => {
    const next = getNextLesson('fr', []);
    expect(next).not.toBeNull();
    expect(next?.free).toBe(true);
  });

  it('avance au fur et a mesure que les lecons sont terminees', () => {
    const lessons = getPlayableLessons('fr').filter((l) => l.free);
    const first = lessons[0];
    const next = getNextLesson('fr', [first.id]);
    expect(next?.id).not.toBe(first.id);
  });

  it('ne propose jamais une lecon premium quand le gratuit reste a faire', () => {
    const next = getNextLesson('fr', []);
    expect(next?.free).toBe(true);
  });
});

describe('migration des identifiants de l ancien accueil (store v4 -> v5)', () => {
  it('traduit chaque ancien identifiant vers le curriculum central', () => {
    for (const [legacyId, centralId] of Object.entries(LEGACY_HOME_LESSON_IDS)) {
      expect(migrateLegacyLessonIds([legacyId])).toEqual([centralId]);
    }
  });

  it('les identifiants cibles existent reellement dans le curriculum', () => {
    const known = new Set(getPlayableLessons('fr').map((l) => l.id));
    for (const [legacyId, centralId] of Object.entries(LEGACY_HOME_LESSON_IDS)) {
      expect(known, `« ${legacyId} » -> « ${centralId} » introuvable`).toContain(centralId);
    }
  });

  it('preserve la progression en traduisant sans rien perdre', () => {
    const migrated = migrateLegacyLessonIds(['hello', 'cafe', 'medina']);
    expect(migrated).toEqual(['l2_greetings_1', 'l_module2_cafe_1', 'l_module2_souk_1']);
    expect(migrated).toHaveLength(3);
  });

  it('deduplique quand deux lecons pointent le meme contenu central', () => {
    // `medina` et `marrakech` enseignaient toutes deux le souk du module 2.
    const migrated = migrateLegacyLessonIds(['medina', 'marrakech']);
    expect(migrated).toEqual(['l_module2_souk_1']);
  });

  it('laisse intacts les identifiants deja centraux', () => {
    const already = ['l1_phonetics_1', 'l_module2_souk_1'];
    expect(migrateLegacyLessonIds(already)).toEqual(already);
  });

  it('ne perd pas un identifiant inconnu', () => {
    expect(migrateLegacyLessonIds(['lecon_future'])).toEqual(['lecon_future']);
  });
});

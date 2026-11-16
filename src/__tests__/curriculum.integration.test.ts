import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';
import { advancedModulesLessons, findWordsForUnit } from '@/data/modules8to10';
import { getHomeModules, getHomeModuleLessons } from '@/data/homeModules';
import { getWordFromDictionary } from '@/data/srs-deck';

describe('Curriculum Integration — Modules 8 à 10 dans Zustand & Navigation', () => {
  beforeEach(() => {
    // Réinitialisation de la progression pour chaque test
    useAppStore.getState().resetUserProgress();
  });

  describe('1. Exposition dans useAppStore (Catalogue Global)', () => {
    it('expose allModules et getModules() contenant exactement les 10 modules (1 à 10)', () => {
      const state = useAppStore.getState();
      const allMods = state.allModules;
      const getMods = state.getModules();

      expect(allMods).toBeDefined();
      expect(allMods).toHaveLength(10);
      expect(getMods).toEqual(allMods);

      const modKeys = allMods.map((m) => m.key);
      expect(modKeys).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('les modules 8, 9 et 10 possèdent les métadonnées CECRL (C1 / C2) et leurs unités', () => {
      const allMods = useAppStore.getState().getModules();
      const mod8 = allMods.find((m) => m.key === '8');
      const mod9 = allMods.find((m) => m.key === '9');
      const mod10 = allMods.find((m) => m.key === '10');

      expect(mod8).toBeDefined();
      expect(mod8?.level).toBe('C1');
      expect(mod8?.unitsCount).toBe(3);
      expect(mod8?.isAdvanced).toBe(true);

      expect(mod9).toBeDefined();
      expect(mod9?.level).toBe('C1');
      expect(mod9?.unitsCount).toBe(3);
      expect(mod9?.isAdvanced).toBe(true);

      expect(mod10).toBeDefined();
      expect(mod10?.level).toBe('C2');
      expect(mod10?.unitsCount).toBe(3);
      expect(mod10?.isAdvanced).toBe(true);
    });
  });

  describe('2. Leçons Interactives et Structure des Exercices', () => {
    it('génère des leçons jouables valides pour chaque unité des modules 8 à 10', () => {
      for (const modId of [8, 9, 10]) {
        const lessons = advancedModulesLessons[modId];
        expect(lessons).toBeDefined();
        expect(lessons).toHaveLength(3);

        for (const lesson of lessons) {
          expect(lesson.id).toMatch(/^unit_(8|9|10)_[1-3]$/);
          expect(lesson.steps.length).toBeGreaterThan(0);

          // Vérifie la présence des étapes de vocabulaire (learning)
          const learnSteps = lesson.steps.filter((s) => s.type === 'learning');
          expect(learnSteps).toHaveLength(6);

          for (const step of learnSteps) {
            expect(step.content).toBeDefined();
            expect(step.content?.arabizi).toBeTruthy();
            expect(step.content?.arabic).toBeTruthy();
            expect(step.content?.translation).toBeDefined();
          }

          // Vérifie la présence des exercices QCM
          const mcqSteps = lesson.steps.filter(
            (s) => s.type === 'exercise' && s.exercise?.type === 'mcq'
          );
          expect(mcqSteps.length).toBeGreaterThanOrEqual(1);
          for (const mcq of mcqSteps) {
            expect(mcq.exercise?.prompt).toBeDefined();
            expect(mcq.exercise?.options?.length).toBeGreaterThanOrEqual(2);
            const optIds = mcq.exercise?.options?.map((o) => o.id) || [];
            expect(optIds).toContain(mcq.exercise?.answer);
          }

          // Vérifie la présence de l'exercice d'association (matching)
          const matchSteps = lesson.steps.filter(
            (s) => s.type === 'exercise' && s.exercise?.type === 'matching'
          );
          expect(matchSteps).toHaveLength(1);
          expect(matchSteps[0].exercise?.pairs?.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe('3. Progression, Déblocage & Attribution XP', () => {
    it('enregistre la complétion d’une unité avancée et octroie l’XP', () => {
      const initialXp = useAppStore.getState().xp;
      useAppStore.getState().completeLesson('unit_8_1');

      const updatedState = useAppStore.getState();
      expect(updatedState.completedLessons).toContain('unit_8_1');
      expect(updatedState.xp).toBeGreaterThan(initialXp);
      expect(updatedState.unlockedBadges).toContain('business_darija');
    });

    it('setCompletedModules débloque toutes les unités des modules avancés', () => {
      useAppStore.getState().setCompletedModules(['8', '10']);

      const completed = useAppStore.getState().completedLessons;
      expect(completed).toContain('unit_8_1');
      expect(completed).toContain('unit_8_2');
      expect(completed).toContain('unit_8_3');
      expect(completed).toContain('unit_10_1');
      expect(completed).toContain('unit_10_2');
      expect(completed).toContain('unit_10_3');
    });
  });

  describe('4. Synchronisation SRS (Flashcards & Deck)', () => {
    it('ajoute les 6 mots d’une unité dans srsDeck via addUnitWordsToSRS', () => {
      const words = findWordsForUnit('unit_8_1');
      expect(words).toHaveLength(6);

      useAppStore.getState().addUnitWordsToSRS('unit_8_1');

      const deck = useAppStore.getState().srsDeck;
      for (const w of words) {
        expect(deck[w.id], `Carte SRS pour ${w.id}`).toBeDefined();
        expect(deck[w.id].wordId).toBe(w.id);
        expect(deck[w.id].state).toBe('new');
      }
    });

    it('résout immédiatement les mots des modules 8 à 10 dans getWordFromDictionary', () => {
      const wordM8 = getWordFromDictionary('m8_u1_w1');
      expect(wordM8).toBeDefined();
      expect(wordM8?.arabizi).toBe('charika');
      expect(wordM8?.arabic).toBe('شَرِكَة');

      const wordM10 = getWordFromDictionary('m10_u3_w6');
      expect(wordM10).toBeDefined();
      expect(wordM10?.arabizi).toBe('7daga');
      expect(wordM10?.arabic).toBe('حْدَاگَة');
    });
  });

  describe('5. Grille de Navigation (homeModules)', () => {
    it('affiche les 10 cartes de modules avec includeAdvanced=true', () => {
      const modules = getHomeModules('fr', [], false, true);
      expect(modules).toHaveLength(10);

      const mod8 = modules.find((m) => m.key === '8');
      const mod10 = modules.find((m) => m.key === '10');

      expect(mod8?.level).toBe('C1');
      expect(mod8?.locked).toBe(true); // Verrouillé pour utilisateur non-premium
      expect(mod8?.lessons).toBe(3);

      expect(mod10?.level).toBe('C2');
      expect(mod10?.locked).toBe(true);
    });

    it('déverrouille les modules avancés pour un utilisateur premium', () => {
      const modules = getHomeModules('fr', [], true, true);
      const mod8 = modules.find((m) => m.key === '8');
      expect(mod8?.locked).toBe(false);
    });

    it('getHomeModuleLessons retourne les 3 unités détaillées pour un module avancé', () => {
      const lessons = getHomeModuleLessons('fr', '9', ['unit_9_1']);
      expect(lessons).toHaveLength(3);
      expect(lessons[0].id).toBe('unit_9_1');
      expect(lessons[0].done).toBe(true);
      expect(lessons[1].done).toBe(false);
    });
  });
});

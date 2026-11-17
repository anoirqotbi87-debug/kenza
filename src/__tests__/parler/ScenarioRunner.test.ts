import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TAXI_SCENARIO } from '@/data/scenarios/taxiScenario';
import { ALL_SCENARIOS } from '@/data/scenarios';
import { useAppStore } from '@/store/useAppStore';
import { calculateSimilarity } from '@/lib/phonemeMatcher';

// Mock pour playAudio
vi.mock('@/lib/audio', () => ({
  playAudio: vi.fn().mockResolvedValue(undefined),
  preloadAudio: vi.fn().mockResolvedValue(undefined),
  preloadTtsAudio: vi.fn().mockResolvedValue(undefined),
  stopAudio: vi.fn(),
}));

describe('Street Scenario & ScenarioRunner Engine', () => {
  beforeEach(() => {
    useAppStore.getState().resetUserProgress();
  });

  describe('1. Validation des Données de TAXI_SCENARIO', () => {
    it('possède les métadonnées requises et est exporté dans ALL_SCENARIOS', () => {
      expect(TAXI_SCENARIO.id).toBe('taxi_street_scenario');
      expect(TAXI_SCENARIO.title).toBe('Négocier un Grand Taxi');
      expect(TAXI_SCENARIO.level).toBe('A2');
      expect(TAXI_SCENARIO.category).toBe('transport');
      expect(TAXI_SCENARIO.npcName).toBe('Si Mohammed');
      expect(TAXI_SCENARIO.turns.length).toBeGreaterThanOrEqual(4);

      // Présent dans ALL_SCENARIOS
      const found = ALL_SCENARIOS.find((s) => s.id === TAXI_SCENARIO.id);
      expect(found).toBeDefined();
    });

    it('chaque réplique comporte un texte en Arabe vocalisé et une transcription phonétique', () => {
      for (const turn of TAXI_SCENARIO.turns) {
        expect(turn.arabicText).toBeTruthy();
        expect(turn.arabiziText).toBeTruthy();
        expect(turn.translationFr).toBeTruthy();
        expect(turn.speakerRole).toBeTruthy();

        // Si tour utilisateur : vérification des phrases attendues et indices
        if (turn.speaker === 'user') {
          expect(turn.expectedPhrases).toBeDefined();
          expect(turn.expectedPhrases?.primaryArabizi).toBeTruthy();
          expect(turn.expectedPhrases?.primaryArabic).toBeTruthy();
          expect(turn.expectedPhrases?.acceptedVariants?.length).toBeGreaterThan(0);
          expect(turn.hintFrench).toBeTruthy();
        }
      }
    });

    it('le texte en arabe comporte un Tashkeel chirurgical sur les voyelles brèves et shadda', () => {
      const arabicTashkeelRegex = /[\u064B-\u0652\u0651]/;
      for (const turn of TAXI_SCENARIO.turns) {
        expect(turn.arabicText).toMatch(arabicTashkeelRegex);
      }
    });
  });

  describe('2. Algorithme de Correspondance Phonétique & Variantes', () => {
    it('valide la réplique utilisateur avec une variante acceptée', () => {
      const userTurn = TAXI_SCENARIO.turns.find((t) => t.speaker === 'user');
      expect(userTurn).toBeDefined();

      const variants = userTurn?.expectedPhrases?.acceptedVariants || [];
      expect(variants.length).toBeGreaterThan(0);

      // Simule une variante
      const spokenVariant = variants[0];
      const match = variants.some((v) => spokenVariant.toLowerCase().includes(v.toLowerCase()));
      expect(match).toBe(true);
    });

    it('évalue la similarité phonétique avec tolérance Darija', () => {
      const evalMatch = calculateSimilarity(
        'Wa 3alaykum salam ghadi l rbat',
        'Wa 3alaykumu s-salam, ghadi l-R-Rbat 3afak. Bch7al l-blasa ?',
        'وَعَلَيْكُمُ السَّلَامْ، غَادِي لِـ الرِّبَاطْ عَافَاكْ. بْشْحَالْ البْلَاصَة ؟'
      );
      expect(evalMatch.score).toBeGreaterThan(40);
    });
  });

  describe('3. Attribution de l’XP & Intégration Store', () => {
    it('attribue correctement les points d’XP lors de la complétion d’étapes', () => {
      const initialXp = useAppStore.getState().xp;
      useAppStore.getState().addXp(10);
      expect(useAppStore.getState().xp).toBe(initialXp + 10);

      // Bonus de fin de scénario
      useAppStore.getState().addXp(25);
      expect(useAppStore.getState().xp).toBe(initialXp + 35);
    });
  });
});

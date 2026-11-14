import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeChecksum,
  verifyChecksum,
  createBackupEnvelope,
  sanitizePayload,
  mergeProgression,
  encodeBackupToBase64,
  decodeBackupFromBase64,
  applyProgressionRestore,
  generateBackupFilename,
  ProgressionPayload,
} from './progressionBackup';
import { useAppStore } from '../../store/useAppStore';

describe('progressionBackup — Moteur de Sauvegarde & Restauration', () => {
  beforeEach(() => {
    useAppStore.setState({
      xp: 100,
      streakDays: 3,
      completedLessons: ['l1_1', 'l1_2'],
      srsDeck: {
        w1: {
          id: 'w1',
          wordId: 'w1',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          dueDate: '2026-11-14T00:00:00.000Z',
          state: 'learning',
        },
      },
      customVocabulary: {},
      isPremium: false,
    });
  });

  describe('Intégrité & Checksum FNV-1a', () => {
    it('génère un checksum reproductible', () => {
      const hash1 = computeChecksum('test-payload');
      const hash2 = computeChecksum('test-payload');
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(8);
    });

    it('valide une enveloppe intacte et rejette une enveloppe altérée', () => {
      const envelope = createBackupEnvelope();
      expect(verifyChecksum(envelope)).toBe(true);

      // Altération frauduleuse du payload
      const tampered = {
        ...envelope,
        payload: {
          ...envelope.payload,
          xp: 999999,
        },
      };
      expect(verifyChecksum(tampered)).toBe(false);
    });
  });

  describe('Protection Anti-Tampering & Assainissement', () => {
    it('exclut formellement les statuts payants (isPremium, isPro, isVip)', () => {
      const fraudulentRaw = {
        xp: 150,
        streakDays: 5,
        isPremium: true,
        isPro: true,
        isVip: true,
        role: 'admin',
        completedLessons: ['l1_1'],
      };

      const sanitized = sanitizePayload(fraudulentRaw);
      expect(sanitized.xp).toBe(150);
      expect(sanitized.streakDays).toBe(5);
      expect(sanitized).not.toHaveProperty('isPremium');
      expect(sanitized).not.toHaveProperty('isPro');
      expect(sanitized).not.toHaveProperty('isVip');
      expect(sanitized).not.toHaveProperty('role');
    });

    it('borne les nombres et évite les valeurs négatives ou NaN', () => {
      const raw = {
        xp: -50,
        streakDays: 'invalid',
        audioSpeed: 10,
      };

      const sanitized = sanitizePayload(raw);
      expect(sanitized.xp).toBe(0);
      expect(sanitized.streakDays).toBe(0);
      expect(sanitized.audioSpeed).toBe(2.0); // plafonné à 2.0
    });
  });

  describe('Fusion Déterministe (Merge)', () => {
    it('effectue l’union des leçons et des favoris sans doublon', () => {
      const current: ProgressionPayload = {
        xp: 100,
        streakDays: 2,
        activityDates: [],
        unlockedBadges: [],
        currentLevel: 1,
        completedLessons: ['l1_1', 'l1_2'],
        srsDeck: {},
        customVocabulary: {},
        favorites: ['fav1'],
      };

      const imported: ProgressionPayload = {
        xp: 80,
        streakDays: 5,
        activityDates: [],
        unlockedBadges: [],
        currentLevel: 1,
        completedLessons: ['l1_2', 'l1_3'],
        srsDeck: {},
        customVocabulary: {},
        favorites: ['fav1', 'fav2'],
      };

      const merged = mergeProgression(current, imported);
      expect(merged.completedLessons).toEqual(['l1_1', 'l1_2', 'l1_3']);
      expect(merged.favorites).toEqual(['fav1', 'fav2']);
      expect(merged.xp).toBe(100); // Math.max(100, 80)
      expect(merged.streakDays).toBe(5); // Math.max(2, 5)
    });

    it('résout les collisions de cartes SRS en faveur du progrès le plus avancé', () => {
      const current: ProgressionPayload = {
        xp: 0,
        streakDays: 0,
        activityDates: [],
        unlockedBadges: [],
        currentLevel: 1,
        completedLessons: [],
        customVocabulary: {},
        favorites: [],
        srsDeck: {
          w1: {
            id: 'w1',
            wordId: 'w1',
            interval: 1,
            repetition: 1,
            easeFactor: 2.5,
            dueDate: '2026-11-14T00:00:00.000Z',
            state: 'learning',
          },
        },
      };

      const imported: ProgressionPayload = {
        xp: 0,
        streakDays: 0,
        activityDates: [],
        unlockedBadges: [],
        currentLevel: 1,
        completedLessons: [],
        customVocabulary: {},
        favorites: [],
        srsDeck: {
          w1: {
            id: 'w1',
            wordId: 'w1',
            interval: 6,
            repetition: 3,
            easeFactor: 2.5,
            dueDate: '2026-11-20T00:00:00.000Z',
            state: 'review',
          },
        },
      };

      const merged = mergeProgression(current, imported);
      expect(merged.srsDeck.w1.repetition).toBe(3);
      expect(merged.srsDeck.w1.interval).toBe(6);
      expect(merged.srsDeck.w1.state).toBe('review');
    });
  });

  describe('Base64 Mobile Roundtrip', () => {
    it('encode et décode une sauvegarde en Base64 sans perte', () => {
      const envelope = createBackupEnvelope();
      const base64 = encodeBackupToBase64(envelope);
      expect(typeof base64).toBe('string');
      expect(base64.length).toBeGreaterThan(50);

      const decoded = decodeBackupFromBase64(base64);
      expect(decoded.checksum).toBe(envelope.checksum);
      expect(decoded.payload.xp).toBe(envelope.payload.xp);
    });

    it('lève une erreur si la chaîne Base64 est corrompue', () => {
      expect(() => decodeBackupFromBase64('corrupted_base64_data')).toThrow();
    });
  });

  describe('applyProgressionRestore — Réactivité Zustand & Sécurité', () => {
    it('met à jour réactivement le store Zustand lors d’une restauration', () => {
      const envelope = createBackupEnvelope({
        xp: 500,
        streakDays: 14,
        activityDates: ['2026-11-14'],
        unlockedBadges: ['badge_star'],
        currentLevel: 2,
        completedLessons: ['l1_1', 'l1_2', 'l1_3', 'l2_1'],
        srsDeck: {},
        customVocabulary: {},
        favorites: ['salam'],
      });

      const res = applyProgressionRestore(envelope, 'merge');
      expect(res.success).toBe(true);

      const state = useAppStore.getState();
      expect(state.xp).toBe(500);
      expect(state.streakDays).toBe(14);
      expect(state.completedLessons).toContain('l2_1');
      // Le statut premium n'est JAMAIS modifié par la restauration
      expect(state.isPremium).toBe(false);
    });

    it('génère un nom de fichier horodaté explicite', () => {
      const filename = generateBackupFilename(new Date('2026-11-14T12:00:00Z'));
      expect(filename).toBe('kenza-backup-2026-11-14.json');
    });
  });
});

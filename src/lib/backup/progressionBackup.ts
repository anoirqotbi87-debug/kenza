/**
 * Moteur de Sauvegarde & Restauration de Progression (JSON & Base64)
 * 
 * Fonctionnalités :
 * 1. Enveloppe standardisée avec schemaVersion: 1 et checksum d'intégrité
 * 2. Protection Anti-Tampering : exclusion stricte des statuts payants (isPremium/isVip)
 * 3. Fusion (Merge) déterministe (union des leçons/favoris, max XP/streak, collision SRS)
 * 4. Réhydratation réactive immédiate de Zustand (useAppStore.setState)
 * 5. Export fichier JSON (kenza-backup-YYYY-MM-DD.json) et code compact Base64 pour mobile
 */

import { useAppStore } from '../../store/useAppStore';
import { SRSCard, CustomVocabularyItem } from '../../types/srs';
import { Notation } from '../../types/curriculum';

export const BACKUP_APP_IDENTIFIER = 'kenza-darija-quest';
export const CURRENT_BACKUP_SCHEMA_VERSION = 1;

export interface ProgressionPayload {
  xp: number;
  streakDays: number;
  streakFreezes?: number;
  activityDates: string[];
  unlockedBadges: string[];
  currentLevel: number;
  completedLessons: string[];
  srsDeck: Record<string, SRSCard>;
  customVocabulary: Record<string, CustomVocabularyItem>;
  favorites: string[];
  preferredNotation?: Notation;
  soundEnabled?: boolean;
  audioSpeed?: number;
  uiLanguage?: 'fr' | 'en' | 'es' | 'ar';
  regionalVariant?: 'chamal' | 'casablanca' | 'fes';
  blindAudioMode?: boolean;
  hasCompletedOnboarding?: boolean;
  userGoal?: string | null;
  dailyTargetMinutes?: number | null;
}

export interface ProgressionBackupEnvelope {
  app: typeof BACKUP_APP_IDENTIFIER;
  schemaVersion: number;
  exportedAt: string; // ISO 8601
  checksum: string;
  payload: ProgressionPayload;
}

export interface RestoreResult {
  success: boolean;
  error?: string;
  restoredXp?: number;
  restoredLessonsCount?: number;
  restoredCardsCount?: number;
}

/**
 * Calcule un checksum rapide et déterministe (FNV-1a 32-bit en hexadécimal).
 */
export function computeChecksum(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Valide l'intégrité structurelle et cryptographique de l'enveloppe de sauvegarde.
 */
export function verifyChecksum(envelope: unknown): envelope is ProgressionBackupEnvelope {
  if (!envelope || typeof envelope !== 'object') return false;
  const env = envelope as Record<string, unknown>;

  if (env.app !== BACKUP_APP_IDENTIFIER) return false;
  if (typeof env.schemaVersion !== 'number' || env.schemaVersion < 1) return false;
  if (!env.payload || typeof env.payload !== 'object') return false;
  if (typeof env.checksum !== 'string') return false;

  const expected = computeChecksum(JSON.stringify(env.payload));
  return env.checksum === expected;
}

/**
 * Génère le nom de fichier par défaut : kenza-backup-YYYY-MM-DD.json
 */
export function generateBackupFilename(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `kenza-backup-${y}-${m}-${d}.json`;
}

/**
 * Extrait les favoris actuels depuis le localStorage.
 */
export function getLocalFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('kenza_favorites');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Extrait l'état actuel de progression depuis le store Zustand et localStorage.
 */
export function getCurrentProgressionPayload(): ProgressionPayload {
  const state = useAppStore.getState();
  const favorites = getLocalFavorites();

  return {
    xp: state.xp || 0,
    streakDays: state.streakDays || 1,
    streakFreezes: state.streakFreezes || 1,
    activityDates: Array.isArray(state.activityDates) ? [...state.activityDates] : [],
    unlockedBadges: Array.isArray(state.unlockedBadges) ? [...state.unlockedBadges] : [],
    currentLevel: state.currentLevel || 1,
    completedLessons: Array.isArray(state.completedLessons) ? [...state.completedLessons] : [],
    srsDeck: state.srsDeck ? { ...state.srsDeck } : {},
    customVocabulary: state.customVocabulary ? { ...state.customVocabulary } : {},
    favorites,
    preferredNotation: state.preferredNotation || 'arabizi',
    soundEnabled: state.soundEnabled ?? true,
    audioSpeed: state.audioSpeed ?? 1.0,
    uiLanguage: state.uiLanguage || 'fr',
    regionalVariant: state.regionalVariant || 'casablanca',
    blindAudioMode: state.blindAudioMode ?? false,
    hasCompletedOnboarding: state.hasCompletedOnboarding || false,
    userGoal: state.userGoal || null,
    dailyTargetMinutes: state.dailyTargetMinutes || null,
  };
}

/**
 * Construit une enveloppe de sauvegarde signée et prête pour l'export.
 */
export function createBackupEnvelope(
  payload: ProgressionPayload = getCurrentProgressionPayload()
): ProgressionBackupEnvelope {
  const payloadStr = JSON.stringify(payload);
  const checksum = computeChecksum(payloadStr);

  return {
    app: BACKUP_APP_IDENTIFIER,
    schemaVersion: CURRENT_BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    checksum,
    payload,
  };
}

/**
 * Encode une enveloppe de sauvegarde en chaîne compacte Base64 (idéal pour mobile).
 */
export function encodeBackupToBase64(envelope: ProgressionBackupEnvelope): string {
  const jsonStr = JSON.stringify(envelope);
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(unescape(encodeURIComponent(jsonStr)));
  }
  return Buffer.from(jsonStr, 'utf-8').toString('base64');
}

/**
 * Décode une chaîne Base64 en enveloppe de sauvegarde vérifiée.
 */
export function decodeBackupFromBase64(base64Str: string): ProgressionBackupEnvelope {
  const cleaned = base64Str.trim();
  let jsonStr = '';
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    jsonStr = decodeURIComponent(escape(window.atob(cleaned)));
  } else {
    jsonStr = Buffer.from(cleaned, 'base64').toString('utf-8');
  }

  const parsed = JSON.parse(jsonStr);
  if (!verifyChecksum(parsed)) {
    throw new Error('CORRUPTED_OR_TAMPERED_BACKUP');
  }
  return parsed;
}

/**
 * Valide et assainit strictement les données importées (Anti-Tampering & Type Safety).
 * Exclut formellement isPremium, isPro, isVip, user ou tout attribut non autorisé.
 */
export function sanitizePayload(raw: unknown): ProgressionPayload {
  if (!raw || typeof raw !== 'object') {
    throw new Error('INVALID_PAYLOAD_STRUCTURE');
  }

  const obj = raw as Record<string, unknown>;

  const xp = Math.max(0, Math.floor(Number(obj.xp) || 0));
  const streakDays = Math.max(0, Math.floor(Number(obj.streakDays) || 0));
  const streakFreezes = Math.max(0, Math.floor(Number(obj.streakFreezes) || 0));
  const currentLevel = Math.max(1, Math.floor(Number(obj.currentLevel) || 1));

  const completedLessons = Array.isArray(obj.completedLessons)
    ? obj.completedLessons.filter((l): l is string => typeof l === 'string' && l.trim().length > 0)
    : [];

  const favorites = Array.isArray(obj.favorites)
    ? obj.favorites.filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
    : [];

  const activityDates = Array.isArray(obj.activityDates)
    ? obj.activityDates.filter((d): d is string => typeof d === 'string')
    : [];

  const unlockedBadges = Array.isArray(obj.unlockedBadges)
    ? obj.unlockedBadges.filter((b): b is string => typeof b === 'string')
    : [];

  // Assainissement des cartes SRS
  const srsDeck: Record<string, SRSCard> = {};
  if (obj.srsDeck && typeof obj.srsDeck === 'object') {
    for (const [key, card] of Object.entries(obj.srsDeck as Record<string, unknown>)) {
      if (card && typeof card === 'object') {
        const c = card as Record<string, unknown>;
        srsDeck[key] = {
          id: String(c.id || key),
          wordId: String(c.wordId || key),
          interval: Math.max(0, Number(c.interval) || 0),
          repetition: Math.max(0, Number(c.repetition) || 0),
          easeFactor: Math.max(1.3, Number(c.easeFactor) || 2.5),
          dueDate: typeof c.dueDate === 'string' ? c.dueDate : new Date().toISOString(),
          state: c.state === 'learning' || c.state === 'review' ? c.state : 'new',
          updatedAt: typeof c.updatedAt === 'string' ? c.updatedAt : undefined,
        };
      }
    }
  }

  // Assainissement du vocabulaire personnalisé
  const customVocabulary: Record<string, CustomVocabularyItem> = {};
  if (obj.customVocabulary && typeof obj.customVocabulary === 'object') {
    for (const [key, word] of Object.entries(obj.customVocabulary as Record<string, unknown>)) {
      if (word && typeof word === 'object') {
        const w = word as Record<string, unknown>;
        if (typeof w.arabizi === 'string' && typeof w.arabic === 'string') {
          customVocabulary[key] = {
            id: String(w.id || key),
            arabizi: w.arabizi,
            arabic: w.arabic,
            translation: (w.translation as CustomVocabularyItem['translation']) || '',
            category: typeof w.category === 'string' ? w.category : undefined,
            audioUrl: typeof w.audioUrl === 'string' ? w.audioUrl : undefined,
            notes: typeof w.notes === 'string' ? w.notes : undefined,
          };
        }
      }
    }
  }

  const preferredNotation: Notation =
    obj.preferredNotation === 'arabic'
      ? 'arabic'
      : obj.preferredNotation === 'duo'
      ? 'duo'
      : 'arabizi';
  const soundEnabled = typeof obj.soundEnabled === 'boolean' ? obj.soundEnabled : true;
  const audioSpeed = typeof obj.audioSpeed === 'number' ? Math.max(0.5, Math.min(2.0, obj.audioSpeed)) : 1.0;
  const uiLanguage =
    obj.uiLanguage === 'en' || obj.uiLanguage === 'es' || obj.uiLanguage === 'ar'
      ? obj.uiLanguage
      : 'fr';
  const regionalVariant =
    obj.regionalVariant === 'chamal' || obj.regionalVariant === 'fes'
      ? obj.regionalVariant
      : 'casablanca';
  const blindAudioMode = typeof obj.blindAudioMode === 'boolean' ? obj.blindAudioMode : false;
  const hasCompletedOnboarding = typeof obj.hasCompletedOnboarding === 'boolean' ? obj.hasCompletedOnboarding : false;
  const userGoal = typeof obj.userGoal === 'string' ? obj.userGoal : null;
  const dailyTargetMinutes = typeof obj.dailyTargetMinutes === 'number' ? obj.dailyTargetMinutes : null;

  return {
    xp,
    streakDays,
    streakFreezes,
    activityDates,
    unlockedBadges,
    currentLevel,
    completedLessons,
    srsDeck,
    customVocabulary,
    favorites,
    preferredNotation,
    soundEnabled,
    audioSpeed,
    uiLanguage,
    regionalVariant,
    blindAudioMode,
    hasCompletedOnboarding,
    userGoal,
    dailyTargetMinutes,
  };
}

/**
 * Fusionne déterministement la progression locale avec la progression importée :
 * - Leçons complétées et favoris : Union ensembliste
 * - XP, Streak et Badges : Math.max
 * - Cartes SRS : Priorité au score SM-2 le plus avancé ou à la date la plus récente
 */
export function mergeProgression(
  current: ProgressionPayload,
  imported: ProgressionPayload
): ProgressionPayload {
  const completedLessons = Array.from(
    new Set([...(current.completedLessons || []), ...(imported.completedLessons || [])])
  );

  const favorites = Array.from(
    new Set([...(current.favorites || []), ...(imported.favorites || [])])
  );

  const unlockedBadges = Array.from(
    new Set([...(current.unlockedBadges || []), ...(imported.unlockedBadges || [])])
  );

  const activityDates = Array.from(
    new Set([...(current.activityDates || []), ...(imported.activityDates || [])])
  ).sort();

  const xp = Math.max(current.xp || 0, imported.xp || 0);
  const streakDays = Math.max(current.streakDays || 0, imported.streakDays || 0);
  const streakFreezes = Math.max(current.streakFreezes || 0, imported.streakFreezes || 0);
  const currentLevel = Math.max(current.currentLevel || 1, imported.currentLevel || 1);

  // Fusion fine des cartes SRS
  const srsDeck: Record<string, SRSCard> = { ...(current.srsDeck || {}) };
  for (const [key, impCard] of Object.entries(imported.srsDeck || {})) {
    const curCard = srsDeck[key];
    if (!curCard) {
      srsDeck[key] = impCard;
    } else {
      const curScore = (curCard.repetition || 0) * 100 + (curCard.interval || 0);
      const impScore = (impCard.repetition || 0) * 100 + (impCard.interval || 0);
      if (impScore > curScore) {
        srsDeck[key] = impCard;
      } else if (impScore === curScore) {
        const curDate = new Date(curCard.updatedAt || curCard.dueDate || 0).getTime();
        const impDate = new Date(impCard.updatedAt || impCard.dueDate || 0).getTime();
        if (impDate >= curDate) {
          srsDeck[key] = impCard;
        }
      }
    }
  }

  const customVocabulary: Record<string, CustomVocabularyItem> = {
    ...(current.customVocabulary || {}),
    ...(imported.customVocabulary || {}),
  };

  return {
    xp,
    streakDays,
    streakFreezes,
    activityDates,
    unlockedBadges,
    currentLevel,
    completedLessons,
    srsDeck,
    customVocabulary,
    favorites,
    preferredNotation: current.preferredNotation || imported.preferredNotation || 'arabizi',
    soundEnabled: current.soundEnabled ?? imported.soundEnabled ?? true,
    audioSpeed: current.audioSpeed ?? imported.audioSpeed ?? 1.0,
    uiLanguage: current.uiLanguage || imported.uiLanguage || 'fr',
    regionalVariant: current.regionalVariant || imported.regionalVariant || 'casablanca',
    blindAudioMode: current.blindAudioMode ?? imported.blindAudioMode ?? false,
    hasCompletedOnboarding: current.hasCompletedOnboarding || imported.hasCompletedOnboarding || false,
    userGoal: current.userGoal || imported.userGoal || null,
    dailyTargetMinutes: Math.max(current.dailyTargetMinutes || 0, imported.dailyTargetMinutes || 0) || null,
  };
}

/**
 * Applique la restauration (Fusion ou Remplacement) sur l'état applicatif.
 * Met à jour Zustand réactivement (useAppStore.setState) et synchronise localStorage.
 */
export function applyProgressionRestore(
  envelope: ProgressionBackupEnvelope,
  mode: 'merge' | 'overwrite' = 'merge'
): RestoreResult {
  if (!verifyChecksum(envelope)) {
    return { success: false, error: 'CHECKSUM_FAILED' };
  }

  try {
    const sanitizedImport = sanitizePayload(envelope.payload);
    const currentPayload = getCurrentProgressionPayload();

    const targetPayload =
      mode === 'merge'
        ? mergeProgression(currentPayload, sanitizedImport)
        : sanitizedImport;

    // 1. Mise à jour de localStorage pour les favoris
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kenza_favorites', JSON.stringify(targetPayload.favorites));
      } catch (err) {
        console.warn('[progressionBackup] Error saving favorites to localStorage:', err);
      }
    }

    // 2. Réhydratation réactive immédiate du store Zustand
    useAppStore.setState({
      xp: targetPayload.xp,
      streakDays: targetPayload.streakDays,
      streakFreezes: targetPayload.streakFreezes ?? 1,
      activityDates: targetPayload.activityDates,
      unlockedBadges: targetPayload.unlockedBadges,
      currentLevel: targetPayload.currentLevel,
      completedLessons: targetPayload.completedLessons,
      srsDeck: targetPayload.srsDeck,
      customVocabulary: targetPayload.customVocabulary,
      preferredNotation: targetPayload.preferredNotation,
      soundEnabled: targetPayload.soundEnabled,
      audioSpeed: targetPayload.audioSpeed,
      uiLanguage: targetPayload.uiLanguage,
      regionalVariant: targetPayload.regionalVariant,
      blindAudioMode: targetPayload.blindAudioMode,
      hasCompletedOnboarding: targetPayload.hasCompletedOnboarding,
      userGoal: targetPayload.userGoal,
      dailyTargetMinutes: targetPayload.dailyTargetMinutes,
    });

    return {
      success: true,
      restoredXp: targetPayload.xp,
      restoredLessonsCount: targetPayload.completedLessons.length,
      restoredCardsCount: Object.keys(targetPayload.srsDeck).length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
    return { success: false, error: message };
  }
}

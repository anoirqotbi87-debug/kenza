/**
 * Étape 6 — Mode hors-ligne / PWA. Politique de cache du Service Worker.
 *
 * Les prédicats de routes isolés de `sw.ts` pour être testables sans worker :
 * une stratégie `CacheFirst` sur les bons fichiers, `NetworkOnly` sur le
 * roleplay, et un nettoyage d'activation qui n'efface QUE les caches Kenza
 * périmés (les caches Serwist portent le mode hors-ligne).
 */

import { describe, it, expect } from 'vitest';
import {
  getActiveOwnCacheNames,
  getPrecacheRevision,
  isAudioAsset,
  isDocumentRequest,
  isFontAsset,
  isRoleplayApiRequest,
  isTtsApiRequest,
  shouldDeleteCache,
  SW_CACHE_NAMES,
} from '@/lib/offline/swPolicy';

describe('swPolicy — prédicats de routes', () => {
  const url = (pathname: string): URL => new URL(`https://kenza.app${pathname}`);

  it('détecte le roleplay IA via le pathname, jamais via l’URL complète', () => {
    expect(isRoleplayApiRequest(url('/api/roleplay/chat'))).toBe(true);
    expect(isRoleplayApiRequest(url('/api/other'))).toBe(false);
    // Un motif ancré `/^\/api\/roleplay\//` échouerait ici : les URLs sont absolues.
    expect(isRoleplayApiRequest(url('/api/roleplay'))).toBe(true);
    expect(isRoleplayApiRequest(url('/static/api/roleplay'))).toBe(false);
  });

  it('détecte la synthèse vocale sur son pathname', () => {
    expect(isTtsApiRequest(url('/api/tts?text=salam'))).toBe(true);
    expect(isTtsApiRequest(url('/api/tts/foo'))).toBe(true);
    expect(isTtsApiRequest(url('/api/roleplay'))).toBe(false);
  });

  it('reconnaît les assets audio et fontes par extension', () => {
    expect(isAudioAsset(url('/audio/salam.mp3'))).toBe(true);
    expect(isAudioAsset(url('/assets/salam.mp3?rev=1'))).toBe(true);
    expect(isAudioAsset(url('/audio/salam.MP3'))).toBe(true);
    expect(isAudioAsset(url('/audio/salam.txt'))).toBe(false);

    expect(isFontAsset(url('/fonts/brutal.woff2'))).toBe(true);
    expect(isFontAsset(url('/fonts/brutal.woff'))).toBe(true);
    expect(isFontAsset(url('/fonts/brutal.otf'))).toBe(true);
    expect(isFontAsset(url('/fonts/brutal.ttf'))).toBe(true);
    expect(isFontAsset(url('/fonts/brutal.wav'))).toBe(false);
  });

  it('ne sert le repli que sur les navigations de document', () => {
    expect(isDocumentRequest({ destination: 'document' })).toBe(true);
    expect(isDocumentRequest({ destination: 'script' })).toBe(false);
    expect(isDocumentRequest({ destination: 'image' })).toBe(false);
    expect(isDocumentRequest({ destination: 'style' })).toBe(false);
  });
});

describe('swPolicy — caches Kenza vs caches Serwist', () => {
  it('différencie le préfixe Kenza des cacheNames Serwist', () => {
    expect(SW_CACHE_NAMES.tts.startsWith('kenza-v2-')).toBe(true);
    expect(SW_CACHE_NAMES.audio.startsWith('kenza-v2-')).toBe(true);
    expect(SW_CACHE_NAMES.fonts.startsWith('kenza-v2-')).toBe(true);
  });

  it('garde les caches actifs, efface les anciens Kenza, jamais les caches Serwist', () => {
    const active = getActiveOwnCacheNames();
    expect(active).toContain(SW_CACHE_NAMES.tts);

    expect(shouldDeleteCache(SW_CACHE_NAMES.tts, active)).toBe(false);
    expect(shouldDeleteCache(SW_CACHE_NAMES.audio, active)).toBe(false);
    expect(shouldDeleteCache(SW_CACHE_NAMES.fonts, active)).toBe(false);

    // Version précédente possédée par Kenza.
    expect(shouldDeleteCache('kenza-v1-tts-cache', active)).toBe(true);
    expect(shouldDeleteCache('kenza-v1-audio-cache', active)).toBe(true);
    expect(shouldDeleteCache('kenza-v0-anything', active)).toBe(true);

    // Caches Serwist — précache et stratégies runtime du defaultCache.
    expect(shouldDeleteCache('serwist-precache-v2', active)).toBe(false);
    expect(shouldDeleteCache('pages', active)).toBe(false);
    expect(shouldDeleteCache('others', active)).toBe(false);
    expect(shouldDeleteCache('sites-https://kenza.app/audio', active)).toBe(false);

    // Cache sans rapport.
    expect(shouldDeleteCache('workbox-precache-v2', active)).toBe(false);
  });
});

describe('swPolicy — révision du précache', () => {
  it('change quand le manifeste change, stable pour un manifeste donné', () => {
    const a = [{ url: '/x' }, { url: '/y' }];
    const b = [{ url: '/x' }, { url: '/y' }, { url: '/z' }];
    const revA1 = getPrecacheRevision(a);
    const revA2 = getPrecacheRevision([{ url: '/y' }, { url: '/x' }]);
    expect(revA1).toBe(revA2);
    expect(getPrecacheRevision(b)).not.toBe(revA1);
  });

  it('est stable avec des révisions null et indépendante de l’ordre', () => {
    const rev = getPrecacheRevision(['/a', '/b']);
    expect(rev).toMatch(/^w/);
    expect(typeof rev).toBe('string');
  });
});
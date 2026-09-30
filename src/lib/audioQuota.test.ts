import { describe, it, expect, beforeEach } from 'vitest';
import {
  FREE_DAILY_AUDIO_LIMIT,
  audioQuotaStorageKey,
  readAudioQuota,
  hasAudioQuota,
  recordAudioPlay,
  remainingAudioQuota,
  shouldConsumeAudioQuota,
  type StorageLike,
} from './audioQuota';

/** localStorage minimal en memoire (l'env de test est node, sans DOM). */
function makeStorage(): StorageLike & { dump: () => Record<string, string> } {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  };
}

const J1 = new Date(2026, 8, 29, 10, 0, 0); // 29 sept. 2026, heure locale
const J2 = new Date(2026, 8, 30, 10, 0, 0); // lendemain

let storage: ReturnType<typeof makeStorage>;

beforeEach(() => {
  storage = makeStorage();
});

describe('audioQuota — cle de stockage par jour calendaire', () => {
  it('expose une limite gratuite de 10 ecoutes', () => {
    expect(FREE_DAILY_AUDIO_LIMIT).toBe(10);
  });

  it('la cle contient la date du jour', () => {
    expect(audioQuotaStorageKey(J1)).toBe('kenza_audio_quota_2026-09-29');
  });

  it('la cle change au changement de jour', () => {
    expect(audioQuotaStorageKey(J2)).toBe('kenza_audio_quota_2026-09-30');
  });
});

describe('audioQuota — utilisateur premium', () => {
  it('bypass total : toujours autorise, meme apres 999 ecoutes', () => {
    storage.setItem(audioQuotaStorageKey(J1), '999');
    expect(hasAudioQuota(storage, true, J1)).toBe(true);
  });

  it('remaining renvoie null (illimite) et n incremente jamais le compteur', () => {
    expect(remainingAudioQuota(storage, true, J1)).toBeNull();
    expect(readAudioQuota(storage, J1)).toBe(0);
  });
});

describe('audioQuota — utilisateur gratuit', () => {
  it('autorise les 10 premieres ecoutes', () => {
    for (let i = 0; i < FREE_DAILY_AUDIO_LIMIT; i++) {
      expect(hasAudioQuota(storage, false, J1)).toBe(true);
      recordAudioPlay(storage, J1);
    }
    expect(readAudioQuota(storage, J1)).toBe(10);
  });

  it('bloque la 11e ecoute', () => {
    for (let i = 0; i < FREE_DAILY_AUDIO_LIMIT; i++) recordAudioPlay(storage, J1);
    expect(hasAudioQuota(storage, false, J1)).toBe(false);
    expect(remainingAudioQuota(storage, false, J1)).toBe(0);
  });

  it('decompte le restant correctement', () => {
    expect(remainingAudioQuota(storage, false, J1)).toBe(10);
    recordAudioPlay(storage, J1);
    recordAudioPlay(storage, J1);
    expect(remainingAudioQuota(storage, false, J1)).toBe(8);
  });

  it('recordAudioPlay renvoie le nouveau total', () => {
    expect(recordAudioPlay(storage, J1)).toBe(1);
    expect(recordAudioPlay(storage, J1)).toBe(2);
  });

  it('le quota se reinitialise le lendemain', () => {
    for (let i = 0; i < FREE_DAILY_AUDIO_LIMIT; i++) recordAudioPlay(storage, J1);
    expect(hasAudioQuota(storage, false, J1)).toBe(false);
    // Nouveau jour : compteur neuf.
    expect(readAudioQuota(storage, J2)).toBe(0);
    expect(hasAudioQuota(storage, false, J2)).toBe(true);
  });

  it('tolere une valeur corrompue en storage', () => {
    storage.setItem(audioQuotaStorageKey(J1), 'pas-un-nombre');
    expect(readAudioQuota(storage, J1)).toBe(0);
    expect(hasAudioQuota(storage, false, J1)).toBe(true);
  });

  it('ne casse pas si le storage est indisponible', () => {
    expect(readAudioQuota(null, J1)).toBe(0);
    expect(hasAudioQuota(null, false, J1)).toBe(true);
  });
});

describe('shouldConsumeAudioQuota — seuls les contenus consomment', () => {
  it('les sons de feedback UI ne consomment pas le quota', () => {
    expect(shouldConsumeAudioQuota('correct')).toBe(false);
    expect(shouldConsumeAudioQuota('error')).toBe(false);
  });

  it('le contenu (mot, dialogue) consomme le quota', () => {
    expect(shouldConsumeAudioQuota('salam')).toBe(true);
    expect(shouldConsumeAudioQuota('كيفاش')).toBe(true);
  });

  it('un contenu vide ne consomme rien', () => {
    expect(shouldConsumeAudioQuota('')).toBe(false);
    expect(shouldConsumeAudioQuota('   ')).toBe(false);
  });

  it('une lecture avec audioUrl consomme, meme sans texte', () => {
    // DeckManagerView lit une carte via playAudio('', audioUrl) : sans cette
    // regle, le quota serait contournable en passant un texte vide.
    expect(shouldConsumeAudioQuota('', 'https://cdn.kenza.ma/card.mp3')).toBe(true);
  });

  it('un son d\'interface reste gratuit meme avec un audioUrl', () => {
    expect(shouldConsumeAudioQuota('correct', 'https://cdn.kenza.ma/ding.mp3')).toBe(false);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import {
  FREE_DAILY_AUDIO_LIMIT,
  audioQuotaStorageKey,
  hasAudioQuota,
  recordAudioPlay,
  remainingAudioQuota,
  shouldConsumeAudioQuota,
  type StorageLike,
} from '@/lib/audioQuota';

function makeStorage(): StorageLike & { dump: () => Record<string, string> } {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, v),
    dump: () => Object.fromEntries(map),
  };
}

const J1 = new Date(2026, 8, 29, 10, 0, 0);

describe('Audio Quota Integration in Vocal Architecture', () => {
  let storage: ReturnType<typeof makeStorage>;

  beforeEach(() => {
    storage = makeStorage();
  });

  it('guarantees 10 free audio plays per day before paywall', () => {
    expect(FREE_DAILY_AUDIO_LIMIT).toBe(10);
  });

  it('correctly tracks free usage up to daily quota', () => {
    for (let i = 0; i < 10; i++) {
      expect(hasAudioQuota(storage, false, J1)).toBe(true);
      recordAudioPlay(storage, J1);
    }
    expect(hasAudioQuota(storage, false, J1)).toBe(false);
    expect(remainingAudioQuota(storage, false, J1)).toBe(0);
  });

  it('grants unlimited audio quota to premium users', () => {
    storage.setItem(audioQuotaStorageKey(J1), '100');
    expect(hasAudioQuota(storage, true, J1)).toBe(true);
    expect(remainingAudioQuota(storage, true, J1)).toBeNull();
  });

  it('ensures TTS phrases consume quota while UI sound effects remain free', () => {
    expect(shouldConsumeAudioQuota('salam kidayr')).toBe(true);
    expect(shouldConsumeAudioQuota('fin ghadi 3afak')).toBe(true);
    expect(shouldConsumeAudioQuota('correct')).toBe(false);
    expect(shouldConsumeAudioQuota('error')).toBe(false);
  });
});

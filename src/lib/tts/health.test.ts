import { describe, it, expect } from 'vitest';

import { isMpegAudio, probeTts, MIN_AUDIO_BYTES, WITNESS_TEXT } from './health';

/** Trame MPEG-1 Layer III valide (0xFF 0xFB …), complétée à la taille minimale. */
function fakeMpeg(size = MIN_AUDIO_BYTES + 500): Buffer {
  const buf = Buffer.alloc(size, 0x00);
  buf[0] = 0xff;
  buf[1] = 0xfb;
  return buf;
}

describe('isMpegAudio', () => {
  it('accepte une trame MPEG valide de taille suffisante', () => {
    expect(isMpegAudio(fakeMpeg())).toBe(true);
  });

  it('accepte la trame réellement produite par Edge TTS (fff364)', () => {
    const buf = fakeMpeg();
    buf[1] = 0xf3;
    expect(isMpegAudio(buf)).toBe(true);
  });

  it('rejette un tampon vide', () => {
    expect(isMpegAudio(Buffer.alloc(0))).toBe(false);
  });

  it('rejette une réponse trop courte, même avec le bon octet de synchronisation', () => {
    const tiny = Buffer.from([0xff, 0xfb, 0x90, 0x00]);
    expect(tiny.length).toBeLessThan(MIN_AUDIO_BYTES);
    expect(isMpegAudio(tiny)).toBe(false);
  });

  it('rejette une page HTML (l’octet 0xFF seul ne suffit pas)', () => {
    const html = Buffer.concat([Buffer.from('<html>\xff</html>'), Buffer.alloc(MIN_AUDIO_BYTES)]);
    expect(isMpegAudio(html)).toBe(false);
  });

  it('rejette une version ou une couche réservée', () => {
    const reservedVersion = fakeMpeg();
    reservedVersion[1] = 0xe9; // version = 01 (réservée)
    expect(isMpegAudio(reservedVersion)).toBe(false);

    const reservedLayer = fakeMpeg();
    reservedLayer[1] = 0xf9; // layer = 00 (réservée)
    expect(isMpegAudio(reservedLayer)).toBe(false);
  });
});

describe('probeTts', () => {
  it('retourne ok avec la taille mesurée quand la synthèse renvoie un MP3', async () => {
    const audio = fakeMpeg(12000);
    const result = await probeTts({ synthesize: async () => audio });

    expect(result.status).toBe('ok');
    expect(result.bytes).toBe(12000);
    expect(result.error).toBeUndefined();
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('retourne degraded quand la synthèse échoue (panne de handshake)', async () => {
    const result = await probeTts({
      synthesize: async () => {
        throw new Error('Edge TTS handshake refused: HTTP 200');
      },
    });

    expect(result.status).toBe('degraded');
    expect(result.bytes).toBe(0);
    expect(result.error).toContain('HTTP 200');
  });

  it('retourne degraded quand la synthèse « réussit » mais renvoie du vide', async () => {
    // C'est le scénario le plus trompeur : un 200 sans audio doit être un échec.
    const result = await probeTts({ synthesize: async () => Buffer.alloc(0) });

    expect(result.status).toBe('degraded');
    expect(result.error).toContain('non audio');
  });

  it('transmet bien le mot témoin au pipeline SSML', async () => {
    let captured = '';
    await probeTts({
      synthesize: async (ssml) => {
        captured = ssml;
        return fakeMpeg();
      },
    });

    expect(captured).toContain('<speak');
    // Le mot témoin est translittéré en arabe vocalisé avant la synthèse.
    expect(captured).not.toContain(WITNESS_TEXT);
    expect(captured).toMatch(/[\u0600-\u06ff]/);
  });
});

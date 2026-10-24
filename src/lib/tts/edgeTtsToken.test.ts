import { describe, it, expect } from 'vitest';

import { generateSecMsGecV2, SEC_MS_GEC_VERSION } from './edgeTtsToken';

/**
 * Vecteurs de référence produits par `edge_tts.drm.generate_sec_ms_gec_v2`
 * (Python v7.3.1). Le service Edge TTS rejette tout jeton divergent : ce test
 * verrouille l'implémentation contre une régression silencieuse du handshake.
 */
describe('generateSecMsGecV2', () => {
  const vectors: Array<[number, string]> = [
    [1700000000, '2CD23A2CA0B2595A-F3C846C370E05F9CC83ACC5F995C5F5D87A4D0F14CE8936A0F902E64099E38A2'],
    [1700000000.5, '2CD23A2CA0B2595A-F3C846C370E05F9CC83ACC5F995C5F5D87A4D0F14CE8936A0F902E64099E38A2'],
    [1761336000, 'A593417306FFCD90-22356C9BAA9273B87F89FB3880943D8F8AA72241B1BF272E9C9E24B596802803'],
    [1761336123.456, 'A593417306FFCD90-22356C9BAA9273B87F89FB3880943D8F8AA72241B1BF272E9C9E24B596802803'],
    [1800000000, '99E54519B490BE5C-E162DB0977FBDCB9B86DD8148BF1BCDC3C0303176CE39852A42B415935C20654'],
  ];

  it.each(vectors)('produit le jeton attendu pour %s', (timestamp, expected) => {
    expect(generateSecMsGecV2(timestamp)).toBe(expected);
  });

  it('arrondit au bloc de 5 minutes : deux instants du même bloc donnent le même jeton', () => {
    expect(generateSecMsGecV2(1761336000)).toBe(generateSecMsGecV2(1761336000 + 299));
  });

  it('change de bloc au-delà de 5 minutes', () => {
    expect(generateSecMsGecV2(1761336000)).not.toBe(generateSecMsGecV2(1761336000 + 300));
  });

  it('respecte le format `<16 hex>-<64 hex>` et annonce la version 2', () => {
    expect(generateSecMsGecV2(1761336000)).toMatch(/^[0-9A-F]{16}-[0-9A-F]{64}$/);
    expect(SEC_MS_GEC_VERSION).toBe('2-143.0.3650.75');
  });
});

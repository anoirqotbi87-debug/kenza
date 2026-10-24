/**
 * Génération du jeton `Sec-MS-GEC` v2 exigé par le service Edge TTS.
 *
 * Le service a durci son authentification : l'ancien jeton (simple SHA-256 du
 * nombre de ticks) est désormais rejeté — le WebSocket répond alors `HTTP 200`
 * au lieu de s'ouvrir, ce qui casse silencieusement toute la synthèse.
 *
 * Le jeton attendu est `<CS64>-<SHA256>` :
 *  - le SHA-256 est une variante dont l'état initial dérive des 7 premiers
 *    octets de l'entrée (et non de constantes fixes) ;
 *  - le CS64 est un digest propriétaire à base de rotations 16 bits.
 *
 * Ce fichier est une réimplémentation fidèle de `edge_tts/drm.py` (v7.x).
 * Toute divergence, même d'un bit, fait échouer la synthèse sans message clair.
 */

const U32_MASK = 0xffffffff;
const WIN_EPOCH = 11644473600;
const S_TO_NS_OVER_100 = 1e9 / 100;
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

const SHA256_INITIAL = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

const SHA256_STATE = [
  0xfd9fbea2, 0x91243ce7, 0xbe499094, 0xcd2e1e0a, 0x6c006f49, 0x04bd35ab, 0xfeb0a7e4, 0x03effbd2,
];

const SHA256_SCHEDULE = [
  0xeb24bf9e, 0x1558691f, 0xa0c09ee2, 0x0cfa32ba, 0xa622ee8c, 0xd1dd9491, 0xc0dd25a0, 0xf9e70ab6,
  0xf0c31573, 0x7058ce4e, 0x7188e606, 0x00e5ab33, 0xd258b060, 0x72766564,
];

const SHA256_ROUND_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const SHA256_ADJUSTMENT = 0xc9dc06a7;
const SHA256_SIGMA0_ADJUSTMENT = 0x059c0b80;
const SHA256_SIGMA1_ADJUSTMENT = 0x000b92c0;

const SHA256_BLOCK_CONSTANTS = [
  ...SHA256_ROUND_CONSTANTS.slice(0, 14),
  SHA256_ADJUSTMENT,
  ...SHA256_ROUND_CONSTANTS.slice(15),
];

const CS64_COEFFICIENTS: ReadonlyArray<readonly [number, number]> = [
  [0xe82e91b1, 0xb32700d0],
  [0x44de24c6, 0x88dff51d],
  [0x3beb65bc, 0x29514038],
  [0xc89c5933, 0xb328cbdf],
  [0x8d1ec211, 0xd405b4d5],
  [0x314ef5d5, 0x26e55f3c],
  [0xe92491b1, 0x607801c6],
  [0xf0a5b9d5, 0x82b2c1fb],
  [0x06064cf3, 0xfa51a3da],
  [0xda79fa60, 0x207cc464],
  [0xbed20560, 0x3c3c74f3],
  [0x89f9c9f8, 0xd2d14b61],
  [0x35fa38c6, 0xbb04a2c1],
  [0xcb49e3c6, 0xc5626167],
];
const CS64_FACTOR = 0x82893933;
const CS64_ADJUSTMENT0 = 0xf2f90b1a;
const CS64_ADJUSTMENT1 = 0x0b1a0000;

const add32 = (a: number, b: number): number => (a + b) >>> 0;
const mul32 = (a: number, b: number): number => Math.imul(a, b) >>> 0;

const rol16 = (value: number): number => (((value << 16) | (value >>> 16)) >>> 0);
const rotr = (value: number, n: number): number => (((value >>> n) | (value << (32 - n))) >>> 0);

const sigma0 = (value: number): number =>
  (((value >>> 7) ^ (value << 25) ^ (value >>> 18) ^ (value << 14) ^ (value >>> 3)) >>> 0);
const sigma1 = (value: number): number =>
  (((value >>> 17) ^ (value << 15) ^ (value >>> 19) ^ (value << 13) ^ (value >>> 10)) >>> 0);

function sha256Init(data: Uint8Array): number[] {
  const words: number[] = new Array(14).fill(0);
  words.push(((data[0] << 16) | (data[1] << 8) | data[2]) >>> 0);
  words.push((((data[3] << 24) | (data[4] << 16) | (data[5] << 8) | data[6])) >>> 0);

  for (let index = 16; index < 30; index += 1) {
    let value = SHA256_SCHEDULE[index - 16];
    if (index - 2 >= 14) {
      value +=
        index === 16
          ? sigma1(words[index - 2]) ^ SHA256_SIGMA1_ADJUSTMENT
          : sigma1(words[index - 2]);
    }
    if (index - 7 >= 14) value += words[index - 7];
    if (index - 15 >= 14) {
      value +=
        index === 29
          ? sigma0(words[index - 15]) ^ SHA256_SIGMA0_ADJUSTMENT
          : sigma0(words[index - 15]);
    }
    words.push(value >>> 0);
  }

  const finalValue =
    sigma1(words[28]) +
    words[23] +
    sigma0(words[15]) +
    words[14] +
    SHA256_ADJUSTMENT -
    SHA256_ROUND_CONSTANTS[14];
  words.push(finalValue >>> 0);

  expandSchedule(words, 31);
  const working = sha256Rounds(SHA256_STATE, words, 14);
  return working.map((word, i) => add32(SHA256_INITIAL[i], word));
}

function expandSchedule(words: number[], firstWord = 16): void {
  for (let index = firstWord; index < 64; index += 1) {
    const s1 = sigma1(words[index - 2]);
    const s0 = sigma0(words[index - 15]);
    words.push(
      add32(add32(s1, words[index - 7]), add32(s0, words[index - 16])),
    );
  }
}

function sha256Rounds(state: number[], words: number[], firstRound = 0): number[] {
  let [a, b, c, d, e, f, g, h] = state;
  const constants = firstRound === 14 ? SHA256_BLOCK_CONSTANTS : SHA256_ROUND_CONSTANTS;
  const aligned = Math.min(64, Math.floor((firstRound + 7) / 8) * 8);

  for (let index = firstRound; index < aligned; index += 1) {
    const t1 = add32(
      add32(add32(h, (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0), (g ^ (e & (f ^ g))) >>> 0),
      add32(constants[index], words[index]),
    );
    const t2 = add32(
      (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0,
      ((a & b) | (c & (a | b))) >>> 0,
    );
    const nextA = add32(t1, t2);
    const nextE = add32(d, t1);
    h = g;
    g = f;
    f = e;
    e = nextE;
    d = c;
    c = b;
    b = a;
    a = nextA;
  }

  for (let index = aligned; index < 64; index += 8) {
    let t1 = add32(
      add32(
        add32(h, (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0),
        (g ^ (e & (f ^ g))) >>> 0,
      ),
      add32(constants[index], words[index]),
    );
    d = add32(d, t1);
    h = add32(
      add32(t1, (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0),
      ((a & b) | (c & (a | b))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(g, (rotr(d, 6) ^ rotr(d, 11) ^ rotr(d, 25)) >>> 0),
        (f ^ (d & (e ^ f))) >>> 0,
      ),
      add32(constants[index + 1], words[index + 1]),
    );
    c = add32(c, t1);
    g = add32(
      add32(t1, (rotr(h, 2) ^ rotr(h, 13) ^ rotr(h, 22)) >>> 0),
      ((h & a) | (b & (h | a))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(f, (rotr(c, 6) ^ rotr(c, 11) ^ rotr(c, 25)) >>> 0),
        (e ^ (c & (d ^ e))) >>> 0,
      ),
      add32(constants[index + 2], words[index + 2]),
    );
    b = add32(b, t1);
    f = add32(
      add32(t1, (rotr(g, 2) ^ rotr(g, 13) ^ rotr(g, 22)) >>> 0),
      ((g & h) | (a & (g | h))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(e, (rotr(b, 6) ^ rotr(b, 11) ^ rotr(b, 25)) >>> 0),
        (d ^ (b & (c ^ d))) >>> 0,
      ),
      add32(constants[index + 3], words[index + 3]),
    );
    a = add32(a, t1);
    e = add32(
      add32(t1, (rotr(f, 2) ^ rotr(f, 13) ^ rotr(f, 22)) >>> 0),
      ((f & g) | (h & (f | g))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(d, (rotr(a, 6) ^ rotr(a, 11) ^ rotr(a, 25)) >>> 0),
        (c ^ (a & (b ^ c))) >>> 0,
      ),
      add32(constants[index + 4], words[index + 4]),
    );
    h = add32(h, t1);
    d = add32(
      add32(t1, (rotr(e, 2) ^ rotr(e, 13) ^ rotr(e, 22)) >>> 0),
      ((e & f) | (g & (e | f))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(c, (rotr(h, 6) ^ rotr(h, 11) ^ rotr(h, 25)) >>> 0),
        (b ^ (h & (a ^ b))) >>> 0,
      ),
      add32(constants[index + 5], words[index + 5]),
    );
    g = add32(g, t1);
    c = add32(
      add32(t1, (rotr(d, 2) ^ rotr(d, 13) ^ rotr(d, 22)) >>> 0),
      ((d & e) | (f & (d | e))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(b, (rotr(g, 6) ^ rotr(g, 11) ^ rotr(g, 25)) >>> 0),
        (a ^ (g & (h ^ a))) >>> 0,
      ),
      add32(constants[index + 6], words[index + 6]),
    );
    f = add32(f, t1);
    b = add32(
      add32(t1, (rotr(c, 2) ^ rotr(c, 13) ^ rotr(c, 22)) >>> 0),
      ((c & d) | (e & (c | d))) >>> 0,
    );

    t1 = add32(
      add32(
        add32(a, (rotr(f, 6) ^ rotr(f, 11) ^ rotr(f, 25)) >>> 0),
        (h ^ (f & (g ^ h))) >>> 0,
      ),
      add32(constants[index + 7], words[index + 7]),
    );
    e = add32(e, t1);
    a = add32(
      add32(t1, (rotr(b, 2) ^ rotr(b, 13) ^ rotr(b, 22)) >>> 0),
      ((b & c) | (d & (b | c))) >>> 0,
    );
  }

  return [a, b, c, d, e, f, g, h];
}

function sha256Digest(data: Uint8Array): Uint8Array {
  if (data.length < 7) throw new Error('Token salt must contain at least seven bytes');

  const length = 57 + data.length;
  const tail = data.subarray(7);
  const padLen = (((55 - length) % 64) + 64) % 64;
  const padded = new Uint8Array(tail.length + 1 + padLen + 8);
  padded.set(tail, 0);
  padded[tail.length] = 0x80;
  // Longueur en bits sur 64 bits big-endian (la cible ES2017 n'a pas BigInt).
  const view = new DataView(padded.buffer);
  const bitLength = length * 8;
  view.setUint32(padded.length - 8, Math.floor(bitLength / 0x100000000), false);
  view.setUint32(padded.length - 4, bitLength >>> 0, false);

  let state = sha256Init(data.subarray(0, 7));
  for (let offset = 0; offset < padded.length; offset += 64) {
    const blockView = new DataView(padded.buffer, padded.byteOffset + offset, 64);
    const words: number[] = [];
    for (let i = 0; i < 16; i += 1) words.push(blockView.getUint32(i * 4, false));
    expandSchedule(words);
    const working = sha256Rounds(state, words);
    state = state.map((word, i) => add32(word, working[i]));
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  state.forEach((word, i) => outView.setUint32(i * 4, word, false));
  return out;
}

function wordsLe4Even(data: Uint8Array): number[] {
  const padding = (4 - (data.length % 4)) % 4;
  const padded = new Uint8Array(data.length + padding);
  padded.set(data);
  const view = new DataView(padded.buffer);
  const words: number[] = [];
  for (let i = 0; i < padded.length / 4; i += 1) words.push(view.getUint32(i * 4, true));
  if (words.length % 2 === 1) words.push(0);
  return words;
}

function cs64Digest(data: Uint8Array, digest: Uint8Array): [number, number] {
  const digestView = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
  const keyA = (digestView.getUint32(0, true) | 1) >>> 0;
  const keyB = (digestView.getUint32(4, true) | 1) >>> 0;
  const factors = [mul32(keyA, CS64_FACTOR), mul32(keyB, CS64_FACTOR)];

  const terms: number[] = CS64_COEFFICIENTS.map(([coefficient], index) =>
    mul32(coefficient, factors[index % 2]),
  );
  const offsets: number[] = CS64_COEFFICIENTS.map(([, offset]) => offset);

  const source = new Uint8Array(data.length + 1);
  source.set(data, 1);
  wordsLe4Even(source).forEach((word, index) => {
    let term = mul32(word, index % 2 === 0 ? keyA : keyB);
    let offset = mul32(rol16(word), index % 2 === 0 ? 0xef0569fb : 0xc31713db);
    if (index === 0) {
      term += mul32(CS64_ADJUSTMENT0, factors[0]);
      offset += CS64_ADJUSTMENT1;
    }
    terms.push(term >>> 0);
    offsets.push(offset >>> 0);
  });

  let swapAcc = 0;
  let swapLast = 0;
  let state = 0;
  let acc = 0;

  for (let index = 0; index < terms.length; index += 2) {
    const x = terms[index];
    const y = terms[index + 1];

    let t = rol16(add32(offsets[index], x));
    let q = mul32(t, 0x76f50f34);
    swapAcc = add32(swapAcc, add32(mul32(rol16(q), 0xc3efea97), q));

    t = rol16(add32(offsets[index + 1], y));
    q = mul32(t, 0x1881ce3c);
    swapLast = add32(mul32(rol16(q), 0x35bd1ec9), q);
    swapAcc = add32(swapAcc, swapLast);

    state = add32(mul32(state, keyA), x);
    state = mul32(rol16(state), 0xcf98b111);
    state = mul32(rol16(state), 0x87085b9f);
    state = mul32(rol16(state), 0x12ceb96d);
    state = mul32(rol16(state), 0x257e1d83);
    acc = add32(acc, state);

    t = add32(mul32(state, keyB), y);
    t = mul32(rol16(t), 0xa27416f5);
    t = mul32(rol16(t), 0xd38396ff);
    state = mul32(rol16(mul32(rol16(t), 0x7c932b89)), 0xbfa49f69);
    acc = add32(acc, state);
  }

  return [(swapLast ^ state) >>> 0, (swapAcc ^ acc) >>> 0];
}

const HEX = '0123456789ABCDEF';

function toHexUpper(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) out += HEX[byte >> 4] + HEX[byte & 0x0f];
  return out;
}

function toLeHex(value: number): string {
  return toHexUpper(
    new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, value >>> 24]),
  );
}

/**
 * Calcule le jeton `Sec-MS-GEC` v2 pour l'instant donné (secondes Unix).
 * Sans argument, utilise l'horloge courante.
 */
export function generateSecMsGecV2(unixTimestamp?: number): string {
  let ticks = unixTimestamp ?? Date.now() / 1000;
  ticks += WIN_EPOCH;
  ticks -= ticks % 300;
  ticks *= S_TO_NS_OVER_100;

  const data = new TextEncoder().encode(`${Math.round(ticks)}${TRUSTED_CLIENT_TOKEN}`);
  const digest = sha256Digest(data);
  const [word0, word1] = cs64Digest(data, digest);
  return `${toLeHex(word0)}${toLeHex(word1)}-${toHexUpper(digest)}`;
}

export const SEC_MS_GEC_VERSION = '2-143.0.3650.75';
export { TRUSTED_CLIENT_TOKEN, U32_MASK };

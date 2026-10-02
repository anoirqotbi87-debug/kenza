import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import manifestRoute from './manifest';

/**
 * Deux manifestes coexistent volontairement :
 *  - `src/app/manifest.ts` est celui RÉELLEMENT SERVI (lié par `layout.tsx` via
 *    `manifest: "/manifest.webmanifest"`) ;
 *  - `public/manifest.json` est conservé parce que le `twa-manifest.json` de Bubblewrap
 *    pointe dessus (`webManifestUrl`).
 *
 * Ils avaient divergé (description et `dir` absents d'un côté, `purpose` différent de l'autre).
 * Un seul des deux étant servi, une divergence passe inaperçue : ce test l'interdit.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

type Icon = { src: string; sizes: string; type: string; purpose?: string };
type ManifestShape = {
  name?: string;
  short_name?: string;
  description?: string;
  start_url?: string;
  display?: string;
  orientation?: string;
  background_color?: string;
  theme_color?: string;
  dir?: string;
  icons?: Icon[];
};

const served = manifestRoute() as ManifestShape;
const bubblewrap = JSON.parse(
  readFileSync(resolve(ROOT, 'public/manifest.json'), 'utf-8')
) as ManifestShape;

const SHARED_FIELDS = [
  'name',
  'short_name',
  'description',
  'start_url',
  'display',
  'orientation',
  'background_color',
  'theme_color',
  'dir',
] as const;

describe('manifestes — cohérence entre les deux fichiers', () => {
  it.each(SHARED_FIELDS)('le champ %s est identique dans les deux manifestes', (field) => {
    expect(served[field]).toBe(bubblewrap[field]);
    expect(served[field], `${field} ne doit pas être vide`).toBeTruthy();
  });

  it('les deux manifestes exposent les mêmes icônes (hors `purpose`, divergence assumée)', () => {
    const strip = (icons: Icon[] | undefined) =>
      (icons ?? []).map((icon) => {
        const { purpose: _purpose, ...rest } = icon;
        return rest;
      });
    expect(strip(bubblewrap.icons)).toEqual(strip(served.icons));
  });

  /**
   * `purpose` est le SEUL champ qui diverge, et c'est volontaire :
   * le type `MetadataRoute.Manifest` de Next n'accepte qu'une valeur
   * (`'any' | 'maskable' | 'monochrome'`) alors que la spec W3C autorise la combinaison.
   * Le manifeste servi déclare donc `maskable`, et celui de Bubblewrap `any maskable`.
   * Aucun autre écart n'est toléré.
   */
  it('le manifeste servi déclare purpose=maskable (contrainte du type Next)', () => {
    for (const icon of served.icons ?? []) {
      expect(icon.purpose, `${icon.src} : le type Next n'accepte qu'une valeur`).toBe('maskable');
    }
  });

  it('le manifeste Bubblewrap déclare la combinaison W3C « any maskable »', () => {
    for (const icon of bubblewrap.icons ?? []) {
      expect(icon.purpose, `${icon.src} : purpose`).toContain('any');
      expect(icon.purpose, `${icon.src} : purpose`).toContain('maskable');
    }
  });

  it('les icônes couvrent 192 et 512 px en PNG', () => {
    const icons = served.icons ?? [];
    expect(icons.map((i) => i.sizes).sort()).toEqual(['192x192', '512x512']);
    for (const icon of icons) expect(icon.type, `${icon.src} : type`).toBe('image/png');
  });

  it('chaque icône référencée existe réellement dans public/', () => {
    for (const icon of served.icons ?? []) {
      expect(existsSync(resolve(ROOT, 'public', icon.src.replace(/^\//, ''))), icon.src).toBe(true);
    }
  });

  it('aucune icône dupliquée à la racine de public/ (un seul jeu, sous /icons/)', () => {
    // Le commit TWA avait ajouté `public/icon-*.png`, doublons stricts de `public/icons/icon-*.png`.
    for (const size of ['192x192', '512x512']) {
      expect(
        existsSync(resolve(ROOT, 'public', `icon-${size}.png`)),
        `public/icon-${size}.png : doublon à supprimer`
      ).toBe(false);
    }
  });

  it('le start_url de la TWA reste /fr', () => {
    expect(served.start_url).toBe('/fr');
    expect(bubblewrap.start_url).toBe('/fr');
  });
});

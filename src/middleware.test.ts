import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

/**
 * Le `start_url` de la TWA Android est `/fr`. Il était servi par une REDIRECTION 307 vers `/` :
 * ça fonctionnait, mais Chrome peut afficher sa barre d'adresse au lancement quand la navigation
 * initiale redirige, ce qui dégrade le rendu standalone. On sert désormais la racine via `rewrite`
 * (HTTP 200, même contenu) tout en posant le cookie de locale.
 *
 * Le middleware n'avait aucun test : ce fichier verrouille les deux propriétés qui comptent —
 * pas de redirection, et cookie de locale bien posé.
 */

function requestFor(pathname: string, cookie?: string): NextRequest {
  const req = new NextRequest(new URL(`https://kenza-dusky.vercel.app${pathname}`));
  if (cookie) req.cookies.set('kenza-lang', cookie);
  return req;
}

function setCookieOf(response: { headers: Headers }): string {
  return response.headers.get('set-cookie') ?? '';
}

describe('middleware — start_url /fr de la TWA', () => {
  it('sert /fr en 200 sans redirection (aucun Location)', () => {
    const response = middleware(requestFor('/fr'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('ne renvoie plus 307/302 sur /fr (régression du saut de barre d’adresse)', () => {
    const response = middleware(requestFor('/fr'));

    expect([301, 302, 307, 308]).not.toContain(response.status);
  });

  it('pose quand même le cookie de locale sur /fr', () => {
    const response = middleware(requestFor('/fr'));

    expect(setCookieOf(response)).toMatch(/kenza-lang=fr/);
    expect(setCookieOf(response)).toMatch(/Max-Age=31536000/);
  });
});

describe('middleware — autres routes', () => {
  it('ne redirige pas la racine et pose le cookie si absent', () => {
    const response = middleware(requestFor('/'));

    expect(response.status).toBe(200);
    expect(setCookieOf(response)).toMatch(/kenza-lang=fr/);
  });

  it('n’écrase pas une locale déjà choisie', () => {
    const response = middleware(requestFor('/', 'ar'));

    expect(setCookieOf(response)).not.toMatch(/kenza-lang=/);
  });
});

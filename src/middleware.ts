import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/fr') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    const response = NextResponse.redirect(url);
    response.cookies.set('kenza-lang', 'fr', { path: '/', maxAge: 31536000 });
    return response;
  }

  const response = NextResponse.next();
  if (!request.cookies.has('kenza-lang')) {
    response.cookies.set('kenza-lang', 'fr', { path: '/', maxAge: 31536000 });
  }
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)',
  ],
};

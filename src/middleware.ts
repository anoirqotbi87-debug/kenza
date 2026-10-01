import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const lang = request.cookies.get('kenza-lang')?.value || 'fr';
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

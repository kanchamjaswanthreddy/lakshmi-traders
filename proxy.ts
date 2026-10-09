import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const auth = req.cookies.get('auth');
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/login';
  const isAuthApi = pathname === '/api/auth';

  // Allow auth API and static assets through
  if (isAuthApi) return NextResponse.next();

  // Redirect unauthenticated users to login
  if (!auth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from login
  if (auth && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách routes công khai (không cần auth)
const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép truy cập public routes
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Cho phép static files và API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // TODO: Sprint 1 — Check Supabase auth session
  // const supabaseToken = request.cookies.get('sb-access-token')?.value;
  // if (!supabaseToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public files (themis_logo.png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};

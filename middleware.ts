import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-suzukiride-scm'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to auth, api routes, static assets, and public pages
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/' ||
    pathname.startsWith('/motorcycles') ||
    pathname.startsWith('/promotions') ||
    pathname.startsWith('/simulate-credit') ||
    pathname.startsWith('/test-ride') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check auth token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const { payload }: any = await jwtVerify(token, SECRET_KEY);

    // Role-based access control
    const isAdminRoute = pathname.startsWith('/portal');
    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url)); // unauthorized
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

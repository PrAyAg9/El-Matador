import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function to handle route protection
export function middleware(request: NextRequest) {
  // Always allow access for now
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assistant/:path*',
    '/investments/:path*',
    '/profile/:path*',
    '/login',
    '/auth/:path*'
  ],
} 
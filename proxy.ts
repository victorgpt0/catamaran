import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 1. Check if they are trying to access the Admin Panel
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Exception: Allow them to visit the Login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // 2. Check for the "Captain's Cookie"
    const adminSession = request.cookies.get('admin_session')

    // 3. If no cookie, kick them to Login
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Optimization: Only run this logic on /admin routes
export const config = {
  matcher: '/admin/:path*',
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Check for the token cookie
  const token = request.cookies.get('token')?.value

  // 2. Define which paths are protected
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/merchant')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/signin')

  // 3. Scenario: User is trying to access Dashboard but has no token
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // 4. Scenario: User is already logged in but tries to go to Login page
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/merchant', request.url))
  }

  return NextResponse.next()
}

// Configuration: Matcher allows you to filter Middleware to run on specific paths.
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value // Assuming you set this on login
  const { pathname } = request.nextUrl

  // --- 1. DEFINE PATH GROUPS ---
  
  // Admin Paths
  const isAdminAuthRoute = pathname.startsWith('/admin/signin') || pathname.startsWith('/admin/signup')
  const isAdminProtectedRoute = pathname.startsWith('/admin') && !isAdminAuthRoute

  // Merchant/General Paths
  const isGeneralAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup')
  const isMerchantProtectedRoute = pathname.startsWith('/merchant')

  // --- 2. SUPER ADMIN LOGIC ---

  // If trying to access Admin Dashboard
  if (isAdminProtectedRoute) {
    if (!token || role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/signin', request.url))
    }
  }

  // If logged-in Admin tries to access Admin Login
  if (isAdminAuthRoute && token && role === 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url)) // Or wherever your admin home is
  }

  // --- 3. MERCHANT / USER LOGIC ---

  // If trying to access Merchant Dashboard
  if (isMerchantProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    // Optional: If a Super Admin tries to go to Merchant, you might allow it 
    // or redirect them back to Admin. Usually, keep them separate:
    if (role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  // If logged-in Merchant/User tries to access standard Login
  if (isGeneralAuthRoute && token) {
    if (role === 'RESTAURANT_ADMIN') {
      return NextResponse.redirect(new URL('/merchant', request.url))
    }
    // If it's just a customer, maybe redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// MATCHERS: Ensure all relevant paths are covered
export const config = {
  matcher: [
    '/admin/:path*', 
    '/merchant/:path*', 
    '/signin', 
    '/signup',
  ],
}
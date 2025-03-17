import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from './lib/config.server'
import jwt from 'jsonwebtoken'
import { corsMiddleware } from './lib/api/cors'

// Define which routes require authentication
const protectedRoutes = ['/profile', '/movies/purchase', '/account']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value

    if (!token) {
      // Redirect to login if no token is found
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify the token
      jwt.verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Only apply CORS middleware to API routes
  if (pathname.startsWith('/api/')) {
    return corsMiddleware(request)
  }

  // Handle redirects after purchase
  if (pathname.startsWith('/movies/purchase/success')) {
    // Allow access to success page even if not authenticated
    // The page itself will handle authentication checks
    return NextResponse.next()
  }

  // Get response
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

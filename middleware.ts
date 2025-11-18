import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/campaigns',
  '/creatives',
  '/analytics',
  '/settings',
  '/teams',
]

// API routes that require authentication
const protectedApiRoutes = [
  '/api/campaigns',
  '/api/creatives',
  '/api/tracking-links',
  '/api/qr',
  '/api/alerts',
  '/api/ai',
  '/api/brand-assets',
  '/api/goals',
  '/api/scenarios',
  '/api/nlq',
  '/api/insights',
  '/api/anomalies',
  '/api/teams',
  '/api/user',
]

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/track', // Tracking pixel endpoint
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow NextAuth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )
  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute || isProtectedApiRoute) {
    // Get session token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, redirect to login (for pages) or return 401 (for API)
    if (!token) {
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized. Please login.' },
          { status: 401 }
        )
      }

      // Redirect to login with callback URL
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if email is verified for non-API routes
    if (isProtectedRoute && !token.emailVerified) {
      const verifyUrl = new URL('/verify-email', req.url)
      return NextResponse.redirect(verifyUrl)
    }

    // Add user info to headers for API routes
    if (isProtectedApiRoute) {
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set('x-user-id', token.id as string)
      requestHeaders.set('x-user-role', token.role as string)
      if (token.organizationId) {
        requestHeaders.set('x-organization-id', token.organizationId as string)
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

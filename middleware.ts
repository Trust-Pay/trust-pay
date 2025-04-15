import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/employer') || request.nextUrl.pathname.startsWith('/employee')

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/employer/:path*', '/employee/:path*'],
}
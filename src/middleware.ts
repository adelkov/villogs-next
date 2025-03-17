import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isForgotPasswordPage = request.nextUrl.pathname.startsWith('/forgot-password')
  const isResetPasswordPage = request.nextUrl.pathname.startsWith('/reset-password')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')

  // Allow auth routes to pass through
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Allow access to login, forgot-password, and reset-password pages
  if (isLoginPage || isForgotPasswordPage || isResetPasswordPage) {
    return NextResponse.next()
  }

  // Redirect to login if no session
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if already logged in and trying to access login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except:
    // - _next (next.js internals)
    // - favicon, etc
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
} 
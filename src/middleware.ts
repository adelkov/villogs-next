import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')

  // Allow auth routes to pass through
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect to login if no session (except for login page)
  if (!session && !isLoginPage) {
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
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  if (!session && !isLoginPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except:
    // - api/auth (next-auth paths)
    // - login page
    // - _next (next.js internals)
    // - favicon, etc
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
} 
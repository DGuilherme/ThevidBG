import { NextRequest, NextResponse } from 'next/server'
import { unsealData } from 'iron-session'
import type { SessionData } from '@/lib/session'
import { SESSION_COOKIE } from '@/lib/session'

const protectedPrefixes = ['/collection', '/matches', '/players', '/stats', '/wishlist']
const protectedExact = ['/']
const authRoutes = ['/login', '/register']

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p)) || protectedExact.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next()
  }

  let isAuthenticated = false
  const cookieValue = req.cookies.get(SESSION_COOKIE)?.value

  if (cookieValue) {
    try {
      const data = await unsealData<SessionData>(cookieValue, {
        password: process.env.SESSION_SECRET!,
      })
      isAuthenticated = !!data?.userId
    } catch {
      isAuthenticated = false
    }
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)'],
}

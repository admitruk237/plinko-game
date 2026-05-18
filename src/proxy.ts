import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/game', '/history', '/fair']
const publicRoutes = ['/login', '/register']

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const refreshToken = req.cookies.get('refreshToken')?.value

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isPublic && refreshToken) {
    return NextResponse.redirect(new URL('/game', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
}

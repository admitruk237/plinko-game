import { type NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/shared/config';

const protectedRoutes = [ROUTES.GAME, ROUTES.HISTORY, ROUTES.PROFILE, ROUTES.PROGRESS];
const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];

const middleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
  }

  if (isPublic && refreshToken) {
    return NextResponse.redirect(new URL(ROUTES.GAME, req.url));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
};

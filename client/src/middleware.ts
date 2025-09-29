import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const allowDrive = req.cookies.get('allowDrive')?.value;

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    '/login',
    '/signup',
    '/forgetPassword',
    '/resetPassword',

    '/admin/login',

    '/hotel/login',
    '/hotel/signup',
    '/hotel/forgetPassword',
    '/hotel/resetPassword',

    '/agency/login',
    '/agency/signup',
    '/agency/forgetPassword',
    '/agency/resetpassword',

    '/restaurant/login',
    '/restaurant/signup',
    '/restaurant/forgetpassword',
    '/restaurant/resetpassword',
  ];

  const roleRedirectMap: Record<string, string> = {
    '/admin': '/admin',
    '/hotel': '/hotel',
    '/agency': '/agency',
    '/restaurant': '/restaurant',
  };

  if (allowDrive === 'true' && pathname !== '/drive') {
    const res = NextResponse.redirect(new URL('/drive', req.url));
    res.cookies.delete('allowDrive');
    return res;
  }

  if (pathname === '/drive') {
    if (allowDrive === 'true') {
      const res = NextResponse.next();
      res.cookies.delete('allowDrive');
      return res;
    } else {
      const referer = req.headers.get('referer');
      return NextResponse.redirect(new URL(referer || '/', req.url));
    }
  }

  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  const matchedRole = Object.keys(roleRedirectMap)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));

  if (publicRoutes.includes(pathname) && token && matchedRole) {
    return NextResponse.redirect(new URL(roleRedirectMap[matchedRole], req.url));
  }

  if (
    token &&
    (pathname == '/login' ||
      pathname == '/signup' ||
      pathname == '/forgetPassword' ||
      pathname == '/resetPassword')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!publicRoutes.includes(pathname) && !token && matchedRole) {
    return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};

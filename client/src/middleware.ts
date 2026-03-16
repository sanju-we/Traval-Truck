import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const allowDrive = req.cookies.get('allowDrive')?.value;

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    '/login',
    '/signup',
    '/forgetPassword',
    '/resetPassword',
    '/',

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
    '/restaurant/forgetPassword',
    '/restaurant/resetPassword',
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
    if (token) {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

  const matchedRole = Object.keys(roleRedirectMap)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));

  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute && token && matchedRole) {
    return NextResponse.redirect(new URL(roleRedirectMap[matchedRole], req.url));
  }

  if (
    token &&
    (pathname == '/login' ||
      pathname == '/signup' ||
      pathname == '/forgetPassword' ||
      pathname == '/resetPassword')
  ) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (!isPublicRoute && !token) {
    if (matchedRole) {
      return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
    }
    // Only redirect if it's not the landing page (though we handled / above, just for safety)
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};

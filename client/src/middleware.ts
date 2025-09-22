import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value 

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgetPassword",
    "/resetPassword",
    "/verify-otp",

    "/admin/login",
    "/admin/signup",
    "/admin/forgetPassword",
    "/admin/resetPassword",
    "/admin/verify-otp",

    "/hotel/login",
    "/hotel/forgetPassword",
    "/hotel/resetPassword",

    "/agency/login",
    "/agency/signup",
    "/agency/forgetpassword",
    "/agency/resetpassword",
    "/agency/verify-otp",

    "/restaurant/login",
    "/restaurant/signup",
    "/restaurant/forgetpassword",
    "/restaurant/resetpassword",
    "/restaurant/verify-otp",
  ];

  const roleRedirectMap: Record<string, string> = {
    "/admin": "/admin",
    "/hotel": "/hotel",
    "/agency": "/agency",
    "/restaurant": "/restaurant",
  };

  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); 
  }

  const matchedRole = Object.keys(roleRedirectMap)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));

  if (publicRoutes.includes(pathname) && token && matchedRole) {
    return NextResponse.redirect(
      new URL(roleRedirectMap[matchedRole], req.url)
    );
  }

  if (!publicRoutes.includes(pathname) && !token && matchedRole) {
    return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\..*).*)",
  ],
};

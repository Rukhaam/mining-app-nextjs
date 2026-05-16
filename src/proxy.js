import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth-constants";
import { verifyJwt } from "./lib/jwt";

const protectedPrefixes = ["/admin/dashboard", "/admin/receipt"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = verifyJwt(token);
  const isAdmin = session?.userId && session.role === "admin";
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtectedRoute && !isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login" && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

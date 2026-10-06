import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type JwtPayload = {
  sub: string;
  email: string;
  role: "CANDIDATE" | "REVIEWER" | "ADMIN";
  exp: number;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/reviewer") ||
    pathname.startsWith("/candidate");

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (isProtectedRoute) {
    if (!accessToken) {
      if (refreshToken) return NextResponse.next();
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const payload = jwtDecode<JwtPayload>(accessToken);
      const role = payload.role;

      if (payload.exp * 1000 < Date.now()) {
        if (refreshToken) return NextResponse.next();
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        return response;
      }

      if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(
          new URL(`/${role.toLowerCase()}`, request.url),
        );
      }

      if (pathname.startsWith("/reviewer") && role !== "REVIEWER") {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(
          new URL(`/${role.toLowerCase()}`, request.url),
        );
      }

      if (pathname.startsWith("/candidate") && role !== "CANDIDATE") {
        return NextResponse.redirect(
          new URL(`/${role.toLowerCase()}`, request.url),
        );
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  if (isAuthRoute && accessToken) {
    try {
      const payload = jwtDecode<JwtPayload>(accessToken);
      if (payload.exp * 1000 > Date.now()) {
        const role = payload.role;
        return NextResponse.redirect(
          new URL(`/${role.toLowerCase()}`, request.url),
        );
      }
    } catch {}

    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";

const ADMIN_COOKIE = "kruiden_admin_token";

// Routes that require admin auth — everything under /admin except /admin (login) itself
// and API routes that are admin-only (upload, products PATCH, orders)
const PROTECTED_PREFIXES = ["/admin/dashboard", "/admin/orders", "/admin/product"];
const API_PROTECTED = ["/api/upload", "/api/products", "/api/orders"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    API_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    // Also protect /admin/orders/[id]/print etc — keep generic /admin but exclude login page itself
    (pathname.startsWith("/admin/") && pathname !== "/admin" && pathname !== "/admin/");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET missing in middleware");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    await jose.jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    // Invalid/expired token — clear cookie and redirect
    if (pathname.startsWith("/api/")) {
      const res = NextResponse.json({ error: "Session expired" }, { status: 401 });
      res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload/:path*", "/api/products/:path*", "/api/orders/:path*"],
};

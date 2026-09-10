import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signAdminToken, adminSessionCookie, clearAdminSessionCookie } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Server misconfigured: JWT_SECRET missing" }, { status: 500 });
  }

  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  // Try to find user in DB
  let user: { id: string; email: string; passwordHash: string; role: string } | null = null;
  let dbReachable = true;
  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch {
    dbReachable = false;
  }

  // Migration grace: if no user exists yet, auto-seed from env ADMIN_EMAIL/ADMIN_PASSWORD
  if (!user && dbReachable) {
    try {
      const count = await prisma.user.count();
      if (count === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const envEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
        const envPassword = process.env.ADMIN_PASSWORD;
        if (normalizedEmail === envEmail && password === envPassword) {
          const passwordHash = await hashPassword(envPassword);
          user = await prisma.user.create({
            data: { email: envEmail, passwordHash, name: "Botanist", role: "ADMIN" },
          });
        }
      }
    } catch {
      dbReachable = false;
    }
  }

  // Fallback for local dev without DB: verify directly against env (allows storefront to work before DB is provisioned)
  if (!user && !dbReachable && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const envEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (normalizedEmail === envEmail && password === envPassword) {
      // Issue JWT without DB user — validate via env; id is synthetic
      const token = await signAdminToken({ sub: "env-admin", email: envEmail, role: "ADMIN" });
      const cookie = adminSessionCookie(token);
      const res = NextResponse.json({ ok: true, email: envEmail, fallback: true });
      res.cookies.set(cookie.name, cookie.value, cookie.options);
      res.cookies.set("kruiden_admin_session", "", { path: "/", maxAge: 0 });
      return res;
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signAdminToken({ sub: user.id, email: user.email, role: user.role });
  const cookie = adminSessionCookie(token);

  const res = NextResponse.json({ ok: true, email: user.email });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  // Also clear legacy cookie if present
  res.cookies.set("kruiden_admin_session", "", { path: "/", maxAge: 0 });
  return res;
}

export async function DELETE() {
  const cookie = clearAdminSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  // Clear legacy too
  res.cookies.set("kruiden_admin_session", "", { path: "/", maxAge: 0 });
  return res;
}

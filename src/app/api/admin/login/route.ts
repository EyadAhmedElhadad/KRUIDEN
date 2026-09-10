import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, adminSessionCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin access isn't configured. Set ADMIN_PASSWORD." },
      { status: 500 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookie = adminSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const cookie = adminSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, "", { path: "/", maxAge: 0 });
  return res;
}

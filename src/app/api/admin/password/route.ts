import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, hashPassword, verifyPassword, signAdminToken, adminSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1),
});

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { currentPassword, newPassword, confirmPassword } = parsed.data;
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
  }
  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "New password must be different" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.sub } });
    // Fallback: if session is env-admin synthetic id, find by email
    const target = user ?? (await prisma.user.findUnique({ where: { email: session.email } }));
    if (!target) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const ok = await verifyPassword(currentPassword, target.passwordHash);
    if (!ok) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: target.id }, data: { passwordHash: newHash } });

    // Re-issue JWT so session stays valid (optional but nice)
    const token = await signAdminToken({ sub: target.id, email: target.email, role: target.role });
    const cookie = adminSessionCookie(token);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ email: session.email, role: session.role });
}

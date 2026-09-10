import * as jose from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "kruiden_admin_token";
const JWT_ALG = "HS256";
const JWT_EXPIRES = "8h";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type AdminJwtPayload = {
  sub: string; // user id
  email: string;
  role: string;
};

// Hash / verify password helpers
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Sign a JWT for admin — 8h
export async function signAdminToken(payload: AdminJwtPayload): Promise<string> {
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES)
    .sign(getJwtSecret());
}

// Verify JWT — returns payload or null (edge + node compatible)
export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecret());
    if (!payload.sub || !payload.email) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: String(payload.role ?? "ADMIN"),
    };
  } catch {
    return null;
  }
}

// For Server Components / Route Handlers — read cookie and verify
export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return !!session;
}

export function adminSessionCookie(token: string) {
  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

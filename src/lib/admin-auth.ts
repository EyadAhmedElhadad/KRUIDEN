import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "kruiden_admin_session";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export function adminSessionCookie() {
  const token = expectedToken();
  return { name: COOKIE_NAME, value: token ?? "" };
}

/** Server-side check for use in API routes / server components. */
export function isAdminAuthenticated() {
  const expected = expectedToken();
  if (!expected) return false;
  const cookieStore = cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  return session === expected;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

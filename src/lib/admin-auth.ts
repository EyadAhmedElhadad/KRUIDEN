// Deprecated wrapper — new auth lives in @/lib/auth (JWT + bcrypt, email+password)
// Kept for backwards-compat imports; prefer `import { isAdminAuthenticated } from '@/lib/auth'`
export { isAdminAuthenticated, getAdminSession, ADMIN_COOKIE_NAME } from "./auth";
export { verifyPassword as verifyAdminPassword } from "./auth";

// Legacy helper — now unused (kept to avoid breaking old imports during migration)
export function adminSessionCookie() {
  // New flow uses JWT from @/lib/auth `adminSessionCookie(token)`
  // This stub is for legacy callers that passed no token — they should migrate
  return { name: "kruiden_admin_token", value: "" };
}

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Server only. Password-protected case studies render their detail on the server
// only when this cookie is valid, so a locked visitor is never sent the detail.

export const ACCESS_COOKIE = "cs_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// CASE_STUDY_PASSWORD is the one to set. NEXT_PUBLIC_PASSWORD is still read as a
// fallback until the env var is renamed; no client code references it any more.
function password() {
  return process.env.CASE_STUDY_PASSWORD || process.env.NEXT_PUBLIC_PASSWORD || "";
}

function hash(value) {
  return createHash("sha256").update(`case-studies:${value}`).digest();
}

// The cookie holds a hash of the password, so it can't be set by hand without
// knowing the password, and changing the password locks everyone out again.
export function accessToken() {
  return hash(password()).toString("hex");
}

export function passwordMatches(input) {
  if (!password()) return false;
  return timingSafeEqual(hash(input), hash(password()));
}

export async function hasCaseStudyAccess() {
  if (!password()) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value === accessToken();
}

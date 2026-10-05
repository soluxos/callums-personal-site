"use server";

import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  accessToken,
  passwordMatches,
} from "@/lib/caseStudyAccess";

// Setting a cookie in a server action re-renders the current page, so a correct
// password shows the gated detail without a reload.
export async function unlockCaseStudies(_previous, formData) {
  const input = String(formData.get("password") ?? "");
  if (!passwordMatches(input)) return { error: true };

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  return { error: false };
}

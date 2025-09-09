import { type NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME, COOKIE_NAME } from "@/configs/cookies";

export function getCookieName(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  if (!origin || origin === process.env.NEXT_PUBLIC_APP_URL) {
    return ADMIN_COOKIE_NAME;
  }

  return COOKIE_NAME;
}

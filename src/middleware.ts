import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { NextURL } from "next/dist/server/web/next-url";

import IGNORED_AUTH_PATH from "./@core/constants/IGNORED_AUTH_PATH";
import { jwtSign, jwtVerify } from "./@core/jwt/jwt";

import { getCookieName } from "./utils/app";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const origin = req.headers.get("origin") || "";

  // Handle CORS preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    const res = NextResponse.json({}, { status: 200 });

    addCorsHeaders(res, origin);

    return res;
  }

  if (IGNORED_AUTH_PATH.some((path) => pathname.startsWith(path))) {
    const res = NextResponse.next();

    addCorsHeaders(res, origin);

    return res;
  }

  const cookieName = getCookieName(req);

  const nextSession = req.cookies.get(cookieName);

  if (!nextSession) {
    return resUnauthorized(url, pathname, origin);
  }

  try {
    const jwt = await jwtVerify(nextSession.value);

    const userId = jwt.userId;

    const response = NextResponse.next();

    response.headers.set("userId", String(userId));

    // In development, use secure: false; in production use secure: true
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(cookieName, await jwtSign({ userId }), {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: "lax"
    });
    addCorsHeaders(response, origin);

    return response;
  } catch (error) {
    return resUnauthorized(url, pathname, origin);
  }
}

// ✅ Add CORS headers to allow cross-origin credentials
function addCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
}

function resUnauthorized(url: NextURL, pathname: string, origin: string) {
  if (!pathname.includes("/api/")) {
    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  const res = NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

  addCorsHeaders(res, origin);

  return res;
}

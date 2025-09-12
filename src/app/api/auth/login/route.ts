import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { compare } from "bcrypt";

import { responseError, throwIfMissing, validateJsonBody } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";
import { ResponseError } from "@/types/errors";
import { jwtSign } from "@/@core/jwt/jwt";
import { getCookieName } from "@/utils/app";

export async function POST(req: NextRequest) {
  try {
    const json = await validateJsonBody(req);
    const { email, password } = json;

    throwIfMissing(email, "Email is required");
    throwIfMissing(password, "Password is required");

    const user = await database.user.findUnique({ where: { email: email } });

    if (!user) throw new ResponseError("Invalid email or password!", 401);

    const compared = await compare(password, user?.password ?? "");

    if (!compared) throw new ResponseError("Invalid email or password!", 401);

    const jwt = await jwtSign({ userId: user?.id });

    const response = NextResponse.json({
      message: "ok",
      data: {
        id: user?.id,
        email: user?.email,
        fullName: user?.fullName
      }
    });

    const cookieName = getCookieName(req);

    // In development, use secure: false; in production use secure: true
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(cookieName, jwt, {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: "lax"
    });

    return response;
  } catch (error: any) {
    return responseError(error);
  }
}

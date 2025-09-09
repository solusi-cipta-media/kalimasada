import "server-only";

import { type NextRequest } from "next/server";

import { getCookieName } from "@/utils/app";
import MyResponse from "@/@core/utils/MyResponse";
export const GET = async (req: NextRequest) => {
  const response = MyResponse.ok();
  const cookieName = getCookieName(req);

  response.cookies.delete(cookieName);

  return response;
};

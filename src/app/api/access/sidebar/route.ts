import type { NextRequest } from "next/server";

import database from "@/@libs/database";
import AccessRepository from "@/repositories/AccessRepository";
import MyResponse from "@/@core/utils/MyResponse";

export async function GET(req: NextRequest) {
  const repository = new AccessRepository(database);

  const userId = req.headers.get("userId");
  const data = await repository.getSidebarMenu(Number(userId));

  return MyResponse.json200({
    data
  });
}

import type { NextRequest } from "next/server";

import MyResponse from "@/@core/utils/MyResponse";
import database from "@/@libs/database";
import AccessRepository from "@/repositories/AccessRepository";
import { ConvertParam } from "@/@core/utils/serverHelpers";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const parentId = ConvertParam.toIntOrNull(searchParams.get("parentId"));
  const showOnSidebar = ConvertParam.toBooleanOrUndefined(searchParams.get("showOnSidebar"));

  const repository = new AccessRepository(database);
  const access = await repository.getAllMenuWithoutAccess({ parentId, showOnSidebar });

  return MyResponse.json200({ message: "ok", data: access });
}

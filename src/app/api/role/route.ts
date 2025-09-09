import type { NextRequest } from "next/server";

import { DatatableParams } from "@/@core/utils/serverHelpers";
import "server-only";
import database from "@/@libs/database";
import MyResponse from "@/@core/utils/MyResponse";

export async function GET(req: NextRequest) {
  const { limit, orderby, search, skip } = DatatableParams(req, [{ id: "desc" }]);

  const roles = await database.role.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ]
    },
    orderBy: orderby,
    skip,
    take: limit
  });

  return MyResponse.json200({ message: "ok", data: roles });
}

export async function POST(req: NextRequest) {
  const { name, description, byPassAllFeatures, permissionIds } = await req.json();
  const permissions = permissionIds?.map((permissionId: number) => ({ permissionId })) ?? [];

  await database.role.create({
    data: {
      name,
      description,
      byPassAllFeatures,
      RolePermission: { createMany: { data: permissions } }
    }
  });

  return MyResponse.ok();
}

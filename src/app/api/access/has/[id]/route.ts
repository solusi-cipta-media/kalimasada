import type { NextRequest } from "next/server";

import database from "@/@libs/database";
import MyResponse from "@/@core/utils/MyResponse";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await database.user.findUnique({
    where: {
      id: parseInt(req.headers.get("userId")!)
    },
    select: { role: true }
  });

  if (!user) {
    return MyResponse.json403();
  }

  if (user.role.byPassAllFeatures) {
    return MyResponse.ok();
  }

  const find = await database.rolePermission.findFirst({
    where: {
      roleId: user?.role.id,
      permissionId: parseInt(params.id)
    },
    take: 1
  });

  if (!find) {
    return MyResponse.json403();
  }

  return MyResponse.ok();
}

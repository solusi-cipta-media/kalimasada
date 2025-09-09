import type { NextRequest } from "next/server";

import MyResponse from "@/@core/utils/MyResponse";
import { AutocompleteParams } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";

export async function GET(req: NextRequest) {
  const { limit, search } = AutocompleteParams(req);

  const roles = await database.role.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive"
      }
    },
    take: limit
  });

  return MyResponse.json200({
    data: roles.map((e) => {
      return {
        label: e.name,
        ...e
      };
    })
  });
}

import "server-only";

import type { NextRequest } from "next/server";

import { hash } from "bcrypt";

import MyResponse from "@/@core/utils/MyResponse";
import database from "@/@libs/database";
import { DatatableParams } from "@/@core/utils/serverHelpers";

export async function POST(req: NextRequest) {
  const { fullName, password, email, roleId } = await req.json();
  const passwordHash = await hash(password, 10);

  const user = await database.user.findUnique({
    where: {
      email
    }
  });

  if (user) {
    return MyResponse.json400({
      message: "Email already used"
    });
  }

  await database.user.create({
    data: {
      fullName,
      email,
      password: passwordHash,
      roleId
    }
  });

  return MyResponse.ok();
}

export async function GET(req: NextRequest) {
  const { limit, skip, search, orderby } = DatatableParams(req, [{ id: "desc" }]);

  const users = await database.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true
    },
    skip,
    take: limit,
    where: {
      OR: [
        {
          fullName: {
            contains: search
          }
        },
        {
          email: {
            contains: search
          }
        }
      ]
    },
    orderBy: orderby
  });

  return MyResponse.json200({
    data: users
  });
}

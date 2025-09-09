import type { PrismaClient } from "@prisma/client";

import UserDummy from "./UserDummy";

export default async function dummySeeder(db: PrismaClient) {
  UserDummy(db);
}

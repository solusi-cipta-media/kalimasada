/* eslint-disable import/no-named-as-default-member */
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function UserDummy(db: PrismaClient) {
  if (process.env.APP_MODE === "production") return;
  const password = await bcrypt.hash("12345", 10);

  db.user.findMany();

  await db.role.upsert({
    where: {
      id: 1
    },
    update: {
      name: "Super Admin",
      description: "Super Administrator",
      byPassAllFeatures: true
    },
    create: {
      id: 1,
      name: "Super Admin",
      description: "Super Administrator",
      byPassAllFeatures: true
    }
  });

  await db.user.upsert({
    where: {
      id: 1
    },
    update: {
      email: "admin@email.com",
      fullName: "Sukijan Purnomo",
      password
    },
    create: {
      id: 1,
      email: "admin@email.com",
      fullName: "Sukijan Purnomo",
      password,
      roleId: 1
    }
  });
  await db.$queryRaw`SELECT setval(pg_get_serial_sequence('"Role"', 'id'), (SELECT MAX(id) FROM "Role"))`;
  await db.$queryRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX(id) FROM "User"))`;
}

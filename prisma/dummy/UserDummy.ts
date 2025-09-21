/* eslint-disable import/no-named-as-default-member */
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export default async function UserDummy(db: PrismaClient) {
  if (process.env.APP_MODE === "production") return;
  const password = await bcrypt.hash("12345", 10);

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

  // Get all permissions and create role permissions for Super Admin
  const permissions = await db.permission.findMany();

  // Clear existing role permissions for this role
  await db.rolePermission.deleteMany({
    where: {
      roleId: 1
    }
  });

  // Create role permissions for all permissions in a batch
  if (permissions.length > 0) {
    await db.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: 1,
        permissionId: permission.id
      })),
      skipDuplicates: true
    });
  }
}

import type { PrismaClient } from "@prisma/client";
import "server-only";

export default class RoleRepository {
  db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getById(id: number, showAccess: boolean = false) {
    const role = await this.db.role.findUnique({
      where: { id }
    });

    if (!role) {
      return null;
    }

    if (!showAccess) {
      return role;
    }

    const access = await this.db.rolePermission.findMany({
      select: {
        id: true,
        roleId: true,
        permissionId: true
      },
      where: { roleId: role.id }
    });

    return {
      ...role,
      access: access.map((item) => item.permissionId)
    };
  }
}

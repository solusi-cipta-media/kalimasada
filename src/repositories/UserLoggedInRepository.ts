import "server-only";
import { headers } from "next/headers";

import { throwIfMissing } from "@/@core/utils/serverHelpers";
import database from "@/@libs/database";

export default class UserLoggedInRepository {
  public id: number | null;
  constructor() {
    const h = headers();
    const userId = h.get("userId");

    this.id = userId ? Number(userId) : null;
  }

  async data() {
    throwIfMissing(this.id, "User id is required.");

    const user = await database.user.findUnique({
      where: {
        id: this.id!
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true
      }
    });

    throwIfMissing(user, "User not found!");

    return user!;
  }

  async hasAccess(permissionId: number) {
    const data = await this.data();

    if (data.role.byPassAllFeatures) return true;

    const hasAccess = await database.rolePermission.findFirst({
      where: {
        roleId: data.role.id,
        permissionId
      }
    });

    return hasAccess !== null;
  }
}

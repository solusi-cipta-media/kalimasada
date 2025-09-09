import type { PrismaClient } from "@prisma/client";

import type { FeatureAccess } from "@/types/featureAccess";

export default class AccessRepository {
  private db: PrismaClient;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getAllMenuWithoutAccess(props: { showOnSidebar?: boolean; parentId: number | null }) {
    const { showOnSidebar, parentId } = props;

    const menus = await this.db.permission.findMany({
      where: {
        parentId,
        showOnSidebar
      }
    });

    const feature: FeatureAccess[] = [];

    for (const menu of menus) {
      const feat: FeatureAccess = {
        id: menu.id,
        label: menu.label,
        description: menu.description,
        icon: menu.icon,
        isSection: menu.isSection,
        sequence: menu.sequence,
        parentId: menu.parentId,
        showOnSidebar: menu.showOnSidebar,
        children: await this.getAllMenuWithoutAccess({ showOnSidebar: props.showOnSidebar, parentId: menu.id }),
        hasAccess: false
      };

      feature.push(feat);
    }

    return feature;
  }

  async getSidebarMenu(userId: number) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        role: {
          select: { id: true, byPassAllFeatures: true, RolePermission: { select: { permissionId: true } } }
        }
      }
    });

    if (!user) {
      return [];
    }

    const {
      role: { RolePermission, byPassAllFeatures }
    } = user;

    const permissionIds = RolePermission.map((rolePermission) => rolePermission.permissionId);

    return await this.getAllMenuWithAccessIds({
      showOnSidebar: true,
      accessIds: permissionIds,
      bypass: byPassAllFeatures,
      parentId: null
    });
  }

  async getAllMenuWithAccessIds({
    showOnSidebar,
    accessIds,
    bypass,
    parentId
  }: {
    showOnSidebar?: boolean;
    accessIds: number[];
    bypass: boolean;
    parentId: number | null;
  }) {
    const menus = await this.db.permission.findMany({
      where: {
        parentId,
        showOnSidebar
      },
      orderBy: { sequence: "asc" }
    });

    const feature: FeatureAccess[] = [];

    for (const menu of menus) {
      const hasAccess = bypass || accessIds.includes(menu.id);

      if (hasAccess)
        feature.push({
          id: menu.id,
          label: menu.label,
          description: menu.description,
          icon: menu.icon,
          isSection: menu.isSection,
          sequence: menu.sequence,
          parentId: menu.parentId,
          showOnSidebar: menu.showOnSidebar,
          children: await this.getAllMenuWithAccessIds({ showOnSidebar, accessIds, bypass, parentId: menu.id }),
          hasAccess: hasAccess,
          href: menu.href
        });
    }

    return feature;
  }
}

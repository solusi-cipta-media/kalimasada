import type { PrismaClient } from "@prisma/client";

interface PermissionType {
  id: number;
  label: string;
  icon?: string;
  parentId?: number;
  isSection?: boolean;
  description?: string;
  sequence: number;
  showOnSidebar?: boolean;
  href?: string | null;
}

const permission: PermissionType[] = [
  {
    id: 1,
    label: "Home",
    isSection: false,
    icon: "tabler-smart-home",
    sequence: 1,
    description: "Home page or dashboard",
    showOnSidebar: true,
    href: "/home"
  },
  {
    id: 2,
    label: "Master",
    sequence: 2,
    isSection: true,
    description: "Master data",
    showOnSidebar: true
  },
  {
    id: 3,
    label: "User",
    sequence: 1,
    parentId: 2,
    description: "User management",
    icon: "tabler-user",
    showOnSidebar: true,
    href: "/user"
  },
  {
    id: 4,
    label: "Role",
    sequence: 2,
    parentId: 2,
    description: "Role / Privilege management",
    icon: "tabler-accessible",
    showOnSidebar: true,
    href: "/role"
  }
];

export default async function PermissionSeeder(db: PrismaClient) {
  for (const d of permission) {
    const { id, ...data } = d;

    await db.permission.upsert({
      where: { id },
      update: data,
      create: data
    });
  }
}

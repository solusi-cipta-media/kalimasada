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
    label: "Beranda",
    isSection: false,
    icon: "tabler-smart-home",
    sequence: 1,
    description: "Dashboard utama",
    showOnSidebar: true,
    href: "/home"
  },
  {
    id: 2,
    label: "Layanan",
    isSection: false,
    icon: "tabler-massage",
    sequence: 2,
    description: "Manajemen layanan spa & salon",
    showOnSidebar: true,
    href: "/services"
  },
  {
    id: 3,
    label: "Jadwal",
    isSection: false,
    icon: "tabler-calendar",
    sequence: 3,
    description: "Manajemen jadwal appointment",
    showOnSidebar: true,
    href: "/schedule"
  },
  {
    id: 4,
    label: "Gaji",
    isSection: false,
    icon: "tabler-cash",
    sequence: 4,
    description: "Manajemen gaji karyawan",
    showOnSidebar: true,
    href: "/payroll"
  },
  {
    id: 5,
    label: "Karyawan",
    isSection: false,
    icon: "tabler-users",
    sequence: 5,
    description: "Manajemen data karyawan",
    showOnSidebar: true,
    href: "/employees"
  },
  {
    id: 6,
    label: "Customer",
    isSection: false,
    icon: "tabler-user-heart",
    sequence: 6,
    description: "Manajemen data customer",
    showOnSidebar: true,
    href: "/customers"
  },
  {
    id: 7,
    label: "Master",
    sequence: 7,
    isSection: true,
    description: "Master data sistem",
    showOnSidebar: true
  },
  {
    id: 8,
    label: "User",
    sequence: 1,
    parentId: 7,
    description: "Manajemen user sistem",
    icon: "tabler-user",
    showOnSidebar: true,
    href: "/user"
  },
  {
    id: 9,
    label: "Role",
    sequence: 2,
    parentId: 7,
    description: "Manajemen role & privilege",
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

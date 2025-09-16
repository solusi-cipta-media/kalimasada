// Type Imports
import type { VerticalMenuDataType } from "@/types/menuTypes";

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: "Beranda",
    href: "/home",
    icon: "tabler-smart-home"
  },
  {
    label: "Layanan",
    href: "/services",
    icon: "tabler-spa"
  },
  {
    label: "Jadwal",
    href: "/schedule",
    icon: "tabler-calendar"
  },
  {
    label: "Customer",
    href: "/customer",
    icon: "tabler-users"
  },
  {
    label: "Karyawan",
    href: "/karyawan",
    icon: "tabler-user-check"
  },
  {
    label: "Gaji",
    href: "/payroll",
    icon: "tabler-cash"
  },
  {
    label: "Master",
    isSection: true,
    children: [
      {
        label: "User",
        href: "/user",
        icon: "tabler-user"
      },
      {
        label: "Role",
        href: "/role",
        icon: "tabler-accessible"
      }
    ]
  }
];

export default verticalMenuData;

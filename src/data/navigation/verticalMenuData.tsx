// Type Imports
import type { VerticalMenuDataType } from "@/types/menuTypes";

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: "Home",
    href: "/home",
    icon: "tabler-smart-home"
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

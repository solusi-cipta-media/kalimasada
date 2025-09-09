import "server-only";

import type { ReactNode } from "react";

import UserLoggedInRepository from "@/repositories/UserLoggedInRepository";
import ForbiddenPage from "@/app/403/page";

export default async function RoleLayout({ children }: { children: ReactNode }) {
  const user = new UserLoggedInRepository();
  const hasAccess = await user.hasAccess(4); //4 is permission id for master role

  if (!hasAccess) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}

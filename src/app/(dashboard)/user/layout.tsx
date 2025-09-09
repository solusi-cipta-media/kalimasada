import "server-only";

import type { ReactNode } from "react";

import UserLoggedInRepository from "@/repositories/UserLoggedInRepository";
import ForbiddenPage from "@/app/403/page";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const user = new UserLoggedInRepository();
  const hasAccess = await user.hasAccess(3); //3 is permission id for user

  if (!hasAccess) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}

import type { ReactNode } from "react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/constants/roles";

export default function ReviewerLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role={ROLES.REVIEWER}>{children}</DashboardShell>;
}

import type { ReactNode } from "react";

import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ROLES } from "@/constants/roles";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role={ROLES.CANDIDATE}>{children}</DashboardShell>;
}

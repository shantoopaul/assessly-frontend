import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { ROLES } from "@/constants/roles";

export default function ReviewerPage() {
  return <DashboardOverview role={ROLES.REVIEWER} />;
}

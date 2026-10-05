import DashboardOverview from "@/components/dashboard/dashboard-overview";
import { ROLES } from "@/constants/roles";

export default function CandidatePage() {
  return <DashboardOverview role={ROLES.CANDIDATE} />;
}

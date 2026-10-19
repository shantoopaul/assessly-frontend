"use client";
import { BookOpen, ClipboardCheck, DollarSign, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats } from "@/hooks/useAdminStats";
import { ErrorState } from "@/components/shared/error-state";
import AdminAnalyticsLoading from "./loading";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isLoading) {
    return <AdminAnalyticsLoading />;
  }

  if (isError || !data?.success) {
    return (
      <ErrorState
        message="Failed to load dashboard statistics. Please try again later."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data.data;
  const chartData = [
    { name: "Candidates", value: stats.users.candidates },
    { name: "Reviewers", value: stats.users.reviewers },
    { name: "Published Assessments", value: stats.assessments.published },
    { name: "Evaluated Attempts", value: stats.attempts.evaluated },
  ];

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Overview"
        description="Monitor user activity, assessments, and revenue at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users.total}
          hint={`${stats.users.candidates} Candidates, ${stats.users.reviewers} Reviewers`}
        />
        <StatCard
          icon={BookOpen}
          label="Published Assessments"
          value={stats.assessments.published}
          hint="Active on the platform"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Evaluated Attempts"
          value={stats.attempts.evaluated}
          hint={`Out of ${stats.attempts.total} total attempts`}
        />
        <StatCard
          icon={DollarSign}
          label="Gross Revenue"
          value={formatCurrency(stats.payments.grossAmountInMinorUnits)}
          hint={`${stats.payments.successfulCount} successful payments`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Activity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-muted"
                />
                <XAxis
                  dataKey="name"
                  stroke="oklch(0.542 0.034 322.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.542 0.034 322.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0)" }}
                  contentStyle={{
                    borderColor: "oklch(0.922 0.005 325.62)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="oklch(0.514 0.222 16.935)"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

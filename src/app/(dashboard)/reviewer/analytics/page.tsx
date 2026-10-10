"use client";

import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileEdit,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useManagedAssessments } from "@/hooks/useAssessments";
import { useMyReviews } from "@/hooks/useReviews";
import type { Assessment } from "@/types/assessment";
import type { MyReviewItem } from "@/types/review";

const CHART_BAR_FILL = "oklch(0.514 0.222 16.935)";
const CHART_AXIS_STROKE = "oklch(0.542 0.034 322.5)";
const CHART_GRID_STROKE = "oklch(0.922 0.005 325.62)";

type ChartDatum = { name: string; value: number };

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
};

function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className="text-muted-foreground" aria-hidden="true">
          {icon}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function DistributionChart({
  data,
  emptyMessage,
}: {
  data: ChartDatum[];
  emptyMessage: string;
}) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={CHART_GRID_STROKE}
          />
          <XAxis
            dataKey="name"
            stroke={CHART_AXIS_STROKE}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={CHART_AXIS_STROKE}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0)" }}
            contentStyle={{ borderColor: CHART_GRID_STROKE }}
          />
          <Bar dataKey="value" fill={CHART_BAR_FILL} barSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type OutcomeTone = "success" | "danger" | "primary";

type OutcomeBlockProps = {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  tone: OutcomeTone;
};

const TONE_STYLES: Record<OutcomeTone, string> = {
  success:
    "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400",
  danger: "border-destructive/30 bg-destructive/5 text-destructive",
  primary: "border-primary/30 bg-primary/5 text-primary",
};

function OutcomeBlock({
  icon,
  label,
  value,
  suffix = "",
  tone,
}: OutcomeBlockProps) {
  return (
    <div className={`flex items-center gap-4 border p-4 ${TONE_STYLES[tone]}`}>
      <span aria-hidden="true">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest">
          {label}
        </p>
        <p className="mt-1 text-xl font-bold">
          {value}
          {suffix}
        </p>
      </div>
    </div>
  );
}

type ReviewerStats = {
  totalAssessments: number;
  draft: number;
  published: number;
  archived: number;
  totalQuestions: number;
  totalReviews: number;
  underReview: number;
  evaluated: number;
  passed: number;
  failed: number;
  averageScore: number;
};

export default function ReviewerAnalyticsPage() {
  const assessmentsQuery = useManagedAssessments({ page: 1, limit: 100 });
  const reviewsQuery = useMyReviews({ page: 1, limit: 100 });

  const isLoading = assessmentsQuery.isLoading || reviewsQuery.isLoading;
  const isError = assessmentsQuery.isError || reviewsQuery.isError;

  const stats: ReviewerStats = useMemo(() => {
    const assessments: Assessment[] = assessmentsQuery.data?.data ?? [];
    const reviews: MyReviewItem[] = reviewsQuery.data?.data ?? [];

    const draft = assessments.filter((a) => a.status === "DRAFT").length;
    const published = assessments.filter(
      (a) => a.status === "PUBLISHED",
    ).length;
    const archived = assessments.filter((a) => a.status === "ARCHIVED").length;

    const totalQuestions = assessments.reduce(
      (sum, a) => sum + (a._count?.questions ?? 0),
      0,
    );

    const underReview = reviews.filter(
      (r) => r.status === "UNDER_REVIEW",
    ).length;
    const evaluated = reviews.filter((r) => r.status === "EVALUATED").length;

    const passed = reviews.filter((r) => r.passed === true).length;
    const failed = reviews.filter((r) => r.passed === false).length;

    const scored = reviews.filter((r) => r.finalScore !== null);
    const averageScore =
      scored.length > 0
        ? scored.reduce((sum, r) => sum + (r.finalScore ?? 0), 0) /
          scored.length
        : 0;

    return {
      totalAssessments: assessments.length,
      draft,
      published,
      archived,
      totalQuestions,
      totalReviews: reviews.length,
      underReview,
      evaluated,
      passed,
      failed,
      averageScore,
    };
  }, [assessmentsQuery.data, reviewsQuery.data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load analytics data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasData = stats.totalAssessments > 0 || stats.totalReviews > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reviewer Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your assessment authoring and review activity at a glance.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <TrendingUp
              className="mb-4 h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">No activity yet</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Create an assessment or claim a submission from the review queue
              to start seeing analytics here.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/reviewer/assessments/create">
                <Button variant="outline">Create assessment</Button>
              </Link>
              <Link href="/reviewer/reviews">
                <Button>Open review queue</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assessmentChart: ChartDatum[] = [
    { name: "Draft", value: stats.draft },
    { name: "Published", value: stats.published },
    { name: "Archived", value: stats.archived },
  ];

  const reviewChart: ChartDatum[] = [
    { name: "Under Review", value: stats.underReview },
    { name: "Evaluated", value: stats.evaluated },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Reviewer Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your assessment authoring and review activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Total Assessments"
          value={stats.totalAssessments.toString()}
          hint={`${stats.published} published · ${stats.draft} draft`}
        />
        <StatCard
          icon={<FileEdit className="h-4 w-4" />}
          label="Total Questions"
          value={stats.totalQuestions.toString()}
          hint="Across all assessments"
        />
        <StatCard
          icon={<ClipboardCheck className="h-4 w-4" />}
          label="Reviews Handled"
          value={stats.totalReviews.toString()}
          hint={`${stats.underReview} under review`}
        />
        <StatCard
          icon={<Star className="h-4 w-4" />}
          label="Average Score"
          value={
            stats.evaluated > 0 ? `${stats.averageScore.toFixed(1)}%` : "—"
          }
          hint={`${stats.evaluated} evaluated`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assessments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart
              data={assessmentChart}
              emptyMessage="No assessments yet"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart
              data={reviewChart}
              emptyMessage="No reviews yet"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.evaluated === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No evaluated attempts yet
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <OutcomeBlock
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Passed"
                value={stats.passed}
                tone="success"
              />
              <OutcomeBlock
                icon={<XCircle className="h-5 w-5" />}
                label="Failed"
                value={stats.failed}
                tone="danger"
              />
              <OutcomeBlock
                icon={<Star className="h-5 w-5" />}
                label="Avg Score"
                value={Number(stats.averageScore.toFixed(1))}
                suffix="%"
                tone="primary"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

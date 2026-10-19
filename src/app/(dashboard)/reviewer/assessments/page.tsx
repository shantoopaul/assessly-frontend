"use client";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AssessmentFilterForm } from "@/components/reviewer/assessment-filter-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  useDeleteAssessment,
  useManagedAssessments,
  usePublishAssessment,
} from "@/hooks/useAssessments";
import type { AssessmentListQuery, AssessmentStatus } from "@/types/assessment";
import ReviewerAssessmentsLoading from "./loading";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  DRAFT:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  PUBLISHED:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export default function ReviewerAssessmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirm = useConfirm();

  const statusParam = searchParams.get("status");
  const statusFilter: AssessmentStatus | undefined =
    statusParam === "DRAFT" ||
    statusParam === "PUBLISHED" ||
    statusParam === "ARCHIVED"
      ? statusParam
      : undefined;

  const query: AssessmentListQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || undefined,
    status: statusFilter,
  };

  const { data, isLoading, isError, refetch } = useManagedAssessments(query);
  const publishMutation = usePublishAssessment();
  const deleteMutation = useDeleteAssessment();

  const handlePublish = (id: string) => {
    publishMutation.mutate(id);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Soft delete this assessment?",
      description: "It will be archived and cannot be edited afterwards.",
      confirmLabel: "Delete",
      variant: "destructive",
    });
    if (!ok) return;
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <ReviewerAssessmentsLoading />;
  }

  if (isError || !data?.success) {
    return (
      <ErrorState
        message="Failed to load assessments. Please try again later."
        onRetry={() => refetch()}
      />
    );
  }

  const assessments = data.data;
  const meta = data.meta;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assessments"
        description="Create, publish, and manage your developer assessments."
        action={
          <Link href="/reviewer/assessments/create">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              Create Assessment
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <AssessmentFilterForm />
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No assessments found"
              description="You have not created any assessments yet, or none match your current filters."
              action={
                <Link href="/reviewer/assessments/create">
                  <Button variant="outline">
                    <Plus className="size-4" aria-hidden="true" />
                    Create your first assessment
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3 pl-2">Title</th>
                    <th className="pb-3">Difficulty</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Fee</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => {
                    const isPublishing =
                      publishMutation.isPending &&
                      publishMutation.variables === assessment.id;
                    const isDeleting =
                      deleteMutation.isPending &&
                      deleteMutation.variables === assessment.id;

                    return (
                      <tr
                        key={assessment.id}
                        className="border-b last:border-0"
                      >
                        <td className="py-3 pl-2">
                          <Link
                            href={`/reviewer/assessments/${assessment.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {assessment.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {assessment.slug}
                          </p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {assessment.difficulty}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {assessment.durationMinutes} min
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {assessment.feeCents > 0
                            ? `$${(assessment.feeCents / 100).toFixed(2)}`
                            : "Free"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[assessment.status]}`}
                          >
                            {assessment.status}
                          </span>
                        </td>
                        <td className="py-3 pr-2">
                          <div className="flex items-center justify-end gap-2">
                            {assessment.status === "DRAFT" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isPublishing || isDeleting}
                                onClick={() => handlePublish(assessment.id)}
                              >
                                {isPublishing ? "Publishing…" : "Publish"}
                              </Button>
                            )}
                            {assessment.status !== "ARCHIVED" && (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isPublishing || isDeleting}
                                onClick={() => handleDelete(assessment.id)}
                              >
                                {isDeleting ? "Deleting…" : "Delete"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                assessments
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => goToPage(meta.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => goToPage(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

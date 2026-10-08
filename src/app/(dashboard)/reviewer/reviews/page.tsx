"use client";

import { ClipboardCheck, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClaimAttempt, useReviewQueue } from "@/hooks/useReviews";
import type { ReviewListQuery } from "@/types/review";

export default function ReviewerQueuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query: ReviewListQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };

  const { data, isLoading, isError } = useReviewQueue(query);
  const claimMutation = useClaimAttempt();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load review queue. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const items = data.data;
  const meta = data.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Queue</h1>
        <p className="text-sm text-muted-foreground">
          Claim a submitted attempt to start grading its free-form answers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unclaimed submissions</CardTitle>
        </CardHeader>

        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardCheck
                className="mb-4 h-12 w-12 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Queue is empty</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                There are no submitted attempts waiting for review right now.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3 pl-2">Assessment</th>
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Attempt</th>
                    <th className="pb-3">Submitted</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isClaiming =
                      claimMutation.isPending &&
                      claimMutation.variables === item.id;

                    return (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-3 pl-2">
                          <p className="font-medium">{item.assessment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.assessment.difficulty}
                          </p>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {item.candidate.name}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          #{item.attemptNo}
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {item.submittedAt
                              ? new Date(item.submittedAt).toLocaleString()
                              : "—"}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-right">
                          <Button
                            size="sm"
                            disabled={isClaiming}
                            onClick={() =>
                              claimMutation.mutate(item.id, {
                                onSuccess: () =>
                                  router.push(`/reviewer/reviews/${item.id}`),
                              })
                            }
                          >
                            {isClaiming ? "Claiming…" : "Claim"}
                          </Button>
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
                attempts
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

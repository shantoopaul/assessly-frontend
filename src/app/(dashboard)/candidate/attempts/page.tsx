"use client";

import { ClipboardCheck, Clock, CreditCard, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AttemptFilterForm } from "@/components/candidate/attempt-filter-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAttempts } from "@/hooks/useAttempts";
import {
  ATTEMPT_STATUS_LABELS,
  ATTEMPT_STATUS_STYLES,
  isAttemptStatus,
} from "@/lib/attempts";
import type { AttemptListQuery } from "@/types/attempt";

export default function CandidateAttemptsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const statusFilter = isAttemptStatus(statusParam) ? statusParam : undefined;

  const query: AttemptListQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    status: statusFilter,
  };

  const { data, isLoading, isError } = useMyAttempts(query);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="h-24 w-full animate-pulse bg-muted" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse bg-muted" />
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
            Failed to load your attempts. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const attempts = data.data;
  const meta = data.meta;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Attempts</h1>
        <p className="text-sm text-muted-foreground">
          Track the status of every assessment you have enrolled in.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <AttemptFilterForm />
        </CardHeader>

        <CardContent>
          {attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ClipboardCheck
                className="mb-4 h-12 w-12 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">No attempts found</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                You have not enrolled in any assessments yet, or none match your
                current filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3 pl-2">Assessment</th>
                    <th className="pb-3">Attempt</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Enrolled</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b last:border-0">
                      <td className="py-3 pl-2">
                        <p className="font-medium">
                          {attempt.assessment.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.assessment.difficulty}
                        </p>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        #{attempt.attemptNo}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${ATTEMPT_STATUS_STYLES[attempt.status]}`}
                        >
                          {ATTEMPT_STATUS_LABELS[attempt.status]}
                        </span>
                      </td>
                      <td className="py-3">
                        {attempt.finalScore !== null ? (
                          <span className="flex items-center gap-1 font-medium">
                            <Trophy
                              className="h-3.5 w-3.5 text-primary"
                              aria-hidden="true"
                            />
                            {attempt.finalScore.toFixed(1)}%
                            {attempt.passed === false && (
                              <span className="ml-1 text-xs text-destructive">
                                (Failed)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right">
                        {attempt.status === "PENDING_PAYMENT" ? (
                          <Link
                            href={`/payment/checkout?attemptId=${attempt.id}`}
                          >
                            <Button size="sm">
                              <CreditCard className="mr-1 h-3.5 w-3.5" />
                              Pay Now
                            </Button>
                          </Link>
                        ) : attempt.status === "READY" ? (
                          <Link href={`/candidate/attempts/${attempt.id}`}>
                            <Button size="sm">Start</Button>
                          </Link>
                        ) : attempt.status === "IN_PROGRESS" ? (
                          <Link href={`/candidate/attempts/${attempt.id}`}>
                            <Button size="sm" variant="outline">
                              Continue
                            </Button>
                          </Link>
                        ) : attempt.status === "CANCELLED" ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : (
                          <Link href={`/candidate/attempts/${attempt.id}`}>
                            <Button size="sm" variant="outline">
                              View Result
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
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

"use client";

import { CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAttempts } from "@/hooks/useAttempts";
import {
  formatMoney,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
} from "@/lib/payments";
import type { AttemptListItem, AttemptListQuery } from "@/types/attempt";

export default function CandidatePaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query: AttemptListQuery = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };

  const { data, isLoading, isError } = useMyAttempts(query);

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
            Failed to load payment history. Please try again later.
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
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          Review all transactions tied to your assessment enrollments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>

        <CardContent>
          {attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt
                className="mb-4 h-12 w-12 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">No payments yet</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Enroll in a paid assessment to see your transaction history
                here. Free assessments do not generate a payment record.
              </p>
              <Link href="/candidate/assessments" className="mt-5">
                <Button variant="outline">
                  <CreditCard className="mr-1 h-4 w-4" aria-hidden="true" />
                  Browse Assessments
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3 pl-2">Assessment</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Attempt</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <PaymentRow key={attempt.id} attempt={attempt} />
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
                entries
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

function PaymentRow({ attempt }: { attempt: AttemptListItem }) {
  const payment = attempt.payment;
  const isPaidAttempt = payment !== null;

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pl-2">
        <p className="font-medium">{attempt.assessment.title}</p>
        <p className="text-xs text-muted-foreground">
          {attempt.assessment.difficulty}
        </p>
      </td>

      <td className="py-3 font-medium">
        {payment ? (
          formatMoney(payment.amountCents, payment.currency)
        ) : (
          <span className="text-xs font-normal text-muted-foreground">
            Free
          </span>
        )}
      </td>

      <td className="py-3">
        {payment ? (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${PAYMENT_STATUS_STYLES[payment.status]}`}
          >
            {PAYMENT_STATUS_LABELS[payment.status]}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>

      <td className="py-3 text-muted-foreground">#{attempt.attemptNo}</td>

      <td className="py-3 text-xs text-muted-foreground">
        {new Date(attempt.createdAt).toLocaleDateString()}
      </td>

      <td className="py-3 pr-2 text-right">
        {isPaidAttempt &&
        (payment.status === "PENDING" || payment.status === "FAILED") ? (
          <Link href={`/payment/checkout?attemptId=${attempt.id}`}>
            <Button size="sm">Retry Payment</Button>
          </Link>
        ) : (
          <Link href={`/candidate/attempts/${attempt.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
        )}
      </td>
    </tr>
  );
}
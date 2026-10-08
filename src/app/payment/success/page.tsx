"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ATTEMPTS_QUERY_KEY } from "@/hooks/useAttempts";
import { PAYMENTS_QUERY_KEY } from "@/hooks/usePayments";

const WEBHOOK_GRACE_MS = 1500;

function PaymentSuccessContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isSyncing, setIsSyncing] = useState(Boolean(sessionId));

  useEffect(() => {
    if (!sessionId) {
      setIsSyncing(false);
      return;
    }

    let cancelled = false;

    const sync = async () => {
      await new Promise((resolve) => setTimeout(resolve, WEBHOOK_GRACE_MS));
      if (cancelled) return;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ATTEMPTS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY }),
      ]);

      if (!cancelled) setIsSyncing(false);
    };

    void sync();

    return () => {
      cancelled = true;
    };
  }, [queryClient, sessionId]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your assessment enrollment is confirmed. You can now start your
            attempt from your dashboard.
          </p>
          {isSyncing && (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Finalizing your enrollment…
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/candidate">
            <Button disabled={isSyncing}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

function SuccessFallback() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Confirming your payment…
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

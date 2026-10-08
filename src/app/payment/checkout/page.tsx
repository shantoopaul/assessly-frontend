"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateCheckoutSession } from "@/hooks/usePayments";

function CheckoutFallback() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <CardTitle className="text-2xl">Preparing checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please wait while we prepare your secure payment session.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const initiatedRef = useRef(false);

  const checkoutMutation = useCreateCheckoutSession();
  const { mutate, data, isError, error, isPending, isSuccess } =
    checkoutMutation;

  useEffect(() => {
    if (!attemptId || initiatedRef.current) return;
    initiatedRef.current = true;
    mutate(attemptId);
  }, [attemptId, mutate]);

  useEffect(() => {
    if (isSuccess && data?.data.checkoutUrl) {
      window.location.href = data.data.checkoutUrl;
    }
  }, [isSuccess, data]);

  if (!attemptId) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Missing Attempt ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We couldn&apos;t find an attempt to pay for. Please start from
              your assessments page.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/candidate/assessments">
              <Button>Back to Assessments</Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Checkout Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error?.message ||
                "Something went wrong while preparing your payment."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-3">
            <Link href="/candidate/attempts">
              <Button variant="outline">Back to Attempts</Button>
            </Link>
            <Button
              onClick={() => {
                initiatedRef.current = false;
                mutate(attemptId);
              }}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isPending ? "Preparing checkout" : "Redirecting to Stripe"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please wait while we prepare your secure payment session. You will
            be redirected automatically.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your payment was not completed. Your assessment slot is still
            reserved. You can try again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Link href="/candidate/assessments">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessments
            </Button>
          </Link>
          <Link href="/candidate/attempts">
            <Button>View My Attempts</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

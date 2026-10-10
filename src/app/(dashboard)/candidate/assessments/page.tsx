"use client";
import { Clock, DollarSign, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssessments } from "@/hooks/useAssessments";
import { useEnrollAssessment } from "@/hooks/useAttempts";

export default function CandidateAssessmentsPage() {
  const { data, isLoading, isError } = useAssessments({ page: 1, limit: 10 });
  const enrollMutation = useEnrollAssessment();

  const enrollingId = enrollMutation.isPending
    ? enrollMutation.variables
    : null;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">
            Failed to load assessments. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const assessments = data.data;

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No assessments available</h3>
          <p className="text-sm text-muted-foreground">
            Check back later for new developer assessments.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Available Assessments
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse and enroll in assessments to demonstrate your skills.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 text-lg">
                  {assessment.title}
                </CardTitle>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {assessment.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {assessment.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {assessment.durationMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  {assessment.feeCents > 0
                    ? `$${(assessment.feeCents / 100).toFixed(2)}`
                    : "Free"}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => enrollMutation.mutate(assessment.id)}
                disabled={enrollingId === assessment.id}
              >
                {enrollingId === assessment.id ? "Enrolling..." : "Enroll Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

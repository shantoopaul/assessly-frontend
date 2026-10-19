"use client";
import { BookOpen, Clock, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssessments } from "@/hooks/useAssessments";
import { useEnrollAssessment } from "@/hooks/useAttempts";
import CandidateAssessmentsLoading from "./loading";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

export default function CandidateAssessmentsPage() {
  const { data, isLoading, isError, refetch } = useAssessments({
    page: 1,
    limit: 10,
  });
  const enrollMutation = useEnrollAssessment();

  const enrollingId = enrollMutation.isPending
    ? enrollMutation.variables
    : null;

  if (isLoading) {
    return <CandidateAssessmentsLoading />;
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

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={BookOpen}
            title="No assessments available"
            description="Check back later for new developer assessments."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Assessments"
        description="Browse and enroll in assessments to demonstrate your skills."
      />

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

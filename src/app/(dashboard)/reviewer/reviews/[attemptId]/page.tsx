"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvaluateAttempt, useReviewAttempt } from "@/hooks/useReviews";
import type { ReviewAttemptDetail } from "@/types/review";
import {
  evaluateFormSchema,
  type EvaluateFormValues,
} from "@/validation/reviews";

const textareaClasses =
  "flex min-h-24 w-full border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

const formatResponse = (response: unknown): string => {
  if (response === null || response === undefined) return "—";
  if (typeof response === "string") return response;
  return JSON.stringify(response, null, 2);
};

export default function ReviewAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;
  const router = useRouter();

  const { data, isLoading, isError } = useReviewAttempt(attemptId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-destructive">
            This attempt is not assigned to you, or it is not under review yet.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/reviewer/reviews")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to queue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <EvaluationView
      attempt={data.data}
      onBack={() => router.push("/reviewer/reviews")}
    />
  );
}

function EvaluationView({
  attempt,
  onBack,
}: {
  attempt: ReviewAttemptDetail;
  onBack: () => void;
}) {
  const evaluateMutation = useEvaluateAttempt();
  const isEvaluated = attempt.status === "EVALUATED" && attempt.review !== null;

  const defaultAnswers: EvaluateFormValues["answers"] = attempt.assessment.questions
    .filter((question) => question.type !== "MCQ")
    .flatMap((question) => question.answers)
    .map((answer) => ({
      answerId: answer.id,
      score: answer.reviewerScore ?? 0,
      feedback: answer.feedback ?? "",
    }));

  const form = useForm({
    defaultValues: {
      feedback: attempt.review?.feedback ?? "",
      answers: defaultAnswers,
    } satisfies EvaluateFormValues,
    validators: { onChange: evaluateFormSchema },
    onSubmit: async ({ value }) => {
      evaluateMutation.mutate({ attemptId: attempt.id, input: value });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to queue
          </Button>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {attempt.assessment.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {attempt.candidate.name} · {attempt.candidate.email}
          </p>
        </div>

        {isEvaluated && attempt.review && (
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
              attempt.review.decision === "PASS"
                ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {attempt.review.decision === "PASS" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {attempt.review.decision} · {attempt.review.totalScore.toFixed(1)}%
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Auto Score
            </p>
            <p className="mt-1 text-lg font-semibold">
              {attempt.autoScore !== null ? attempt.autoScore.toFixed(1) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Passing Score
            </p>
            <p className="mt-1 text-lg font-semibold">
              {attempt.assessment.passingScore}%
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Final Score
            </p>
            <p className="mt-1 text-lg font-semibold">
              {attempt.finalScore !== null
                ? `${attempt.finalScore.toFixed(1)}%`
                : "Pending review"}
            </p>
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
        noValidate
      >
        {attempt.assessment.questions.map((question, index) => {
          const answer = question.answers[0];
          const isMcq = question.type === "MCQ";
          const answerIndex = answer
            ? form.state.values.answers.findIndex(
                (entry) => entry.answerId === answer.id,
              )
            : -1;

          return (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">
                    Question {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
                      {question.type}
                    </span>
                    <span className="text-muted-foreground">
                      {question.points} pts
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {question.prompt}
                </p>

                {!answer ? (
                  <p className="text-xs italic text-muted-foreground">
                    No answer submitted for this question.
                  </p>
                ) : (
                  <>
                    <div className="border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Candidate response
                      </p>
                      <pre className="mt-2 whitespace-pre-wrap wrap-break-word font-mono text-sm">
                        {formatResponse(answer.response)}
                      </pre>
                    </div>

                    {isMcq ? (
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground">
                          Correct answer:{" "}
                          <span className="font-medium text-foreground">
                            {question.correctAnswer ?? "—"}
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            (answer.autoScore ?? 0) > 0
                              ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          Auto score: {answer.autoScore ?? 0} / {question.points}
                        </span>
                      </div>
                    ) : answerIndex >= 0 ? (
                      <div className="grid gap-4 border-t pt-4 sm:grid-cols-[160px_1fr]">
                        <form.Field name={`answers[${answerIndex}].score`}>
                          {(field) => (
                            <Field
                              label="Score"
                              htmlFor={field.name}
                              hint={`Max ${question.points}`}
                              error={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                                  ? field.state.meta.errors[0]?.message
                                  : undefined
                              }
                            >
                              <Input
                                id={field.name}
                                type="number"
                                min={0}
                                max={question.points}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                disabled={isEvaluated}
                                onChange={(event) =>
                                  field.handleChange(
                                    event.target.valueAsNumber || 0,
                                  )
                                }
                                aria-invalid={
                                  field.state.meta.isTouched &&
                                  !field.state.meta.isValid
                                }
                              />
                            </Field>
                          )}
                        </form.Field>

                        <form.Field name={`answers[${answerIndex}].feedback`}>
                          {(field) => (
                            <Field label="Feedback" htmlFor={field.name}>
                              <textarea
                                id={field.name}
                                className={textareaClasses}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                disabled={isEvaluated}
                                onChange={(event) =>
                                  field.handleChange(event.target.value)
                                }
                              />
                            </Field>
                          )}
                        </form.Field>
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle>Overall Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form.Field name="feedback">
              {(field) => (
                <Field
                  htmlFor={field.name}
                  error={
                    field.state.meta.isTouched && !field.state.meta.isValid
                      ? field.state.meta.errors[0]?.message
                      : undefined
                  }
                >
                  <textarea
                    id={field.name}
                    className={textareaClasses}
                    placeholder="Summarize strengths and areas for improvement…"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    disabled={isEvaluated}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {!isEvaluated && (
          <form.Subscribe
            selector={(state) =>
              [state.canSubmit, state.isSubmitting] as const
            }
          >
            {([canSubmit, isSubmitting]) => (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    evaluateMutation.isPending
                  }
                >
                  {evaluateMutation.isPending
                    ? "Submitting evaluation…"
                    : "Submit Evaluation"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        )}
      </form>
    </div>
  );
}
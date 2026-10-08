"use client";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountdown } from "@/hooks/useCountdown";
import {
  useAttempt,
  useSaveAnswer,
  useStartAttempt,
  useSubmitAttempt,
} from "@/hooks/useAttempts";
import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_STYLES } from "@/lib/attempts";
import type {
  AttemptDetailFull,
  AttemptQuestion,
  AttemptStatus,
} from "@/types/attempt";

const textareaClasses =
  "flex min-h-28 w-full border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

const formatResponse = (response: unknown): string => {
  if (response === null || response === undefined) return "";
  if (typeof response === "string") return response;
  return JSON.stringify(response, null, 2);
};

export default function CandidateAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;
  const router = useRouter();

  const { data, isLoading, isError } = useAttempt(attemptId);
  const startMutation = useStartAttempt();

  const detail = data?.data;
  const isFullDetail =
    detail && "questions" in detail.assessment && detail.startedAt !== null;
  const fullAttempt = isFullDetail ? (detail as AttemptDetailFull) : null;

  const countdown = useCountdown(fullAttempt?.expiresAt ?? null);
  const submitMutation = useSubmitAttempt();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-destructive">
            Failed to load attempt. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/candidate/attempts")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to attempts
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (detail.status === "READY") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/candidate/attempts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to attempts
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{detail.assessment.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              When you start this attempt the timer begins and you cannot pause
              it. Make sure you have a stable connection and enough time.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatBlock
                label="Duration"
                value={`${detail.assessment.durationMinutes ?? "—"} min`}
              />
              <StatBlock
                label="Passing Score"
                value={`${detail.assessment.passingScore}%`}
              />
              <StatBlock label="Attempt" value={`#${detail.attemptNo}`} />
            </div>

            <div className="flex justify-end">
              <Button
                size="lg"
                disabled={startMutation.isPending}
                onClick={() => startMutation.mutate(attemptId)}
              >
                {startMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting…
                  </>
                ) : (
                  "Start Attempt"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (detail.status === "IN_PROGRESS" && fullAttempt) {
    return (
      <AttemptRunner
        attempt={fullAttempt}
        countdown={countdown}
        onSubmit={() => {
          if (
            typeof window !== "undefined" &&
            window.confirm(
              "Submit your attempt? You cannot change answers after this.",
            )
          ) {
            submitMutation.mutate(attemptId);
          }
        }}
        isSubmitting={submitMutation.isPending}
      />
    );
  }

  return <AttemptResultView attempt={detail} />;
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border bg-muted/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: AttemptStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ATTEMPT_STATUS_STYLES[status]}`}
    >
      {ATTEMPT_STATUS_LABELS[status]}
    </span>
  );
}

function AttemptRunner({
  attempt,
  countdown,
  onSubmit,
  isSubmitting,
}: {
  attempt: AttemptDetailFull;
  countdown: ReturnType<typeof useCountdown>;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const questions = attempt.assessment.questions;

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-20 flex flex-col gap-3 border-b bg-background/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {attempt.assessment.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            Attempt #{attempt.attemptNo} · {questions.length} question
            {questions.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TimerBadge countdown={countdown} />
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || countdown.expired}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>

      {countdown.expired && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Time has expired. Submit your attempt now.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            attemptId={attempt.id}
            question={question}
            index={index}
            disabled={countdown.expired}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting || countdown.expired}
        >
          {isSubmitting ? "Submitting…" : "Submit Attempt"}
        </Button>
      </div>
    </div>
  );
}

function TimerBadge({
  countdown,
}: {
  countdown: ReturnType<typeof useCountdown>;
}) {
  const { hours, minutes, seconds, expired } = countdown;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const display =
    hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 font-mono text-sm font-semibold ${
        expired
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : hours === 0 && minutes < 5
            ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "border-border bg-muted/40"
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      {expired ? "TIME UP" : display}
    </span>
  );
}

function QuestionCard({
  attemptId,
  question,
  index,
  disabled,
}: {
  attemptId: string;
  question: AttemptQuestion;
  index: number;
  disabled: boolean;
}) {
  const existing = question.answers[0];
  const saveAnswer = useSaveAnswer();
  const [localValue, setLocalValue] = useState<string>(() =>
    formatResponse(existing?.response ?? ""),
  );
  const [isDirty, setIsDirty] = useState(false);

  const isSaving =
    saveAnswer.isPending && saveAnswer.variables?.questionId === question.id;

  const handleSave = () => {
    if (!isDirty) return;
    saveAnswer.mutate(
      { attemptId, questionId: question.id, response: localValue },
      { onSuccess: () => setIsDirty(false) },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Question {index + 1}</CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
              {question.type}
            </span>
            <span className="text-muted-foreground">{question.points} pts</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap text-sm leading-6">
          {question.prompt}
        </p>

        {question.type === "MCQ" && question.options ? (
          <McqInput
            options={question.options}
            value={localValue}
            disabled={disabled}
            onChange={(next) => {
              setLocalValue(next);
              setIsDirty(true);
            }}
          />
        ) : (
          <Field htmlFor={`q-${question.id}`}>
            <textarea
              id={`q-${question.id}`}
              className={textareaClasses}
              value={localValue}
              disabled={disabled}
              placeholder={
                question.type === "CODE"
                  ? "Write your code here…"
                  : "Write your answer here…"
              }
              onChange={(e) => {
                setLocalValue(e.target.value);
                setIsDirty(true);
              }}
              onBlur={handleSave}
            />
          </Field>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {existing ? "Saved" : "Not saved yet"}
          </span>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={!isDirty || isSaving || disabled}
          >
            {isSaving ? "Saving…" : "Save Answer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function McqInput({
  options,
  value,
  disabled,
  onChange,
}: {
  options: string[];
  value: string;
  disabled: boolean;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Select one option</legend>
      {options.map((option) => {
        const checked = value === option;
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 border p-3 text-sm transition-colors ${
              checked
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/40"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              type="radio"
              name="mcq"
              value={option}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option)}
              className="h-4 w-4"
            />
            <span className="whitespace-pre-wrap">{option}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function AttemptResultView({
  attempt,
}: {
  attempt:
    | Exclude<AttemptDetailFull, { status: "IN_PROGRESS" }>
    | {
        status: AttemptStatus;
        id: string;
        attemptNo: number;
        autoScore: number | null;
        finalScore: number | null;
        passed: boolean | null;
        submittedAt: string | null;
        evaluatedAt: string | null;
        assessment: { id: string; title: string; passingScore: number };
        review: {
          feedback: string;
          decision: "PASS" | "FAIL";
          totalScore: number;
          createdAt: string;
        } | null;
      };
}) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/candidate/attempts")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to attempts
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{attempt.assessment.title}</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Attempt #{attempt.attemptNo}
              </p>
            </div>
            <StatusPill status={attempt.status} />
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-3">
          <StatBlock
            label="Auto Score"
            value={
              attempt.autoScore !== null ? attempt.autoScore.toFixed(1) : "—"
            }
          />
          <StatBlock
            label="Final Score"
            value={
              attempt.finalScore !== null
                ? `${attempt.finalScore.toFixed(1)}%`
                : "Pending review"
            }
          />
          <StatBlock
            label="Passing Score"
            value={`${attempt.assessment.passingScore}%`}
          />
        </CardContent>
      </Card>

      {attempt.review && (
        <Card
          className={
            attempt.review.decision === "PASS"
              ? "border-green-500/30 bg-green-500/5"
              : "border-destructive/30 bg-destructive/5"
          }
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {attempt.review.decision === "PASS" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <CardTitle className="text-base">
                {attempt.review.decision === "PASS" ? "Passed" : "Not Passed"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6">
              {attempt.review.feedback}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

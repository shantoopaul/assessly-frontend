"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock,
  Coins,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddQuestion,
  useDeleteAssessment,
  useDeleteQuestion,
  useManagedAssessment,
  usePublishAssessment,
  useUpdateQuestion,
} from "@/hooks/useAssessments";
import type {
  AssessmentStatus,
  Question,
  QuestionType,
} from "@/types/assessment";
import { questionSchema } from "@/validation/assessments";

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  DRAFT:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  PUBLISHED:
    "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const selectClasses =
  "flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const textareaClasses =
  "flex min-h-24 w-full border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

type QuestionFormValues = {
  prompt: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  points: number;
};

const emptyQuestion: QuestionFormValues = {
  prompt: "",
  type: "MCQ",
  options: ["", ""],
  correctAnswer: "",
  points: 10,
};

const toFormValues = (q: Question): QuestionFormValues => ({
  prompt: q.prompt,
  type: q.type,
  options: q.options ?? ["", ""],
  correctAnswer: q.correctAnswer ?? "",
  points: q.points,
});

export default function ManagedAssessmentPage() {
  const params = useParams<{ id: string }>();
  const assessmentId = params.id;
  const router = useRouter();

  const { data, isLoading, isError } = useManagedAssessment(assessmentId);

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const publishMutation = usePublishAssessment();
  const deleteAssessmentMutation = useDeleteAssessment();
  const deleteQuestionMutation = useDeleteQuestion();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
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
            This assessment could not be loaded. It may have been deleted or you
            may not have permission to manage it.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/reviewer/assessments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to assessments
          </Button>
        </CardContent>
      </Card>
    );
  }

  const assessment = data.data;
  const isArchived = assessment.status === "ARCHIVED";
  const hasAttempts = assessment._count.attempts > 0;
  const isLocked = isArchived || hasAttempts;
  const totalPoints = assessment.questions.reduce((s, q) => s + q.points, 0);
  const nextOrder =
    assessment.questions.length > 0
      ? Math.max(...assessment.questions.map((q) => q.order)) + 1
      : 1;

  const closeEditor = () => {
    setEditingQuestion(null);
    setIsAdding(false);
  };

  const handlePublish = () => {
    if (assessment.questions.length === 0) {
      toast.error("Add at least one question before publishing");
      return;
    }
    publishMutation.mutate(assessmentId);
  };

  const handleDeleteAssessment = () => {
    if (typeof window === "undefined") return;
    if (
      !window.confirm(
        "Soft delete this assessment? It will be archived and cannot be edited afterwards.",
      )
    ) {
      return;
    }
    deleteAssessmentMutation.mutate(assessmentId, {
      onSuccess: () => router.push("/reviewer/assessments"),
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Delete this question? This cannot be undone.")) {
      return;
    }
    deleteQuestionMutation.mutate({ assessmentId, questionId });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/reviewer/assessments")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to assessments
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {assessment.title}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[assessment.status]}`}
            >
              {assessment.status}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {assessment.slug}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {assessment.status === "DRAFT" && (
            <Button
              onClick={handlePublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish"
              )}
            </Button>
          )}
          {assessment.status !== "ARCHIVED" && (
            <Button
              variant="destructive"
              onClick={handleDeleteAssessment}
              disabled={deleteAssessmentMutation.isPending}
            >
              {deleteAssessmentMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          )}
        </div>
      </div>

      {/* Info grid */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock
            icon={<ClipboardList className="size-4" />}
            label="Difficulty"
            value={assessment.difficulty}
          />
          <StatBlock
            icon={<Clock className="size-4" />}
            label="Duration"
            value={`${assessment.durationMinutes} min`}
          />
          <StatBlock
            icon={<CheckCircle2 className="size-4" />}
            label="Passing score"
            value={`${assessment.passingScore}%`}
          />
          <StatBlock
            icon={<Coins className="size-4" />}
            label="Fee"
            value={
              assessment.feeCents > 0
                ? `$${(assessment.feeCents / 100).toFixed(2)}`
                : "Free"
            }
          />
        </CardContent>
        <CardContent className="border-t pt-4 text-sm text-muted-foreground">
          {assessment.description}
        </CardContent>
      </Card>

      {/* Locked notice */}
      {isLocked && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-amber-700 dark:text-amber-400">
            {isArchived
              ? "This assessment is archived. Content is read-only."
              : "This assessment already has candidate attempts. Content is locked — you cannot add, edit, or delete questions."}
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              Questions ({assessment.questions.length}) · {totalPoints} pts
            </CardTitle>
            {!isLocked && !isAdding && !editingQuestion && (
              <Button
                size="sm"
                onClick={() => {
                  setIsAdding(true);
                  setEditingQuestion(null);
                }}
              >
                <Plus className="size-4" />
                Add question
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {assessment.questions.length === 0 && !isAdding && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No questions yet. Add your first question to get started.
            </p>
          )}

          {assessment.questions.map((question) => {
            if (editingQuestion?.id === question.id) {
              return (
                <QuestionEditor
                  key={question.id}
                  mode="edit"
                  assessmentId={assessmentId}
                  questionId={question.id}
                  defaultValues={toFormValues(question)}
                  onDone={closeEditor}
                  onCancel={closeEditor}
                />
              );
            }

            return (
              <QuestionRow
                key={question.id}
                question={question}
                canEdit={!isLocked}
                onEdit={() => {
                  setEditingQuestion(question);
                  setIsAdding(false);
                }}
                onDelete={() => handleDeleteQuestion(question.id)}
                isDeleting={
                  deleteQuestionMutation.isPending &&
                  deleteQuestionMutation.variables?.questionId === question.id
                }
              />
            );
          })}

          {isAdding && (
            <QuestionEditor
              mode="create"
              assessmentId={assessmentId}
              defaultValues={{ ...emptyQuestion }}
              nextOrder={nextOrder}
              onDone={closeEditor}
              onCancel={closeEditor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border bg-muted/30 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="[&_svg]:size-3.5">{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function QuestionRow({
  question,
  canEdit,
  onEdit,
  onDelete,
  isDeleting,
}: {
  question: Question;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">
            #{question.order}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 font-medium text-foreground">
            {question.type}
          </span>
          <span className="text-muted-foreground">{question.points} pts</span>
        </div>

        {canEdit && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit3 className="size-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="size-3.5" />
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        )}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
        {question.prompt}
      </p>

      {question.type === "MCQ" && question.options && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {question.options.map((option) => {
            const isCorrect = option === question.correctAnswer;
            return (
              <li
                key={option}
                className={`flex items-center gap-2 border px-3 py-1.5 ${
                  isCorrect
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-border"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCorrect ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                />
                <span>{option}</span>
                {isCorrect && (
                  <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400">
                    Correct
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function QuestionEditor({
  mode,
  assessmentId,
  questionId,
  defaultValues,
  nextOrder,
  onDone,
  onCancel,
}: {
  mode: "create" | "edit";
  assessmentId: string;
  questionId?: string;
  defaultValues: QuestionFormValues;
  nextOrder?: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const addMutation = useAddQuestion();
  const updateMutation = useUpdateQuestion();

  const isPending = addMutation.isPending || updateMutation.isPending;

  const form = useForm({
    defaultValues,
    validators: { onChange: questionSchema },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await addMutation.mutateAsync({
            assessmentId,
            data: {
              prompt: value.prompt,
              type: value.type,
              options: value.type === "MCQ" ? value.options : undefined,
              correctAnswer:
                value.type === "MCQ" ? value.correctAnswer : undefined,
              points: value.points,
              order: nextOrder ?? 1,
            },
          });
          toast.success("Question added");
        } else if (questionId) {
          await updateMutation.mutateAsync({
            assessmentId,
            questionId,
            data: {
              prompt: value.prompt,
              type: value.type,
              options: value.type === "MCQ" ? value.options : null,
              correctAnswer: value.type === "MCQ" ? value.correctAnswer : null,
              points: value.points,
            },
          });
          toast.success("Question updated");
        }
        onDone();
      } catch {
        // errors already surfaced via toasts in the hooks
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 border border-primary/40 bg-primary/5 p-4"
      noValidate
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {mode === "create" ? "New question" : "Edit question"}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X className="size-4" />
        </Button>
      </div>

      <form.Field name="prompt">
        {(field) => (
          <Field
            label="Prompt"
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
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="type">
          {(field) => (
            <Field label="Type" htmlFor={field.name}>
              <select
                id={field.name}
                className={selectClasses}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as QuestionType)
                }
              >
                <option value="MCQ">MCQ</option>
                <option value="TEXT">TEXT</option>
                <option value="CODE">CODE</option>
              </select>
            </Field>
          )}
        </form.Field>

        <form.Field name="points">
          {(field) => (
            <Field
              label="Points"
              htmlFor={field.name}
              error={
                field.state.meta.isTouched && !field.state.meta.isValid
                  ? field.state.meta.errors[0]?.message
                  : undefined
              }
            >
              <Input
                id={field.name}
                type="number"
                min={1}
                max={100}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.valueAsNumber || 0)
                }
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(s) => s.values.type}>
        {(type) =>
          type === "MCQ" ? (
            <div className="space-y-3 border-t pt-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Options
              </p>

              <form.Field name="options" mode="array">
                {(optField) => (
                  <div className="space-y-2">
                    {optField.state.value.map((_, idx) => (
                      <div key={idx} className="flex gap-2">
                        <form.Field name={`options[${idx}]`}>
                          {(sub) => (
                            <Input
                              placeholder={`Option ${idx + 1}`}
                              value={sub.state.value}
                              onBlur={sub.handleBlur}
                              onChange={(e) => sub.handleChange(e.target.value)}
                            />
                          )}
                        </form.Field>
                        {optField.state.value.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => optField.removeValue(idx)}
                            aria-label={`Remove option ${idx + 1}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => optField.pushValue("")}
                    >
                      <Plus className="mr-1 size-4" /> Add option
                    </Button>
                  </div>
                )}
              </form.Field>

              <form.Field name="correctAnswer">
                {(field) => (
                  <Field
                    label="Correct answer"
                    htmlFor={field.name}
                    hint="Must match one of the options exactly"
                    error={
                      field.state.meta.isTouched && !field.state.meta.isValid
                        ? field.state.meta.errors[0]?.message
                        : undefined
                    }
                  >
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>
            </div>
          ) : null
        }
      </form.Subscribe>

      <div className="flex justify-end gap-2 border-t pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || isPending}
            >
              {isSubmitting || isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Add question"
              ) : (
                "Save changes"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

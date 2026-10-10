"use client";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  useCreateAssessment,
  useAddQuestion,
  usePublishAssessment,
} from "@/hooks/useAssessments";
import {
  CreateAssessmentWizardValues,
  createAssessmentWizardSchema,
} from "@/validation/assessments";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const createMutation = useCreateAssessment();
  const addQuestionMutation = useAddQuestion();
  const publishMutation = usePublishAssessment();

  const form = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      difficulty: "MID",
      durationMinutes: 60,
      passingScore: 70,
      feeCents: 0,
      currency: "usd",
      questions: [
        {
          prompt: "",
          type: "MCQ",
          options: ["", ""],
          correctAnswer: "",
          points: 10,
        },
      ],
    } satisfies CreateAssessmentWizardValues,
    validators: { onChange: createAssessmentWizardSchema },
    onSubmit: async ({ value }) => {
      try {
        const { questions, ...assessmentData } = value;
        const createRes = await createMutation.mutateAsync(assessmentData);
        const assessmentId = createRes.data.id;

        for (let i = 0; i < questions.length; i++) {
          await addQuestionMutation.mutateAsync({
            assessmentId,
            data: { ...questions[i], order: i + 1 },
          });
        }

        await publishMutation.mutateAsync(assessmentId);
        toast.success("Assessment created and published!");
        router.push("/reviewer/assessments");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create assessment",
        );
      }
    },
  });

  const isSubmitting =
    createMutation.isPending ||
    addQuestionMutation.isPending ||
    publishMutation.isPending;
  const selectClasses =
    "flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";
  const textareaClasses =
    "flex min-h-24 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Assessment</h1>
        <p className="text-sm text-muted-foreground">
          Step {step} of 2: {step === 1 ? "Details" : "Questions"}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
        noValidate
      >
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="title">
                  {(field) => (
                    <Field
                      label="Title"
                      htmlFor={field.name}
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
                <form.Field name="slug">
                  {(field) => (
                    <Field
                      label="Slug"
                      htmlFor={field.name}
                      error={
                        field.state.meta.isTouched && !field.state.meta.isValid
                          ? field.state.meta.errors[0]?.message
                          : undefined
                      }
                    >
                      <Input
                        id={field.name}
                        placeholder="my-assessment"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <form.Field name="description">
                {(field) => (
                  <Field
                    label="Description"
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

              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="difficulty">
                  {(field) => (
                    <Field label="Difficulty" htmlFor={field.name}>
                      <select
                        id={field.name}
                        className={selectClasses}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value as "JUNIOR" | "MID" | "SENIOR",
                          )
                        }
                      >
                        <option value="JUNIOR">Junior</option>
                        <option value="MID">Mid</option>
                        <option value="SENIOR">Senior</option>
                      </select>
                    </Field>
                  )}
                </form.Field>
                <form.Field name="durationMinutes">
                  {(field) => (
                    <Field label="Duration (mins)" htmlFor={field.name}>
                      <Input
                        type="number"
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="passingScore">
                  {(field) => (
                    <Field label="Passing Score (%)" htmlFor={field.name}>
                      <Input
                        type="number"
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="feeCents">
                  {(field) => (
                    <Field
                      label="Fee (in cents)"
                      htmlFor={field.name}
                      hint="0 for free assessment"
                    >
                      <Input
                        type="number"
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="currency">
                  {(field) => (
                    <Field label="Currency" htmlFor={field.name}>
                      <Input
                        id={field.name}
                        maxLength={3}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={() => setStep(2)}>
                Next: Questions <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <form.Field name="questions" mode="array">
            {(field) => (
              <div className="space-y-4">
                {field.state.value.map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">
                        Question {i + 1}
                      </CardTitle>
                      {field.state.value.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => field.removeValue(i)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form.Field name={`questions[${i}].prompt`}>
                        {(subField) => (
                          <Field
                            label="Prompt"
                            htmlFor={subField.name}
                            error={
                              subField.state.meta.isTouched &&
                              !subField.state.meta.isValid
                                ? subField.state.meta.errors[0]?.message
                                : undefined
                            }
                          >
                            <textarea
                              id={subField.name}
                              className={textareaClasses}
                              value={subField.state.value}
                              onBlur={subField.handleBlur}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                            />
                          </Field>
                        )}
                      </form.Field>

                      <div className="grid grid-cols-2 gap-4">
                        <form.Field name={`questions[${i}].type`}>
                          {(subField) => (
                            <Field label="Type" htmlFor={subField.name}>
                              <select
                                id={subField.name}
                                className={selectClasses}
                                value={subField.state.value}
                                onBlur={subField.handleBlur}
                                onChange={(e) =>
                                  subField.handleChange(
                                    e.target.value as "MCQ" | "TEXT" | "CODE",
                                  )
                                }
                              >
                                <option value="MCQ">MCQ</option>
                                <option value="TEXT">TEXT</option>
                                <option value="CODE">CODE</option>
                              </select>
                            </Field>
                          )}
                        </form.Field>
                        <form.Field name={`questions[${i}].points`}>
                          {(subField) => (
                            <Field label="Points" htmlFor={subField.name}>
                              <Input
                                type="number"
                                id={subField.name}
                                value={subField.state.value}
                                onBlur={subField.handleBlur}
                                onChange={(e) =>
                                  subField.handleChange(e.target.valueAsNumber)
                                }
                              />
                            </Field>
                          )}
                        </form.Field>
                      </div>

                      {field.state.value[i].type === "MCQ" && (
                        <div className="space-y-3 border-t pt-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Options
                          </p>
                          <form.Field
                            name={`questions[${i}].options`}
                            mode="array"
                          >
                            {(optField) => (
                              <div className="space-y-2">
                                {optField.state.value?.map((_, optIdx) => (
                                  <div key={optIdx} className="flex gap-2">
                                    <form.Field
                                      name={`questions[${i}].options[${optIdx}]`}
                                    >
                                      {(optSubField) => (
                                        <Input
                                          placeholder={`Option ${optIdx + 1}`}
                                          value={optSubField.state.value}
                                          onBlur={optSubField.handleBlur}
                                          onChange={(e) =>
                                            optSubField.handleChange(
                                              e.target.value,
                                            )
                                          }
                                        />
                                      )}
                                    </form.Field>
                                    {optField.state.value &&
                                      optField.state.value.length > 2 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon-sm"
                                          onClick={() =>
                                            optField.removeValue(optIdx)
                                          }
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
                                  <Plus className="size-4 mr-1" /> Add Option
                                </Button>
                              </div>
                            )}
                          </form.Field>

                          <form.Field name={`questions[${i}].correctAnswer`}>
                            {(subField) => (
                              <Field
                                label="Correct Answer"
                                htmlFor={subField.name}
                                error={
                                  subField.state.meta.isTouched &&
                                  !subField.state.meta.isValid
                                    ? subField.state.meta.errors[0]?.message
                                    : undefined
                                }
                              >
                                <Input
                                  id={subField.name}
                                  placeholder="Must match one of the options exactly"
                                  value={subField.state.value ?? ""}
                                  onBlur={subField.handleBlur}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                              </Field>
                            )}
                          </form.Field>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {field.state.meta.errors.length > 0 &&
                  field.state.meta.isTouched && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    field.pushValue({
                      prompt: "",
                      type: "MCQ",
                      options: ["", ""],
                      correctAnswer: "",
                      points: 10,
                    })
                  }
                >
                  <Plus className="size-4 mr-1" /> Add Question
                </Button>
              </div>
            )}
          </form.Field>
        )}

        {step === 2 && (
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Create & Publish"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        )}
      </form>
    </div>
  );
}

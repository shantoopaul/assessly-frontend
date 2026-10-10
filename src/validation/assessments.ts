import { z } from "zod";

export const assessmentDetailsSchema = z.object({
  title: z.string().trim().min(3, "Min 3 characters").max(150, "Max 150 characters"),
  slug: z
    .string()
    .trim()
    .min(3, "Min 3 characters")
    .max(100, "Max 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be lowercase kebab-case"),
  description: z.string().trim().min(20, "Min 20 characters").max(5000, "Max 5000 characters"),
  difficulty: z.enum(["JUNIOR", "MID", "SENIOR"]),
  durationMinutes: z.number().int().min(5, "Min 5 mins").max(480, "Max 480 mins"),
  passingScore: z.number().min(0, "Min 0%").max(100, "Max 100%"),
  feeCents: z.number().int().min(0, "Min 0").max(10000000),
  currency: z.string().trim().length(3).transform((v) => v.toLowerCase()),
});

export const questionSchema = z
  .object({
    prompt: z.string().trim().min(3, "Min 3 characters").max(10000),
    type: z.enum(["MCQ", "TEXT", "CODE"]),
    options: z.array(z.string()).max(10, "Max 10 options"),
    correctAnswer: z.string(),
    points: z.number().int().min(1, "Min 1 point").max(100, "Max 100 points"),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "MCQ") return;

    if (data.options.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "MCQ requires at least 2 options",
      });
    }

    if (data.options.some((opt) => opt.trim().length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Options cannot be empty",
      });
    }

    if (!data.correctAnswer) {
      ctx.addIssue({
        code: "custom",
        path: ["correctAnswer"],
        message: "MCQ requires a correct answer",
      });
    } else if (!data.options.includes(data.correctAnswer)) {
      ctx.addIssue({
        code: "custom",
        path: ["correctAnswer"],
        message: "Correct answer must match one of the options",
      });
    }
  });

export const createAssessmentWizardSchema = z.object({
  ...assessmentDetailsSchema.shape,
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export type CreateAssessmentWizardValues = z.infer<
  typeof createAssessmentWizardSchema
>;
export type QuestionValues = z.infer<typeof questionSchema>;
import { z } from "zod";

export const evaluateAnswerSchema = z.object({
  answerId: z.uuid(),
  score: z
    .number()
    .min(0, "Score cannot be negative")
    .max(100, "Score is too large"),
  feedback: z.string().trim().max(2000, "Feedback is too long"),
});

export const evaluateFormSchema = z.object({
  feedback: z
    .string()
    .trim()
    .min(3, "Feedback must be at least 3 characters")
    .max(5000, "Feedback must be at most 5000 characters"),
  answers: z.array(evaluateAnswerSchema),
});

export type EvaluateFormValues = z.infer<typeof evaluateFormSchema>;

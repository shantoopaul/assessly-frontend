"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.email("Enter a valid email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000),
});

type ContactValues = z.infer<typeof contactSchema>;

const textareaClasses =
  "flex min-h-32 w-full border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20";

export function ContactForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    } satisfies ContactValues,
    validators: { onChange: contactSchema },
    onSubmit: async ({ value }) => {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

      if (!accessKey) {
        toast.error("Contact form is not configured. Please try again later.");
        console.error("NEXT_PUBLIC_WEB3FORMS_KEY is not set.");
        return;
      }

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,
            ...value,
          }),
        });

        const result: { success: boolean; message: string } =
          await response.json();

        if (result.success) {
          toast.success("Message sent! We'll get back to you soon.");
          form.reset();
        } else {
          toast.error(
            result.message || "Failed to send message. Please try again.",
          );
        }
      } catch (error) {
        console.error("Contact form submission error:", error);
        toast.error(
          "Something went wrong. Please check your connection and try again.",
        );
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
      className="space-y-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <Field
              label="Full name"
              htmlFor={field.name}
              error={
                field.state.meta.isTouched && !field.state.meta.isValid
                  ? field.state.meta.errors[0]?.message
                  : undefined
              }
            >
              <Input
                id={field.name}
                name={field.name}
                autoComplete="name"
                placeholder="Jane Developer"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              />
            </Field>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <Field
              label="Email"
              htmlFor={field.name}
              error={
                field.state.meta.isTouched && !field.state.meta.isValid
                  ? field.state.meta.errors[0]?.message
                  : undefined
              }
            >
              <Input
                id={field.name}
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              />
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field name="subject">
        {(field) => (
          <Field
            label="Subject"
            htmlFor={field.name}
            error={
              field.state.meta.isTouched && !field.state.meta.isValid
                ? field.state.meta.errors[0]?.message
                : undefined
            }
          >
            <Input
              id={field.name}
              name={field.name}
              placeholder="How can we help?"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={
                field.state.meta.isTouched && !field.state.meta.isValid
              }
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <Field
            label="Message"
            htmlFor={field.name}
            error={
              field.state.meta.isTouched && !field.state.meta.isValid
                ? field.state.meta.errors[0]?.message
                : undefined
            }
          >
            <textarea
              id={field.name}
              name={field.name}
              className={textareaClasses}
              placeholder="Tell us a bit about what you need…"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={
                field.state.meta.isTouched && !field.state.meta.isValid
              }
            />
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            className="w-full sm:w-auto"
          >
            <Send aria-hidden="true" />
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

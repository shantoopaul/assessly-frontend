"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const auditFilterSchema = z.object({
  action: z.string().trim().max(100).optional(),
  entityType: z.string().trim().max(100).optional(),
});

type AuditFilterValues = z.infer<typeof auditFilterSchema>;

export function AuditFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultValues: AuditFilterValues = {
    action: searchParams.get("action") ?? undefined,
    entityType: searchParams.get("entityType") ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: auditFilterSchema },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.action) params.set("action", value.action);
      if (value.entityType) params.set("entityType", value.entityType);
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-wrap items-end gap-4"
      noValidate
    >
      <form.Field name="action">
        {(field) => (
          <Field
            label="Action"
            htmlFor={field.name}
            className="min-w-50 flex-1"
          >
            <Input
              id={field.name}
              placeholder="e.g. ATTEMPT_START"
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="entityType">
        {(field) => (
          <Field
            label="Entity"
            htmlFor={field.name}
            className="min-w-50 flex-1"
          >
            <Input
              id={field.name}
              placeholder="e.g. Attempt, Assessment"
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <Button type="submit" size="sm">
        Apply Filters
      </Button>
    </form>
  );
}

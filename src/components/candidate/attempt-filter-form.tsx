"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  ATTEMPT_STATUS_LABELS,
  ATTEMPT_STATUS_ORDER,
  isAttemptStatus,
} from "@/lib/attempts";

const filterSchema = z.object({
  status: z.enum(ATTEMPT_STATUS_ORDER).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

const selectClasses =
  "flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

export function AttemptFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const defaultValues: FilterValues = {
    status: isAttemptStatus(statusParam) ? statusParam : undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: filterSchema },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.status) params.set("status", value.status);
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
      <form.Field name="status">
        {(field) => (
          <Field label="Status" htmlFor={field.name} className="w-52">
            <select
              id={field.name}
              className={selectClasses}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const next = e.target.value;
                field.handleChange(isAttemptStatus(next) ? next : undefined);
              }}
            >
              <option value="">All Statuses</option>
              {ATTEMPT_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {ATTEMPT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </Field>
        )}
      </form.Field>

      <Button type="submit" size="sm">
        Apply Filters
      </Button>
    </form>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

const selectClasses =
  "flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none";

export function AssessmentFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");

  const defaultValues: FilterValues = {
    search: searchParams.get("search") ?? undefined,
    status:
      statusParam === "DRAFT" ||
      statusParam === "PUBLISHED" ||
      statusParam === "ARCHIVED"
        ? statusParam
        : undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onChange: filterSchema },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.search) params.set("search", value.search);
      if (value.status) params.set("status", value.status);
      params.set("page", "1");

      const qs = params.toString();
      router.push(qs ? `?${qs}` : "?");
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
      <form.Field name="search">
        {(field) => (
          <Field
            label="Search"
            htmlFor={field.name}
            className="min-w-50 flex-1"
          >
            <Input
              id={field.name}
              placeholder="Title or slug..."
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="status">
        {(field) => (
          <Field label="Status" htmlFor={field.name} className="w-44">
            <select
              id={field.name}
              className={selectClasses}
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const next = e.target.value;
                field.handleChange(
                  next === "DRAFT" ||
                    next === "PUBLISHED" ||
                    next === "ARCHIVED"
                    ? next
                    : undefined,
                );
              }}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
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

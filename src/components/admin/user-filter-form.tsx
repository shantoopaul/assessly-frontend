"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/constants/roles";
import { userFilterSchema, type UserFilterValues } from "@/validation/users";

export function UserFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm({
    defaultValues: {
      search: searchParams.get("search") ?? undefined,
      role: (searchParams.get("role") as UserFilterValues["role"]) ?? undefined,
      status:
        (searchParams.get("status") as UserFilterValues["status"]) ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    } satisfies UserFilterValues,
    validators: {
      // @ts-expect-error
      onChange: userFilterSchema,
    },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.search) params.set("search", value.search);
      if (value.role) params.set("role", value.role);
      if (value.status) params.set("status", value.status);

      params.set("page", "1");
      params.set("limit", value.limit.toString());
      params.set("sortOrder", value.sortOrder);

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
      <form.Field name="search">
        {(field) => (
          <Field
            label="Search"
            htmlFor={field.name}
            className="flex-1 min-w-50"
          >
            <Input
              id={field.name}
              placeholder="Name or email..."
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="role">
        {(field) => (
          <Field label="Role" htmlFor={field.name} className="w-40">
            <select
              id={field.name}
              className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    ? (e.target.value as UserFilterValues["role"])
                    : undefined,
                )
              }
            >
              <option value="">All Roles</option>
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </Field>
        )}
      </form.Field>

      <form.Field name="status">
        {(field) => (
          <Field label="Status" htmlFor={field.name} className="w-40">
            <select
              id={field.name}
              className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
              value={field.state.value ?? ""}
              onBlur={field.handleBlur}
              onChange={(e) =>
                field.handleChange(
                  e.target.value
                    ? (e.target.value as UserFilterValues["status"])
                    : undefined,
                )
              }
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
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

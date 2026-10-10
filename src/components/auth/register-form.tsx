"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useCallback } from "react";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterValues } from "@/validation/auth";

export function RegisterForm() {
  const { register, isRegistering, googleLogin } = useAuth();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    } satisfies RegisterValues,
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      register(value);
    },
  });

  const handleGoogleCredential = useCallback(
    (credential: string) => {
      googleLogin({ credential });
    },
    [googleLogin],
  );

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
        noValidate
      >
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

        <form.Field name="password">
          {(field) => (
            <Field
              label="Password"
              htmlFor={field.name}
              hint="Min 8 chars, with uppercase, lowercase, and a number."
              error={
                field.state.meta.isTouched && !field.state.meta.isValid
                  ? field.state.meta.errors[0]?.message
                  : undefined
              }
            >
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
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
              className="w-full"
              size="lg"
              disabled={!canSubmit || isSubmitting || isRegistering}
            >
              {isSubmitting || isRegistering
                ? "Creating account…"
                : "Create account"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <GoogleLoginButton
        onCredential={handleGoogleCredential}
        text="signup_with"
      />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
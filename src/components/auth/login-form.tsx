"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { authApi } from "@/api/auth";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ROLES } from "@/constants/roles";
import { ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginValues } from "@/validation/auth";

const DEMO_ACCOUNTS = [
  {
    role: ROLES.ADMIN,
    label: "Admin",
    email: "testeradmin@gmail.com",
    password: "Tester@admin12345",
  },
  {
    role: ROLES.REVIEWER,
    label: "Reviewer",
    email: "testerreviewer@gmail.com",
    password: "Tester@reviewer12345",
  },
  {
    role: ROLES.CANDIDATE,
    label: "Candidate",
    email: "testercandidate@gmail.com",
    password: "Tester@candidate12345",
  },
] as const;

export function LoginForm() {
  const { login, isLoggingIn, googleLogin } = useAuth();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" } satisfies LoginValues,
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      login(value);
    },
  });

  const handleGoogleCredential = useCallback(
    (credential: string) => {
      googleLogin({ credential });
    },
    [googleLogin],
  );

  const handleDemoLogin = async (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setDemoLoading(account.role);
    try {
      const res = await authApi.login({
        email: account.email,
        password: account.password,
      });
      setUser(res.data.user);
      toast.success(`Signed in as ${account.label}`);
      router.replace(ROLE_HOME[res.data.user.role]);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Demo login failed");
    } finally {
      setDemoLoading(null);
    }
  };

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
                autoComplete="current-password"
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

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!canSubmit || isSubmitting || isLoggingIn}
            >
              {isSubmitting || isLoggingIn ? "Signing in…" : "Login"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <GoogleLoginButton
        onCredential={handleGoogleCredential}
        text="signin_with"
      />

      <div className="space-y-3">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Demo Login
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.role}
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              disabled={demoLoading !== null}
              onClick={() => handleDemoLogin(account)}
            >
              {demoLoading === account.role ? "…" : account.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

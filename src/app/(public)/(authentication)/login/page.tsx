import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Assessly account.",
};

const LoginPage = () => {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Assessly account to continue."
    >
      <LoginForm />
    </AuthShell>
  );
};

export default LoginPage;

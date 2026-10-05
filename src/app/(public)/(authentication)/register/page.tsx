import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create your Assessly candidate account.",
};

const RegisterPage = () => {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Assessly to take assessments and track your progress."
    >
      <RegisterForm />
    </AuthShell>
  );
};

export default RegisterPage;
